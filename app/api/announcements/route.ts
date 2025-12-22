import connect from "@/lib/data";
import { successResponse, errorResponse } from "@/lib/api-response";
import Announcement from "@/model/announcement";

export async function GET() {
  try {
    await connect();
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return successResponse(announcements);
  } catch (error) {
    console.log("Error fetching announcements:", error);
    return errorResponse("Failed to fetch announcements");
  }
}

export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();
    const { text, link, textColor, backgroundColor, isActive } = body;

    if (!text?.trim()) {
      return errorResponse("Text is required");
    }

    const announcement = new Announcement({
      text,
      link: link || "",
      textColor: textColor || "#ffffff",
      backgroundColor: backgroundColor || "#fe9a00",
      isActive: isActive !== undefined ? isActive : true,
    });

    await announcement.save();
    return successResponse(announcement);
  } catch (error) {
    console.log("Error creating announcement:", error);
    return errorResponse("Failed to create announcement");
  }
}
