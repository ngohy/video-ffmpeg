import Ffmpeg from "fluent-ffmpeg";
import { BaseUtil } from "../utils";
import { FfmpegProcessTemplate } from "../ffmpeg";
import { FadeEffectClass } from "./fade";
import { ZoomEffectClass } from "./zoom";
import { MoveEffectClass } from "./move";
import { RotateEffectClass } from "./rotate";


import { ImageVideo } from "../ffmpeg/video/image-to-video";
import { RotateConfig } from "../config-interfaces";

export class effect {
  fades = [];
  moves = [];
  rotates = [];
  zooms = [];


  option= {};
  initOption = {
    width: 1000,
    height: 750,
    duration: 0,
    frameRate: 30,
    timeout: 400000,
    effect: []
  };

  constructor(inputPath, option) {
    this.inputPath = inputPath;
    this.GetSize = BaseUtil.GetSize;
    this.CheckExtensionImage = BaseUtil.CheckExtensionImage;
    this.GetSizeOverlay = BaseUtil.GetSizeOverlay;
    this.option = {...this.initOption, ...option};

    this.fades = this.option.effect.map((item)=>item.fade);
    this.moves = this.option.effect.map((item)=>item.move);
    this.zooms = this.option.effect.map((item)=>item.zoom);
    this.rotates = this.option.effect.map((item)=>item.rotate);
  }

