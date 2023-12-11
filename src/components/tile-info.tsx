import { FunctionalComponent, h, Fragment } from "preact";
import { get } from "lodash-es";
import { getTileColor } from "src/services/tile";

interface Props {
  tile;
  map;
}

export const TileInfo: FunctionalComponent<Props> = (props: Props) => {
  const { tile, map } = props;
  if (!tile) {
    return <Fragment />;
  }
  const { x, y, gridX, gridY } = tile;
  const value = get(map, `[${y}][${x}]`);
  const color = getTileColor(value);
  return (
    <div class="map-tile">
      <h4>Tile: {`x: ${x}, y: ${y}`}</h4>
      {gridX && <h4>Grid: {`x: ${gridX}, y: ${gridY}`}</h4>}
      <div>
        <div style={`background: ${color}`} class="color-sample">
          <span>{color}</span>
        </div>
      </div>
    </div>
  );
};
