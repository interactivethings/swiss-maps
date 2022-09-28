import { Footer } from "@/components/Footer";
import { GitHub } from "@/components/GitHub";
import { Header } from "@/components/Header";
import { HeadMeta } from "../HeadMeta";
import { MetaProps } from "../HeadMeta/HeadMeta";

interface Props {
  meta?: MetaProps;
  children: React.ReactNode;
}

export default function LayoutDefault({ meta, children }: Props) {
  return (
    <>
      <HeadMeta {...meta} />
      <Header />
      {children}
      <GitHub />
      <Footer />
    </>
  );
}
