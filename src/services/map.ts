import { get, merge } from "lodash-es";
import * as d3 from "d3";
import * as d3hexbin from "d3-hexbin";
import $ from "cash-dom";
import { toOdd, toArray } from "src/services/util";
import { getTilePosition, getTileColorName } from "src/services/tile";

let IS_FIRST_ROW_EVEN = null;

export const getZoomSizes = () => {
  return [3, 10, 20, 50, 100];
};

export const initGrid = () => {
  d3.select("#d3-map")
    .append("svg")
    .append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("class", "d3-rect");
};

const getGridSizeFactorX = () => {
  const factor = 1.73;
  return factor;
};

const getGridSizeFactorY = () => {
  const factor = 1.49;
  return factor;
};

const getGridSizeX = ({ screenWidth, tileSize }) => {
  return toOdd(Math.ceil(screenWidth / (tileSize * getGridSizeFactorX())));
};

const getGridSizeY = ({ screenHeight, tileSize }) => {
  return toOdd(Math.ceil(screenHeight / (tileSize * getGridSizeFactorY())));
};

export const getMap = async ({ filename }) => {
  const resp = await (await fetch(`/assets/${filename}.csv`)).text();
  const map = resp
    .split("\n")
    .filter(Boolean)
    .map((item) => item.split(","));
  return map;
};

export const getTileSizeFromZoom = (zoom) => {
  const sizes = getZoomSizes();
  return get(sizes, `[${zoom}]`, sizes[0]);
};

const getImageBoxCss = ({ map, gridSizeX, gridSizeY, camera }) => {
  const miniMapWidth = $(".map-info .image-wrapper").width();
  const miniMapHeight = $(".map-info .image-wrapper").height();
  const ratioX = miniMapWidth / map.length;
  const ratioY = miniMapHeight / map.length;
  const left = Math.floor(camera.x * ratioX);
  const top = Math.floor(camera.y * ratioY);
  const width = gridSizeX * ratioX;
  const height = gridSizeY * ratioY;
  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    display: "block",
    transform: "translate(-50%,-50%)",
  };
};

const getPlayerImageHeight = (zoom) => {
  switch (zoom) {
    case 2:
      return 30;
    case 3:
      return 70;
    case 4:
    default:
      return 140;
  }
};

const getPlayerImageWidth = (zoom) => {
  return getPlayerImageHeight(zoom);
};

const getPlayerImageCoordsX = (zoom) => {
  switch (zoom) {
    case 2:
      return 2;
    case 3:
      return 8;
    case 4:
      return 15;
    default:
      return 0;
  }
};

const getPlayerImageCoordsY = (zoom) => {
  switch (zoom) {
    case 2:
      return 5;
    case 3:
      return 10;
    case 4:
      return 20;
    default:
      return 0;
  }
};

const isTarget = ({ x, y }, { tileX, tileY }) => {
  if (x === tileX && y === tileY) {
    return true;
  }
  return false;
};

const inTargetRange = ({ x, y }, { tileX, tileY }) => {
  if (isTarget({ x, y }, { tileX, tileY })) {
    return false;
  }

  const isEvenRow = y % 2 === 0;
  // 1 - directly to the left
  // 2,3,4,5 - clockwise

  if (isEvenRow) {
    // 1
    if (x - 1 === tileX && y === tileY) {
      return true;
    }

    // 2
    if (x === tileX && y - 1 === tileY) {
      return true;
    }

    // 3
    if (x + 1 === tileX && y - 1 === tileY) {
      return true;
    }

    // 4
    if (x + 1 === tileX && y === tileY) {
      return true;
    }

    // 4
    if (x + 1 === tileX && y + 1 === tileY) {
      return true;
    }

    // 5
    if (x === tileX && y + 1 === tileY) {
      return true;
    }
  } else {
    // 1
    if (x - 1 === tileX && y === tileY) {
      return true;
    }

    // 2
    if (x - 1 === tileX && y - 1 === tileY) {
      return true;
    }

    // 3
    if (x === tileX && y - 1 === tileY) {
      return true;
    }

    // 4
    if (x + 1 === tileX && y === tileY) {
      return true;
    }

    // 5
    if (x === tileX && y + 1 === tileY) {
      return true;
    }

    // 5
    if (x - 1 === tileX && y + 1 === tileY) {
      return true;
    }
  }

  return false;
};

