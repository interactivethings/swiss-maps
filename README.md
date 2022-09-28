[![swiss-maps on npm](https://shields.io/npm/v/swiss-maps)](https://www.npmjs.com/package/swiss-maps)

> This is the documentation for the swiss-maps npm package and website v4.
> For the previous Makefile and instructions, please check the [legacy branch](https://github.com/interactivethings/swiss-maps/tree/legacy).

# Swiss Maps

This repository provides a mechanism to generate [TopoJSON](https://github.com/mbostock/topojson) from publicly available [swisstopo](https://www.swisstopo.admin.ch/) geodata.

The geodata is based on the generalized from the [FSO](https://www.bfs.admin.ch/bfs/en/home/services/geostat/swiss-federal-statistics-geodata/administrative-boundaries/generalized-boundaries-local-regional-authorities.html).

The `Makefile` cleans the source data further, so the features are as consistent as possible across different years and the properties are consistently named.

For convenience, the generated files are published on [npm](https://www.npmjs.com/package/swiss-maps)

## Getting Started

All Shapefiles and TopoJSON files are cleaned and pre-packaged in this package.

You can install it locally using npm:

```sh
npm i swiss-maps
```

You can read the files from the installed package directory, which is structured like this:

```
- node_modules/
  - swiss-maps/
    - 2010/
      - cantons.{dbf,prj,shp,shx}
      - country.{dbf,prj,shp,shx}
      - districts.{dbf,prj,shp,shx}
      - lakes.{dbf,prj,shp,shx}
      - municipalities.{dbf,prj,shp,shx}
      - ch-combined.json (TopoJSON)
    - 2011/
      ...
    - 2021/
```

The TopoJSON file combines all layers into one file. Separate TopoJSON files for single layers will be added in the future.

## Use the TopoJson files in your web application

### Load from Unpkg.com

If you don't want to install anything and just want to load the file, you can `fetch` it from https://unpkg.com (or any other npm registry CDN).

```js
import * as topojson from "topojson-client";

const res = await fetch(`https://unpkg.com/swiss-maps@4/2021/ch-combined.json`);
const topo = await res.json();

const municipalities = topojson.feature(topo, topo.objects.municipalities);
// Render the municipalities ...
```

### Bundled app (e.g. Next.js)

If you're using a bundler that can resolve locally installed npm packages, you can add the `swiss-maps` npm package to your project.

```sh
npm i swiss-maps
```

```js
import * as topojson from "topojson-client";

const topo = await import(`swiss-maps/2021/ch-combined.json`);

const municipalities = topojson.feature(topo, topo.objects.municipalities);

// Render the municipalities ...
```

## License

The code in this repository is licensed under BSD-3-Clause.

The geodata is published under a non-commercial license and needs to be attributed with the source "Bundesamt für Statistik (BFS), GEOSTAT".
