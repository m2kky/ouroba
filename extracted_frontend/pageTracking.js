import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTracking = () => {
  const location = useLocation();

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
