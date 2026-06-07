import UseGeneral from "../../../hooks/useGeneral";

const first = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

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

const listMarkerRegex =
  /^\s*(?:[-*•‣▪]\s+|[0-9٠-٩۰-۹]+(?:[\).،]|[-–—])\s*)/;
const headingMarkerRegex = /^\s*#{1,6}\s*/;
const headingSuffixRegex = /[：:]\s*$/;
const knownSubheadingRegex =
  /^(?:مقادير|مكونات|التقلية|طريقة التقلية|الحشو|الصوص|الصوصات|التتبيلة|للتزيين)(?:\s|$)|^(?:for\s+|frying|sauce|dressing|marinade|filling|topping|garnish)(?:\s|$)/i;

const stripListMarker = (line) => String(line || "").replace(listMarkerRegex, "").trim();

const stripHeadingMarker = (line) =>
  String(line || "")
    .replace(headingMarkerRegex, "")
    .replace(headingSuffixRegex, "")
    .trim();

const isSubheadingLine = (line) => {
  const value = String(line || "").trim();
  const cleanValue = stripHeadingMarker(value);

  if (!cleanValue) return false;
  if (headingMarkerRegex.test(value) || headingSuffixRegex.test(value)) return true;
  if (listMarkerRegex.test(value)) return false;

  return knownSubheadingRegex.test(cleanValue);
};

const parseStructuredContent = (html) => {
  const lines = htmlToText(html)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const groups = [];
  let currentItems = [];

  const pushItems = () => {
    if (currentItems.length) {
      groups.push({ type: "items", items: currentItems });
      currentItems = [];
    }
  };

  lines.forEach((line) => {
    if (isSubheadingLine(line)) {
      pushItems();
      groups.push({ type: "heading", text: stripHeadingMarker(line) });
      return;
    }

    const itemText = stripListMarker(line);
    if (itemText) {
      currentItems.push(itemText);
    }
  });

  pushItems();
  return groups;
};

const StructuredContent = ({ html, variant }) => {
  if (!html || !String(html).trim()) {
    return null;
  }

  const groups = parseStructuredContent(html);
  if (!groups.length) {
    return null;
  }

  let orderedStart = 1;

  return (
    <div className={`recipe-structured recipe-structured-${variant}`}>
      {groups.map((group, index) => {
        if (group.type === "heading") {
          return (
            <h4 className="recipe-subheading" key={`heading-${index}`}>
              {group.text}
            </h4>
          );
        }

        if (variant === "instructions") {
          const start = orderedStart;
          orderedStart += group.items.length;

          return (
            <ol className="recipe-list recipe-list-instructions" start={start} key={`list-${index}`}>
              {group.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{item}</li>
              ))}
            </ol>
          );
        }

        return (
          <ul className="recipe-list recipe-list-ingredients" key={`list-${index}`}>
            {group.items.map((item, itemIndex) => (
              <li key={`${index}-${itemIndex}`}>{item}</li>
            ))}
          </ul>
        );
      })}
    </div>
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

const getStepHtml = (item, isArabic) =>
  isArabic
    ? first(item?.stepAr, item?.step_ar)
    : first(item?.stepEn, item?.step_en);

const RecipeAbout = ({ data }) => {
  const { language } = UseGeneral();
  const isArabic = language == "ar";
  const rawIngredients = Array.isArray(data?.steps)
    ? data.steps
    : Array.isArray(data?.step)
    ? data.step
    : [];
  const ingredients = rawIngredients.filter((item) => getStepHtml(item, isArabic));
  const hasIngredients = ingredients.length > 0;
  const ingredientsHtml = ingredients
    .map((item) => getStepHtml(item, isArabic))
    .filter(Boolean)
    .join("\n");
  const descriptionHtml = isArabic
    ? first(data?.descriptionAr, data?.description_ar)
    : first(data?.descriptionEn, data?.description_en);
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
        {first(data?.internalImage, data?.internal_image) ? (
          <img src={first(data?.internalImage, data?.internal_image)} alt="" />
        ) : null}
      </div>

      <div className="right">
        {hasIngredients || hasFallbackIngredients ? (
          <h3>
            <b>{isArabic ? "المكونات" : "Ingredients"}</b>
          </h3>
        ) : null}

        {hasIngredients ? (
          <StructuredContent html={ingredientsHtml} variant="ingredients" />
        ) : (
          <StructuredContent html={fallbackIngredientsHtml} variant="ingredients" />
        )}
      </div>

      <div className={`bottom ${isArabic ? "active" : ""}`}>
        {hasInstructions ? (
          <>
            <h3>
              <b>{isArabic ? "طريقة التحضير" : "Instructions"}</b>
            </h3>
            <StructuredContent html={instructionsHtml} variant="instructions" />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default RecipeAbout;
