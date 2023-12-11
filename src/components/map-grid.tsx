import { FunctionalComponent, h } from "preact";
import { Loading } from "src/components/loading";

interface Props {
  loading: boolean;
}
export const MapGrid: FunctionalComponent<Props> = (props: Props) => {
  const { loading } = props;
  return (
    <div class="map-grid">
      <Loading loading={loading} />
      <div id="d3-map-wrapper">
        <div id="d3-map" />
      </div>
    </div>
  );
};
