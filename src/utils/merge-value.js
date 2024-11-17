import {
  FadeConfig,
  MoveConfig,
  PerspectiveConfig,
  RotateConfig,
  ZoomConfig,
  InitValueConfig,
} from "../config-interfaces.d";
import { isEmpty, isObject } from "../helper";

const mergeEffects = (defaultEffect, providedEffect) => {
  const mergedEffects = {};
  for (let effectType in defaultEffect) {
    const defaultList = defaultEffect[effectType] || [];
    const providedList = providedEffect[effectType] || [];

    mergedEffects[effectType] = providedList.map((providedItem) => {
      switch (effectType) {
        case "fade":
          return { ...FadeConfig, ...providedItem };
        case "rotate":
          return { ...RotateConfig, ...providedItem };
        case "zoom":
          return { ...ZoomConfig, ...providedItem };
        case "perspective":
          return { ...PerspectiveConfig, ...providedItem };
        case "move":
          return { ...MoveConfig, ...providedItem };
        default:
          return providedItem;
      }
    });
  }
  return mergedEffects;
};

const MergeValue = (option = {}, optionDefault) => {
  const valueNew = {};
  optionDefault = isEmpty(optionDefault) ? InitValueConfig : optionDefault;

  for (let key in optionDefault) {
    const defaultValue = optionDefault[key];
    const providedValue = option[key];

    if (key === "effect") {
      valueNew[key] = mergeEffects(defaultValue, providedValue || {});
    }

    // Merge nested objects
    else if (isObject(defaultValue) && isObject(providedValue)) {
      valueNew[key] = { ...defaultValue, ...providedValue };
    }

    // Use provided value if not empty
    else if (!isEmpty(providedValue)) {
      valueNew[key] = providedValue;
    }

    // Fallback to default value
    else {
      valueNew[key] = defaultValue;
    }
  }

  return valueNew;
};

export { MergeValue };
