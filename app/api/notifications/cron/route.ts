import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Notification from "@/model/notification";
import { sendSMS } from "@/lib/sms";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return errorResponse("Unauthorized", 401);
    }

    await connect();

    // Find notifications that are due
    const dueNotifications = await Notification.find({
      status: "pending",
      scheduledFor: { $lte: new Date() },
    }).limit(50); // Process 50 at a time

    const results = {
      processed: 0,
      sent: 0,
      failed: 0,
      deleted: 0,
    };

    for (const notification of dueNotifications) {
      results.processed++;

      try {
        await sendSMS(
          notification.phoneNumber.replace("+", ""),
          notification.message
        );

        // Delete reminder notifications after sending
        if (notification.type === "reservation_reminder") {
          await notification.deleteOne();
          results.deleted++;
        } else {
          notification.status = "sent";
          notification.sentAt = new Date();
          await notification.save();
        }
        results.sent++;
      } catch (error) {
        notification.status = "failed";
        notification.error =
          error instanceof Error ? error.message : "Unknown error";
        await notification.save();
        results.failed++;
      }
    }

    return successResponse(results);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}
