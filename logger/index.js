const color = {
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  orange: "\x1b[38;5;208m",
  grey: "\x1b[38;20m",
  white: "\x1b[0m",
};

const resetColor = color.white; // Reset to default color

const Message = (lever, message) => {
  const timestamp = new Date().toISOString();
  let colorCode, colorMess;
  switch (lever) {
    case "INFO": {
      colorCode = color.green;
      colorMess = color.green;
      break;
    }
    case "DEBUG": {
      colorCode = color.blue;
      colorMess = color.white;
      break;
    }
    case "ERROR": {
      colorCode = color.red;
      colorMess = color.red;
      break;
    }
  }
  const toLog = String(message).split(",");
  let mess = message;
  if (toLog.length > 1) {
    mess = "";
    for (var i = 0, len = toLog.length; i < len; i++) {
      mess += toLog[i] + " ";
    }
  }

  const log = `[${color.yellow}${timestamp}] ${colorCode}${lever.toUpperCase()}${colorMess}: ${mess}`
  console.log(log);
  console.log(resetColor)
};

export const Logger = () => {
  console.info = function (...message) {
    Message("INFO", message);
  };

  console.error = function (...message) {
    Message("ERROR", message);
  };

  console.debug = function (...message) {
    Message("DEBUG", message);
  };
};
