import { v4 as uuid } from "uuid";
import { ENUM } from "../../constant";

const initOption = {
  width: -1,
  height: -1,
  crop: false,
  format: "rgba64le",
  forceOriginalAspectRatio: null,
};

export const FilterScale = (inputTag, option) => {
  const outputTag = `scale-${uuid()}`;
  const {
    width: W,
    height: H,
    crop,
    forceOriginalAspectRatio: FR,
    format,
  } = { ...initOption, ...option };
  
  const { FORCE_ORIGINAL_ASPECT_RATIO } = ENUM;
  const AR = FORCE_ORIGINAL_ASPECT_RATIO[FR] || null;

  // Construct scale filter string
  let filter = `[${inputTag}]format=${format},scale=${W}:${H}:flags=lanczos`;

  if (AR) {
    filter += `:force_original_aspect_ratio=${AR}`;
  }

  if (crop) {
    filter += `,crop=${W}:${H}`;
  }

  filter += `[${outputTag}]`;

  return { filter, outputTag };
};
