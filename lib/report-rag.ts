/**
 * REPORT RAG (Retrieval-Augmented Generation) System
 * 
 * This module fetches and structures ALL business intelligence reports for AI analysis:
 * - Add-ons Report: Usage statistics, revenue, customer preferences
 * - Categories Report: Vehicle type performance, booking trends
 * - Customers Report: User behavior, retention, spending patterns
 * - Offices Report: Location performance, revenue distribution
 * - Reservations Report: Booking trends, revenue analysis
 * - Vehicles Report: Individual vehicle utilization, maintenance needs
 * 
 * Purpose: Provide comprehensive business analytics context for AI-powered insights
 */

import connect from "@/lib/data";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AddOnReportData {
  addOns: Array<{
    _id: string;
    name: string;
    usageCount: number;
    totalRevenue: number;
    avgUsagePerReservation: number;
    topCustomer: string;
    topCustomerUsage: number;
  }>;
  customerUsage: Array<{
    customerName: string;
    addOnName: string;
    usageCount: number;
    totalSpent: number;
  }>;
  summary: {
    totalAddOns: number;
    totalAddOnRevenue: number;
    avgAddOnsPerReservation: number;
    reservationsWithAddOns: number;
    totalReservationsForAddOns: number;
    mostUsedAddOn: any;
    leastUsedAddOn: any;
  };
}

export interface CategoryReportData {
  data: Array<{
    _id: string;
    categoryName: string;
    count: number;
    totalPrice: number;
    avgPrice: number;
  }>;
  summary: {
    mostUsed: any;
    leastUsed: any;
    totalRevenue: number;
    totalReservations: number;
    categoriesCount: number;
  };
}

export interface CustomerReportData {
  data: Array<{
    _id: string;
    name: string;
    reservationCount: number;
    totalPrice: number;
    createdAt: Date;
  }>;
  summary: {
    totalCustomers: number;
    totalRevenue: number;
    avgReservationsPerCustomer: number;
    newUsersThisMonth: number;
    usersThisMonth: number;
    mostReserved: any;
    leastReserved: any;
  };
}

export interface OfficeReportData {
  data: Array<{
    _id: string;
    officeName: string;
    count: number;
    totalPrice: number;
    avgPrice: number;
  }>;
  summary: {
    mostUsed: any;
    leastUsed: any;
    totalRevenue: number;
    totalReservations: number;
    officesCount: number;
  };
}

export interface ReservationReportData {
  data: Array<{
    _id: string;
    customerName: string;
    categoryName: string;
    totalPrice: number;
    startDate: Date;
    endDate: Date;
    status: string;
  }>;
  summary: {
    totalRevenue: number;
    totalReservations: number;
    avgPrice: number;
    topReservation: any;
    customerStats: Record<string, { count: number; totalPrice: number }>;
  };
}

export interface VehicleReportData {
  data: Array<{
    _id: string;
    title: string;
    number: string;
    category: { name: string };
    office: { name: string };
    reservationCount: number;
    reservations: Array<{
      _id: string;
      startDate: Date;
      endDate: Date;
      user: any;
      status: string;
    }>;
  }>;
}

export interface ComprehensiveReportRAG {
  addOns: AddOnReportData;
  categories: CategoryReportData;
  customers: CustomerReportData;
  offices: OfficeReportData;
  reservations: ReservationReportData;
  vehicles: VehicleReportData;
  metadata: {
    generatedAt: Date;
    reportPeriod?: { startDate: string; endDate: string };
  };
}

// ============================================================================
// DATA FETCHERS
// ============================================================================

/**
 * Fetch add-ons report data
 * Provides: Usage statistics, revenue analysis, customer preferences
 */
async function fetchAddOnsReport(startDate?: string, endDate?: string): Promise<AddOnReportData> {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/addons`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await fetch(url);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("❌ [Report RAG] Failed to fetch add-ons report:", error);
    return {
      addOns: [],
      customerUsage: [],
      summary: {
        totalAddOns: 0,
        totalAddOnRevenue: 0,
        avgAddOnsPerReservation: 0,
        reservationsWithAddOns: 0,
        totalReservationsForAddOns: 0,
        mostUsedAddOn: null,
        leastUsedAddOn: null,
      },
    };
  }
}

/**
 * Fetch categories report data
 * Provides: Vehicle type performance, booking trends, revenue by category
 */
async function fetchCategoriesReport(startDate?: string, endDate?: string): Promise<CategoryReportData> {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/categories`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await fetch(url);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("❌ [Report RAG] Failed to fetch categories report:", error);
    return {
      data: [],
      summary: {
        mostUsed: null,
        leastUsed: null,
        totalRevenue: 0,
        totalReservations: 0,
        categoriesCount: 0,
      },
    };
  }
}

