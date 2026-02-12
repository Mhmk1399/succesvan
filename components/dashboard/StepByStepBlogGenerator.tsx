"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  FiZap,
  FiCheck,
  FiRefreshCw,
  FiChevronRight,
  FiLoader,
  FiEdit3,
  FiImage,
  FiFileText,
  FiBookOpen,
  FiTarget,
  FiMessageSquare,
  FiGlobe,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

// ============================================================================
// TYPES
// ============================================================================

interface HeadingItem {
  id: string;
  level: number;
  text: string;
  content: string;
}

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  s3Key?: string;
  alt: string;
  caption?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface Anchor {
  id: string;
  keyword: string;
  url: string;
}

interface GenerationProgress {
  currentStep:
    | "headings"
    | "images"
    | "content"
    | "summary"
    | "conclusion"
    | "faq"
    | "seo"
    | "completed";
  currentHeadingIndex: number;
  headingsApproved: boolean;
  imagesApproved: boolean;
  imageApproved: boolean[];
  contentApproved: boolean[];
  summaryApproved: boolean;
  conclusionApproved: boolean;
  faqApproved: boolean;
  seoApproved: boolean;
}

export interface StepGeneratorData {
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  tags: string[];
  author: string;
  publishDate: string;
  headings: HeadingItem[];
  canonicalUrl: string;
  summary: string;
  conclusion: string;
  faqs: FAQItem[];
  anchors: Anchor[];
  mediaLibrary: MediaItem[];
}

interface StepByStepBlogGeneratorProps {
  topic: string;
  data?: Partial<StepGeneratorData>;
  onDataUpdate: (data: Partial<StepGeneratorData>) => void;
  onComplete: () => void;
  blogId?: string; // Added for edit mode
}

type StepKey =
  | "headings"
  | "images"
  | "content"
  | "summary"
  | "conclusion"
  | "faq"
  | "seo";

