import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Reservation from "@/model/reservation";
import { successResponse, errorResponse } from "@/lib/api-response";
import { sendStatusNotification } from "@/lib/notification-scheduler";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const reservation = await Reservation.findById(id)
      .populate("user", "-password")
      .populate("office")
      .populate("vehicle")
      .populate("addOns.addOn");
    if (!reservation) return errorResponse("Reservation not found", 404);
    return successResponse(reservation);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const body = await req.json();
    
    const oldReservation = await Reservation.findById(id);
    
    const reservation = await Reservation.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate("user", "-password")
      .populate("office")
      .populate("category")
      .populate({
        path: "vehicle",
        select: "title number",
      })
      .populate("addOns.addOn");
    if (!reservation) return errorResponse("Reservation not found", 404);
    
    // Send admin edited notification if flagged
    if (body.adminEdited) {
      try {
        const { sendReservationEditedNotification } = await import("@/lib/notification-scheduler");
        await sendReservationEditedNotification(id);
      } catch (error) {
        console.log(
          "Admin edit notification error:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }
    
    // Send SMS to admin if user edited
    if (body.userEdited) {
      try {
        const User = (await import("@/model/user")).default;
        const admins = await User.find({ role: "admin" });
        const { sendSMS } = await import("@/lib/sms");
        
        const customerPhone = (reservation.user as any)?.phoneData?.phoneNumber || "Unknown";
        
        for (const admin of admins) {
          if (admin.phoneData?.phoneNumber) {
            try {
              await sendSMS(
                admin.phoneData.phoneNumber.replace("+", ""),
                `Customer ${customerPhone} edited reservation. Check dashboard. SuccessVanHire.co.uk`
              );
            } catch (smsError) {
              console.log(`Admin SMS Error (${admin.phoneData.phoneNumber}):`, smsError);
            }
          }
        }
      } catch (error) {
        console.log(
          "User edit admin notification error:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }
    
    // Send status notification if status changed
    if (oldReservation?.status !== body.status && body.status) {
      const validStatuses = ["confirmed", "canceled", "delivered", "completed"];
      if (validStatuses.includes(body.status)) {
        try {
          await sendStatusNotification(id, body.status);
        } catch (error) {
          console.log(
            "Status notification error:",
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      }
    }
    
    return successResponse(reservation);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 400);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) return errorResponse("Reservation not found", 404);
    return successResponse({ message: "Reservation deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}
