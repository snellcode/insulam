import { FunctionalComponent, h } from "preact";

export const LayoutFooter: FunctionalComponent = () => {
  return (
    <footer class="layout-footer container">
      <pre>&copy; {`Phil Snell <snellcode@gmail.com>`}</pre>
    </footer>
  );
};
