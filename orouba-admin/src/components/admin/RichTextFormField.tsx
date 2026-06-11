"use client";

import { useEffect, useState } from "react";
import RichTextEditor from "@/components/admin/RichTextEditor";

type RichTextFormFieldProps = {
  name: string;
  label: string;
  defaultValue?: string | null;
  dir?: "rtl" | "ltr";
  required?: boolean;
};

export default function RichTextFormField({
  name,
  label,
  defaultValue,
  dir,
  required = false,
}: RichTextFormFieldProps) {
  const [value, setValue] = useState(defaultValue || "");

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
        {required ? " *" : ""}
      </label>
      <input type="hidden" name={name} value={value} />
      <RichTextEditor value={value} onChange={setValue} dir={dir} />
    </div>
  );
}
