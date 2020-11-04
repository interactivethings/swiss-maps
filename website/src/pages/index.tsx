import { useImmer } from "use-immer";
import { Preview } from "@/components/Preview";

export default function Page() {
  const [state, mutate] = useImmer({});

  return (
    <div>
      <h1>Swiss Maps</h1>

      <div>
        <Preview />
      </div>
    </div>
  );
}
