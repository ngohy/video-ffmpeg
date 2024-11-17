import path from 'path';
const GetEnv = () => process.env?.ENV_TARGET_LOCAL;
const DATA_PATH = ({ pattern, applicationId }) => {
  pattern = pattern.toLowerCase();
  let ROOT_DIR = `/mnt/resources`;
  const prefixDir = `${pattern}/${applicationId || 1}`;
  const preImage = global.image == 1 ? `image-562x750` : `image-no-fade`;

  // mock source in local
  if (GetEnv() === "LOCAL") {
    ROOT_DIR = path.join(__dirname, "../../");
    return {
      ROOT_DIR,
      OUTPUT_DIR_TEMP: path.join(ROOT_DIR, `tmp/${prefixDir}`),
      OUTPUT_DIR_TEMP_IMAGE: path.join(ROOT_DIR, `tmp/${prefixDir}/image`),

      OUTPUT_DIR_TEMP_EFS: path.join(ROOT_DIR, `tmp/efs/${prefixDir}`),

      SOURCES_FONT: path.join(ROOT_DIR, `assets/fonts`),
      SOURCES_AUDIO: path.join(ROOT_DIR, `assets/audios/${pattern}`),
      SOURCES_IMAGE: path.join(ROOT_DIR, `assets/images/${preImage}`),
      SOURCES_IMAGE_BACKGROUND_TRANSPARENT: path.join(ROOT_DIR, `assets/image-background-transparent`),
      SOURCES_BACKGROUND: path.join(ROOT_DIR, `assets/backgrounds/${pattern}`),
      SOURCES_INTRO: path.join(ROOT_DIR, `assets/intros/${pattern}`),
      SOURCES_OUTRO: path.join(ROOT_DIR, `assets/outros/${pattern}`),
      SOURCES_PARTICLE: path.join(ROOT_DIR, `assets/particles/${pattern}`),
      SOURCES_LAYER: path.join(ROOT_DIR, `assets/layers/${pattern}`),
    };
  }

  return {
    ROOT_DIR,

    OUTPUT_DIR_TEMP: `${ROOT_DIR}/tmp/${prefixDir}`,
    OUTPUT_DIR_TEMP_IMAGE: `${ROOT_DIR}/tmp/${prefixDir}/image`,

    // test save into store lambda after save in store efs
    // OUTPUT_DIR_TEMP: `tmp/${prefixDir}`,
    // OUTPUT_DIR_TEMP_IMAGE: `tmp/${prefixDir}/image`,
    OUTPUT_DIR_TEMP_EFS: `${ROOT_DIR}/tmp/${prefixDir}`,

    SOURCES_AUDIO: `${ROOT_DIR}/${pattern}/audios`,
    SOURCES_FONT: `${ROOT_DIR}/${pattern}/fonts`,
    SOURCES_IMAGE: `${ROOT_DIR}/${prefixDir}/images`,
    SOURCES_BACKGROUND: `${ROOT_DIR}/${pattern}/backgrounds`,
    SOURCES_IMAGE_BACKGROUND_TRANSPARENT: `${ROOT_DIR}/${pattern}/image-background-transparent`,
    SOURCES_INTRO: `${ROOT_DIR}/${pattern}/intros`,
    SOURCES_PARTICLE: `${ROOT_DIR}/${pattern}/particles`,
    SOURCES_OUTRO: `${ROOT_DIR}/${pattern}/outros`,
    SOURCES_LAYER: `${ROOT_DIR}/${pattern}/layers`,
  };
};

export { GetEnv, DATA_PATH };
