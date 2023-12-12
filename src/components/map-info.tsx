import { FunctionalComponent, h, Fragment } from "preact";
import { useRecoilValue } from "recoil";
import { get } from "lodash-es";
import { stringify } from "src/services/util";
import { playersState } from "src/services/state";
import { getTileColor } from "src/services/tile";

interface Props {
  map;
  camera;
  loading;
  tileSize;
  filename;
  onClickZoomOut;
  onClickZoomIn;
  onClickCenter;
  onClickMiniMap;
}

export const MapInfo: FunctionalComponent<Props> = (props: Props) => {
  const {
    map,
    camera,
    loading,
    tileSize,
    filename,
    onClickZoomOut,
    onClickZoomIn,
    onClickCenter,
    onClickMiniMap,
  } = props;

  const players = useRecoilValue(playersState) as any;
  const current = players.find(({ current }) => current);

  if (!current) {
    return <Fragment />;
  }
  const { x, y } = current;
  const playerName = get(current, "name");
  const value = get(map, `[${y}][${x}]`);
  const color = getTileColor(value);

  return (
    <div class="map-info">
      <div class="loading">{loading ? "loading..." : ""}</div>
      <h4>Tile Size: {tileSize}</h4>
      <button disabled={loading} onClick={onClickZoomOut}>
        -
      </button>
      <button disabled={loading} onClick={onClickZoomIn}>
        +
      </button>
      <button disabled={loading} onClick={onClickCenter}>
        center
      </button>
      {tileSize < 7 && tileSize > 1 && (
        <div class="caution">low tile size is slower to update</div>
      )}
      {tileSize === 1 && (
        <div class="caution">
          please raise tile size if map becomes un-responsive
        </div>
      )}
      <div>camera: {`${camera.x},${camera.y}`}</div>
      <div class="map-image">
        <div class="image-wrapper">
          <div class="image-box" />
          <img
            onClick={onClickMiniMap}
            src={`/assets/${filename}.png`}
            width="100%"
            alt="height map"
          />
        </div>
      </div>

      <div class="player-info">
        <h2>Player</h2>
        <div>Name: {playerName}</div>
        <pre class="code">{stringify(current)}</pre>
      </div>

      <div class="map-tile">
        <h4>Tile: {`x: ${x}, y: ${y}`}</h4>
        <div>
          <div style={`background: ${color}`} class="color-sample">
            <span>{color}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
