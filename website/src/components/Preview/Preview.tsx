import { geoAlbers, geoPath, select } from "d3";
import * as React from "react";
import { Options } from "src/shared";
import * as topojson from "topojson";
import { isJSDocNamepathType } from "typescript";

interface Props {
  options: Options;
}

function Preview(props: Props) {
  const { options } = props;

  const svgRef = React.useRef<null | SVGSVGElement>(null);

  React.useEffect(() => {
    (async () => {
      const res = await fetch("/api/generate");
      const json = await res.json();

      const width = 960;
      const height = 500;

      if (svgRef.current) {
        const projection = geoAlbers()
          .rotate([0, 0])
          .center([8.3, 46.8])
          .scale(16000)
          .translate([width / 2, height / 2])
          .precision(0.1);

        const path = geoPath().projection(projection);
        const svg = select(svgRef.current);

        svg
          .append("path")
          .datum(topojson.feature(json, json.objects.switzerland))
          .attr("class", "country")
          .attr("d", path);

        // svg
        //   .append("path")
        //   .datum(
        //     topojson.mesh(json, json.objects.municipalities, function (a, b) {
        //       return a !== b;
        //     })
        //   )
        //   .attr("class", "municipality-boundaries")
        //   .attr("d", path);

        // svg
        //   .append("path")
        //   .datum(
        //     topojson.mesh(json, json.objects.cantons, function (a, b) {
        //       return a !== b;
        //     })
        //   )
        //   .attr("class", "canton-boundaries")
        //   .attr("d", path);
      }
    })();
  }, []);

  return (
    <div>
      <svg ref={svgRef} width={960} height={500} />

      <style>
        {`
.country {
  fill: #222;
}

.canton-boundaries {
  fill: none;
  stroke: #fff;
  stroke-width: 1;
}
 
.municipality-boundaries {
  fill: none;
  stroke: #fff;
  stroke-width: .3;
}

.lakes {
  fill: blue;
}
`}
      </style>
    </div>
  );
}

export default Preview;
