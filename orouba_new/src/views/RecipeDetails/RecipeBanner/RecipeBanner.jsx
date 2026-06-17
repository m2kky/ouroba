"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/BreadCumbsLinks";
import UseGeneral from "../../../hooks/useGeneral";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  HatenaIcon,
  HatenaShareButton,
  InstapaperIcon,
  InstapaperShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  LineIcon,
  LineShareButton,
  OKIcon,
  OKShareButton,
  PocketIcon,
  PocketShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon,
  TumblrShareButton,
  TwitterIcon,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  VKIcon,
  VKShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const first = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const isVideoFile = (src) => /\.(mp4|webm|ogg)(?:[?#].*)?$/i.test(src || "");

const cleanText = (value) =>
  String(value || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const RecipeBanner = ({ data, breads }) => {
  const { language } = UseGeneral();
  const recipeTitle = cleanText(
    language == "ar"
      ? first(data?.nameAr, data?.name_ar)
      : first(data?.nameEn, data?.name_en)
  );

  const [pages, setPages] = useState([]);
  useEffect(() => {
    if (data) {
      setPages([
        {
          name: language == "ar" ? "الرئيسية" : "Home",
          route: "/",
        },
        {
          name: language == "ar" ? "الوصفات" : "Recipes",
          route: "/recipes",
        },
        {
          name: recipeTitle,
          active: true,
        },
      ]);
    }
  }, [data, language, recipeTitle]);
  
  const [isShare, setIsShare] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const shareTitle = recipeTitle;
  const videoSrc = first(data?.videoLink, data?.video_link);
  const imageSrc = first(
    data?.internalImage,
    data?.internal_image,
    data?.images?.[0]?.url,
    data?.image
  );
  const mediaSrc = isVideoFile(videoSrc) ? videoSrc : first(imageSrc, videoSrc);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, [data?.id]);

  const copyRecipeLink = async () => {
    const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
    if (!url) return;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const shareItems = [
    {
      label: "Facebook",
      Button: FacebookShareButton,
      Icon: FacebookIcon,
      props: { url: shareUrl },
    },
    {
      label: "WhatsApp",
      Button: WhatsappShareButton,
      Icon: WhatsappIcon,
      props: { url: shareUrl, title: shareTitle },
    },
    {
      label: "Twitter",
      Button: TwitterShareButton,
      Icon: TwitterIcon,
      props: { url: shareUrl, title: shareTitle },
    },
    {
      label: "LinkedIn",
      Button: LinkedinShareButton,
      Icon: LinkedinIcon,
      props: { url: shareUrl, title: shareTitle },
    },
    {
      label: "Telegram",
      Button: TelegramShareButton,
      Icon: TelegramIcon,
      props: { url: shareUrl, title: shareTitle },
    },
    {
      label: "Reddit",
      Button: RedditShareButton,
      Icon: RedditIcon,
      props: { url: shareUrl, title: shareTitle },
    },
    {
      label: "Line",
      Button: LineShareButton,
      Icon: LineIcon,
      props: { url: shareUrl, title: shareTitle },
    },
    {
      label: "Instapaper",
      Button: InstapaperShareButton,
      Icon: InstapaperIcon,
      props: { url: shareUrl, title: shareTitle },
    },
    {
      label: "Hatena",
      Button: HatenaShareButton,
      Icon: HatenaIcon,
      props: { url: shareUrl, title: shareTitle },
    },
    {
      label: "Email",
      Button: EmailShareButton,
      Icon: EmailIcon,
      props: { url: shareUrl, subject: shareTitle },
    },
    {
      label: "Tumblr",
      Button: TumblrShareButton,
      Icon: TumblrIcon,
      props: { url: shareUrl, title: shareTitle },
    },
    {
      label: "VK",
      Button: VKShareButton,
      Icon: VKIcon,
      props: { url: shareUrl, title: shareTitle },
    },
    {
      label: "OK",
      Button: OKShareButton,
      Icon: OKIcon,
      props: { url: shareUrl, title: shareTitle },
    },
    {
      label: "Pocket",
      Button: PocketShareButton,
      Icon: PocketIcon,
      props: { url: shareUrl, title: shareTitle },
    },
    {
      label: "Viber",
      Button: ViberShareButton,
      Icon: ViberIcon,
      props: { url: shareUrl, title: shareTitle },
    },
  ];
  
  return (
    <div className="recipe_banner">
      <div className="left">
        <Breadcrumb links={pages} />
        <div className="content">
          <h5>
            {recipeTitle}
          </h5>
          <button
            onClick={() => {
              setIsShare(!isShare);
            }}
          >
            <span>{language == "ar" ? "مشاركه" : "Share"}</span>
          </button>
        </div>
        {isShare ? (
          <div className="recipeSharePanel" dir="ltr">
            <div className="recipeShareButtons" aria-label="Recipe share links">
              {shareItems.map(({ label, Button, Icon, props }) => (
                <Button
                  key={label}
                  {...props}
                  disabled={!shareUrl}
                  className="recipeShareButton"
                  aria-label={`Share on ${label}`}
                >
                  <Icon size={36} round />
                </Button>
              ))}
            </div>
            <div className="recipeShareCopy">
              <input
                readOnly
                aria-label="Recipe link"
                value={shareUrl}
                onFocus={(event) => event.target.select()}
              />
              <button type="button" onClick={copyRecipeLink}>
                {copied ? (language == "ar" ? "تم النسخ" : "Copied") : (language == "ar" ? "نسخ" : "Copy")}
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <h5 className="nameOfReciepe rowDiv" style={{ display: "none" }}>
        {recipeTitle}
      </h5>
      <div className="right">
        {mediaSrc ? (
          isVideoFile(mediaSrc) ? (
            <video src={mediaSrc} loop muted autoPlay playsInline></video>
          ) : (
            <img src={mediaSrc} alt={shareTitle || ""} />
          )
        ) : null}
      </div>
    </div>
  );
};

export default RecipeBanner;
