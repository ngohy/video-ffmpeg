import { FadeConfig } from "../../config-interfaces";
import { ENUM } from "../../constant";

class FadeEffect {
  type = "";
  fade = FadeConfig;
  frameRate = 30;

  constructor({fade, frameRate}) {
    this.type = fade.type;
    this.frameRate = frameRate;
    this.fade = { ...FadeConfig, ...fade };
  }

  complexFilter() {
    const { duration, start } = this.fade;
    const offset = start;
    const type = this.type?.toLowerCase();

    switch (this.type.toUpperCase()) {
      case FADE_TYPE.IN:
      case FADE_TYPE.OUT: {
        return `fade=t=${type}:st=${offset}:d=${duration}:alpha=1:n=${frameRate}`;
      }
      default: {
        return `xfade=duration=${duration}:offset=${offset}:transition=${type}`;
      }
    }
  }

  getFadeComplexFilter() {
    return this.complexFilter();
  }

  getTagInOut({ type = "", tagInput = "", isFadeIn = false }) {
    type = type.toUpperCase();
    const { FADE_ENUM } = ENUM;
    const { type: typeFade } = this.fade;
    const outputFade = isFadeIn ? "[fadeIn]" : "[fadeOut]";
    const inputFade = isFadeIn
      ? `[base]${tagInput}`
      : typeFade === FADE_ENUM.IN
      ? `[base]${tagInput}`
      : `${tagInput}[base2]`;

    switch (type) {
      case FADE_ENUM.IN:
      case FADE_ENUM.OUT: {
        return {
          output: outputFade,
          input: tagInput,
        };
      }
      default: {
        return {
          input: typeFade ? inputFade : `[base]${tagInput}`,
          output: outputFade,
        };
      }
    }
  }
}

const FadeEffectInstance = new FadeEffect();
export { FadeEffect as FadeEffectClass, FadeEffectInstance as FadeEffect };
