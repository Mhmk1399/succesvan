/**
 * Step-by-Step Blog Content Generator
 *
 * Generates blog content in discrete steps with user approval gates:
 * 1. Headings tree
 * 2. Section content (one at a time)
 * 3. Summary
 * 4. Conclusion
 * 5. FAQs
 * 6. SEO metadata
 *
 * ✅ Brand-aware (Success Van Hire):
 * - Brand name + contact details used naturally (no spam)
 * - Brand features injected where relevant
 * - Van fleet data for smart recommendations
 */

import { generateId, getCurrentYear } from "./blog-utils";
import { getOpenAI } from "./openai";

// ============================================================================
// BRAND CONFIG (Success Van Hire)
// ============================================================================

const BRAND = {
  name: "Success Van Hire",
  phone: "+44 20 3011 1198",
  address: "Strata House, Waterloo Road, London, NW2 7UH",
};

const BRAND_FEATURES = {
  expertise:
    "Expert in long-term and short-term business van rental with a modern fleet of 50+ vehicles",
  licenses:
    "UK & EU driving licences accepted with a fast and simple verification process",
  guarantee:
    "100% secure booking with guaranteed reservations and full insurance coverage",
  pricing:
    "Prices fit every budget with a wide range of options and no hidden fees",
  eco: "Eco-friendly fleet meeting EU6 emission standards (Clean Air Standard focus)",
  service:
    "Friendly & professional service, including business insurance support for B2B clients",
};

// ============================================================================
// VAN FLEET DATA (Simple format for AI)
// ============================================================================

const VAN_FLEET = [
  {
    name: "Short Wheel Base",
    type: "Van",
    seats: 3,
    fuel: "Diesel",
    priceFrom: 60,
    idealFor: "Small moves, trades and tools, city driving, small furniture",
    loadVolume: "6.0-6.5 m³",
    payload: "800-1,100 kg",
  },
  {
    name: "Medium Wheel Base",
    type: "Van",
    seats: 3,
    fuel: "Diesel",
    priceFrom: 78,
    idealFor: "Furniture moves, trade jobs, pallets up to 3m long",
    loadVolume: "10.0 m³",
    payload: "900-1,200 kg",
  },
  {
    name: "Long Wheel Base",
    type: "Van",
    seats: 3,
    fuel: "Diesel",
    priceFrom: 72,
    idealFor:
      "Furniture and office relocations, trade equipment, up to 4 Euro pallets",
    loadVolume: "11.5 m³",
    payload: "1.1-1.3 tonnes",
  },
  {
    name: "Extra Long Wheel Base",
    type: "Van",
    seats: 3,
    fuel: "Diesel",
    priceFrom: 108,
    idealFor:
      "Large/long loads (4m+), long timber, pipes, up to 5 Euro pallets, event transport",
    loadVolume: "15.1 m³",
    payload: "1.0-1.35 tonnes",
  },
  {
    name: "Luton With Tail-Lift",
    type: "Van",
    seats: 3,
    fuel: "Diesel",
    priceFrom: 100,
    idealFor:
      "House moves, office relocations, heavy/bulky items, appliances, pallets",
    loadVolume: "16-18.5 m³",
    payload: "600-1,000 kg",
    special: "Hydraulic tail-lift for easy loading",
  },
  {
    name: "CrewCab Van",
    type: "Van",
    seats: 6,
    fuel: "Diesel",
    priceFrom: 72,
    idealFor:
      "Work crews + equipment, construction teams, trade and maintenance jobs",
    loadVolume: "3.1-3.7 m³",
    payload: "700-900 kg",
    special: "Carries team AND tools together",
  },
  {
    name: "Fridge Van",
    type: "Van",
    seats: 3,
    fuel: "Diesel",
    priceFrom: 120,
    idealFor: "Food delivery, perishable goods, catering, pharmaceuticals",
    loadVolume: "9.3-10 m³",
    payload: "900-1,030 kg",
    special: "Temperature controlled (0°C to +5°C, optional freezer to -18°C)",
  },
  {
    name: "Tipper Van",
    type: "Van",
    seats: 2,
    fuel: "Diesel",
    priceFrom: 120,
    idealFor:
      "Construction waste, gravel, sand, soil, landscaping, site clearance",
    payload: "up to 1.5 tonnes",
    special: "Hydraulic tipping for quick unloading",
  },
  {
    name: "Flat Bed Pickup Van",
    type: "Van",
    seats: 2,
    fuel: "Diesel",
    priceFrom: 108,
    idealFor:
      "Oversized/awkward loads, construction, landscaping, crane/forklift loading",
    payload: "up to 2.2 tonnes",
    special: "Open flatbed with drop sides",
  },
  {
    name: "8 Seater Tourneo",
    type: "Minibus",
    seats: 8,
    fuel: "Diesel",
    priceFrom: 120,
    idealFor:
      "Family trips, group travel, small corporate events, airport transfers",
    license: "Standard B license",
  },
  {
    name: "14 Seater Minibus",
    type: "Minibus",
    seats: 14,
    fuel: "Diesel",
    priceFrom: 150,
    idealFor: "Large groups, corporate events, school trips, sightseeing tours",
    license: "Standard B license",
  },
  {
    name: "17 Seater Minibus",
    type: "Minibus",
    seats: 17,
    fuel: "Diesel",
    priceFrom: 180,
    idealFor: "Maximum group capacity, large corporate events, extended tours",
    license: "D/D1 license required",
  },
];

