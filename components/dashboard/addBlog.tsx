"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExtension from "@tiptap/extension-image";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Mention from "@tiptap/extension-mention";
import StepByStepBlogGenerator, {
  StepGeneratorData,
} from "./StepByStepBlogGenerator";

import {
  FiCpu,
  FiGlobe,
  FiImage,
  FiLink,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiSave,
  FiTrash2,
  FiPlus,
  FiCopy,
  FiRefreshCw,
  FiExternalLink,
  FiBold,
  FiItalic,
  FiDroplet,
  FiX,
  FiType,
  FiChevronDown,
  FiChevronUp,
  FiUnderline,
  FiHash,
  FiMonitor,
  FiTablet,
  FiSmartphone,
  FiEye,
  FiDownload,
  FiTarget,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit3,
  FiZap,
  FiLayers,
  FiMessageSquare,
  FiBookOpen,
  FiLink2,
  FiCheck,
  FiVideo,
  FiUpload,
  FiFolder,
  FiMinus,
  FiAlertTriangle,
  FiInfo,
  FiAward,
  FiCode,
  FiCheckSquare,
  FiGrid,
  FiSmile,
} from "react-icons/fi";

// ============================================================================
// CUSTOM FONT SIZE EXTENSION
// ============================================================================

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize?.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: any) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }: any) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

// ============================================================================
// CUSTOM INLINE TEXT ALIGN EXTENSION
// ============================================================================

const InlineTextAlign = Extension.create({
  name: "inlineTextAlign",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: null,
            parseHTML: (element) => element.style.textAlign,
            renderHTML: (attributes) => {
              if (!attributes.textAlign) return {};
              return {
                style: `text-align: ${attributes.textAlign}; display: inline-block;`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setInlineTextAlign:
        (alignment: string) =>
        ({ chain }: any) => {
          return chain().setMark("textStyle", { textAlign: alignment }).run();
        },
      unsetInlineTextAlign:
        () =>
        ({ chain }: any) => {
          return chain()
            .setMark("textStyle", { textAlign: null })
            .removeEmptyTextStyle()
            .run();
        },
    } as any;
  },
});

// ============================================================================
// EMOJI PICKER
// ============================================================================

