import "bootstrap/dist/css/bootstrap.min.css";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import "rsuite/Loader/styles/index.css";
import usePageTracking from "./hooks/pageTracking";
import "./App.css";
import { AppRoutes } from "./Routes/routes";
import DefaultLayout from "./layouts/defaultLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchCartData } from "./store/cartReducer";
import { fetchSiteData } from "./store/siteReducer";
import UseGeneral from "./hooks/useGeneral";
import { pagesName } from "./data/pagesName";
import { change, change2 } from "./store/languageReducer";
function App() {
  const { language } = UseGeneral();
  // const s=useSelector(s=>console.log(s));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  //   const fetchDataHandler = () => {
  //     dispatch(fetchData());
  //   };
  usePageTracking();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };
  useEffect(() => {
    setTimeout(() => {
      document.title =
        language == "ar"
          ? pagesName?.filter(
              (item) =>
                location?.pathname?.toLowerCase() ==
                  item?.route?.toLowerCase() ||
                location?.pathname
                  ?.toLowerCase()
                  ?.includes(item?.route?.toLowerCase())
            )[1]?.name_ar
          : pagesName?.filter(
              (item) =>
                location?.pathname?.toLowerCase() ==
                  item?.route?.toLowerCase() ||
                location?.pathname
                  ?.toLowerCase()
                  ?.includes(item?.route?.toLowerCase())
            )[1]?.name_en;
      if (
        location?.pathname == "/ar" ||
        location?.pathname == "/en" ||
        location?.pathname == "/"
      ) {
        document.title = language == "ar" ? " الرئيسية" : "Home";
      }
    }, 200);
  }, [language, location?.pathname]);

  let localLang = localStorage.getItem("ouroubaLanguage") || "ar"; // Default to 'ar' if no language is set

  useEffect(() => {
    let linkArr = window.location.href.split("/");
    let lastElementLang = linkArr[linkArr.length - 1]?.slice(0, 2); // Extract language (ar or en)
    let lastElement = linkArr[linkArr.length - 1];

    if (lastElementLang === "ar" || lastElementLang === "en") {
      if (localLang !== lastElementLang) {
        let locQuesMark = lastElement.indexOf("?");
       
          if (locQuesMark !== -1) {
          let afterQues = lastElement.substring(locQuesMark + 1);
          localStorage.setItem("ouroubaLanguage", lastElementLang);
          // Clean up URL and append language
          const currentPath = location.pathname
            .replace(/\/(ar|en)$/, "")
            .replace(/\/$/, "");
          const newPath =
            `/${currentPath}/${lastElementLang}?${afterQues}`.replace(
              /\/\//,
              "/"
            );
          navigate(newPath, { replace: true });
          dispatch(change2(lastElementLang)); // Dispatch language change
        } else {
          localStorage.setItem("greenTreesLanguage", lastElementLang);
          localStorage.setItem("ouroubaLanguage", lastElementLang);
          const currentPath = location.pathname
            .replace(/\/(ar|en)$/, "")
            .replace(/\/$/, "");
          const newPath = `/${currentPath}/${lastElementLang}`.replace(
            /\/\//,
            "/"
          );
          // window.location.reload()
          dispatch(change2(lastElementLang));
          navigate(newPath, { replace: true });
        }
      }
    } else {
      const currentPath = location.pathname
        .replace(/\/(ar|en)$/, "")
        .replace(/\/$/, "");
        localStorage.setItem("ouroubaLanguage", localLang);
        // window.location.reload();
      const newPath = `/${currentPath}/${localLang}`.replace(/\/\//, "/");
          dispatch(change2(localLang));
          navigate(newPath, { replace: true });
    }

    setTimeout(() => {
      scrollToTop();
    }, 100);
    setTimeout(()=>{
        if (localStorage.getItem("ouroubaLanguage") === "ar") {
          const convertToArabicNumerals = (text) => {
            const arabicNumbers = [
              "٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"
            ];
            return text.replace(/\d/g, (digit) => arabicNumbers[digit]);
          };
    
          const convertNumbersInPage = () => {
            const processTextNodes = (node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = node.textContent.split(' ').map(convertToArabicNumerals).join(' ');
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                for (let i = 0; i < node.childNodes.length; i++) {
                  processTextNodes(node.childNodes[i]);
                }
              }
            };
            processTextNodes(document.body);
          };
    
          convertNumbersInPage();
    
          // Observe for changes in the DOM and apply numeral conversion
          const observer = new MutationObserver(() => {
            convertNumbersInPage();
          });
    
          observer.observe(document.body, { childList: true, subtree: true });
        }
    }, 200)
  }, [language, location.pathname]);

  // useEffect(()=>{

  //   window.location.reload()
  // },[localLang])
  // window.location.reload()

  useEffect(() => {
    dispatch(fetchSiteData());
  }, []);
  const fetchDataHandler = () => {
    dispatch(fetchCartData());
  };
  useEffect(() => {
    fetchDataHandler();
  }, []);
  return (
    <DefaultLayout>
      {<AppRoutes />}
      <Toaster containerClassName="toastCon" />
    </DefaultLayout>
  );
}

export default App;