/**
 * Build van fleet context string for AI
 */
function buildVanFleetContext(): string {
  const vanList = VAN_FLEET.map((van) => {
    let info = `• ${van.name} (${van.type}) - ${van.seats} seats, ${van.fuel}, from £${van.priceFrom}/day`;
    info += `\n  Best for: ${van.idealFor}`;
    if (van.loadVolume) info += ` | Volume: ${van.loadVolume}`;
    if (van.payload) info += ` | Payload: ${van.payload}`;
    if (van.special) info += `\n  Special: ${van.special}`;
    if (van.license) info += ` | License: ${van.license}`;
    return info;
  }).join("\n\n");

  return `
AVAILABLE VAN FLEET (use this to recommend vehicles):
${vanList}

VAN RECOMMENDATION RULES:
When the content discusses specific tasks, use cases, or vehicle selection, you SHOULD insert a van recommendation marker.

FORMAT (use exactly this):
**SHOW_VANS: Van Name 1, Van Name 2, Van Name 3**

EXAMPLES:
- For house moving content: **SHOW_VANS: Long Wheel Base, Luton With Tail-Lift, Extra Long Wheel Base**
- For small deliveries: **SHOW_VANS: Short Wheel Base, Medium Wheel Base**
- For group travel: **SHOW_VANS: 8 Seater Tourneo, 14 Seater Minibus, 17 Seater Minibus**
- For construction/trade: **SHOW_VANS: Tipper Van, Flat Bed Pickup Van, CrewCab Van**
- For food/catering: **SHOW_VANS: Fridge Van**

WHEN TO INSERT:
✅ After discussing a specific use case (moving, delivery, construction, etc.)
✅ When comparing van sizes or types
✅ In "choosing the right van" sections
✅ At the end of practical advice sections
✅ Maximum 2-3 times per article (don't overdo it)

WHEN NOT TO INSERT:
❌ In introduction/summary
❌ In conclusion
❌ In FAQ answers
❌ When topic is not directly about van selection
`.trim();
}

/**
 * Lightweight relevance detector
 */
function isServiceRelatedTopic(topic: string): boolean {
  const t = (topic || "").toLowerCase();
  const keywords = [
    "van",
    "van hire",
    "hire a van",
    "rent",
    "rental",
    "moving",
    "removal",
    "delivery",
    "courier",
    "transport",
    "logistics",
    "man and van",
    "london",
    "uk",
    "pickup",
    "drop off",
    "book",
    "booking",
    "quote",
    "price",
    "pricing",
    "b2b",
    "business",
    "fleet",
    "emissions",
    "ulez",
    "clean air",
    "minibus",
    "group",
    "travel",
    "construction",
    "trade",
    "fridge",
    "refrigerated",
  ];
  return keywords.some((k) => t.includes(k));
}

