import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Reservation from "@/model/reservation";
import User from "@/model/user";
import AddOn from "@/model/addOn";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse } from "@/lib/api-response";
import { sendSMS } from "@/lib/sms";
import { scheduleReservationNotifications } from "@/lib/notification-scheduler";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const name = searchParams.get("name");
    const user = searchParams.get("user");
    const phone = searchParams.get("phone");
    const category = searchParams.get("category");
    const office = searchParams.get("office");
    const totalPriceMin = searchParams.get("totalPriceMin");
    const totalPriceMax = searchParams.get("totalPriceMax");
    const startDateRange = searchParams.get("startDateStart");
    const startDateRangeEnd = searchParams.get("startDateEnd");
    const endDateRange = searchParams.get("endDateStart");
    const endDateRangeEnd = searchParams.get("endDateEnd");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");

    const query: any = {};
    if (userId) query.user = userId;
    if (name) query.user = name;
    if (user) query.user = user;
    // Phone filtering is handled separately with aggregation
    if (category) query.category = category;
    if (office) query.office = office;
    if (status) query.status = status;
    if (totalPriceMin || totalPriceMax) {
      query.totalPrice = {};
      if (totalPriceMin) query.totalPrice.$gte = parseFloat(totalPriceMin);
      if (totalPriceMax) query.totalPrice.$lte = parseFloat(totalPriceMax);
    }
    if (startDateRange) {
      const start = new Date(startDateRange);
      start.setHours(0, 0, 0, 0);
      const end = new Date(startDateRangeEnd || startDateRange);
      end.setHours(23, 59, 59, 999);
      query.startDate = { $gte: start, $lte: end };
    }
    if (endDateRange) {
      const start = new Date(endDateRange);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDateRangeEnd || endDateRange);
      end.setHours(23, 59, 59, 999);
      query.endDate = { $gte: start, $lte: end };
    }

    let reservations;
    let total;

    if (phone) {
      // Use aggregation for phone filtering since user data is in separate collection
      const normalizedPhone = phone.replace(/\D/g, "");
      const aggregationPipeline: any[] = [
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $match: {
            ...query,
            "user.phoneData.phoneNumber": {
              $regex: normalizedPhone,
              $options: "i",
            },
          },
        },
        {
          $lookup: {
            from: "offices",
            localField: "office",
            foreignField: "_id",
            as: "office",
          },
        },
        {
          $unwind: { path: "$office", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "addons",
            localField: "addOns.addOn",
            foreignField: "_id",
            as: "addOns.addOn",
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ];

      reservations = await Reservation.aggregate(aggregationPipeline);

      // Get total count for phone filtering
      const countPipeline = [
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $match: {
            ...query,
            "user.phoneData.phoneNumber": {
              $regex: normalizedPhone,
              $options: "i",
            },
          },
        },
        {
          $count: "total",
        },
      ];

      const countResult = await Reservation.aggregate(countPipeline);
      total = countResult[0]?.total || 0;
    } else {
      // Use regular query for non-phone filters
      reservations = await Reservation.find(query)
        .populate("user", "-password")
        .populate("office")
        .populate("category")
        .populate({ path: "addOns.addOn", model: AddOn })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      total = await Reservation.countDocuments(query);
    }

    const pages = Math.ceil(total / limit);

    return successResponse({
      data: reservations,
      pagination: { page, limit, total, pages },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { userData, reservationData } = await req.json();

    let user;
    if (userData.userId) {
      user = await User.findById(userData.userId);
    } else {
      user = await User.findOne({
        "phoneData.phoneNumber": userData.phoneNumber,
      });

      if (!user) {
        const hashedPassword = await bcrypt.hash(userData.phoneNumber, 10);
        user = await User.create({
          name: userData.name,
          lastName: userData.lastName,
          emaildata: {
            emailAddress: userData.email,
            isVerified: false,
          },
          phoneData: {
            phoneNumber: userData.phoneNumber,
            isVerified: false,
          },
          password: hashedPassword,
        });
      }
    }
    console.log(reservationData, "reserve");

    const reservation = await Reservation.create({
      ...reservationData,
      user: user._id,
      totalPrice: reservationData.totalPrice || 0,
    });

    await reservation.populate([
      { path: "user", select: "-password" },
      { path: "office" },
      // { path: "addOns.addOn" },
    ]);

    const hasLicence =
      user.licenceAttached?.front && user.licenceAttached?.back;
    const licenceMessage = hasLicence ? "" : " Add licence to dashboard.";

    // Send creation SMS
    try {
      await sendSMS(
        user.phoneData.phoneNumber.replace("+", ""),
        `Dear ${user.name}, reservation created, pending review.${licenceMessage} SuccessVanHire.co.uk/register`
      );
    } catch (error) {
      console.log(
        "Creation SMS Error:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }

    // Only schedule reminders, don't send confirmation yet
    try {
      await scheduleReservationNotifications(reservation._id.toString());
    } catch (error) {
      console.log(
        "Notification scheduling error:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }

    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      try {
        await sendSMS(
          admin.phoneData.phoneNumber,
          "You have a new reservation. Check the admin dashboard."
        );
      } catch (error) {
        console.log(
          `Admin SMS Error (${admin.phoneData.phoneNumber}):`,
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    return successResponse(reservation, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const reservation = await Reservation.findByIdAndDelete(userId);
    if (!reservation) return errorResponse("Reservation not found", 404);
    return successResponse({ message: "Reservation deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}
