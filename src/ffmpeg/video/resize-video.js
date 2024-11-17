import ffmpeg from "fluent-ffmpeg";
import { FfmpegProcessTemplate } from "..";

const initOption = {
  width: 1920,
  height: 1080,
  isTransparent: false,
};

export const ResizeVideo = async ({ videoPath, option = initOption }) => {
  try {
    const { width, height, isTransparent } = { ...initOption, ...option };

    const process = ffmpeg(videoPath)
      .complexFilter([`scale=${width}:${height},setsar=1:1`])
      .videoCodec(isTransparent ? "qtrle" : "libx264")
      .outputOptions([]);

    return FfmpegProcessTemplate({
      ffmpegCommand: process,
      fileName: "resize",
      fileExtension: isTransparent ? "mov" : "mp4",
    });
  } catch (err) {
    console.error("Resize video An error happened: " + err);
  }
};
