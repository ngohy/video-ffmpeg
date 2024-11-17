import { Logger } from "./logger/index.js";
Logger(); //custom logger

import dotenv from "dotenv";
dotenv.config();

import { FnFfmpeg } from "./src/index.js";
// const { payload } = require("./src/mock-data");
// const { PATTERN_VIDEO } = require("./src/constant/enum");
// const firstStepFunction = require("../sls/api/generate-video").handler;
// const secondStepFunction = require("../sls/api/generate-video-result").handler;

const Main = () => {
  console.log('start-project', "123");
  FnFfmpeg();
}

// const getEffect = () => {
//   const readline = require("readline").createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   return new Promise((resolve) => {
//     readline.question("Please enter a effect: ", (effect) => {
//       console.info(`You entered: ${effect}`);
//       resolve(effect);
//       readline.close();
//     });
//   });
// };

// const getImage = () => {
//   const readline = require("readline").createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   return new Promise((resolve) => {
//     readline.question("Please enter a images: ", (effect) => {
//       console.info(`You entered: ${effect}`);
//       resolve(effect);
//       readline.close();
//     });
//   });
// };

// const Main = async (effect) => {
//   if (!effect) effect = await getEffect();
//   const version  = {
//     1: PATTERN_VIDEO.CUTE,
//     2: PATTERN_VIDEO.SKY,
//     3: PATTERN_VIDEO.SIMPLE,
//     4: PATTERN_VIDEO.COLLAGE,
//     5: PATTERN_VIDEO.CLASSIC
//   }[effect];

//   global.image = await getImage() || 0;
//   const payloadNew = await firstStepFunction({
//     ...payload,
//     version: version.toLowerCase(),
//     stepFunction: 1,
//   });

//   return {
//     statusCode: 200,
//     body: await secondStepFunction({
//       ...payloadNew,
//     }),
//   };
// };

Main();
