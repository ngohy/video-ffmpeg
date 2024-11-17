const { FfmpegProcessTemplate } = require("..");
const { BaseUtil } = require("../../utils");

const MusicVideo = async ({
  musicPath,
  videoPath,
  delay = 0,
  volumeFactor = 1,
  enable = { start: 0, end: 0 },
}) => {
  const timeVideo = await BaseUtil.GetDuration(videoPath);
  const durationAudio = await BaseUtil.GetDuration(musicPath);

  const duration =
    enable?.start && enable?.end
      ? Math.ceil(enable.end - enable.start)
      : Math.min(timeVideo, durationAudio);

  const process = Ffmpeg()
    .input(musicPath)
    .input(videoPath)
    .complexFilter([
      `[0:a]adelay=${delay * 1000}|${delay * 1000},volume=${volumeFactor}[a]`,
    ])
    .setStartTime(enable?.start || 0)
    .duration(duration)
    .outputOptions([
      "-map 1:v",
      "-map [a]",
      "-c:a aac",
      "-c:v h264",
      "-pix_fmt yuv420p",
      "-strict experimental",
    ]);

  return FfmpegProcessTemplate({
    ffmpegCommand: process,
    fileName: "music",
    fileExtension: "mp4",
  });
};

module.exports = { MusicVideo };
