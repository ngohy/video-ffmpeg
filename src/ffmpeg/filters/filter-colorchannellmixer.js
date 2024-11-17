import { v4 as uuid } from "uuid";
import { ColorchannelmixerConfig } from "../../config-interfaces.d";

export const FilterColorChannelMixer = (inputTag, option) => {
  const outputTag = `mixer-${uuid()}`;
  const clm = { ...ColorchannelmixerConfig, ...option };
  const colorchannelmixer = Object.keys(clm)
    .filter((key) => key !== "gblur" && key !== "colorchannelmixer")
    .map((key) => `${key}=${clm[key]}`)
    .join(":");

  const filter = `[${inputTag}]colorchannelmixer=${colorchannelmixer},gblur=sigma=${clm.gblur}[${outputTag}]`;
  return { filter, outputTag };
};
