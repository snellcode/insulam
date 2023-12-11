import { h } from "preact";

const RouteAbout = () => {
  return (
    <div class="app-route container">
      <p>Help the map to find his tools!</p>
      <p>
        Left Click moves map, or player to adjacent tile. Right click teleports
        you to the tile. You can only walk on some types of tiles. Find the
        tools to allow travel on other tiles.
      </p>
    </div>
  );
};

export default RouteAbout;