const getSafePosition = ({ newPos, current, data }) => {
  const [, , { colorName }] = data[0];
  switch (colorName) {
    case "water":
    case "deepWater":
    case "mountain":
    case "highMountain":
    case "snow":
      return current;
    default:
      return newPos;
  }
  return newPos;
};

const getPlayersWithNewPos = ({ players, newPos, current, data }) => {
  return players.map((player) => {
    if (get(current, "id") !== get(player, "id")) {
      return player;
    }

    return merge({}, current, getSafePosition({ newPos, current, data }));
  });
};

const initSvg = ({ zoom }) => {
  d3.selectAll(".hexagon").remove();
  const svg = d3.select("svg");
  const defs = svg.append("svg:defs");
  defs
    .append("pattern")
    .attr("id", `hero-${zoom}`)
    .attr("width", 1)
    .attr("height", 1)
    .append("image")
    .attr("href", `/assets/hero.png`)
    .attr("width", getPlayerImageWidth(zoom))
    .attr("height", getPlayerImageHeight(zoom))
    .attr("x", getPlayerImageCoordsX(zoom))
    .attr("y", getPlayerImageCoordsY(zoom));
};

const setCoordsText = ({ tileSize, hexbin, points, current }) => {
  d3.select("svg")
    .selectAll(".hexagon.coords")
    .data(hexbin(points))
    .enter()
    .append("text")
    .filter((data) => {
      const [, , { tileX, tileY }] = data[0];
      if (!current) {
        return false;
      }
      const { x, y } = current;
      return inTargetRange({ x, y }, { tileX, tileY });
    })
    .text((data) => {
      const [, , props] = data[0];
      const { tileX, tileY } = props;
      return `${tileX},${tileY}`;
    })
    .attr("x", (data) => {
      const [x] = data[0];
      return x;
    })
    .attr("y", (data) => {
      const [, y] = data[0];
      return y + tileSize - 20;
    })
    .attr("text-anchor", "middle")
    .style("font-size", "16px");
};

const setBackground = ({ hexbin, points, setCamera }) => {
  const background = d3
    .select("svg")
    .append("g")
    .selectAll(".hexagon.background")
    .data(hexbin(points))
    .enter()
    .append("path")
    .attr("d", (d) => {
      return `M${d.x},${d.y}${hexbin.hexagon()}`;
    });
  background.attr("class", (data) => {
    const [, , { colorName }] = data[0];
    const colorClass = `color-${colorName}`;
    return toArray(["hexagon background", colorClass]).join(" ");
  });
  background.on("click", (data) => {
    const [, , props] = data[0];
    const { tileX, tileY } = props;
    setCamera({ x: tileX, y: toOdd(tileY) });
  });
};

const setSprites = ({
  setCamera,
  players,
  setPlayers,
  zoom,
  hexbin,
  points,
  current,
}) => {
  const sprites = d3
    .select("svg")
    .append("g")
    .selectAll(".hexagon.sprite")
    .data(hexbin(points))

    .enter()
    .append("path")
    .attr("d", (d) => {
      return `M${d.x},${d.y}${hexbin.hexagon()}`;
    });

  sprites.on("click", (data) => {
    const [, , props] = data[0];
    const { tileX, tileY } = props;
    setCamera({ x: tileX, y: toOdd(tileY) });
  });

  sprites.on("contextmenu", (data) => {
    const [, , { tileX, tileY }] = data[0];
    d3.event.preventDefault();
    const newPos = {
      x: tileX,
      y: tileY,
    };
    if (newPos) {
      setCamera({ x: get(newPos, "x"), y: toOdd(get(newPos, "y")) });
      setPlayers(getPlayersWithNewPos({ players, newPos, current, data }));
    }
  });

  sprites.attr("fill", (data) => {
    const [, , { player, tileX, tileY }] = data[0];
    if (!current) {
      return;
    }
    const { x, y } = current;
    if (isTarget({ x, y }, { tileX, tileY })) {
      if (zoom > 1) {
        return `url(#${get(player, "name")}-${zoom})`;
      }
      return "cyan";
    }
    return "transparent";
  });

  sprites.attr("class", (data) => {
    const [, , { colorName, tileX, tileY }] = data[0];
    const colorClass = `color-${colorName}`;
    const classes = toArray(["hexagon", colorClass]);
    if (current) {
      const { x, y } = current;
      if (isTarget({ x, y }, { tileX, tileY })) {
        classes.push(`sprite fa-fade current-player ${current.name}`);
      }
      if (inTargetRange({ x, y }, { tileX, tileY })) {
        classes.push("sprite fa-fade valid-move");
      }
    }
    return classes.join(" ");
  });

  sprites
    .filter((data) => {
      const [, , { tileX, tileY }] = data[0];
      if (!current) {
        return false;
      }
      const { x, y } = current;
      return inTargetRange({ x, y }, { tileX, tileY });
    })

    .on("click", (data, index) => {
      const { x, y } = current;
      let newPos = null;

      const isEvenRow = y % 2 === 0;

      switch (index) {
        // up + left
        case 0:
          if (isEvenRow) {
            newPos = { x, y: y - 1 };
          } else {
            newPos = { x: x - 1, y: y - 1 };
          }
          break;

        // up + right
        case 1:
          if (isEvenRow) {
            newPos = { x: x + 1, y: y - 1 };
          } else {
            newPos = { x, y: y - 1 };
          }
          break;

        // left
        case 2:
          newPos = { x: x - 1, y };
          break;
        // right
        case 3:
          newPos = { x: x + 1, y };
          break;

        // down + left
        case 4:
          if (isEvenRow) {
            newPos = { x, y: y + 1 };
          } else {
            newPos = { x: x - 1, y: y + 1 };
          }
          break;

        // down + right
        case 5:
          if (isEvenRow) {
            newPos = { x: x + 1, y: y + 1 };
          } else {
            newPos = { x, y: y + 1 };
          }

          break;
        default:
          break;
      }
      if (newPos) {
        setPlayers(getPlayersWithNewPos({ players, newPos, current, data }));
      }
    });
};

