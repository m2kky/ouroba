"use client";
// Breadcrumb.jsx

import React from 'react';
import { useRouter } from 'next/navigation';
import UseGeneral from "../../hooks/useGeneral";
import { localizedPath } from "@/utils/routes";
const Breadcrumb = ({ links }) => {
  const router = useRouter();
  const { language } = UseGeneral();

  const handleButtonClick = (path, state) => {
    if (!path) {
      return;
    }

    router.push(localizedPath(path, language), { state });
  };

  return (
    <div className="breadcrumb">
      {links?.map((link, index) => (
        <span className={link?.active ? "activeLink" : ""} key={index}>
          {index < links.length - 1 ? (
            <button onClick={() => handleButtonClick(link?.route, link?.state)}>
              {link?.name}
            </button>
          ) : (
            <span>{link?.name}</span>
          )}
          {index < links.length - 1 && <span> &gt; </span>}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
