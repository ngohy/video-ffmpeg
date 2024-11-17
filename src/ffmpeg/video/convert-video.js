import ffmpeg from "fluent-ffmpeg";
import { FfmpegProcessTemplate } from "..";

const initOption = {
  width: 1280,
  height: 720,
  isQuality: false,
  isTransparent: false,
};

export const ConvertVideo = async ({ videoPaths, option = initOption }) => {
  try {
    const { width, height, isQuality, isTransparent } = {
      ...initOption,
      ...option,
    };
    const tasks = videoPaths?.map((videoPath, index) => {
      const process = ffmpeg(videoPath)
        .complexFilter([`scale=${width}:${height}`])
        .videoCodec(isTransparent ? "qtrle" : "libx264")
        .outputOptions([
          "-c:a copy",
          `-crf ${isQuality ? 18 : 29}`,
          `-preset ${isQuality ? "slow" : "veryfast"}`,
        ]);

      return FfmpegProcessTemplate({
        ffmpegCommand: process,
        fileName: "convert-video",
        fileExtension: isTransparent ? "mov" : "mp4",
        orderFile: index,
      });
    });

    return Promise.all(tasks).then((results) => {
      console.info("Convert video Finished!");
      return results;
    });
  } catch (err) {
    console.error("An error happened: " + err);
  }
};
