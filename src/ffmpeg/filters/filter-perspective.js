import { v4 as uuid } from "uuid";

export const FilterPerspective = (inputTag, option) => {
  const outputTag = `perspective-${uuid()}`;
  const perspective = option;

  let formatPerspective = "";
  Object.keys(perspective).map((key, index) => {
    if (index === 0) return;
    const { x, y } = perspective[key];
    formatPerspective += index === 1 ? `${x}:${y}` : `:${x}:${y}`;
  });

  const stringPad = `[${inputTag}]pad=iw+100:ih+100:50:50:0x00FF00@0[pad-${uuid()}]`;
  const string = `[pad-${uuid()}]perspective=${formatPerspective}:sense=destination[${outputTag}]`;
  return {
    filter: [stringPad, string],
    outputTag,
  };
};
