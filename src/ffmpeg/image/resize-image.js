import ffmpeg from "fluent-ffmpeg";
import { FfmpegProcessTemplate } from "..";
import { BaseUtil } from "../../utils";

export const ResizeImage = async ({
  imagePath = "",
  width = 1000,
  height = 750,
  isCrop = true,
}) => {
  const { width: imageW, height: imageH } = await BaseUtil.GetSize(imagePath);
  let w = width || 1000;
  let h = height || 750;
  if (!width || !height) {
    if (imageH > imageW) {
      w = 562;
      h = 750;
    }
  }

  const process = ffmpeg()
    .input(imagePath)
    .complexFilter([
      isCrop
        ? `scale=${w}:${h}:force_original_aspect_ratio=increase,setsar=1:1,crop=${w}:${h}`
        : `scale=${w}:${h}`,
    ]);

  return FfmpegProcessTemplate({
    ffmpegCommand: process,
    fileName: "resize-image",
    fileExtension: "png",
  });
};
