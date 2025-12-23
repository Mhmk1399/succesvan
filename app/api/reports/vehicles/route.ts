import connect from "@/lib/data";
import Vehicle from "@/model/vehicle";
import Reservation from "@/model/reservation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const vehicles = await Vehicle.find()
      .populate("category", "name")
      .populate("office", "name")
      .lean();

    const vehicleReports = await Promise.all(
      vehicles.map(async (vehicle) => {
        const reservations = await Reservation.find({
          vehicle: vehicle._id,
        })
          .populate("user", "name")
          .lean();

        return {
          ...vehicle,
          reservationCount: reservations.length,
          reservations: reservations.map((res) => ({
            _id: res._id,
            startDate: res.startDate,
            endDate: res.endDate,
            user: res.user,
            status: res.status,
          })),
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: vehicleReports,
    });
  } catch (error) {
    console.error("Error fetching vehicle report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}
