import { h } from "preact";

const RouteAbout = () => {
  return (
    <div class="app-route container">
      <p>Help the blue man find his tools!</p>
      <ul>
        <li>
          Left click moves map to tile, or moves the player to adjacent tiles.
        </li>
        <li>Right click teleports you to the tile.</li>
        <li>You can only traverse some types of tiles.</li>
        <li>Find the tools to allow travel on other tiles.</li>
        <li>The tools do not exist yet, but will show up soon!</li>
      </ul>
    </div>
  );
};

export default RouteAbout;
