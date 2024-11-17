import ffmpeg from "fluent-ffmpeg";
import { FfmpegProcessTemplate } from "..";

const initOption = {
  start: 0,
  duration: 1,
  width: 1280,
  height: 720,
  isTransparent: false,
};

export const CutVideo = ({ videoPath, option = initOption }) => {
  const {
    start,
    duration,
    width: opW,
    height: opH,
    isTransparent,
  } = { ...initOption, ...option };

  const process = ffmpeg(videoPath)
    .setStartTime(start)
    .complexFilter([`scale=${opW}:${opH},setsar=1:1`])
    .videoCodec(isTransparent ? "png" : "libx264")
    .duration(duration)
    .addOutputOptions(["-pix_fmt argb"]);

  return FfmpegProcessTemplate({
    ffmpegCommand: process,
    fileName: "cut-video",
    fileExtension: isTransparent ? "mov" : "mp4",
  });
};
