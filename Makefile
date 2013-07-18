TOPOJSON = node_modules/.bin/topojson
GEOJSON = node_modules/.bin/geojson
CANTONS = \
	zh be lu ur sz ow nw gl zg \
	fr so bs bl sh ar ai sg gr \
	ag tg ti vd vs ne ge ju

WIDTH = 960
HEIGHT = 500

all: topo geo

topo: node_modules \
	topo/ch-country.json \
	topo/ch-cantons.json \
	topo/ch-districts.json \
	topo/ch-municipalities.json \
	$(addprefix topo/,$(addsuffix -municipalities.json,$(CANTONS))) \
	topo/ch.json

geo: node_modules \
	geo/ch-country.json \
	geo/ch-cantons.json \
	geo/ch-districts.json \
	geo/ch-municipalities.json \
	$(addprefix geo/,$(addsuffix -municipalities.json,$(CANTONS)))

node_modules:
	npm install

clean:
	rm -rf shp geo topo tmp

.PHONY: clean topo geo

##################################################
# Shapefiles
##################################################

shp/ch/country.shp: src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_LANDESGEBIET.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326) -where "ICC = 'CH'" $@ $<

shp/ch/cantons.shp: src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_KANTONSGEBIET.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326) -where "ICC = 'CH'" $@ $<

shp/ch/districts.shp: src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_BEZIRKSGEBIET.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326) -where "ICC = 'CH'" $@ $<

shp/ch/municipalities.shp: src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_HOHEITSGEBIET.shp
	mkdir -p $(dir $@)
	ogr2ogr $(if $(REPROJECT),-t_srs EPSG:4326) -where "ICC = 'CH'" $@ $<

shp/zh/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 1" $@ $<

shp/be/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 2" $@ $<

shp/lu/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 3" $@ $<

shp/ur/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 4" $@ $<

shp/sz/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 5" $@ $<

shp/ow/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 6" $@ $<

shp/nw/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 7" $@ $<

shp/gl/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 8" $@ $<

shp/zg/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 9" $@ $<

shp/fr/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 10" $@ $<

shp/so/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 11" $@ $<

shp/bs/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 12" $@ $<

shp/bl/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 13" $@ $<

shp/sh/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 14" $@ $<

shp/ar/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 15" $@ $<

shp/ai/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 16" $@ $<

shp/sg/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 17" $@ $<

shp/gr/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 18" $@ $<

shp/ag/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 19" $@ $<

shp/tg/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 20" $@ $<

shp/ti/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 21" $@ $<

shp/vd/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 22" $@ $<

shp/vs/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 23" $@ $<

shp/ne/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 24" $@ $<

shp/ge/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 25" $@ $<

shp/ju/municipalities.shp: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "KANTONSNUM = 26" $@ $<

##################################################
# TopoJSON
##################################################

topo/ch-country.json: shp/ch/country.shp
	mkdir -p $(dir $@)
	$(TOPOJSON) \
	--simplify $(if $(REPROJECT),2e-9,1) \
	$(if $(REPROJECT),,--width $(WIDTH) --height $(HEIGHT)) \
	--id-property ICC \
	-p name=NAME \
	-- country=$< | bin/topomergeids country > $@

topo/ch-cantons.json: shp/ch/cantons.shp
	mkdir -p $(dir $@)
	$(TOPOJSON) \
	--simplify $(if $(REPROJECT),2e-9,1) \
	$(if $(REPROJECT),,--width $(WIDTH) --height $(HEIGHT)) \
	--e meta/cantons.csv \
	--id-property +KANTONSNUM \
	-p name=NAME,abbr=ABBR \
	-- cantons=$< | bin/topomergeids cantons > $@

topo/ch-districts.json: shp/ch/districts.shp
	mkdir -p $(dir $@)
	$(TOPOJSON) \
	--simplify $(if $(REPROJECT),2e-9,1) \
	$(if $(REPROJECT),,--width $(WIDTH) --height $(HEIGHT)) \
	--id-property +BEZIRKSNUM \
	-p name=NAME \
	-- districts=$< | bin/topomergeids districts > $@

topo/ch-municipalities.json: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	$(TOPOJSON) \
	--simplify $(if $(REPROJECT),2e-9,1) \
	$(if $(REPROJECT),,--width $(WIDTH) --height $(HEIGHT)) \
	--id-property +BFS_NUMMER \
	-p name=NAME \
	-- municipalities=$< | bin/topomergeids municipalities > $@

topo/%-municipalities.json: shp/%/municipalities.shp
	mkdir -p $(dir $@)
	$(TOPOJSON) \
	--simplify $(if $(REPROJECT),2e-9,1) \
	$(if $(REPROJECT),,--width $(WIDTH) --height $(HEIGHT)) \
	--id-property +BFS_NUMMER \
	-p name=NAME \
	-- municipalities=$< | bin/topomergeids municipalities > $@

topo/ch.json: topo/ch-country.json topo/ch-cantons.json topo/ch-districts.json topo/ch-municipalities.json
	mkdir -p $(dir $@)
	$(TOPOJSON) \
	-p \
	-- $^ > $@

##################################################
# GeoJSON
##################################################

geo/ch-%.json: topo/ch-%.json
	mkdir -p $(dir $@)
	mkdir -p tmp/geo-ch
	$(GEOJSON) \
	--precision 3 \
	-o tmp/geo-ch/ \
	-- $<
	mv tmp/geo-ch/$*.json $@
	rm -rf tmp/geo-ch/

geo/%-municipalities.json: topo/%-municipalities.json
	mkdir -p $(dir $@)
	mkdir -p tmp/geo-$*
	$(GEOJSON) \
	--precision 3 \
	-o tmp/geo-$*/ \
	-- $<
	mv tmp/geo-$*/municipalities.json $@
	rm -rf tmp/geo-$*/