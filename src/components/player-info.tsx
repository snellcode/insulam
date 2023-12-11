import { FunctionalComponent, h, Fragment } from "preact";
import { useRecoilValue } from "recoil";
import { get } from "lodash-es";
import { stringify } from "src/services/util";
import { playersState } from "src/services/state";

export const PlayerInfo: FunctionalComponent = () => {
  const players = useRecoilValue(playersState) as any;
  const current = players.find(({ current }) => current);

  const playerName = get(current, "name");

  if (!current) {
    return <Fragment />;
  }
  return (
    <div class="player-info">
      <h2>Player</h2>
      <div>Name: {playerName}</div>
      <pre class="code">{stringify(current)}</pre>
    </div>
  );
};
