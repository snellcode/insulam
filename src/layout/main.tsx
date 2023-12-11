import { FunctionalComponent, h } from "preact";
import { useRecoilState } from "recoil";
import { ErrorBoundary } from "react-error-boundary";
import { getController, getAction } from "src/services/util";
import { routeState } from "src/services/state";
import { LayoutRoutes } from "src/layout/routes";
import { LayoutError } from "src/layout/error";

export const LayoutMain: FunctionalComponent = () => {
  const [route, setRoute] = useRecoilState(routeState);

  const onRouteChange = (): void => {
    const controller = getController();
    const action = getAction();
    const path = [controller, action].filter(Boolean).join("-") || "home";
    setRoute(`${path}:${Date.now()}`);
  };

  return (
    <main class={`container route route-${route.split(":").shift()}`}>
      <ErrorBoundary
        fallbackRender={({ error }: { error: Error }): JSX.Element => (
          <LayoutError error={error} />
        )}
      >
        <LayoutRoutes onRouteChange={onRouteChange} />
      </ErrorBoundary>
    </main>
  );
};
