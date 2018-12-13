YEAR = 2018
PROPERTIES = id,name
CANTONS = \
	zh be lu ur sz ow nw gl zg \
	fr so bs bl sh ar ai sg gr \
	ag tg ti vd vs ne ge ju
WIDTH = 960
HEIGHT = 500
MARGIN = 10
SIMPLIFY = $(if $(REPROJECT),1e-9,.5)

ifeq ($(shell test $(YEAR) -gt 2015; echo $$?),0)
  VEC = VECTOR200_HOHEITSGEBIET.shp
else
  VEC = VEC200_Commune.shp
endif

all: node_modules \
	$(addprefix topo/,$(addsuffix -municipalities.json,$(CANTONS)))

node_modules: package.json
	npm install
	touch $@

# Clean generated files
clean:
	rm -rf build topo svg

##################################################
# Boundaries and lakes
##################################################
build/ch/municipalities.shp: src/V200/$(YEAR)/$(VEC)
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781) -where "CAST(BFS_NUMMER as integer(4)) > 0 AND CAST(BFS_NUMMER as integer(4)) < 9000" $@ $<; \
	else \
		ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326 -s_srs EPSG:21781) -where "COUNTRY = 'CH'" $@ $<; \
	fi

build/zh/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH01000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 1 AND SEENR = 0" $@ $<; \
	fi

build/be/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH02000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 2 AND SEENR = 0" $@ $<; \
	fi

build/lu/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH03000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 3 AND SEENR = 0" $@ $<; \
	fi

build/ur/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH04000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 4 AND SEENR = 0" $@ $<; \
	fi

build/sz/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH05000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 5 AND SEENR = 0" $@ $<; \
	fi

build/ow/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH06000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 6 AND SEENR = 0" $@ $<; \
	fi

build/nw/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH07000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 7 AND SEENR = 0" $@ $<; \
	fi

build/gl/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH08000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 8 AND SEENR = 0" $@ $<; \
	fi

build/zg/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH09000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 9 AND SEENR = 0" $@ $<; \
	fi

build/fr/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH10000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 10 AND SEENR = 0" $@ $<; \
	fi

build/so/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH11000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 11 AND SEENR = 0" $@ $<; \
	fi

build/bs/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH12000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 12 AND SEENR = 0" $@ $<; \
	fi

build/bl/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH13000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 13 AND SEENR = 0" $@ $<; \
	fi

build/sh/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH14000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 14 AND SEENR = 0" $@ $<; \
	fi

build/ar/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH15000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 15 AND SEENR = 0" $@ $<; \
	fi

build/ai/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH16000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 16 AND SEENR = 0" $@ $<; \
	fi

build/sg/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH17000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 17 AND SEENR = 0" $@ $<; \
	fi

build/gr/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH18000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 18 AND SEENR = 0" $@ $<; \
	fi

build/ag/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH19000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 19 AND SEENR = 0" $@ $<; \
	fi

build/tg/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH20000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 20 AND SEENR = 0" $@ $<; \
	fi

build/ti/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH21000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 21 AND SEENR = 0" $@ $<; \
	fi

build/vd/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH22000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 22 AND SEENR = 0" $@ $<; \
	fi

build/vs/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH23000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 23 AND SEENR = 0" $@ $<; \
	fi

build/ne/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH24000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 24 AND SEENR = 0" $@ $<; \
	fi

build/ge/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH25000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 25 AND SEENR = 0" $@ $<; \
	fi

build/ju/municipalities.shp: build/ch/municipalities.shp
	mkdir -p $(dir $@)
	rm -f $@
	if [ ${YEAR} -gt 2015 ] ; then \
		ogr2ogr -where "KANTONSNUM = 'CH26000000'" $@ $<; \
	else \
		ogr2ogr -where "KANTONSNR = 26 AND SEENR = 0" $@ $<; \
	fi

build/%-municipalities-unmerged.json: build/%/municipalities.shp
	mkdir -p $(dir $@)
	if [ ${YEAR} -gt 2015 ] ; then \
		node_modules/.bin/topojson \
			-o $@ \
			--no-quantization \
			--id-property=+BFS_NUMMER \
			-p name=NAME,id=+BFS_NUMMER \
			-- municipalities=$<; \
	else \
		node_modules/.bin/topojson \
			-o $@ \
			--no-quantization \
			--id-property=+BFSNR \
			-p name=GEMNAME,id=+BFSNR \
			-- municipalities=$<; \
	fi

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
		--simplify=$(SIMPLIFY) \
		$(if $(PROPERTIES),-p $(PROPERTIES),) \
		-- $<
