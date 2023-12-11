import { get, merge } from "lodash-es";
import * as d3 from "d3";
import * as d3hexbin from "d3-hexbin";
import $ from "cash-dom";
import { toOdd, toArray } from "src/services/util";
import {
  getTileColor,
  getTilePosition,
  getTileColorName,
} from "src/services/tile";

export const getZoomSizes = () => {
  return [6, 9, 15, 23, 35, 61, 111];
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
  d3.selectAll(".hexagon").remove();
  const [screenWidth, screenHeight] = screenSize;
  const gridSizeX = getGridSizeX({ screenWidth, tileSize });
  const gridSizeY = getGridSizeY({ screenHeight, tileSize });
  const hexbin = d3hexbin.hexbin().radius(tileSize);
  const points = [];
  const current = players.find(({ current }) => current);

  $(() => {
    $(".image-box").css(getImageBoxCss({ map, gridSizeX, gridSizeY, camera }));
  });

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
    // const isEvenRow = false;
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

  for (let gridY = 0; gridY < gridSizeY; gridY += 1) {
    for (let gridX = 0; gridX < gridSizeX; gridX += 1) {
      let x = tileSize * gridX * Math.sqrt(3);
      if (gridY % 2 === 1) {
        x += (tileSize * Math.sqrt(3)) / 2;
      }
      const y = tileSize * gridY * 1.5;
      const { x: tileX, y: tileY } = getTilePosition({
        gridSizeX,
        gridSizeY,
        camera,
        gridX,
        gridY,
      });

      const value = [get(map, `[${tileY}][${tileX}]`, 0)];

      let player = null;

      toArray(players).forEach((item) => {
        if (get(item, "x") === tileX && get(item, "y") === tileY) {
          player = item;
        }
      });

      const colorName = getTileColorName(value[0]);
      const color = getTileColor(value[0]);

      points.push([
        x,
        y,
        {
          tileX,
          tileY,
          gridX,
          gridY,
          value,
          color,
          colorName,
          player,
          current,
        },
      ]);
    }
  }

  const getPlayerImageHeight = () => {
    switch (zoom) {
      case 3:
        return 28;
      case 4:
        return 46;
      case 5:
        return 75;
      case 6:
      default:
        return 145;
    }
  };
  const getPlayerImageWidth = () => {
    return getPlayerImageHeight();
  };

  const getPlayerImageCoordsX = () => {
    switch (zoom) {
      case 3:
        return 5;
      case 4:
        return 7;
      case 5:
        return 10;
      case 6:
        return 23;
      default:
        return 0;
    }
  };

  const getPlayerImageCoordsY = () => {
    switch (zoom) {
      case 3:
        return 5;
      case 4:
        return 12;
      case 5:
        return 20;
      case 6:
        return 40;
      default:
        return 0;
    }
  };

  const svg = d3.select("svg");
  const defs = svg.append("svg:defs");

  svg.attr("focusable", false).on("keydown", () => {
    console.log("svgsvgsvg");
  });

  defs
    .append("pattern")
    .attr("id", `hero-${zoom}`)
    .attr("width", 1)
    .attr("height", 1)
    .append("image")
    .attr("href", `/assets/hero.png`)
    .attr("width", getPlayerImageWidth())
    .attr("height", getPlayerImageHeight())
    .attr("x", getPlayerImageCoordsX())
    .attr("y", getPlayerImageCoordsY());

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

  background.attr("class", (data) => {
    const [, , { colorName }] = data[0];
    const colorClass = `color-${colorName}`;
    return toArray(["hexagon background", colorClass]).join(" ");
  });

  sprites.on("click", (data) => {
    const [, , props] = data[0];
    const { tileX, tileY } = props;
    setCamera({ x: tileX, y: toOdd(tileY) });
  });

  sprites.on("contextmenu", (data) => {
    const [, , { tileX, tileY, current }] = data[0];
    d3.event.preventDefault();
    const newPos = {
      x: tileX,
      y: tileY,
    };
    if (newPos) {
      setCamera({ x: get(newPos, "x"), y: toOdd(get(newPos, "y")) });
      setPlayers(getPlayersWithNewPos({ newPos, current, data }));
    }
  });

  sprites.attr("fill", (data) => {
    const [, , { player, tileX, tileY, current }] = data[0];
    if (!current) {
      return;
    }
    const { x, y } = current;
    if (isTarget({ x, y }, { tileX, tileY })) {
      if (zoom > 2) {
        return `url(#${get(player, "name")}-${zoom})`;
      }
      return "yellow";
    }
    return "transparent";
  });

  sprites.attr("class", (data) => {
    const [, , { player, tileX, tileY, current }] = data[0];
    if (!current) {
      return;
    }
    const { x, y } = current;
    if (isTarget({ x, y }, { tileX, tileY })) {
      return `hexagon sprite fa-fade current-player ${player.name}`;
    }
    if (inTargetRange({ x, y }, { tileX, tileY })) {
      return "hexagon sprite fa-fade valid-move";
    }
  });

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

  const getPlayersWithNewPos = ({ newPos, current, data }) => {
    return players.map((player) => {
      if (get(current, "id") !== get(player, "id")) {
        return player;
      }

      return merge({}, current, getSafePosition({ newPos, current, data }));
    });
  };

  sprites
    .filter((data) => {
      const [, , { tileX, tileY, current }] = data[0];
      if (!current) {
        return false;
      }
      const { x, y } = current;
      return isTarget({ x, y }, { tileX, tileY });
    })
    .on("keypress", () => {
      console.log("9999");
    });

  sprites
    .filter((data) => {
      const [, , { tileX, tileY, current }] = data[0];
      if (!current) {
        return false;
      }
      const { x, y } = current;
      return inTargetRange({ x, y }, { tileX, tileY });
    })

    .on("click", (data, index) => {
      const [, , { current }] = data[0];
      const { x, y } = current;
      let newPos = null;

      const isEvenRow = y % 2 === 0;
      // console.log("isEvenRow", camera, isEvenRow);

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
        setPlayers(getPlayersWithNewPos({ newPos, current, data }));
      }
    });

  if (zoom > 3) {
    d3.select("svg")
      .selectAll(".hexagon-coords")
      .data(hexbin(points))
      .enter()
      .append("text")
      .filter((data) => {
        return true;
        const [, , { tileX, tileY, current }] = data[0];
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
      .style("font-size", "10px");
  }
};
