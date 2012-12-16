LILJSON_PRECISION = 3

desc "Generate GeoJSON files"
task :geojson do
  rm Dir.glob("geojson/*.*json")

  %w{ swiss-cantons swiss-cantons-simplified }.each do |file_name|
    system "ogr2ogr -f geoJSON 'geojson/#{file_name}.json' 'shp/#{file_name}/#{file_name}.shp' -sql \"SELECT NR AS no, ABKUERZUNG AS abbr, NAME AS name FROM '#{file_name}'\""
    system "python lib/liljson.py -p #{LILJSON_PRECISION} 'geojson/#{file_name}.json' 'geojson/#{file_name}.json'"
  end

  %w{ swiss-municipalities swiss-municipalities-simplified }.each do |file_name|
    system "ogr2ogr -f geoJSON 'geojson/#{file_name}.json' 'shp/#{file_name}/#{file_name}.shp' -sql \"SELECT BFSNR AS bfsNo, GEMTEIL AS municipalityPart, KANTONSNR AS cantonNo, GEMNAME AS name FROM '#{file_name}'\""
    system "python lib/liljson.py -p #{LILJSON_PRECISION} 'geojson/#{file_name}.json' 'geojson/#{file_name}.json'"
  end
end

desc "Generate TopoJSON files"
task :topojson do
  rm Dir.glob("topojson/*.*json")

  src = %w{ swiss-cantons swiss-municipalities }

  src.each do |file_name|
    system "topojson 'geojson/#{file_name}.json' -o 'topojson/#{file_name}.json' --properties"
    system "topojson 'geojson/#{file_name}.json' -o 'topojson/#{file_name}-simplified.json' -s 1000 --properties"
  end

  system "topojson #{src.map { |f| "'geojson/#{f}.json'" }.join(" ")} -o 'topojson/swiss-cantons-municipalities.json' --properties"
  system "topojson #{src.map { |f| "'geojson/#{f}.json'" }.join(" ")} -o 'topojson/swiss-cantons-municipalities-simplified.json' -s 1000 --properties"
end