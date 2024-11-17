import { v4 as uuid } from "uuid";

const initOption = {
  borderW: 0,
  borderC: "0x00FF00@0", //https://www.ffmpeg.org/ffmpeg-all.html#Color,
};

export const FilterPad = (inputTag, option) => {
  const outputTag = `pad-${uuid()}`;
  const { borderW, borderC } = { ...initOption, ...option };
  const padding = 2 * borderW;
  const padX = padding / 2;
  const padY = padding / 2;

  const filter = `[${inputTag}]pad=w=${padding}+iw:h=${padding}+ih:x=${padX}:y=${padY}:color=${borderC},format=rgba[${outputTag}]`;
  return {
    filter,
    outputTag,
  };
};
