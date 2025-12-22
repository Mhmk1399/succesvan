import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Reservation from "@/model/reservation";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    const query: any = { office: { $ne: null } };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    const allOfficeReports = await Reservation.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$office",
          count: { $sum: 1 },
          totalPrice: { $sum: "$totalPrice" },
          avgPrice: { $avg: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "offices",
          localField: "_id",
          foreignField: "_id",
          as: "officeData",
        },
      },
      { $unwind: { path: "$officeData", preserveNullAndEmptyArrays: false } },
      {
        $project: {
          _id: 1,
          officeName: "$officeData.name",
          count: 1,
          totalPrice: { $round: ["$totalPrice", 2] },
          avgPrice: { $round: ["$avgPrice", 2] },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const mostUsed = allOfficeReports[0] || null;
    const leastUsed = allOfficeReports[allOfficeReports.length - 1] || null;
    const totalRevenue = allOfficeReports.reduce(
      (sum, office) => sum + (office.totalPrice || 0),
      0
    );
    const totalReservations = allOfficeReports.reduce(
      (sum, office) => sum + (office.count || 0),
      0
    );

    if (!page && !limit) {
      return successResponse({
        data: allOfficeReports,
        summary: {
          mostUsed,
          leastUsed,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalReservations,
          officesCount: allOfficeReports.length,
        },
      });
    }

    const pageNum = parseInt(page || "1");
    const limitNum = parseInt(limit || "10");
    const skip = (pageNum - 1) * limitNum;
    const paginatedData = allOfficeReports.slice(skip, skip + limitNum);

    return successResponse({
      data: paginatedData,
      summary: {
        mostUsed,
        leastUsed,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalReservations,
        officesCount: allOfficeReports.length,
      },
      pagination: {
        total: allOfficeReports.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(allOfficeReports.length / limitNum),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}
