CANTONS = \
	zh be lu ur sz ow nw gl zg \
	fr so bs bl sh ar ai sg gr \
	ag tg ti vd vs ne ge ju

CANTONS_WITH_LAKES = \
	zh be lu ur sz ow nw gl zg \
	fr sh sg \
	ag tg ti vd vs ne ge

WIDTH = 960
HEIGHT = 500
MARGIN = 10

YEAR = 2015

PROPERTIES =

ENCODING = utf8

CONTOUR_INTERVAL = 500

ifndef SIMPLIFY
	SIMPLIFY = $(if $(REPROJECT),1e-9,.5)
endif

all: topo

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
	$(addprefix topo/,$(addsuffix -municipalities-lakes.json,$(CANTONS_WITH_LAKES))) \
	topo/ch.json

node_modules: package.json
	npm install
	touch $@

# Return repo to a pristine state
clobber:
	git clean -dxf

# Clean generated files
clean:
	rm -rf build topo svg

clean-generated:
	@echo "\033[1;33m\`make clean-generated\` is DEPRECATED. Use \`make clean\` instead.\033[0m"
	rm -rf build topo svg

clean-downloads:
	@echo "\033[1;33m\`make clean-downloads\` is DEPRECATED. Use \`make clobber\` instead.\033[0m"
	rm -rf downloads

.PHONY: clean clobber clean-generated clean-downloads topo

.SECONDARY:

##################################################
# Boundaries and lakes
##################################################

build/ch/municipalities.shp: src/V200/$(YEAR)/VEC200_Commune.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781) -where "COUNTRY = 'CH'" $@ $<

build/ch/municipalities-without-lakes.shp: src/V200/$(YEAR)/VEC200_Commune.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781) -where "COUNTRY = 'CH' AND SEENR = 0" $@ $<

build/zh/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 1" $@ $<

build/be/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 2" $@ $<

build/lu/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 3" $@ $<

build/ur/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 4" $@ $<

build/sz/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 5" $@ $<

build/ow/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 6" $@ $<

build/nw/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 7" $@ $<

build/gl/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 8" $@ $<

build/zg/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 9" $@ $<

build/fr/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 10" $@ $<

build/so/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 11" $@ $<

build/bs/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 12" $@ $<

build/bl/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 13" $@ $<

build/sh/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 14" $@ $<

build/ar/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 15" $@ $<

build/ai/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 16" $@ $<

build/sg/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 17" $@ $<

build/gr/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 18" $@ $<

build/ag/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 19" $@ $<

build/tg/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 20" $@ $<

build/ti/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 21" $@ $<

build/vd/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 22" $@ $<

build/vs/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 23" $@ $<

build/ne/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 24" $@ $<

build/ge/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 25" $@ $<

build/ju/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "KANTONSNR = 26" $@ $<

build/ch/lakes.shp: src/V200/2014/VEC200_Commune.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781) -where "SEENR < 9999 AND SEENR > 0" $@ $<

build/zh/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9050, 9040)" $@ $<

build/be/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9089, 9073, 9148, 9151)" $@ $<

build/lu/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9157, 9175, 9179, 9172, 9163)" $@ $<

build/ur/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9179)" $@ $<

build/sz/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9216, 9050, 9179, 9175)" $@ $<

build/ow/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9179, 9239)" $@ $<

build/nw/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9179)" $@ $<

build/gl/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9267)" $@ $<

build/zg/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9270, 9175)" $@ $<

build/fr/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9276, 9151, 9294)" $@ $<

build/sh/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9326)" $@ $<

build/sg/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9050, 9267, 9326)" $@ $<

build/ag/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9172)" $@ $<

build/tg/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9326)" $@ $<

build/ti/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9711, 9710)" $@ $<

build/vd/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9751, 9757, 9151, 9294)" $@ $<

build/vs/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9757)" $@ $<

build/ne/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9148, 9151)" $@ $<

build/ge/lakes.shp: build/ch/lakes.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -where "SEENR IN (9757)" $@ $<

build/cantons.tsv: src/V200/$(YEAR)/VEC200_ADMLVL1.dbf
	mkdir -p $(dir $@)
	node_modules/.bin/dbf2dsv \
		-e $(ENCODING) \
		-o $@ \
		-- $<

build/districts.tsv: src/V200/$(YEAR)/VEC200_ADMLVL2.dbf
	mkdir -p $(dir $@)
	node_modules/.bin/dbf2dsv \
		-e $(ENCODING) \
		-o $@ \
		-- $<

build/municipalities.tsv: src/V200/$(YEAR)/VEC200_Commune.dbf
	mkdir -p $(dir $@)
	node_modules/.bin/dbf2dsv \
		-e $(ENCODING) \
		-o $@ \
		-- $<

build/%-municipalities-unmerged.json: build/%/municipalities.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=+BFSNR \
		-p name=GEMNAME,id=+BFSNR \
		-- municipalities=$<

build/ch-cantons-unmerged.json: build/ch/municipalities.shp build/cantons.tsv
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=+KANTONSNR \
		-e build/cantons.tsv \
		-p abbr=KUERZEL,name=KANTONSNAM,id=+KANTONSNR \
		-- cantons=$<

