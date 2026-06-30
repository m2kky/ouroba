"use client";
// Breadcrumb.jsx

import React from 'react';
import Link from 'next/link';
import UseGeneral from "../../hooks/useGeneral";
import { localizedPath } from "@/utils/routes";

const getLinkPath = (link) => link?.route || link?.path || link?.href || "";

const Breadcrumb = ({ links }) => {
  const { language } = UseGeneral();

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {links?.map((link, index) => {
        const isLast = index === links.length - 1;
        const path = getLinkPath(link);
        const href = path && !link?.active ? localizedPath(path, language) : "";

        return (
          <span
            className={link?.active || isLast ? "activeLink" : ""}
            key={`${link?.name || "breadcrumb"}-${index}`}
          >
            {!isLast && href && href !== "#" ? (
              <Link href={href}>{link?.name}</Link>
            ) : (
              <span aria-current={isLast ? "page" : undefined}>{link?.name}</span>
            )}
            {!isLast && <span> &gt; </span>}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
