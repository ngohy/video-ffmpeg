import { v4 as uuid } from "uuid";
import { RotateConfig } from "../../config-interfaces.d";
import { ENUM } from "../../constant";

export const FilterRotate = (inputTag, option = RotateConfig) => {
  const outputTag = `rotate-${uuid()}`;
  const { type, degrees, counterLock, start, end, speed, rotate } = {
    ...RotateConfig,
    ...option,
  };

  const rad = `${degrees || 0} * PI/180`;
  const radians = type === ENUM.ROTATE_ENUM.ROTATE_CW ? `${rad}` : `- ${rad}`;

  const optionRotate = `:c=none:ow=${width + 100}:oh=${height + 100}`;
  let filter = `[${inputTag}]rotate=${radians}${optionRotate}`;

  if (rotate) {
    const radiansSpin = Math.PI / 8;
    const sp = (end - start) / (speed || 1);

    const rte = `${radiansSpin}*t/${sp}`;
    filter += `,rotate=a=${counterLock ? rte : `-${rte}`}${optionRotate}`;
  }

  filter += `[${outputTag}]`;

  return {
    filter,
    outputTag,
  };
};
