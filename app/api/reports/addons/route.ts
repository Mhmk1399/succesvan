import connect from "@/lib/data";
import Reservation from "@/model/reservation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();

    const reservations = await Reservation.find()
      .populate("user", "name")
      .populate("addOns.addOn")
      .lean();

    const addOnStats: { [key: string]: any } = {};
    const customerAddOnUsage: any[] = [];
    let totalAddOnCount = 0;

    reservations.forEach((res: any) => {
      if (res.addOns && Array.isArray(res.addOns)) {
        res.addOns.forEach((item: any) => {
          const addOn = item.addOn;
          if (addOn) {
            const addOnId = addOn._id.toString();
            const addOnName = addOn.name;

            if (!addOnStats[addOnId]) {
              addOnStats[addOnId] = {
                _id: addOnId,
                name: addOnName,
                usageCount: 0,
                totalRevenue: 0,
                customerUsage: {},
              };
            }

            const quantity = item.quantity || 1;
            const price = addOn.flatPrice || 0;
            const revenue = price * quantity;

            addOnStats[addOnId].usageCount += quantity;
            addOnStats[addOnId].totalRevenue += revenue;
            totalAddOnCount += quantity;

            const customerName = res.user?.name || "Unknown";
            if (!addOnStats[addOnId].customerUsage[customerName]) {
              addOnStats[addOnId].customerUsage[customerName] = {
                count: 0,
                spent: 0,
              };
            }
            addOnStats[addOnId].customerUsage[customerName].count += quantity;
            addOnStats[addOnId].customerUsage[customerName].spent += revenue;

            customerAddOnUsage.push({
              customerName,
              addOnName,
              usageCount: quantity,
              totalSpent: revenue,
            });
          }
        });
      }
    });

    const addOnsArray = Object.values(addOnStats).map((addon: any) => {
      const topCustomer = Object.entries(addon.customerUsage).sort(
        (a: any, b: any) => b[1].count - a[1].count
      )[0] as [string, { count: number; spent: number }] | undefined;

      return {
        _id: addon._id,
        name: addon.name,
        usageCount: addon.usageCount,
        totalRevenue: addon.totalRevenue,
        avgUsagePerReservation:
          reservations.length > 0 ? addon.usageCount / reservations.length : 0,
        topCustomer: topCustomer ? topCustomer[0] : "N/A",
        topCustomerUsage: topCustomer ? topCustomer[1].count : 0,
      };
    });

    const sortedByUsage = [...addOnsArray].sort(
      (a: any, b: any) => b.usageCount - a.usageCount
    );

    const summary = {
      totalAddOns: addOnsArray.length,
      totalAddOnRevenue: addOnsArray.reduce(
        (sum: number, a: any) => sum + a.totalRevenue,
        0
      ),
      avgAddOnsPerReservation:
        reservations.length > 0 ? totalAddOnCount / reservations.length : 0,
      mostUsedAddOn: sortedByUsage[0] || null,
      leastUsedAddOn: sortedByUsage[sortedByUsage.length - 1] || null,
    };

    return NextResponse.json({
      success: true,
      data: {
        addOns: sortedByUsage,
        customerUsage: customerAddOnUsage.sort(
          (a, b) => b.totalSpent - a.totalSpent
        ),
        summary,
      },
    });
  } catch (error) {
    console.error("Error fetching add-on report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}
