import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";
import RouteHome from "src/routes/home";
import RouteError from "src/routes/error";
import RouteAbout from "src/routes/about";

interface Props {
  onRouteChange;
}
export const LayoutRoutes: FunctionalComponent<Props> = (props: Props) => {
  const { onRouteChange } = props;
  return (
    <Router onChange={onRouteChange}>
      <Route path="/" component={RouteHome} />
      <Route path="/about/" component={RouteAbout} />
      <RouteError default />
    </Router>
  );
};
