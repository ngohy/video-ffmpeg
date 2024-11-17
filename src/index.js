import ffmpeg from "fluent-ffmpeg";
import { DATA_PATH } from "./constant";
import { SetCudaSupport } from "./utils/ffmpeg-util";
import { GetPathFiles } from "./utils/file-system-util";
import { SetBackGroundPath, SetCurrentOrderFile, SetPathImgTransparent } from "./utils";

import ffmpeg_binary_static from "ffmpeg-static";
import ffprobe_binary_static from "@ffprobe-installer/ffprobe";

ffmpeg.setFfmpegPath(ffmpeg_binary_static);
ffmpeg.setFfprobePath(ffprobe_binary_static.path);
// ffmpeg.setFlvtoolPath();

export const FnFfmpeg = async ({ currentOrderFile = 0 }) => {
  console.info("path binary ffmpeg", ffmpeg_binary_static);
  
  await SetCudaSupport();
  SetCurrentOrderFile(currentOrderFile);

  //Get resource file
  const {
    OUTPUT_DIR_TEMP,
    SOURCES_AUDIO,
    SOURCES_FONT,
    SOURCES_IMAGE,
    SOURCES_INTRO,
    SOURCES_OUTRO,
    SOURCES_PARTICLE,
    SOURCES_LAYER,
    SOURCES_BACKGROUND,
    SOURCES_IMAGE_BACKGROUND_TRANSPARENT,
  } = DATA_PATH({});

  //set path temporary folder
  SetPathFolderTmp({ folderTmp: OUTPUT_DIR_TEMP });

  
  //get all resource from folder
  const layerPaths = await GetPathFiles(SOURCES_FONT);
  const fontPaths = await GetPathFiles(SOURCES_LAYER);
  const audioPaths = await GetPathFiles(SOURCES_AUDIO);
  const backgroundPaths = await GetPathFiles(SOURCES_BACKGROUND);
  const particlePaths = await GetPathFiles(SOURCES_PARTICLE);
  const introPaths = await GetPathFiles(SOURCES_INTRO);
  const outroPaths = await GetPathFiles(SOURCES_OUTRO);
  const imageBackgroundTransparentPaths = await GetPathFiles(
    SOURCES_IMAGE_BACKGROUND_TRANSPARENT,
  );

  const images = await GetPathFiles(SOURCES_IMAGE);
  
  //set background Path
  SetBackGroundPath(backgroundPaths[0]);
  SetPathImgTransparent(imageBackgroundTransparentPaths[0]);

  return {
    images,
    fontPaths,
    introPaths,
    layerPaths,
    audioPaths,
    outroPaths,
    particlePaths,
    backgroundPaths,
    imageBackgroundTransparentPaths,
  };
};
