const ffmpeg = require("fluent-ffmpeg");
import { BaseUtil } from "../../utils";
import { FfmpegProcessTemplate } from "..";
import { ImageVideo } from "./image-to-video";
import { ENUM, POSITION } from "../../constant";

const initOption = {
  pos: ENUM.POSITION_ENUM.CENTER,
  padding: { x: 0, y: 0 },
  width: 0,
  height: 0,
  duration: 0,
  frameRate: 30,
  isTransparent: false,
};

const OverLayVideo = async ({
  overlayPath,
  backgroundPath,
  option = initOption,
}) => {
  const { width, height, isTransparent, duration, frameRate, pos, padding } = {
    ...initOption,
    ...option,
  };
  const { x, y } = POSITION.PositionOverlay(pos, padding);

  if (BaseUtil.CheckExtensionImage(backgroundPath)) {
    backgroundPath = await ImageVideo(backgroundPath, duration, frameRate);
  }

  const process = ffmpeg()
    .input(backgroundPath)
    .input(overlayPath)
    .complexFilter([
      `[0:v]overlay=${x}:${y}:format=auto[overlay]`,
      `[overlay]scale='${width}:${height}',setsar=1:1`,
    ])
    .videoCodec(isTransparent ? "png" : "h264");

  return FfmpegProcessTemplate({
    ffmpegCommand: process,
    fileName: "overlay-video",
    fileExtension: "mov",
  });
};

const OverlayMultipleVideo = async (
  overlayPaths,
  backgroundPath,
  complexFilter,
  option = initOption,
) => {
  const { width, height } = { ...initOption, ...option };

  const process = ffmpeg().input(backgroundPath);
  overlayPaths.map((item) => {
    process.input(item);
    if (BaseUtil.CheckExtensionImage(item)) process.inputOptions(["-loop 1"]);
  });

  process
    .complexFilter(complexFilter)
    .videoCodec("libx264")
    .addOutputOptions([
      "-pix_fmt yuv420p",
      "-profile:v main",
      "-level:v 4.1",
      "-crf 20",
      `-s:v ${width}x${height}`,
    ]);

  return FfmpegProcessTemplate({
    ffmpegCommand: process,
    fileName: "overlay-multiple-video",
    fileExtension: "mov",
  });
};

export { OverLayVideo, OverlayMultipleVideo };
