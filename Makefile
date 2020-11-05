#
# Geodata
# https://www.bfs.admin.ch/bfs/de/home/dienstleistungen/geostat/geodaten-bundesstatistik/administrative-grenzen/generalisierte-gemeindegrenzen.html
#

YEARS := 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020

.PHONY: all topojson shapefile clean-generated

all: shapefile topojson

shapefile: $(foreach year,$(YEARS),shapefile-$(year))

topojson: \
	$(foreach year,$(YEARS),$(year)/ch.json)

clean-generated:
	rm -rf 20*/

# ---

SHAPEFILE_TARGETS := $(foreach ext,shp dbf prj shx,$(foreach type,municipalities cantons countries lakes districts,20%/$(type).$(ext)))
.PRECIOUS: $(SHAPEFILE_TARGETS)

shapefile-20%: $(SHAPEFILE_TARGETS)
	@echo Shapefiles 20$* extracted

20%/ch.json: $(SHAPEFILE_TARGETS)
	mkdir -p $(dir $@)
	yarn run mapshaper \
	  -i 20$*/countries.shp 20$*/municipalities.shp 20$*/cantons.shp 20$*/lakes.shp combine-files string-fields=* encoding=utf8 \
		-clean \
	  -rename-layers countries,municipalities,cantons,lakes \
	  -proj wgs84 \
		-simplify 50% \
	  -o format=topojson drop-table id-field=GMDNR,GMDE,BZNR,BEZIRK,KTNR,KT,CODE_ISO,CH_ISO $@

# Generate targets based on
#   - types (g=Gemeinde, k=Kanton, l=Landesgrenze, s=See), and
#   - extensions (shp, dbf, prj)
#
# Examples: 2020/g.shp, 2019/l.dbf, etc.

define extract_from_archive
## 2010 – 2017 contain unique folder structures
2010/$(1).$(2): downloads/2010.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< g1g10_shp_121130/$$(subst l1,L1,$$(subst s1,S1,$$(subst k1,K1,$$(subst g1,G1,$$(subst b1,B1,G1$$(call rename,$(1))10.$(2)))))) > $$@
2011/$(1).$(2): downloads/2011.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< g1g11_shp_121130/$$(subst l1,L1,$$(subst s1,S1,$$(subst k1,K1,$$(subst g1,G1,$$(subst b1,B1,G1$$(call rename,$(1))11.$(2)))))) > $$@
2012/$(1).$(2): downloads/2012.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< g1g12_shp_121130/$$(subst l1,L1,$$(subst s1,S1,$$(subst k1,K1,$$(subst g1,G1,$$(subst b1,B1,G1$$(call rename,$(1))12.$(2)))))) > $$@
2013/$(1).$(2): downloads/2013.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2013/shp/g1$$(call rename,$(1))13.$(2) > $$@
2014/$(1).$(2): downloads/2014.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2014/shp/g1$$(call rename,$(1))14.$(2) > $$@
2015/$(1).$(2): downloads/2015.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< shp/g1$$(call rename,$(1))15.$(2) > $$@
2016/$(1).$(2): downloads/2016.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2016/shp/g1$$(call rename,$(1))16.$(2) > $$@
2017/$(1).$(2): downloads/2017.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2017/shp/LV95/g1$$(call rename,$(1))17.$(2) > $$@

# Files from 2018 on seem to be consistently structured
20%/$(1).$(2): downloads/20%.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_20$$*-LV95/shp/g1$$(call rename,$(1))$$*.$(2) > $$@
endef
$(foreach type,municipalities cantons countries lakes districts,$(foreach ext,shp dbf prj shx,$(eval $(call extract_from_archive,$(type),$(ext)))))

rename = $(if $(findstring districts,$(1)),b,$(if $(findstring lakes,$(1)),s,$(if $(findstring municipalities,$(1)),g,$(if $(findstring cantons,$(1)),k,$(if $(findstring countries,$(1)),l,$(if $(findstring b,$(1)),districts,$(if $(findstring s,$(1)),lakes,$(if $(findstring g,$(1)),municipalities,$(if $(findstring k,$(1)),cantons,$(if $(findstring l,$(1)),countries,$(1)))))))))))

test-rename:
	@echo 'l -> $(call rename,l)'
	@echo 's -> $(call rename,s)'
	@echo 'g -> $(call rename,g)'
	@echo 'k -> $(call rename,k)'
	@echo 'b -> $(call rename,b)'
	@echo 'countries -> $(call rename,countries)'
	@echo 'lakes -> $(call rename,lakes)'
	@echo 'municipalities -> $(call rename,municipalities)'
	@echo 'cantons -> $(call rename,cantons)'
	@echo 'districts -> $(call rename,districts)'

downloads/2020.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/11947559/master"

downloads/2019.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/7566557/master"

downloads/2018.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/5247306/master"

downloads/2016.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/1902553/master"

downloads/2017.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/4342877/master"

downloads/2015.zip:
	mkdir -p $(dir $@)
	curl -o downloads/2015.tmp.zip "https://www.bfs.admin.ch/bfsstatic/dam/assets/330759/master"
	unzip -p downloads/2015.tmp.zip GGG_15_V161025.zip > $@
	rm downloads/2015.tmp.zip

downloads/2014.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/328824/master"

downloads/2013.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/282011/master"

downloads/2012.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/301391/master"

downloads/2011.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/301387/master"

downloads/2010.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/301383/master"

