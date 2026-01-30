"use client";

import React, { useState, useCallback } from "react";
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
    | "content"
    | "summary"
    | "conclusion"
    | "faq"
    | "seo"
    | "completed";
  currentHeadingIndex: number;
  headingsApproved: boolean;
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
  summary: string;
  conclusion: string;
  faqs: FAQItem[];
  anchors: Anchor[];
  mediaLibrary: MediaItem[];
}

interface StepByStepBlogGeneratorProps {
  topic: string;
  onDataUpdate: (data: Partial<StepGeneratorData>) => void;
  onComplete: () => void;
}

type StepKey =
  | "headings"
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
  onDataUpdate,
  onComplete,
}: StepByStepBlogGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepKey>("headings");
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [blogId, setBlogId] = useState<string | null>(null);
  const [allHeadings, setAllHeadings] = useState<HeadingItem[]>([]);

  const [progress, setProgress] = useState<GenerationProgress>({
    currentStep: "headings",
    currentHeadingIndex: 0,
    headingsApproved: false,
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
        console.error("Step API Error:", error);
        toast.error(error.message || "Failed to generate content");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [topic, blogId],
  );

  // ========================================================================
  // STEP HANDLERS
  // ========================================================================

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first!");
      return;
    }

    try {
      const additionalData: any = {};
      
      // Content step requires headingIndex
      if (currentStep === "content") {
        additionalData.headingIndex = currentHeadingIndex;
      }
      
      const result = await callStepAPI(currentStep, "generate", additionalData);
      
      // Show which heading we just generated
      if (currentStep === "content" && result.data?.heading) {
        toast.success(`Content generated for: ${result.data.heading.text}`);
      } else {
        toast.success(`${STEPS.find((s) => s.key === currentStep)?.title} generated!`);
      }
    } catch (error) {
      // Error handled in callStepAPI
    }
  };

  const handleRegenerate = async () => {
    try {
      const additionalData: any = {};
      
      // Content step requires headingIndex
      if (currentStep === "content") {
        additionalData.headingIndex = currentHeadingIndex;
      }
      
      const result = await callStepAPI(currentStep, "regenerate", additionalData);
      
      if (currentStep === "content" && result.data?.heading) {
        toast.success(`Content regenerated for: ${result.data.heading.text}`);
      } else {
        toast.success("Content regenerated!");
      }
    } catch (error) {
      // Error handled in callStepAPI
    }
  };

  const handleApprove = async () => {
    try {
      const additionalData: any = {};
      
      // Content step requires headingIndex
      if (currentStep === "content") {
        additionalData.headingIndex = currentHeadingIndex;
      }
      
      console.log('🚀 [StepGenerator] Approve clicked:', {
        currentStep,
        currentHeadingIndex,
        blogId,
        additionalData
      });
      
      const result = await callStepAPI(currentStep, "approve", additionalData);
      
      console.log('📥 [StepGenerator] API Response:', {
        step: currentStep,
        hasData: !!result.data,
        dataKeys: result.data ? Object.keys(result.data) : [],
        isLastHeading: result.isLastHeading
      });

      // Update parent component with new data
      if (result.data) {
        const updateData: Partial<StepGeneratorData> = {};

        if (currentStep === "headings" && result.data.headings) {
          console.log('📋 [StepGenerator] Processing headings approval:', {
            headingsCount: result.data.headings.length,
            headings: result.data.headings.map((h: any) => ({
              id: h.id,
              text: h.text,
              level: h.level,
              hasContent: !!h.content
            }))
          });
          
          updateData.headings = result.data.headings;
          updateData.seoTitle = result.data.seoTitle || result.data.suggestedTitle;
          updateData.focusKeyword = result.data.focusKeyword;
          
          // Store headings for content step
          setAllHeadings(result.data.headings);
          setGeneratedData({ 
            ...result.data, 
            headings: result.data.headings 
          });
        } else if (currentStep === "content" && result.data.heading) {
          console.log('✍️ [StepGenerator] Processing content approval:', {
            headingIndex: currentHeadingIndex,
            headingId: result.data.heading.id,
            headingText: result.data.heading.text,
            contentLength: result.data.heading.content?.length || 0,
            allHeadingsCount: allHeadings.length
          });
          
          // Update the specific heading in allHeadings array
          const updatedHeadings = [...allHeadings];
          updatedHeadings[currentHeadingIndex] = result.data.heading;
          
          console.log('📊 [StepGenerator] Updated headings array:', {
            totalHeadings: updatedHeadings.length,
            headings: updatedHeadings.map((h, i) => ({
              index: i,
              id: h.id,
              text: h.text,
              contentLength: h.content?.length || 0
            }))
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
          updateData.seoDescription = result.data.seoDescription;
          updateData.tags = result.data.tags;
          updateData.author = result.data.author;
          updateData.anchors = result.data.anchors;
        }

        console.log('📤 [StepGenerator] Calling onDataUpdate with:', {
          updateDataKeys: Object.keys(updateData),
          headingsCount: updateData.headings?.length,
          headingsData: updateData.headings?.map(h => ({
            id: h.id,
            text: h.text,
            contentLength: h.content?.length || 0
          }))
        });
        
        onDataUpdate(updateData);
        
        console.log('✅ [StepGenerator] onDataUpdate called successfully');
      }

      // Update progress
      const newProgress = { ...progress };
      
      // Special handling for content step - iterate through headings
      if (currentStep === "content") {
        // Mark current heading as approved
        if (!newProgress.contentApproved[currentHeadingIndex]) {
          newProgress.contentApproved[currentHeadingIndex] = true;
        }
        
        // Check if this was the last heading
        if (result.isLastHeading) {
          // All headings done, move to next step
          const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
          const nextStep = STEPS[currentIndex + 1].key;
          setCurrentStep(nextStep);
          newProgress.currentStep = nextStep;
          setCurrentHeadingIndex(0); // Reset for potential future use
          setGeneratedData(null);
          toast.success("All content generated! Moving to next step...");
        } else {
          // Move to next heading
          const nextIndex = currentHeadingIndex + 1;
          setCurrentHeadingIndex(nextIndex);
          newProgress.currentHeadingIndex = nextIndex;
          setGeneratedData(null); // Clear so user needs to generate next heading
          toast.success(`Heading ${currentHeadingIndex + 1} approved. Ready for heading ${nextIndex + 1}`);
        }
      } else {
        // Other steps - standard flow
        if (currentStep === "headings") {
          newProgress.headingsApproved = true;
          // When headings are approved, save the headings list and initialize content tracking
          if (result.data?.headings) {
            // Initialize contentApproved array with false for each heading
            newProgress.contentApproved = new Array(result.data.headings.length).fill(false);
          }
        }
        else if (currentStep === "summary") newProgress.summaryApproved = true;
        else if (currentStep === "conclusion") newProgress.conclusionApproved = true;
        else if (currentStep === "faq") newProgress.faqApproved = true;
        else if (currentStep === "seo") newProgress.seoApproved = true;
        
        // Move to next step
        const currentIndex = STEPS.findIndex((s) => s.key === currentStep);
        if (currentIndex < STEPS.length - 1) {
          const nextStep = STEPS[currentIndex + 1].key;
          setCurrentStep(nextStep);
          newProgress.currentStep = nextStep;
          // Only clear generated data if NOT moving from headings to content
          // (we need to keep headings data for content step)
          if (!(currentStep === "headings" && nextStep === "content")) {
            setGeneratedData(null);
          }
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
    switch (stepKey) {
      case "headings":
        return progress.headingsApproved;
      case "summary":
        return progress.summaryApproved;
      case "conclusion":
        return progress.conclusionApproved;
      case "faq":
        return progress.faqApproved;
      case "seo":
        return progress.seoApproved;
      case "content":
        return progress.contentApproved.length > 0;
      default:
        return false;
    }
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
          <p className="text-slate-400 mb-4">
            Click Generate to create {STEPS.find((s) => s.key === currentStep)?.title.toLowerCase()}
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
                <strong>Headings ({generatedData.headings?.length || 0}):</strong>
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

      case "content":
        // Show individual heading generation
        const totalHeadings = allHeadings.length || progress.contentApproved.length;
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
                  style={{ width: `${(currentHeadingIndex / totalHeadings) * 100}%` }}
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
                  <h4 className="text-base font-semibold text-[#fe9a00]">
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
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <FiCheckCircle size={14} />
                    Content Generated
                  </span>
                  <span className="text-xs text-slate-500">
                    {generatedData.heading.content?.length || 0} characters
                  </span>
                </div>
                <div
                  className="text-slate-300 prose prose-sm prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: generatedData.heading.content }}
                />
              </div>
            ) : (
              <div className="bg-slate-800/50 p-4 rounded-lg border border-dashed border-slate-700 text-center">
                <FiEdit3 size={20} className="mx-auto mb-2 text-slate-600" />
                <p className="text-slate-400 text-sm">
                  Click <strong className="text-[#fe9a00]">Generate</strong> below to create content
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
                <p className="text-sm text-slate-300">{generatedData.seoDescription}</p>
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
            Step {STEPS.findIndex((s) => s.key === currentStep) + 1}/{STEPS.length}
          </span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((step, index) => (
            <div
              key={step.key}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                isStepCompleted(step.key)
                  ? "bg-green-500"
                  : step.key === currentStep
                    ? "bg-[#fe9a00]"
                    : "bg-slate-700"
              }`}
              title={step.title}
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
              className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
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
        <div className="flex gap-2 mt-4">
          {!generatedData ? (
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
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
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
                className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-slate-800 text-white py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
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
