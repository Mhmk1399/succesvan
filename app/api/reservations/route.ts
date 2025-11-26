import { NextRequest } from "next/server";
import connect from "@/lib/data";
import Reservation from "@/model/reservation";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    await connect();
    const reservations = await Reservation.find()
      .populate("user", "-password")
      .populate("office")
      .populate("vehicle")
      .populate("addOns.addOn");
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
      user = await User.findOne({ "phoneData.phoneNumber": userData.phoneNumber });
      
      if (!user) {
        const hashedPassword = await bcrypt.hash(userData.phoneNumber, 10);
        user = await User.create({
          name: userData.name,
          lastName: userData.lastName,
          emaildata: { emailAddress: userData.email, isVerified: false },
          phoneData: { phoneNumber: userData.phoneNumber, isVerified: false },
          password: hashedPassword
        });
      }
    }
    
    const reservation = await Reservation.create({
      ...reservationData,
      user: user._id
    });
    
    await reservation.populate([
      { path: "user", select: "-password" },
      { path: "office" },
      { path: "vehicle" },
      { path: "addOns.addOn" }
    ]);
    
    return successResponse(reservation, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}
