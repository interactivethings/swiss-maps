import { Examples } from "@/components/Examples";
import { Generator } from "@/components/Generator";
import LayoutDefault from "@/components/Layout/LayoutDefault";

export default function Page() {
  return (
    <LayoutDefault>
      <Generator />
      <Examples />
    </LayoutDefault>
  );
}