/**
 * Fetch customers report data
 * Provides: User behavior, retention metrics, spending patterns
 */
async function fetchCustomersReport(): Promise<CustomerReportData> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/customers`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("❌ [Report RAG] Failed to fetch customers report:", error);
    return {
      data: [],
      summary: {
        totalCustomers: 0,
        totalRevenue: 0,
        avgReservationsPerCustomer: 0,
        newUsersThisMonth: 0,
        usersThisMonth: 0,
        mostReserved: null,
        leastReserved: null,
      },
    };
  }
}

/**
 * Fetch offices report data
 * Provides: Location performance, revenue distribution, booking patterns
 */
async function fetchOfficesReport(startDate?: string, endDate?: string): Promise<OfficeReportData> {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/offices`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await fetch(url);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("❌ [Report RAG] Failed to fetch offices report:", error);
    return {
      data: [],
      summary: {
        mostUsed: null,
        leastUsed: null,
        totalRevenue: 0,
        totalReservations: 0,
        officesCount: 0,
      },
    };
  }
}

/**
 * Fetch reservations report data
 * Provides: Booking trends, revenue analysis, customer spending
 */
async function fetchReservationsReport(startDate?: string, endDate?: string): Promise<ReservationReportData> {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/reservations`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await fetch(url);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("❌ [Report RAG] Failed to fetch reservations report:", error);
    return {
      data: [],
      summary: {
        totalRevenue: 0,
        totalReservations: 0,
        avgPrice: 0,
        topReservation: null,
        customerStats: {},
      },
    };
  }
}

/**
 * Fetch vehicles report data
 * Provides: Individual vehicle utilization, maintenance needs, availability
 */
async function fetchVehiclesReport(): Promise<VehicleReportData> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/vehicles`);
    const result = await response.json();
    return { data: result.data };
  } catch (error) {
    console.error("❌ [Report RAG] Failed to fetch vehicles report:", error);
    return { data: [] };
  }
}

// ============================================================================
// MAIN RAG BUILDER
// ============================================================================

/**
 * Fetch ALL report data and build comprehensive RAG context
 * @param startDate - Optional start date filter (YYYY-MM-DD)
 * @param endDate - Optional end date filter (YYYY-MM-DD)
 * @returns Complete report analytics context
 */
export async function buildReportRAGContext(
  startDate?: string,
  endDate?: string
): Promise<ComprehensiveReportRAG> {
  console.log("📊 [Report RAG] Building comprehensive report context...");
  
  await connect();
  
  // Fetch all reports in parallel for efficiency
  const [addOns, categories, customers, offices, reservations, vehicles] = await Promise.all([
    fetchAddOnsReport(startDate, endDate),
    fetchCategoriesReport(startDate, endDate),
    fetchCustomersReport(),
    fetchOfficesReport(startDate, endDate),
    fetchReservationsReport(startDate, endDate),
    fetchVehiclesReport(),
  ]);
  
  console.log("✅ [Report RAG] All reports fetched successfully");
  
  return {
    addOns,
    categories,
    customers,
    offices,
    reservations,
    vehicles,
    metadata: {
      generatedAt: new Date(),
      reportPeriod: startDate && endDate ? { startDate, endDate } : undefined,
    },
  };
}

// ============================================================================
// CONTEXT FORMATTER - Convert to AI-readable text
// ============================================================================

/**
 * Format report RAG data into structured text for AI consumption
 * Classifies and organizes all analytics for intelligent insights
 */
