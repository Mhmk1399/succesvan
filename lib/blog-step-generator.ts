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

import { generateId, getCurrentYear } from "./blog-utils";
import { getOpenAI } from "./openai";

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

  const client = getOpenAI();
  const completion = await client.chat.completions.create({
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

  const client3 = getOpenAI();
  const completion = await client3.chat.completions.create({
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
- 120-180 words
- Hook the reader immediately with a question or intriguing statement
- Clearly state what the article covers
- Include focus keyword: "${focusKeyword}" naturally
- Use proper HTML tags: <p>, <strong>, <em>
- Write 2-3 short paragraphs maximum
- Conversational but professional tone

IMPORTANT:
- Return ONLY the HTML content (no \`\`\`html wrapper)
- Do NOT include <!DOCTYPE>, <html>, <head>, <body>, or <title> tags
- Start directly with <p> tags
- End with closing </p> tag

Example:
<p>Have you ever wondered about...? In this comprehensive guide, we'll explore <strong>keyword</strong>.</p>
<p>Whether you're new or experienced, this article covers everything you need to know...</p>`;

  const userPrompt = `Write an introduction for a blog post titled: "${title}"

Topic: ${topic}

Make it compelling and encourage readers to continue.`;

  const client3 = getOpenAI();
  const completion = await client3.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  let summary = completion.choices[0].message.content || "";

  // Clean up any markdown wrappers or document tags
  summary = summary.replace(/```html\n?/g, '');
  summary = summary.replace(/```\n?/g, '');
  summary = summary.replace(/<!DOCTYPE[^>]*>/gi, '');
  summary = summary.replace(/<\/?html[^>]*>/gi, '');
  summary = summary.replace(/<\/?head[^>]*>/gi, '');
  summary = summary.replace(/<\/?body[^>]*>/gi, '');
  summary = summary.replace(/<title>[^<]*<\/title>/gi, '');
  summary = summary.replace(/<meta[^>]*>/gi, '');
  summary = summary.trim();

  console.log(`✅ [Step Generator] Summary generated (${summary.length} chars)`);

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
- Summarize key takeaways from the article
- Include call-to-action or next steps for readers
- End on inspiring or actionable note
- Include focus keyword: "${focusKeyword}" naturally
- Use proper HTML tags: <p>, <strong>, <em>
- Write 2-3 short paragraphs
- Professional and motivating tone

IMPORTANT:
- Return ONLY the HTML content (no \`\`\`html wrapper)
- Do NOT include heading tags (<h1>, <h2>, etc.)
- Do NOT include <!DOCTYPE>, <html>, <head>, <body> tags
- Start directly with <p> tags
- End with closing </p> tag

Example output:
<p>As we've explored throughout this guide, <strong>keyword</strong> is essential for success. The key takeaways are clear...</p>
<p>Now it's your turn to take action. Start by implementing these strategies and watch your results improve.</p>`;

  const userPrompt = `Write a conclusion for: "${title}"

Main topics covered: ${mainPoints}
Topic: ${topic}

Make it memorable and actionable.`;

  const client4 = getOpenAI();
  const completion = await client4.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  let conclusion = completion.choices[0].message.content || "";

  // Clean up any markdown wrappers, heading tags, or document structure
  conclusion = conclusion.replace(/```html\n?/g, '');
  conclusion = conclusion.replace(/```\n?/g, '');
  conclusion = conclusion.replace(/<!DOCTYPE[^>]*>/gi, '');
  conclusion = conclusion.replace(/<\/?html[^>]*>/gi, '');
  conclusion = conclusion.replace(/<\/?head[^>]*>/gi, '');
  conclusion = conclusion.replace(/<\/?body[^>]*>/gi, '');
  conclusion = conclusion.replace(/<title>[^<]*<\/title>/gi, '');
  conclusion = conclusion.replace(/<meta[^>]*>/gi, '');
  conclusion = conclusion.replace(/<\/?h[1-6][^>]*>/gi, ''); // Remove any heading tags
  conclusion = conclusion.trim();

  console.log(`✅ [Step Generator] Conclusion generated (${conclusion.length} chars)`);

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
  console.log(`   Total headings with content: ${headings.filter(h => h.content).length}`);

  // Extract main topics from H2 headings
  const mainTopics = headings
    .filter(h => h.level === 2)
    .map(h => h.text)
    .join(", ");

  // Extract full content from all headings to provide context
  const fullContent = headings
    .filter(h => h.content)
    .map(h => {
      // Strip HTML tags for cleaner context
      const cleanContent = h.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      return `${h.text}: ${cleanContent}`;
    })
    .join('\n\n');

  // Limit content length to avoid token limits (keep first 3000 chars)
  const contentContext = fullContent.length > 3000 
    ? fullContent.substring(0, 3000) + '...' 
    : fullContent;

  console.log(`   Content context length: ${contentContext.length} characters`);

  const systemPrompt = `You are an expert at creating helpful, relevant FAQs based on actual blog content. Generate questions that readers would commonly ask after reading the article.

Requirements:
- Generate exactly 5-9 FAQ pairs (minimum 5, maximum 9)
- Questions should be directly related to the content provided
- Cover different aspects: basics, how-to, benefits, common concerns, best practices
- Answers should be clear, concise, and informative (50-100 words each)
- Include focus keyword "${focusKeyword}" naturally in 2-3 FAQs
- Use plain text for both questions and answers (no HTML)
- Questions should sound natural and conversational
- Answers should provide value and actionable information

Question types to consider:
- "What is/are...?" (definition questions)
- "How do I/can I...?" (practical how-to questions)  
- "Why should I...?" (benefit-focused questions)
- "When is the best time to...?" (timing questions)
- "What are the common mistakes/challenges with...?" (problem-solving)

Return JSON object with "faqs" array:
{
  "faqs": [
    {
      "id": "faq-1",
      "question": "Question text ending with?",
      "answer": "Detailed answer providing value and insights."
    }
  ]
}

IMPORTANT: Return ONLY valid JSON. No additional text or explanation.`;

  const userPrompt = `Generate 5-9 FAQs for a blog about: "${topic}"

Main sections covered: ${mainTopics}

Blog content summary:
${contentContext}

Create FAQs that directly address information in the content above. Make questions specific and answers helpful.`;

  const client5 = getOpenAI();
  const completion = await client5.chat.completions.create({
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
  
  // Ensure we have at least 5 FAQs and at most 9
  if (faqsArray.length < 5) {
    console.warn(`⚠️ Only ${faqsArray.length} FAQs generated, expected minimum 5`);
  }
  if (faqsArray.length > 9) {
    console.warn(`⚠️ ${faqsArray.length} FAQs generated, limiting to 9`);
    faqsArray = faqsArray.slice(0, 9);
  }
  
  const faqs = faqsArray.map((faq: any, index: number) => ({
    ...faq,
    id: faq.id || `faq-${index + 1}`
  }));

  console.log(`✅ [Step Generator] Generated ${faqs.length} FAQs`);
  console.log(`   Questions: ${faqs.map((f: any) => f.question.substring(0, 50)).join(', ')}`);

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
  conclusion?: string
): Promise<any> {
  console.log(`🔍 [Step Generator] Generating SEO metadata`);

  const systemPrompt = `You are an SEO expert. Generate comprehensive SEO metadata.

Requirements:
- Meta description: 140-155 characters, compelling, includes main keyword
- Tags: 7-10 relevant, searchable tags (mix of broad and specific terms)

Return JSON:
{
  "seoDescription": "Meta description text",
  "tags": ["tag1", "tag2", ...]
}

Return ONLY valid JSON.`;

  const mainTopics = headings
    .filter(h => h.level === 2)
    .slice(0, 3)
    .map(h => h.text)
    .join(", ");

  // Extract summary and conclusion text for context
  const summaryText = summary ? summary.replace(/<[^>]*>/g, ' ').substring(0, 200) : '';
  const conclusionText = conclusion ? conclusion.replace(/<[^>]*>/g, ' ').substring(0, 200) : '';

  const userPrompt = `Generate SEO metadata for: "${title}"

Topic: ${topic}
Main sections: ${mainTopics}
${summaryText ? `\nSummary: ${summaryText}` : ''}
${conclusionText ? `\nConclusion: ${conclusionText}` : ''}

Make it SEO-optimized and compelling.`;

  const client6 = getOpenAI();
  const completion = await client6.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const result = JSON.parse(completion.choices[0].message.content || "{}");

  // Set default author
  if (!result.author) {
    result.author = 'admin';
  }

  // Set publish date to now
  result.publishDate = new Date();

  // Initialize empty anchors array (will be populated by anchor generator)
  result.anchors = [];

  console.log(`✅ [Step Generator] SEO metadata generated`);
  console.log(`   - Tags: ${result.tags?.length || 0}`);
  console.log(`   - Description: ${result.seoDescription?.length || 0} chars`);

  return result;
}
