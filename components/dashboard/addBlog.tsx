"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

import {
  FiCpu,
  FiGlobe,
  FiImage,
  FiLink,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiCode,
  FiSave,
  FiTrash2,
  FiPlus,
  FiCopy,
  FiRefreshCw,
  FiExternalLink,
  FiBold,
  FiItalic,
  FiDroplet,
  FiLayout,
  FiX,
  FiType,
  FiChevronDown,
  FiChevronUp,
  FiMove,
  FiUnderline,
  FiEdit3,
  FiCheck,
  FiTag,
  FiHash,
} from "react-icons/fi";

// --- 1. TYPES ---
interface Anchor {
  id: string;
  keyword: string;
  url: string;
}

interface HeadingItem {
  id: string;
  level: number;
  text: string;
  isCollapsed?: boolean;
}

interface ImageItem {
  id: string;
  url: string;
  alt: string;
}

interface BlogPostData {
  topic: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  headings: HeadingItem[];
  images: ImageItem[];
  anchors: Anchor[];
  content: { [headingId: string]: string };
  summary: string;
  compiledHtml: string;
}

// --- 2. COLOR PICKER COMPONENT ---
const ColorPicker = ({
  isOpen,
  onClose,
  onSelect,
  title,
  colors,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (color: string) => void;
  title: string;
  colors: string[];
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 p-3 bg-[#0f172b] border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[200px] animate-in fade-in zoom-in-95 duration-150"
    >
      <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">
        {title}
      </p>
      <div className="grid grid-cols-6 gap-1.5">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => {
              onSelect(color);
              onClose();
            }}
            className="w-7 h-7 rounded-md border-2 border-transparent hover:border-white hover:scale-110 transition-all shadow-sm"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      <button
        onClick={() => {
          onSelect("");
          onClose();
        }}
        className="mt-2 w-full text-xs text-slate-400 hover:text-white py-1 border border-dashed border-slate-700 rounded-md"
      >
        Remove Color
      </button>
    </div>
  );
};

// --- 3. FONT SIZE SELECTOR ---
const FontSizeSelector = ({
  isOpen,
  onClose,
  onSelect,
  currentSize,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (size: string) => void;
  currentSize?: string;
}) => {
  const sizes = [
    { label: "Small", value: "12px", class: "text-xs" },
    { label: "Normal", value: "14px", class: "text-sm" },
    { label: "Medium", value: "16px", class: "text-base" },
    { label: "Large", value: "18px", class: "text-lg" },
    { label: "XL", value: "20px", class: "text-xl" },
    { label: "2XL", value: "24px", class: "text-2xl" },
  ];

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 p-2 bg-[#0f172b] border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[140px] animate-in fade-in zoom-in-95 duration-150"
    >
      <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider px-2">
        Font Size
      </p>
      {sizes.map((size) => (
        <button
          key={size.value}
          onClick={() => {
            onSelect(size.value);
            onClose();
          }}
          className={`w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-slate-800 transition-colors flex items-center justify-between ${
            currentSize === size.value
              ? "bg-[#fe9a00]/20 text-[#fe9a00]"
              : "text-slate-300"
          }`}
        >
          <span className={size.class}>{size.label}</span>
          <span className="text-[10px] text-slate-500 font-mono">
            {size.value}
          </span>
        </button>
      ))}
    </div>
  );
};

