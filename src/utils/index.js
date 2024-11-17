import * as BaseUtil from "./base-util";
import * as FfmpegUtil from "./ffmpeg-util";
import * as FileSystem from "./file-system-util";
import { MergeValue } from "./merge-value";

let currentOrderFile = 0;
let imgTransparentPath = "";
let backgroundPath = "";

const SetCurrentOrderFile = (OrderFile) => { currentOrderFile = OrderFile };
const SetPathImgTransparent = (path)=>{ imgTransparentPath = path };

const GetCurrentOrderFile = () => currentOrderFile;
const GetPathImgTransparent = ()=> imgTransparentPath;

const SetBackGroundPath = (path) =>  { backgroundPath = path };
const GetBackGroundPath = () => backgroundPath;

export {
  FileSystem,
  BaseUtil,
  FfmpegUtil,
  MergeValue,

  // set value
  SetPathImgTransparent,
  SetCurrentOrderFile,
  SetBackGroundPath,

  // getValue
  GetPathImgTransparent,
  GetCurrentOrderFile,
  GetBackGroundPath,
};
