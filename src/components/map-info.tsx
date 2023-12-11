import { FunctionalComponent, h } from "preact";
import { TileInfo } from "src/components/tile-info";
import { PlayerInfo } from "src/components/player-info";

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
      <TileInfo tile={camera} map={map} />
      <PlayerInfo />
    </div>
  );
};
