import ffmpeg from "fluent-ffmpeg";
import { v4 as uuid } from "uuid";
import { BaseUtil, MergeValue } from "../../utils";
import { FfmpegProcessTemplate } from "..";
import {
  ColorchannelmixerConfig,
  PerspectiveConfig,
} from "../../config-interfaces";
import {
  FilterPad,
  FilterPerspective,
  FilterRotate,
  FilterScale,
  FilterColorChannelMixer,
} from "../filters";

class ImageHandleFfmpeg {
  option = {};
  inputPath = "";
  complexFilter = [];

  constructor({ inputPath, option }) {
    this.inputPath = inputPath;
    this.option = MergeValue(option);
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

  addComplexFilter(string) {
    this.complexFilter.push(string);
  }

  getComplexFilter() {
    return this.complexFilter;
  }

  addColorChannelMixer(inputTag) {
    const { colorchannelmixer: clm } = this.option;
    if (!clm.colorchannelmixer) return inputTag;
    const {filter, outputTag} = FilterColorChannelMixer(inputTag, clm)
    this.complexFilter.push(filter);
    return outputTag;
  }

  addPad(inputTag) {
    const { borderW } = this.option;
    if (!borderW) return inputTag;
    const { filter, outputTag } = FilterPad(inputTag, this.option);
    this.addComplexFilter(filter);
    return outputTag;
  }

  addHue(inputTag) {
    const outputTag = `hue-${uuid()}`;
    const { hue } = this.option;
    if (!hue) return inputTag;
    const stringHue = `[${inputTag}]hue=b=${hue}[${outputTag}]`;
    this.addComplexFilter(stringHue);
    return outputTag;
  }

  addPerspective(inputTag) {
    const perspective = this.option.perspective;
    if (!perspective.perspective) return inputTag;
    const { filter, outputTag } = FilterPerspective(
      inputTag,
      this.option.perspective,
    );
    this.addComplexFilter(filter);
    return outputTag;
  }

  addRound(inputTag) {
    const outputTag = `round-${uuid()}`;
    const { round } = this.option;
    if (!round) return inputTag;
    const string = `[${inputTag}]geq=lum='p(X,Y)':a='if(gt(abs(W/2-X),W/2-${round})*gt(abs(H/2-Y),H/2-${round}),if(lte(hypot(${round}-(W/2-abs(W/2-X)),${round}-(H/2-abs(H/2-Y))),${round}),255,0),255)'[${outputTag}]`;
    this.addComplexFilter(string);
    return outputTag;
  }

  addRotate(inputTag) {
    const { rotate } = this.option;
    const { type, degrees } = rotate;
    if (!type || !degrees) return inputTag;
    const { filter, outputTag } = FilterRotate(inputTag, rotate);
    this.addComplexFilter(filter);
    return outputTag;
  }

  addScale(inputTag) {
    const { filter, outputTag } = FilterScale(inputTag, this.option);
    this.addComplexFilter(filter);
    return outputTag;
  }

  async handle() {
    //reset array complexFilter;
    this.complexFilter = [];
    await this.initialize();

    let inputTag = "0:v";
    inputTag = this.addColorChannelMixer(inputTag);
    inputTag = this.addHue(inputTag);
    inputTag = this.addPad(inputTag);
    inputTag = this.addPerspective(inputTag);
    inputTag = this.addRound(inputTag);
    inputTag = this.addRotate(inputTag);
    inputTag = this.addScale(inputTag);

    const process = ffmpeg(imagePath)
      .complexFilter([...this.getComplexFilter()])
      .outputOptions(["-frames:v 1", `-map [${inputTag}]`]);

    return FfmpegProcessTemplate({
      ffmpegCommand: process,
      fileName: "handle-image",
      extensionFile: "png",
      maxRetries: 0,
    });
  }

  async toVideo() {

  }
}

const ImageHandleFfmpegInstance = new ImageHandleFfmpeg();
export {
  ImageHandleFfmpeg as ImageHandleFfmpegClass,
  ImageHandleFfmpegInstance as ImageHandleFfmpeg,
};
