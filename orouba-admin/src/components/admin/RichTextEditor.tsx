"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import "react-quill-new/dist/quill.snow.css";

const colorPalette = [
  "#035297",
  "#002f59",
  "#fff100",
  "#7cb021",
  "#ffffff",
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#f5f5f5",
  "#d32f2f",
  "#f57c00",
  "#388e3c",
  "#1976d2",
  "#7b1fa2",
];

const lineHeightOptions = ["1", "1.2", "1.5", "1.8", "2", "2.5", "3"];
const letterSpacingOptions = ["-1px", "0px", "0.5px", "1px", "2px", "3px"];

const applyBlockFormat = (quill: any, format: string, value: string | false) => {
  const range = quill.getSelection(true);
  if (!range) return;

  quill.formatLine(range.index, Math.max(range.length, 1), format, value || false);
};

const ReactQuill = dynamic(
  async () => {
    const { default: RQ, Quill } = await import("react-quill-new");

    const Parchment = Quill.import("parchment");
    const StyleAttributor = Parchment.StyleAttributor || (Parchment.Attributor && Parchment.Attributor.Style);
    const Scope = Parchment.Scope;

    if (StyleAttributor) {
      // Line Height
      const LineHeightStyle = new StyleAttributor(
        "lineHeight",
        "line-height",
        {
          scope: Scope.BLOCK,
          whitelist: ["1", "1.2", "1.5", "1.8", "2", "2.5", "3"],
        }
      );
      Quill.register(LineHeightStyle, true);

      // Letter Spacing
      const LetterSpacingStyle = new StyleAttributor(
        "letterSpacing",
        "letter-spacing",
        {
          scope: Scope.BLOCK,
          whitelist: ["-1px", "0px", "0.5px", "1px", "2px", "3px"],
        }
      );
      Quill.register(LetterSpacingStyle, true);
    }

    return RQ;
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-40 w-full animate-pulse bg-gray-100 rounded-lg" />
    ),
  }
);

const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: colorPalette }, { background: colorPalette }],
    [{ font: [] }],
    [{ align: [] }],
    [{ lineHeight: ["1", "1.2", "1.5", "1.8", "2", "2.5", "3"] }],
    [{ letterSpacing: ["-1px", "0px", "0.5px", "1px", "2px", "3px"] }],
    ["link", "image"],
    ["clean"],
];

