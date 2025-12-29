import { NextRequest, NextResponse } from "next/server";
import Ticket from "@/model/ticket";
import connect from "@/lib/data";
import jwt from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connect();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    const userRole = decoded.role;

    const ticket = await Ticket.findById(id).populate("userId", "name lastName email");

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Check if user owns the ticket or is admin
    if (userRole !== "admin" && ticket.userId._id.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connect();

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    const userRole = decoded.role;

    const { message, status } = await request.json();

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Check if user owns the ticket or is admin
    if (userRole !== "admin" && ticket.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (message) {
      ticket.messages.push({
        sender: userId,
        content: message,
        timestamp: new Date(),
      });
    }

    if (status && userRole === "admin") {
      ticket.status = status;
    }

    ticket.updatedAt = new Date();
    await ticket.save();

    const updatedTicket = await Ticket.findById(id).populate("userId", "name lastName email");

    return NextResponse.json({ success: true, data: updatedTicket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}