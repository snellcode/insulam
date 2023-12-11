import { FunctionalComponent, h } from "preact";
import { Link } from "preact-router/match";

const RouteError: FunctionalComponent = () => {
  return (
    <div class="content-padding">
      <h2>Error: Route Not Found</h2>
      <Link href="/" class="button">
        Back to Home
      </Link>
    </div>
  );
};

export default RouteError;
