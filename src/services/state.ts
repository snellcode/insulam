import { atom } from "recoil";
import { persistEffect } from "src/services/effects";

export const defaultZoomIndex = 4;

const getAtomKey = (name: string): string => {
  return `services-${name}`;
};

export const routeState = atom({
  key: getAtomKey("routeState"),
  default: "",
});

export const routeRunningState = atom({
  key: getAtomKey("routeRunningState"),
  default: false,
  effects: [persistEffect(getAtomKey("routeRunningState"))],
});

export const playersState = atom({
  key: getAtomKey("playersState"),
  default: [],
  effects: [persistEffect(getAtomKey("playersState"))],
});
export const zoomState = atom({
  key: getAtomKey("zoomState"),
  default: defaultZoomIndex,
  effects: [persistEffect(getAtomKey("zoomState"))],
});
