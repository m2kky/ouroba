import React from "react";
import UseGeneral from "../../../hooks/useGeneral";

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const decodeEntities = (value) =>
  String(value)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&rsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"');

const htmlToText = (html) => {
  if (!html || !String(html).trim()) {
    return "";
  }

  return decodeEntities(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const textToHtml = (text) => {
  const cleanText = String(text || "").trim();
  if (!cleanText) {
    return "";
  }

  return `<p>${escapeHtml(cleanText).replace(/\n+/g, "<br />")}</p>`;
};

const hasHtmlTags = (value) => /<\/?[a-z][\s\S]*>/i.test(String(value || ""));

const HtmlBlock = ({ html }) => {
  if (!html || !String(html).trim()) {
    return null;
  }

  const normalizedHtml = hasHtmlTags(html) ? html : textToHtml(html);

  return (
    <div
      className="recipe-rich-text"
      dangerouslySetInnerHTML={{ __html: normalizedHtml }}
    />
  );
};

const labelPatterns = {
  ar: {
    ingredients: ["المكونات", "مكونات", "المقادير", "مقادير"],
    instructions: ["طريقة التحضير", "التحضير", "الخطوات", "طريقة العمل", "الطريقة"],
  },
  en: {
    ingredients: ["ingredients"],
    instructions: ["instructions", "directions", "method", "steps"],
  },
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findLabel = (text, labels) => {
  const matches = labels
    .map((label) => {
      const regex = new RegExp(
        `(^|\\n|\\s)(?:[#*\\-–—]+\\s*)?${escapeRegex(label)}\\s*:?`,
        "i"
      );
      const match = regex.exec(text);
      if (!match) {
        return null;
      }

      return {
        index: match.index + match[1].length,
        end: match.index + match[0].length,
      };
    })
    .filter(Boolean);

  return matches.sort((a, b) => a.index - b.index)[0] || null;
};

const splitDescriptionSections = (html, isArabic) => {
  if (!html || !String(html).trim()) {
    return {
      ingredientsHtml: "",
      instructionsHtml: "",
      wasSplit: false,
    };
  }

  const text = htmlToText(html);
  const patterns = isArabic ? labelPatterns.ar : labelPatterns.en;
  const ingredientsLabel = findLabel(text, patterns.ingredients);
  const instructionsLabel = findLabel(text, patterns.instructions);

  if (!ingredientsLabel && !instructionsLabel) {
    return {
      ingredientsHtml: "",
      instructionsHtml: html,
      wasSplit: false,
    };
  }

  const ingredientsText =
    ingredientsLabel &&
    (!instructionsLabel || ingredientsLabel.index < instructionsLabel.index)
      ? text.slice(
          ingredientsLabel.end,
          instructionsLabel ? instructionsLabel.index : undefined
        )
      : "";

  const instructionsText = instructionsLabel
    ? text.slice(instructionsLabel.end)
    : "";

  return {
    ingredientsHtml: textToHtml(ingredientsText),
    instructionsHtml: textToHtml(instructionsText),
    wasSplit: true,
  };
};

const RecipeAbout = ({ data }) => {
  const { language } = UseGeneral();
  const isArabic = language == "ar";
  const ingredients = Array.isArray(data?.steps)
    ? data.steps.filter((item) =>
        isArabic
          ? item?.stepAr && String(item.stepAr).trim()
          : item?.stepEn && String(item.stepEn).trim()
      )
    : [];
  const hasIngredients = ingredients.length > 0;
  const descriptionHtml = isArabic ? data?.descriptionAr : data?.descriptionEn;
  const descriptionSections = splitDescriptionSections(descriptionHtml, isArabic);
  const fallbackIngredientsHtml = hasIngredients
    ? ""
    : descriptionSections.ingredientsHtml;
  const hasFallbackIngredients = Boolean(
    fallbackIngredientsHtml && String(fallbackIngredientsHtml).trim()
  );
  const instructionsHtml = descriptionSections.instructionsHtml;
  const hasInstructions = Boolean(instructionsHtml && String(instructionsHtml).trim());

  return (
    <div className="recipe_about rowDiv">
      <div className="left">
        {data?.internalImage ? <img src={data.internalImage} alt="" /> : null}
      </div>

      <div className="right">
        {hasIngredients || hasFallbackIngredients ? (
          <h3>
            <b>{isArabic ? "المكونات" : "Ingredients"}</b>
          </h3>
        ) : null}

        {hasIngredients ? (
          ingredients.map((item, index) => (
            <React.Fragment key={item.id || index}>
              <HtmlBlock html={isArabic ? item?.stepAr : item?.stepEn} />
            </React.Fragment>
          ))
        ) : (
          <HtmlBlock html={fallbackIngredientsHtml} />
        )}
      </div>

      <div className={`bottom ${isArabic ? "active" : ""}`}>
        {hasInstructions ? (
          <>
            <h3>
              <b>{isArabic ? "طريقة التحضير" : "Instructions"}</b>
            </h3>
            <HtmlBlock html={instructionsHtml} />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default RecipeAbout;