const modules = {
  toolbar: {
    container: toolbarOptions,
    handlers: {
      lineHeight(this: { quill: any }, value: string) {
        applyBlockFormat(this.quill, "lineHeight", value || false);
      },
      letterSpacing(this: { quill: any }, value: string) {
        applyBlockFormat(this.quill, "letterSpacing", value || false);
      },
    },
  },
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "script",
  "indent",
  "direction",
  "size",
  "color",
  "background",
  "font",
  "align",
  "lineHeight",
  "letterSpacing",
  "link",
  "image",
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  dir,
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);
  const [textColor, setTextColor] = useState("#035297");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const applyFormat = (format: string, nextValue: string | false) => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    editor.focus();
    if (format === "lineHeight" || format === "letterSpacing") {
      applyBlockFormat(editor, format, nextValue || false);
      return;
    }

    editor.format(format, nextValue || false);
  };

  const normalizeHexColor = (nextValue: string) => {
    const trimmed = nextValue.trim();
    if (/^#[0-9a-f]{6}$/i.test(trimmed)) return trimmed;
    if (/^[0-9a-f]{6}$/i.test(trimmed)) return `#${trimmed}`;
    return "";
  };

  const applyColor = (format: "color" | "background", nextValue: string) => {
    const normalizedColor = normalizeHexColor(nextValue);
    if (!normalizedColor) return;
    applyFormat(format, normalizedColor);
  };

  return (
    <div className={`rich-text-editor ${dir === "rtl" ? "ql-rtl" : "ql-ltr"}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        className="bg-white rounded-lg"
      />
      <div className="rich-text-editor-controls">
        <label>
          <span>Text color</span>
          <input
            type="color"
            value={textColor}
            onChange={(event) => {
              setTextColor(event.target.value);
              applyColor("color", event.target.value);
            }}
          />
          <input
            type="text"
            dir="ltr"
            value={textColor}
            onChange={(event) => setTextColor(event.target.value)}
            onBlur={() => applyColor("color", textColor)}
            onKeyDown={(event) => {
              if (event.key === "Enter") applyColor("color", textColor);
            }}
          />
        </label>

        <label>
          <span>Background</span>
          <input
            type="color"
            value={backgroundColor}
            onChange={(event) => {
              setBackgroundColor(event.target.value);
              applyColor("background", event.target.value);
            }}
          />
          <input
            type="text"
            dir="ltr"
            value={backgroundColor}
            onChange={(event) => setBackgroundColor(event.target.value)}
            onBlur={() => applyColor("background", backgroundColor)}
            onKeyDown={(event) => {
              if (event.key === "Enter") applyColor("background", backgroundColor);
            }}
          />
        </label>

        <label>
          <span>Line height</span>
          <select
            defaultValue=""
            onChange={(event) => applyFormat("lineHeight", event.target.value || false)}
          >
            <option value="">Default</option>
            {lineHeightOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Letter spacing</span>
          <select
            defaultValue=""
            onChange={(event) => applyFormat("letterSpacing", event.target.value || false)}
          >
            <option value="">Default</option>
            {letterSpacingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 190px;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          font-family: inherit;
        }
        .rich-text-editor .ql-editor {
          min-height: 190px;
          font-size: 15px;
          line-height: 1.8;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background-color: #f9fafb;
        }
        .rich-text-editor-controls {
          align-items: center;
          background: #f9fafb;
          border: 1px solid #ccc;
          border-top: 0;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 0.75rem;
        }
        .rich-text-editor-controls label {
          align-items: center;
          color: #374151;
          display: flex;
          gap: 0.4rem;
          font-size: 12px;
          font-weight: 700;
        }
        .rich-text-editor-controls input[type="color"] {
          border: 1px solid #d1d5db;
          border-radius: 0.35rem;
          cursor: pointer;
          height: 30px;
          padding: 2px;
          width: 38px;
        }
        .rich-text-editor-controls input[type="text"],
        .rich-text-editor-controls select {
          background: #fff;
          border: 1px solid #d1d5db;
          border-radius: 0.35rem;
          color: #111827;
          font-size: 12px;
          height: 30px;
          outline: none;
          padding: 0 0.45rem;
        }
        .rich-text-editor-controls input[type="text"] {
          width: 86px;
        }
        .rich-text-editor.ql-rtl .ql-editor {
          direction: rtl;
          text-align: right;
        }
        .rich-text-editor.ql-ltr .ql-editor {
          direction: ltr;
          text-align: left;
        }
        .rich-text-editor .ql-editor ol,
        .rich-text-editor .ql-editor ul {
          margin: 0 0 0.75rem;
          padding-inline-start: 1.5rem;
          padding-inline-end: 0;
        }
        .rich-text-editor.ql-rtl .ql-editor ol,
        .rich-text-editor.ql-rtl .ql-editor ul {
          padding-inline-start: 0;
          padding-inline-end: 1.5rem;
        }
        .rich-text-editor .ql-editor li {
          display: list-item;
          list-style-position: outside;
          margin-bottom: 0.35rem;
          padding-inline-start: 0.25rem;
        }
        .rich-text-editor .ql-editor ol li {
          list-style-type: decimal;
        }
        .rich-text-editor .ql-editor ul li {
          list-style-type: disc;
        }
        .rich-text-editor .ql-editor li[data-list="ordered"] {
          list-style-type: decimal;
        }
        .rich-text-editor .ql-editor li[data-list="bullet"] {
          list-style-type: disc;
        }
        .rich-text-editor .ql-editor li > .ql-ui {
          display: none;
        }

        /* Line Height CSS */
        .ql-snow .ql-picker.ql-lineHeight {
          width: 100px;
        }
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-label::before,
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-item::before {
          content: 'Line Height';
        }
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-label[data-value="1"]::before,
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-item[data-value="1"]::before { content: '1.0'; }
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-label[data-value="1.2"]::before,
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-item[data-value="1.2"]::before { content: '1.2'; }
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-label[data-value="1.5"]::before,
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-item[data-value="1.5"]::before { content: '1.5'; }
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-label[data-value="1.8"]::before,
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-item[data-value="1.8"]::before { content: '1.8'; }
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-label[data-value="2"]::before,
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-item[data-value="2"]::before { content: '2.0'; }
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-label[data-value="2.5"]::before,
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-item[data-value="2.5"]::before { content: '2.5'; }
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-label[data-value="3"]::before,
        .ql-snow .ql-picker.ql-lineHeight .ql-picker-item[data-value="3"]::before { content: '3.0'; }

        /* Letter Spacing CSS */
        .ql-snow .ql-picker.ql-letterSpacing {
          width: 100px;
        }
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-label::before,
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-item::before {
          content: 'Spacing';
        }
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-label[data-value="-1px"]::before,
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-item[data-value="-1px"]::before { content: 'Tight'; }
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-label[data-value="0px"]::before,
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-item[data-value="0px"]::before { content: 'Normal'; }
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-label[data-value="0.5px"]::before,
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-item[data-value="0.5px"]::before { content: 'Wide 0.5'; }
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-label[data-value="1px"]::before,
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-item[data-value="1px"]::before { content: 'Wide 1'; }
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-label[data-value="2px"]::before,
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-item[data-value="2px"]::before { content: 'Wide 2'; }
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-label[data-value="3px"]::before,
        .ql-snow .ql-picker.ql-letterSpacing .ql-picker-item[data-value="3px"]::before { content: 'Wide 3'; }
      `}</style>
    </div>
  );
}
