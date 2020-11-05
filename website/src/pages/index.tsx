import { Generator } from "@/components/Generator";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Examples } from "@/components/Examples";

export default function Page() {
  return (
    <>
      <Header />
      <Generator />
      <Examples />
      <Footer />
    </>
  );
}
