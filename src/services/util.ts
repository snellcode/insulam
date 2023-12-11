import { castArray, compact, clone } from "lodash-es";
import $, { Selector } from "cash-dom";

export const getGuid = (): string => {
  let d = new Date().getTime(),
    d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c: string) => {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x7) | 0x8).toString(16);
    },
  );
};

export const toArray = (value) => {
  return compact(castArray(value));
};

export const toOdd = (value) => {
  return 2 * Math.floor(value / 2) + 1;
};

export const cloneArray = (value: unknown): unknown[] => {
  return clone(castArray(value));
};

export const stringify = (value: unknown): string => {
  let str = "";
  try {
    str = JSON.stringify(value, null, 2);
  } catch (error) {
    // pass
  }
  return str;
};

export const timeout = (ms = 0): Promise<void> => {
  return new Promise((resolve: () => void) => {
    setTimeout(() => requestAnimationFrame(resolve), ms);
  });
};

export const getController = (): string => {
  return location.pathname.split("/").filter(Boolean).shift();
};

export const getAction = (): string => {
  const segments = location.pathname.split("/").filter(Boolean);
  return segments.length > 2 ? segments.slice(-2).shift() : null;
};

export const isTarget = (target: unknown, name: string): boolean => {
  const selector = target as Selector;
  return Boolean($(selector).is(name) || $(selector).parents(name).length);
};

export const isTargetList = (target: unknown, names: string[]): boolean => {
  return names.reduce(
    (value: boolean, name: string) => (value ? value : isTarget(target, name)),
    false,
  );
};