interface StepInfo {
  key: StepKey;
  title: string;
  icon: React.ReactNode;
  description: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STEPS: StepInfo[] = [
  {
    key: "headings",
    title: "Generate Structure",
    icon: <FiEdit3 size={16} />,
    description: "Create blog outline with headings",
  },
  {
    key: "content",
    title: "Generate Content",
    icon: <FiFileText size={16} />,
    description: "Write section content",
  },
  {
    key: "images",
    title: "Generate Images",
    icon: <FiImage size={16} />,
    description: "Create images for headings",
  },
  {
    key: "summary",
    title: "Generate Summary",
    icon: <FiBookOpen size={16} />,
    description: "Create introduction paragraph",
  },
  {
    key: "conclusion",
    title: "Generate Conclusion",
    icon: <FiTarget size={16} />,
    description: "Write closing thoughts",
  },
  {
    key: "faq",
    title: "Generate FAQs",
    icon: <FiMessageSquare size={16} />,
    description: "Common questions & answers",
  },
  {
    key: "seo",
    title: "Generate SEO",
    icon: <FiGlobe size={16} />,
    description: "Meta tags and keywords",
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function StepByStepBlogGenerator({
  topic,
  data,
  onDataUpdate,
  onComplete,
  blogId: initialBlogId,
}: StepByStepBlogGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepKey>("headings");
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [blogId, setBlogId] = useState<string | null>(initialBlogId || null);
  const [allHeadings, setAllHeadings] = useState<HeadingItem[]>([]);
  const [headingsForImages, setHeadingsForImages] = useState<HeadingItem[]>([]);
  const [generatedImages, setGeneratedImages] = useState<MediaItem[]>([]);

  const [progress, setProgress] = useState<GenerationProgress>({
    currentStep: "headings",
    currentHeadingIndex: 0,
    headingsApproved: false,
    imagesApproved: false,
    imageApproved: [],
    contentApproved: [],
    summaryApproved: false,
    conclusionApproved: false,
    faqApproved: false,
    seoApproved: false,
  });

  // ========================================================================
  // API CALLS
  // ========================================================================

  const callStepAPI = useCallback(
    async (
      step: StepKey,
      action: "generate" | "approve" | "regenerate",
      additionalData?: any,
    ) => {
      try {
        setLoading(true);

        const payload: any = {
          mode: "step",
          step,
          action,
          prompt: topic, // Backend expects 'prompt' not 'topic'
          ...(blogId && { blogId }),
          ...additionalData,
        };

        const response = await fetch("/api/blog/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Generation failed");
        }

        const result = await response.json();

        // Save blog ID from first response
        if (result.blogId && !blogId) {
          setBlogId(result.blogId);
        }

        setGeneratedData(result.data);
        return result;
      } catch (error: any) {
        console.log("Step API Error:", error);
        toast.error(error.message || "Failed to generate content");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [topic, blogId],
  );

  // ========================================================================
  // INITIALIZE FROM DATABASE DATA (FOR EDIT MODE)
  // ========================================================================

  // Initialize headingsForImages from parent data when available (edit mode)
  // This ensures that when editing an existing blog, we use the actual heading IDs from the database
  useEffect(() => {
    if (data?.headings && data.headings.length > 0) {
      // Check if we need to sync headings from database
      const headings = data.headings;
      const needsSync =
        headingsForImages.length === 0 ||
        !headingsForImages.some((h) =>
          headings.find((dh: any) => dh.id === h.id),
        );

      if (needsSync) {
        setHeadingsForImages(data.headings);
      }
    }
  }, [data, data?.headings, headingsForImages]);

  // Initialize allHeadings from parent data when available (edit mode)
  useEffect(() => {
    const headings = data?.headings;

    if (data?.headings && data.headings.length > 0) {
      const needsSync =
        allHeadings.length === 0 ||
        !allHeadings.some((h) => headings?.find((dh: any) => dh.id === h.id));

      if (needsSync) {
        setAllHeadings(data.headings);
      }
    }
  }, [data, data?.headings, allHeadings]);

  // Initialize generatedImages from parent data when available (edit mode)
  useEffect(() => {
    if (data?.mediaLibrary && data.mediaLibrary.length > 0) {
      const existingImages = data.mediaLibrary.filter(
        (m) => m.type === "image",
      );
      const needsSync =
        generatedImages.length === 0 ||
        !existingImages.some((ei) =>
          generatedImages.find((gi) => gi.id === ei.id),
        );

      if (needsSync) {
        setGeneratedImages(existingImages);
      }
    }
  }, [data, data?.mediaLibrary, generatedImages]);

  // ========================================================================
  // STEP HANDLERS
  // ========================================================================

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first!");
      return;
    }

    // Validate prerequisite steps
    const stepOrder: StepKey[] = [
      "headings",
      "content",
      "images",
      "summary",
      "conclusion",
      "faq",
      "seo",
    ];
    const currentStepIndex = stepOrder.indexOf(currentStep);

    // Check if previous steps are completed (using data from parent)
    if (currentStepIndex > 0) {
      const prevStep = stepOrder[currentStepIndex - 1];
      const prevStepCompleted = isStepCompleted(prevStep);

      // Also check parent data
      let parentDataCompleted = false;
      if (data) {
        switch (prevStep) {
          case "headings":
            parentDataCompleted = !!(data.headings && data.headings.length > 0);
            break;
          case "images":
            parentDataCompleted = !!(
              data.mediaLibrary && data.mediaLibrary.length > 0
            );
            break;
          case "content":
            parentDataCompleted = !!(
              data.headings &&
              data.headings.some(
                (h) => h.content && h.content.trim().length > 0,
              )
            );
            break;
          case "summary":
            parentDataCompleted = !!data.summary;
            break;
          case "conclusion":
            parentDataCompleted = !!data.conclusion;
            break;
          case "faq":
            parentDataCompleted = !!(data.faqs && data.faqs.length > 0);
            break;
          case "seo":
            parentDataCompleted = !!(
              data.seoTitle ||
              data.focusKeyword ||
              (data.tags && data.tags.length > 0)
            );
            break;
        }
      }

      if (!prevStepCompleted && !parentDataCompleted) {
        const stepTitle = STEPS.find((s) => s.key === prevStep)?.title;
        toast.error(`Please complete "${stepTitle}" step first!`);
        setCurrentStep(prevStep);
        return;
      }
    }

    // Check if headings step is completed for steps that require blogId
    const stepsRequiringBlogId: StepKey[] = [
      "images",
      "content",
      "summary",
      "conclusion",
      "faq",
      "seo",
    ];
    if (stepsRequiringBlogId.includes(currentStep)) {
      // Check if we have headings from parent data or local state
      const hasHeadings =
        (data?.headings && data.headings.length > 0) || allHeadings.length > 0;

      if (!blogId) {
        if (!hasHeadings) {
          toast.error('Please complete "Generate Structure" step first!');
          setCurrentStep("headings");
          return;
        }
        // We have headings but no blogId - this can happen when switching from full mode
        // We'll try to proceed, but content step requires heading index
        if (
          currentStep === "content" &&
          currentHeadingIndex === 0 &&
          allHeadings.length === 0 &&
          data?.headings
        ) {
          // Set heading index to 0 and use headings from parent
          setCurrentHeadingIndex(0);
        }
      }

      // Content step also requires heading index
      if (currentStep === "content") {
        const hasContentHeadings =
          (data?.headings && data.headings.length > 0) ||
          allHeadings.length > 0;
        if (!hasContentHeadings) {
          toast.error(
            'No headings found! Please complete "Generate Structure" step first.',
          );
          setCurrentStep("headings");
          return;
        }
        // Ensure we have a valid heading index
        if (
          currentHeadingIndex >= allHeadings.length &&
          allHeadings.length > 0
        ) {
          setCurrentHeadingIndex(0);
        }
      }
    }

    try {
      const additionalData: any = {};

      // Content step requires headingIndex
      if (currentStep === "content") {
        // Use headings from parent data if local state is empty
        if (allHeadings.length === 0 && data?.headings) {
          setAllHeadings(data.headings);
        }

        // Check if we've already generated all headings
        const headingsToUse =
          allHeadings.length > 0 ? allHeadings : data?.headings || [];
        if (
          headingsToUse.length > 0 &&
          currentHeadingIndex >= headingsToUse.length
        ) {
          console.log(
            `⚠️ All headings (${headingsToUse.length}) already have content generated`,
          );
          toast.error(`All content generated! Moving to summary step...`);
          // Move to summary step
          const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
          if (currentIndex < STEPS.length - 1) {
            const nextStep = STEPS[currentIndex + 1].key;
            setCurrentStep(nextStep);
            setGeneratedData(null);
          }
          return;
        }
        additionalData.headingIndex = currentHeadingIndex;
        console.log(
          `🎯 Generating content for heading index ${currentHeadingIndex} of ${headingsToUse.length}`,
        );
      }

      const result = await callStepAPI(currentStep, "generate", additionalData);

      // Show which heading we just generated
      if (currentStep === "content" && result.data?.heading) {
        toast.success(`Content generated for: ${result.data.heading.text}`);
      } else {
        toast.success(
          `${STEPS.find((s) => s.key === currentStep)?.title} generated!`,
        );
      }
    } catch (error: any) {
      // Better error handling
      console.log("Generation error:", error);
      if (error.message?.includes("Blog ID")) {
        toast.error(
          'Please complete "Generate Structure" step first to get a Blog ID.',
        );
        setCurrentStep("headings");
      } else if (error.message?.includes("heading index")) {
        toast.error("Invalid heading index. Please try again.");
      } else {
        toast.error(error.message || "Generation failed. Please try again.");
      }
    }
  };

  const handleRegenerate = async () => {
    try {
      const additionalData: any = {};

      // Content step requires headingIndex
      if (currentStep === "content") {
        additionalData.headingIndex = currentHeadingIndex;
      }

      const result = await callStepAPI(
        currentStep,
        "regenerate",
        additionalData,
      );

      if (currentStep === "content" && result.data?.heading) {
        toast.success(`Content regenerated for: ${result.data.heading.text}`);
      } else {
        toast.success("Content regenerated!");
      }
    } catch (error) {
      // Error handled in callStepAPI
    }
  };

  // Handle step click to switch between steps
  const handleStepClick = (stepKey: StepKey) => {
    setCurrentStep(stepKey);
    setGeneratedData(null);

    // Reset content index when switching to content step
    if (stepKey === "content") {
      setCurrentHeadingIndex(0);
    }

    // Reset image index when switching to images step
    if (stepKey === "images") {
      setCurrentImageIndex(0);
    }
  };

  // ========================================================================
  // IMAGE GENERATION HANDLERS
  // ========================================================================

  const handleImageGenerate = async () => {
    if (!blogId) {
      toast.error("Blog ID not found. Please approve headings first.");
      return;
    }

    // Use heading from database data if available (edit mode), otherwise use local state
    const availableHeadings =
      data?.headings && data.headings.length > 0
        ? data.headings
        : headingsForImages;
    const headingForImage = availableHeadings[currentImageIndex];

    if (!headingForImage) {
      toast.error("No heading available for image generation");
      return;
    }

    // Debug log to help identify heading ID issues
    console.log(
      `🎨 [ImageGen] Using heading ID: ${headingForImage.id}, text: ${headingForImage.text}`,
    );

    try {
      setLoading(true);

      console.log(
        `🎨 [StepGenerator] Generating image for heading: ${headingForImage.text}`,
      );

      const response = await fetch("/api/blog/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId,
          headingId: headingForImage.id,
          insertIntoContent: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Image generation failed");
      }

      const result = await response.json();

      console.log(`✅ [StepGenerator] Image generated:`, result);

      // Add to generated images
      const newImage: MediaItem = {
        id: result.mediaItem.id,
        type: "image",
        url: result.mediaItem.url,
        s3Key: result.mediaItem.s3Key,
        alt: result.mediaItem.alt,
        caption: result.mediaItem.caption,
      };

      setGeneratedImages((prev) => [...prev, newImage]);

      // Update the heading content with the image
      const updatedHeadings = [...allHeadings];
      const headingIndex = updatedHeadings.findIndex(
        (h) => h.id === headingForImage.id,
      );
      if (headingIndex !== -1) {
        const imageHtml = `<figure class="my-6">\n  <img src="${result.mediaItem.url}" alt="${result.mediaItem.alt}" class="w-full rounded-xl shadow-lg" />\n</figure>`;
        updatedHeadings[headingIndex] = {
          ...updatedHeadings[headingIndex],
          content: imageHtml + (updatedHeadings[headingIndex].content || ""),
        };
        setAllHeadings(updatedHeadings);
      }

      // Update parent component with headings and mediaLibrary
      onDataUpdate({
        headings: updatedHeadings,
        mediaLibrary: [...generatedImages, newImage],
      });

      // Mark this image as approved
      const newProgress = { ...progress };
      if (!newProgress.imageApproved[currentImageIndex]) {
        newProgress.imageApproved[currentImageIndex] = true;
      }
      setProgress(newProgress);

      setGeneratedData({
        image: newImage,
        heading: headingForImage,
        headingIndex: currentImageIndex,
        totalHeadings: headingsForImages.length,
      });

      toast.success(`Image generated for: ${headingForImage.text}`);
    } catch (error: any) {
      console.log("Image generation error:", error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleImageApprove = async () => {
    const isLastImage = currentImageIndex >= headingsForImages.length - 1;

    if (isLastImage) {
      // All images done, move to summary step
      const currentIndex = STEPS.findIndex((s) => s.key === "images");
      const nextStep = STEPS[currentIndex + 1].key;
      setCurrentStep(nextStep);

      const newProgress = { ...progress };
      newProgress.imagesApproved = true;
      newProgress.currentStep = nextStep;
      setProgress(newProgress);

      setCurrentImageIndex(0);
      setGeneratedData(null);

      toast.success("All images generated! Moving to summary step...");
    } else {
      // Move to next image
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      setGeneratedData(null);

      const newProgress = { ...progress };
      newProgress.currentHeadingIndex = nextIndex;
      setProgress(newProgress);

      toast.success(
        `Image ${currentImageIndex + 1} approved. Ready for image ${nextIndex + 1}`,
      );
    }
  };

  const handleApprove = async () => {
    try {
      const additionalData: any = {};

      // Content step requires headingIndex
      if (currentStep === "content") {
        additionalData.headingIndex = currentHeadingIndex;
      }

      console.log("🚀 [StepGenerator] Approve clicked:", {
        currentStep,
        currentHeadingIndex,
        blogId,
        additionalData,
      });

      const result = await callStepAPI(currentStep, "approve", additionalData);

      console.log("📥 [StepGenerator] API Response:", {
        step: currentStep,
        hasData: !!result.data,
        dataKeys: result.data ? Object.keys(result.data) : [],
        isLastHeading: result.isLastHeading,
      });

      // Update parent component with new data
      if (result.data) {
        const updateData: Partial<StepGeneratorData> = {};

        if (currentStep === "headings" && result.data.headings) {
          console.log("📋 [StepGenerator] Processing headings approval:", {
            headingsCount: result.data.headings.length,
            headings: result.data.headings.map((h: any) => ({
              id: h.id,
              text: h.text,
              level: h.level,
              hasContent: !!h.content,
            })),
          });

          updateData.headings = result.data.headings;
          updateData.seoTitle =
            result.data.seoTitle || result.data.suggestedTitle;
          updateData.focusKeyword = result.data.focusKeyword;

          // Store headings for content step
          setAllHeadings(result.data.headings);
          setGeneratedData({
            ...result.data,
            headings: result.data.headings,
          });
        } else if (currentStep === "content" && result.data.heading) {
          console.log("✍️ [StepGenerator] Processing content approval:", {
            headingIndex: currentHeadingIndex,
            headingId: result.data.heading.id,
            headingText: result.data.heading.text,
            contentLength: result.data.heading.content?.length || 0,
            allHeadingsCount: allHeadings.length,
          });

          // Update the specific heading in allHeadings array
          const updatedHeadings = [...allHeadings];
          updatedHeadings[currentHeadingIndex] = result.data.heading;

          console.log("📊 [StepGenerator] Updated headings array:", {
            totalHeadings: updatedHeadings.length,
            headings: updatedHeadings.map((h, i) => ({
              index: i,
              id: h.id,
              text: h.text,
              contentLength: h.content?.length || 0,
            })),
          });

          setAllHeadings(updatedHeadings);
          // Send updated headings to parent immediately
          updateData.headings = updatedHeadings;
        } else if (currentStep === "summary" && result.data.summary) {
          updateData.summary = result.data.summary;
        } else if (currentStep === "conclusion" && result.data.conclusion) {
          updateData.conclusion = result.data.conclusion;
        } else if (currentStep === "faq" && result.data.faqs) {
          updateData.faqs = result.data.faqs;
        } else if (currentStep === "seo") {
          // SEO approve returns blog object, not data object
          const seoBlogData = result.blog?.seo || result.data;
          updateData.seoDescription = seoBlogData.seoDescription;
          updateData.tags = seoBlogData.tags;
          updateData.author = seoBlogData.author;
          updateData.anchors = seoBlogData.anchors;
          updateData.seoTitle = seoBlogData.seoTitle;
          updateData.focusKeyword = seoBlogData.focusKeyword;
        }

        console.log("📤 [StepGenerator] Calling onDataUpdate with:", {
          updateDataKeys: Object.keys(updateData),
          headingsCount: updateData.headings?.length,
          headingsData: updateData.headings?.map((h) => ({
            id: h.id,
            text: h.text,
            contentLength: h.content?.length || 0,
          })),
        });

        onDataUpdate(updateData);

        console.log("✅ [StepGenerator] onDataUpdate called successfully");
      }

      // Update progress
      const newProgress = { ...progress };

      // Special handling for content step - iterate through headings
      if (currentStep === "content") {
        // Mark current heading as approved
        if (!newProgress.contentApproved[currentHeadingIndex]) {
          newProgress.contentApproved[currentHeadingIndex] = true;
        }

        // Check if this was the last heading OR if we've gone through all headings
        const isLastHeading =
          result.isLastHeading || currentHeadingIndex >= allHeadings.length - 1;

        if (isLastHeading) {
          // All headings done, prepare headings for images and move to images step
          console.log(
            `✅ All ${allHeadings.length} headings completed. Preparing headings for images...`,
          );

          // Prepare headings for images (H2-H4)
          const headingsWithImages =
            allHeadings.filter((h) => h.level >= 2 && h.level <= 4) || [];
          setHeadingsForImages(headingsWithImages);
          newProgress.imageApproved = new Array(headingsWithImages.length).fill(
            false,
          );

          // Move to images step
          const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
          const nextStep = "images";
          setCurrentStep(nextStep);
          newProgress.currentStep = nextStep;
          setCurrentHeadingIndex(0);
          setGeneratedData(null);
          toast.success("All content generated! Moving to images step...");
        } else {
          // Move to next heading
          const nextIndex = currentHeadingIndex + 1;
          console.log(
            `➡️ Moving from heading ${currentHeadingIndex} to ${nextIndex}`,
          );
          setCurrentHeadingIndex(nextIndex);
          newProgress.currentHeadingIndex = nextIndex;
          setGeneratedData(null); // Clear so user needs to generate next heading
          toast.success(
            `Heading ${currentHeadingIndex + 1} approved. Ready for heading ${nextIndex + 1}`,
          );
        }
      } else {
        // Other steps - standard flow
        if (currentStep === "headings") {
          newProgress.headingsApproved = true;
        } else if (currentStep === "images") newProgress.imagesApproved = true;
        else if (currentStep === "summary") newProgress.summaryApproved = true;
        else if (currentStep === "conclusion")
          newProgress.conclusionApproved = true;
        else if (currentStep === "faq") newProgress.faqApproved = true;
        else if (currentStep === "seo") newProgress.seoApproved = true;

        // Move to next step
        const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
        if (currentIndex < STEPS.length - 1) {
          const nextStep = STEPS[currentIndex + 1].key;
          setCurrentStep(nextStep);
          newProgress.currentStep = nextStep;

          // For other transitions, clear generated data
          setGeneratedData(null);
          toast.success("Moving to next step...");
        } else {
          // All steps complete
          newProgress.currentStep = "completed";
          onComplete();
          toast.success("🎉 Blog generation completed!");
        }
      }

      setProgress(newProgress);
    } catch (error) {
      // Error handled in callStepAPI
    }
  };

  // ========================================================================
  // STEP COMPLETION CHECK
  // ========================================================================

  const isStepCompleted = (stepKey: StepKey): boolean => {
    // First check progress state
    let isCompleted = false;
    switch (stepKey) {
      case "headings":
        isCompleted = progress.headingsApproved;
        break;
      case "images":
        isCompleted = progress.imagesApproved;
        break;
      case "summary":
        isCompleted = progress.summaryApproved;
        break;
      case "conclusion":
        isCompleted = progress.conclusionApproved;
        break;
      case "faq":
        isCompleted = progress.faqApproved;
        break;
      case "seo":
        isCompleted = progress.seoApproved;
        break;
      case "content":
        isCompleted = progress.contentApproved.length > 0;
        break;
      default:
        isCompleted = false;
    }

    // Also check if parent data exists (for persistence across remounts)
    if (!isCompleted && data) {
      switch (stepKey) {
        case "headings":
          isCompleted = !!(data.headings && data.headings.length > 0);
          break;
        case "images":
          isCompleted = !!(data.mediaLibrary && data.mediaLibrary.length > 0);
          break;
        case "summary":
          isCompleted = !!data.summary;
          break;
        case "conclusion":
          isCompleted = !!data.conclusion;
          break;
        case "faq":
          isCompleted = !!(data.faqs && data.faqs.length > 0);
          break;
        case "seo":
          isCompleted = !!(
            data.seoTitle ||
            data.focusKeyword ||
            (data.tags && data.tags.length > 0)
          );
          break;
        case "content":
          isCompleted = !!(
            data.headings &&
            data.headings.some((h) => h.content && h.content.trim().length > 0)
          );
          break;
      }
    }

    return isCompleted;
  };

  // ========================================================================
  // RENDER STEP CONTENT
  // ========================================================================

  const renderStepContent = () => {
    // Content step has special handling below
    if (!generatedData && currentStep !== "content") {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
            <FiZap size={24} className="text-slate-600" />
          </div>
          <p className="text-slate-400 mb-4 text-sm">
            Click Generate to create{" "}
            {STEPS.find((s) => s.key === currentStep)?.title.toLowerCase()}
          </p>
        </div>
      );
    }

    switch (currentStep) {
      case "headings":
        return (
          <div className="space-y-3">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-sm text-slate-300 mb-2">
                <strong>Title:</strong> {generatedData.seoTitle}
              </p>
              <p className="text-sm text-slate-300 mb-3">
                <strong>Focus Keyword:</strong> {generatedData.focusKeyword}
              </p>
              <div className="text-sm text-slate-300">
                <strong>
                  Headings ({generatedData.headings?.length || 0}):
                </strong>
                <ul className="mt-2 space-y-1.5 ml-4">
                  {generatedData.headings?.map((h: HeadingItem, i: number) => (
                    <li
                      key={h.id}
                      className={`${h.level === 2 ? "font-semibold" : "ml-4 text-slate-400"}`}
                    >
                      {h.level === 2 ? "•" : "◦"} {h.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case "images":
        // Show individual image generation for each heading
        const totalImages = headingsForImages.length;
        const currentImageNum = currentImageIndex + 1;
        const currentImageHeading = headingsForImages[currentImageIndex];

        if (totalImages === 0 || !currentImageHeading) {
          return (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                <FiImage size={24} className="text-slate-600" />
              </div>
              <p className="text-slate-400 mb-4">
                No headings available for image generation
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {/* Progress indicator */}
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Progress:</span>
                <span className="text-[#fe9a00] font-semibold">
                  Image {currentImageNum} of {totalImages}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-[#fe9a00] h-2 rounded-full transition-all"
                  style={{
                    width: `${(currentImageIndex / totalImages) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {progress.imageApproved.filter(Boolean).length} completed
              </div>
            </div>

            {/* Current heading info - ALWAYS SHOW */}
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    Generating image for:
                  </p>
                  <h4 className="text-base font-semibold text-[#fe9a00]">
                    {currentImageHeading.text}
                  </h4>
                </div>
                <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                  H{currentImageHeading.level}
                </span>
              </div>
            </div>

            {/* Generated image */}
            {generatedData?.image ? (
              <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <FiCheckCircle size={14} />
                    Image Generated
                  </span>
                </div>
                <div className="relative">
                  <img
                    src={generatedData.image.url}
                    alt={generatedData.image.alt}
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 p-4 rounded-lg border border-dashed border-slate-700 text-center">
                <FiImage size={20} className="mx-auto mb-2 text-slate-600" />
                <p className="text-slate-400 text-sm">
                  Click <strong className="text-[#fe9a00]">Generate</strong>{" "}
                  below to create an image
                </p>
              </div>
            )}
          </div>
        );

      case "content":
        // Show individual heading generation
        const totalHeadings =
          allHeadings.length || progress.contentApproved.length;
        const currentHeadingNum = currentHeadingIndex + 1;
        const currentHeading = allHeadings[currentHeadingIndex];

        if (totalHeadings === 0 || !currentHeading) {
          return (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                <FiZap size={24} className="text-slate-600" />
              </div>
              <p className="text-slate-400 mb-4">
                Please approve headings first
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {/* Progress indicator */}
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Progress:</span>
                <span className="text-[#fe9a00] font-semibold">
                  Heading {currentHeadingNum} of {totalHeadings}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-[#fe9a00] h-2 rounded-full transition-all"
                  style={{
                    width: `${(currentHeadingIndex / totalHeadings) * 100}%`,
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {progress.contentApproved.filter(Boolean).length} completed
              </div>
            </div>

            {/* Current heading info - ALWAYS SHOW */}
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Generating for:</p>
                  <h4 className="text-xs font-semibold text-[#fe9a00]">
                    {currentHeading.text}
                  </h4>
                </div>
                <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                  H{currentHeading.level}
                </span>
              </div>
            </div>

            {/* Generated content */}
            {generatedData?.heading?.content ? (
              <div className="bg-slate-800/50 p-4 rounded-lg border border-green-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-green-500 flex items-center gap-1">
                    <FiCheckCircle size={10} />
                    Content Generated
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {generatedData.heading.content?.length || 0} characters
                  </span>
                </div>
                <div
                  className="text-slate-300 prose prose-sm text-sm prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: generatedData.heading.content,
                  }}
                />
              </div>
            ) : (
              <div className="bg-slate-800/50 p-4 rounded-lg border border-dashed border-slate-700 text-center">
                <FiEdit3 size={20} className="mx-auto mb-2 text-slate-600" />
                <p className="text-slate-400 text-sm">
                  Click <strong className="text-[#fe9a00]">Generate</strong>{" "}
                  below to create content
                </p>
              </div>
            )}
          </div>
        );

      case "summary":
        return (
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div
              className="text-sm text-slate-300 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: generatedData.summary }}
            />
          </div>
        );

      case "conclusion":
        return (
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div
              className="text-sm text-slate-300 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: generatedData.conclusion }}
            />
          </div>
        );

      case "faq":
        return (
          <div className="space-y-3">
            <p className="text-sm text-slate-400 mb-3">
              {generatedData.faqs?.length || 0} FAQ items generated
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {generatedData.faqs?.map((faq: FAQItem) => (
                <div key={faq.id} className="bg-slate-800/50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-slate-300 mb-1">
                    Q: {faq.question}
                  </p>
                  <p className="text-xs text-slate-400">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "seo":
        return (
          <div className="space-y-3">
            <div className="bg-slate-800/50 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Meta Description</p>
                <p className="text-sm text-slate-300">
                  {generatedData.seoDescription}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {generatedData.seoDescription?.length || 0}/160 characters
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {generatedData.tags?.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="bg-[#fe9a00]/20 text-[#fe9a00] px-2 py-0.5 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">
                  Auto-Links ({generatedData.anchors?.length || 0})
                </p>
                <div className="space-y-1">
                  {generatedData.anchors?.slice(0, 3).map((anchor: Anchor) => (
                    <p key={anchor.id} className="text-xs text-slate-400">
                      • {anchor.keyword}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  if (progress.currentStep === "completed") {
    return (
      <div className="bg-linear-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <FiCheck size={32} className="text-green-500" />
        </div>
        <h3 className="text-lg font-bold text-green-400 mb-2">
          🎉 Generation Complete!
        </h3>
        <p className="text-sm text-slate-300">
          All sections have been generated and approved
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-xl overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-slate-900/50 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">AI Step-by-Step</h3>
          <span className="text-xs text-slate-400">
            Step {STEPS.findIndex((s) => s.key === currentStep) + 1}/
            {STEPS.length}
          </span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((step, index) => (
            <div
              key={step.key}
              onClick={() => handleStepClick(step.key)}
              className={`flex-1 h-1.5 rounded-full transition-all cursor-pointer ${
                isStepCompleted(step.key)
                  ? "bg-green-500"
                  : step.key === currentStep
                    ? "bg-[#fe9a00]"
                    : "bg-slate-700"
              }`}
              title={step.title}
              suppressHydrationWarning
            />
          ))}
        </div>
      </div>

      {/* Step List */}
      <div className="p-3 border-b border-slate-700 max-h-48 overflow-y-auto">
        <div className="space-y-1">
          {STEPS.map((step) => (
            <div
              key={step.key}
              onClick={() => handleStepClick(step.key)}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer ${
                isStepCompleted(step.key)
                  ? "bg-green-900/20 border border-green-500/30"
                  : step.key === currentStep
                    ? "bg-[#fe9a00]/10 border border-[#fe9a00]/30"
                    : "bg-transparent"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isStepCompleted(step.key)
                    ? "bg-green-500 text-white"
                    : step.key === currentStep
                      ? "bg-[#fe9a00] text-white"
                      : "bg-slate-700 text-slate-400"
                }`}
              >
                {isStepCompleted(step.key) ? (
                  <FiCheck size={12} />
                ) : (
                  <span className="text-xs">
                    {STEPS.findIndex((s) => s.key === step.key) + 1}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-xs font-semibold ${
                    isStepCompleted(step.key)
                      ? "text-green-400"
                      : step.key === currentStep
                        ? "text-white"
                        : "text-slate-400"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-slate-500">{step.description}</p>
              </div>
              {step.key === currentStep && (
                <FiChevronRight size={14} className="text-[#fe9a00]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[#fe9a00]">
              {STEPS.find((s) => s.key === currentStep)?.icon}
            </div>
            <h4 className="text-sm font-bold text-white">
              {STEPS.find((s) => s.key === currentStep)?.title}
            </h4>
          </div>
          <p className="text-xs text-slate-400">
            {STEPS.find((s) => s.key === currentStep)?.description}
          </p>
        </div>

        {renderStepContent()}

        {/* Action Buttons */}
        <div className="flex flex-col gap-1 mt-4">
          {/* Images step has special handling */}
          {currentStep === "images" ? (
            !generatedData ? (
              <button
                onClick={handleImageGenerate}
                disabled={loading || !blogId}
                className="flex-1 bg-[#fe9a00] hover:bg-[#ff8800] disabled:bg-slate-700 disabled:text-slate-500 text-white py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <FiLoader size={14} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiImage size={14} />
                    Generate Image
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleImageGenerate}
                  disabled={loading}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? (
                    <FiLoader size={14} className="animate-spin" />
                  ) : (
                    <>
                      <FiRefreshCw size={14} />
                      Regenerate
                    </>
                  )}
                </button>
                <button
                  onClick={handleImageApprove}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-nowrap disabled:bg-slate-800 text-white py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? (
                    <FiLoader size={14} className="animate-spin" />
                  ) : (
                    <>
                      <FiCheck size={14} />
                      {currentImageIndex >= headingsForImages.length - 1
                        ? "Approve All"
                        : "Approve & Next"}
                    </>
                  )}
                </button>
              </>
            )
          ) : /* Other steps use standard handlers */
          !generatedData ? (
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="flex-1 bg-[#fe9a00] hover:bg-[#ff8800] disabled:bg-slate-700 disabled:text-slate-500 text-white py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <FiLoader size={14} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FiZap size={14} />
                  Generate
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <FiLoader size={14} className="animate-spin" />
                ) : (
                  <>
                    <FiRefreshCw size={14} />
                    Regenerate
                  </>
                )}
              </button>
              <button
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-500 text-nowrap disabled:bg-slate-800 text-white py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <FiLoader size={14} className="animate-spin" />
                ) : (
                  <>
                    <FiCheck size={14} />
                    Approve & Next
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
