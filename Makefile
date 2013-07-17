TOPOJSON = node_modules/.bin/topojson
GEOJSON = node_modules/.bin/geojson
CANTONS = \
	zh be lu ur sz ow nw gl zg \
	fr so bs bl sh ar ai sg gr \
	ag tg ti vd vs ne ge ju

WIDTH = 960
HEIGHT = 500

all: topo/ch.json;

shp/ch/country.shp: src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_LANDESGEBIET.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "NAME = 'Schweiz'" $@ $<

shp/ch/cantons.shp: src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_KANTONSGEBIET.shp
	mkdir -p $(dir $@)
	cp $(basename $<).shp $@
	cp $(basename $<).dbf $(basename $@).dbf
	cp $(basename $<).prj $(basename $@).prj
	cp $(basename $<).shx $(basename $@).shx

shp/ch/municipalities.shp: src/swissBOUNDARIES3D/swissBOUNDARIES3D_1_1_TLM_HOHEITSGEBIET.shp
	mkdir -p $(dir $@)
	ogr2ogr -where "ICC = 'CH'" $@ $<

topo/ch-country.json: shp/ch/country.shp
	mkdir -p $(dir $@)
	$(TOPOJSON) \
	--simplify 1 \
	--width $(WIDTH) \
	--height $(HEIGHT) \
	--id-property NAME \
	-p name=NAME \
	-- country=$< | bin/topomergebyid country > $@

topo/ch-cantons.json: shp/ch/cantons.shp
	mkdir -p $(dir $@)
	$(TOPOJSON) \
	--simplify 1 \
	--width $(WIDTH) \
	--height $(HEIGHT) \
	--e meta/cantons.csv \
	--id-property +KANTONSNUM \
	-p name=NAME,abbr=ABBR \
	-- cantons=$< | bin/topomergebyid cantons > $@

topo/ch-municipalities.json: shp/ch/municipalities.shp
	mkdir -p $(dir $@)
	$(TOPOJSON) \
	--simplify 1 \
	--width $(WIDTH) \
	--height $(HEIGHT) \
	--id-property +BFS_NUMMER \
	-p name=NAME,cantonId=+KANTONSNUM \
	-- municipalities=$< | bin/topomergebyid municipalities > $@

topo/ch.json: topo/ch-country.json topo/ch-cantons.json topo/ch-municipalities.json
	mkdir -p $(dir $@)
	$(TOPOJSON) \
	--width $(WIDTH) \
	--height $(HEIGHT) \
	-p \
	-- $^ > $@

geo/%.json: topo/%.json
	mkdir -p $(dir $@)
	$(GEOJSON) \
	--precision 3 \
	-o geo \
	-- $<

.PHONY: clean
clean:
	-rm -rf shp/* geo/* topo/*