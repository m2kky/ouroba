"use client";
import React, { useRef, useState } from "react";
import { removeFromCart, searchIcon } from "../../../assets/svgIcons";
import UseGeneral from "../../../hooks/useGeneral";
import { useRouter } from 'next/navigation';
import { Loader } from "rsuite";
import { resolveMediaTree } from "@/utils/media";
import { localizedPath } from "@/utils/routes";

const SearchBox = ({ setShowSearchModal, searchModal }) => {
  const { language } = UseGeneral();
  const [searchResult, setSearchResult] = useState([]);
  const [products, setProducts] = useState([]);
  const [cooks, setCooks] = useState([]);
  const searchInput = useRef();
  // console.log(searchInput)
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const search = async (value) => {
    if (!value || !value?.length) {
      setSearchResult([]);
      setProducts([]);
      setCooks([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(value)}&locale=${language === "ar" ? "ar" : "en"}`
      );
      const data = await response.json();
      const result = resolveMediaTree(data?.result || {});
      setProducts(Array.isArray(result?.products) ? result.products : []);
      setCooks(Array.isArray(result?.cooks) ? result.cooks : []);
    } catch {
      setProducts([]);
      setCooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="over_lay">
      <div
        className="overLay"
        onClick={() => {
          setShowSearchModal(false);
        }}
      ></div>
      <div className="searchBox">
        <span style={{ display: "inline-block", padding: "7px 18px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="#035297"
          >
            <path
              d="M41.6988 39.496L35.1105 33.0547L34.956 32.8198C34.6689 32.534 34.2763 32.373 33.8666 32.373C33.4568 32.373 33.0642 32.534 32.7771 32.8198C27.178 37.9566 18.5504 38.2358 12.6162 33.4723C6.68189 28.7088 5.28235 20.3808 9.34571 14.0113C13.4091 7.64186 21.6745 5.20745 28.6603 8.32259C35.6461 11.4377 39.1846 19.1358 36.9291 26.3114C36.7667 26.8298 36.8994 27.3935 37.2774 27.7902C37.6554 28.187 38.2211 28.3564 38.7615 28.2347C39.3019 28.1131 39.7349 27.7188 39.8973 27.2004C42.5936 18.6851 38.5213 9.52131 30.3149 5.63719C22.1084 1.75307 12.2306 4.31424 7.07134 11.6639C1.91209 19.0135 3.01974 28.9459 9.67777 35.0359C16.3358 41.1258 26.5461 41.5456 33.7036 36.0237L39.537 41.727C40.1395 42.3134 41.1135 42.3134 41.7159 41.727C42.3178 41.1322 42.3178 40.1746 41.7159 39.5799L41.6988 39.496Z"
              fill="#035297"
            />
          </svg>
        </span>
        <input
          style={{ margin: "0px" }}
          type="search"
          name=""
          id=""
          ref={searchInput}
          onKeyUp={(e) => search(e.target.value)}
          placeholder={
            language?.toLowerCase() === "ar"
              ? "أبحث عن منتجات, أصناف, و أكثر"
              : "Search for products, items, and more"
          }
        />
        <button style={{ width: "100px" }} className="btn-search">
          {language == "ar" ? "بحث" : "Search"}
        </button>
        {searchInput?.current?.value ? (
          <>
            <div className="searchResult">
              {products && products?.length ? (
                <>
                  {" "}
                  <h5
                    style={{
                      width: "100%",
                      color: "#000",
                      paddingLeft: "10px",
                      fontWeight: "800",
                    }}
                  >
                    Products
                  </h5>
                  {products?.map((product) => (
                    <div
                      key={product?.id}
                      className="product"
                      onClick={() => {
                        // if()
                        setShowSearchModal(false);
                        router.push(localizedPath(`/products/${product?.id}`, language));

                        // router.push(`/ProductDetails/${product.id}`)
                        setSearchResult([]);
                      }}
                    >
                      <img
                        style={{ height: "100px" }}
                        src={product?.image}
                        alt={product?.name_ar}
                      />
                      <p>
                        {language === "ar"
                          ? product?.name_ar
                            ? product.name_ar.substring(0, 30) + "..."
                            : ""
                          : product?.name_en
                          ? product.name_en.substring(0, 30) + "..."
                          : ""}
                      </p>
                    </div>
                  ))}
                  <h5
                    style={{
                      width: "100%",
                      color: "#000",
                      paddingLeft: "10px",
                      fontWeight: "800",
                    }}
                  >
                    Recipes
                  </h5>
                </>
              ) : null}
              {cooks &&
                cooks.map((item, index) => {
                  return (
                    <div
                      key={item?.id}
                      className="product"
                      onClick={() => {
                        // if()
                        setShowSearchModal(false);
                        router.push(localizedPath(`/recipe_details/${item?.id}`, language));
                        // router.push(`/ProductDetails/${product.id}`)
                        setSearchResult([]);
                      }}
                    >
                      <img
                        style={{ height: "100px" }}
                        src={item?.image}
                        alt={item?.name_ar}
                      />
                      <p>
                        {language === "ar"
                          ? item?.name_ar
                            ? item.name_ar.substring(0, 30) + "..."
                            : ""
                          : item?.name_en
                          ? item.name_en.substring(0, 30) + "..."
                          : ""}
                      </p>
                    </div>
                  );
                })}
            </div>
          </>
        ) : !loading ? null : (
          <div className="searchResult">
            {" "}
            <Loader size="md" />{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
