import { geoPath, select } from "d3";
import * as React from "react";
import * as topojson from "topojson";

interface Props {}

function Preview(props: Props) {
  const svgRef = React.useRef<null | SVGSVGElement>(null);

  React.useEffect(() => {
    (async () => {
      const res = await fetch("/ch.json");
      const json = await res.json();

      if (svgRef.current) {
        const path = geoPath().projection(null);
        const svg = select(svgRef.current);

        svg
          .append("path")
          .datum(topojson.feature(json, json.objects.country))
          .attr("class", "country")
          .attr("d", path);

        svg
          .append("path")
          .datum(
            topojson.mesh(json, json.objects.municipalities, function (a, b) {
              return a !== b;
            })
          )
          .attr("class", "municipality-boundaries")
          .attr("d", path);

        svg
          .append("path")
          .datum(
            topojson.mesh(json, json.objects.cantons, function (a, b) {
              return a !== b;
            })
          )
          .attr("class", "canton-boundaries")
          .attr("d", path);
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
`}
      </style>
    </div>
  );
}

export default Preview;