const getPoints = ({
  map,
  tileSize,
  camera,
  gridSizeX,
  gridSizeY,
  players,
}) => {
  const points = [];

  // preview first cell of grid to detect even vs odd
  // not sure if there is a better way to do this,
  // but this seems to work for now
  for (let gridY = 0; gridY < 1; gridY += 1) {
    for (let gridX = 0; gridX < 1; gridX += 1) {
      const { y: tileY } = getTilePosition({
        gridSizeX,
        gridSizeY,
        camera,
        gridX,
        gridY,
      });
      IS_FIRST_ROW_EVEN = tileY % 2 === 0;
      break;
    }
    break;
  }

  for (let gridY = 0; gridY < gridSizeY; gridY += 1) {
    for (let gridX = 0; gridX < gridSizeX; gridX += 1) {
      let x = tileSize * gridX * Math.sqrt(3);
      if (gridY % 2 === 1) {
        x += (tileSize * Math.sqrt(3)) / 2;
      }

      const y = tileSize * gridY * 1.5;
      const tilePos = getTilePosition({
        gridSizeX,
        gridSizeY,
        camera,
        gridX,
        gridY,
      });

      const { x: tileX } = tilePos;
      let { y: tileY } = tilePos;

      if (IS_FIRST_ROW_EVEN) {
        tileY = tileY + 1;
      }

      const value = get(map, `[${tileY}][${tileX}]`, 0);

      const player = toArray(players).find((item) => {
        return get(item, "x") === tileX && get(item, "y") === tileY;
      });

      const colorName = getTileColorName(value);

      points.push([
        x,
        y,
        {
          tileX,
          tileY,
          colorName,
          player,
        },
      ]);
    }
  }

  return points;
};

export const drawGrid = async ({
  screenSize,
  tileSize,
  camera,
  map,
  zoom,
  setCamera,
  players,
  setPlayers,
}) => {
  const [screenWidth, screenHeight] = screenSize;
  const gridSizeX = getGridSizeX({ screenWidth, tileSize });
  const gridSizeY = getGridSizeY({ screenHeight, tileSize });
  const hexbin = d3hexbin.hexbin().radius(tileSize);
  const current = players.find(({ current }) => current);
  $(() => {
    $(".image-box").css(getImageBoxCss({ map, gridSizeX, gridSizeY, camera }));
  });
  const points = getPoints({
    map,
    tileSize,
    camera,
    gridSizeX,
    gridSizeY,
    players,
  });
  initSvg({ zoom });
  setBackground({ hexbin, points, setCamera });

  if (zoom === 0) {
    return;
  }

  setSprites({
    setCamera,
    players,
    setPlayers,
    zoom,
    hexbin,
    points,
    current,
  });

  if (zoom > 2) {
    setCoordsText({ tileSize, hexbin, points, current });
  }
};
