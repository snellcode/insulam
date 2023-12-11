import { timeout, toArray } from "src/services/util";

const getNewPlayer = ({ map, current }) => {
  const center = Math.ceil(map.length / 2);
  return {
    x: center,
    y: center,
    name: "hero",
    turns: 3,
    current,
  };
};

export const addPlayer = async ({ map, players, setPlayers, current }) => {
  await timeout();
  const newPlayer = getNewPlayer({ map, current });
  setPlayers(toArray(players).concat(newPlayer));
  await timeout();
};
