import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Reservation from "@/model/reservation";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    const query = userId ? { user: userId } : {};
    const reservations = await Reservation.find(query)
      .populate("user", "-password")
      .populate("office")
      .populate("category","-image");
    return successResponse(reservations);
  } catch (error: any) {
    return errorResponse(error.message, 500);
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

    return successResponse(reservation, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
export async function DELETE(
  req: NextRequest,
  
) {
  try {
    await connect();
     const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
   
    const reservation = await Reservation.findByIdAndDelete(userId);
    if (!reservation) return errorResponse("Reservation not found", 404);
    return successResponse({ message: "Reservation deleted" });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}