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

    const query: any = { category: { $ne: null } };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    const allCategoryReports = await Reservation.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalPrice: { $sum: "$totalPrice" },
          avgPrice: { $avg: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      { $unwind: { path: "$categoryData", preserveNullAndEmptyArrays: false } },
      {
        $project: {
          _id: 1,
          categoryName: "$categoryData.name",
          count: 1,
          totalPrice: { $round: ["$totalPrice", 2] },
          avgPrice: { $round: ["$avgPrice", 2] },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const mostUsed = allCategoryReports[0] || null;
    const leastUsed = allCategoryReports[allCategoryReports.length - 1] || null;
    const totalRevenue = allCategoryReports.reduce(
      (sum, cat) => sum + (cat.totalPrice || 0),
      0
    );
    const totalReservations = allCategoryReports.reduce(
      (sum, cat) => sum + (cat.count || 0),
      0
    );

    // If pagination params not provided, return all data
    if (!page && !limit) {
      return successResponse({
        data: allCategoryReports,
        summary: {
          mostUsed,
          leastUsed,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalReservations,
          categoriesCount: allCategoryReports.length,
        },
      });
    }

    // With pagination
    const pageNum = parseInt(page || "1");
    const limitNum = parseInt(limit || "10");
    const skip = (pageNum - 1) * limitNum;
    const paginatedData = allCategoryReports.slice(skip, skip + limitNum);

    return successResponse({
      data: paginatedData,
      summary: {
        mostUsed,
        leastUsed,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalReservations,
        categoriesCount: allCategoryReports.length,
      },
      pagination: {
        total: allCategoryReports.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(allCategoryReports.length / limitNum),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return errorResponse(message, 500);
  }
}
