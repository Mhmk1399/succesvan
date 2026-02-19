/**
 * DALL-E Image Generator for Blog Content
 *
 * Generates relevant, high-quality images for blog sections using OpenAI DALL-E
 * ✅ Van preference:
 * - If the scene involves vans, prefer Mercedes Sprinter or Ford Transit (no logos/text)
 * ✅ London Visual Style:
 * - UK/London streets, architecture, lighting, and realistic commercial photography vibe
 */

import { getOpenAI } from "./openai";

// ============================================================================
// IMAGE CONTEXT RULES
// ============================================================================

const IMAGE_RULES = {
  preferredVans: [
    "a modern Mercedes Sprinter-style cargo van (generic, no logos, no badges)",
    "a modern Ford Transit-style cargo van (generic, no logos, no badges)",
  ],

  globalMustNots: [
    "no text",
    "no letters",
    "no logos",
    "no watermarks",
    "no readable license plates",
    "no visible brand marks on vehicles",
    "no signage with readable text",
  ],

  londonVisualStyle: `
LONDON VISUAL STYLE (IMPORTANT):
- The environment should feel like London / United Kingdom
- Use realistic London street atmosphere: brick buildings, modern UK architecture, narrow streets, industrial areas, business parks
- Subtle UK urban details: wet pavement, cloudy sky, soft diffused daylight, realistic street perspective
- Photorealistic commercial photography look, like a real UK fleet rental website header
- Background should include negative space for title overlay (sky/building blur/road blur)
- Avoid iconic copyrighted landmarks (do NOT use Big Ben, Tower Bridge, London Eye)
- Keep it modern, clean, professional, premium business vibe
`.trim(),
};

/**
 * Quick heuristic: does this heading/topic likely need a van in the image?
 */
function isVanRelated(
  topic: string,
  headingText: string,
  userDescription?: string,
) {
  const t = `${topic} ${headingText} ${userDescription || ""}`.toLowerCase();

  const keywords = [
    "van",
    "van hire",
    "rental",
    "rent a van",
    "cargo",
    "delivery",
    "moving",
    "removal",
    "fleet",
    "courier",
    "logistics",
    "transport",
    "b2b",
    "commercial vehicle",
    "business van",
    "london",
    "uk",
    "ulez",
  ];

  return keywords.some((k) => t.includes(k));
}

/**
 * Generate an image for a blog heading using DALL-E
 */
export async function generateBlogImage(
  topic: string,
  headingText: string,
  userDescription?: string,
): Promise<{ url: string; revisedPrompt: string }> {
  console.log(`🎨 [Image Generator] Generating image for: ${headingText}`);

  let imagePrompt: string;

  // If user provided a description, use it (but add London + van preference if relevant)
  if (userDescription && userDescription.trim()) {
    const vanRelated = isVanRelated(topic, headingText, userDescription);

    imagePrompt = `
${userDescription.trim()}

${IMAGE_RULES.londonVisualStyle}

${vanRelated ? `If a van is visible, prefer: ${IMAGE_RULES.preferredVans.join(" OR ")}.` : ""}

Hard rules: ${IMAGE_RULES.globalMustNots.join(", ")}.
`.trim();

    console.log(`   Using user description + London style`);
  } else {
    console.log(`   Generating optimized DALL-E prompt...`);
    imagePrompt = await generateImagePrompt(topic, headingText);
  }

  console.log(`   Creating image with DALL-E...`);

  const client = getOpenAI();
  const response = await client.images.generate({
    model: "dall-e-3",
    prompt: imagePrompt,
    n: 1,
    size: "1792x1024",
    quality: "medium",
    style: "natural",
  });

  if (!response || !response.data || response.data.length === 0) {
    throw new Error("Failed to generate image - no data returned");
  }

  const imageUrl = response.data[0].url;
  const revisedPrompt = response.data[0].revised_prompt || imagePrompt;

  if (!imageUrl) {
    throw new Error("Failed to generate image - no URL returned");
  }

  console.log(`✅ [Image Generator] Image created successfully`);
  console.log(`   - URL: ${imageUrl.substring(0, 50)}...`);

  return {
    url: imageUrl,
    revisedPrompt,
  };
}

/**
 * Use GPT to create an optimized DALL-E prompt
 */
