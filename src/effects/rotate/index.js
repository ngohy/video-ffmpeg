import { v4 as uuid } from 'uuid';
import { RotateConfig } from "../../config-interfaces";

class RotateEffect {
  type = "";
  rotate = RotateConfig;
  frameRate = 30;

  constructor({rotate, frameRate}) {
    this.type = rotate.type;
    this.frameRate = frameRate;
    this.rotate = { ...RotateConfig, ...rotate };
  }

  complexFilter() {
    const { clockwise, degrees, end, speed, start, width, height, rotate } =
      this.rotate;

    const radiansSpin = Math.PI / 8;
    const sp = Math.ceil(end - start) / (speed || 1);

    const rad = `${degrees || 0} * PI/180`;
    const radians =
      this.type === ANIMATION_ENUM.ROTATE_CW ? `${rad}` : `- ${rad}`;

    const optionRotate = `:fillcolor=0x00000000:c=none:ow=${width}:oh=${height}`;
    const complexFilter = [
      `pad=iw+100:ih+100:50:50:0x00FF00@0`,
      `rotate=${radians}${optionRotate}`,
    ];

    if (rotate) {
      const rte = `${radiansSpin}*t/${sp}`;
      return [
        ...complexFilter,
        `rotate=a=${clockwise ? rte : `-${rte}`}${optionRotate}`,
      ];
    }

    return complexFilter;
  }

  getRotateComplex(inputTag) {
    const outputTag = `rotate-${uuid()}`;
    return {
      complexFilter: `[${inputTag}]${this.complexFilter}[${outputTag}]`,
      inputTag: outputTag,
    };
  }
}

const rotateEffectInstance = new RotateEffect();
export {
  RotateEffect as RotateEffectClass,
  rotateEffectInstance as RotateEffect,
};
