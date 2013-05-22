# encoding: UTF-8
require "rake/clean"

CANTONS = %w{zh be lu ur sz ow nw gl zg fr so bs bl sh ar ai sg gr ag tg ti vd vs ne ge ju}

CLEAN.include "tmp"
CLOBBER.include ["shp", "topo", "geo"]

TOPOJSON = "./node_modules/.bin/topojson"
TOPOJSON_SIMPLIFY = 1e-9

task :default => :all

task :all => [:shp, :topo]
task :shp => ["shp/ch/country.shp", "shp/ch/cantons.shp", "shp/ch/municipalities.shp"]
# task :geo => ["geo/ch-country.json", "geo/ch-cantons.json", "geo/ch-municipalities.json"]
task :topo  => ["topo/ch-country.json", "topo/ch-cantons.json", "topo/ch-municipalities.json"]

# Country

file "shp/ch/country.shp" => ["src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_LANDESGEBIET.shp"] do |t|
  mkdir_p "shp/ch"
  # Reproject to WGS84 and filter out non-swiss country parts
  system "ogr2ogr -t_srs EPSG:4326 #{t.name} #{t.prerequisites.first} -where \"NAME = 'Schweiz'\""
end

# file "geo/ch-country.json" => ["shp/ch-country.shp"] do |t|
#   mkdir_p "geo"
#   system "ogr2ogr -f GeoJSON #{t.name} -lco ENCODING=UTF-8 #{t.prerequisites.first} -sql \"SELECT NAME as name FROM '#{File.basename(t.prerequisites.first, ".shp")}'\""
# end

file "topo/ch-country.json" => ["shp/ch/country.shp"] do |t|
  mkdir_p "topo"
  system "#{TOPOJSON} -p -s #{TOPOJSON_SIMPLIFY} -- country=#{t.prerequisites.first} > #{t.name}"
end

file "topo/ch-water.json" => ["shp/ch/water.shp"] do |t|
  mkdir_p "topo"
  system "#{TOPOJSON} -s #{TOPOJSON_SIMPLIFY} -p -- water=#{t.prerequisites.first} > #{t.name}"
end

# Cantons

file "shp/ch/cantons.shp" => ["src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_KANTONSGEBIET.shp"] do |t|
  mkdir_p "shp/ch"
  # Reproject to WGS84
  system "ogr2ogr -t_srs EPSG:4326 -lco ENCODING=UTF-8 #{t.name} #{t.prerequisites.first}"
end

# TODO: filter properties, maybe convert cantons to MultiPolygons
# file "geo/ch-cantons.json" => ["shp/ch-cantons.shp"] do |t|
#   mkdir_p "geo"
#   system "ogr2ogr -f GeoJSON #{t.name} #{t.prerequisites.first} -sql \"SELECT NAME as name, KANTONSNUM as cantonNumber FROM '#{File.basename(t.prerequisites.first, ".shp")}'\""
# end

file "topo/ch-cantons.json" => ["shp/ch/cantons.shp"] do |t|
  mkdir_p "topo"
  system "#{TOPOJSON} -s #{TOPOJSON_SIMPLIFY} --id-property=KANTONSNUM -p name=NAME,cantonNumber=+KANTONSNUM -- cantons=#{t.prerequisites.first} > #{t.name}"
end

# Municipalities

file "shp/ch/municipalities.shp" => ["src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_HOHEITSGEBIET.shp"] do |t|
  mkdir_p "shp/ch"
  # Reproject to WGS84 and filter out non-swiss municipalities
  system "ogr2ogr -t_srs EPSG:4326 -lco ENCODING=UTF-8 #{t.name} #{t.prerequisites.first} -where \"ICC = 'CH'\""
end

# file "geo/ch-municipalities.json" => ["shp/ch/municipalities.shp"] do |t|
#   mkdir_p "geo"
#   system "ogr2ogr -f GeoJSON #{t.name} #{t.prerequisites.first} -sql \"SELECT NAME as name, GEM_TEIL as municipalityPart, KANTONSNUM as cantonNumber, BFS_NUMMER as bfsNumber, SHN as shn FROM '#{File.basename(t.prerequisites.first, ".shp")}'\""
# end

file "topo/ch-municipalities.json" => ["shp/ch/municipalities.shp"] do |t|
  mkdir_p "topo"
  system "#{TOPOJSON} -o #{t.name} -p -s #{TOPOJSON_SIMPLIFY} --id-property=shn -- municipalities=#{t.prerequisites.first}"
end

CANTONS.each_with_index do |canton, i|
  file "shp/#{canton}/municipalities.shp" => ["shp/ch/municipalities.shp"] do |t|
    mkdir_p "shp/#{canton}"
    system "ogr2ogr #{t.name} #{t.prerequisites.first} -where \"KANTONSNUM = #{i+1}\""
  end

  file "topo/#{canton}-municipalities.json" => ["shp/#{canton}/municipalities.shp"] do |t|
    mkdir_p "topo"
    system "#{TOPOJSON} -s #{TOPOJSON_SIMPLIFY} --id-property=SHN -p name=NAME,part=+GEM_TEIL,bfsNumber=+BFS_NUMMER,cantonNumber=+KANTONSNUM -- municipalities=#{t.prerequisites.first} > #{t.name}"
  end
end

# Water

# Need to find better source for these files (preferably directly from OSM)!
file "shp/ch/water.shp" => ["src/switzerland-natural-shape/natural.shp"] do |t|
  mkdir_p "shp/ch"
  system "ogr2ogr #{t.name} #{t.prerequisites.first} -where \"type = 'water'\""
end

file "shp/zh/water.shp" => ["shp/ch/water.shp"] do |t|
  mkdir_p "shp/zh"
  system "ogr2ogr #{t.name} #{t.prerequisites.first} -where \"osm_id IN (29214375, 4304746, 13075186, 4605042)\""
end

file "topo/zh-municipalities-water.json" => ["shp/zh/municipalities.shp", "shp/zh/water.shp"] do |t|
  mkdir_p "topo"
  system "#{TOPOJSON} -s #{TOPOJSON_SIMPLIFY} --id-property=SHN,name -p name=NAME,name=name,part=+GEM_TEIL,bfsNumber=+BFS_NUMMER,cantonNumber=+KANTONSNUM -- municipalities=#{t.prerequisites[0]} water=#{t.prerequisites[1]} > #{t.name}"
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
#   system "#{TOPOJSON} #{t.prerequisites.first} -o #{t.name} -p --id-attribute ID -s #{TOPOJSON_SIMPLIFY}"
# end

# Names

