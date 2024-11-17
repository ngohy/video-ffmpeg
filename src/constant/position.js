import { ENUM } from "./enum";
const { POSITION_ENUM } = ENUM;

const FormatPadding = (value, type) => {
  if (!type) {
    console.log("Missing type of position!");
    return;
  }

  const valuePadding = value ? `${value > 0 ? "+" : ""}${value}` : "";

  switch (type.toUpperCase()) {
    case POSITION_ENUM.CENTER:
      return valuePadding;
    case POSITION_ENUM.RIGHT_CENTER:
      return valuePadding ? `-${valuePadding}` : "";
    default:
      return valuePadding;
  }
};

const PositionText = (
  position = POSITION_ENUM.CENTER,
  padding = { x: 0, y: 0 },
) => {
  const { x, y } = padding;
  const pdX = FormatPadding(x);
  const pdY = FormatPadding(y);

  switch (position.toUpperCase()) {
    case POSITION_ENUM.TOP_LEFT: {
      return { x, y };
    }
    case POSITION_ENUM.TOP_CENTER: {
      return {
        x: `(w-text_w)/2${pdX}`,
        y: y,
      };
    }
    case POSITION_ENUM.TOP_RIGHT: {
      return {
        x: `w-text_w${pdX}`,
        y: y,
      };
    }
    case POSITION_ENUM.CENTER: {
      return {
        x: `(w-text_w)/2${pdX}`,
        y: `(h-text_h)/2${pdY}`,
      };
    }
    case POSITION_ENUM.BOTTOM_LEFT: {
      return {
        x: x,
        y: `h-text_h${pdY}`,
      };
    }
    case POSITION_ENUM.BOTTOM_CENTER: {
      return {
        x: `(w-text_w)/2${pdX}`,
        y: `h-text_h${pdY}`,
      };
    }
    case POSITION_ENUM.BOTTOM_RIGHT: {
      return {
        x: `w-text_w${pdX}`,
        y: `h-text_h${pdY}`,
      };
    }
    case POSITION_ENUM.RIGHT_CENTER: {
      return {
        x: `w-text_w${pdX}`,
        y: `(h-text_h)/2${pdY}`,
      };
    }
    case POSITION_ENUM.LEFT_CENTER: {
      return {
        x: x,
        y: `(h-text_h)/2${pdY}`,
      };
    }
    default:
      throw new Error("Invalid position type");
  }
};

const PositionOverlay = (
  position = POSITION_ENUM.CENTER,
  padding = { x: 0, y: 0 },
) => {
  const { x, y } = padding;
  const pdX = FormatPadding(x);
  const pdY = FormatPadding(y);

  switch (position.toUpperCase()) {
    case POSITION_ENUM.TOP_LEFT: {
      return {
        x: x,
        y: y,
      };
    }
    case POSITION_ENUM.TOP_CENTER: {
      return {
        x: `(main_w-overlay_w)/2${pdX}`,
        y: y,
      };
    }
    case POSITION_ENUM.TOP_RIGHT: {
      return {
        x: `(main_w-overlay_w)${pdX}`,
        y: y,
      };
    }
    case POSITION_ENUM.CENTER: {
      return {
        x: `(main_w-overlay_w)/2${pdX}`,
        y: `(main_h-overlay_h)/2${pdY}`,
      };
    }
    case POSITION_ENUM.BOTTOM_LEFT: {
      return {
        x: x,
        y: `(main_h-overlay_h)${pdY}`,
      };
    }
    case POSITION_ENUM.BOTTOM_CENTER: {
      return {
        x: `(main_w-overlay_w)/2${pdX}`,
        y: `(main_h-overlay_h)${pdY}`,
      };
    }
    case POSITION_ENUM.BOTTOM_RIGHT: {
      return {
        x: `(main_w-overlay_w)${pdX}`,
        y: `(main_h-overlay_h)${pdY}`,
      };
    }
    case POSITION_ENUM.RIGHT_CENTER: {
      return {
        x: `(main_w-overlay_w)${pdX}`,
        y: `(main_h-overlay_h)/2${pdY}`,
      };
    }
    case POSITION_ENUM.LEFT_CENTER: {
      return {
        x: x,
        y: `(main_h-overlay_h)/2${pdY}`,
      };
    }
    default:
      throw new Error("Invalid position type");
  }
};

export const POSITION = { PositionText, PositionOverlay, FormatPadding };
