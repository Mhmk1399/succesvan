import connect from "@/lib/data";
import Reservation from "@/model/reservation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const reservations = await Reservation.find()
      .populate("user", "name")
      .populate({
        path: "vehicle",
        populate: { path: "category", select: "name" },
      })
      .lean();

    const data = reservations
      .map((res: any) => ({
        _id: res._id,
        customerName: res.user?.name || "Unknown",
        categoryName: res.vehicle?.category?.name || "Unknown",
        totalPrice: res.totalPrice || 0,
        startDate: res.startDate,
        endDate: res.endDate,
        status: res.status,
      }))
      .sort((a: any, b: any) => b.totalPrice - a.totalPrice);

    const customerStats = data.reduce((acc: any, res: any) => {
      if (!acc[res.customerName]) {
        acc[res.customerName] = { count: 0, totalPrice: 0 };
      }
      acc[res.customerName].count += 1;
      acc[res.customerName].totalPrice += res.totalPrice;
      return acc;
    }, {});

    const summary = {
      totalRevenue: data.reduce(
        (sum: number, res: any) => sum + res.totalPrice,
        0
      ),
      totalReservations: data.length,
      avgPrice:
        data.length > 0
          ? Math.round(
              data.reduce((sum: number, res: any) => sum + res.totalPrice, 0) /
                data.length
            )
          : 0,
      topReservation: data[0] || null,
      customerStats,
    };

    return NextResponse.json({
      success: true,
      data: {
        data,
        summary,
      },
    });
  } catch (error) {
    console.error("Error fetching reservation report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}
