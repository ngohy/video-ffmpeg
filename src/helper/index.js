/**
 * Checks if a value is a non-null object.
 * Ensure the value is of type object and not null or an array.
 * 
 * @param {*} value - The value to check.
 * @returns {boolean} - `true` if the value is a non-null object, `false` otherwise.
 */
const isObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

/**
 * Helper to check if an element is empty (array or object)
 *
 * @param {*} elem
 * @returns boolean
 */
const isEmpty = (elem) => {
  if (Array.isArray(elem)) {
    return !elem.length;
  }

  if (typeof elem === "object") {
    return !Object.keys(elem).length;
  }

  return !elem;
};

export { isEmpty, isObject };
