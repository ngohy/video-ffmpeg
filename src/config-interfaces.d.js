import { v4 as uuid } from "uuid";
import { ENUM } from "./constant/enum";
const { POSITION_ENUM } = ENUM;

/**
 * Padding configuration for x and y coordinates.
 * @typedef {Object} Padding
 * @property {number} x - Padding on the x-axis.
 * @property {number} y - Padding on the y-axis.
 */
const padding = { x: 0, y: 0 };

/**
 * MoveEffect configuration for pan effects.
 * @typedef {Object} MoveEffect
 * @property {string} id
 * @property {string} type - Type of move effect.
 * @property {boolean} isText - Indicates if the effect applies to text.
 * @property {number} scale - Scale factor for the effect.
 * @property {number} width - Width of the moving element.
 * @property {number} height - Height of the moving element.
 * @property {string} position - Position of the move effect (e.g., CENTER).
 * @property {Padding} padding - Padding configuration for the effect.
 * @property {Array<Object>} transitions - Array of transition configurations.
 */
const MoveConfig = {
  id: uuid(),
  type: "",
  isText: false,
  scale: 1.3,
  width: 1000,
  height: 750,
  position: POSITION_ENUM.CENTER,
  padding,
  transitions: [{ start: 0, end: 0, speed: 0, quickToSlow: false }],
};

/**
 * RotateEffect configuration for rotation animations.
 * @typedef {Object} RotateEffect
 * @property {string} id
 * @property {string} type - Type of rotation effect.
 * @property {number} start - Start time for rotation effect.
 * @property {number} end - End time for rotation effect.
 * @property {number} speed - Speed of the rotation.
 * @property {number} degrees - Degrees of rotation.
 * @property {boolean} clockwise - Rotation direction; true for clockwise.
 * @property {number} width - Width of the rotating element.
 * @property {number} height - Height of the rotating element.
 * @property {boolean} rotate
 */
const RotateConfig = {
  id: uuid(),
  type: "",
  start: 0,
  end: 0,
  speed: 0,
  degrees: 0,
  clockwise: true,
  width: 1000,
  height: 750,
  rotate: false,
};

/**
 * ZoomEffect configuration for zoom animations.
 * @typedef {Object} ZoomEffect
 * @property {string} id
 * @property {string} type - Type of zoom effect.
 * @property {number} scale - Scale factor for zoom.
 * @property {number} start - Start time for the zoom effect.
 * @property {number} end - End time for the zoom effect.
 * @property {number} speed - Speed of zoom effect.
 */
const ZoomConfig = {
  id: uuid(),
  type: "",
  scale: 1.0,
  start: 0,
  end: 0,
  speed: 0,
};

/**
 * FadeEffect configuration for fade in/out effects.
 * @typedef {Object} FadeEffect
 * @property {string} id
 * @property {string} type - Type of fade effect.
 * @property {number} start - Start time for the fade effect.
 * @property {number} duration - Duration of the fade effect.
 */
const FadeConfig = {
  id: uuid(),
  type: "",
  start: 0,
  duration: 0,
};

/**
 * PerspectiveEffect configuration for image transformation effects.
 * @typedef {Object} PerspectiveEffect
 * @property {string} id
 * @property {boolean} perspective - Whether to enable perspective transformation.
 * @property {Object} topLeft - Top-left corner coordinates.
 * @property {number|string} topLeft.x - X-coordinate for top-left corner.
 * @property {number|string} topLeft.y - Y-coordinate for top-left corner.
 * @property {Object} topRight - Top-right corner coordinates.
 * @property {number|string} topRight.x - X-coordinate for top-right corner.
 * @property {number|string} topRight.y - Y-coordinate for top-right corner.
 * @property {Object} bottomLeft - Bottom-left corner coordinates.
 * @property {number|string} bottomLeft.x - X-coordinate for bottom-left corner.
 * @property {number|string} bottomLeft.y - Y-coordinate for bottom-left corner.
 * @property {Object} bottomRight - Bottom-right corner coordinates.
 * @property {number|string} bottomRight.x - X-coordinate for bottom-right corner.
 * @property {number|string} bottomRight.y - Y-coordinate for bottom-right corner.
 */
