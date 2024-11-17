import fs from "fs";
import path from "path";
import { BaseUtil } from ".";
import { SetCurrentOrderFile } from "./base-util";

let PATH = { OUTPUT_DIR_TEMP: "" };
const GetPathFolderTmp = () => PATH;
const SetPathFolderTmp = ({ folderTmp, ...params }) => {
  PATH = { ...PATH, ...params, OUTPUT_DIR_TEMP: folderTmp };
};

const CreatePaths = async (arrPath, isDelete = true) => {
  for (const path of arrPath) {
    if (fs.existsSync(path) && isDelete) {
      fs.rmSync(path, { recursive: true, force: true });
    }
    fs.mkdirSync(path, { recursive: true });
  }
};

const DeletePaths = async (arrPath) => {
  if (!arrPath.length) {
    console.error("List path empty, can not delete!");
    return;
  }
  arrPath.map((path) => {
    if (fs.existsSync(path)) {
      fs.rmSync(path, { recursive: true });
    }
  });
};

const DeleteFiles = async (arrFile) => {
  try {
    if (arrFile.length) {
      for (let file of arrFile) {
        fs.unlinkSync(file);
      }
    }
    return [];
  } catch (err) {}
};

const GetPathFiles = async (FOLDER) => {
  try {
    if (!FOLDER) throw new Error("Folder missing!");
    const nameFolder = FOLDER.split("/").slice(-2).join("-");
    if (fs.existsSync(FOLDER)) {
      const files = fs.readdirSync(FOLDER);
      return files.map((file) => {
        const pathFile = path.join(FOLDER, file);
        fs.stat(pathFile, (err, info) => {
          if (err) throw new Error("Can't read file!");
          const fileName = path.basename(pathFile);
          console.log(`source ${nameFolder}=> file: ${fileName}=> size: ${info?.size || 0} bytes`);
        });
        return pathFile;
      });
    }
    console.log(`source ${nameFolder} empty`);
    return null;
  } catch (err) {
    console.log("Error get path file:", err);
  }
};

const CopyFileSync = async (srcPath, destPath) => {
  try {
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true });
    }
    fs.copyFileSync(srcPath, destPath);
    return destPath;
  } catch (err) {
    console.error("Error copying file:", err);
    throw err;
  }
};

const GeneratePath = ({
  folder = "",
  fileName = "",
  fileExtension = "mov",
  orderFile = 0,
}) => {
  const currentOrderFile = BaseUtil.GetCurrentOrderFile();

  folder = folder || PATH,OUTPUT_DIR_TEMP;

  const time = Number(new Date().getTime());
  const paddedIndex = currentOrderFile.toString().padStart(4, "0");

  SetCurrentOrderFile(currentOrderFile + 1);
  return path.join(
    folder,
    `${[paddedIndex, time, orderFile, fileName].join("-")}.${fileExtension}`,
  );
};

const WriteToFile = async (filePath, content) => {
  try {
    fs.writeFile(filePath, content, "utf8", (err) => {
      if (err) throw new Error("Error writing to file!");
    });
  } catch (err) {
    console.log("Error Can not write to file:", err);
  }
};

const GetInfoFiles = async (files) => {
  try {
    if (!files.length) console.log("Missing files, get information!");
    files.map((file) => {
      const fileName = path.basename(file);
      fs.stat(file, (err, info) => {
        console.log(`file: ${fileName} => size: ${info?.size || 0} bytes`);
      });
    });
  } catch (err) {
    console.log("Error get path file:", err);
  }
};

/**
 * move folder to another folder
 *
 * @param {*} destinationPath
 * @param {*} localPath
 * @returns string root folder in efs store
 */
const MoveFolder = async (destinationPath, localPath) => {
  const startTime = performance.now();
  const { OUTPUT_DIR_TEMP_EFS, OUTPUT_DIR_TEMP } = global.Path;

  destinationPath = destinationPath || OUTPUT_DIR_TEMP_EFS;

  //create folder if it is not exist
  await CreatePaths([destinationPath], false);

  const files = await GetPathFiles(localPath || OUTPUT_DIR_TEMP);
  const tasks = files
    .filter((srcPath) => !fs.lstatSync(srcPath).isDirectory())
    .map((srcPath) => {
      const baseName = path.basename(srcPath);
      const destPath = path.join(destinationPath, baseName);

      // Check if the file exists in the destination and delete if it exists
      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true });
      }

      // Copy the file to the destination and return the task
      return CopyFileSync(srcPath, destPath);
    });

  await Promise.all(tasks);
  const endTime = performance.now();
  console.info(`Time move folder: ${endTime - startTime} milliseconds`);
};

export {
  CreatePaths,
  DeletePaths,
  GeneratePath,
  DeleteFiles,
  GetPathFiles,
  WriteToFile,
  GetInfoFiles,
  MoveFolder,
  CopyFileSync,

  SetPathFolderTmp,
  GetPathFolderTmp
};
