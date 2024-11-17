import { GetMetadata } from "./ffmpeg-util";

const CreateVariableGlobal = async ({
  backgroundPath,
  fontPath,
  indexFile,
  ...paramPaths
}) => {
  global.Path = { ...global.Path, ...paramPaths };
  global.index = indexFile ?? 0;

  // create path font global
  if (fontPath) {
    global.initFont = fontPath;
  }

  //size of background
  if (backgroundPath) {
    const { width, height } = await GetSize(backgroundPath);
    global.sizeBg = { width, height };
  }
};

const GetRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const GetInformation = async (pathFile) => {
  if (!pathFile) throw new Error(`Missing file, Get size failed ! ${pathFile}`);
  const metadata = await GetMetadata(pathFile);
  // loop through all streams to find the video stream
  const videoStream = metadata.streams.find((stream) => stream.width && stream.height);
  if (!videoStream) {
    throw new Error("No video stream found in the file.");
  }

  return {
    ...metadata,
    width: Number(videoStream.width),
    height: Number(videoStream.height),
    duration: metadata.format.duration,
  };
};

const CheckExtensionImage = (pathFile) => {
  return /\.(jpg|jpeg|png|gif)$/i.test(pathFile);
};

const ConvertToSeconds = (time, isLog = false) => {
  let match;

  const delimiters = [":", "."];
  const delimiter = delimiters.find((d) => time.includes(d));

  if (delimiter) {
    match = time.split(delimiter);
  } else {
    return time;
  }

  const minutes = match[0] ? Number(match[0]) : 0;
  const seconds = match[1] ? Number(match[1]) : 0;
  const result = minutes * 60 + seconds;

  isLog && console.log("time", result);
  return Number(result);
};

/**
 * Calculates the size.
 *
 * @param {string} type - The type of animation (e.g., PAN_LEFT, PAN_RIGHT, PAN_UP, PAN_DOWN).
 * @param {number} width - The width.
 * @param {number} height - The height.
 * @param {{ x: number, y: number }} [padding={ x: 0, y: 0 }] - The padding to be applied to the overlay.
 * @returns {{ width: number, height: number }} - The calculated width and height.
 */
const GetSizeOverlay = (type, width, height, padding = { x: 0, y: 0 }) => {
  const { x, y } = padding;
  switch (type?.toUpperCase()) {
    case ANIMATION_ENUM.PAN_LEFT:
    case ANIMATION_ENUM.PAN_RIGHT: {
      return {
        width: width,
        height: height - y,
      };
    }
    case ANIMATION_ENUM.PAN_UP:
    case ANIMATION_ENUM.PAN_DOWN: {
      return {
        width: width - x,
        height: -1,
      };
    }
    default:
      return {
        width,
        height,
      };
  }
};

/**
 * Get scale size of an overlay image to fit within a maximum width and height of a background image.
 *
 * @param width
 * @param height
 * @param maxWidth
 * @param maxHeight
 * @returns {{width: number, height: number}}
 */
const GetScaleSize = (width, height, maxWidth, maxHeight) => {
  let scaleHeight = maxHeight;
  let scaleWidth = scaleHeight * (width / height);
  if (scaleWidth > maxWidth) {
    scaleWidth = maxWidth;
    scaleHeight = scaleWidth * (height / width);
  }
  return {width: scaleWidth, height: scaleHeight};
};

// Wait for a certain time in milliseconds
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// check file existence
// Make sure the image is saved before moving on (maximum: wait for 1 second)
const CheckFileExist = async (filePath, maxWaitTime = 1000) => {
  let waitingTime = 0;
  while (waitingTime < maxWaitTime) {
    if (existsSync(filePath)) {
      try {
        const {width, height} = await GetSize(filePath);
        if (width > 0 && height > 0) {
          return true;
        }
      } catch (e) {
        // Just skip the error
      }
    }

    waitingTime += 100;
    await sleep(100);
  }
  return false;
}

export {
  GetInformation,
  GetScaleSize,
  GetSizeOverlay,
  
  ConvertToSeconds,
  GetRandomIntInclusive,
  CreateVariableGlobal,
  
  CheckFileExist,
  CheckExtensionImage,
};
