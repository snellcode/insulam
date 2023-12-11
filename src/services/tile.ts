const colors = {
  deepWater: "#003eb2",
  water: "#356dc6",
  sand: "#c2b280",
  dirt: "#a49463",
  grass: "#557a2d",
  forest: "#3c6114",
  darkForest: "#284d00",
  mountain: "#8c8e7b",
  highMountain: "#a0a28f",
  snow: "#ffffff",
};

export const getTilePosition = ({
  gridSizeX,
  gridSizeY,
  camera,
  gridX,
  gridY,
}) => {
  const centerX = Math.floor(gridSizeX / 2);
  const centerY = Math.floor(gridSizeY / 2);
  const x = gridX + camera.x - centerX;
  const y = gridY + camera.y - centerY;
  return { x, y };
};

export const getTileColor = (height) => {
  if (height >= 3) {
    return "red";
  }
  if (height >= 2) {
    return "orange";
  }
  if (height >= 1) {
    return "yellow";
  }
  if (height < 0.39) {
    return colors.deepWater;
  }
  if (height < 0.42) {
    return colors.water;
  }
  if (height < 0.46) {
    return colors.sand;
  }
  if (height < 0.47) {
    return colors.dirt;
  }
  if (height < 0.54) {
    return colors.grass;
  }
  if (height < 0.55) {
    return colors.forest;
  }
  if (height < 0.68) {
    return colors.darkForest;
  }

  // mountains and above
  if (height >= 0.79) {
    return colors.snow;
  }
  if (height >= 0.74) {
    return colors.highMountain;
  }
  if (height >= 0.68) {
    return colors.mountain;
  }
};

export const getTileColorName = (height) => {
  if (height >= 3) {
    return "red";
  }
  if (height >= 2) {
    return "orange";
  }
  if (height >= 1) {
    return "yellow";
  }
  if (height < 0.39) {
    return "deepWater";
  }
  if (height < 0.42) {
    return "water";
  }
  if (height < 0.46) {
    return "sand";
  }
  if (height < 0.47) {
    return "dirt";
  }
  if (height < 0.54) {
    return "grass";
  }
  if (height < 0.55) {
    return "forest";
  }
  if (height < 0.68) {
    return "darkForest";
  }

  // mountains and above
  if (height >= 0.79) {
    return "snow";
  }
  if (height >= 0.74) {
    return "highMountain";
  }
  if (height >= 0.68) {
    return "mountain";
  }
};

export const getTilePlayer = async (player) => {
  if (!player) {
    return;
  }
  const filename = "droplet";
  const resp = await (await fetch(`/assets/${filename}.svg`)).text();
  return resp;
};
