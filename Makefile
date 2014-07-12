CANTONS = \
	zh be lu ur sz ow nw gl zg \
	fr so bs bl sh ar ai sg gr \
	ag tg ti vd vs ne ge ju

WIDTH = 960
HEIGHT = 500
MARGIN = 10

YEAR = 2014

PROPERTIES = name=GEMNAME

CONTOUR_INTERVAL = 500

all: topo geo

topo: node_modules \
	topo/ch-country.json \
	topo/ch-cantons.json \
	topo/ch-districts.json \
	topo/ch-municipalities.json \
	topo/ch-lakes.json \
	topo/ch-country-lakes.json \
	topo/ch-cantons-lakes.json \
	topo/ch-municipalities-lakes.json \
	$(addprefix topo/,$(addsuffix -municipalities.json,$(CANTONS))) \
	topo/ch.json

geo: node_modules \
	geo/ch-country.json \
	geo/ch-cantons.json \
	geo/ch-districts.json \
	geo/ch-municipalities.json \
	geo/ch-lakes.json \
	$(addprefix geo/,$(addsuffix -municipalities.json,$(CANTONS)))

node_modules: package.json
	npm install
	touch $@

clean: clean-generated clean-downloads

clean-generated:
	rm -rf shp geo topo tif

clean-downloads:
	rm -rf downloads

.PHONY: clean clean-generated clean-downloads topo geo

.SECONDARY:

##################################################
# Boundaries and lakes
##################################################

shp/ch/municipalities.shp: src/V200/$(YEAR)/VEC200_Commune.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781) -where "COUNTRY = 'CH' AND SEENR = 0" $@ $<

shp/zh/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 1" $@ $<

shp/be/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 2" $@ $<

shp/lu/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 3" $@ $<

shp/ur/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 4" $@ $<

shp/sz/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 5" $@ $<

shp/ow/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 6" $@ $<

shp/nw/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 7" $@ $<

shp/gl/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 8" $@ $<

shp/zg/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 9" $@ $<

shp/fr/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 10" $@ $<

shp/so/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 11" $@ $<

shp/bs/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 12" $@ $<

shp/bl/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 13" $@ $<

shp/sh/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 14" $@ $<

shp/ar/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 15" $@ $<

shp/ai/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 16" $@ $<

shp/sg/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 17" $@ $<

shp/gr/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 18" $@ $<

shp/ag/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 19" $@ $<

shp/tg/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 20" $@ $<

shp/ti/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 21" $@ $<

shp/vd/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 22" $@ $<

shp/vs/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 23" $@ $<

shp/ne/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 24" $@ $<

shp/ge/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 25" $@ $<

shp/ju/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 26" $@ $<

shp/ch/lakes.shp: src/V200/2014/VEC200_Commune.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781) -where "SEENR < 9999 AND SEENR > 0" $@ $<

build/%-municipalities-unmerged.json: shp/%/municipalities.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=+BFSNR \
		-- municipalities=$<

build/ch-cantons-unmerged.json: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=+KANTONSNR \
		-- cantons=$<

build/ch-districts-unmerged.json: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=+BEZIRKSNR \
		-- districts=$<

build/ch-country-unmerged.json: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=COUNTRY \
		-- country=$<

build/ch-lakes-unmerged.json: shp/ch/lakes.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=+SEENR \
		-- lakes=$<

build/%.json: build/%-unmerged.json
	node_modules/.bin/topojson-merge \
		-o $@ \
		--in-object=$(lastword $(subst -, ,$*)) \
		--out-object=$(lastword $(subst -, ,$*)) \
		-- $<

topo/%.json: build/%.json
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		$(if $(REPROJECT),,--width=$(WIDTH) --height=$(HEIGHT) --margin=$(MARGIN)) \
		--no-pre-quantization \
		--post-quantization=1e5 \
		--simplify $(if $(REPROJECT),1e-9,.5) \
		-- $^

