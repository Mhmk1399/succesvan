/**
 * BUSINESS ANALYST AI AGENT
 * 
 * AI-powered business intelligence assistant that analyzes comprehensive reports
 * and provides expert insights, recommendations, and trend analysis.
 * 
 * Use cases:
 * - "What happened last week?"
 * - "Show me our top performing vehicles"
 * - "Which customers spend the most?"
 * - "What add-ons are not selling?"
 * - "Compare this month vs last month"
 */

import { openai } from "./openai";
import { getReportRAGContext } from "./report-rag";

// ============================================================================
// DATE PARSING UTILITIES
// ============================================================================

/**
 * Parse natural language date queries into date ranges
 * Uses UK convention: week starts on Monday (ISO week)
 */
export function parseDateQuery(query: string): { startDate?: string; endDate?: string } {
  const today = new Date();
  const queryLower = query.toLowerCase();
  
  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Helper to get Monday of given week (ISO week start)
  const getMonday = (d: Date): Date => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days; otherwise go to Monday
    date.setDate(date.getDate() + diff);
    return date;
  };
  
  // Last week (previous full week, Mon-Sun)
  if (queryLower.includes("last week")) {
    const thisMonday = getMonday(today);
    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(thisMonday.getDate() - 7);
    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);
    return {
      startDate: formatDate(lastMonday),
      endDate: formatDate(lastSunday),
    };
  }
  
  // This week (Monday of current week to today) - UK standard
  if (queryLower.includes("this week")) {
    const thisMonday = getMonday(today);
    return {
      startDate: formatDate(thisMonday),
      endDate: formatDate(today),
    };
  }
  
  // Last month (calendar month)
  if (queryLower.includes("last month")) {
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    return {
      startDate: formatDate(lastMonthStart),
      endDate: formatDate(lastMonthEnd),
    };
  }
  
  // This month
  if (queryLower.includes("this month")) {
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      startDate: formatDate(thisMonthStart),
      endDate: formatDate(today),
    };
  }
  
  // This year
  if (queryLower.includes("this year")) {
    const thisYearStart = new Date(today.getFullYear(), 0, 1);
    return {
      startDate: formatDate(thisYearStart),
      endDate: formatDate(today),
    };
  }
  
  // Last year (full calendar year)
  if (queryLower.includes("last year")) {
    const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
    const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
    return {
      startDate: formatDate(lastYearStart),
      endDate: formatDate(lastYearEnd),
    };
  }
  
  // Last 90 days / past 90 days
  if (queryLower.includes("last 90 days") || queryLower.includes("past 90 days")) {
    const last90Start = new Date(today);
    last90Start.setDate(today.getDate() - 90);
    return {
      startDate: formatDate(last90Start),
      endDate: formatDate(today),
    };
  }
  
  // Last 30 days (rolling, NOT calendar month)
  if (queryLower.includes("last 30 days") || queryLower.includes("past 30 days")) {
    const last30Start = new Date(today);
    last30Start.setDate(today.getDate() - 30);
    return {
      startDate: formatDate(last30Start),
      endDate: formatDate(today),
    };
  }
  
  // Last 14 days / past 2 weeks
  if (queryLower.includes("last 14 days") || queryLower.includes("past 14 days") || queryLower.includes("past 2 weeks")) {
    const last14Start = new Date(today);
    last14Start.setDate(today.getDate() - 14);
    return {
      startDate: formatDate(last14Start),
      endDate: formatDate(today),
    };
  }
  
  // Last 7 days / past week
  if (queryLower.includes("last 7 days") || queryLower.includes("past week")) {
    const last7Start = new Date(today);
    last7Start.setDate(today.getDate() - 7);
    return {
      startDate: formatDate(last7Start),
      endDate: formatDate(today),
    };
  }
  
  // Yesterday
  if (queryLower.includes("yesterday")) {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return {
      startDate: formatDate(yesterday),
      endDate: formatDate(yesterday),
    };
  }
  
  // Today
  if (queryLower.includes("today")) {
    return {
      startDate: formatDate(today),
      endDate: formatDate(today),
    };
  }
  
  // Specific month (e.g., "December", "in November")
  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];
  for (let i = 0; i < months.length; i++) {
    if (queryLower.includes(months[i])) {
      const monthStart = new Date(today.getFullYear(), i, 1);
      const monthEnd = new Date(today.getFullYear(), i + 1, 0);
      return {
        startDate: formatDate(monthStart),
        endDate: formatDate(monthEnd),
      };
    }
  }
  
  // Default: no date filter (all time)
  return {};
}

// ============================================================================
// CONVERSATION HISTORY TYPES
// ============================================================================

