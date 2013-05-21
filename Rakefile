require "rake/clean"

CLEAN.include "tmp"
CLOBBER.include ["shp", "topo", "geo"]

TOPOJSON = "./node_modules/.bin/topojson"
TOPOJSON_PRECISION = 1e-9 # 1 nsr, see http://en.wikipedia.org/wiki/Steradian

task :default => :all

task :all => [:shp, :geo, :topo]
task :shp => ["shp/ch-country.shp", "shp/ch-cantons.shp", "shp/ch-municipalities.shp"]
task :geo => ["geo/ch-country.json", "geo/ch-cantons.json", "geo/ch-municipalities.json"]
task :topo  => ["topo/ch-country.json", "topo/ch-cantons.json", "topo/ch-municipalities.json"]

# Country

file "shp/ch-country.shp" => ["src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_LANDESGEBIET.shp"] do |t|
  mkdir_p "shp"
  # Reproject to WGS84 and filter out non-swiss country parts
  system "ogr2ogr -t_srs EPSG:4326 #{t.name} #{t.prerequisites.first} -sql \"SELECT * FROM '#{File.basename(t.prerequisites.first, ".shp")}' WHERE NAME = 'Schweiz'\""
end

file "geo/ch-country.json" => ["shp/ch-country.shp"] do |t|
  mkdir_p "geo"
  system "ogr2ogr -f GeoJSON #{t.name} -lco ENCODING=UTF-8 #{t.prerequisites.first} -sql \"SELECT NAME as name FROM '#{File.basename(t.prerequisites.first, ".shp")}'\""
end

# TopoJSON currently fails with shp as source
file "topo/ch-country.json" => ["geo/ch-country.json"] do |t|
  mkdir_p "topo"
  system "#{TOPOJSON} -o #{t.name} -p -s #{TOPOJSON_PRECISION} -- country=#{t.prerequisites.first}"
end

# Cantons

file "shp/ch-cantons.shp" => ["src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_KANTONSGEBIET.shp"] do |t|
  mkdir_p "shp"
  # Reproject to WGS84
  system "ogr2ogr -t_srs EPSG:4326 -lco ENCODING=UTF-8 #{t.name} #{t.prerequisites.first}"
end

# TODO: filter properties, maybe convert cantons to MultiPolygons
file "geo/ch-cantons.json" => ["shp/ch-cantons.shp"] do |t|
  mkdir_p "geo"
  system "ogr2ogr -f GeoJSON #{t.name} #{t.prerequisites.first} -sql \"SELECT * FROM '#{File.basename(t.prerequisites.first, ".shp")}'\""
end

file "topo/ch-cantons.json" => ["geo/ch-cantons.json"] do |t|
  mkdir_p "topo"
  system "#{TOPOJSON} -o #{t.name} -p -s #{TOPOJSON_PRECISION} -- cantons=#{t.prerequisites.first}"
end

# Municipalities

file "shp/ch-municipalities.shp" => ["src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_HOHEITSGEBIET.shp"] do |t|
  mkdir_p "shp"
  # Reproject to WGS84 and filter out non-swiss municipalities
  system "ogr2ogr -t_srs EPSG:4326 -lco ENCODING=UTF-8 #{t.name} #{t.prerequisites.first} -sql \"SELECT * FROM #{File.basename(t.prerequisites.first, ".shp")} WHERE ICC = 'CH'\""
end

# TODO: filter properties
file "geo/ch-municipalities.json" => ["shp/ch-municipalities.shp"] do |t|
  mkdir_p "geo"
  system "ogr2ogr -f GeoJSON #{t.name} #{t.prerequisites.first} -sql \"SELECT * FROM '#{File.basename(t.prerequisites.first, ".shp")}'\""
end

file "topo/ch-municipalities.json" => ["geo/ch-municipalities.json"] do |t|
  mkdir_p "topo"
  system "#{TOPOJSON} -o #{t.name} -p -s #{TOPOJSON_PRECISION} -- municipalities=#{t.prerequisites.first}"
end

# Elevation

# file "tmp/shp/contours/contours.shp" => ["src/contours/DHM200.asc"] do |t|
#   mkdir_p "tmp/shp/contours"
#   system "gdal_contour -a ELEV -i 200 #{t.prerequisites.first} #{t.name}"
# end

# file "shp/contours/contours.shp" => ["tmp/shp/contours/contours.shp"] do |t|
#   mkdir_p "shp/contours"
#   system "ogr2ogr -s_srs EPSG:21781 -t_srs EPSG:4326 -overwrite #{t.name} #{t.prerequisites.first}"
# end

# file "tmp/geo/contours.json" => ["shp/contours/contours.shp"] do |t|
#   mkdir_p "tmp/geo"
#   system "ogr2ogr -f GeoJSON #{t.name} #{t.prerequisites.first}"
# end

# file "topojson/contours.json" => ["shp/contours/contours.shp"] do |t|
#   mkdir_p "topojson"
#   system "#{TOPOJSON} #{t.prerequisites.first} -o #{t.name} -p --id-attribute ID -s #{TOPOJSON_PRECISION}"
# end

# Names

