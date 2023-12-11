import { FunctionalComponent, h } from "preact";

interface Props {
  loading: boolean;
}
export const Loading: FunctionalComponent<Props> = (props: Props) => {
  const { loading } = props;
  return (
    <div class={`loading-display loading-${loading}`}>
      <div class="dot-flashing-wrapper">
        <div class="dot-flashing" />
      </div>
    </div>
  );
};
