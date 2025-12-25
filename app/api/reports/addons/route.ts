// app/api/reports/addons/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Reservation from "@/model/reservation";
import { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status"); // optional filter
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Base match for reservations
    const match: any = {
      addOns: { $exists: true, $ne: [] }, // only reservations with add-ons
    };

    if (status) {
      match.status = status;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      match.createdAt = { $gte: start, $lte: end };
    }

    const pipeline: PipelineStage[] = [
      { $match: match },

      // Unwind addOns array to process each item separately
      { $unwind: "$addOns" },

      // Optional: filter out invalid addOns
      { $match: { "addOns.addOn": { $exists: true } } },

      // Lookup addOn details
      {
        $lookup: {
          from: "addons", // assuming your collection name is "addons"
          localField: "addOns.addOn",
          foreignField: "_id",
          as: "addOnData",
        },
      },
      { $unwind: { path: "$addOnData", preserveNullAndEmptyArrays: false } },

      // Lookup user name
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },

      // Group by addOn
      {
        $group: {
          _id: "$addOnData._id",
          name: { $first: "$addOnData.name" },
          usageCount: {
            $sum: { $ifNull: ["$addOns.quantity", 1] },
          },
          totalRevenue: {
            $sum: {
              $multiply: [
                { $ifNull: ["$addOns.quantity", 1] },
                { $ifNull: ["$addOnData.flatPrice.amount", 0] },
              ],
            },
          },
          customers: {
            $push: {
              name: { $ifNull: ["$userData.name", "Unknown"] },
              quantity: { $ifNull: ["$addOns.quantity", 1] },
              spent: {
                $multiply: [
                  { $ifNull: ["$addOns.quantity", 1] },
                  { $ifNull: ["$addOnData.flatPrice.amount", 0] },
                ],
              },
            },
          },
          reservationCount: { $addToSet: "$_id" },
        },
      },

      // Calculate derived fields
      {
        $addFields: {
          reservationCount: { $size: "$reservationCount" },
          // Find top customer per add-on
          topCustomerObj: {
            $cond: [
              { $eq: [{ $size: "$customers" }, 0] },
              null,
              {
                $arrayElemAt: [
                  {
                    $sortArray: {
                      input: {
                        $map: {
                          input: "$customers",
                          as: "cust",
                          in: {
                            name: "$$cust.name",
                            count: "$$cust.quantity",
                            spent: "$$cust.spent",
                          },
                        },
                      },
                      sortBy: { count: -1 },
                    },
                  },
                  0,
                ],
              },
            ],
          },
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          usageCount: 1,
          totalRevenue: { $round: ["$totalRevenue", 2] },
          avgUsagePerReservation: {
            $cond: [
              { $eq: ["$reservationCount", 0] },
              0,
              {
                $round: [{ $divide: ["$usageCount", "$reservationCount"] }, 2],
              },
            ],
          },
          topCustomer: { $ifNull: ["$topCustomerObj.name", "N/A"] },
          topCustomerUsage: { $ifNull: ["$topCustomerObj.count", 0] },
        },
      },

      { $sort: { usageCount: -1 } },

      // Facet for pagination + summary
      {
        $facet: {
          metadata: [{ $count: "totalAddOns" }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],

          totalRevenue: [
            { $group: { _id: null, sum: { $sum: "$totalRevenue" } } },
          ],
          totalUsage: [{ $group: { _id: null, sum: { $sum: "$usageCount" } } }],
          totalReservationsWithAddOn: [
            {
              $group: {
                _id: null,
                uniqueReservations: { $addToSet: "$_id" }, // not perfect but close
              },
            },
            { $project: { count: { $size: "$uniqueReservations" } } },
          ],
          mostUsed: [{ $limit: 1 }],
          leastUsed: [{ $sort: { usageCount: 1 } }, { $limit: 1 }],
        },
      },
    ];

    const result = await Reservation.aggregate(pipeline);
    const facet = result[0] || {};

    const data = facet.data || [];
    const totalAddOns = facet.metadata[0]?.totalAddOns || 0;

    const totalReservationsWithAddOn =
      facet.totalReservationsWithAddOn?.[0]?.count || data.length; // fallback

    const summary = {
      totalAddOns,
      totalAddOnRevenue:
        Math.round((facet.totalRevenue[0]?.sum || 0) * 100) / 100,
      totalAddOnUsage: facet.totalUsage[0]?.sum || 0,
      avgAddOnsPerReservation:
        totalReservationsWithAddOn > 0
          ? Math.round(
              ((facet.totalUsage[0]?.sum || 0) / totalReservationsWithAddOn) *
                100
            ) / 100
          : 0,
      mostUsedAddOn: facet.mostUsed[0] || null,
      leastUsedAddOn: facet.leastUsed[0] || null,
    };

    return NextResponse.json({
      success: true,
      data,
      summary,
      pagination: {
        total: totalAddOns,
        page,
        limit,
        pages: Math.ceil(totalAddOns / limit),
      },
    });
  } catch (error: any) {
    console.error("Add-On report error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch add-on report",
      },
      { status: 500 }
    );
  }
}
