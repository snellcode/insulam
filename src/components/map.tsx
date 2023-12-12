import { FunctionalComponent, h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { useDebounce } from "@uidotdev/usehooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { get, debounce } from "lodash-es";
import $ from "cash-dom";
import { timeout, toOdd } from "src/services/util";
import {
  routeState,
  routeRunningState,
  playersState,
  zoomState,
} from "src/services/state";
import {
  getMap,
  initGrid,
  drawGrid,
  getTileSizeFromZoom,
  getZoomSizes,
} from "src/services/map";
import { addPlayer } from "src/services/player";
import { MapGrid } from "src/components/map-grid";
import { MapInfo } from "src/components/map-info";

interface Props {
  filename;
}
export const Map: FunctionalComponent<Props> = (props: Props) => {
  const { filename } = props;
  const route = useRecoilValue(routeState);
  const [routeRunning, setRouteRunning] = useRecoilState(routeRunningState);
  const [screenSize, setScreenSize] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useRecoilState(playersState) as any;
  const [zoom, setZoom] = useRecoilState(zoomState) as any;
  const [map, setMap] = useState([]) as any;
  const [camera, setCamera] = useState({ x: 0, y: 0 }) as any;
  const tileSize = getTileSizeFromZoom(zoom);
  const zoomSizes = getZoomSizes();
  const current = players.find(({ current }) => current);
  const currentDeb = useDebounce(current, 1200);

  const updateScreenSize = (): void => {
    const screenWidth = Math.floor($(".map-grid").width());
    const screenHeight = Math.floor($(".map-grid").height());
    setScreenSize([screenWidth, screenHeight]);
  };

  const changeEffect = () => {
    setTimeout(async () => {
      if (!map.length) {
        return;
      }
      setLoading(true);
      await timeout(10);
      await drawGrid({
        screenSize,
        camera,
        map,
        setCamera,
        tileSize,
        zoom,
        players,
        setPlayers,
      });
      setLoading(false);
    });
  };

  const initEffect = () => {
    setTimeout(async () => {
      if (routeRunning) {
        setRouteRunning(false);
        location.reload();
        return;
      }
      window.onresize = debounce(updateScreenSize, 100, { trailing: true });
      setLoading(true);
      initGrid();
      const _map = await getMap({ filename });
      setMap(_map);
      updateScreenSize();
      await addPlayer({ map: _map, players, setPlayers, current: true });
      setLoading(false);
      setRouteRunning(true);
    });
  };

  useEffect(initEffect, [route]);
  useEffect(changeEffect, [camera, screenSize, zoom, players]);

  const onClickZoomOut = () => {
    setZoom(Math.max(0, zoom - 1));
  };

  const onClickZoomIn = () => {
    setZoom(Math.min(zoomSizes.length - 1, zoom + 1));
  };

  const onClickCenter = () => {
    const center = Math.ceil(map.length / 2);
    setCamera({ x: center, y: center });
  };

  const onClickMiniMap = (event) => {
    const { offsetX, offsetY } = event;
    const mmWidth = $(".map-image .image-wrapper").width();
    const mmHeight = $(".map-image .image-wrapper").height();
    const mmColSize = mmWidth / map.length;
    const mmRowSize = mmHeight / map.length;
    const x = Math.ceil(offsetX / mmColSize);
    const y = Math.ceil(offsetY / mmRowSize);
    setCamera({ x, y });
  };

  useEffect(() => {
    if (current) {
      setCamera({ x: get(current, "x"), y: toOdd(get(current, "y")) });
    }
  }, [currentDeb]);

  return (
    <div
      class={`map tile-size-${tileSize} ${
        tileSize <= 15 ? "tile-size-small" : "tile-size-large"
      }`}
    >
      <MapGrid loading={loading} />
      <MapInfo
        {...{
          map,
          camera,
          loading,
          tileSize,
          filename,
          onClickZoomOut,
          onClickZoomIn,
          onClickCenter,
          onClickMiniMap,
        }}
      />
    </div>
  );
};
