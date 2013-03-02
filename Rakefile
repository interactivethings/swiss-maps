require "rake/clean"

CLEAN.include "tmp/**/*"
CLOBBER.include "shp/contours/*"
LILJSON_PRECISION = 3
TOPOJSON_PRECISION = 10e-9 # 1 nsr, see http://en.wikipedia.org/wiki/Steradian


file "tmp/shp/contours/contours-200.shp" => ["src/contours/DHM200.asc"] do |t|
  p t.name 
  p t.prerequisites
  mkdir_p "tmp/shp/contours"
  system "gdal_contour -a ELEV -i 1000 #{t.prerequisites.first} #{t.name}"
end

file "shp/contours/contours-200.shp" => ["tmp/shp/contours/contours-200.shp"] do |t|
  mkdir_p "shp/contours"
  system "ogr2ogr -s_srs EPSG:21781 -t_srs EPSG:4326 -overwrite #{t.name} #{t.prerequisites.first}"
end

file "topojson/contours-200.json" => ["shp/contours/contours-200.shp"] do |t|
  system "topojson #{t.prerequisites.first} -o #{t.name} -p ELEV --id-property ID"
end

# Old stuff

desc "Generate GeoJSON files"
task :geojson do
  rm Dir.glob("geojson/*.*json")

  %w{ swiss-cantons swiss-cantons-simplified }.each do |file_name|
    puts "Converting Cantons ..."
    system "ogr2ogr -f geoJSON 'geojson/#{file_name}.json' 'shp/#{file_name}/#{file_name}.shp' -sql \"SELECT NR AS no, ABKUERZUNG AS abbr, NAME AS name FROM '#{file_name}'\""
    system "python lib/liljson.py -p #{LILJSON_PRECISION} 'geojson/#{file_name}.json' 'geojson/#{file_name}.json'"
  end

  %w{ swiss-municipalities swiss-municipalities-simplified }.each do |file_name|
    puts "Converting Municipalities ..."
    system "ogr2ogr -f geoJSON 'geojson/#{file_name}.json' 'shp/#{file_name}/#{file_name}.shp' -sql \"SELECT BFSNR AS bfsNo, GEMTEIL AS municipalityPart, KANTONSNR AS cantonNo, GEMNAME AS name FROM '#{file_name}'\""
    system "python lib/liljson.py -p #{LILJSON_PRECISION} 'geojson/#{file_name}.json' 'geojson/#{file_name}.json'"
  end

  %w{ swiss-contours-1000 }.each do |file_name|
    puts "Converting Contours ..."
    system "ogr2ogr -f geoJSON 'geojson/#{file_name}.json' 'shp/swiss-contours/#{file_name}.shp'"
    # system "python lib/liljson.py -p #{LILJSON_PRECISION} 'geojson/#{file_name}.json' 'geojson/#{file_name}.json'"
  end
end

desc "Generate TopoJSON files"
task :topojson do
  rm Dir.glob("topojson/*.*json")

  src = %w{ swiss-cantons swiss-municipalities }

  # src.each do |file_name|
  #   system "topojson 'geojson/#{file_name}.json' -o 'topojson/#{file_name}.json' --properties"
  #   system "topojson 'geojson/#{file_name}.json' -o 'topojson/#{file_name}-simplified.json' -s #{TOPOJSON_PRECISION} --properties"
  # end

  %w{ contours }.each do |file_name|
    system "topojson 'shp/#{file_name}/#{file_name}.json' -o 'topojson/#{file_name}.json' -p ELEV --id-property ID"
    # system "topojson 'geojson/#{file_name}.json' -o 'topojson/#{file_name}-simplified.json' -s 10e-6 --properties"
  end

  # system "topojson #{src.map { |f| "'geojson/#{f}.json'" }.join(" ")} -o 'topojson/switzerland.json' --properties --id-property ID"
  # system "topojson #{src.map { |f| "'geojson/#{f}.json'" }.join(" ")} -o 'topojson/switzerland-simplified.json' -s #{TOPOJSON_PRECISION} --properties"
end