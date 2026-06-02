"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const usePageTracking = () => {
  const location = ({ pathname: usePathname() });

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window && window?.gtag)
        window?.gtag('config', 'G-9Z73XLGZYQ', {
          page_path: url,
        });
    };

    handleRouteChange(location.pathname);
  }, [location]);
};

export default usePageTracking;