export interface BusinessConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface BusinessAnalysisResponse {
  message: string;
  insights?: {
    keyMetrics?: Record<string, any>;
    trends?: string[];
    recommendations?: string[];
    warnings?: string[];
  };
  conversationHistory: BusinessConversationMessage[];
}

// ============================================================================
// MAIN BUSINESS ANALYST AGENT
// ============================================================================

/**
 * Business Analyst AI Agent
 * Analyzes comprehensive business reports and provides expert insights
 * 
 * @param query - Admin's question or request
 * @param conversationHistory - Previous conversation context
 * @returns Analysis, insights, and recommendations
 */
export async function analyzeBusinessQuery(
  query: string,
  conversationHistory: BusinessConversationMessage[] = []
): Promise<BusinessAnalysisResponse> {
  console.log("📊 [Business Analyst] Processing query:", query);
  
  // Parse date range from query
  const { startDate, endDate } = parseDateQuery(query);
  console.log("📅 [Business Analyst] Date range:", { startDate, endDate });
  
  // Fetch comprehensive report RAG context
  console.log("🔍 [Business Analyst] Fetching report data...");
  const reportContext = await getReportRAGContext(startDate, endDate);
  console.log("✅ [Business Analyst] Report data fetched");
  
  // Build system prompt
  const systemPrompt = `You are an expert BUSINESS ANALYST and CONSULTANT for Success Van Hire, a vehicle rental company.

YOUR ROLE:
- Analyze comprehensive business reports and data
- Provide actionable insights and recommendations
- Identify trends, patterns, and opportunities
- Highlight risks and areas needing attention
- Speak like a seasoned business consultant with 20+ years experience

YOUR EXPERTISE:
- Revenue analysis and optimization
- Customer behavior and retention
- Operational efficiency
- Inventory management
- Pricing strategy
- Market positioning
- Performance benchmarking

COMMUNICATION STYLE:
- Professional but conversational
- Data-driven with clear explanations
- Highlight KEY NUMBERS that matter
- Use business terminology naturally
- Provide context (compare to averages, trends)
- End with 2-3 specific ACTION ITEMS when relevant

ANALYSIS FRAMEWORK:
1. CURRENT STATE: What the numbers show
2. INSIGHTS: What it means (trends, patterns, comparisons)
3. IMPLICATIONS: Why it matters (risks, opportunities)
4. RECOMMENDATIONS: What to do next (specific, actionable)

BELOW IS THE COMPLETE BUSINESS REPORT DATA:

${reportContext}

---

IMPORTANT GUIDELINES:
- Reference specific numbers from the report data
- Compare metrics to identify trends (e.g., "up 23% from average")
- Highlight both positives and concerns
- Keep responses concise but comprehensive (150-300 words for summaries)
- For specific questions, focus on relevant data
- Always provide context: "£5,000 revenue is 15% above your monthly average"
- End with actionable recommendations

GROUNDING RULES (CRITICAL - NEVER VIOLATE):
1. NO GUESSING: If a metric is not present in the data, say "Not available in the data for this period." NEVER invent numbers.
2. SOURCE ATTRIBUTION: Every number you cite MUST include which section it came from, e.g., "(from Reservations Summary)" or "(from Add-Ons Report)".
3. CLARIFY AMBIGUITY: If the user's question requires choosing between offices, categories, or time periods, ask ONE clarifying question instead of guessing. Example: "Which office did you want to focus on: Hendon or Mill Hill?"
4. MISSING DATA: If the report section shows zero or null values, explicitly state "No data recorded for [X] in this period" rather than skipping it.
5. CONFIDENCE LEVELS: If drawing conclusions from limited data (e.g., < 5 data points), add a disclaimer: "Note: Based on limited data - interpret with caution."

EXAMPLE OF PROPER SOURCING:
✅ "Revenue reached £12,450 (from Reservations Summary) across 47 bookings."
✅ "The attachment rate is 35% (from Add-Ons Summary), which is above your usual 28%."
❌ "Revenue was probably around £12,000." (NO - never approximate without data)
❌ "Hendon is your best office." (NO - must cite the metric proving this)

EXAMPLE RESPONSE STYLES:

Q: "What happened last week?"
A: "Last week showed solid performance with £12,450 in revenue from 47 bookings. Here's what stands out:

📈 Strong points:
- Medium vans drove 60% of revenue (£7,470) - your best performer
- Hendon office had 28 bookings vs Mill Hill's 19
- Add-on attachment rate hit 35%, above your 28% average

⚠️ Watch areas:
- 3 vehicles had zero bookings - check availability or marketing
- Weekend bookings down 15% vs previous week

💡 Actions:
1. Promote underutilized vehicles with weekend discounts
2. Push GPS and child seat add-ons at Mill Hill (lower attachment rate)
3. Analyze why Medium vans are winning - replicate that success"

Q: "Who are my best customers?"
A: "Your top 10 customers represent 45% of total revenue - that's excellent concentration but also risky. Here's the breakdown:

🌟 VIP Tier (£2,000+ spent):
- John Smith: £3,200 across 8 bookings - clearly loyal
- ABC Delivery Ltd: £2,850 in 6 bookings - business account

The average customer spends £180 per booking and books 1.3 times per year. Your repeat customer rate is 23%, which is solid for this industry.

💡 Strategy:
1. Create a loyalty program for customers with 3+ bookings
2. Reach out personally to customers who haven't returned in 6+ months
3. Offer business accounts (like ABC Delivery) a 10% discount for volume commitments"

Remember: Be the trusted advisor who helps the admin make SMART DECISIONS backed by DATA.`;

  // Build conversation messages
  const messages: BusinessConversationMessage[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory,
    { role: "user", content: query },
  ];
  
  console.log("🤖 [Business Analyst] Sending to GPT-4...");
  
  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages as any,
    temperature: 0.4, // Balanced for analytical yet natural responses
    max_tokens: 1500,
  });
  
  const response = completion.choices[0].message.content || "I couldn't analyze that data. Please try again.";
  
  console.log("✅ [Business Analyst] Analysis complete");
  
  // Update conversation history
  const updatedHistory = [
    ...conversationHistory,
    { role: "user" as const, content: query },
    { role: "assistant" as const, content: response },
  ];
  
  return {
    message: response,
    conversationHistory: updatedHistory,
  };
}