function buildBrandContext(allowContact: boolean): string {
  return `
BRAND IDENTITY:
- Brand name: ${BRAND.name}
- Phone: ${BRAND.phone}
- Address: ${BRAND.address}

BRAND FEATURES (use selectively, only when relevant):
1) Expertise: ${BRAND_FEATURES.expertise}
2) Licences: ${BRAND_FEATURES.licenses}
3) Guarantee & Insurance: ${BRAND_FEATURES.guarantee}
4) Pricing: ${BRAND_FEATURES.pricing}
5) Eco/Compliance: ${BRAND_FEATURES.eco}
6) Service Delivery (B2B-friendly): ${BRAND_FEATURES.service}

USAGE RULES (STRICT):
- Be natural and useful. Never sound like an ad.
- Mention "${BRAND.name}" when it helps the reader (typically intro or conclusion, or provider-selection sections).
- Use features as "proof points" only in sections that match them.
- Avoid repetition of the same feature.
- Contact details: ${allowContact ? "ALLOWED only in explicit contact/booking contexts (max once each)" : "NOT ALLOWED"}.
- If topic is NOT service-related: At most one brief mention of "${BRAND.name}".

${buildVanFleetContext()}

STYLE:
- Human, conversational, professional.
- Unique phrasing, no robotic patterns.
`.trim();
}

/**
 * One reusable system message builder for all steps
 */
function buildSystemMessage(brandContext: string) {
  return {
    role: "system" as const,
    content:
      "You are an expert SEO content strategist and blog writer. Follow the BRAND IDENTITY, FEATURES, VAN FLEET DATA, and USAGE RULES strictly. Write unique, human-like content. Avoid spam and repetition. Insert van recommendation markers where appropriate using the exact format specified.\n\n" +
      brandContext,
  };
}

// ============================================================================
// STEP 1: GENERATE HEADINGS TREE
// ============================================================================

