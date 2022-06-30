import { Preview } from "./Preview";

export default function WrappedPreview({
  deckRef,
  ...props
}: {
  deckRef: any;
}) {
  return <Preview ref={deckRef} {...props} />;
}
