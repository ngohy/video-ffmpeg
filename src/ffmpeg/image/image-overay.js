import ffmpeg from "fluent-ffmpeg";
import { v4 as uuid } from "uuid";
import { BaseUtil } from "../../utils";
import { FfmpegProcessTemplate } from "..";
import { ENUM, POSITION } from "../../constant";

const initOption = {
  image: "",
  width: 1000,
  height: 750,
  position: ENUM.POSITION_ENUM.CENTER,
  padding: { x: 0, y: 0 },
};

class ImageOverLayFfmpeg {
  option = {};
  inputPath = "";
  complexFilter = [];

  constructor({ inputPath, option }) {
    this.inputPath = inputPath;
    this.option = { ...initOption, ...option };
  }

  async initialize({ inputPath }) {
    if (!!inputPath) this.inputPath = inputPath;
    const { width, height } = await BaseUtil.GetInformation(this.inputPath);
    this.option = {
      ...this.option,
      width: this.option.width || width,
      height: this.option.height || height,
    };
  }

  async setOption() {
    this.option = {
      ...this.option,
      width: this.option?.width || width,
      height: this.option?.height || height,
    };
  }

  async overlayImage({ inputPath, inputBackgroundPath, ...params }) {
    if (!inputBackgroundPath) throw new Error("Invalid Input background!");
    await this.initialize({ inputPath, inputBackgroundPath, ...params });
    const { position, padding, width, height } = this.option;
    const { x, y } = POSITION.PositionOverlay(position, padding);

    const process = ffmpeg()
      .input(inputBackgroundPath)
      .input(this.inputPath)
      .complexFilter([
        `[1]scale=${width}:${height}:force_original_aspect_ratio=increase[b]`,
        `[0:v][b]overlay=${x}:${y}`,
      ]);

    return FfmpegProcessTemplate({
      ffmpegCommand: process,
      fileName: "overlay-image",
      fileExtension: "png",
    });
  }

  renderComplexFilter(inputPaths) {
    const len = inputPaths.length - 1;
    const { x, y } = POSITION.PositionOverlay(ENUM.POSITION_ENUM.CENTER);
    const overlay = `overlay=x=${x}:y=${y}`;
    if (len < 1) throw new Error("Image list must contain at least one image");

    const complexFilter = [];
    let outputTag = len === 1 ? "[overlay]" : "[img1]";
    complexFilter.push(`[0][1]${overlay}:format=auto${outputTag}`);
    if (len === 1) return complexFilter;
    for (let i = 1; i < len; i++) {
      const input = `[img${i}][${i + 1}]`;
      const output = i === len - 1 ? "[overlay]" : `[img${i + 1}]`;
      complexFilter.push(`${input}${overlay}:format=auto${output}`);
      outputTag = output;
    }
    return {
      complexFilter,
      outputTag,
    };
  }

  OverlayMultipleImage({ inputPaths, resize = false }) {
    const { width, height } = { ...initOption, ...option };
    let { complexFilter, outputTag } = this.renderComplexFilter(inputPaths);

    if (resize) {
      if (!width || !height) throw new Error("Please input width and height");
      complexFilter.push(
        `${outputTag}scale=${width}:${height}:force_original_aspect_ratio=increase,setsar=1:1,crop=${width}:${height}[out]`,
      );
      outputTag = "[out]";
    }

    const process = ffmpeg();
    imagePaths.map((item) => process.input(item));
    process.complexFilter([...complexFilter]).addOption("-map", outputTag);

    return FfmpegProcessTemplate({
      ffmpegCommand: process,
      fileName: "overlay",
      fileExtension: "png",
    });
  }
}

const ImageOverLayFfmpegInstance = new ImageOverLayFfmpeg();
export {
  ImageOverLayFfmpeg as ImageOverLayFfmpegClass,
  ImageOverLayFfmpegInstance as ImageOverLayFfmpeg,
};