// ============================================================================
// SPECIALIZED ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Get a quick business health summary
 * Perfect for dashboard widgets or daily reports
 */
export async function getBusinessHealthSummary(
  startDate?: string,
  endDate?: string
): Promise<string> {
  console.log("🏥 [Business Health] Generating health summary...");
  
  const reportContext = await getReportRAGContext(startDate, endDate);
  
  const systemPrompt = `You are a business analyst. Based on the report data below, provide a BRIEF health summary (3-4 sentences) covering:
1. Overall performance (revenue, bookings)
2. One key strength
3. One area of concern
4. Overall health rating (Excellent/Good/Fair/Needs Attention)

${reportContext}

Keep it concise and actionable.`;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: systemPrompt }],
    temperature: 0.3,
    max_tokens: 200,
  });
  
  return completion.choices[0].message.content || "Unable to generate summary.";
}

/**
 * Compare two time periods
 */
export async function comparePeriods(
  period1: { startDate: string; endDate: string; label: string },
  period2: { startDate: string; endDate: string; label: string }
): Promise<string> {
  console.log("📊 [Period Comparison] Comparing:", period1.label, "vs", period2.label);
  
  const [context1, context2] = await Promise.all([
    getReportRAGContext(period1.startDate, period1.endDate),
    getReportRAGContext(period2.startDate, period2.endDate),
  ]);
  
  const systemPrompt = `You are a business analyst comparing two time periods.

PERIOD 1 (${period1.label}):
${context1}

---

PERIOD 2 (${period2.label}):
${context2}

---

Provide a comparative analysis covering:
1. Revenue change (% and absolute)
2. Booking volume change
3. Customer behavior changes
4. Category/office performance shifts
5. Key takeaways and recommendations

Format with clear sections and use % changes prominently.`;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: systemPrompt }],
    temperature: 0.4,
    max_tokens: 1000,
  });
  
  return completion.choices[0].message.content || "Unable to compare periods.";
}

/**
 * Generate recommendations based on current performance
 */
export async function getBusinessRecommendations(
  startDate?: string,
  endDate?: string
): Promise<string[]> {
  console.log("💡 [Recommendations] Generating actionable recommendations...");
  
  const reportContext = await getReportRAGContext(startDate, endDate);
  
  const systemPrompt = `You are a business consultant. Based on the report data below, provide 5-7 SPECIFIC, ACTIONABLE recommendations.

${reportContext}

Format as a JSON array of strings. Each recommendation should be:
- Specific (not generic advice)
- Actionable (clear next steps)
- Data-backed (reference actual numbers)

Example:
["Promote GPS add-ons at Mill Hill (only 12% attachment vs 35% at Hendon) with bundle discounts", "Contact 15 customers who haven't booked in 6+ months with a 15% return offer"]`;
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "system", content: systemPrompt }],
    temperature: 0.4,
    response_format: { type: "json_object" },
  });
  
  const result = completion.choices[0].message.content;
  const parsed = result ? JSON.parse(result) : { recommendations: [] };
  
  return parsed.recommendations || [];
}

