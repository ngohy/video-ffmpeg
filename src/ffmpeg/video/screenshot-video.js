import Ffmpeg from "fluent-ffmpeg";
import { FfmpegProcessTemplate } from "..";

export const ScreenShotVideo = ({
  videoPath,
  time = 0,
  isTransparent = false,
}) => {
  const process = Ffmpeg()
    .input(videoPath)
    .seekInput(time)
    .videoCodec(isTransparent ? "qtrle" : "libx264")
    .outputOptions(["-f image2", "-f rawvideo", "-frames:v 1", "-vframes 1"]);

  return FfmpegProcessTemplate({
    ffmpegCommand: process,
    fileName: "video-to-image",
    fileExtension: "png",
  });
};
