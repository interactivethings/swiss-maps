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
	topo/ch-districts-lakes.json \
	topo/ch-municipalities-lakes.json \
	$(addprefix topo/,$(addsuffix -municipalities.json,$(CANTONS))) \
	topo/ch.json

node_modules: package.json
	npm install
	touch $@

clean: clean-generated clean-downloads

clean-generated:
	rm -rf build topo

clean-downloads:
	rm -rf downloads

.PHONY: clean clean-generated clean-downloads topo geo

.SECONDARY:

##################################################
# Boundaries and lakes
##################################################

build/ch/municipalities.shp: src/V200/$(YEAR)/VEC200_Commune.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781) -where "COUNTRY = 'CH' AND SEENR = 0" $@ $<

build/zh/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 1" $@ $<

build/be/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 2" $@ $<

build/lu/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 3" $@ $<

build/ur/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 4" $@ $<

build/sz/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 5" $@ $<

build/ow/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 6" $@ $<

build/nw/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 7" $@ $<

build/gl/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 8" $@ $<

build/zg/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 9" $@ $<

build/fr/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 10" $@ $<

build/so/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 11" $@ $<

build/bs/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 12" $@ $<

build/bl/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 13" $@ $<

build/sh/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 14" $@ $<

build/ar/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 15" $@ $<

build/ai/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 16" $@ $<

build/sg/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 17" $@ $<

build/gr/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 18" $@ $<

build/ag/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 19" $@ $<

build/tg/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 20" $@ $<

build/ti/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 21" $@ $<

build/vd/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 22" $@ $<

build/vs/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 23" $@ $<

build/ne/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 24" $@ $<

build/ge/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 25" $@ $<

build/ju/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNR = 26" $@ $<

build/ch/lakes.shp: src/V200/2014/VEC200_Commune.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781) -where "SEENR < 9999 AND SEENR > 0" $@ $<

build/%-municipalities-unmerged.json: build/%/municipalities.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=+BFSNR \
		-- municipalities=$<

build/ch-cantons-unmerged.json: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=+KANTONSNR \
		-- cantons=$<

build/ch-districts-unmerged.json: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=+BEZIRKSNR \
		-- districts=$<

build/ch-country-unmerged.json: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=COUNTRY \
		-- country=$<

build/ch-lakes-unmerged.json: build/ch/lakes.shp
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
		-- $<

topo/%-lakes.json: build/%.json build/ch-lakes.json
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		$(if $(REPROJECT),,--width=$(WIDTH) --height=$(HEIGHT) --margin=$(MARGIN)) \
		--no-pre-quantization \
		--post-quantization=1e5 \
		--simplify $(if $(REPROJECT),1e-9,.5) \
		-- $^

topo/ch.json: $(addprefix build/ch-,$(addsuffix .json,municipalities cantons districts country lakes))
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		$(if $(REPROJECT),,--width=$(WIDTH) --height=$(HEIGHT) --margin=$(MARGIN)) \
		--no-pre-quantization \
		--post-quantization=1e5 \
		--simplify $(if $(REPROJECT),1e-9,.5) \
		-- $^

##################################################
# PLZ (ZIP code)
##################################################

build/ch/plz/PLZO_PLZ.shp: downloads/plz.zip
	mkdir -p $(dir $@)
	unzip -o -j -d $(dir $@) $<
	touch $@

build/ch/plz.shp: build/ch/plz/PLZO_PLZ.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781) $@ $<

downloads/plz.zip:
	mkdir -p $(dir $@)
	curl http://data.geo.admin.ch.s3.amazonaws.com/ch.swisstopo-vd.ortschaftenverzeichnis_plz/PLZO_SHP_LV03.zip -L -o $@.download
	mv $@.download $@

topo/ch-plz.json: build/ch/plz.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		$(if $(REPROJECT),,--width $(WIDTH) --height $(HEIGHT) --margin $(MARGIN)) \
		--simplify $(if $(REPROJECT),1e-9,.5) \
		--id-property +PLZ \
		-- plz=$<

##################################################
# Elevation contours
##################################################

downloads/srtm/%.zip:
	mkdir -p $(dir $@)
	curl http://gis-lab.info/data/srtm-tif/$(notdir $@) -L -o $@.download
	mv $@.download $@

build/srtm/%.tif: downloads/srtm/%.zip
	mkdir -p $(dir $@)
	unzip -o -d $(dir $@) $<
	touch $@

build/srtm/srtm.tif: build/srtm/srtm_38_03.tif build/srtm/srtm_39_03.tif
	mkdir -p $(dir $@)
	gdal_merge.py -ul_lr 5.8 47.9 10.6 45.7 -o $@ $^

build/contours/contours_$(CONTOUR_INTERVAL).tif: build/srtm/srtm.tif
	mkdir -p $(dir $@)
	for i in `seq 0 $(CONTOUR_INTERVAL) 4445`; do \
		if [ $$i = 0 ]; then \
			gdal_calc.py -A $< --outfile=$(dir $@)contours_$$i.tif --calc="0"  --NoDataValue=-1; \
		else \
			gdal_calc.py -A $< --outfile=$(dir $@)contours_$$i.tif --calc="$$i*(A>$$i)" --NoDataValue=0; \
		fi; \
	done

build/ch/contours_$(CONTOUR_INTERVAL).shp: build/contours/contours_$(CONTOUR_INTERVAL).tif
	mkdir -p $(dir $@)
	for i in `seq 0 $(CONTOUR_INTERVAL) 4445`; do \
		gdal_polygonize.py -f "ESRI Shapefile" build/contours/contours_$$i.tif $(dir $@)contours_$$i.shp contours_$$i elev; \
	done

build/ch/country.shp: src/swissBOUNDARIES3D/2014/swissBOUNDARIES3D_1_1_TLM_LANDESGEBIET.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781,) -where "ICC = 'CH'" $@ $<

build/ch/contours-unclipped.shp: build/ch/contours_$(CONTOUR_INTERVAL).shp
	mkdir -p $(dir $@)
	ogr2ogr -nlt POLYGON $@ $(dir $<)contours_0.shp
	for i in `seq $(CONTOUR_INTERVAL) $(CONTOUR_INTERVAL) 4445`; do \
		ogr2ogr -update -append -nln contours-unclipped -nlt POLYGON $@ $(dir $<)contours_$$i.shp; \
	done

build/ch/contours-projected.shp: build/ch/contours-unclipped.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),,-t_srs EPSG:21781 -s_srs EPSG:4326) $@ $<

build/ch/contours.shp: build/ch/contours-projected.shp build/ch/country.shp
	mkdir -p $(dir $@)
	ogr2ogr -clipsrc build/ch/country.shp $@ $<

topo/ch-contours.json: build/ch/contours.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		$(if $(REPROJECT),,--width $(WIDTH) --height $(HEIGHT) --margin $(MARGIN)) \
		--simplify $(if $(REPROJECT),1e-9,.5) \
		--id-property=+elev \
		-- contours=$< \
	| node_modules/.bin/topojson-group \
		-o $@
