import { Preview } from "@/components/Preview";
import { Options, Shape } from "src/shared";
import { useImmer } from "use-immer";

interface State {
  options: Options;
}

export default function Page() {
  const [state, mutate] = useImmer<State>({
    options: {
      format: "topojson",
      projection: "wgs84",
      year: 2020,
      shapes: new Set(["switzerland"] as Array<Shape>),
    },
  });

  return (
    <div>
      <h1>Swiss Maps</h1>

      <div></div>

      <div>
        <Preview options={state.options} />
      </div>
    </div>
  );
}
