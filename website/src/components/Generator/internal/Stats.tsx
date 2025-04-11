import * as MUI from "@mui/material";
import * as React from "react";
import { downloadUrl } from "src/shared";
import { useImmer } from "use-immer";
import { useContext } from "../context";
import { useQuery } from "@tanstack/react-query";
import { styled } from "@mui/material/styles";

/**
 * The underlying DOM element which is rendered by this component.
 */
const Root = styled(MUI.Paper, {
  name: "SwissMaps-Generator-Stats",
  slot: "root",
})(({ theme }) => ({
  position: "absolute",
  top: 40,
  right: 40,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5, 2),
  width: 160,
}));

interface Props extends React.ComponentPropsWithoutRef<typeof Root> {}

function Stats(props: Props) {
  const { ...rest } = props;

  const ctx = useContext();
  const { options } = ctx.state;

  const [state, mutate] = useImmer({
    topojson: { size: 0 },
    svg: { size: 0 },
  });

  const { data: topoData } = useQuery({
    queryKey: [
      "stat",
      "topojson",
      options.year,
      options.simplify,
      ...options.shapes,
    ],
    queryFn: () =>
      fetch(downloadUrl({ ...options, format: "topojson" }, "v0")).then((res) =>
        res.text(),
      ),
  });

  const { data: svgData, error } = useQuery({
    queryKey: [
      "stat",
      "svg",
      options.year,
      options.simplify,
      ...options.shapes,
    ],
    queryFn: () =>
      fetch(downloadUrl({ ...options, format: "svg" }, "v0")).then((res) =>
        res.text(),
      ),
  });

  React.useEffect(() => {
    mutate((draft) => {
      draft.topojson.size = topoData?.length || 0;
      draft.svg.size = svgData?.length || 0;
    });
  }, [topoData, svgData]);

  return (
    <Root elevation={4} {...rest}>
      <Stat variant="body2" color="textSecondary">
        TopoJSON <span>{humanFileSize(state.topojson.size, false, 0)}</span>
      </Stat>
      <Stat variant="body2" color="textSecondary">
        SVG <span>{humanFileSize(state.svg.size, false, 0)}</span>
      </Stat>
    </Root>
  );
}

const Stat = styled(MUI.Typography, {
  name: "SwissMaps-Generator-Stats",
  slot: "stat",
})(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

export default Stats;

function humanFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}
