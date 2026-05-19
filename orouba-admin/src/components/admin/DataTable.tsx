import React, { useState } from "react";
import { Search } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => React.ReactNode;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  actions,
  searchPlaceholder = "بحث...",
  onSearch,
}: DataTableProps<T>) {
  const [hoveredImg, setHoveredImg] = useState<{ src: string; alt: string; x: number; y: number } | null>(null);

  const handleMouseOver = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      const img = target as HTMLImageElement;
      // Only trigger preview for small thumbnails to avoid hovering over large images
      if (img.clientWidth <= 80) {
        setHoveredImg({
          src: img.src,
          alt: img.alt || "",
          x: e.clientX + 15,
          y: e.clientY + 15
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredImg) {
      setHoveredImg(prev => prev ? {
        ...prev,
        x: e.clientX + 15,
        y: e.clientY + 15
      } : null);
    }
  };

  const handleMouseOut = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      setHoveredImg(null);
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative"
      onMouseOver={handleMouseOver}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
    >
      {/* Table Header & Search */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        {onSearch && (
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orouba-blue/20 focus:border-orouba-blue transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        )}
        <div className="text-sm font-semibold text-gray-600 bg-gray-50/80 px-3 py-2 rounded-xl border border-gray-200 shadow-sm whitespace-nowrap">
          إجمالي العدد: <span className="text-orouba-blue font-bold ml-1">{data.length}</span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-6 py-4 text-center">الإجراءات</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col) => (
                    <td key={`${item.id}-${col.key}`} className="px-6 py-4">
                      {col.render ? col.render(item) : (item as any)[col.key] || "—"}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 flex justify-center gap-2">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  لا توجد بيانات للعرض
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Preview Zoom Popover */}
      {hoveredImg && (
        <div 
          className="fixed z-50 pointer-events-none p-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl animate-fade-in scale-in"
          style={{
            left: `${hoveredImg.x}px`,
            top: `${hoveredImg.y}px`,
            transform: "translate(0, 0)",
          }}
        >
          <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white">
            <img 
              src={hoveredImg.src} 
              alt={hoveredImg.alt} 
              className="object-cover w-48 h-48"
            />
            {hoveredImg.alt && (
              <div className="bg-gray-950/80 text-white text-xs font-semibold px-3 py-1.5 absolute bottom-0 left-0 right-0 text-center truncate">
                {hoveredImg.alt}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
