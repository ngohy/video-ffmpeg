import { MoveConfig } from "../../config-interfaces";
import { ENUM } from "../../constant";
import { BaseUtil } from "../../utils";
const { POSITION_ENUM, MOVE_ENUM } = ENUM;

class MoveEffect {
  type = "";
  inputPath = "";
  frameRate = 30;
  move = MoveConfig;

  constructor({move, frameRate, inputPath}) {
    this.type = move.type;
    this.inputPath = inputPath;
    this.frameRate = frameRate || 30;
    const transitions = [...MoveConfig.transitions, ...move.transitions];
    this.move = { ...MoveConfig, ...move, transitions };
  }

  complexFilter() {
    const {
      isText,
      padding,
      position,
      scale,
      transitions,
      type,
      width,
      height,
    } = this.move;

    const { x: posPanX, y: posPanY } = this.positionCrop({
      position,
      padding,
      type,
    });
    const { x: posTextX } = this.positionCrop({
      position,
      padding: { x: 0, y: 0 },
    });

    //TODO fix to use all Pan
    //create move multiple for pan (apply move right to left)
    if (
      transitions.length > 1 &&
      [MOVE_ENUM.PAN_LEFT].includes(type.toUpperCase())
    ) {
      const conditionPan = this.createMoveLeftToRightExpression({
        type,
        transitions: transitions,
        videoHeight: height,
        videoWidth: width,
        padding,
        scale,
        posPanX,
        posTextX,
        isText,
      });
      return `scale=w=${scale}*${width}:h=${scale}*${height},crop=w=${width}:h=${height}${conditionPan}`;
    }

    let { panX, panY, conditionPan } = this.getConditionPan({
      type,
      isText,
      posPanX,
      posPanY,
      posTextX,
      padding,
      transition: transitions[0],
    });

    panX = isText ? `:x=${!!panX ? panX : 0}` : !!panX ? `:x=${panX}` : "";
    panY = isText ? `:y=${!!panY ? panY : 0}` : !!panY ? `:y=${panY}` : "";

    if (conditionPan)
      return `scale=w=${scale}*${width}:h=${scale}*${height},crop=w=${width}:h=${height}${conditionPan}`;
    return `scale=w=${scale}*${width}:h=${scale}*${height},crop=w=${width}:h=${height}${panX}${panY}`;
  }

  createMoveLeftToRightExpression({
    type,
    transitions,
    videoWidth,
    videoHeight,
    padding,
    scale,
    posPanX,
    posTextX,
    isText,
  }) {
    if (!enable?.length) throw new Error("Times enable empty");
    let expression = ":x='";
    let accumulatedPosition = 0;

    for (let i = 0; i < transitions.length; i++) {
      const { start, end, speed } = transitions[i];
      const quickToSlow = transitions[i]?.quickToSlow ?? false;
      const duration = end - start;
      const sp = duration / speed;

      // Calculate the movement for the current time segment
      //apply only for effect "right to left"
      const panX = quickToSlow
        ? `${posPanX} + sin(t*PI/2)*(in_w-out_w)/${sp}`
        : getConditionPan({
            type,
            isText,
            transition: transitions[i],
            padding,
            posPanX,
            posTextX,
          }).panX;

      expression += `if(between(t,${start},${end}), ${
        i === 0 ? "" : `${accumulatedPosition}`
      } + ${panX}, `;

      // Update the accumulated position at the end of the segment
      accumulatedPosition +=
        ((end - start) * speed * (scale * videoWidth - videoWidth)) /
        (end - start);
    }

    expression += `x`;
    expression += `)`.repeat(enable.length);
    expression += `'`;

    return expression;
  }

  getConditionPan({
    type,
    isTextPan,
    posPanX,
    posPanY,
    posTextX,
    padding,
    transition,
  }) {
    let panX = "";
    let panY = "";
    let conditionPan = "";

    const { x: pdX, y: pdY } = padding;
    const { start, end, speed } = transition;
    const duration = end - start;
    const sp = duration / speed;

    switch (type) {
      case ANIMATION_ENUM.PAN_DOWN: {
        panX = isTextPan ? posTextX : "";
        panY = isTextPan
          ? `'h+${speed}*t-${pdY}'`
          : `(in_h-out_h) - ${pdY} - t*(in_h-out_h)/${sp}`;
        break;
      }
      case ANIMATION_ENUM.PAN_UP: {
        panX = isTextPan ? posTextX : "";
        panY = isTextPan
          ? `'h-${speed}*t-${pdY}'`
          : `${pdY} + t*(in_h-out_h)/${sp}`;
        break;
      }
      case ANIMATION_ENUM.PAN_RIGHT: {
        panX = `${posPanX} - (t-${start})*(in_w-out_w)/${sp}`;
        panY = `${posPanY}`;
        conditionPan = `:x='if(lte(t,${start}),${posPanX},${panX})':y=${panY}`;
        break;
      }
      case ANIMATION_ENUM.PAN_LEFT: {
        panX = `${posPanX} + (t-${start})*(in_w-out_w)/${sp}`;
        panY = `${posPanY}`;
        conditionPan = `:x='if(lte(t,${start}),${posPanX},${panX})':y=${panY}`;
        break;
      }
      case ANIMATION_ENUM.PAN_BOTTOM_RIGHT: {
        panX = `${posPanX}-t*((in_w-out_w))/${sp}`;
        panY = `${posPanY}-t*((in_h-out_h))/${sp}`;
        break;
      }
      case ANIMATION_ENUM.PAN_BOTTOM_LEFT: {
        panX = `${posPanX}+t*((in_w-out_w))/${sp}`;
        panY = `${posPanY}-t*((in_h-out_h))/${sp}`;
        break;
      }
      case ANIMATION_ENUM.PAN_TOP_LEFT: {
        panX = `${posPanX}+t*((in_w-out_w))/${sp}`;
        panY = `${posPanY}+t*((in_h-out_h))/${sp}`;
        break;
      }
      case ANIMATION_ENUM.PAN_TOP_RIGHT: {
        panX = `${posPanX}-t*((in_w-out_w))/${sp}`;
        panY = `${posPanY}+t*((in_h-out_h))/${sp}`;
        break;
      }
      default:
        throw "Pan Type invalid!";
    }

    return {
      panX,
      panY,
      conditionPan,
    };
  }

  positionCrop(position, padding = { x: 0, y: 0 }, type) {
    const pdX = formatPadding(padding.x);
    const pdY = formatPadding(padding.y);

    if (
      type === ANIMATION_ENUM.PAN_RIGHT &&
      position !== POSITION_ENUM.CENTER
    ) {
      position = POSITION_ENUM.LEFT_CENTER;
    }

    switch (position?.toUpperCase()) {
      case POSITION_ENUM.LEFT_CENTER:
        return {
          x: `(in_w-out_w)${pdX}`,
          y: `(in_h-out_h)/2${pdY}`,
        };
      default:
        //return position center
        return {
          x: `(in_w-out_w)/2${pdX}`,
          y: `(in_h-out_h)/2${pdY}`,
        };
    }
  }

  getMoveComplex(inputTag) {
    const outputTag = `rotate-${uuid()}`;
    return {
      complexFilter: `[${inputTag}]${this.complexFilter}[${outputTag}]`,
      inputTag: outputTag,
    };
  }

  async createBackground() {
    const { width, height } = await BaseUtil.GetInformation(this.inputPath);
    const { height: moveH, width: moveW } = this.move;

    // calculate scale size of background and size of image
    // const 


  }
}
const MoveEffectInstance = new MoveEffect();

export { MoveEffect as MoveEffectClass, MoveEffectInstance as MoveEffect };
