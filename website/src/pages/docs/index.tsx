import { domCopyText } from "@/components/Generator/domain/dom";
import LayoutDefault from "@/components/Layout/LayoutDefault";
import * as MUI from "@mui/material";
import { GetServerSideProps } from "next";
import { Copy, Download } from "react-feather";
import { downloadUrl } from "src/shared";
import { styled } from "@mui/material/styles";

type Props = { host: string };

const API_PARAMETERS = [
  {
    name: "format",
    description: "Data format.",
    value: ["topojson", "svg"],
    defaultValue: "topojson",
  },
  {
    name: "projection",
    description: "Map projection",
    value: ["wgs84", "somerc"],
    defaultValue: "somerc",
  },
  {
    name: "shapes",
    description:
      "Which kinds of shapes you want to include (comma-separation).",
    value: ["country", "lakes", "cantons", "municipalities"],
    defaultValue: "country,cantons,lakes",
  },
  {
    name: "year",
    description: "The data from specific year.",
    value: "number",
    defaultValue: "2022",
  },
  {
    name: "simplify",
    description: "The data simplication extent.",
    value: ["undefined", "0 ~ 100"],
    defaultValue: "0",
  },
  {
    name: "download",
    description: "Whether to download as a file or raw data",
    value: ["undefined", "boolean"],
    defaultValue: "undefined",
  },
  {
    name: "width",
    description: "SVG export width",
    value: "number",
    defaultValue: "900",
  },
  {
    name: "height",
    description: "SVG export height",
    value: "number",
    defaultValue: "600",
  },
];

const API_EXAMPLES = [
  {
    name: "Get swiss canton topojson data in year 2022",
    query: "year=2022&shapes=cantons&format=topojson",
  },
  {
    name: "Get swiss country topojson data with lake",
    query: "shapes=cantons,lakes&format=topojson",
  },
  {
    name: "Get swiss municipalities topojson data with 50% simplication",
    query: "shapes=municipalities&format=topojson&simplify=50%",
  },
];
export default function Page(props: Props) {
  const { host } = props;

  const endpoint = `${host}/api/v0`;

  return (
    <LayoutDefault>
      <Container>
        <h1>Documentation</h1>

        <Section>
          <h2>Location</h2>

          <Code>{endpoint}</Code>
        </Section>

        <Section id="parameters">
          <h2>Parameters</h2>

          <ParameterTable>
            <div className={"th"}>Name</div>
            <div className={"th"}>Description</div>
            <div className={"th"}>Value</div>
            <div className={"th"}>Example value</div>
            {API_PARAMETERS.map(
              ({ name, description, value, defaultValue }) => {
                return (
                  <>
                    <div>{name}</div>
                    <div>{description}</div>
                    <div>
                      {Array.isArray(value) ? (
                        <ValueList>
                          {value.map((x, i) => (
                            <Value key={i}>{x}</Value>
                          ))}
                        </ValueList>
                      ) : (
                        <Value>{value}</Value>
                      )}
                    </div>
                    <div>
                      {Array.isArray(defaultValue) ? (
                        <ValueList>
                          {defaultValue.map((x, i) => (
                            <ValueExample key={i}>{x}</ValueExample>
                          ))}
                        </ValueList>
                      ) : (
                        <ValueExample>{defaultValue}</ValueExample>
                      )}
                    </div>
                  </>
                );
              },
            )}
          </ParameterTable>
        </Section>

        <Section id="examples">
          <h2>Examples</h2>

          {API_EXAMPLES.map(({ name, query }) => {
            const url = `${endpoint}?${query}`;
            const downloadUrl = `/api/v0?${query}&download=true`;

            return (
              <Eg>
                <div>{name}</div>
                <Url>
                  <span>{url}</span>

                  <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <CopyIconButton
                      size="small"
                      onClick={() => domCopyText(url)}
                    >
                      <Tooltip className="tooltip">Copy to clipboard</Tooltip>

                      <Copy width={16} height={16} />
                    </CopyIconButton>
                    <CopyIconButton
                      size="small"
                      {...{ component: "a", download: true, href: downloadUrl }}
                    >
                      <Tooltip className="tooltip">Download the data</Tooltip>

                      <Download width={16} height={16} />
                    </CopyIconButton>
                  </div>
                </Url>
              </Eg>
            );
          })}
        </Section>
      </Container>
    </LayoutDefault>
  );
}