topo/%-lakes.json: build/%.json build/ch-lakes.json
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		$(if $(REPROJECT),,--width=$(WIDTH) --height=$(HEIGHT) --margin=$(MARGIN)) \
		--no-pre-quantization \
		--post-quantization=1e5 \
		--simplify $(if $(REPROJECT),1e-9,.5) \
		-- $^

##################################################
# PLZ (ZIP code) data
##################################################

shp/ch/plz/PLZO_PLZ.shp: downloads/plz.zip
	mkdir -p $(dir $@)
	unzip -o -j -d $(dir $@) $<
	touch $@

shp/ch/plz.shp: shp/ch/plz/PLZO_PLZ.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781) $@ $<

downloads/plz.zip:
	mkdir -p $(dir $@)
	curl http://data.geo.admin.ch.s3.amazonaws.com/ch.swisstopo-vd.ortschaftenverzeichnis_plz/PLZO_SHP_LV03.zip -L -o $@.download
	mv $@.download $@


##################################################
# Elevation contours
##################################################

shp/ch/contours.shp: shp/ch/contours-projected.shp shp/ch/country.shp
	mkdir -p $(dir $@)
	ogr2ogr -clipsrc shp/ch/country.shp $@ $<

shp/ch/contours-projected.shp: shp/ch/contours-unclipped.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326,-t_srs EPSG:21781) $@ $<

shp/ch/contours-unclipped.shp: shp/ch/contours_$(CONTOUR_INTERVAL).shp
	mkdir -p $(dir $@)
	ogr2ogr -nlt POLYGON $@ $(dir $<)contours_0.shp
	for i in `seq $(CONTOUR_INTERVAL) $(CONTOUR_INTERVAL) 4445`; do \
		ogr2ogr -update -append -nln contours-unclipped -nlt POLYGON $@ $(dir $<)contours_$$i.shp; \
	done

tif/contours/contours_$(CONTOUR_INTERVAL).tif: tif/srtm/srtm.tif
	mkdir -p $(dir $@)
	for i in `seq 0 $(CONTOUR_INTERVAL) 4445`; do \
		if [ $$i = 0 ]; then \
			gdal_calc.py -A $< --outfile=$(dir $@)contours_$$i.tif --calc="0"  --NoDataValue=-1; \
		else \
			gdal_calc.py -A $< --outfile=$(dir $@)contours_$$i.tif --calc="$$i*(A>$$i)" --NoDataValue=0; \
		fi; \
	done

shp/ch/contours_$(CONTOUR_INTERVAL).shp: tif/contours/contours_$(CONTOUR_INTERVAL).tif
	mkdir -p $(dir $@)
	for i in `seq 0 $(CONTOUR_INTERVAL) 4445`; do \
		gdal_polygonize.py -f "ESRI Shapefile" tif/contours/contours_$$i.tif $(dir $@)contours_$$i.shp contours_$$i elev; \
	done

tif/srtm/srtm.tif: tif/srtm/srtm_38_03.tif tif/srtm/srtm_39_03.tif
	mkdir -p $(dir $@)
	# gdal_merge.py -ul_lr 5.95662 47.8099 10.4935 45.8192 -o $@ $^
	gdal_merge.py -ul_lr 5.8 47.9 10.6 45.7 -o $@ $^

tif/srtm/%.tif: downloads/srtm/%.zip
	mkdir -p $(dir $@)
	unzip -o -d $(dir $@) $<
	touch $@

downloads/srtm/%.zip:
	mkdir -p $(dir $@)
	curl http://gis-lab.info/data/srtm-tif/$(notdir $@) -L -o $@.download
	mv $@.download $@

topo/ch-contours.json: shp/ch/contours.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
	$(if $(REPROJECT),,--width $(WIDTH) --height $(HEIGHT) --margin $(MARGIN)) \
	--simplify $(if $(REPROJECT),2e-9,1) \
	--id-property +elev \
	-- contours=$< | $(GROUP) > $@
