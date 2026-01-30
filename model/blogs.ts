import mongoose from "mongoose";

// ============================================================================
// SUB-SCHEMAS
// ============================================================================

// Heading/Section Schema
const HeadingItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  level: { type: Number, required: true, min: 2, max: 6 }, // H2-H6
  text: { type: String, required: true }, // Heading text (can contain HTML)
  content: { type: String, default: "" }, // Section content (full HTML)
}, { _id: false });

// Media Item Schema
const MediaItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
  alt: { type: String, required: true },
  caption: { type: String, default: "" },
  filename: { type: String, default: "" },
  size: { type: Number, default: 0 }, // File size in bytes
}, { _id: false });

// Auto-Link/Anchor Schema
const AnchorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  keyword: { type: String, required: true }, // Text to match in content
  url: { type: String, required: true }, // Link destination
}, { _id: false });

// FAQ Item Schema
const FAQItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { _id: false });

// ============================================================================
// MAIN BLOG SCHEMA
// ============================================================================

const BlogSchema = new mongoose.Schema(
  {
    // ========================================================================
    // CONTENT SECTION
    // ========================================================================
    content: {
      topic: { type: String, default: "" }, // AI generation input
      summary: { type: String, default: "" }, // Introduction (HTML)
      headings: { type: [HeadingItemSchema], default: [] }, // Main content sections
      conclusion: { type: String, default: "" }, // Conclusion section (HTML)
      faqs: { type: [FAQItemSchema], default: [] }, // FAQ items
      tableOfContents: { type: Boolean, default: true }, // Enable/disable TOC
      compiledHtml: { type: String, default: "" }, // Final compiled HTML output
    },

    // ========================================================================
    // SEO SECTION (All optional for step-by-step generation)
    // ========================================================================
    seo: {
      seoTitle: { type: String, default: "" }, // Page title (30-60 chars recommended)
      seoDescription: { type: String, default: "" }, // Meta description (120-160 chars)
      focusKeyword: { type: String, default: "" }, // Primary SEO keyword
      canonicalUrl: { type: String, default: "" }, // Canonical URL
      tags: { type: [String], default: [] }, // Content tags
      author: { type: String, default: "" }, // Author name
      publishDate: { type: Date, default: null }, // Publish date
      anchors: { type: [AnchorSchema], default: [] }, // Auto-link keywords
    },

    // ========================================================================
    // GENERATION PROGRESS TRACKING
    // ========================================================================
    generationProgress: {
      currentStep: { 
        type: String, 
        enum: ["headings", "images", "content", "summary", "conclusion", "faq", "seo", "completed"],
        default: "headings" 
      },
      currentHeadingIndex: { type: Number, default: 0 }, // Which heading content is being generated
      headingsApproved: { type: Boolean, default: false },
      imagesApproved: { type: Boolean, default: false },
      contentApproved: { type: [Boolean], default: [] }, // Track each heading approval
      summaryApproved: { type: Boolean, default: false },
      conclusionApproved: { type: Boolean, default: false },
      faqApproved: { type: Boolean, default: false },
      seoApproved: { type: Boolean, default: false },
      imageDescriptions: { type: Map, of: String, default: {} }, // Store user's image descriptions
    },

    // ========================================================================
    // MEDIA SECTION
    // ========================================================================
    media: {
      mediaLibrary: { type: [MediaItemSchema], default: [] }, // Uploaded media files
      featuredImage: { type: String, default: "" }, // Main featured image URL
    },

    // ========================================================================
    // METADATA & STATUS
    // ========================================================================
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },
    slug: { type: String, unique: true, sparse: true }, // URL-friendly slug
    views: { type: Number, default: 0 }, // View count
    readingTime: { type: Number, default: 0 }, // Estimated reading time in minutes
    wordCount: { type: Number, default: 0 }, // Total word count
    seoScore: { type: Number, default: 0, min: 0, max: 100 }, // SEO quality score (0-100)
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


// ============================================================================
// EXPORT
// ============================================================================

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
