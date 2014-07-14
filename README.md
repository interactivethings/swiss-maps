# Swiss Maps

This repository provides a mechanism to generate [TopoJSON](https://github.com/mbostock/topojson) from publicly available (but difficult to access) [swisstopo](http://www.swisstopo.admin.ch/internet/swisstopo/en/home.html) geodata.

## Getting Started

To generate the TopoJSON files you need to install Node.js, either with the [official Node.js installer](http://nodejs.org/) or via [Homebrew](http://mxcl.github.io/homebrew/):

    brew install node
    
You also need GDAL and the corresponding python-gdal library installed. Links to the binaries are in the [GDAL Wiki](http://trac.osgeo.org/gdal/wiki/DownloadingGdalBinaries). On OS X you can also use Homebrew:

    brew install gdal

To get started, clone this repository and run `make`.

    git clone https://github.com/interactivethings/swiss-maps.git
    cd swiss-maps
    make

`make` or `make all` generates the following TopoJSON files:

* `ch-country.json`
* `ch-cantons.json`
* `ch-districts.json`
* `ch-municipalities.json`
* `ch-country-lakes.json` (country boundaries + lakes)
* `ch-cantons-lakes.json` (canton boundaries + lakes)
* `ch-districts-lakes.json` (district boundaries + lakes)
* `ch-municipalities-lakes.json` (municipality boundaries + lakes)
* `ch-lakes.json`
* `ch.json` (all of the above combined)
* For each canton a file with its municipalities and lakes, e.g. `zh-municipalities.json` and `zh-municipalities-lakes.json`

Additionally, PLZ (zip code) boundaries and elevation contours can be built:

* `ch-plz.json`
* `ch-contours.json` (the `CONTOUR_INTERVAL` variable can be set to the desired interval in meters (default: 500))

TopoJSON files are generated in the `topo/` directory.

You can also generate individual files, e.g.

    make topo/ch-cantons.json

## Projections and Dimensions

The coordinates of the source files is the official Swiss reference system [CH1903](http://www.swisstopo.admin.ch/internet/swisstopo/en/home/topics/survey/sys/refsys/switzerland.html) with already [projected coordinates](http://www.swisstopo.admin.ch/internet/swisstopo/en/home/topics/survey/sys/refsys/projections.html).

Per default, `make` will generate output files with the following characteristics:

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

If you're targeting another output dimensions, you can easily change them by setting the `WIDTH` and `HEIGHT` variables:

    make topo/ch-cantons.json WIDTH=2000 HEIGHT=1000

Per default, a 10px margin is included which can be changed by setting the `MARGIN` variable.

Make sure you run `make clean` if you've generated files before because `make` won't overwrite them if they already exist.

### Reproject to Spherical Coordinates

If you want to combine your JSON files with other libraries like [Leaflet](http://leafletjs.com/) or want to use another projection, you need to reproject the files to spherical coordinates first. You can do this by simply running

    make topo/ch-cantons.json REPROJECT=true

It's double important that you run `make clean` or `rm -rf shp` first if you've generated files in cartesian coordinates (the default mode) before. Otherwise TopoJSON will throw an error. The `WIDTH` and `HEIGHT` variables will be ignored.

## Metadata

Although the source files contain a slew of metadata such as population and area, data source, year of change etc., *no properties are included by default*, only the feature ID is set. This keeps files as small as possible and in most cases you will join other data to your map anyway.

You can easily include the following properties

* *id* (the official ID of the feature, i.e. municipality (BFS), canton, district, or lake number)
* *name* (the name of the feature in its main language)
* *abbr* (only for cantons, e.g. 'BE')

To include some or all of these properties, define the `PROPERTIES` variable:

    make topo/ch-cantons.json PROPERTIES=name,abbr

If you want to generate your files with more (or less) properties, you should modify the `Makefile`.

## Historical Municipality Boundaries

Municipality boundaries from 2013 are also available. If you want boundaries from another year than 2014, define the `YEAR` variable:

    make topo/ch-municipalities.json YEAR=2013

## Other Modifications

For everything else you can modify the `Makefile` or run `ogr2ogr` and `topojson` directly. Mike Bostock's tutorial [Let's Make a Map](http://bost.ocks.org/mike/map/), the [TopoJSON wiki](https://github.com/mbostock/topojson/wiki), and [ogr2ogr documentation](http://www.gdal.org/ogr2ogr.html) should cover most of your needs.

## Examples

* [TopoJSON Cantons and Municipalities](http://bl.ocks.org/herrstucki/4327678) (stored in a single file!)
* [TopoJSON Cantons](http://bl.ocks.org/mbostock/4207744)
* [Swiss Topography](http://bl.ocks.org/herrstucki/6312708)

## Copyright and License

### Author

Jeremy Stucki, [Interactive Things](http://interactivethings.com)

### Data Source

Data source is the Swiss Federal Office of Topography, [swissBOUNDARIES3D](http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/landscape/swissBOUNDARIES3D.html) 2014.

### License

* Geodata from swisstopo is licensed under the [Licence for the free geodata of the Federal Office of Topography swisstopo](LICENSE-GEODATA)
* Everything else: [BSD](LICENSE)
