# Swiss Maps

This repo hosts Swiss canton and municipality geodata in open formats that can be used to build static and interactive maps (e.g. with [D3](http://d3js.org)).

Data source is the Swiss Federal Office of Topography, [swissBOUNDARIES3D](http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/landscape/swissBOUNDARIES3D.html) 2012.

Following formats are available or planned for the near future:

- [ESRI Shapefile](http://en.wikipedia.org/wiki/Shapefile)
- [GeoJSON](http://www.geojson.org/)
- [TopoJSON](https://github.com/mbostock/topojson) (soon!)

### Why?

Although the data is free, one has to register as a customer and "order" this data from swisstopo's online shop, which is quite burdensome. Also the shapefiles only contain municipalities, whereas cantons are often needed too.

## ESRI Shapefiles

The ESRI Shapefiles are generated with [QGIS](http://qgis.org) using the 'V200' municipality area Shapefiles (QGIS wouldn't combine the cantons with the 'swissBOUNDARIES3D' files). Foreign municipalities are removed. 

The CRS is set to *WGS84* because that's the default for GeoJSON.

The simplified shapefiles are created with [MapShaper](http://mapshaper.org), using the Visvalingam algorithm with 50% simplification.

## GeoJSON

The GeoJSON files are derived directly from the shapefiles with `ogr2ogr -f geoJSON file.geojson file.shp`. The simplified versions are additionally compressed with [LilJSON](https://github.com/migurski/LilJSON).

### License

See license files in `license/`.

#### Author

Jeremy Stucki, [Interactive Things](http://interactivethings.com)