import Notification from "@/model/notification";
import Reservation from "@/model/reservation";
import User from "@/model/user";
import Office from "@/model/office";
import { sendSMS } from "@/lib/sms";

export async function scheduleReservationNotifications(reservationId: string) {
  const reservation = await Reservation.findById(reservationId)
    .populate({
      path: "user",
      model: User,
      select: "phoneData",
    })
    .populate({
      path: "office",
      model: Office,
    });

  if (!reservation) throw new Error("Reservation not found");

  const user = reservation.user as any;
  const office = reservation.office as any;
  const phoneNumber = user.phoneData?.phoneNumber;

  if (!phoneNumber) return;

  const startDate = new Date(reservation.startDate);
  const reminderTime = new Date(startDate.getTime() - 3 * 60 * 60 * 1000); // 3 hours before
  const now = new Date();

  // Schedule reminders for all pickup times within 3 hours (every 15 min)
  const pickupTimes = [
    startDate,
    new Date(startDate.getTime() + 15 * 60 * 1000),
    new Date(startDate.getTime() + 30 * 60 * 1000),
    new Date(startDate.getTime() + 45 * 60 * 1000),
  ];

  for (const pickupTime of pickupTimes) {
    const reminderFor = new Date(pickupTime.getTime() - 3 * 60 * 60 * 1000);
    
    if (reminderFor > now) {
      await Notification.create({
        type: "reservation_reminder",
        reservation: reservationId,
        user: user._id,
        phoneNumber,
        message: `Reminder: Van pickup in 3hrs at ${office.name}. Time: ${pickupTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} ${pickupTime.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}. SuccessVanHire.co.uk`,
        scheduledFor: reminderFor,
      });
    }
  }
}

export async function sendStatusNotification(
  reservationId: string,
  status: "confirmed" | "canceled" | "delivered" | "completed"
) {
  const reservation = await Reservation.findById(reservationId)
    .populate("user")
    .populate("office")
    .populate("vehicle");

  if (!reservation) return;

  const user = reservation.user as any;
  const office = reservation.office as any;
  const vehicle = reservation.vehicle as any;
  const phoneNumber = user.phoneData?.phoneNumber;

  if (!phoneNumber) return;

  const vehicleInfo = vehicle?.number ? ` Vehicle number: ${vehicle.number}` : "";

  const messages = {
    confirmed: `Reservation confirmed! Pickup: ${new Date(reservation.startDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} at ${office.name}. SuccessVanHire.co.uk`,
    canceled: `Reservation canceled. Questions? Contact us. SuccessVanHire.co.uk or call +44 20 3011 1198`,
    delivered: `Vehicle delivered! ${vehicleInfo} Return by ${new Date(reservation.endDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}.  SuccessVanHire.co.uk `,
    completed: `Thank you for choosing SuccessVanHire.co.uk! rate your experience at uk.trustpilot.com/review/successvanhire.com`,
  };

  // Send SMS immediately, don't save to database
  try {
    await sendSMS(phoneNumber.replace("+", ""), messages[status]);
  } catch (error) {
    console.log(
      `Status SMS Error (${status}):`,
      error instanceof Error ? error.message : "Unknown error"
    );
  }

  // Delete old pickup reminders and create return reminders when delivered
  if (status === "delivered") {
    await Notification.deleteMany({
      reservation: reservationId,
      status: "pending",
      type: "reservation_reminder",
    });

    // Create return reminders (3 hours before endDate)
    const endDate = new Date(reservation.endDate);
    const now = new Date();
    const returnTimes = [
      endDate,
      new Date(endDate.getTime() + 15 * 60 * 1000),
      new Date(endDate.getTime() + 30 * 60 * 1000),
      new Date(endDate.getTime() + 45 * 60 * 1000),
    ];

    for (const returnTime of returnTimes) {
      const reminderFor = new Date(returnTime.getTime() - 3 * 60 * 60 * 1000);
      if (reminderFor > now) {
        await Notification.create({
          type: "reservation_reminder",
          reservation: reservationId,
          user: user._id,
          phoneNumber,
          message: `Reminder: Van return in 3hrs at ${office?.name || 'office'}. Time: ${returnTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} ${returnTime.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}. SuccessVanHire.co.uk`,
          scheduledFor: reminderFor,
        });
        console.log(`[NOTIF] Created return reminder for ${reservationId} at ${reminderFor}`);
      }
    }
  }

  // Cancel pending reminders if canceled
  if (status === "canceled") {
    await Notification.deleteMany({
      reservation: reservationId,
      status: "pending",
      type: "reservation_reminder",
    });
  }
}

export async function sendReservationEditedNotification(reservationId: string) {
  const reservation = await Reservation.findById(reservationId)
    .populate("user")
    .populate("office");

  if (!reservation) return;

  const user = reservation.user as any;
  const phoneNumber = user.phoneData?.phoneNumber;

  if (!phoneNumber) return;

  try {
    await sendSMS(
      phoneNumber.replace("+", ""),
      `Your reservation updated by admin. Check details in dashboard. SuccessVanHire.co.uk`
    );
  } catch (error) {
    console.log(
      "Reservation edited SMS Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