# Currently without names because joining to build/districts.tsv prevents the 'canton' property to be set on districts where it's needed (i.e. districts with BEZIRKSNR = 0)
build/ch-districts-unmerged.json: build/ch/municipalities-without-lakes.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=+BEZIRKSNR \
		-p id=+BEZIRKSNR,canton=+KANTONSNR \
		-- districts=$<

build/ch-country-unmerged.json: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=COUNTRY \
		-- country=$<

build/%-lakes-unmerged.json: build/%/lakes.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		--no-quantization \
		--id-property=+SEENR \
		-p name=SEENAME,id=+SEENR \
		-- lakes=$<

build/%.json: build/%-unmerged.json
	node_modules/.bin/topojson-merge \
		-o $@ \
		--in-object=$(lastword $(subst -, ,$*)) \
		--out-object=$(lastword $(subst -, ,$*)) \
		-- $<

# Infer district id for districts with id 0 from the canton number. E.g. Geneva has technically no districts but on district maps it has the id 2500
build/ch-districts.json: build/ch-districts-unmerged.json
	node_modules/.bin/topojson-merge \
		-o $@ \
		--in-object=districts \
		--out-object=districts \
		--key='d.id === 0 ? d.properties.canton * 100 : d.id' \
		-- $<

topo/%.json: build/%.json
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		$(if $(REPROJECT),,--width=$(WIDTH) --height=$(HEIGHT) --margin=$(MARGIN)) \
		--no-pre-quantization \
		--post-quantization=1e5 \
		--simplify=$(SIMPLIFY) \
		$(if $(PROPERTIES),-p $(PROPERTIES),) \
		-- $<

topo/%-municipalities-lakes.json: build/%-municipalities.json build/%-lakes.json
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		$(if $(REPROJECT),,--width=$(WIDTH) --height=$(HEIGHT) --margin=$(MARGIN)) \
		--no-pre-quantization \
		--post-quantization=1e5 \
		--simplify=$(SIMPLIFY) \
		$(if $(PROPERTIES),-p $(PROPERTIES),) \
		-- $^

topo/ch-%-lakes.json: build/ch-%.json build/ch-lakes.json
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		$(if $(REPROJECT),,--width=$(WIDTH) --height=$(HEIGHT) --margin=$(MARGIN)) \
		--no-pre-quantization \
		--post-quantization=1e5 \
		--simplify=$(SIMPLIFY) \
		$(if $(PROPERTIES),-p $(PROPERTIES),) \
		-- $^

topo/ch.json: $(addprefix build/ch-,$(addsuffix .json,municipalities cantons districts country lakes))
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		-o $@ \
		$(if $(REPROJECT),,--width=$(WIDTH) --height=$(HEIGHT) --margin=$(MARGIN)) \
		--no-pre-quantization \
		--post-quantization=1e5 \
		--simplify=$(SIMPLIFY) \
		$(if $(PROPERTIES),-p $(PROPERTIES),) \
		-- $^

svg/%.svg: topo/%.json
	mkdir -p $(dir $@)
	node_modules/.bin/topojson-svg \
		-o $@ \
		-- $<


##################################################
# PLZ (ZIP code)
##################################################

build/ch/plz/PLZO_PLZ.shp: downloads/plz.zip
	mkdir -p $(dir $@)
	rm -f $@
	unzip -o -j -d $(dir $@) $<
	touch $@

build/ch/plz.shp: build/ch/plz/PLZO_PLZ.shp
	mkdir -p $(dir $@)
	rm -f $@
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
		--simplify=$(SIMPLIFY) \
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
	rm -f $@
	for i in `seq 0 $(CONTOUR_INTERVAL) 4445`; do \
		gdal_polygonize.py -f "ESRI Shapefile" build/contours/contours_$$i.tif $(dir $@)contours_$$i.shp contours_$$i elev; \
	done

build/ch/country.shp: src/swissBOUNDARIES3D/2014/swissBOUNDARIES3D_1_1_TLM_LANDESGEBIET.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781,) -where "ICC = 'CH'" $@ $<

build/ch/contours-unclipped.shp: build/ch/contours_$(CONTOUR_INTERVAL).shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -nlt POLYGON $@ $(dir $<)contours_0.shp
	for i in `seq $(CONTOUR_INTERVAL) $(CONTOUR_INTERVAL) 4445`; do \
		ogr2ogr -update -append -nln contours-unclipped -nlt POLYGON $@ $(dir $<)contours_$$i.shp; \
	done

build/ch/contours-projected.shp: build/ch/contours-unclipped.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr $(if $(REPROJECT),,-t_srs EPSG:21781 -s_srs EPSG:4326) $@ $<

build/ch/contours.shp: build/ch/contours-projected.shp build/ch/country.shp
	mkdir -p $(dir $@)
	rm -f $@
	ogr2ogr -clipsrc build/ch/country.shp $@ $<

topo/ch-contours.json: build/ch/contours.shp
	mkdir -p $(dir $@)
	node_modules/.bin/topojson \
		$(if $(REPROJECT),,--width $(WIDTH) --height $(HEIGHT) --margin $(MARGIN)) \
		--simplify=$(SIMPLIFY) \
		--id-property=+elev \
		-- contours=$< \
	| node_modules/.bin/topojson-group \
		-o $@