const PerspectiveConfig = {
  id: uuid(),
  perspective: false,
  topLeft: { x: 0, y: 0 },
  topRight: { x: "W", y: 0 },
  bottomLeft: { x: 0, y: "H" },
  bottomRight: { x: "W", y: "H" },
};


const EffectConfig = {
  fade: [FadeConfig],
  zoom: [ZoomConfig],
  rotate: [RotateConfig],
  move: [MoveConfig],
  perspective: [PerspectiveConfig],
};

/**
 * Image configuration structure.
 * @typedef {Object} ImageConfig
 * @property {string} image - Path to the image file.
 * @property {number} width - Image width.
 * @property {number} height - Image height.
 * @property {Object} enable - Timing configuration for image overlay.
 * @property {number} enable.start - Start time for image overlay.
 * @property {number} enable.end - End time for image overlay.
 * @property {string} position - Position for the image overlay.
 * @property {Padding} padding - Padding configuration for overlay.
 * @property {Object} effect - Collection of effects applied to the image.
 */
const ImageConfig = {
  image: "",
  width: 0,
  height: 0,
  enable: { start: 0, end: 1 },
  position: POSITION_ENUM.CENTER,
  padding: padding,
  effect: EffectConfig,
};

/**
 * Text configuration structure.
 * @typedef {Object} TextConfig
 * @property {string[]} textList - Array of text strings.
 * @property {string} color - Text color.
 * @property {number} fontSize - Size of the font.
 * @property {string} fontPath - Path to the font file.
 * @property {number} lineSpace - Space between lines.
 * @property {number} lineHeight - Height of each text line.
 * @property {number} borderWidth - Width of the text border.
 * @property {string} borderColor - Border color of the text.
 * @property {number} boxWidth - Width of the background box for text.
 * @property {string} boxColor - Background box color.
 * @property {Object} enable - Timing configuration for text display.
 * @property {number} enable.start - Start time for text display.
 * @property {number} enable.end - End time for text display.
 * @property {string} position - Position of the text overlay.
 * @property {Padding} padding - Padding configuration for text positioning.
 * @property {Object} effect - Collection of effects applied to the text.
 */
const TextConfig = {
  textList: [""],
  color: "black",
  fontSize: 24,
  fontPath: "",
  lineSpace: 0,
  lineHeight: 0,
  borderWidth: 0,
  borderColor: "black@0.0",
  boxWidth: 0,
  boxColor: "black@0.0",
  enable: { start: 0, end: 1 },
  position: POSITION_ENUM.CENTER,
  padding: padding,
  effect: EffectConfig,
};

/**
 * Color Channel Mixer Configuration.
 * @typedef {Object} ColorchannelmixerConfig
 * @property {boolean} colorchannelmixer - Indicates if the color channel mixer is applied.
 * @property {number} rr - Red-to-red channel adjustment.
 * @property {number} gblur - Blur effect for the mask.
 */
const ColorchannelmixerConfig = {
  colorchannelmixer: false,
  rr: 1.0,
  rg: 1.0,
  rb: 1.0,
  ra: 1.0,
  gr: 1.0,
  gg: 1.0,
  gb: 1.0,
  ga: 1.0,
  br: 1.0,
  bg: 1.0,
  bb: 1.0,
  ba: 1.0,
  ar: 1.0,
  ag: 1.0,
  ab: 1.0,
  aa: 1.0,
  gblur: 1,
};