const EmojiPicker = ({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 p-3 bg-[#0f172b] border border-slate-700 rounded-xl shadow-2xl z-50 w-[320px] max-h-75 overflow-y-auto"
    >
      <p className="text-xs text-slate-400 font-semibold mb-3 uppercase sticky top-0 bg-[#0f172b] pb-2">
        😀 Emoji Picker
      </p>
      <div className="grid grid-cols-8 gap-1">
        {EMOJI_LIST.map((emoji, index) => (
          <button
            key={index}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
            className="text-2xl hover:bg-slate-800 rounded p-1 transition-all hover:scale-125"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// LIST TYPE DROPDOWN
// ============================================================================

const ListTypeDropdown = ({
  isOpen,
  onClose,
  onSelect,
  editor,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: "bullet" | "ordered" | "task") => void;
  editor: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const listTypes = [
    {
      type: "bullet" as const,
      label: "Bullet List",
      icon: <FiList size={14} />,
      isActive: editor.isActive("bulletList"),
    },
    {
      type: "ordered" as const,
      label: "Numbered List",
      icon: <FiHash size={14} />,
      isActive: editor.isActive("orderedList"),
    },
    {
      type: "task" as const,
      label: "Task List",
      icon: <FiCheckSquare size={14} />,
      isActive: editor.isActive("taskList"),
    },
  ];

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 p-2 bg-[#0f172b] border border-slate-700 rounded-xl shadow-2xl z-50 min-w-40"
    >
      <p className="text-[10px] text-slate-500 uppercase px-2 mb-1">
        List Type
      </p>
      {listTypes.map((item) => (
        <button
          key={item.type}
          onClick={() => {
            onSelect(item.type);
            onClose();
          }}
          className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-slate-800 flex items-center gap-2 ${
            item.isActive ? "text-[#fe9a00] bg-[#fe9a00]/10" : "text-slate-300"
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// TABLE CONTROLS
// ============================================================================

const TableControls = ({
  isOpen,
  onClose,
  editor,
}: {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    onClose();
    toast.success("Table inserted!");
  };

  const isInTable = editor.isActive("table");

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 p-3 bg-[#0f172b] border border-slate-700 rounded-xl shadow-2xl z-50 min-w-55"
    >
      <p className="text-xs text-slate-400 font-semibold mb-3 uppercase">
        📊 Table Options
      </p>

      {!isInTable ? (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Rows</label>
            <input
              type="number"
              min="1"
              max="10"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 1)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-2 py-1 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Columns</label>
            <input
              type="number"
              min="1"
              max="10"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value) || 1)}
              className="w-full bg-[#1e293b] border border-slate-700 rounded px-2 py-1 text-sm text-white"
            />
          </div>
          <button
            onClick={insertTable}
            className="w-full bg-[#fe9a00] hover:bg-orange-600 text-white px-3 py-2 rounded text-sm font-medium"
          >
            Insert Table
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          <button
            onClick={() => {
              editor.chain().focus().addColumnBefore().run();
              toast.success("Column added");
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded"
          >
            + Add Column Before
          </button>
          <button
            onClick={() => {
              editor.chain().focus().addColumnAfter().run();
              toast.success("Column added");
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded"
          >
            + Add Column After
          </button>
          <button
            onClick={() => {
              editor.chain().focus().addRowBefore().run();
              toast.success("Row added");
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded"
          >
            + Add Row Before
          </button>
          <button
            onClick={() => {
              editor.chain().focus().addRowAfter().run();
              toast.success("Row added");
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded"
          >
            + Add Row After
          </button>
          <hr className="border-slate-700 my-2" />
          <button
            onClick={() => {
              editor.chain().focus().deleteColumn().run();
              toast.success("Column deleted");
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded"
          >
            Delete Column
          </button>
          <button
            onClick={() => {
              editor.chain().focus().deleteRow().run();
              toast.success("Row deleted");
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded"
          >
            Delete Row
          </button>
          <button
            onClick={() => {
              editor.chain().focus().deleteTable().run();
              onClose();
              toast.success("Table deleted");
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded"
          >
            Delete Table
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TYPES
// ============================================================================

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  alt: string;
  caption?: string;
  filename?: string;
  size?: number;
}

interface Anchor {
  id: string;
  keyword: string;
  url: string;
}

interface HeadingItem {
  id: string;
  level: number;
  text: string;
  content: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface BlogPostData {
  topic: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  tags: string[];
  author: string;
  publishDate: string;
  headings: HeadingItem[];
  mediaLibrary: MediaItem[];
  anchors: Anchor[];
  summary: string;
  conclusion: string;
  faqs: FAQItem[];
  tableOfContents: boolean;
  compiledHtml: string;
}

interface ContentIssue {
  type: "error" | "warning" | "info" | "success";
  section: string;
  message: string;
  suggestion?: string;
}

type DeviceType = "desktop" | "tablet" | "mobile";

// ============================================================================
// CONSTANTS
// ============================================================================

const DEVICE_SIZES: Record<DeviceType, { width: number; label: string }> = {
  desktop: { width: 1280, label: "Desktop" },
  tablet: { width: 768, label: "Tablet" },
  mobile: { width: 375, label: "Mobile" },
};

const FONT_SIZES = [
  { label: "XS", value: "12px" },
  { label: "SM", value: "12px" },
  { label: "Base", value: "12px" },
  { label: "LG", value: "12px" },
  { label: "XL", value: "12px" },
  { label: "2XL", value: "12px" },
  { label: "3XL", value: "12px" },
  { label: "4XL", value: "12px" },
];

const TEXT_COLORS = [
  "#ffffff",
  "#f8fafc",
  "#e2e8f0",
  "#94a3b8",
  "#64748b",
  "#475569",
  "#334155",
  "#1e293b",
  "#0f172a",
  "#000000",
  "#fef2f2",
  "#fee2e2",
  "#fecaca",
  "#fca5a5",
  "#f87171",
  "#ef4444",
  "#dc2626",
  "#b91c1c",
  "#991b1b",
  "#7f1d1d",
  "#fff7ed",
  "#ffedd5",
  "#fed7aa",
  "#fdba74",
  "#fb923c",
  "#f97316",
  "#ea580c",
  "#c2410c",
  "#9a3412",
  "#7c2d12",
  "#fefce8",
  "#fef9c3",
  "#fef08a",
  "#fde047",
  "#facc15",
  "#eab308",
  "#ca8a04",
  "#a16207",
  "#854d0e",
  "#713f12",
  "#f0fdf4",
  "#dcfce7",
  "#bbf7d0",
  "#86efac",
  "#4ade80",
  "#22c55e",
  "#16a34a",
  "#15803d",
  "#166534",
  "#14532d",
  "#ecfeff",
  "#cffafe",
  "#a5f3fc",
  "#67e8f9",
  "#22d3ee",
  "#06b6d4",
  "#0891b2",
  "#0e7490",
  "#155e75",
  "#164e63",
  "#eff6ff",
  "#dbeafe",
  "#bfdbfe",
  "#93c5fd",
  "#60a5fa",
  "#3b82f6",
  "#2563eb",
  "#1d4ed8",
  "#1e40af",
  "#1e3a8a",
  "#f5f3ff",
  "#ede9fe",
  "#ddd6fe",
  "#c4b5fd",
  "#a78bfa",
  "#8b5cf6",
  "#7c3aed",
  "#6d28d9",
  "#5b21b6",
  "#4c1d95",
  "#fdf4ff",
  "#fae8ff",
  "#f5d0fe",
  "#f0abfc",
  "#e879f9",
  "#d946ef",
  "#c026d3",
  "#a21caf",
  "#86198f",
  "#701a75",
];

const BG_COLORS = [
  "#fef08a",
  "#fde047",
  "#facc15",
  "#fcd34d",
  "#fbbf24",
  "#f59e0b",
  "#fed7aa",
  "#fdba74",
  "#fb923c",
  "#f97316",
  "#ea580c",
  "#c2410c",
  "#bbf7d0",
  "#86efac",
  "#4ade80",
  "#22c55e",
  "#16a34a",
  "#15803d",
  "#a5f3fc",
  "#67e8f9",
  "#22d3ee",
  "#06b6d4",
  "#0891b2",
  "#0e7490",
  "#bfdbfe",
  "#93c5fd",
  "#60a5fa",
  "#3b82f6",
  "#2563eb",
  "#1d4ed8",
  "#c4b5fd",
  "#a78bfa",
  "#8b5cf6",
  "#7c3aed",
  "#6d28d9",
  "#5b21b6",
];

const EMOJI_LIST = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "😓",
  "🤗",
  "🤔",
  "🤭",
  "🤫",
  "🤥",
  "😶",
  "😐",
  "😑",
  "😬",
  "🙄",
  "😯",
  "😦",
  "😧",
  "😮",
  "😲",
  "🥱",
  "😴",
  "🤤",
  "😪",
  "😵",
  "🤐",
  "🥴",
  "🤢",
  "🤮",
  "🤧",
  "😷",
  "🤒",
  "🤕",
  "🤑",
  "🤠",
  "👍",
  "👎",
  "👊",
  "✊",
  "🤛",
  "🤜",
  "🤞",
  "✌️",
  "🤟",
  "🤘",
  "👌",
  "🤌",
  "🤏",
  "👈",
  "👉",
  "👆",
  "👇",
  "☝️",
  "✋",
  "🤚",
  "🖐",
  "🖖",
  "👋",
  "🤙",
  "💪",
  "🦾",
  "🖕",
  "✍️",
  "🙏",
  "🦶",
  "🦵",
  "🦿",
  "💋",
  "👄",
  "🦷",
  "👅",
  "👂",
  "🦻",
  "👃",
  "👣",
  "👁",
  "👀",
  "🧠",
  "🫀",
  "🫁",
  "🩸",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "💔",
  "❣️",
  "💕",
  "💞",
  "💓",
  "💗",
  "💖",
  "💘",
  "💝",
  "💟",
  "☮️",
  "✝️",
  "☪️",
  "🕉",
  "☸️",
  "✡️",
  "🔯",
  "🕎",
  "☯️",
  "☦️",
  "🛐",
  "⛎",
  "♈",
  "♉",
  "♊",
  "♋",
  "♌",
  "♍",
  "♎",
  "♏",
  "♐",
  "♑",
  "♒",
  "♓",
  "🆔",
  "⚛️",
  "🉑",
  "☢️",
  "☣️",
  "📴",
  "📳",
  "🈶",
  "🈚",
  "🈸",
  "🈺",
  "🈷️",
  "✴️",
  "🆚",
  "💮",
  "🉐",
  "㊙️",
  "㊗️",
  "🈴",
  "🈵",
  "🈹",
  "🈲",
  "🅰️",
  "🅱️",
  "🆎",
  "🆑",
  "🅾️",
  "🆘",
  "❌",
  "⭕",
  "🛑",
  "⛔",
  "📛",
  "🚫",
  "💯",
  "💢",
  "♨️",
  "🚷",
  "🚯",
  "🚳",
  "🚱",
  "🔞",
  "📵",
  "🎯",
  "🎪",
  "🎨",
  "🎬",
  "🎤",
  "🎧",
  "🎼",
  "🎹",
  "🥁",
  "🎷",
  "🎺",
  "🎸",
  "🪕",
  "🎻",
  "🎲",
  "♟",
  "🎯",
  "🎳",
  "🎮",
  "🎰",
  "🧩",
  "🚗",
  "🚕",
  "🚙",
  "🚌",
  "🚎",
  "🏎",
  "🚓",
  "🚑",
  "🚒",
  "🚐",
  "🛻",
  "🚚",
  "🚛",
  "🚜",
  "🦯",
  "🦽",
  "🦼",
  "🛴",
  "🚲",
  "🛵",
  "🏍",
  "🛺",
  "🚨",
  "🚔",
  "🚍",
  "🚘",
  "🚖",
  "🚡",
  "🚠",
  "🚟",
  "🚃",
  "🚋",
  "🚞",
  "🚝",
  "🚄",
  "🚅",
  "🚈",
  "🚂",
  "🚆",
  "🚇",
  "🚊",
  "🚉",
  "✈️",
  "🛫",
  "🛬",
  "🛩",
  "💺",
  "🛰",
  "🚀",
  "🛸",
  "🚁",
  "🛶",
  "⛵",
  "🚤",
  "🛥",
  "🛳",
  "⛴",
  "🚢",
  "⚓",
];

const MENTION_SUGGESTIONS = [
  "John Doe",
  "Jane Smith",
  "Alice Johnson",
  "Bob Williams",
  "Charlie Brown",
  "David Lee",
  "Emma Davis",
  "Frank Miller",
  "Grace Wilson",
  "Henry Moore",
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateId = () =>
  `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const calculateReadingTime = (text: string): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const countWords = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

const stripHtml = (html: string): string => {
  if (typeof window === "undefined") return html.replace(/<[^>]*>/g, "");
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// ============================================================================
// MODAL BACKDROP
// ============================================================================

const ModalBackdrop = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    {children}
  </div>
);

// ============================================================================
// LINK MODAL
// ============================================================================

const LinkModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = "",
  initialText = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, text: string, openInNewTab: boolean) => void;
  initialUrl?: string;
  initialText?: string;
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialUrl, initialText]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim(), text.trim(), openInNewTab);
      onClose();
    }
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-[#0f172b] border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fe9a00]/10 flex items-center justify-center">
              <FiLink className="text-[#fe9a00]" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Insert Link</h3>
              <p className="text-xs text-slate-400">
                Add a hyperlink to your content
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg"
          >
            <FiX className="text-slate-400" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              URL *
            </label>
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#fe9a00]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Link Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Display text"
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#fe9a00]"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-[#fe9a00]"
            />
            <span className="text-sm text-slate-300">Open in new tab</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#fe9a00] hover:bg-orange-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <FiCheck size={18} /> Insert
            </button>
          </div>
        </form>
      </div>
    </ModalBackdrop>
  );
};

// ============================================================================
// MEDIA PICKER MODAL
// ============================================================================

const MediaPickerModal = ({
  isOpen,
  onClose,
  mediaLibrary,
  onSelect,
  onUpload,
  mediaType = "all",
}: {
  isOpen: boolean;
  onClose: () => void;
  mediaLibrary: MediaItem[];
  onSelect: (media: MediaItem) => void;
  onUpload: (file: File) => void;
  mediaType?: "image" | "video" | "all";
}) => {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = mediaLibrary.filter((m) =>
    mediaType === "all" ? true : m.type === mediaType,
  );

  if (!isOpen) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) onUpload(e.dataTransfer.files[0]);
  };

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-[#0f172b] border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fe9a00]/10 flex items-center justify-center">
              <FiFolder className="text-[#fe9a00]" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Media Library
              </h3>
              <p className="text-xs text-slate-400">Select or upload media</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg"
          >
            <FiX className="text-slate-400" size={20} />
          </button>
        </div>

        <div className="flex gap-1 p-2 border-b border-slate-800">
          {(["library", "upload"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-[#fe9a00] text-white"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {tab === "library"
                ? `Library (${filteredMedia.length})`
                : "Upload New"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeTab === "library" ? (
            filteredMedia.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredMedia.map((media) => (
                  <button
                    key={media.id}
                    onClick={() => {
                      onSelect(media);
                      onClose();
                    }}
                    className="group relative aspect-video bg-slate-800 rounded-xl overflow-hidden border-2 border-transparent hover:border-[#fe9a00]"
                  >
                    {media.type === "image" ? (
                      <img
                        src={media.url}
                        alt={media.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <FiVideo size={32} className="text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-[#fe9a00] text-white text-xs rounded-lg">
                        Insert
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500">
                <FiImage size={48} className="mx-auto mb-4" />
                <p className="mb-4">No media files yet</p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="px-4 py-2 bg-[#fe9a00] text-white rounded-lg text-sm"
                >
                  Upload Media
                </button>
              </div>
            )
          ) : (
            <div
              onDragEnter={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragActive(false);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center ${
                dragActive
                  ? "border-[#fe9a00] bg-[#fe9a00]/10"
                  : "border-slate-700"
              }`}
            >
              <FiUpload
                size={48}
                className={`mx-auto mb-4 ${dragActive ? "text-[#fe9a00]" : "text-slate-500"}`}
              />
              <p className="text-lg text-white mb-2">Drag & drop files here</p>
              <p className="text-sm text-slate-400 mb-6">or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={(e) =>
                  e.target.files?.[0] && onUpload(e.target.files[0])
                }
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-[#fe9a00] text-white rounded-xl font-medium"
              >
                Browse Files
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalBackdrop>
  );
};

// ============================================================================
// PREVIEW MODAL
// ============================================================================

const PreviewModal = ({
  isOpen,
  onClose,
  html,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  html: string;
  data: BlogPostData;
}) => {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generateFullHTML = useCallback(
    () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.seoTitle || "Blog Post"}</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <style>
    body { font-family: system-ui, sans-serif; }
    .prose img, .prose video { max-width: 100%; border-radius: 0.75rem; margin: 1.5rem 0; }
    .prose h1, .prose h2, .prose h3 { font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
    .prose hr { border-color: #e5e7eb; margin: 2rem 0; }
    .prose ul { list-style-type: disc; margin-left: 1.5rem; }
    .prose ol { list-style-type: decimal; margin-left: 1.5rem; }
    .prose a { color: #fe9a00; text-decoration: underline; }
    details summary { cursor: pointer; }
  </style>
</head>
<body class="bg-white text-gray-900">
  <article class="max-w-3xl mx-auto px-6 py-12 prose">${html}</article>
</body>
</html>`,
    [html, data],
  );

  useEffect(() => {
    if (isOpen && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(generateFullHTML());
        doc.close();
      }
    }
  }, [isOpen, html, generateFullHTML]);

  if (!isOpen) return null;

  const openInNewTab = () => {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(generateFullHTML());
      w.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0f1a] flex flex-col">
      <div className="bg-[#0f172b] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <FiX size={20} />
          </button>
          <span className="text-white font-semibold">Preview</span>
          <div className="flex gap-1 bg-slate-800 rounded-xl p-1 ml-4">
            {(Object.keys(DEVICE_SIZES) as DeviceType[]).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  device === d
                    ? "bg-[#fe9a00] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {d === "desktop" && <FiMonitor size={16} />}
                {d === "tablet" && <FiTablet size={16} />}
                {d === "mobile" && <FiSmartphone size={16} />}
                <span className="hidden sm:inline">
                  {DEVICE_SIZES[d].label}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openInNewTab}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm flex items-center gap-2"
          >
            <FiExternalLink size={16} /> New Tab
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(html);
              toast.success("Copied!");
            }}
            className="px-4 py-2 bg-[#fe9a00] text-white rounded-lg text-sm flex items-center gap-2"
          >
            <FiCopy size={16} /> Copy HTML
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 flex justify-center bg-[#1a1f2e]">
        <div
          className="bg-white rounded-lg shadow-2xl overflow-hidden"
          style={{ width: `${DEVICE_SIZES[device].width}px`, maxWidth: "100%" }}
        >
          <div className="bg-slate-100 border-b px-4 py-2 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded-lg px-3 py-1 text-xs text-slate-500 font-mono truncate">
              yourblog.com/
              {data.seoTitle?.toLowerCase().replace(/\s+/g, "-").slice(0, 30) ||
                "preview"}
            </div>
          </div>
          <iframe
            ref={iframeRef}
            className="w-full"
            style={{ height: "70vh" }}
            title="Preview"
          />
        </div>
      </div>

      <div className="bg-[#0f172b] border-t border-slate-800 px-4 py-2 flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center gap-4">
          <span>
            <FiClock size={14} className="inline mr-1" />
            {calculateReadingTime(stripHtml(html))} min
          </span>
          <span>{countWords(stripHtml(html))} words</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COLOR PICKER
// ============================================================================

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
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 p-3 bg-[#0f172b] border border-slate-700 rounded-xl shadow-2xl z-50 min-w-65"
    >
      <p className="text-xs text-slate-400 font-semibold mb-3 uppercase">
        {title}
      </p>
      <div className="grid grid-cols-10 gap-1">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => {
              onSelect(color);
              onClose();
            }}
            className="w-5 h-5 rounded border border-slate-600 hover:scale-125 transition-transform"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <button
        onClick={() => {
          onSelect("");
          onClose();
        }}
        className="mt-3 w-full text-xs text-slate-400 py-2 border border-dashed border-slate-700 rounded-lg"
      >
        Remove
      </button>
    </div>
  );
};

// ============================================================================
// FONT SIZE DROPDOWN
// ============================================================================

const FontSizeDropdown = ({
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0   p-2 bg-[#0f172b] border border-slate-700 rounded-xl   shadow-2xl z-50 min-w-30"
    >
      <p className="text-[10px] text-slate-500 uppercase px-2 mb-1">
        Font Size
      </p>
      {FONT_SIZES.map((size, idx) => (
        <button
          key={size.value + idx}
          onClick={() => {
            onSelect(size.value);
            onClose();
          }}
          className={`w-full text-left px-3  py-0.5 rounded text-xs hover:bg-slate-800 flex items-center justify-between ${
            currentSize === size.value
              ? "text-[#fe9a00] bg-[#fe9a00]/10"
              : "text-slate-300"
          }`}
        >
          <span style={{ fontSize: size.value }}>{size.label}</span>
          <span className="text-[10px] text-slate-500">{size.value}</span>
        </button>
      ))}
      <button
        onClick={() => {
          onSelect("");
          onClose();
        }}
        className="w-full text-xs text-slate-400 py-1.5 mt-1 border-t hover:text-[#fe9a00] transition-all duration-150 border-slate-700"
      >
        Reset
      </button>
    </div>
  );
};

// ============================================================================
// EDITOR TOOLBAR BUTTON
// ============================================================================

const EditorBtn = ({ onClick, isActive, children, title, disabled }: any) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`p-1.5 rounded-md text-xs transition-all ${
      isActive
        ? "bg-[#fe9a00] text-white"
        : "text-slate-400 hover:bg-slate-700 hover:text-white"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

// ============================================================================
// RICH TEXT EDITOR
// ============================================================================

const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Start writing...",
  minHeight = "120px",
  showFullToolbar = true,
  onOpenMediaPicker,
}: {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  showFullToolbar?: boolean;
  onOpenMediaPicker?: (type: "image" | "video" | "all") => void;
}) => {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showListType, setShowListType] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showMediaMenu, setShowMediaMenu] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        horizontalRule: false,
        blockquote: false,
        codeBlock: false,
      }),
      TextStyle,
      FontSize,
      InlineTextAlign,
      Color,
      Underline,
      // Ensure Subscript extension is included
      Subscript,
      Superscript,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#fe9a00] underline cursor-pointer" },
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: "rounded-xl max-w-full h-auto my-4" },
      }),
      HorizontalRule.configure({
        HTMLAttributes: { class: "my-6 border-slate-600" },
      }),
      BulletList.configure({
        HTMLAttributes: { class: "list-disc ml-6 space-y-1" },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: "list-decimal ml-6 space-y-1" },
      }),
      TaskList.configure({
        HTMLAttributes: { class: "task-list" },
      }),
      TaskItem.configure({
        HTMLAttributes: { class: "task-item flex items-start gap-2" },
        nested: true,
      }),
      ListItem,
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-[#fe9a00] pl-4 italic text-slate-400 my-4",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class:
            "bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-sm my-4",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border border-slate-700",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-slate-700 bg-slate-800 font-bold p-2 text-left",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-slate-700 p-2",
        },
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention bg-[#fe9a00]/20 text-[#fe9a00] px-1 rounded",
        },
        suggestion: {
          items: ({ query }: { query: string }) => {
            return MENTION_SUGGESTIONS.filter((item) =>
              item.toLowerCase().startsWith(query.toLowerCase()),
            ).slice(0, 5);
          },
          render: () => {
            let component: any;
            let popup: any;

            return {
              onStart: (props: any) => {
                component = document.createElement("div");
                component.className =
                  "bg-[#0f172b] border border-slate-700 rounded-lg shadow-2xl p-2 min-w-[200px]";

                const renderItems = () => {
                  component.innerHTML = props.items
                    .map(
                      (item: string, index: number) =>
                        `<button class="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded ${index === props.selectedIndex ? "bg-slate-800" : ""}" data-index="${index}">@${item}</button>`,
                    )
                    .join("");

                  component.querySelectorAll("button").forEach((btn: any) => {
                    btn.onclick = () => {
                      props.command({ id: btn.dataset.index });
                    };
                  });
                };

                renderItems();

                if (!props.clientRect) return;

                popup = {
                  getBoundingClientRect: props.clientRect,
                };

                document.body.appendChild(component);
              },

              onUpdate(props: any) {
                if (!component) return;
                component.innerHTML = props.items
                  .map(
                    (item: string, index: number) =>
                      `<button class="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded ${index === props.selectedIndex ? "bg-slate-800" : ""}" data-index="${index}">@${item}</button>`,
                  )
                  .join("");

                component.querySelectorAll("button").forEach((btn: any) => {
                  btn.onclick = () => {
                    props.command({ id: btn.dataset.index });
                  };
                });
              },

              onKeyDown(props: any) {
                if (props.event.key === "Escape") {
                  component?.remove();
                  return true;
                }
                return false;
              },

              onExit() {
                component?.remove();
              },
            };
          },
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    editorProps: {
      attributes: {
        class: `prose prose-invert max-w-none focus:outline-none text-sm text-slate-300 leading-relaxed`,
        style: `min-height: ${minHeight}`,
      },
    },
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor) {
      const currentContent = editor.getHTML();
      const newContent = content || '';
      
      // More robust comparison - trim and compare
      const currentTrimmed = currentContent.trim();
      const newTrimmed = newContent.trim();
      
      if (currentTrimmed !== newTrimmed) {
        console.log('🔄 RichTextEditor updating content:', { 
          newLength: newTrimmed.length, 
          currentLength: currentTrimmed.length,
          newPreview: newTrimmed.substring(0, 100),
          currentPreview: currentTrimmed.substring(0, 100)
        });
        editor.commands.setContent(newContent);
      }
    }
  }, [content, editor]);

  if (!editor) return null;

  const handleLinkClick = () => {
    const { from, to } = editor.state.selection;
    setSelectedText(editor.state.doc.textBetween(from, to));
    setShowLinkModal(true);
  };

  const handleLinkSubmit = (
    url: string,
    text: string,
    openInNewTab: boolean,
  ) => {
    if (text && editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${url}" ${openInNewTab ? 'target="_blank"' : ""}>${text}</a>`,
        )
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: openInNewTab ? "_blank" : null })
        .run();
    }
  };

  const handleListSelect = (type: "bullet" | "ordered" | "task") => {
    switch (type) {
      case "bullet":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "ordered":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "task":
        editor.chain().focus().toggleTaskList().run();
        break;
    }
  };

  return (
    <>
      <div className="bg-[#1e293b] border border-slate-700 rounded-xl overflow-hidden">
        <div className="bg-[#0f172b] border-b border-slate-700 p-1.5 flex flex-wrap gap-0.5 items-center">
          {/* Basic Formatting */}
          <div className="flex gap-0.5 border-r border-slate-700 pr-1.5 mr-1">
            <EditorBtn
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold (Ctrl+B)"
            >
              <FiBold size={12} />
            </EditorBtn>
            <EditorBtn
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic (Ctrl+I)"
            >
              <FiItalic size={12} />
            </EditorBtn>
            <EditorBtn
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Underline (Ctrl+U)"
            >
              <FiUnderline size={12} />
            </EditorBtn>
            <EditorBtn
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strikethrough"
            >
              <span className="text-xs font-bold">S</span>
            </EditorBtn>
          </div>

          {showFullToolbar && (
            <>
              {/* Font Size */}
              <div className="relative border-r border-slate-700 pr-1.5 mr-1">
                <EditorBtn
                  onClick={() => setShowFontSize(!showFontSize)}
                  isActive={showFontSize}
                  title="Font Size"
                >
                  <FiType size={12} />
                </EditorBtn>
                <FontSizeDropdown
                  isOpen={showFontSize}
                  onClose={() => setShowFontSize(false)}
                  onSelect={(size) => {
                    if (size)
                      (editor.chain().focus() as any).setFontSize(size).run();
                    else (editor.chain().focus() as any).unsetFontSize().run();
                  }}
                  currentSize={editor.getAttributes("textStyle").fontSize}
                />
              </div>

              {/* Colors */}
              <div className="flex gap-0.5 border-r border-slate-700 pr-1.5 mr-1">
                <div className="relative">
                  <EditorBtn
                    onClick={() => setShowTextColor(!showTextColor)}
                    isActive={showTextColor}
                    title="Text Color"
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-[10px]">A</span>
                      <div
                        className="w-3 h-0.5 rounded-full"
                        style={{
                          backgroundColor:
                            editor.getAttributes("textStyle").color ||
                            "#fe9a00",
                        }}
                      />
                    </div>
                  </EditorBtn>
                  <ColorPicker
                    isOpen={showTextColor}
                    onClose={() => setShowTextColor(false)}
                    onSelect={(c) =>
                      c
                        ? editor.chain().focus().setColor(c).run()
                        : editor.chain().focus().unsetColor().run()
                    }
                    title="Text Color"
                    colors={TEXT_COLORS}
                  />
                </div>
                <div className="relative">
                  <EditorBtn
                    onClick={() => setShowBgColor(!showBgColor)}
                    isActive={editor.isActive("highlight")}
                    title="Highlight"
                  >
                    <FiDroplet size={12} />
                  </EditorBtn>
                  <ColorPicker
                    isOpen={showBgColor}
                    onClose={() => setShowBgColor(false)}
                    onSelect={(c) =>
                      c
                        ? editor
                            .chain()
                            .focus()
                            .setHighlight({ color: c })
                            .run()
                        : editor.chain().focus().unsetHighlight().run()
                    }
                    title="Highlight"
                    colors={BG_COLORS}
                  />
                </div>
              </div>

              {/* Alignment */}
              <div className="flex gap-0.5 border-r border-slate-700 pr-1.5 mr-1">
                <EditorBtn
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  isActive={editor.isActive({ textAlign: "left" })}
                  title="Align Left"
                >
                  <FiAlignLeft size={12} />
                </EditorBtn>
                <EditorBtn
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  isActive={editor.isActive({ textAlign: "center" })}
                  title="Align Center"
                >
                  <FiAlignCenter size={12} />
                </EditorBtn>
                <EditorBtn
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  isActive={editor.isActive({ textAlign: "right" })}
                  title="Align Right"
                >
                  <FiAlignRight size={12} />
                </EditorBtn>
                <EditorBtn
                  onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                  isActive={editor.isActive({ textAlign: "justify" })}
                  title="Justify"
                >
                  <FiAlignCenter size={12} className="rotate-180" />
                </EditorBtn>
              </div>

              {/* Lists */}
              <div className="relative border-r border-slate-700 pr-1.5 mr-1">
                <EditorBtn
                  onClick={() => setShowListType(!showListType)}
                  isActive={
                    editor.isActive("bulletList") ||
                    editor.isActive("orderedList") ||
                    editor.isActive("taskList")
                  }
                  title="Lists"
                >
                  <FiList size={12} />
                </EditorBtn>
                <ListTypeDropdown
                  isOpen={showListType}
                  onClose={() => setShowListType(false)}
                  onSelect={handleListSelect}
                  editor={editor}
                />
              </div>

              {/* Blockquote & Code */}
              <div className="flex gap-0.5 border-r border-slate-700 pr-1.5 mr-1">
                <EditorBtn
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  isActive={editor.isActive("blockquote")}
                  title="Blockquote"
                >
                  <span className="text-xs font-bold">"</span>
                </EditorBtn>
                <EditorBtn
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  isActive={editor.isActive("codeBlock")}
                  title="Code Block"
                >
                  <FiCode size={12} />
                </EditorBtn>
              </div>

              {/* Table */}
              <div className="relative border-r border-slate-700 pr-1.5 mr-1">
                <EditorBtn
                  onClick={() => setShowTable(!showTable)}
                  isActive={editor.isActive("table") || showTable}
                  title="Table"
                >
                  <FiGrid size={12} />
                </EditorBtn>
                <TableControls
                  isOpen={showTable}
                  onClose={() => setShowTable(false)}
                  editor={editor}
                />
              </div>

              {/* Horizontal Rule */}
              <div className="flex gap-0.5 border-r border-slate-700 pr-1.5 mr-1">
                <EditorBtn
                  onClick={() =>
                    editor.chain().focus().setHorizontalRule().run()
                  }
                  title="Horizontal Line"
                >
                  <FiMinus size={12} />
                </EditorBtn>
              </div>

              {/* Emoji */}
              <div className="relative border-r border-slate-700 pr-1.5 mr-1">
                <EditorBtn
                  onClick={() => setShowEmoji(!showEmoji)}
                  isActive={showEmoji}
                  title="Insert Emoji"
                >
                  <FiSmile size={12} />
                </EditorBtn>
                <EmojiPicker
                  isOpen={showEmoji}
                  onClose={() => setShowEmoji(false)}
                  onSelect={(emoji) => {
                    editor.chain().focus().insertContent(emoji).run();
                  }}
                />
              </div>

              {/* Media */}
              {onOpenMediaPicker && (
                <div className="relative border-r border-slate-700 pr-1.5 mr-1">
                  <EditorBtn
                    onClick={() => setShowMediaMenu(!showMediaMenu)}
                    isActive={showMediaMenu}
                    title="Insert Media"
                  >
                    <FiImage size={12} />
                  </EditorBtn>
                  {showMediaMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-[#0f172b] border border-slate-700 rounded-lg shadow-xl z-50 py-1 min-w-35">
                      <button
                        onClick={() => {
                          onOpenMediaPicker("image");
                          setShowMediaMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <FiImage size={14} /> Image
                      </button>
                      <button
                        onClick={() => {
                          onOpenMediaPicker("video");
                          setShowMediaMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      >
                        <FiVideo size={14} /> Video
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Link */}
          <EditorBtn
            onClick={handleLinkClick}
            isActive={editor.isActive("link")}
            title="Insert Link"
          >
            <FiLink size={12} />
          </EditorBtn>
          {editor.isActive("link") && (
            <EditorBtn
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove Link"
            >
              <FiX size={12} />
            </EditorBtn>
          )}

          {/* Subscript & Superscript */}
          {showFullToolbar && (
            <div className="flex gap-0.5 ml-1">
              <EditorBtn
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                isActive={editor.isActive("subscript")}
                title="Subscript"
              >
                <span className="text-[10px]">
                  X<sub>2</sub>
                </span>
              </EditorBtn>
              <EditorBtn
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                isActive={editor.isActive("superscript")}
                title="Superscript"
              >
                <span className="text-[10px]">
                  X<sup>2</sup>
                </span>
              </EditorBtn>
            </div>
          )}
        </div>

        <div
          className="p-3 cursor-text bg-[#1e293b]"
          onClick={() => editor.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      <LinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onSubmit={handleLinkSubmit}
        initialUrl={editor.getAttributes("link").href || ""}
        initialText={selectedText}
      />
    </>
  );
};

// ============================================================================
// HEADING EDITOR
// ============================================================================

const HeadingEditor = ({
  text,
  onChange,
  level,
}: {
  text: string;
  onChange: (t: string) => void;
  level: number;
}) => {
  const [showColor, setShowColor] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      TextStyle,
      Color,
      Underline,
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["paragraph", "heading"] }), // 👈 اضافه شد
      Placeholder.configure({ placeholder: "Enter heading..." }),
    ],
    editorProps: {
      attributes: {
        class: `focus:outline-none text-white font-bold ${level === 2 ? "text-xl" : level === 3 ? "text-lg" : "text-base"}`,
      },
    },
    content: text,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && text !== editor.getHTML()) editor.commands.setContent(text);
  }, [text, editor]);

  if (!editor) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          onClick={() => setShowColor(!showColor)}
          className={`p-1.5 rounded-md ${showColor ? "bg-[#fe9a00] text-white" : "text-slate-400 hover:bg-slate-700"}`}
        >
          <div className="flex flex-col items-center">
            <span className="font-bold text-[10px]">A</span>
            <div
              className="w-3 h-0.5 rounded-full"
              style={{
                backgroundColor:
                  editor.getAttributes("textStyle").color || "#fff",
              }}
            />
          </div>
        </button>
        <ColorPicker
          isOpen={showColor}
          onClose={() => setShowColor(false)}
          onSelect={(c) =>
            c
              ? editor.chain().focus().selectAll().setColor(c).run()
              : editor.chain().focus().selectAll().unsetColor().run()
          }
          title="Heading Color"
          colors={TEXT_COLORS}
        />
      </div>

      {/* 👇 دکمه‌های Alignment اضافه شد */}
      <div className="flex gap-0.5 border-r border-slate-700 pr-1 mr-1">
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-1.5 rounded-md text-xs transition-all ${
            editor.isActive({ textAlign: "left" })
              ? "bg-[#fe9a00] text-white"
              : "text-slate-400 hover:bg-slate-700"
          }`}
          title="Left"
        >
          <FiAlignLeft size={10} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-1.5 rounded-md text-xs transition-all ${
            editor.isActive({ textAlign: "center" })
              ? "bg-[#fe9a00] text-white"
              : "text-slate-400 hover:bg-slate-700"
          }`}
          title="Center"
        >
          <FiAlignCenter size={10} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-1.5 rounded-md text-xs transition-all ${
            editor.isActive({ textAlign: "right" })
              ? "bg-[#fe9a00] text-white"
              : "text-slate-400 hover:bg-slate-700"
          }`}
          title="Right"
        >
          <FiAlignRight size={10} />
        </button>
      </div>

      <div className="flex-1 bg-[#1e293b] rounded-lg px-3 py-2 border border-slate-700 focus-within:border-[#fe9a00]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Card = ({
  title,
  number,
  icon,
  children,
  className = "",
  actions,
}: any) => (
  <div
    className={`bg-[#0f172b] border border-slate-800 rounded-xl overflow-hidden hover:border-[#fe9a00]/30 transition-all ${className}`}
  >
    <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-800/50 bg-[#0a0f1a]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#fe9a00]/10 text-[#fe9a00] flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-white">
          {number && <span className="text-[#fe9a00] mr-2">{number}.</span>}
          {title}
        </h3>
      </div>
      {actions}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Label = ({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) => (
  <div className="flex items-center justify-between mb-2">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
      {children}
    </label>
    {hint && <span className="text-[10px] text-slate-500">{hint}</span>}
  </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#fe9a00] ${props.className || ""}`}
  />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#fe9a00] resize-y ${props.className || ""}`}
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
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };
  const variants = {
    primary:
      "bg-[#fe9a00] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    ghost:
      "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-[#fe9a00]",
  };
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-50 ${sizes[size as keyof typeof sizes]} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {isLoading ? <FiRefreshCw className="animate-spin" size={14} /> : icon}
      {children}
    </button>
  );
};

const Tag = ({ text, onDelete }: { text: string; onDelete: () => void }) => (
  <span className="inline-flex items-center gap-1.5 bg-[#fe9a00]/10 text-[#fe9a00] text-xs font-medium px-2.5 py-1 rounded-full border border-[#fe9a00]/20">
    <FiHash size={10} />
    {text}
    <button onClick={onDelete} className="ml-0.5 hover:text-red-400">
      <FiX size={10} />
    </button>
  </span>
);

// ============================================================================
// CONTENT ISSUES ANALYZER
// ============================================================================

const ContentIssuesPanel = ({ data }: { data: BlogPostData }) => {
  const issues = useMemo((): ContentIssue[] => {
    const result: ContentIssue[] = [];

    // Title
    if (!data.seoTitle)
      result.push({
        type: "error",
        section: "Title",
        message: "Blog title is missing",
        suggestion: "Add a compelling title between 30-60 characters",
      });
    else if (data.seoTitle.length < 30)
      result.push({
        type: "warning",
        section: "Title",
        message: `Title is too short (${data.seoTitle.length} chars)`,
        suggestion: "Aim for 30-60 characters",
      });
    else if (data.seoTitle.length > 60)
      result.push({
        type: "warning",
        section: "Title",
        message: `Title is too long (${data.seoTitle.length} chars)`,
        suggestion: "Keep it under 60 characters",
      });
    else
      result.push({
        type: "success",
        section: "Title",
        message: "Title length is optimal",
      });

    // Description
    if (!data.seoDescription)
      result.push({
        type: "error",
        section: "Meta Description",
        message: "Meta description is missing",
        suggestion: "Add description 120-160 characters",
      });
    else if (data.seoDescription.length < 120)
      result.push({
        type: "warning",
        section: "Meta Description",
        message: `Too short (${data.seoDescription.length} chars)`,
        suggestion: "Aim for 120-160 characters",
      });
    else if (data.seoDescription.length > 160)
      result.push({
        type: "warning",
        section: "Meta Description",
        message: `Too long (${data.seoDescription.length} chars)`,
      });
    else
      result.push({
        type: "success",
        section: "Meta Description",
        message: "Description length is optimal",
      });

    // Focus Keyword
    if (!data.focusKeyword)
      result.push({
        type: "error",
        section: "Focus Keyword",
        message: "Focus keyword is missing",
        suggestion: "Add your main keyword",
      });
    else {
      if (
        !data.seoTitle.toLowerCase().includes(data.focusKeyword.toLowerCase())
      )
        result.push({
          type: "warning",
          section: "Focus Keyword",
          message: "Keyword not in title",
          suggestion: "Include keyword in title",
        });
      else
        result.push({
          type: "success",
          section: "Focus Keyword",
          message: "Keyword found in title",
        });
    }

    // Content Length
    const allContent = data.headings.map((h) => stripHtml(h.content)).join(" ");
    const wordCount = countWords(allContent);
    if (wordCount < 300)
      result.push({
        type: "error",
        section: "Content",
        message: `Only ${wordCount} words`,
        suggestion: "Aim for at least 300 words",
      });
    else if (wordCount < 600)
      result.push({
        type: "warning",
        section: "Content",
        message: `${wordCount} words - could be more`,
        suggestion: "Consider adding more content",
      });
    else
      result.push({
        type: "success",
        section: "Content",
        message: `Good content length (${wordCount} words)`,
      });

    // Sections
    const filledSections = data.headings.filter((h) => h.text && h.content);
    if (filledSections.length < 2)
      result.push({
        type: "warning",
        section: "Structure",
        message: "Need more sections",
        suggestion: "Add at least 2-3 sections",
      });
    else
      result.push({
        type: "success",
        section: "Structure",
        message: `${filledSections.length} sections`,
      });

    // Images
    if (data.mediaLibrary.length === 0)
      result.push({
        type: "warning",
        section: "Media",
        message: "No images added",
        suggestion: "Add images to engage readers",
      });
    else
      result.push({
        type: "success",
        section: "Media",
        message: `${data.mediaLibrary.length} media files`,
      });

    // Links
    if (data.anchors.length === 0)
      result.push({
        type: "info",
        section: "Links",
        message: "No auto-links configured",
        suggestion: "Add internal/external links",
      });

    // Tags
    if (data.tags.length < 3)
      result.push({
        type: "warning",
        section: "Tags",
        message: `Only ${data.tags.length} tags`,
        suggestion: "Add at least 3 tags",
      });
    else
      result.push({
        type: "success",
        section: "Tags",
        message: `${data.tags.length} tags added`,
      });

    // Summary
    if (!data.summary || stripHtml(data.summary).length < 50)
      result.push({
        type: "warning",
        section: "Summary",
        message: "Summary is missing or too short",
      });

    // Conclusion
    if (!data.conclusion || stripHtml(data.conclusion).length < 50)
      result.push({
        type: "warning",
        section: "Conclusion",
        message: "Conclusion is missing or too short",
      });

    return result;
  }, [data]);

  const score = useMemo(() => {
    const successCount = issues.filter((i) => i.type === "success").length;
    return Math.round((successCount / issues.length) * 100);
  }, [issues]);

  const getIcon = (type: ContentIssue["type"]) => {
    switch (type) {
      case "error":
        return <FiAlertCircle className="text-red-400" size={14} />;
      case "warning":
        return <FiAlertTriangle className="text-yellow-400" size={14} />;
      case "info":
        return <FiInfo className="text-blue-400" size={14} />;
      case "success":
        return <FiCheckCircle className="text-green-400" size={14} />;
    }
  };

  return (
    <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white flex items-center gap-2">
            <FiAward className="text-[#fe9a00]" /> Content Score
          </span>
          <span
            className={`text-2xl font-bold ${score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-400"}`}
          >
            {score}%
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="p-3 max-h-75 overflow-y-auto space-y-2">
        {issues
          .filter((i) => i.type !== "success")
          .slice(0, 6)
          .map((issue, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/50"
            >
              {getIcon(issue.type)}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-300">
                  {issue.section}
                </p>
                <p className="text-[10px] text-slate-400">{issue.message}</p>
                {issue.suggestion && (
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    💡 {issue.suggestion}
                  </p>
                )}
              </div>
            </div>
          ))}

        {issues.filter((i) => i.type === "success").length > 0 && (
          <div className="pt-2 border-t border-slate-700">
            <p className="text-[10px] text-slate-500 uppercase mb-2">
              Passed Checks
            </p>
            {issues
              .filter((i) => i.type === "success")
              .slice(0, 3)
              .map((issue, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-green-400 py-0.5"
                >
                  <FiCheckCircle size={10} /> {issue.section}: {issue.message}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// CONTENT SECTION
// ============================================================================

const ContentSection = ({
  heading,
  index,
  onUpdate,
  onDelete,
  onMove,
  isFirst,
  isLast,
  onOpenMediaPicker,
}: {
  heading: HeadingItem;
  index: number;
  onUpdate: (updates: Partial<HeadingItem>) => void;
  onDelete: () => void;
  onMove: (dir: "up" | "down") => void;
  isFirst: boolean;
  isLast: boolean;
  onOpenMediaPicker: (
    type: "image" | "video" | "all",
    callback: (media: MediaItem) => void,
  ) => void;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Log when heading content changes
  useEffect(() => {
    console.log(`📝 ContentSection ${index} received heading:`, {
      id: heading.id,
      text: heading.text,
      contentLength: heading.content?.length || 0
    });
  }, [heading.id, heading.content, index, heading.text]);

  const handleInsertMedia = (type: "image" | "video" | "all") => {
    onOpenMediaPicker(type, (media) => {
      const html =
        media.type === "image"
          ? `<img src="${media.url}" alt="${media.alt}" class="rounded-xl max-w-full h-auto my-4" />`
          : `<video controls class="w-full rounded-xl my-4"><source src="${media.url}" type="video/mp4"></video>`;
      onUpdate({ content: heading.content + html });
    });
  };

  return (
    <div className="bg-[#1e293b]/50 rounded-xl border border-slate-700 hover:border-[#fe9a00]/30 transition-all overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-[#0f172b]/50 border-b border-slate-700">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onMove("up")}
            disabled={isFirst}
            className="text-slate-500 hover:text-white disabled:opacity-30 p-0.5"
          >
            <FiChevronUp size={12} />
          </button>
          <button
            onClick={() => onMove("down")}
            disabled={isLast}
            className="text-slate-500 hover:text-white disabled:opacity-30 p-0.5"
          >
            <FiChevronDown size={12} />
          </button>
        </div>

        <div className="w-7 h-7 rounded-lg bg-[#fe9a00]/10 text-[#fe9a00] flex items-center justify-center text-xs font-bold">
          {index + 1}
        </div>

        <select
          className="bg-[#0f172b] border border-slate-700 rounded-lg text-xs text-[#fe9a00] font-bold px-2 py-1.5"
          value={heading.level}
          onChange={(e) => onUpdate({ level: parseInt(e.target.value) })}
        >
          {[2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              H{n}
            </option>
          ))}
        </select>

        <div className="flex-1">
          <HeadingEditor
            text={heading.text}
            onChange={(text) => onUpdate({ text })}
            level={heading.level}
          />
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
        >
          {isCollapsed ? (
            <FiChevronDown size={14} />
          ) : (
            <FiChevronUp size={14} />
          )}
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10"
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-4">
          <Label hint="Rich text with media support">Section Content</Label>
          <RichTextEditor
            key={`editor-${heading.id}-${heading.content?.length || 0}`}
            content={heading.content}
            onChange={(content) => onUpdate({ content })}
            placeholder="Write your content... Use the toolbar for formatting, lists, and media."
            minHeight="200px"
            onOpenMediaPicker={(type) => handleInsertMedia(type)}
          />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// FAQ SECTION
// ============================================================================

const FAQSection = ({
  faqs,
  onUpdate,
}: {
  faqs: FAQItem[];
  onUpdate: (faqs: FAQItem[]) => void;
}) => {
  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={faq.id}
          className="bg-[#1e293b] rounded-lg border border-slate-700 p-3"
        >
          <div className="flex items-start gap-2 mb-2">
            <FiMessageSquare className="text-[#fe9a00] mt-2.5" size={14} />
            <Input
              value={faq.question}
              onChange={(e) => {
                const newFaqs = [...faqs];
                newFaqs[index].question = e.target.value;
                onUpdate(newFaqs);
              }}
              placeholder="Question..."
              className="flex-1"
            />
            <button
              onClick={() => onUpdate(faqs.filter((_, i) => i !== index))}
              className="text-slate-500 hover:text-red-400 p-1"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
          <TextArea
            value={faq.answer}
            onChange={(e) => {
              const newFaqs = [...faqs];
              newFaqs[index].answer = e.target.value;
              onUpdate(newFaqs);
            }}
            placeholder="Answer..."
            rows={2}
            className=" min-h-15"
          />
        </div>
      ))}
      <button
        onClick={() =>
          onUpdate([...faqs, { id: generateId(), question: "", answer: "" }])
        }
        className="w-full py-2 border-2 border-dashed border-slate-700 rounded-lg text-xs text-slate-400 hover:text-[#fe9a00] hover:border-[#fe9a00] flex items-center justify-center gap-2"
      >
        <FiPlus size={14} /> Add FAQ
      </button>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AIBlogBuilder() {
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaPickerType, setMediaPickerType] = useState<
    "image" | "video" | "all"
  >("all");
  const [mediaPickerCallback, setMediaPickerCallback] = useState<
    ((media: MediaItem) => void) | null
  >(null);
  const [activeTab, setActiveTab] = useState<"content" | "seo" | "media">(
    "content",
  );
  const [generationMode, setGenerationMode] = useState<"full" | "step">("step");

  const [data, setData] = useState<BlogPostData>({
    topic: "",
    seoTitle: "",
    seoDescription: "",
    focusKeyword: "",
    canonicalUrl: "",
    tags: [],
    author: "",
    publishDate: new Date().toISOString().split("T")[0],
    headings: [{ id: generateId(), level: 2, text: "", content: "" }],
    mediaLibrary: [],
    anchors: [],
    summary: "",
    conclusion: "",
    faqs: [],
    tableOfContents: true,
    compiledHtml: "",
  });

  // HTML Compiler
  const compileContent = useCallback(() => {
    let html = "";

    if (data.seoTitle)
      html += `<h1 class="text-4xl font-bold mb-6">${data.seoTitle}</h1>\n`;

    if (data.author || data.publishDate) {
      html += `<div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b">\n`;
      if (data.author) html += `  <span>👤 ${data.author}</span>\n`;
      if (data.publishDate)
        html += `  <span>📅 ${new Date(data.publishDate).toLocaleDateString()}</span>\n`;
      html += `  <span>⏱️ ${calculateReadingTime(data.headings.map((h) => stripHtml(h.content)).join(" "))} min read</span>\n`;
      html += `</div>\n\n`;
    }

    const featuredImage = data.mediaLibrary.find((m) => m.type === "image");
    if (featuredImage) {
      html += `<figure class="mb-8">\n  <img src="${featuredImage.url}" alt="${featuredImage.alt}" class="w-full rounded-xl shadow-lg" />\n</figure>\n\n`;
    }

    if (data.summary) {
      html += `<div class="bg-orange-50 p-6 rounded-xl mb-8 border-l-4 border-orange-500">\n  <p class="text-gray-700 italic"><strong>📝 Summary:</strong> ${data.summary}</p>\n</div>\n\n`;
    }

    if (
      data.tableOfContents &&
      data.headings.filter((h) => h.text).length > 0
    ) {
      html += `<nav class="bg-gray-50 p-6 rounded-xl mb-8">\n  <h3 class="font-bold mb-3">📑 Table of Contents</h3>\n  <ul class="space-y-2">\n`;
      data.headings.forEach((h, i) => {
        if (h.text)
          html += `    <li${h.level > 2 ? ' class="ml-4"' : ""}><a href="#section-${i + 1}" class="text-orange-600 hover:underline">${stripHtml(h.text)}</a></li>\n`;
      });
      html += `  </ul>\n</nav>\n\n`;
    }

    data.headings.forEach((heading, index) => {
      if (!heading.text && !heading.content) return;
      const tag = `h${heading.level}`;
      const sizes: Record<number, string> = {
        2: "text-2xl",
        3: "text-xl",
        4: "text-lg",
        5: "text-base",
        6: "text-sm",
      };
      if (heading.text)
        html += `<${tag} id="section-${index + 1}" class="font-bold mt-10 mb-4 ${sizes[heading.level] || "text-lg"}">${heading.text}</${tag}>\n`;

      let sectionContent = heading.content || "";
      data.anchors.forEach((anchor) => {
        if (anchor.keyword && anchor.url) {
          const regex = new RegExp(`\\b${anchor.keyword}\\b`, "gi");
          sectionContent = sectionContent.replace(
            regex,
            `<a href="${anchor.url}" class="text-orange-600 hover:underline" target="_blank">${anchor.keyword}</a>`,
          );
        }
      });
      if (sectionContent)
        html += `<div class="mb-6 leading-relaxed">${sectionContent}</div>\n`;
    });

    if (data.conclusion) {
      html += `\n<div class="bg-gray-900 text-white p-6 rounded-xl mt-10">\n  <h3 class="font-bold text-xl mb-3">🎯 Conclusion</h3>\n  <div>${data.conclusion}</div>\n</div>\n`;
    }

    if (data.faqs.filter((f) => f.question && f.answer).length > 0) {
      html += `\n<div class="mt-10">\n  <h3 class="font-bold text-2xl mb-6">❓ FAQ</h3>\n  <div class="space-y-4">\n`;
      data.faqs.forEach((faq) => {
        if (faq.question && faq.answer) {
          html += `    <details class="bg-gray-50 rounded-lg p-4">\n      <summary class="font-semibold cursor-pointer">${faq.question}</summary>\n      <p class="mt-3 text-gray-600">${faq.answer}</p>\n    </details>\n`;
        }
      });
      html += `  </div>\n</div>\n`;
    }

    if (data.tags.length > 0) {
      html += `\n<div class="mt-10 pt-6 border-t flex flex-wrap gap-2">\n`;
      data.tags.forEach(
        (tag) =>
          (html += `  <span class="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">#${tag}</span>\n`),
      );
      html += `</div>\n`;
    }

    setData((prev) => ({ ...prev, compiledHtml: html }));
  }, [
    data.seoTitle,
    data.author,
    data.publishDate,
    data.mediaLibrary,
    data.summary,
    data.tableOfContents,
    data.headings,
    data.anchors,
    data.conclusion,
    data.faqs,
    data.tags,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => compileContent(), 500);
    return () => clearTimeout(timer);
  }, [compileContent]);

  // Handlers
  const handleAIGenerate = async () => {
    if (!data.topic) return toast.error("Please enter a topic first");
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 2500));
      const mockAI: Partial<BlogPostData> = {
        seoTitle: `${data.topic}: Complete Guide for 2024`,
        seoDescription: `Learn everything about ${data.topic}. Expert tips and best practices.`,
        focusKeyword: data.topic.toLowerCase().split(" ")[0],
        tags: [data.topic, "Guide", "Tutorial", "2024"],
        author: "AI Writer",
        summary: `This guide covers everything about ${data.topic}.`,
        headings: [
          {
            id: generateId(),
            level: 2,
            text: `What is ${data.topic}?`,
            content: `<p><strong>${data.topic}</strong> is essential in today's world.</p>`,
          },
          {
            id: generateId(),
            level: 2,
            text: "Key Benefits",
            content: `<p>Benefits include:</p><ul><li>Improved efficiency</li><li>Better results</li></ul>`,
          },
          {
            id: generateId(),
            level: 3,
            text: "Best Practices",
            content: `<p>Focus on <mark>quality</mark> over quantity.</p><hr/><p>Take your time to master each concept.</p>`,
          },
        ],
        conclusion: `${data.topic} is transformative when implemented correctly.`,
        faqs: [
          {
            id: generateId(),
            question: `How to learn ${data.topic}?`,
            answer: "Start with fundamentals and practice regularly.",
          },
        ],
        mediaLibrary: [
          {
            id: generateId(),
            type: "image",
            url: `https://placehold.co/1200x600/fe9a00/fff?text=${encodeURIComponent(data.topic)}`,
            alt: data.topic,
          },
        ],
        anchors: [
          {
            id: generateId(),
            keyword: "efficiency",
            url: "https://example.com/efficiency",
          },
        ],
      };
      setData((prev) => ({ ...prev, ...mockAI }));
      toast.success("🎉 Content generated!");
    } catch (e) {
      toast.error("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = (file: File) => {
    const isVideo = file.type.startsWith("video/");
    const url = URL.createObjectURL(file);
    const newMedia: MediaItem = {
      id: generateId(),
      type: isVideo ? "video" : "image",
      url,
      alt: file.name,
      filename: file.name,
      size: file.size,
    };
    setData((prev) => ({
      ...prev,
      mediaLibrary: [...prev.mediaLibrary, newMedia],
    }));
    toast.success(`${isVideo ? "Video" : "Image"} uploaded!`);
  };

  const openMediaPicker = (
    type: "image" | "video" | "all",
    callback?: (media: MediaItem) => void,
  ) => {
    setMediaPickerType(type);
    setMediaPickerCallback(() => callback || null);
    setShowMediaPicker(true);
  };

  const addSection = () =>
    setData({
      ...data,
      headings: [
        ...data.headings,
        { id: generateId(), level: 2, text: "", content: "" },
      ],
    });

  const updateSection = (i: number, updates: Partial<HeadingItem>) => {
    const newHeadings = [...data.headings];
    newHeadings[i] = { ...newHeadings[i], ...updates };
    setData({ ...data, headings: newHeadings });
  };

  const deleteSection = (i: number) =>
    setData({ ...data, headings: data.headings.filter((_, idx) => idx !== i) });

  const moveSection = (i: number, dir: "up" | "down") => {
    const newHeadings = [...data.headings];
    const target = dir === "up" ? i - 1 : i + 1;
    if (target < 0 || target >= newHeadings.length) return;
    [newHeadings[i], newHeadings[target]] = [
      newHeadings[target],
      newHeadings[i],
    ];
    setData({ ...data, headings: newHeadings });
  };

  const addTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      setData({ ...data, tags: [...data.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleStepDataUpdate = (updates: Partial<StepGeneratorData>) => {
    console.log('📥 [handleStepDataUpdate] Received updates:', JSON.stringify({
      hasHeadings: !!updates.headings,
      headingsCount: updates.headings?.length,
      hasSummary: !!updates.summary,
      hasConclusion: !!updates.conclusion,
      hasFAQs: !!updates.faqs,
    }));
    
    // Create new objects to ensure React detects changes
    const updatedData = { ...data };
    
    if (updates.headings) {
      console.log('🔄 [handleStepDataUpdate] Processing headings update');
      console.log('   Current data.headings count:', data.headings.length);
      console.log('   Current data.headings:', data.headings.map(h => ({ 
        id: h.id, 
        text: h.text?.substring(0, 30), 
        contentLength: h.content?.length || 0 
      })));
      console.log('   Incoming headings:', updates.headings.map(h => ({ 
        id: h.id, 
        text: h.text?.substring(0, 30), 
        contentLength: h.content?.length || 0 
      })));

      // Check if this is initial headings generation (all headings have no content yet)
      // or if it's a content update (some headings have content)
      const isInitialHeadingsGeneration = updates.headings.every(h => !h.content || h.content === '');
      const hasContentUpdate = updates.headings.some(h => h.content && h.content !== '');

      if (isInitialHeadingsGeneration) {
        // REPLACE all headings with new structure
        console.log('📝 [handleStepDataUpdate] Initial headings generation - REPLACING all headings');
        updatedData.headings = updates.headings.map(h => ({ ...h }));
      } else if (hasContentUpdate) {
        // MERGE content into existing headings by ID
        console.log('📝 [handleStepDataUpdate] Content update - MERGING by ID');
        if (!updates.headings.length ) {
          console.log('   ⚠️ No existing headings found, adding all incoming headings');
          updatedData.headings = updates.headings.map(h => ({ ...h }));
        }
        const updatedHeadings = data.headings.map(existingHeading => {
          const incomingHeading = updates.headings.find(h => h.id === existingHeading.id);
          
          if (incomingHeading) {
            console.log(`   ✅ Matched heading ID: ${existingHeading.id}`);
            // Create a completely new object to break React reference
            return {
              id: incomingHeading.id,
              level: incomingHeading.level,
              text: incomingHeading.text,
              content: incomingHeading.content || existingHeading.content
            };
          }
          
          return existingHeading;
        });
        
        // Add any new headings that weren't in the existing array
        updates.headings.forEach(newHeading => {
          if (!updatedHeadings.find(h => h.id === newHeading.id)) {
            console.log(`   ➕ Adding new heading ID: ${newHeading.id}`);
            updatedHeadings.push({ ...newHeading });
          }
        });
        
        updatedData.headings = updatedHeadings;
      } else {
        // Default: just update the headings
        updatedData.headings = updates.headings.map(h => ({ ...h }));
      }
      
      console.log('📦 [handleStepDataUpdate] Final headings after update:', updatedData.headings.map(h => ({ 
        id: h.id, 
        text: h.text?.substring(0, 30), 
        contentLength: h.content?.length || 0 
      })));
    }
    
    if (updates.summary !== undefined) {
      console.log('📝 [handleStepDataUpdate] Updating summary:', {
        hasUpdate: !!updates.summary,
        updateLength: updates.summary?.length || 0,
        currentLength: data.summary?.length || 0,
        preview: updates.summary?.substring(0, 100)
      });
      updatedData.summary = updates.summary;
    }
    
    if (updates.conclusion !== undefined) {
      console.log('📝 [handleStepDataUpdate] Updating conclusion:', {
        hasUpdate: !!updates.conclusion,
        updateLength: updates.conclusion?.length || 0,
        currentLength: data.conclusion?.length || 0,
        preview: updates.conclusion?.substring(0, 100)
      });
      updatedData.conclusion = updates.conclusion;
    }
    
    if (updates.faqs) updatedData.faqs = [...updates.faqs];
    if (updates.seoTitle) updatedData.seoTitle = updates.seoTitle;
    if (updates.focusKeyword) updatedData.focusKeyword = updates.focusKeyword;
    if (updates.seoDescription) updatedData.seoDescription = updates.seoDescription;
    if (updates.tags) updatedData.tags = [...updates.tags];
    if (updates.author) updatedData.author = updates.author;
    if (updates.anchors) updatedData.anchors = [...updates.anchors];
    
    console.log('💾 Setting new data state');
    setData(updatedData);
    
    // Show toast for newly added content
    if (updates.headings) {
      const newHeadingsWithContent = updates.headings.filter(h => h.content).length;
      const oldHeadingsWithContent = data.headings.filter(h => h.content).length;
      if (newHeadingsWithContent > oldHeadingsWithContent) {
        toast.success('✅ Content updated in editor!');
      }
    }
    
    if (updates.summary && updates.summary !== data.summary) {
      toast.success('Summary added!');
    }
    
    if (updates.conclusion && updates.conclusion !== data.conclusion) {
      toast.success('Conclusion added!');
    }
    
    if (updates.faqs && updates.faqs !== data.faqs) {
      toast.success('FAQs added!');
    }
  };

  const handleStepGenerationComplete = () => {
    toast.success("🎉 All sections generated! You can now edit and save.");
    setGenerationMode("full"); // Switch to normal editing mode
  };

  return (
    <div className="min-h-screen bg-[#0f172b] text-slate-200 pb-20 w-full">
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

      {/* Header */}
      <header className="fixed top-16 z-40 w-full max-w-7xl bg-[#0f172b]/10 backdrop-blur-3xl rounded-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-white">
                Blog<span className="text-[#fe9a00]">Architect</span>
                <span className="text-[10px] ml-1.5 px-1.5 py-0.5 bg-[#fe9a00]/20 text-[#fe9a00] rounded-full">
                  PRO
                </span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<FiEye size={14} />}
              onClick={() => setShowPreview(true)}
            >
              Preview
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<FiDownload size={14} />}
              onClick={() => {
                navigator.clipboard.writeText(data.compiledHtml);
                toast.success("Copied!");
              }}
            >
              Export
            </Button>
            <Button
              size="sm"
              icon={<FiSave size={14} />}
              onClick={() => toast.success("Saved!")}
            >
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20 px-4 max-w-7xl mx-auto grid grid-cols-12 gap-5">
        {/* LEFT SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="lg:sticky lg:top-20 space-y-4">
            {/* Topic Input - Shared by both modes */}
            <Card title="Blog Topic" icon={<FiCpu size={16} />}>
              <div className="space-y-2">
                <Label hint="What's your blog about?">Topic</Label>
                <TextArea
                  value={data.topic}
                  onChange={(e) => setData({ ...data, topic: e.target.value })}
                  placeholder="e.g., Complete Guide to React Hooks in 2026..."
                  rows={3}
                  className="min-h-20"
                />
              </div>
            </Card>

            {/* Mode Toggle */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-3">
              <Label hint="Choose your generation method">AI Mode</Label>
              <div className="flex gap-1 bg-slate-900/50 rounded-lg p-1 mt-2">
                <button
                  onClick={() => setGenerationMode("step")}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                    generationMode === "step"
                      ? "bg-[#fe9a00] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Step-by-Step
                </button>
                <button
                  onClick={() => setGenerationMode("full")}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all ${
                    generationMode === "full"
                      ? "bg-[#fe9a00] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Full Auto
                </button>
              </div>
            </div>

            {generationMode === "step" ? (
              <StepByStepBlogGenerator
                topic={data.topic}
                onDataUpdate={handleStepDataUpdate}
                onComplete={handleStepGenerationComplete}
              />
            ) : (
              <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FiZap size={16} className="text-[#fe9a00]" />
                  <h3 className="text-sm font-bold text-white">Full Generation</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Generate entire blog at once with one click
                </p>
                <Button
                  onClick={handleAIGenerate}
                  isLoading={loading}
                  className="w-full"
                  icon={<FiZap size={14} />}
                >
                  Generate Full Blog
                </Button>
              </div>
            )}

            <ContentIssuesPanel data={data} />

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-[#fe9a00]">
                  {countWords(
                    data.headings.map((h) => stripHtml(h.content)).join(" "),
                  )}
                </div>
                <div className="text-[10px] text-slate-400">Words</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-[#fe9a00]">
                  {data.mediaLibrary.length}
                </div>
                <div className="text-[10px] text-slate-400">Media</div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg">
            {(["content", "seo", "media"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-1.5 ${
                  activeTab === tab
                    ? "bg-[#fe9a00] text-white shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab === "content" && <FiEdit3 size={14} />}
                {tab === "seo" && <FiTarget size={14} />}
                {tab === "media" && <FiImage size={14} />}
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </div>

          {activeTab === "content" && (
            <div className="space-y-4">
              <Card title="Blog Title" number="1" icon={<FiType size={16} />}>
                <Input
                  value={data.seoTitle || ""}
                  onChange={(e) =>
                    setData({ ...data, seoTitle: e.target.value })
                  }
                  placeholder="Enter an engaging title..."
                  className="text-lg font-semibold"
                />
                <div className="text-[10px] text-slate-500 mt-1">
                  {(data.seoTitle || "").length}/60 characters
                </div>
              </Card>

              <Card title="Summary" number="2" icon={<FiBookOpen size={16} />}>
                <RichTextEditor
                  content={data.summary || ""}
                  onChange={(html) => setData({ ...data, summary: html })}
                  placeholder="Write a compelling summary..."
                  minHeight="80px"
                  showFullToolbar={false}
                />
              </Card>

              <Card
                title="Content Sections"
                number="3"
                icon={<FiLayers size={16} />}
                actions={
                  <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.tableOfContents}
                      onChange={(e) =>
                        setData({ ...data, tableOfContents: e.target.checked })
                      }
                      className="rounded border-slate-600 bg-slate-700 text-[#fe9a00]"
                    />
                    TOC
                  </label>
                }
              >
                <div className="space-y-3">
                  {data.headings.map((heading, index) => (
                    <ContentSection
                      key={`${heading.id}-${heading.content?.length || 0}`}
                      heading={heading}
                      index={index}
                      onUpdate={(updates) => updateSection(index, updates)}
                      onDelete={() => deleteSection(index)}
                      onMove={(dir) => moveSection(index, dir)}
                      isFirst={index === 0}
                      isLast={index === data.headings.length - 1}
                      onOpenMediaPicker={(type, callback) =>
                        openMediaPicker(type, callback)
                      }
                    />
                  ))}
                  <button
                    onClick={addSection}
                    className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-sm text-slate-400 hover:text-[#fe9a00] hover:border-[#fe9a00] flex items-center justify-center gap-2"
                  >
                    <FiPlus size={16} /> Add Section
                  </button>
                </div>
              </Card>

              <Card title="Conclusion" number="4" icon={<FiTarget size={16} />}>
                <RichTextEditor
                  content={data.conclusion || ""}
                  onChange={(html) => setData({ ...data, conclusion: html })}
                  placeholder="Write a strong conclusion..."
                  minHeight="100px"
                />
              </Card>

              <Card
                title="FAQs"
                number="5"
                icon={<FiMessageSquare size={16} />}
              >
                <FAQSection
                  faqs={data.faqs}
                  onUpdate={(faqs) => setData({ ...data, faqs })}
                />
              </Card>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-4">
              <Card title="SEO Settings" icon={<FiGlobe size={16} />}>
                <div className="space-y-4">
                  <div>
                    <Label hint="120-160 chars">Meta Description</Label>
                    <TextArea
                      value={data.seoDescription || ""}
                      onChange={(e) =>
                        setData({ ...data, seoDescription: e.target.value })
                      }
                      placeholder="Meta description..."
                      rows={3}
                    />
                    <div className="text-[10px] text-slate-500 mt-1">
                      {(data.seoDescription || "").length}/160
                    </div>
                  </div>
                  <div>
                    <Label>Focus Keyword</Label>
                    <Input
                      value={data.focusKeyword || ""}
                      onChange={(e) =>
                        setData({ ...data, focusKeyword: e.target.value })
                      }
                      placeholder="Main keyword..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Author</Label>
                      <Input
                        value={data.author || ""}
                        onChange={(e) =>
                          setData({ ...data, author: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={data.publishDate || ""}
                        onChange={(e) =>
                          setData({ ...data, publishDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tag..."
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={addTag}
                        icon={<FiPlus size={12} />}
                      />
                    </div>
                    {data.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {data.tags.map((tag, i) => (
                          <Tag
                            key={i}
                            text={tag}
                            onDelete={() =>
                              setData({
                                ...data,
                                tags: data.tags.filter((_, idx) => idx !== i),
                              })
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card title="Auto-Links" icon={<FiLink2 size={16} />}>
                <div className="space-y-2">
                  {data.anchors.map((anchor, i) => (
                    <div
                      key={anchor.id}
                      className="flex gap-2 items-center bg-slate-800/50 p-2 rounded-lg"
                    >
                      <Input
                        value={anchor.keyword}
                        onChange={(e) => {
                          const n = [...data.anchors];
                          n[i].keyword = e.target.value;
                          setData({ ...data, anchors: n });
                        }}
                        placeholder="Keyword"
                        className="flex-1"
                      />
                      <Input
                        value={anchor.url}
                        onChange={(e) => {
                          const n = [...data.anchors];
                          n[i].url = e.target.value;
                          setData({ ...data, anchors: n });
                        }}
                        placeholder="URL"
                        className="flex-1"
                      />
                      <button
                        onClick={() =>
                          setData({
                            ...data,
                            anchors: data.anchors.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setData({
                        ...data,
                        anchors: [
                          ...data.anchors,
                          { id: generateId(), keyword: "", url: "" },
                        ],
                      })
                    }
                    className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-xs text-slate-400 hover:text-[#fe9a00] hover:border-[#fe9a00]"
                  >
                    + Add Auto-Link
                  </button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "media" && (
            <Card
              title="Media Library"
              icon={<FiFolder size={16} />}
              actions={
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<FiUpload size={12} />}
                  onClick={() => openMediaPicker("all")}
                >
                  Upload
                </Button>
              }
            >
              {data.mediaLibrary.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {data.mediaLibrary.map((media) => (
                    <div
                      key={media.id}
                      className="group relative aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700"
                    >
                      {media.type === "image" ? (
                        <img
                          src={media.url}
                          alt={media.alt}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900">
                          <FiVideo size={32} className="text-slate-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <button
                          onClick={() =>
                            setData({
                              ...data,
                              mediaLibrary: data.mediaLibrary.filter(
                                (m) => m.id !== media.id,
                              ),
                            })
                          }
                          className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/80 to-transparent">
                        <p className="text-xs text-white truncate">
                          {media.alt}
                        </p>
                        {media.size && (
                          <p className="text-[10px] text-slate-400">
                            {formatFileSize(media.size)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center">
                  <FiImage size={48} className="mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400 mb-4">No media files yet</p>
                  <Button
                    onClick={() => openMediaPicker("all")}
                    icon={<FiUpload size={14} />}
                  >
                    Upload Media
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </main>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        html={data.compiledHtml}
        data={data}
      />
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        mediaLibrary={data.mediaLibrary}
        onSelect={(m) => {
          if (mediaPickerCallback) mediaPickerCallback(m);
          setShowMediaPicker(false);
        }}
        onUpload={handleMediaUpload}
        mediaType={mediaPickerType}
      />
    </div>
  );
}