export async function generateHeadingsTree(prompt: string) {
  console.log("📋 [Step Generator] Generating headings tree for:", prompt);

  const currentYear = getCurrentYear();
  const allowContact = isServiceRelatedTopic(prompt);
  const brandContext = buildBrandContext(allowContact);
  const systemMessage = buildSystemMessage(brandContext);

  const systemPrompt = `Create a comprehensive blog post outline.

Generate a JSON response with:
{
  "suggestedTitle": "SEO-optimized title (50-60 chars, include year ${currentYear})",
  "focusKeyword": "Primary SEO keyword (1-3 words)",
  "headings": [
    {
      "id": "unique-id",
      "level": 2,
      "text": "Heading text",
      "content": ""
    }
  ]
}

REQUIREMENTS:
- Create 5-7 main sections (H2 level)
- Each H2 can have 2-3 subsections (H3 level)
- Focus keyword should appear in title
- The headings should flow logically and cover the topic comprehensively
- Make the headings specific, actionable, and intriguing for readers
- Ensure uniqueness and original structure (no copying)
- Natural, conversational tone

BRAND STRUCTURE RULE:
- If topic is service-related, include ONE heading that could naturally support:
  (a) booking/reservation steps OR
  (b) choosing a provider / comparing options OR
  (c) which van/vehicle is right for you
- If topic is not service-related, do not include booking/contact/provider-comparison headings.

Return ONLY valid JSON.`;

  const client = getOpenAI();
  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      systemMessage,
      { role: "user", content: `Create blog outline for: ${prompt}` },
      { role: "user", content: systemPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const result = JSON.parse(completion.choices[0].message.content || "{}");

  if (result.headings) {
    result.headings = result.headings.map((h: any) => ({
      ...h,
      id: h.id || generateId(),
      content: "",
    }));
  }

  console.log(
    `✅ [Step Generator] Generated ${result.headings?.length || 0} headings`,
  );

  return result;
}

// ============================================================================
// STEP 2: GENERATE SECTION CONTENT
// ============================================================================

export async function generateSectionContent(
  topic: string,
  headingText: string,
  level: number,
  focusKeyword: string,
): Promise<string> {
  console.log(`📝 [Step Generator] Generating content for: ${headingText}`);

  const wordCount = level === 2 ? "250-350" : "150-200";
  const allowContact = isServiceRelatedTopic(topic);
  const brandContext = buildBrandContext(allowContact);
  const systemMessage = buildSystemMessage(brandContext);

  const systemPrompt = `Write high-quality, SEO-optimized content.

Requirements:
- Write ${wordCount} words
- Natural and human-like; no robotic phrasing
- HTML only with proper tags (<p>, <ul>, <li>, <strong>, <em>, etc.)
- Include focus keyword "${focusKeyword}" naturally if relevant
- Concise, engaging, no repetition
- Real-life examples, data, actionable insights
- Unique content

BRAND & FEATURES USAGE:
- Mention "${BRAND.name}" ONLY if it naturally helps this specific section (max once).
- Use at most ONE brand feature proof point if it fits the section.
- Contact details: Include phone/address ONLY if this section is explicitly about contacting/booking AND contact is allowed.

VAN RECOMMENDATIONS:
- If this section discusses tasks, use cases, or vehicle types, insert ONE van marker at an appropriate place.
- Format: **SHOW_VANS: Van Name 1, Van Name 2**
- Place it on its OWN LINE after the relevant paragraph.
- Choose vans that match the topic being discussed.
- Maximum 1 marker per section.

Return ONLY the HTML content (no heading tags).`;

  const userPrompt = `Write content for the section: "${headingText}"

Blog topic: ${topic}
Heading level: H${level}

Make it engaging, informative, and valuable to the reader.`;

  const client3 = getOpenAI();
  const completion = await client3.chat.completions.create({
    model: "gpt-4o",
    messages: [
      systemMessage,
      { role: "user", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content || "";

  console.log(
    `✅ [Step Generator] Content generated (${content.length} chars)`,
  );

  return content;
}

// ============================================================================
// STEP 3: GENERATE SUMMARY
// ============================================================================

export async function generateSummary(
  topic: string,
  title: string,
  focusKeyword: string,
): Promise<string> {
  console.log(`📋 [Step Generator] Generating summary for: ${topic}`);

  const allowContact = isServiceRelatedTopic(topic);
  const brandContext = buildBrandContext(allowContact);
  const systemMessage = buildSystemMessage(brandContext);

  const systemPrompt = `Write an engaging introduction/summary.

Requirements:
- 120-180 words
- Interesting hook + clear promise of what the article covers
- Include focus keyword: "${focusKeyword}" naturally
- Conversational and human tone
- HTML tags: <p>, <strong>, <em>
- No boilerplate/document tags

BRAND USAGE:
- If topic is service-related, you MAY mention "${BRAND.name}" naturally once.
- Do NOT include phone/address in the summary.
- Do NOT include van recommendation markers (**SHOW_VANS:**) in summary.

Return ONLY HTML starting with <p> and ending with </p>.`;

  const userPrompt = `Write an introduction for a blog post titled: "${title}"

Topic: ${topic}

Make it compelling and encourage readers to continue.`;

  const client3 = getOpenAI();
  const completion = await client3.chat.completions.create({
    model: "gpt-4o",
    messages: [
      systemMessage,
      { role: "user", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
  });

  let summary = completion.choices[0].message.content || "";

  summary = summary.replace(/```html\n?/g, "");
  summary = summary.replace(/```\n?/g, "");
  summary = summary.replace(/<!DOCTYPE[^>]*>/gi, "");
  summary = summary.replace(/<\/?html[^>]*>/gi, "");
  summary = summary.replace(/<\/?head[^>]*>/gi, "");
  summary = summary.replace(/<\/?body[^>]*>/gi, "");
  summary = summary.replace(/<title>[^<]*<\/title>/gi, "");
  summary = summary.replace(/<meta[^>]*>/gi, "");
  summary = summary.trim();

  console.log(
    `✅ [Step Generator] Summary generated (${summary.length} chars)`,
  );

  return summary;
}

// ============================================================================
// STEP 4: GENERATE CONCLUSION
// ============================================================================

export async function generateConclusion(
  topic: string,
  title: string,
  focusKeyword: string,
  headings: any[],
): Promise<string> {
  console.log(`🎯 [Step Generator] Generating conclusion`);

  const allowContact = isServiceRelatedTopic(topic);
  const brandContext = buildBrandContext(allowContact);
  const systemMessage = buildSystemMessage(brandContext);

  const mainPoints = headings
    .filter((h) => h.level === 2)
    .slice(0, 3)
    .map((h) => h.text)
    .join(", ");

  const systemPrompt = `Write a powerful conclusion.

Requirements:
- 120-150 words
- Summarize key takeaways
- Clear next step / CTA
- Include focus keyword: "${focusKeyword}" naturally
- HTML tags: <p>, <strong>, <em>
- No heading tags, no document tags

BRAND USAGE:
- If topic is service-related, mention "${BRAND.name}" naturally once.
- You MAY include one relevant brand proof point (max one) if it fits the CTA.
- Do NOT include phone/address unless the article is explicitly about booking/contact.
- Do NOT include van recommendation markers (**SHOW_VANS:**) in conclusion.

Return ONLY HTML starting with <p> and ending with </p>.`;

  const userPrompt = `Write a conclusion for: "${title}"

Main topics covered: ${mainPoints}
Topic: ${topic}

Make it memorable and actionable.`;

  const client4 = getOpenAI();
  const completion = await client4.chat.completions.create({
    model: "gpt-4o",
    messages: [
      systemMessage,
      { role: "user", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
  });

  let conclusion = completion.choices[0].message.content || "";

  conclusion = conclusion.replace(/```html\n?/g, "");
  conclusion = conclusion.replace(/```\n?/g, "");
  conclusion = conclusion.replace(/<!DOCTYPE[^>]*>/gi, "");
  conclusion = conclusion.replace(/<\/?html[^>]*>/gi, "");
  conclusion = conclusion.replace(/<\/?head[^>]*>/gi, "");
  conclusion = conclusion.replace(/<\/?body[^>]*>/gi, "");
  conclusion = conclusion.replace(/<title>[^<]*<\/title>/gi, "");
  conclusion = conclusion.replace(/<meta[^>]*>/gi, "");
  conclusion = conclusion.replace(/<\/?h[1-6][^>]*>/gi, "");
  conclusion = conclusion.trim();

  console.log(
    `✅ [Step Generator] Conclusion generated (${conclusion.length} chars)`,
  );

  return conclusion;
}

// ============================================================================
// STEP 5: GENERATE FAQs
// ============================================================================

export async function generateFAQs(
  topic: string,
  focusKeyword: string,
  headings: any[],
): Promise<any[]> {
  console.log(`❓ [Step Generator] Generating FAQs`);
  console.log(
    `   Total headings with content: ${headings.filter((h) => h.content).length}`,
  );

  const allowContact = isServiceRelatedTopic(topic);
  const brandContext = buildBrandContext(allowContact);
  const systemMessage = buildSystemMessage(brandContext);

  const mainTopics = headings
    .filter((h) => h.level === 2)
    .map((h) => h.text)
    .join(", ");

  const fullContent = headings
    .filter((h) => h.content)
    .map((h) => {
      const cleanContent = h.content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return `${h.text}: ${cleanContent}`;
    })
    .join("\n\n");

  const contentContext =
    fullContent.length > 3000
      ? fullContent.substring(0, 3000) + "..."
      : fullContent;

  console.log(`   Content context length: ${contentContext.length} characters`);

  const systemPrompt = `You are an expert at creating helpful, relevant FAQs based on actual blog content.

Requirements:
- Generate exactly 5-9 FAQ pairs
- Questions directly tied to the content
- Mix of basics, how-to, benefits, concerns, best practices
- Answers 50-100 words each
- Include focus keyword "${focusKeyword}" naturally in 2-3 FAQs
- Plain text only (no HTML)
- Natural, conversational Q&A
- Value-focused and actionable

BRAND USAGE:
- Do NOT include phone/address.
- Only mention "${BRAND.name}" if it genuinely helps (max once across all FAQs).
- Do NOT list brand features; keep FAQs educational.
- Do NOT include van recommendation markers (**SHOW_VANS:**) in FAQs.

Return JSON:
{
  "faqs": [
    { "id": "faq-1", "question": "...?", "answer": "..." }
  ]
}

Return ONLY valid JSON.`;

  const userPrompt = `Generate 5-9 FAQs for a blog about: "${topic}"

Main sections covered: ${mainTopics}

Blog content summary:
${contentContext}

Create FAQs that directly address information in the content above.`;

  const client5 = getOpenAI();
  const completion = await client5.chat.completions.create({
    model: "gpt-4o",
    messages: [
      systemMessage,
      { role: "user", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const result = JSON.parse(
    completion.choices[0].message.content || '{"faqs":[]}',
  );

  let faqsArray: any[] = [];
  if (Array.isArray(result)) faqsArray = result;
  else if (Array.isArray(result.faqs)) faqsArray = result.faqs;
  else if (result.faq && Array.isArray(result.faq)) faqsArray = result.faq;

  if (faqsArray.length < 5) {
    console.warn(
      `⚠️ Only ${faqsArray.length} FAQs generated, expected minimum 5`,
    );
  }
  if (faqsArray.length > 9) {
    console.warn(`⚠️ ${faqsArray.length} FAQs generated, limiting to 9`);
    faqsArray = faqsArray.slice(0, 9);
  }

  const faqs = faqsArray.map((faq: any, index: number) => ({
    ...faq,
    id: faq.id || `faq-${index + 1}`,
  }));

  console.log(`✅ [Step Generator] Generated ${faqs.length} FAQs`);

  return faqs;
}

// ============================================================================
// STEP 6: GENERATE SEO METADATA
// ============================================================================

export async function generateSEOMetadata(
  topic: string,
  title: string,
  headings: any[],
  faqs: any[],
  summary?: string,
  conclusion?: string,
): Promise<any> {
  console.log(`🔍 [Step Generator] Generating SEO metadata`);

  const allowContact = isServiceRelatedTopic(topic);
  const brandContext = buildBrandContext(allowContact);
  const systemMessage = buildSystemMessage(brandContext);

  const systemPrompt = `You are an SEO expert. Generate SEO metadata.

Requirements:
- Meta description: 140-155 characters, compelling, natural
- Tags: 7-10 relevant searchable tags
- Unique, non-robotic

BRAND USAGE:
- You MAY include "${BRAND.name}" in meta description only if topic is service-related and it fits naturally.
- Do NOT include phone/address in SEO metadata.
- Do NOT list features; keep metadata clean.

Return JSON:
{
  "seoDescription": "Meta description text",
  "tags": ["tag1", "tag2", ...]
}

Return ONLY valid JSON.`;

  const mainTopics = headings
    .filter((h) => h.level === 2)
    .slice(0, 3)
    .map((h) => h.text)
    .join(", ");

  const summaryText = summary
    ? summary.replace(/<[^>]*>/g, " ").substring(0, 200)
    : "";
  const conclusionText = conclusion
    ? conclusion.replace(/<[^>]*>/g, " ").substring(0, 200)
    : "";

  const userPrompt = `Generate SEO metadata for: "${title}"

Topic: ${topic}
Main sections: ${mainTopics}
${summaryText ? `\nSummary: ${summaryText}` : ""}
${conclusionText ? `\nConclusion: ${conclusionText}` : ""}`;

  const client6 = getOpenAI();
  const completion = await client6.chat.completions.create({
    model: "gpt-4o",
    messages: [
      systemMessage,
      { role: "user", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const result = JSON.parse(completion.choices[0].message.content || "{}");

  if (!result.author) result.author = "admin";
  result.publishDate = new Date();
  result.anchors = [];

  console.log(`✅ [Step Generator] SEO metadata generated`);

  return result;
}

// ============================================================================
// HELPER: Parse van markers from content
// ============================================================================

export interface VanMarker {
  fullMatch: string;
  vanNames: string[];
}

/**
 * Extract all **SHOW_VANS: ...** markers from content
 */
export function parseVanMarkers(content: string): VanMarker[] {
  const regex = /\*\*SHOW_VANS:\s*([^*]+)\*\*/g;
  const markers: VanMarker[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const vanNames = match[1]
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    markers.push({
      fullMatch: match[0],
      vanNames,
    });
  }

  return markers;
}

/**
 * Get van data by names (for rendering)
 */
export function getVansByNames(names: string[]): typeof VAN_FLEET {
  return VAN_FLEET.filter((van) =>
    names.some(
      (name) =>
        van.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(van.name.toLowerCase()),
    ),
  );
}

// Export van fleet for external use
export { VAN_FLEET };
