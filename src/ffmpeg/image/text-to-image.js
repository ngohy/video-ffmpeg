import ffmpeg from "fluent-ffmpeg";
import { FfmpegProcessTemplate } from "..";
import { TextConfig } from "../../config-interfaces";
import { POSITION } from "../../constant";
import { MOVE_ENUM } from "../../constant/enum/move-enum";
import { BaseUtil } from "../../utils";

const initOption = {
  ...TextConfig,
  width: 0,
  height: 0,
};

const TextToImage = async (
  text = [""],
  imagePath,
  option = initOption
) => {
  let { width: opW, height: opH } = { ...initOption, ...option };
  const { width, height } = global.sizeBg;

  if (!opW && !opH) {
    opW = width;
    opH = height;
  } else {
    opW ||= Math.ceil(opH * (width / height));
    opH ||= Math.ceil(opW * (height / width));
  }

  const renderText = RenderText({
    ...option,
    text: text,
    inputs: "bg",
  });

  let complexFilter = `crop=w=1:h=1:x=0:y=0[cropped];color=c=black@0.0:s=${opW}x${opH}[bg];`;
  renderText.map((item) => {complexFilter += `${item};`});
  complexFilter += `[text_${text.length - 1}][cropped]overlay[final]`;
  const process = ffmpeg(imagePath)
    .complexFilter(`${complexFilter}`)
    .outputOptions(["-frames:v 1", "-map [final]"]);

  return FfmpegProcessTemplate({
    ffmpegCommand: process,
    fileName: "transparency-text",
    fileExtension: "png",
  });
};

const TextMove = async (
  text,
  videoTransparencyPath,
  duration,
  frameRate,
  option = TextConfig
) => {
  const textFile = GeneratePath("text", "txt");

  const content = typeof text === "string" ? text : text.join("\n");
  await BaseUtil.WriteToFile(textFile, content);

  const complexFilterText = RenderText({
    ...option,
    text: [""],
    textFile: textFile,
    duration: duration,
    position: POSITION_ENUM.CENTER,
    inputs: "looped",
  });

  let complexFilter = `[0:v]loop=loop=${duration * frameRate}:size=1:start=0[looped];`;
  complexFilterText.map((item)=> {complexFilter += `${item}`});

  const process = ffmpeg(videoTransparencyPath)
    .complexFilter(`${complexFilter}`)
    .fps(frameRate)
    .duration(duration)
    .videoCodec("prores_ks")
    .outputOptions([
      "-map [final]",
      "-profile:v 4444",
      "-pix_fmt yuva444p10le",
      "-crf 18",
    ])

  return FfmpegTemplate({
    ffmpegCommand: process,
    fileName: "text-move",
    fileExtension: "mov",
    fileDeletes: [textFile, videoTransparencyPath],
    timeOut: 400000,
  });
};

export {
  TextToImage,
  MoveText,
};

/**
 * Renders text with the specified options.
 */
const RenderText = (option = { ...TextConfig, textFile, duration}) => {
  const { fontSize, inputs, text, duration, textFile} = option;

  //TODO fix for video collage
  const pattern = getCurrentPattern();
  const checkVideoCollage = pattern === PATTERN_VIDEO.COLLAGE;

  const len = text.length;
  const optionLineHeight = option?.lineHeight ?? 0;
  const lineHeight = Number(len > 1 ? optionLineHeight : 0);
  const totalTextHeight = fontSize * (len - 1 + (len > (checkVideoCollage ? 2 : 1) ? lineHeight : 0));
  const positionText = { pos: POSITION_ENUM.CENTER, padding: { x: 0, y: 0 }, ...option?.positionText };
  const { pos, padding } = positionText;
  const { x, y } = POSITION.PositionText(pos, padding);

  const PAN = [MOVE_ENUM.PAN_UP, MOVE_ENUM.PAN_DOWN];
  const { panType, speed = 1 } = option?.effect?.pan || {};
  const isPan = panType && PAN.includes(panType);

  const { width, height } = global.sizeBg;
  const pan = isPan
    ? PanComplex(panType, width, height, {
        isTextPan: true,
        padding,
        position: pos,
        enable: [{ start: 0, end: duration, speed }],
      })
    : null;

  const [panPosX, panPosY] = isPan
    ? pan.split(":").slice(3).map((part) => part.split("=")[1])
    : [x, y];

  const optionText = {
    fontfile: option?.fontPath || global.initFont,
    fontsize: fontSize || 0,
    fontcolor: option?.color || "black",
    line_spacing: option?.lineSpace || 1,
    borderw: option?.borderW || 0,
    bordercolor: option?.borderC || "black@0.0",
    box: 0,
    boxcolor: option?.boxC || "black@0.0",
    boxborderw: option?.boxW || 0,
    shadowcolor: "black@0.0",
    shadowx: 0,
    shadowy: 0,
    x: panPosX,
    y: panPosY,
  };

  //remove item is undefined or null
  Object.keys(optionText).forEach((key) => {
    if (!optionText[key]) delete optionText[key];
  });

  const posY =
    pos === POSITION_ENUM.CENTER
      ? `(h-text_h-${totalTextHeight})/2`
      : pos.includes("BOTTOM") || pos.includes("TOP")
      ? `${y} - ${totalTextHeight / 2}`
      : `(h-${totalTextHeight})/2`;

  const startY = `${posY} - ${lineHeight}`;
  const result = [
    createDrawTextString({
      optionText: optionText,
      positionY: isPan ? panPosY : startY,
      text: text[0],
      textFile: textFile,
      inputs: inputs,
      outputs: textFile ? "final" : "text_0",
    }),
  ];

  if (!!textFile) {
    return result;
  }

  if (len > 1) {
    for (let i = 1; i < len; i++) {
      const positionY = `${startY}+${i * fontSize * (lineHeight || 1)}`;
      result.push(
        createDrawTextString({
          optionText: optionText,
          positionY: positionY,
          text: text[i],
          inputs: `text_${i - 1}`,
          outputs: `text_${i}`,
        })
      );
    }
  }

  return result;
};

const createDrawTextString = ({
  optionText,
  positionX,
  positionY,
  text,
  textFile,
  inputs,
  outputs,
}) => {
  const params = {
    ...optionText,
    x: positionX || optionText.x,
    y: positionY || optionText.y,
  };

  if (!textFile) {
    params.text = text.toString();
  } else {
    params.textfile = textFile;
  }

  const string = Object.keys(params)
    .map((key) => `${key}='${params[key]}'`)
    .join(":");

  return `[${inputs}]drawtext=${string}[${outputs}]`;
};
