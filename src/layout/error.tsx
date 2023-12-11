import { FunctionalComponent, h } from "preact";

interface Props {
  error: Error;
}

export const LayoutError: FunctionalComponent<Props> = (props: Props) => {
  const { error } = props;
  const { message } = error;
  const time = new Date().toString();
  return (
    <div class="route-error-content">
      <h2>Application Error:</h2>
      <pre>time: {time}</pre>
      <pre>error: {message}</pre>
    </div>
  );
};
