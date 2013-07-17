# Swiss Maps

This repository provides a mechanism to bring publicly available (but difficult to access) [swisstopo](http://www.swisstopo.admin.ch/internet/swisstopo/en/home.html) geodata into open formats like [TopoJSON](https://github.com/mbostock/topojson) and [GeoJSON](http://www.geojson.org/).

## Getting Started

To build the TopoJSON and GeoJSON files you need to install Node.js, either with the [official Node.js installer](http://nodejs.org/) or via [Homebrew](http://mxcl.github.io/homebrew/):

    brew install node

To get started, clone this repository and run `make`.

    git clone https://github.com/interactivethings/swiss-maps.git
    cd swiss-maps
    make

`make` or `make all` builds the following TopoJSON and GeoJSON files:

* `ch-country.json`
* `ch-cantons.json`
* `ch-districts.json`
* `ch-municipalities.json`
* For each canton a file with its municipalities e.g. `zh-municipalities.json`
* `ch.json`, containing all of the above (only TopoJSON)

TopoJSON and GeoJSON files are placed in the `topo/` and `geo/` directories respectively.

You also can build individual files, e.g.

    make topo/ch-cantons.json

## Projections and Dimensions

The coordinates of the source files is the official Swiss reference system [CH1903](http://www.swisstopo.admin.ch/internet/swisstopo/en/home/topics/survey/sys/refsys/switzerland.html) with already [projected coordinates](http://www.swisstopo.admin.ch/internet/swisstopo/en/home/topics/survey/sys/refsys/projections.html).

Per default, `make` will build output files with the following characteristics:

* Projected, *cartesian* coordinates
* *Scaled* and *simplified* to a size of **960 × 500** pixels

If you're creating maps for screen use, these should be the optimal settings because you don't waste client performance with projecting spherical coordinates and have a good balance of geometry details and file size.

This means that if you use D3.js, you must disable the projection (see this [example of New York Block Groups](http://bl.ocks.org/mbostock/5996232))

```javascript
var path = d3.geo.path()
  .projection(null);
```

However, there are a few cases where you want something different.

### Changing Dimensions

If you're targeting another output dimensions, you can easily change them by changing the `WIDTH` and `HEIGHT` variables:

    make topo/ch-cantons.json WIDTH=2000 HEIGHT=1000

Make sure you run `make clean` if you've built files before because `make` won't overwrite them if they already exist.

### Reproject to Spherical Coordinates

If you want to combine your JSON files with other libraries like [Leaflet](http://leafletjs.com/) or want to use another projection, you need to reproject the files to spherical coordinates first. You can do this by simply running

    make topo/ch-cantons.json REPROJECT=true

It's double important that you run `make clean` or `rm -rf shp` first if you've built files in cartesian coordinates (the default mode) before. Otherwise TopoJSON will throw an error. The `WIDTH` and `HEIGHT` variables will be ignored.

For everything else you can modify the `Makefile` or run `ogr2ogr` and `topojson` directly. Mike Bostock's tutorial [Let's Make a Map](http://bost.ocks.org/mike/map/), the [TopoJSON wiki](https://github.com/mbostock/topojson/wiki), and [ogr2ogr documentation](http://www.gdal.org/ogr2ogr.html) should cover most of your need.

## Examples

* [TopoJSON Cantons and Municipalities](http://bl.ocks.org/4327678) (stored in a single file!)
* [TopoJSON Cantons](http://bl.ocks.org/4207744)

## Copyright and License

### Author

Jeremy Stucki, [Interactive Things](http://interactivethings.com)

### Data Source

Data source is the Swiss Federal Office of Topography, [swissBOUNDARIES3D](http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/landscape/swissBOUNDARIES3D.html) 2013.

### License

This agreement under public law in accordance with Article 12, paragraph 1b of the Swiss Federal Act of 5 October 2007 on Geoinformation (hereinafter referred to as Geoinformation Act) regulates access to, and use of, the federal geodata database.

By accepting this agreement, the licensee acknowledges all contractual provisions – in particular the scope of the licence and the contractual obligations – as well the applicability of Swiss federal legislation governing geoinformation.

By accepting this agreement, the licensee also acknowledges the sole right of the licensor to regulate access to, and use of, the federal geodata database. The attention of the licensee is herewith drawn to the fact that geodata may be protected under copyright law. The licensee thus acknowledges the exclusive right of the licensor to determine the use of the data.

[Full license agreement](http://www.toposhop.admin.ch/en/shop/terms/use/finished_products)