/**
 * Initialization configuration for video processing.
 * @typedef {Object} InitValue
 * @property {string} width - Width of the video, or "-1" for auto. 
 * @property {string} height - Height of the video, or "-1" for auto. 
 * @property {number} duration - Duration of the video in seconds.
 * @property {number} frameRate - Frame rate of the video (e.g., 30).
 * @property {boolean} transparent - background is transparent
 * 
 * @property {Object} overlay - Configuration for overlaying images or text.
 * @property {Object} overlay.enable - Timing configuration for the overlay.
 * @property {number} overlay.enable.start - Start time for the overlay to appear.
 * @property {number} overlay.enable.end - End time for the overlay.
 * @property {Object} overlay.padding - Padding for overlay positioning.
 * @property {number} overlay.padding.x - Horizontal padding for the overlay.
 * @property {number} overlay.padding.y - Vertical padding for the overlay.
 * @property {string} overlay.position - Position of the overlay (e.g., "center").
 * 
 * @property {Object} image - Configuration for image settings.
 * @property {number} image.hue - Hue rotation for the image.
 * @property {number} image.round - Roundness applied to the image.
 * @property {string} image.color - Color mode used for the image.
 * @property {number} image.borderWidth - Width of the image border.
 * @property {string} image.borderColor - Color of the image border.
 * @property {number} image.boxWidth - Width of the box behind the image.
 * @property {string} image.boxColor - Color of the background box behind the image.
 * @property {string} image.perspective - Perspective transformation string for the image.
 * @property {string} image.colorchannelmixer - Color channel mixer filter configuration.
 * @property {Object} image.rotate - Rotation settings for the image.
 * @property {string} image.rotate.type - Type of rotation (e.g., "rotate").
 * @property {number} image.rotate.degrees - Degrees of rotation.
 * 
 * @property {Object} text - Configuration for the text overlay.
 * @property {string[]} text.textList - List of text strings to overlay.
 * @property {string} text.color - Color of the text.
 * @property {number} text.fontSize - Font size for the text.
 * @property {string} text.fontPath - Path to the font file used.
 * @property {number} text.lineSpace - Space between lines of text.
 * @property {number} text.lineHeight - Height of each text line.
 * @property {number} text.borderWidth - Width of the text border.
 * @property {string} text.borderColor - Border color of the text.
 * @property {number} text.boxWidth - Width of the background box for the text.
 * @property {string} text.boxColor - Background box color for the text.
 * @property {Object} text.enable - Timing configuration for the text.
 * @property {number} text.enable.start - Start time for text display.
 * @property {number} text.enable.end - End time for text display.
 * @property {string} text.position - Position of the text overlay (e.g., "center").
 * @property {Object} text.padding - Padding for text positioning.
 * @property {Object} text.effect - Effects applied to the text (e.g., "fade=in").
 * 
 * @property {Object} effect - Global effects applied to the video.
 * @property {string} effect - Effect name (e.g., "sepia").
 */
const InitValueConfig = {
  width: "-1",
  height: "-1",
  duration: 0,
  frameRate: 30,
  transparent: false,

  crop: false,
  format: "rgba64le",
  forceOriginalAspectRatio: null,

  // Overlay
  overlay: {
    enable: { start: 0, end: 1 },
    padding: { x: 0, y: 0 },
    position: POSITION_ENUM.CENTER,
  },

  // Image
  image: {
    hue: 0,
    round: 0,
    color: "rgba",
    borderWidth: 0,
    borderColor: "0x00FF00@0", // https://www.ffmpeg.org/ffmpeg-all.html#Color
    boxWidth: 0,
    boxColor: "0x00FF00@0",
    perspective: PerspectiveConfig,
    colorchannelmixer: ColorchannelmixerConfig,
    rotate: {
      type: "",
      degrees: 0,
    },
  },

  // Text
  text: {
    textList: "",
    color: "white",
    fontSize: 0,
    fontPath: "",
    lineSpace: 0,
    lineHeight: 0,
    boxWidth: 0,
    boxColor: "0x00FF00@0",
    borderWidth: 0,
    borderColor: "0x00FF00@0",
  },

  // Effects for text and image
  effect: EffectConfig,
};

export {
  RotateConfig,
  FadeConfig,
  ZoomConfig,
  MoveConfig,
  PerspectiveConfig,
  ColorchannelmixerConfig,
  ImageConfig,
  TextConfig,


  InitValueConfig,
};