  async Effect() {
    const { frameRate, duration } = this.option;
    const { width: inputW, height: inputH } = await this.GetSize(this.inputPath);
    const isCheckImage = this.CheckExtensionImage(this.inputPath);

    let image = "";
    let input = "";
    let durationFadeOverlay = 0;
    const complexFilterEffect = [];
    const flag = { fadeIn: false, fadeOut: false };
    const base1 = `[0:v]scale=${inputW}:${inputH},settb=1/${frameRate},setpts=N/${frameRate}/TB,fps=${frameRate}[base]`;
    const base2 = `[1:v]scale=${inputW}:${inputH},settb=1/${frameRate},setpts=N/${frameRate}/TB,fps=${frameRate}[overlay]`;
    const base3 = `[2:v]scale=${inputW}:${inputH},settb=1/${frameRate},setpts=N/${frameRate}/TB,fps=${frameRate}[base2]`;
    const scaleFilter = `fps=${frameRate},scale=3500:-1,`;

    const addFadeFilters = () => {
      if (fade?.type) {
        const isCustomFadeIn = fade?.typeIn && fade.typeIn !== FADE_TYPE.IN;
        const isCustomFadeOut = fade?.typeOut && fade.typeOut !== FADE_TYPE.OUT;

        if (isCustomFadeIn || isCustomFadeOut) {
          complexFilter.push(base1, base2);
          if (isCustomFadeIn && isCustomFadeOut) {
            complexFilter.push(base3);
          }
          return "[overlay]";
        } else {
          complexFilter.push(base1);
          return "[base]";
        }
      }
      return "";
    };

    const addPerspectiveFilter = (input) => {
      const perspectiveEffect = { ...PerspectiveEffect, ...perspective };
      if (perspectiveEffect.isUse) {
        delete perspectiveEffect.isUse;
        const output = "[perspective]";
        let formatPerspective = "";
        Object.keys(perspectiveEffect).map((key, index) => {
          const { x, y } = perspectiveEffect[key];
          formatPerspective += index === 0 ? `${x}:${y}` : `:${x}:${y}`;
        });
        const filter = `pad=iw+4:ih+4:2:2:0x00FF00@0,perspective=${formatPerspective}:sense=destination`;
        complexFilter.push(`${input}${filter}${output}`);
        return output;
      }
      return input;
    };

    const addMoveFilter = (input) => {
      if (move?.type) {
        const output = "[paned]";
        const { panType, speed } = pan;
        const enable = pan?.enable || [{ start: 0, end: duration, speed }];
        const panComplexFilter = PanComplex(panType, inputW, inputH, {
          ...pan,
          enable: enable,
        });
        complexFilter.push(
          `${input}${scaleFilter}${panComplexFilter}${output}`,
        );
        return output;
      }
      return input;
    };

    const addZoomFilter = (input) => {
      if (zoom?.zoomType) {
        const output = "[zoomed]";
        const {
          zoomType,
          scale,
          zoomPan,
          zoomEnd = duration,
          zoomStart = 0,
        } = zoom;
        const zoomComplexFilter = ZoomComplex(zoomType, {
          duration,
          frameRate,
          scale: scale >= 1 ? scale : 1.1,
          zoomPan,
          enable: { start: zoomStart, end: zoomEnd },
        });
        const scaleZoom = `:s=${inputW}x${inputH}:fps=${frameRate}`;
        complexFilter.push(
          `${input}${scaleFilter}${zoomComplexFilter}${scaleZoom}${output}`,
        );
        return output;
      }
      return input;
    };

    const addRotateFilter = (inputTag) => {
      if(this.rotates.length < 0) return inputTag;
      let outputTag = '';
      const complexFilter = [];
      this.rotates.map((rotate)=>{
        const rotateEffect = new RotateEffectClass({rotate, frameRate});
        const rotateComplex = rotateEffect.getRotateComplex(inputTag);
        complexFilter.push(rotateComplex.complexFilter);
        outputTag = rotateComplex.inputTag; 
      })
      complexFilterEffect.push(complexFilter);
      return outputTag;
    };

    const addCropFilter = (input) => {
      // Currently, only cropping for rotate effect
      if (rotate?.rotateType) {
        const output = "[cropped]";
        // Add more padding when rotating, we crop the padding now
        // Padding is 100px on each side
        complexFilter.push(
          `${input}crop=w=${inputW}:h=${inputH}:x=100:y=100${output}`,
        );
        return output;
      }
      return input;
    };

    const addFadeFilter = (input, isFadeIn = true) => {
      const fadeType = isFadeIn ? fade?.typeIn : fade?.typeOut;
      const fadeDirection = isFadeIn ? FADE_TYPE.IN : FADE_TYPE.OUT;
  
      if (fadeType) {
        if (fadeType !== fadeDirection) {
          flag[isFadeIn ? "fadeIn" : "fadeOut"] = true;
          image = fade.image;
        }
  
        const { fadeIn, fadeInDuration, fadeOut, fadeOutDuration } = fade;
        const fadeDuration = isFadeIn ? fadeInDuration : fadeOutDuration;
        const fadeData = isFadeIn ? fadeIn : fadeOut;
        const { output, input: fadeInput } = GetTagInOutFade({
          fade,
          type: fadeType,
          tagInput: input,
          isFadeIn,
        });
  
        const fadeComplexFilter = FadeComplex(fadeType, frameRate, {
          [isFadeIn ? "fadeIn" : "fadeOut"]: fadeData,
          [isFadeIn ? "fadeInDuration" : "fadeOutDuration"]: fadeDuration,
        });
  
        complexFilter.push(`${fadeInput}${fadeComplexFilter}${output}`);
        durationFadeOverlay = isFadeIn
          ? fadeInDuration
          : Math.max(durationFadeOverlay, fadeOutDuration);
  
        return output;
      }
      return input;
    };
  
    const addFinalFilter = (input) => {
      const output = "[final]";
      const { width: w, height: h } = GetSizeOverlay(
        pan?.panType,
        opW || width || inputW,
        opH || height || inputH
      );
  
      complexFilter.push(`${input}scale=${w}:${h},setsar=1:1${output}`);
      return output;
    };
  
    input = addFadeFilters();
    input = addPerspectiveFilter(input);
    input = addZoomFilter(input);
    input = addRotateFilter(input);
    input = addCropFilter(input);
    input = addPanFilter(input);
  
    // if (fade?.type) {
    //   const { typeIn, typeOut } = fade;
    //   if (typeIn === FADE_TYPE.IN && typeOut !== FADE_TYPE.OUT) {
    //     input = addFadeFilter(input, false); // fade-out
    //     input = addFadeFilter(input, true);  // fade-in
    //   } else {
    //     input = addFadeFilter(input, true);  // fade-in
    //     input = addFadeFilter(input, false); // fade-out
    //   }
    // }
  
    input = addFinalFilter(input);
  
    const videos = await Promise.all([
      !isCheckImage ? inputPath : ImageVideo(inputPath, duration, frameRate, true),
      image && (flag.fadeIn || flag.fadeOut) ? ImageVideo(image, durationFadeOverlay + 1, frameRate, true) : null,
    ]);
  
    //render process for create effect video
    const process = Ffmpeg();

    //video overlay make xfade in
    if (image && flag.fadeIn) {
      process.addInput(videos[1]);
    }

    //main video
    process.input(videos[0]);

    //video overlay make xfade out
    if (image && flag.fadeOut) {
      process.addInput(videos[1]);
    }

    process
      .complexFilter(complexFilter)
      .videoCodec("prores_ks")
      .fps(frameRate)
      .duration(duration)
      .outputOptions([
        "-map [video]",
        "-profile:v 4444",
        "-pix_fmt yuva444p10le",
        "-vendor apl0",
        "-bits_per_mb 8000",
        "-crf 18",
      ]);

    return FfmpegProcessTemplate({
      ffmpegCommand: process,
      fileName:
        "effect-" +
        (move?.type || rotate?.type || zoom?.type || "fade").toLowerCase(),
      fileExtension: "mov",
      timeOut: timeout,
      fileDeletes: [...videos],
    });
  }
}
