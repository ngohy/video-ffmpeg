import Ffmpeg from "fluent-ffmpeg";

let supportCuda = false;
const SetCudaSupport = () => {
  return new Promise((resolve, reject) => {
    Ffmpeg()
      .addOption("-hwaccels")
      .on("start", () => {
        console.log("Checking for CUDA support...");
      })
      .on("stderr", (stderrLine) => {
        if (stderrLine.includes("cuda")) {
          supportCuda = true;
          resolve(true);
        }
      })
      .on("error", (err) => {
        console.log("Error checking CUDA support:", err.message);
        resolve(false);
      })
      .on("end", () => {
        resolve(false);
      })
      .saveToFile(process.platform === 'win32' ? 'NUL' : '/dev/null');
  });
};
const GetSupportCuda = () => supportCuda

const GetMetadata = (path) => {
  try {
    return new Promise((resolve, reject) => {
      if (!path) {
        reject("File is empty");
        return;
      }
      Ffmpeg.ffprobe(path, (err, metadata) => {
        if (err) {
          const mess = `Error getting video metadata: ${err}`;
          console.log(mess);
          reject(mess);
          return;
        }
        resolve(metadata);
      });
    });
  } catch (err) {
    throw err;
  }
};

export {
  SetCudaSupport,
  GetSupportCuda,
  GetMetadata,
};