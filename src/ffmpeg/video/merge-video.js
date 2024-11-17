import ffmpeg from "fluent-ffmpeg";
import { FfmpegProcessTemplate } from "..";

const initOption = {
  duration: 0,
  frameRate: 30,
  isTransparent: false,
};

const MergeVideo = ({ videoPaths, option = initOption }) => {
  const { duration, frameRate, isTransparent } = { ...initOption, ...option };

  const process = ffmpeg();
  videoPaths.map((path) => process.input(path));
  process
    .fps(frameRate)
    .duration(duration)
    .videoCodec(isTransparent ? "qtrle" : "libx264")
    .outputOptions(["-pix_fmt argb"]);

  return FfmpegProcessTemplate({
    ffmpegCommand: process,
    fileName: "merge-video",
    fileExtension: "mov",
    mergeToFile: true,
  });
};

const MergeMultipleImageVideo = ({
  frameRate = 30,
  duration = 0,
  framesFile = "frame-%04d.png",
  isTransparent = false,
}) => {
  const { OUTPUT_DIR_TEMP_IMAGE } = global.Path;
  const framesFilepath = path.join(OUTPUT_DIR_TEMP_IMAGE, `/${framesFile}`);

  const process = ffmpeg()
    .input(framesFilepath)
    .inputOptions([`-framerate ${frameRate}`])
    .fps(frameRate)
    .duration(duration)
    .videoCodec(isTransparent ? "qtrle" : "libx264")
    .outputOptions(["-pix_fmt argb"]);

  return FfmpegProcessTemplate({
    ffmpegCommand: process,
    fileName: `merge-multiple-image-to-video`,
    fileExtension: "mov",
  });
};

export { MergeVideo, MergeMultipleImageVideo };