// --- 4. ENHANCED TIPTAP EDITOR ---
const EditorToolbarButton = ({
  onClick,
  isActive,
  children,
  title,
  disabled,
}: any) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`p-2 rounded-lg text-sm transition-all duration-200 ${
      isActive
        ? "bg-[#fe9a00] text-white shadow-md shadow-orange-500/20"
        : "text-slate-400 hover:bg-slate-700 hover:text-white"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

const TiptapEditor = ({
  content,
  onChange,
  placeholder,
}: {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) => {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);

  const textColors = [
    "#ffffff",
    "#f8fafc",
    "#94a3b8",
    "#64748b",
    "#475569",
    "#ef4444",
    "#f97316",
    "#fe9a00",
    "#eab308",
    "#22c55e",
    "#14b8a6",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
    "#a855f7",
    "#ec4899",
    "#f43f5e",
    "#000000",
    "#1e293b",
    "#0f172a",
  ];

  const bgColors = [
    "#fef08a",
    "#fde047",
    "#facc15",
    "#fcd34d",
    "#fbbf24",
    "#fed7aa",
    "#fdba74",
    "#fb923c",
    "#bbf7d0",
    "#86efac",
    "#6ee7b7",
    "#99f6e4",
    "#67e8f9",
    "#7dd3fc",
    "#93c5fd",
    "#c4b5fd",
    "#d8b4fe",
    "#f5d0fe",
    "#fbcfe8",
    "#fecdd3",
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#fe9a00] underline cursor-pointer" },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[180px] text-sm text-slate-300 leading-relaxed",
      },
    },
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="bg-[#1e293b] border border-slate-700 rounded-xl overflow-hidden shadow-lg">
      {/* Enhanced Toolbar */}
      <div className="bg-[#0f172b] border-b border-slate-700 p-2 flex flex-wrap gap-1 items-center">
        {/* Typography Group */}
        <div className="flex gap-0.5 border-r border-slate-700 pr-2 mr-1">
          <EditorToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <FiBold size={14} />
          </EditorToolbarButton>
          <EditorToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <FiItalic size={14} />
          </EditorToolbarButton>
          <EditorToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <FiUnderline size={14} />
          </EditorToolbarButton>
        </div>

        {/* Font Size */}
        <div className="relative border-r border-slate-700 pr-2 mr-1">
          <EditorToolbarButton
            onClick={() => setShowFontSize(!showFontSize)}
            isActive={showFontSize}
            title="Font Size"
          >
            <FiType size={14} />
          </EditorToolbarButton>
          <FontSizeSelector
            isOpen={showFontSize}
            onClose={() => setShowFontSize(false)}
            onSelect={(size) => {
              if (size) {
                editor
                  .chain()
                  .focus()
                  .setMark("textStyle", { fontSize: size })
                  .run();
              }
            }}
          />
        </div>

        {/* Text & Background Color */}
        <div className="flex gap-0.5 border-r border-slate-700 pr-2 mr-1">
          <div className="relative">
            <EditorToolbarButton
              onClick={() => setShowTextColor(!showTextColor)}
              isActive={showTextColor}
              title="Text Color"
            >
              <div className="flex flex-col items-center">
                <span className="font-bold text-xs">A</span>
                <div
                  className="w-4 h-1 rounded-full mt-0.5"
                  style={{
                    backgroundColor:
                      editor.getAttributes("textStyle").color || "#fe9a00",
                  }}
                />
              </div>
            </EditorToolbarButton>
            <ColorPicker
              isOpen={showTextColor}
              onClose={() => setShowTextColor(false)}
              onSelect={(color) => {
                if (color) {
                  editor.chain().focus().setColor(color).run();
                } else {
                  editor.chain().focus().unsetColor().run();
                }
              }}
              title="Text Color"
              colors={textColors}
            />
          </div>

          <div className="relative">
            <EditorToolbarButton
              onClick={() => setShowBgColor(!showBgColor)}
              isActive={editor.isActive("highlight")}
              title="Highlight Color"
            >
              <FiDroplet size={14} />
            </EditorToolbarButton>
            <ColorPicker
              isOpen={showBgColor}
              onClose={() => setShowBgColor(false)}
              onSelect={(color) => {
                if (color) {
                  editor.chain().focus().setHighlight({ color }).run();
                } else {
                  editor.chain().focus().unsetHighlight().run();
                }
              }}
              title="Highlight Color"
              colors={bgColors}
            />
          </div>
        </div>

        {/* Alignment */}
        <div className="flex gap-0.5 border-r border-slate-700 pr-2 mr-1">
          <EditorToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <FiAlignLeft size={14} />
          </EditorToolbarButton>
          <EditorToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <FiAlignCenter size={14} />
          </EditorToolbarButton>
          <EditorToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <FiAlignRight size={14} />
          </EditorToolbarButton>
        </div>

        {/* Link */}
        <div className="flex gap-0.5">
          <EditorToolbarButton
            onClick={setLink}
            isActive={editor.isActive("link")}
            title="Add Link"
          >
            <FiLink size={14} />
          </EditorToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <div
        className="p-4 cursor-text bg-[#1e293b] min-h-[180px]"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Status Bar */}
      <div className="bg-[#0f172b] border-t border-slate-700 px-3 py-1.5 flex justify-between items-center">
        <span className="text-[10px] text-slate-500">
          {editor.storage.characterCount?.characters?.() || 0} characters
        </span>
        <div className="flex gap-2">
          <span className="text-[10px] text-slate-600">Rich Text Editor</span>
        </div>
      </div>
    </div>
  );
};

// --- 5. UI ATOMS ---
const Card = ({
  title,
  number,
  icon,
  children,
  className = "",
  collapsible = false,
  defaultCollapsed = false,
}: any) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div
      className={`bg-[#0f172b] border border-slate-800 rounded-xl overflow-hidden group hover:border-[#fe9a00]/30 transition-all duration-300 ${className}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#fe9a00]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

      <div
        className={`flex items-center gap-3 p-4 border-b border-slate-800/50 ${collapsible ? "cursor-pointer hover:bg-slate-800/30" : ""}`}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#fe9a00]/10 text-[#fe9a00]">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-white tracking-wide flex-1">
          <span className="text-[#fe9a00] mr-2">{number}.</span>
          {title}
        </h3>
        {collapsible && (
          <button className="text-slate-400 hover:text-white transition-colors">
            {isCollapsed ? <FiChevronDown /> : <FiChevronUp />}
          </button>
        )}
      </div>

      {!isCollapsed && <div className="p-5 relative z-10">{children}</div>}
    </div>
  );
};

