"use client";

import { Info } from "lucide-react";
import { useAdminTranslation } from "@/components/admin/AdminTranslationProvider";

interface AdminPageInfoProps {
  titleAr?: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  prereq1Ar?: string;
  prereq1En?: string;
  prereq2Ar?: string;
  prereq2En?: string;
  
  // Legacy props
  title?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export default function AdminPageInfo({
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  prereq1Ar,
  prereq1En,
  prereq2Ar,
  prereq2En,
  title,
  description,
  children
}: AdminPageInfoProps) {
  const { t } = useAdminTranslation();

  const displayTitle = title || (titleAr && titleEn ? t(titleAr, titleEn) : "");
  const displayDesc = description || (descriptionAr && descriptionEn ? t(descriptionAr, descriptionEn) : "");
  const displayPrereq1 = prereq1Ar && prereq1En ? t(prereq1Ar, prereq1En) : "";
  const displayPrereq2 = prereq2Ar && prereq2En ? t(prereq2Ar, prereq2En) : "";

  return (
    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 flex items-start gap-4 mb-6 shadow-sm">
      <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {displayTitle && <h4 className="text-lg font-bold text-blue-900 mb-2">{displayTitle}</h4>}
        {displayDesc && <div className="text-base text-blue-800 leading-relaxed">{displayDesc}</div>}
        
        {(displayPrereq1 || displayPrereq2) && (
          <ul className="list-disc list-inside mt-2 space-y-1 text-blue-800/80 font-medium text-base">
            {displayPrereq1 && <li>{displayPrereq1}</li>}
            {displayPrereq2 && <li>{displayPrereq2}</li>}
          </ul>
        )}
        
        {children && <div className="text-base text-blue-800 leading-relaxed mt-2">{children}</div>}
      </div>
    </div>
  );
}
