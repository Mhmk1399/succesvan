import Notification from "@/model/notification";
import Reservation from "@/model/reservation";
import User from "@/model/user";
import Office from "@/model/office";

export async function scheduleReservationNotifications(reservationId: string) {
  const reservation = await Reservation.findById(reservationId)
    .populate("user")
    .populate("office");

  if (!reservation) throw new Error("Reservation not found");

  const user = reservation.user as any;
  const office = reservation.office as any;
  const phoneNumber = user.phoneData?.phoneNumber;

  if (!phoneNumber) return;

  const startDate = new Date(reservation.startDate);
  const reminderTime = new Date(startDate.getTime() - 3 * 60 * 60 * 1000); // 3 hours before

  // Only schedule if reminder time is in the future
  if (reminderTime > new Date()) {
    await Notification.create({
      type: "reservation_reminder",
      reservation: reservationId,
      user: user._id,
      phoneNumber,
      message: `Reminder: Your van pickup is in 3 hours at ${office.name}. Pickup time: ${startDate.toLocaleString()}. SuccessVanHire - successvanhire.co.uk`,
      scheduledFor: reminderTime,
    });
  }
}

export async function scheduleConfirmationNotification(reservationId: string) {
  const reservation = await Reservation.findById(reservationId)
    .populate("user")
    .populate("office");

  if (!reservation) return;

  const user = reservation.user as any;
  const office = reservation.office as any;
  const phoneNumber = user.phoneData?.phoneNumber;

  if (!phoneNumber) return;

  await Notification.create({
    type: "reservation_confirmed",
    reservation: reservationId,
    user: user._id,
    phoneNumber,
    message: `Your reservation is confirmed! Pickup: ${new Date(
      reservation.startDate
    ).toLocaleString()} at ${office.name}. SuccessVanHire - successvanhire.co.uk`,
    scheduledFor: new Date(), // Send immediately
  });
}

export async function scheduleCancellationNotification(reservationId: string) {
  const reservation = await Reservation.findById(reservationId).populate("user");

  if (!reservation) return;

  const user = reservation.user as any;
  const phoneNumber = user.phoneData?.phoneNumber;

  if (!phoneNumber) return;

  await Notification.create({
    type: "reservation_canceled",
    reservation: reservationId,
    user: user._id,
    phoneNumber,
    message: `Your reservation has been canceled. If you have questions, contact us. SuccessVanHire - successvanhire.co.uk`,
    scheduledFor: new Date(), // Send immediately
  });

  // Cancel pending reminders
  await Notification.updateMany(
    {
      reservation: reservationId,
      status: "pending",
      type: "reservation_reminder",
    },
    { status: "failed", error: "Reservation canceled" }
  );
}
