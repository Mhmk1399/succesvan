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
 */

import { openai, generateId, getCurrentYear } from "./blog-utils";

// ============================================================================
// STEP 1: GENERATE HEADINGS TREE
// ============================================================================

export async function generateHeadingsTree(prompt: string) {
  console.log("📋 [Step Generator] Generating headings tree for:", prompt);

  const currentYear = getCurrentYear();

  const systemPrompt = `You are an expert SEO content strategist. Create a comprehensive blog post outline.

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
- Headings should flow logically
- Cover topic comprehensively
- Be specific and actionable

Return ONLY valid JSON.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Create blog outline for: ${prompt}` }
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const result = JSON.parse(completion.choices[0].message.content || "{}");

  // Add IDs to headings if not present
  if (result.headings) {
    result.headings = result.headings.map((h: any) => ({
      ...h,
      id: h.id || generateId(),
      content: ""
    }));
  }

  console.log(`✅ [Step Generator] Generated ${result.headings?.length || 0} headings`);

  return result;
}

// ============================================================================
// STEP 2: GENERATE SECTION CONTENT
// ============================================================================

export async function generateSectionContent(
  topic: string,
  headingText: string,
  level: number,
  focusKeyword: string
): Promise<string> {
  console.log(`📝 [Step Generator] Generating content for: ${headingText}`);

  const wordCount = level === 2 ? "250-350" : "150-200";

  const systemPrompt = `You are an expert blog content writer. Write high-quality, SEO-optimized content.

Requirements:
- Write ${wordCount} words
- HTML format with proper tags (<p>, <ul>, <li>, <strong>, <em>, etc.)
- Include focus keyword "${focusKeyword}" naturally if relevant
- Short paragraphs (2-3 sentences)
- Use bullet points or lists where appropriate
- Be informative and actionable
- Professional but conversational tone
- Include specific examples or data

Return ONLY the HTML content (no heading tags).`;

  const userPrompt = `Write content for the section: "${headingText}"

Blog topic: ${topic}
Heading level: H${level}

Make it engaging, informative, and valuable to the reader.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content || "";

  console.log(`✅ [Step Generator] Content generated (${content.length} chars)`);

  return content;
}

// ============================================================================
// STEP 3: GENERATE SUMMARY
// ============================================================================

export async function generateSummary(
  topic: string,
  title: string,
  focusKeyword: string
): Promise<string> {
  console.log(`📋 [Step Generator] Generating summary for: ${topic}`);

  const systemPrompt = `You are an expert blog writer. Write an engaging introduction/summary.

Requirements:
- 120-150 words
- Hook the reader immediately
- Clearly state what the article covers
- Include focus keyword: "${focusKeyword}"
- HTML format with proper tags
- Conversational but professional tone

Return ONLY the HTML content.`;

  const userPrompt = `Write an introduction for a blog post titled: "${title}"

Topic: ${topic}

Make it compelling and encourage readers to continue.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  const summary = completion.choices[0].message.content || "";

  console.log(`✅ [Step Generator] Summary generated`);

  return summary;
}

// ============================================================================
// STEP 4: GENERATE CONCLUSION
// ============================================================================

export async function generateConclusion(
  topic: string,
  title: string,
  focusKeyword: string,
  headings: any[]
): Promise<string> {
  console.log(`🎯 [Step Generator] Generating conclusion`);

  const mainPoints = headings
    .filter(h => h.level === 2)
    .slice(0, 3)
    .map(h => h.text)
    .join(", ");

  const systemPrompt = `You are an expert blog writer. Write a powerful conclusion.

Requirements:
- 120-150 words
- Summarize key takeaways
- Include call-to-action or next steps
- End on inspiring or actionable note
- Include focus keyword: "${focusKeyword}"
- HTML format with proper tags

Return ONLY the HTML content.`;

  const userPrompt = `Write a conclusion for: "${title}"

Main topics covered: ${mainPoints}
Topic: ${topic}

Make it memorable and actionable.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  const conclusion = completion.choices[0].message.content || "";

  console.log(`✅ [Step Generator] Conclusion generated`);

  return conclusion;
}

// ============================================================================
// STEP 5: GENERATE FAQs
// ============================================================================

export async function generateFAQs(
  topic: string,
  focusKeyword: string,
  headings: any[]
): Promise<any[]> {
  console.log(`❓ [Step Generator] Generating FAQs`);

  const mainTopics = headings
    .filter(h => h.level === 2)
    .map(h => h.text)
    .join(", ");

  const systemPrompt = `You are an expert at creating helpful FAQs. Generate common questions and answers.

Requirements:
- Generate 5-7 FAQ pairs
- Questions should be common queries about the topic
- Answers should be clear and concise (50-80 words)
- Include focus keyword "${focusKeyword}" naturally where relevant
- Plain text for both questions and answers

Return JSON array:
[
  {
    "id": "unique-id",
    "question": "Question text?",
    "answer": "Answer text."
  }
]

Return ONLY valid JSON array.`;

  const userPrompt = `Generate FAQs for a blog about: ${topic}

Main sections covered: ${mainTopics}

Focus on questions readers would commonly ask.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const result = JSON.parse(completion.choices[0].message.content || '{"faqs":[]}');
  
  // Handle both {faqs: [...]} and direct array formats
  let faqsArray = [];
  if (Array.isArray(result)) {
    faqsArray = result;
  } else if (Array.isArray(result.faqs)) {
    faqsArray = result.faqs;
  } else if (result.faq && Array.isArray(result.faq)) {
    faqsArray = result.faq;
  }
  
  const faqs = faqsArray.map((faq: any) => ({
    ...faq,
    id: faq.id || generateId()
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
  faqs: any[]
): Promise<any> {
  console.log(`🔍 [Step Generator] Generating SEO metadata`);

  const systemPrompt = `You are an SEO expert. Generate comprehensive SEO metadata.

Requirements:
- Meta description: 140-155 characters, compelling, includes main keyword
- Tags: 7-10 relevant, searchable tags
- Author: "Content Team" or similar
- Anchors: 5-7 keywords that would benefit from internal linking

Return JSON:
{
  "seoDescription": "Meta description text",
  "tags": ["tag1", "tag2", ...],
  "author": "Author name",
  "anchors": [
    {
      "id": "unique-id",
      "keyword": "keyword phrase",
      "url": ""
    }
  ]
}

Return ONLY valid JSON.`;

  const mainTopics = headings
    .filter(h => h.level === 2)
    .slice(0, 3)
    .map(h => h.text)
    .join(", ");

  const userPrompt = `Generate SEO metadata for: "${title}"

Topic: ${topic}
Main sections: ${mainTopics}

Make it SEO-optimized and compelling.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const result = JSON.parse(completion.choices[0].message.content || "{}");

  // Add IDs to anchors
  if (result.anchors) {
    result.anchors = result.anchors.map((a: any) => ({
      ...a,
      id: a.id || generateId(),
      url: a.url || ""
    }));
  }

  // Set publish date to now
  result.publishDate = new Date();

  console.log(`✅ [Step Generator] SEO metadata generated`);
  console.log(`   - Tags: ${result.tags?.length || 0}`);
  console.log(`   - Anchors: ${result.anchors?.length || 0}`);

  return result;
}
