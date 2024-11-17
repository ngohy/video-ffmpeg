const path = require("path");
const Ffmpeg = require("fluent-ffmpeg");
const { FfmpegTemplate } = require("./template");

const ImageVideo = async (
  imagePath,
  duration,
  frameRate,
  isTransparent = true
) => {
  const loop = (duration * frameRate) / 2;
  const process = Ffmpeg()
    .input(imagePath)
    .loop(duration)
    .complexFilter([`loop=loop=${loop}:size=1:start=0`])
    .fps(frameRate)
    .videoCodec(isTransparent ? "qtrle" : "libx264")
    .addOutputOption(["-pix_fmt argb"]);

  return FfmpegTemplate({
    ffmpegCommand: process,
    fileName: "image-to-video",
    extensionFile: "mov",
    timeOut: 400000,
  });
};



module.exports = {
  ImageVideo,
  MergeMultipleImageVideo,
};