const Container = styled("div", {
  name: "SwissMaps-Docs",
  slot: "container",
})(() => ({
  padding: "50px 60px",
}));

const Section = styled("div", {
  name: "SwissMaps-Docs",
  slot: "section",
})(({ theme }) => ({
  margin: theme.spacing(4, 0),
  "& h2": {
    color: theme.palette.primary.main,
  },
}));

const Code = styled("pre", {
  name: "SwissMaps-Docs",
  slot: "code",
})(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.shape.borderRadius,
}));

const ParameterTable = styled("div", {
  name: "SwissMaps-Docs",
  slot: "parameterTable",
})(({ theme }) => ({
  overflow: "auto",
  display: "grid",
  gridTemplateColumns: "1fr 3fr 1fr 1fr",
  // maxWidth: "480px",
  columnGap: theme.spacing(1),
  rowGap: theme.spacing(1),
  "& > div": {
    padding: theme.spacing(0.5),
  },

  "& > .th": {
    borderBottom: "1px solid #eee",
  },
}));

const ValueList = styled("div", {
  name: "SwissMaps-Docs",
  slot: "valueList",
})(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(0.5),
}));

const Value = styled("span", {
  name: "SwissMaps-Docs",
  slot: "value",
})(({ theme }) => ({
  backgroundColor: "rgb(255, 245, 177)",
  border: "1px solid rgb(249, 197, 19)",
  color: "rgb(115, 92, 15)",
  padding: theme.spacing(0.25, 0.5),
  borderRadius: theme.shape.borderRadius,
}));

const ValueExample = styled("span", {
  name: "SwissMaps-Docs",
  slot: "valueExample",
})(({ theme }) => ({
  backgroundColor: "#E8DAEE",
  border: "1px solid #cba1dc",
  color: theme.palette.primary.main,
  padding: theme.spacing(0.25, 0.5),
  borderRadius: theme.shape.borderRadius,
}));

const Eg = styled("div", {
  name: "SwissMaps-Docs",
  slot: "eg",
})(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const Url = styled("div", {
  name: "SwissMaps-Docs",
  slot: "url",
})(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "rgb(255, 245, 177)",
  border: "1px solid rgb(249, 197, 19)",
  color: "rgb(115, 92, 15)",
  padding: theme.spacing(1),
  margin: theme.spacing(1, 0),
  borderRadius: theme.shape.borderRadius,
}));

const CopyIconButton = styled(MUI.IconButton, {
  name: "SwissMaps-Docs",
  slot: "copyIconButton",
})(() => ({
  position: "relative",
  display: "inline-block",
  "&:hover .tooltip": {
    visibility: "visible",
    opacity: 1,
  },
}));

const Tooltip = styled("span", {
  name: "SwissMaps-Docs",
  slot: "tooltip",
})(() => ({
  visibility: "hidden",
  width: 120,
  fontSize: "12px",
  backgroundColor: "#555",
  color: "#fff",
  textAlign: "center",
  borderRadius: "6px",
  padding: "5px",
  position: "absolute",
  zIndex: 1,
  bottom: "150%",
  left: "50%",
  marginLeft: -60,
  opacity: "0",
  transition: "opacity 0.3s",
  "&::after": {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "50%",
    marginLeft: "-5px",
    borderWidth: "5px",
    borderStyle: "solid",
    borderColor: "#555 transparent transparent transparent",
  },
}));

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const host = context.req.headers.host;
  if (!host) {
    return {
      notFound: true,
    };
  }
  return {
    props: { host },
  };
};