const Label = ({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) => (
  <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
    {children}
    {optional && (
      <span className="text-slate-600 font-normal normal-case">(optional)</span>
    )}
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all ${props.className || ""}`}
  />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className="w-full bg-[#1e293b] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#fe9a00] focus:ring-2 focus:ring-[#fe9a00]/20 transition-all resize-y min-h-[100px]"
  />
);

const Button = ({
  variant = "primary",
  isLoading,
  icon,
  children,
  onClick,
  className = "",
  size = "md",
}: any) => {
  const baseStyle =
    "flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const variants = {
    primary:
      "bg-[#fe9a00] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    ghost:
      "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-[#fe9a00]",
    danger:
      "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30",
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${baseStyle} ${sizes[size as keyof typeof sizes]} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {isLoading ? <FiRefreshCw className="animate-spin" /> : icon}
      {children}
    </button>
  );
};

// --- 6. TAG COMPONENT WITH DELETE ---
const Tag = ({ text, onDelete }: { text: string; onDelete: () => void }) => (
  <span className="inline-flex items-center gap-1.5 bg-[#fe9a00]/10 text-[#fe9a00] text-xs font-medium px-3 py-1.5 rounded-full border border-[#fe9a00]/20 group hover:bg-[#fe9a00]/20 transition-all">
    <FiHash size={10} />
    {text}
    <button
      onClick={onDelete}
      className="ml-1 p-0.5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors"
      title="Remove tag"
    >
      <FiX size={12} />
    </button>
  </span>
);

// --- 7. SECTION ITEM COMPONENT ---
const SectionItem = ({
  heading,
  index,
  content,
  onHeadingChange,
  onLevelChange,
  onContentChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  heading: HeadingItem;
  index: number;
  content: string;
  onHeadingChange: (text: string) => void;
  onLevelChange: (level: number) => void;
  onContentChange: (html: string) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative group bg-[#1e293b]/50 rounded-xl border border-slate-700 hover:border-[#fe9a00]/30 transition-all overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center gap-2 p-3 bg-[#0f172b]/50 border-b border-slate-700">
        {/* Move Controls */}
        <div className="flex flex-col gap-0.5">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="text-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
            title="Move up"
          >
            <FiChevronUp size={12} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="text-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
            title="Move down"
          >
            <FiChevronDown size={12} />
          </button>
        </div>

        {/* Section Number */}
        <div className="w-7 h-7 rounded-lg bg-[#fe9a00]/10 text-[#fe9a00] flex items-center justify-center text-xs font-bold">
          {index + 1}
        </div>

        {/* Heading Level Selector */}
        <select
          className="bg-[#0f172b] border border-slate-700 rounded-lg text-xs text-[#fe9a00] font-bold px-2 py-1.5 focus:outline-none focus:border-[#fe9a00]"
          value={heading.level}
          onChange={(e) => onLevelChange(parseInt(e.target.value))}
        >
          {[2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              H{n}
            </option>
          ))}
        </select>

        {/* Heading Input */}
        <input
          value={heading.text}
          onChange={(e) => onHeadingChange(e.target.value)}
          placeholder="Enter section heading..."
          className="flex-1 bg-transparent border-0 text-white font-semibold placeholder-slate-500 focus:outline-none text-sm"
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <FiChevronDown size={14} />
            ) : (
              <FiChevronUp size={14} />
            )}
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete section"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Section Content */}
      {!isCollapsed && (
        <div className="p-4">
          <Label>Section Content</Label>
          <TiptapEditor content={content} onChange={onContentChange} />
        </div>
      )}
    </div>
  );
};

// --- 8. MAIN BUILDER COMPONENT ---
export default function AIBlogBuilder() {
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [data, setData] = useState<BlogPostData>({
    topic: "",
    seoTitle: "",
    seoDescription: "",
    tags: [],
    headings: [
      { id: "h-1", level: 2, text: "" },
      { id: "h-2", level: 2, text: "" },
    ],
    images: [],
    anchors: [],
    content: {},
    summary: "",
    compiledHtml: "",
  });

  // --- HTML COMPILER ---
  const compileContent = useCallback(() => {
    let html = `<article class="blog-post">\n`;

    if (data.seoTitle) {
      html += `  <h1 class="text-4xl font-bold mb-4 text-slate-900 dark:text-white">${data.seoTitle}</h1>\n`;
    }

    if (data.images.length > 0) {
      html += `  <figure class="my-6">\n    <img src="${data.images[0].url}" alt="${data.images[0].alt}" class="w-full rounded-xl shadow-lg" />\n  </figure>\n`;
    }

    if (data.summary) {
      html += `  <div class="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg my-8 italic border-l-4 border-orange-500 text-slate-700 dark:text-slate-300">\n    <p><strong>Summary:</strong> ${data.summary}</p>\n  </div>\n\n`;
    }

    data.headings.forEach((heading, index) => {
      if (!heading.text) return;

      const tag = `h${heading.level}`;
      const sizeClass =
        heading.level === 2
          ? "text-2xl"
          : heading.level === 3
            ? "text-xl"
            : "text-lg";
      html += `  <${tag} id="${heading.text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}" class="font-bold mt-8 mb-4 text-slate-900 dark:text-white ${sizeClass}">${heading.text}</${tag}>\n`;

      let sectionContent = data.content[heading.id] || "<p></p>";

      data.anchors.forEach((anchor) => {
        if (anchor.keyword && anchor.url) {
          const regex = new RegExp(`\\b${anchor.keyword}\\b`, "gi");
          sectionContent = sectionContent.replace(
            regex,
            `<a href="${anchor.url}" class="text-[#fe9a00] hover:underline" target="_blank">${anchor.keyword}</a>`,
          );
        }
      });

      html += `  <div class="mb-6 leading-relaxed text-slate-700 dark:text-slate-300 rich-text">${sectionContent}</div>\n`;

      const imageIndex = index + 1;
      if (data.images[imageIndex]) {
        html += `  <figure class="my-6">\n    <img src="${data.images[imageIndex].url}" alt="${data.images[imageIndex].alt}" class="w-full rounded-lg shadow-sm" />\n    <figcaption class="text-center text-xs text-slate-500 mt-2">${data.images[imageIndex].alt}</figcaption>\n  </figure>\n`;
      }
    });

    html += `</article>`;
    setData((prev) => ({ ...prev, compiledHtml: html }));
  }, [
    data.seoTitle,
    data.images,
    data.summary,
    data.headings,
    data.content,
    data.anchors,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => compileContent(), 800);
    return () => clearTimeout(timer);
  }, [compileContent]);

  // --- HANDLERS ---
  const handleAddTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      setData({ ...data, tags: [...data.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setData({ ...data, tags: data.tags.filter((_, i) => i !== index) });
  };

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const newHeadings = [...data.headings];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newHeadings.length) return;

    [newHeadings[index], newHeadings[targetIndex]] = [
      newHeadings[targetIndex],
      newHeadings[index],
    ];
    setData({ ...data, headings: newHeadings });
  };

  const handleAIGenerate = async () => {
    if (!data.topic) return toast.error("Please enter a topic first");
    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 2000));

      const mockAI = {
        seoTitle: `Mastering ${data.topic}: A Comprehensive Guide`,
        seoDescription: `Learn everything about ${data.topic}. We cover strategies, tools, and best practices.`,
        tags: [data.topic, "Guide", "Tutorial", "2024"],
        headings: [
          { id: "h-1", level: 2, text: "Introduction" },
          { id: "h-2", level: 2, text: "Core Concepts" },
          { id: "h-3", level: 3, text: "Advanced Techniques" },
          { id: "h-4", level: 2, text: "Conclusion" },
        ],
        content: {
          "h-1": `<p><strong>${data.topic}</strong> is rapidly changing the landscape. It allows for <span style="background-color: #fef08a; color: black;">unprecedented growth</span> and efficiency.</p>`,
          "h-2": `<p>To understand this fully, we must look at the data. Studies show a <strong style="color: #fe9a00;">50% increase</strong> in productivity.</p><ul><li>Factor A - Innovation</li><li>Factor B - Scalability</li></ul>`,
          "h-3": `<p>For the experts, try integrating with <a href="#">existing APIs</a> to maximize leverage and efficiency.</p>`,
          "h-4": `<p>In summary, ${data.topic} is essential for modern success. Start implementing today!</p>`,
        },
        summary: `In short, ${data.topic} is essential for modern success. This guide covered all the fundamentals you need to get started.`,
        anchors: [
          { id: "a1", keyword: "growth", url: "https://example.com/growth" },
          {
            id: "a2",
            keyword: "productivity",
            url: "https://example.com/productivity",
          },
        ],
        images: [
          {
            id: "i1",
            url: "https://placehold.co/800x400/fe9a00/ffffff?text=Hero+Image",
            alt: "Hero Banner",
          },
          {
            id: "i2",
            url: "https://placehold.co/800x400/1e293b/ffffff?text=Chart",
            alt: "Data Chart",
          },
        ],
      };

      setData((prev) => ({ ...prev, ...mockAI }));
      toast.success("Blog Generated!");
    } catch (e) {
      toast.error("Generation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172b] text-slate-200 pb-20 font-sans">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #334155",
          },
        }}
      />

      {/* HEADER */}
      <header className="fixed top-0 z-50 w-full bg-[#0f172b]/95 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#fe9a00] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/30">
              AI
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Blog<span className="text-[#fe9a00]">Architect</span> Pro
              </h1>
              <p className="text-[10px] text-slate-500 -mt-0.5">
                AI-Powered Content Builder
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setData({
                  topic: "",
                  seoTitle: "",
                  seoDescription: "",
                  tags: [],
                  headings: [{ id: "h-1", level: 2, text: "" }],
                  images: [],
                  anchors: [],
                  content: {},
                  summary: "",
                  compiledHtml: "",
                });
                toast.success("Reset complete!");
              }}
            >
              Reset All
            </Button>
            <Button icon={<FiSave size={14} />} size="sm">
              Save Draft
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-[1800px] mx-auto grid grid-cols-12 gap-6">
        {/* LEFT SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 space-y-5">
          <div className="sticky top-24 space-y-5">
            {/* AI Generator */}
            <Card title="AI Generator" number={0} icon={<FiCpu size={16} />}>
              <Label>Topic Prompt</Label>
              <textarea
                value={data.topic}
                onChange={(e) => setData({ ...data, topic: e.target.value })}
                className="w-full h-28 bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-white focus:border-[#fe9a00] focus:outline-none mb-4 resize-none text-sm"
                placeholder="e.g. The benefits of Meditation for mental health..."
              />
              <Button
                onClick={handleAIGenerate}
                isLoading={loading}
                className="w-full"
                icon={<FiCpu size={14} />}
              >
                Generate Content
              </Button>
            </Card>

            {/* SEO Settings */}
            <Card title="SEO Settings" number={1} icon={<FiGlobe size={16} />}>
              <div className="space-y-4">
                <div>
                  <Label>SEO Title</Label>
                  <Input
                    value={data.seoTitle}
                    onChange={(e) =>
                      setData({ ...data, seoTitle: e.target.value })
                    }
                    placeholder="Main page title..."
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    {data.seoTitle.length}/60 characters
                  </p>
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <TextArea
                    value={data.seoDescription}
                    onChange={(e) =>
                      setData({ ...data, seoDescription: e.target.value })
                    }
                    placeholder="Brief description for search engines..."
                    rows={3}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    {data.seoDescription.length}/160 characters
                  </p>
                </div>

                {/* Enhanced Tags Section */}
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add tag..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAddTag}
                      icon={<FiPlus size={12} />}
                    />
                  </div>

                  {data.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map((tag, i) => (
                        <Tag
                          key={i}
                          text={tag}
                          onDelete={() => handleRemoveTag(i)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 italic">
                      No tags added yet
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* CENTER: EDITORS */}
        <div className="col-span-12 lg:col-span-5 space-y-5">
          {/* Structure & Content */}
          <Card title="Content Sections" number={2} icon={<FiList size={16} />}>
            <div className="space-y-4">
              {data.headings.map((h, i) => (
                <SectionItem
                  key={h.id}
                  heading={h}
                  index={i}
                  content={data.content[h.id] || ""}
                  onHeadingChange={(text) => {
                    const next = [...data.headings];
                    next[i].text = text;
                    setData({ ...data, headings: next });
                  }}
                  onLevelChange={(level) => {
                    const next = [...data.headings];
                    next[i].level = level;
                    setData({ ...data, headings: next });
                  }}
                  onContentChange={(html) => {
                    setData((prev) => ({
                      ...prev,
                      content: { ...prev.content, [h.id]: html },
                    }));
                  }}
                  onDelete={() => {
                    const nextH = data.headings.filter((_, idx) => idx !== i);
                    setData({ ...data, headings: nextH });
                  }}
                  onMoveUp={() => handleMoveSection(i, "up")}
                  onMoveDown={() => handleMoveSection(i, "down")}
                  isFirst={i === 0}
                  isLast={i === data.headings.length - 1}
                />
              ))}

              <Button
                variant="secondary"
                className="w-full border-dashed border-2"
                icon={<FiPlus size={14} />}
                onClick={() => {
                  setData({
                    ...data,
                    headings: [
                      ...data.headings,
                      { id: `h-${Date.now()}`, level: 2, text: "" },
                    ],
                  });
                }}
              >
                Add New Section
              </Button>
            </div>
          </Card>

          {/* Images & Auto-Links Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Images */}
            <Card number={3} title="Images" icon={<FiImage size={16} />}>
              <div className="space-y-3">
                {data.images.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative group rounded-lg overflow-hidden border border-slate-700"
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="h-24 w-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          setData({
                            ...data,
                            images: data.images.filter((_, idx) => idx !== i),
                          })
                        }
                        className="absolute top-2 right-2 text-red-400 bg-black/50 rounded-full p-1.5 hover:bg-red-500/20"
                      >
                        <FiTrash2 size={12} />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-2 left-2 bg-[#fe9a00] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <label className="h-20 rounded-lg border-2 border-dashed border-slate-700 hover:border-[#fe9a00] hover:bg-[#fe9a00]/5 flex items-center justify-center cursor-pointer text-slate-500 hover:text-[#fe9a00] transition-all">
                  <FiPlus size={18} />
                  <span className="text-xs ml-2">Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
            </Card>

            {/* Auto-Links */}
            <Card number={4} title="Auto-Links" icon={<FiLink size={16} />}>
              <div className="space-y-2">
                {data.anchors.length === 0 && (
                  <p className="text-xs text-slate-600 italic text-center py-4">
                    No auto-links configured
                  </p>
                )}
                {data.anchors.map((a, i) => (
                  <div
                    key={a.id}
                    className="bg-[#1e293b] p-3 rounded-lg border border-slate-700 group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <input
                        value={a.keyword}
                        onChange={(e) => {
                          const newAnchors = [...data.anchors];
                          newAnchors[i].keyword = e.target.value;
                          setData({ ...data, anchors: newAnchors });
                        }}
                        className="bg-transparent text-sm font-semibold text-white focus:outline-none w-full"
                        placeholder="Keyword"
                      />
                      <button
                        onClick={() =>
                          setData({
                            ...data,
                            anchors: data.anchors.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-slate-500 hover:text-red-400 ml-2"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                    <input
                      value={a.url}
                      onChange={(e) => {
                        const newAnchors = [...data.anchors];
                        newAnchors[i].url = e.target.value;
                        setData({ ...data, anchors: newAnchors });
                      }}
                      className="bg-transparent text-xs text-[#fe9a00] focus:outline-none w-full truncate"
                      placeholder="https://..."
                    />
                  </div>
                ))}
                <button
                  onClick={() =>
                    setData({
                      ...data,
                      anchors: [
                        ...data.anchors,
                        { id: `a-${Date.now()}`, keyword: "", url: "" },
                      ],
                    })
                  }
                  className="w-full text-xs text-[#fe9a00] hover:text-orange-400 py-2 border border-dashed border-slate-700 rounded-lg hover:border-[#fe9a00] transition-colors"
                >
                  + Add Auto-Link Rule
                </button>
              </div>
            </Card>
          </div>

          {/* Summary */}
          <Card number={5} title="Summary" icon={<FiLayout size={16} />}>
            <TextArea
              value={data.summary}
              onChange={(e) => setData({ ...data, summary: e.target.value })}
              placeholder="Write a compelling summary of your blog post..."
              rows={4}
            />
          </Card>
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/40 flex flex-col h-[85vh] border border-slate-200">
              {/* Browser Chrome */}
              <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="bg-white px-4 py-1.5 rounded-lg text-xs text-slate-500 flex items-center gap-2 shadow-sm border border-slate-200 font-mono">
                  <FiExternalLink size={12} />
                  <span className="text-slate-400">blog/</span>
                  <span className="text-slate-700">
                    {data.seoTitle
                      ? data.seoTitle
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .slice(0, 20)
                      : "preview"}
                  </span>
                </div>
              </div>

              {/* Content Preview */}
              <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900">
                {data.compiledHtml ? (
                  <div
                    className="prose prose-slate max-w-none 
                      prose-headings:font-bold prose-headings:text-slate-900 
                      prose-a:text-[#fe9a00] prose-a:no-underline hover:prose-a:underline 
                      prose-img:rounded-xl prose-img:shadow-lg
                      prose-strong:text-slate-900
                      prose-ul:list-disc prose-ol:list-decimal
                    "
                    dangerouslySetInnerHTML={{ __html: data.compiledHtml }}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <FiCode size={28} className="text-slate-400" />
                    </div>
                    <p className="text-slate-500">
                      Start writing to see preview...
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="bg-[#0f172b] p-4 flex items-center justify-between border-t border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <FiCode size={12} />
                    {data.compiledHtml.length.toLocaleString()} chars
                  </span>
                  <span className="text-slate-600">|</span>
                  <span>
                    {data.headings.filter((h) => h.text).length} sections
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(data.compiledHtml);
                    toast.success("HTML copied to clipboard!");
                  }}
                  icon={<FiCopy size={12} />}
                >
                  Copy HTML
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