async function generateImagePrompt(
  topic: string,
  headingText: string,
): Promise<string> {
  const vanRelated = isVanRelated(topic, headingText);

  const vanDirective = vanRelated
    ? `
VAN PREFERENCE (IMPORTANT):
- The image should include a modern cargo van if it fits naturally.
- Prefer either:
  1) Mercedes Sprinter-style cargo van (generic, no logos/badges)
  2) Ford Transit-style cargo van (generic, no logos/badges)
- Keep vehicle branding invisible: no logos, no badges, no readable plates.
`
    : "";

  const systemPrompt = `You are an expert at writing photorealistic prompts for DALL·E blog header images.

Goal: generate a REALISTIC, sharp, high-resolution PHOTO (not illustration).

Hard requirements:
- Photorealistic, natural lighting, real-world materials and textures
- Sharp focus, high clarity, realistic colors (no neon/cartoon palette)
- Documentary / commercial photography look
- No illustration, no 3D render, no cartoon, no anime, no vector, no CGI
- No text, no letters, no logos, no watermarks in the image
- Avoid readable license plates or signage text
- Suitable as a wide blog header (16:9 vibe)
- Composition should include negative space for title overlay

${IMAGE_RULES.londonVisualStyle}

${vanDirective}

Prompt structure:
1) Scene subject and setting (concrete, not abstract)
2) Camera/lens/lighting (e.g. 35mm, soft daylight, shallow depth of field)
3) Composition (wide header, negative space for title overlay)
4) Quality tags (ultra-detailed, high resolution, crisp)

Return ONLY the final prompt text, nothing else.`;

  const userPrompt = `Write a photorealistic DALL·E prompt for a blog header image.

Blog Topic: ${topic}
Section Heading: ${headingText}

Make it a REAL photo-like scene that represents this section. Avoid any illustration styles. Include composition with some negative space for overlay text.`;

  const client2 = getOpenAI();
  const completion = await client2.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 220,
  });

  const prompt =
    completion.choices[0].message.content?.trim() ||
    `Photorealistic commercial photo scene representing "${headingText}" related to "${topic}", London UK street atmosphere, wide composition with negative space, natural diffused daylight, ultra-detailed, sharp focus, no text, no logos, no watermarks.`;

  // Final safety nudge
  const finalMustNots = IMAGE_RULES.globalMustNots.join(", ");
  const finalVanHint = vanRelated
    ? ` If a van is visible, prefer: ${IMAGE_RULES.preferredVans.join(" OR ")}.`
    : "";

  return `${prompt}${finalVanHint} ${finalMustNots}.`;
}

/**
 * Generate a placeholder image URL (for testing without DALL-E costs)
 */
export function generatePlaceholderImage(
  headingText: string,
  width: number = 1200,
  height: number = 600,
): string {
  const text = encodeURIComponent(headingText.substring(0, 50));
  return `https://placehold.co/${width}x${height}/fe9a00/fff?text=${text}`;
}

/**
 * Batch generate images for multiple headings
 */
export async function generateBatchImages(
  topic: string,
  headings: Array<{ id: string; text: string; level: number }>,
  descriptions?: Record<string, string>,
): Promise<Array<{ headingId: string; url: string; error?: string }>> {
  console.log(
    `🎨 [Image Generator] Batch generating ${headings.length} images`,
  );

  const results: Array<{ headingId: string; url: string; error?: string }> = [];

  for (const heading of headings) {
    // Only generate for H1 and H2
    if (heading.level > 2) {
      console.log(`   ⏭️ Skipping ${heading.text} (H${heading.level})`);
      continue;
    }

    try {
      const description = descriptions?.[heading.id];
      const imageData = await generateBlogImage(
        topic,
        heading.text,
        description,
      );

      results.push({
        headingId: heading.id,
        url: imageData.url,
      });

      console.log(`   ✅ Generated image for: ${heading.text}`);

      // Rate limiting: wait 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.log(
        `   ❌ Failed to generate image for ${heading.text}:`,
        message,
      );

      results.push({
        headingId: heading.id,
        url: "",
        error: message,
      });
    }
  }

  console.log(
    `✅ [Image Generator] Batch complete: ${
      results.filter((r) => !r.error).length
    }/${headings.length} succeeded`,
  );

  return results;
}
