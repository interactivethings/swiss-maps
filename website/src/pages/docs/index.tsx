import { domCopyText } from "@/components/Generator/domain/dom";
import LayoutDefault from "@/components/Layout/LayoutDefault";
import * as MUI from "@mui/material";
import { GetServerSideProps } from "next";
import { Copy, Download } from "react-feather";
import { downloadUrl } from "src/shared";
import { makeStyles } from '@mui/styles';

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
    description: "Which kinds of shapes you want to include (comma-separation).",
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
  const classes = useStyles();
  const { host } = props;

  const endpoint = `${host}/api/v0`;

  return (
    <LayoutDefault>
      <div className={classes.container}>
        <h1>Documentation</h1>

        <section id="location" className={classes.section}>
          <h2>Location</h2>
          <pre className={classes.code}>{endpoint}</pre>
        </section>

        <section id="parameters" className={classes.section}>
          <h2>Parameters</h2>

          <div className={classes.parameterTable}>
            <div className={classes.th}>Name</div>
            <div className={classes.th}>Description</div>
            <div className={classes.th}>Value</div>
            <div className={classes.th}>Example value</div>
            {API_PARAMETERS.map(
              ({ name, description, value, defaultValue }) => {
                return (
                  <>
                    <div>{name}</div>
                    <div>{description}</div>
                    <div>
                      {Array.isArray(value) ? (
                        <div className={classes.valueList}>
                          {value.map((x, i) => (
                            <span className={classes.value} key={i}>
                              {x}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className={classes.value}>{value}</span>
                      )}
                    </div>
                    <div>
                      {Array.isArray(defaultValue) ? (
                        <div className={classes.valueList}>
                          {defaultValue.map((x, i) => (
                            <span className={classes.valueExample} key={i}>
                              {x}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className={classes.valueExample}>
                          {defaultValue}
                        </span>
                      )}
                    </div>
                  </>
                );
              }
            )}
          </div>
        </section>

        <section id="examples" className={classes.section}>
          <h2>Examples</h2>
          {API_EXAMPLES.map(({ name, query }) => {
            const url = `${endpoint}?${query}`;
            const downloadUrl = `/api/v0?${query}&download=true`;

            return (
              <div className={classes.eg}>
                <div>{name}</div>
                <div className={classes.url}>
                  <span>{url}</span>

                  <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <MUI.IconButton
                      size="small"
                      className={classes.copy}
                      onClick={() => domCopyText(url)}
                    >
                      <span className={classes.tooltip}>Copy to clipboard</span>

                      <Copy width={16} height={16} />
                    </MUI.IconButton>
                    <MUI.IconButton
                      size="small"
                      component="a"
                      download
                      className={classes.copy}
                      href={downloadUrl}
                    >
                      <span className={classes.tooltip}>Download the data</span>

                      <Download width={16} height={16} />
                    </MUI.IconButton>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </LayoutDefault>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {},
  container: {
    padding: "50px 60px",
  },
  section: {
    margin: theme.spacing(4, 0),
    "& h2": {
      color: theme.palette.primary.main,
    },
  },
  code: {
    backgroundColor: "#f5f5f5",
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius,
  },
  parameterTable: {
    overflow: "auto",
    display: "grid",
    gridTemplateColumns: "1fr 3fr 1fr 1fr",
    // maxWidth: "480px",
    columnGap: theme.spacing(1),
    rowGap: theme.spacing(1),
    "& > div": {
      padding: theme.spacing(0.5),
    },
  },
  th: {
    borderBottom: "1px solid #eee",
  },
  valueList: {
    display: "flex",
    gap: theme.spacing(0.5),
  },
  value: {
    backgroundColor: "rgb(255, 245, 177)",
    border: "1px solid rgb(249, 197, 19)",
    color: "rgb(115, 92, 15)",
    padding: theme.spacing(0.25, 0.5),
    borderRadius: theme.shape.borderRadius,
  },
  valueExample: {
    backgroundColor: "#E8DAEE",
    border: "1px solid #cba1dc",
    color: theme.palette.primary.main,
    padding: theme.spacing(0.25, 0.5),
    borderRadius: theme.shape.borderRadius,
  },
  eg: {
    margin: theme.spacing(2, 0),
  },
  url: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(255, 245, 177)",
    border: "1px solid rgb(249, 197, 19)",
    color: "rgb(115, 92, 15)",
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0),
    borderRadius: theme.shape.borderRadius,
  },
  copy: {
    position: "relative",
    display: "inline-block",
    "&:hover $tooltip": {
      visibility: "visible",
      opacity: 1,
    },
  },
  tooltip: {
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
  },
}));

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
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
