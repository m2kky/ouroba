"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { forwardRef } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-40 w-full animate-pulse bg-gray-100 rounded-lg"></div>,
});

const modules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "align",
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
}

export default function RichTextEditor({ value, onChange, placeholder, dir }: RichTextEditorProps) {
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
          min-height: 150px;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          font-family: inherit;
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
      `}</style>
    </div>
  );
}
