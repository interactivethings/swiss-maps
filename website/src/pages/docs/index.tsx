import LayoutDefault from "@/components/Layout/LayoutDefault";
import * as MUI from "@material-ui/core";
import { GetServerSideProps } from "next";

type Props = { host: string };

const API_PARAMETERS = [
  {
    name: "format",
    description: "Data format.",
    value: ["topojson", "svg"],
    example: "topojson",
  },
  {
    name: "projection",
    description: "Map projection",
    value: ["wgs84", "somerc"],
    example: "somerc",
  },
  {
    name: "shapes",
    description: "Which kinds of shapes you want to include.",
    value: ["country", "lakes", "cantons", "municipalities"],
    example: "country&lakes",
  },
  {
    name: "year",
    description: "The data from specific year.",
    value: "number",
    example: "2022",
  },
  {
    name: "simplify",
    description: "The data simplication extent.",
    value: ["undefined", "0 ~ 100"],
    example: "80",
  },
  {
    name: "download",
    description: "Whether to download as a file or raw data",
    value: ["undefined", "boolean"],
    example: "true",
  },
  {
    name: "width",
    description: "SVG export width",
    value: "number",
    example: "900",
  },
  {
    name: "height",
    description: "SVG export height",
    value: "number",
    example: "600",
  },
];

const API_EXAMPLES = [
  {
    name: "",
  },
];
export default function Page(props: Props) {
  const classes = useStyles();
  const { host } = props;

  return (
    <LayoutDefault>
      <div className={classes.container}>
        <h1>Documentation</h1>

        <section id="location">
          <h2>Location</h2>
          <pre className={classes.code}>{`${host}/api/v0`}</pre>
        </section>

        <section id="parameters">
          <h2>Parameters</h2>

          <div className={classes.parameterTable}>
            <div className={classes.th}>Name</div>
            <div className={classes.th}>Description</div>
            <div className={classes.th}>Value</div>
            <div className={classes.th}>Example value</div>
            {API_PARAMETERS.map(({ name, description, value, example }) => {
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
                    {Array.isArray(example) ? (
                      <div className={classes.valueList}>
                        {example.map((x, i) => (
                          <span className={classes.valueExample} key={i}>
                            {x}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className={classes.valueExample}>{example}</span>
                    )}
                  </div>
                </>
              );
            })}
          </div>
        </section>

        <section>
          <h2>Examples</h2>
        </section>
      </div>
    </LayoutDefault>
  );
}

const useStyles = MUI.makeStyles((theme) => ({
  root: {},
  container: {
    padding: "50px 60px",
  },
  code: {
    backgroundColor: "#f5f5f5",
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius,
  },
  parameterTable: {
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
    color: "#9958B3",
    padding: theme.spacing(0.25, 0.5),
    borderRadius: theme.shape.borderRadius,
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
