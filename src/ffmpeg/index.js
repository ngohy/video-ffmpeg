import os from "os";
import Ffmpeg from "fluent-ffmpeg";
import { performance } from "perf_hooks";
import { BaseUtil } from "../utils/index";
import { DeleteFiles } from "../utils/file-system-util";

export const FfmpegProcessTemplate = ({
  ffmpegCommand = new Ffmpeg(),
  fileName = "",
  fileExtension = "mov",
  orderFile = 0,
  fileDeletes = [],
  maxRetries = 0,
  timeOut = 20000000,
  mergeToFile = false, // Merge multiple videos into one
  outputOptions = [], //output option
  logProcess = false, // Log progress if needed when run ffmpeg
}) => {
  const startTime = performance.now();
  const threads = os.cpus().length || 1;
  const inputPath = ffmpegCommand._inputs?.[0]?.source;
  const outputPath = GeneratePath(fileName, fileExtension, orderFile);
  if (!inputPath) throw new Error("No input path provided to ffmpegCommand.");

  const isImageOutput = BaseUtil.CheckExtensionImage(outputPath);
  const isImageInput = BaseUtil.CheckExtensionImage(inputPath);
  const useCuda = BaseUtil.GetSupportCuda();

  //TODO app option cuda
  // !useCuda && !isImageInput ? "-hwaccel cuda" : null,
  const addOptionsSet = new Set(["-loglevel error"].filter(Boolean));

  // Custom Set for output options
  const outputOptionsSet = new Set(
    [
      `-thread_queue_size 4096`,
      `-max_muxing_queue_size 8192`,
      `-threads ${threads}`,
      `-preset ultrafast`,
      ...outputOptions,
    ].filter(Boolean),
  );

  const processFfmpeg = (retries) => {
    return new Promise((resolve, reject) => {
      try {
        let processStarted = false;
        const ffmpegProcess = ffmpegCommand
          .addInputOptions([...addOptionsSet])
          .addOutputOptions([...outputOptionsSet]);

        // Choose to merge or save the output
        if (mergeToFile) {
          ffmpegProcess.mergeToFile(outputPath);
        } else if (isImageOutput) {
          ffmpegProcess.output(outputPath);
        } else {
          ffmpegProcess.save(outputPath);
        }

        ffmpegProcess
          .on("start", (command) => {
            processStarted = true;
            console.info(`FFmpeg process ${fileName} started`);
            console.debug("FFmpeg command: ", command);
          })
          .on("progress", (progress) => {
            if (logProcess) {
              console.debug("ffmpeg process:", JSON.stringify(progress));
            }
          })
          .on("error", (err, stdout, stderr) => {
            console.error("FFmpeg stdout:\n" + stdout);
            console.error("FFmpeg stderr:\n" + stderr);
            if (maxRetries <= 0 || retries <= 0) {
              console.error("FFmpeg process fail: ", fileName);
              reject(`FFmpeg process failed: ${err.message}`);
              return;
            }
            const retrying = `${maxRetries - retries + 1}/${maxRetries}`;
            console.info(`Retrying... (${retrying})`);
            resolve(processFfmpeg(retries - 1));
          });

        const timeoutId = setTimeout(() => {
          if (processStarted) {
            ffmpegProcess.kill("SIGKILL");
            reject(`FFmpeg process timed out`);
          }
        }, timeOut);

        ffmpegProcess.on("end", () => {
          clearTimeout(timeoutId);

          //delete file if it exists
          fileDeletes.length ? DeleteFiles(fileDeletes) : null;

          //logger name file running finished
          !ordinalNumber ? console.info(`FFmpeg ${fileName} finished!`) : null;

          //logger total time run process
          const secondsTime = Math.floor(((performance.now() - startTime) / 1000) % 60);
          secondsTime > 10 && console.info(`Time: ${secondsTime} seconds`);

          resolve(outputPath);
        });

        if (isImageOutput) {
          ffmpegProcess.run();
        }
      } catch (err) {
        console.error("FFmpeg process fail: ", fileName);
        console.error("Ffmpeg error: ", err);
        reject("Ffmpeg error: ", err);
        throw err;
      }
    });
  };

  return processFfmpeg(maxRetries);
};
