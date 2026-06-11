"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

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
          scope: Scope.INLINE,
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

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    [{ lineHeight: ["1", "1.2", "1.5", "1.8", "2", "2.5", "3"] }],
    [{ letterSpacing: ["-1px", "0px", "0.5px", "1px", "2px", "3px"] }],
    ["link", "image"],
    ["clean"],
  ],
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
  return (
    <div className={`rich-text-editor ${dir === "rtl" ? "ql-rtl" : "ql-ltr"}`}>
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        className="bg-white rounded-lg"
      />
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
        .rich-text-editor.ql-rtl .ql-editor {
          direction: rtl;
          text-align: right;
        }
        .rich-text-editor.ql-ltr .ql-editor {
          direction: ltr;
          text-align: left;
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
