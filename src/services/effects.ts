import { stringify } from "src/services/util";

const prefix = "INSULAM";

export const persistEffect =
  (key) =>
  ({ setSelf, onSet }): void => {
    const fullKey = `${prefix}.${key}`;
    try {
      const value = JSON.parse(localStorage.getItem(fullKey));
      if (value !== undefined && value !== null) {
        setSelf(value);
      }
    } catch (error) {
      console.debug("persistEffect.parse", error);
    }
    onSet((newValue) => {
      try {
        const value = String(stringify(newValue));
        localStorage.setItem(fullKey, value);
      } catch (error) {
        console.debug("persistEffect.stringify", error);
      }
    });
  };
