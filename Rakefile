LILJSON_PRECISION = 3

desc "Generate GeoJSON files"
task :geojson do
  rm Dir.glob("geojson/*.geojson")

  %w{ swiss-cantons swiss-cantons-simplified }.each do |file_name|
    system "ogr2ogr -f geoJSON 'geojson/#{file_name}.geojson' 'shp/#{file_name}/#{file_name}.shp' -sql \"SELECT NR AS no, ABKUERZUNG AS abbr, NAME AS name FROM '#{file_name}'\""
    system "python lib/liljson.py -p #{LILJSON_PRECISION} 'geojson/#{file_name}.geojson' 'geojson/#{file_name}.geojson'"
  end

  %w{ swiss-municipalities swiss-municipalities-simplified }.each do |file_name|
    system "ogr2ogr -f geoJSON 'geojson/#{file_name}.geojson' 'shp/#{file_name}/#{file_name}.shp' -sql \"SELECT BFSNR AS bfsNo, GEMTEIL AS municipalityPart, KANTONSNR AS cantonNo, GEMNAME AS name FROM '#{file_name}'\""
    system "python lib/liljson.py -p #{LILJSON_PRECISION} 'geojson/#{file_name}.geojson' 'geojson/#{file_name}.geojson'"
  end
end

desc "Generate TopoJSON files"
task :topojson do
  rm Dir.glob("topojson/*.topojson")

  %w{ swiss-cantons swiss-municipalities }.each do |file_name|
    system "topojson 'geojson/#{file_name}.geojson' -o 'topojson/#{file_name}.topojson' --properties"
    system "topojson 'geojson/#{file_name}.geojson' -o 'topojson/#{file_name}-simplified.topojson' -s 1000 --properties"
  end
end