export function formatReportRAGForAI(rag: ComprehensiveReportRAG): string {
  const sections: string[] = [];
  
  // ========== BUSINESS OVERVIEW ==========
  sections.push("=".repeat(80));
  sections.push("COMPREHENSIVE BUSINESS ANALYTICS REPORT");
  sections.push("=".repeat(80));
  sections.push(`Generated: ${rag.metadata.generatedAt.toISOString()}`);
  if (rag.metadata.reportPeriod) {
    sections.push(`Period: ${rag.metadata.reportPeriod.startDate} to ${rag.metadata.reportPeriod.endDate}`);
  }
  sections.push("");
  
  // ========== 1. ADD-ONS PERFORMANCE ==========
  sections.push("━".repeat(80));
  sections.push("📦 ADD-ONS PERFORMANCE ANALYSIS");
  sections.push("━".repeat(80));
  sections.push("");
  sections.push("SUMMARY:");
  sections.push(`  • Total Add-ons Offered: ${rag.addOns.summary.totalAddOns || 0}`);
  sections.push(`  • Total Add-on Revenue: £${(rag.addOns.summary.totalAddOnRevenue || 0).toFixed(2)}`);
  sections.push(`  • Avg Add-ons per Reservation: ${(rag.addOns.summary.avgAddOnsPerReservation || 0).toFixed(2)}`);
  sections.push("");
  
  if (rag.addOns.summary.mostUsedAddOn) {
    sections.push("MOST POPULAR ADD-ON:");
    sections.push(`  • Name: ${rag.addOns.summary.mostUsedAddOn.name}`);
    sections.push(`  • Usage Count: ${rag.addOns.summary.mostUsedAddOn.usageCount || 0}`);
    sections.push(`  • Revenue: £${(rag.addOns.summary.mostUsedAddOn.totalRevenue || 0).toFixed(2)}`);
    sections.push("");
  }
  
  if (rag.addOns.addOns.length > 0) {
    sections.push("TOP 5 ADD-ONS BY USAGE:");
    rag.addOns.addOns.slice(0, 5).forEach((addon, idx) => {
      sections.push(`  ${idx + 1}. ${addon.name}`);
      sections.push(`     - Used: ${addon.usageCount || 0} times`);
      sections.push(`     - Revenue: £${(addon.totalRevenue || 0).toFixed(2)}`);
      sections.push(`     - Top Customer: ${addon.topCustomer} (${addon.topCustomerUsage || 0} uses)`);
    });
    sections.push("");
  }
  
  // ========== 2. CATEGORY PERFORMANCE ==========
  sections.push("━".repeat(80));
  sections.push("🚐 VEHICLE CATEGORY PERFORMANCE");
  sections.push("━".repeat(80));
  sections.push("");
  sections.push("SUMMARY:");
  sections.push(`  • Total Categories: ${rag.categories.summary.categoriesCount || 0}`);
  sections.push(`  • Total Reservations: ${rag.categories.summary.totalReservations || 0}`);
  sections.push(`  • Total Revenue: £${(rag.categories.summary.totalRevenue || 0).toFixed(2)}`);
  sections.push("");
  
  if (rag.categories.summary.mostUsed) {
    sections.push("MOST POPULAR CATEGORY:");
    sections.push(`  • Name: ${rag.categories.summary.mostUsed.categoryName}`);
    sections.push(`  • Bookings: ${rag.categories.summary.mostUsed.count || 0}`);
    sections.push(`  • Revenue: £${(rag.categories.summary.mostUsed.totalPrice || 0).toFixed(2)}`);
    sections.push(`  • Avg Price: £${(rag.categories.summary.mostUsed.avgPrice || 0).toFixed(2)}`);
    sections.push("");
  }
  
  if (rag.categories.data.length > 0) {
    sections.push("CATEGORY BREAKDOWN:");
    rag.categories.data.forEach((cat, idx) => {
      sections.push(`  ${idx + 1}. ${cat.categoryName}`);
      sections.push(`     - Bookings: ${cat.count || 0}`);
      sections.push(`     - Revenue: £${(cat.totalPrice || 0).toFixed(2)}`);
      sections.push(`     - Avg Price: £${(cat.avgPrice || 0).toFixed(2)}`);
    });
    sections.push("");
  }
  
  // ========== 3. CUSTOMER INSIGHTS ==========
  sections.push("━".repeat(80));
  sections.push("👥 CUSTOMER BEHAVIOR & RETENTION");
  sections.push("━".repeat(80));
  sections.push("");
  sections.push("SUMMARY:");
  sections.push(`  • Total Customers: ${rag.customers.summary.totalCustomers || 0}`);
  sections.push(`  • Total Revenue: £${(rag.customers.summary.totalRevenue || 0).toFixed(2)}`);
  sections.push(`  • Avg Reservations per Customer: ${(rag.customers.summary.avgReservationsPerCustomer || 0).toFixed(2)}`);
  sections.push(`  • New Users This Month: ${rag.customers.summary.newUsersThisMonth || 0}`);
  sections.push(`  • Active Users This Month: ${rag.customers.summary.usersThisMonth || 0}`);
  sections.push("");
  
  if (rag.customers.summary.mostReserved) {
    sections.push("TOP CUSTOMER:");
    sections.push(`  • Name: ${rag.customers.summary.mostReserved.name}`);
    sections.push(`  • Reservations: ${rag.customers.summary.mostReserved.reservationCount || 0}`);
    sections.push(`  • Total Spent: £${(rag.customers.summary.mostReserved.totalPrice || 0).toFixed(2)}`);
    sections.push("");
  }
  
  if (rag.customers.data.length > 0) {
    sections.push("TOP 10 CUSTOMERS BY REVENUE:");
    rag.customers.data.slice(0, 10).forEach((customer, idx) => {
      sections.push(`  ${idx + 1}. ${customer.name}`);
      sections.push(`     - Reservations: ${customer.reservationCount || 0}`);
      sections.push(`     - Total Spent: £${(customer.totalPrice || 0).toFixed(2)}`);
    });
    sections.push("");
  }
  
  // ========== 4. OFFICE PERFORMANCE ==========
  sections.push("━".repeat(80));
  sections.push("📍 OFFICE LOCATION PERFORMANCE");
  sections.push("━".repeat(80));
  sections.push("");
  sections.push("SUMMARY:");
  sections.push(`  • Total Offices: ${rag.offices.summary.officesCount || 0}`);
  sections.push(`  • Total Reservations: ${rag.offices.summary.totalReservations || 0}`);
  sections.push(`  • Total Revenue: £${(rag.offices.summary.totalRevenue || 0).toFixed(2)}`);
  sections.push("");
  
  if (rag.offices.summary.mostUsed) {
    sections.push("BEST PERFORMING OFFICE:");
    sections.push(`  • Name: ${rag.offices.summary.mostUsed.officeName}`);
    sections.push(`  • Bookings: ${rag.offices.summary.mostUsed.count || 0}`);
    sections.push(`  • Revenue: £${(rag.offices.summary.mostUsed.totalPrice || 0).toFixed(2)}`);
    sections.push(`  • Avg Booking: £${(rag.offices.summary.mostUsed.avgPrice || 0).toFixed(2)}`);
    sections.push("");
  }
  
  if (rag.offices.data.length > 0) {
    sections.push("OFFICE RANKINGS:");
    rag.offices.data.forEach((office, idx) => {
      sections.push(`  ${idx + 1}. ${office.officeName}`);
      sections.push(`     - Bookings: ${office.count || 0}`);
      sections.push(`     - Revenue: £${(office.totalPrice || 0).toFixed(2)}`);
      sections.push(`     - Avg Booking: £${(office.avgPrice || 0).toFixed(2)}`);
    });
    sections.push("");
  }
  
  // ========== 5. RESERVATION TRENDS ==========
  sections.push("━".repeat(80));
  sections.push("📅 RESERVATION & REVENUE TRENDS");
  sections.push("━".repeat(80));
  sections.push("");
  sections.push("SUMMARY:");
  sections.push(`  • Total Reservations: ${rag.reservations.summary.totalReservations || 0}`);
  sections.push(`  • Total Revenue: £${(rag.reservations.summary.totalRevenue || 0).toFixed(2)}`);
  sections.push(`  • Avg Reservation Value: £${(rag.reservations.summary.avgPrice || 0).toFixed(2)}`);
  sections.push("");
  
  if (rag.reservations.summary.topReservation) {
    sections.push("HIGHEST VALUE BOOKING:");
    sections.push(`  • Customer: ${rag.reservations.summary.topReservation.customerName}`);
    sections.push(`  • Category: ${rag.reservations.summary.topReservation.categoryName}`);
    sections.push(`  • Value: £${(rag.reservations.summary.topReservation.totalPrice || 0).toFixed(2)}`);
    sections.push(`  • Status: ${rag.reservations.summary.topReservation.status}`);
    sections.push("");
  }
  
  // ========== 6. VEHICLE UTILIZATION ==========
  sections.push("━".repeat(80));
  sections.push("🚗 INDIVIDUAL VEHICLE UTILIZATION");
  sections.push("━".repeat(80));
  sections.push("");
  sections.push(`Total Vehicles: ${rag.vehicles.data.length}`);
  sections.push("");
  
  if (rag.vehicles.data.length > 0) {
    // Sort by reservation count
    const sortedVehicles = [...rag.vehicles.data].sort((a, b) => b.reservationCount - a.reservationCount);
    
    sections.push("TOP 10 MOST UTILIZED VEHICLES:");
    sortedVehicles.slice(0, 10).forEach((vehicle, idx) => {
      sections.push(`  ${idx + 1}. ${vehicle.title} (${vehicle.number})`);
      sections.push(`     - Category: ${vehicle.category?.name || 'N/A'}`);
      sections.push(`     - Office: ${vehicle.office?.name || 'N/A'}`);
      sections.push(`     - Reservations: ${vehicle.reservationCount}`);
    });
    sections.push("");
    
    // Identify underutilized vehicles
    const underutilized = sortedVehicles.filter(v => v.reservationCount === 0);
    if (underutilized.length > 0) {
      sections.push(`⚠️  UNDERUTILIZED VEHICLES (${underutilized.length} vehicles with 0 bookings):`);
      underutilized.slice(0, 5).forEach((vehicle) => {
        sections.push(`  • ${vehicle.title} (${vehicle.number}) at ${vehicle.office?.name || 'Unknown'}`);
      });
      sections.push("");
    }
  }
  
  // ========== KEY INSIGHTS & RECOMMENDATIONS ==========
  sections.push("━".repeat(80));
  sections.push("💡 KEY BUSINESS INSIGHTS");
  sections.push("━".repeat(80));
  sections.push("");
  
  // Calculate key metrics
  const customerRetentionRate = rag.customers.summary.avgReservationsPerCustomer;
  const revenuePerCustomer = rag.customers.summary.totalCustomers > 0 
    ? rag.customers.summary.totalRevenue / rag.customers.summary.totalCustomers 
    : 0;
  
  sections.push("CLASSIFICATION:");
  if (customerRetentionRate > 2) {
    sections.push("  ✅ CUSTOMER LOYALTY: EXCELLENT - Customers book multiple times");
  } else if (customerRetentionRate > 1.5) {
    sections.push("  ✔️  CUSTOMER LOYALTY: GOOD - Some repeat customers");
  } else {
    sections.push("  ⚠️  CUSTOMER LOYALTY: NEEDS IMPROVEMENT - Mostly one-time bookings");
  }
  
  sections.push(`  • Customer Lifetime Value: £${revenuePerCustomer.toFixed(2)}`);
  
  // Calculate true attachment rate: % of reservations with at least one add-on
  const reservationsWithAddOns = rag.addOns.summary.reservationsWithAddOns || 0;
  const totalReservationsForAddOns = rag.addOns.summary.totalReservationsForAddOns || 1;
  const attachmentRate = (reservationsWithAddOns / totalReservationsForAddOns) * 100;
  sections.push(`  • Add-on Attachment Rate: ${attachmentRate.toFixed(1)}% (${reservationsWithAddOns}/${totalReservationsForAddOns} bookings)`);
  sections.push(`  • Avg Add-ons per Booking: ${(rag.addOns.summary.avgAddOnsPerReservation || 0).toFixed(2)}`);
  sections.push("");
  
  sections.push("=".repeat(80));
  sections.push("END OF BUSINESS ANALYTICS REPORT");
  sections.push("=".repeat(80));
  
  return sections.join("\n");
}

// ============================================================================
// EXPORT MAIN FUNCTION
// ============================================================================

/**
 * Main entry point: Build RAG context and format for AI
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Formatted text context for AI consumption
 */
export async function getReportRAGContext(
  startDate?: string,
  endDate?: string
): Promise<string> {
  const rag = await buildReportRAGContext(startDate, endDate);
  return formatReportRAGForAI(rag);
}
