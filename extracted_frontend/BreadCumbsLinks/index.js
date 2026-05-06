// Breadcrumb.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Breadcrumb = ({ links }) => {
  const navigate = useNavigate();

  const handleButtonClick = (path, state) => {
    navigate(path, { state });
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
