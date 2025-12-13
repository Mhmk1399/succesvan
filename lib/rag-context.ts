/**
 * RAG (Retrieval-Augmented Generation) Context Builder
 * Fetches comprehensive data about offices, categories, and availability
 * to provide rich context to the conversational AI
 */

import Office from "@/model/office";
import Category from "@/model/category";
import Reservation from "@/model/reservation";
import Type from "@/model/type";

interface OfficeData {
  _id: string;
  name: string;
  address: string;
  phone: string;
  workingTime: Array<{
    day: string;
    isOpen: boolean;
    startTime?: string;
    endTime?: string;
  }>;
  specialDays: Array<{
    month: number;
    day: number;
    isOpen: boolean;
    reason?: string;
  }>;
}

interface CategoryData {
  _id: string;
  name: string;
  description?: string;
  fuel: string;
  gear: string;
  seats: number;
  doors: number;
  pricingTiers: Array<{
    minHours: number;
    maxHours: number;
    pricePerHour: number;
  }>;
}

/**
 * Build comprehensive RAG context for the AI
 */
export async function buildRAGContext(
  offices: OfficeData[],
  categories: CategoryData[],
  startDate?: string,
  endDate?: string,
  officeId?: string
): Promise<string> {
  console.log("🔍 [RAG] Building context for AI");

  let context = "# COMPREHENSIVE BOOKING INFORMATION\n\n";

  // ==================== OFFICES ====================
  context += "## AVAILABLE OFFICES:\n\n";
  for (const office of offices) {
    context += `### ${office.name.toUpperCase()}\n`;
    context += `- ID: ${office._id}\n`;
    context += `- Address: ${office.address}\n`;
    context += `- Phone: ${office.phone}\n`;
    
    // Working hours
    context += `- Working Hours:\n`;
    const openDays = office.workingTime.filter(wt => wt.isOpen);
    if (openDays.length > 0) {
      for (const day of openDays) {
        context += `  * ${day.day}: ${day.startTime} - ${day.endTime}\n`;
      }
    } else {
      context += `  * Hours not set\n`;
    }
    
    // Special days
    if (office.specialDays && office.specialDays.length > 0) {
      context += `- Special Days:\n`;
      for (const special of office.specialDays) {
        const status = special.isOpen ? "Open" : "Closed";
        context += `  * ${special.month}/${special.day}: ${status}${special.reason ? ` (${special.reason})` : ""}\n`;
      }
    }
    
    context += "\n";
  }

  // ==================== CATEGORIES ====================
  context += "## AVAILABLE VEHICLE CATEGORIES:\n\n";
  for (const category of categories) {
    context += `### ${category.name.toUpperCase()}\n`;
    context += `- ID: ${category._id}\n`;
    if (category.description) {
      context += `- Description: ${category.description}\n`;
    }
    context += `- Fuel Type: ${category.fuel}\n`;
    context += `- Transmission: ${category.gear}\n`;
    context += `- Seats: ${category.seats}\n`;
    context += `- Doors: ${category.doors}\n`;
    
    // Pricing information
    if (category.pricingTiers && category.pricingTiers.length > 0) {
      context += `- Pricing:\n`;
      for (const tier of category.pricingTiers) {
        const maxHours = tier.maxHours === Infinity ? "∞" : tier.maxHours;
        context += `  * ${tier.minHours}-${maxHours} hours: $${tier.pricePerHour}/hour\n`;
      }
    }
    
    context += "\n";
  }

  // ==================== AVAILABILITY ====================
  if (startDate && endDate && officeId) {
    context += "## AVAILABILITY INFORMATION:\n\n";
    
    try {
      // Fetch existing reservations for the date range
      const existingReservations = await Reservation.find({
        office: officeId,
        $or: [
          {
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) },
          },
        ],
      }).populate("category");

      if (existingReservations.length > 0) {
        context += `Found ${existingReservations.length} existing reservations in this time period:\n`;
        for (const res of existingReservations) {
          const cat = (res.category as any)?.name || "Unknown";
          context += `- ${cat}: ${new Date(res.startDate).toLocaleDateString()} to ${new Date(res.endDate).toLocaleDateString()}\n`;
        }
      } else {
        context += `No conflicting reservations found for ${startDate} to ${endDate}.\n`;
      }
    } catch (error) {
      console.error("❌ [RAG] Error fetching availability:", error);
      context += "Availability information not available at this time.\n";
    }
    
    context += "\n";
  }

  // ==================== INSTRUCTIONS ====================
  context += "## IMPORTANT INSTRUCTIONS:\n\n";
  context += "- Use the office IDs (like '692c373285e43be43ace5615') when extracting office data, NOT the names\n";
  context += "- Use the category IDs when extracting category data\n";
  context += "- If user asks about hours, tell them from the working hours above\n";
  context += "- If user asks about special days or holidays, reference the special days section\n";
  context += "- When listing options, mention the key features (fuel type, seats, pricing)\n";
  context += "- If dates conflict with existing reservations, inform the user\n";
  context += "- Today's date is " + new Date().toISOString().split("T")[0] + "\n";

  console.log("✅ [RAG] Context built, length:", context.length, "characters");
  
  return context;
}

/**
 * Fetch full office data with all details
 */
export async function fetchFullOffices(): Promise<OfficeData[]> {
  const offices = await Office.find({}).lean();
  
  return offices.map((office: any) => ({
    _id: office._id.toString(),
    name: office.name,
    address: office.address,
    phone: office.phone,
    workingTime: office.workingTime || [],
    specialDays: office.specialDays || [],
  }));
}

/**
 * Fetch full category data with all details
 */
export async function fetchFullCategories(): Promise<CategoryData[]> {
  const categories = await Category.find({}).populate("type").lean();
  
  return categories.map((category: any) => ({
    _id: category._id.toString(),
    name: category.name,
    description: category.description,
    fuel: category.fuel,
    gear: category.gear,
    seats: category.seats,
    doors: category.doors,
    pricingTiers: category.pricingTiers || [],
  }));
}
