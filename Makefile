#
# Geodata
# https://www.bfs.admin.ch/bfs/de/home/dienstleistungen/geostat/geodaten-bundesstatistik/administrative-grenzen/generalisierte-gemeindegrenzen.html
#

YEARS := 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020 2021 2021-04 2021-07 2022 2022-05 2023 2024
SHAPES := country cantons districts municipalities lakes
SHAPEFILE_EXT := shp dbf prj shx

.PHONY: all topojson shapefile clean-generated

all: shapefile topojson

shapefile: \
	$(foreach year,$(YEARS),$(year)/country.shp) \
	$(foreach year,$(YEARS),$(year)/cantons.shp) \
	$(foreach year,$(YEARS),$(year)/districts.shp) \
	$(foreach year,$(YEARS),$(year)/municipalities.shp) \
	$(foreach year,$(YEARS),$(year)/lakes.shp)

topojson: \
	$(foreach year,$(YEARS),$(year)/ch-combined.json)

clean-generated:
	rm -rf 20*/ shapefile/

# ---

# # SHAPEFILE_TARGETS := $(foreach ext,shp dbf prj shx,$(foreach type,countries,20%/$(type).$(ext)))
# .PRECIOUS: $(SHAPEFILE_TARGETS)

# shapefile-20%: $(SHAPEFILE_TARGETS)
# 	@echo Shapefiles 20$* extracted

SHAPEFILE_TARGETS := $(foreach shape,$(SHAPES),20%/$(shape).shp)

20%/ch-combined.json: $(SHAPEFILE_TARGETS)
	mkdir -p $(dir $@)
	yarn run mapshaper \
	  -i $^ combine-files string-fields=* \
	  -proj wgs84 \
		-clean \
		-simplify 50% \
	  -o format=topojson drop-table id-field=id $@

# Clean up country
# - Unify ID ("CH")
20%/country.shp: $(foreach ext,$(SHAPEFILE_EXT),shapefile/20%/l.$(ext))
	mkdir -p $(dir $@)
	yarn run mapshaper \
		-i $< \
		-clean \
		-each 'id="CH"; name="Schweiz / Suisse / Svizzera"' \
		-filter-fields id,name \
	  -o format=shapefile encoding=utf8 $@

# Clean up cantons
# - Unify IDs
20%/cantons.shp: $(foreach ext,$(SHAPEFILE_EXT),shapefile/20%/k.$(ext))
	mkdir -p $(dir $@)
	yarn run mapshaper \
		-i $< \
		-clean \
		-each 'id=this.properties.KTNR || this.properties.KT; name=this.properties.KTNAME || this.properties.NAME' \
		-filter-fields id,name \
	  -o format=shapefile encoding=utf8 $@

# Clean up cantons
# - Unify IDs
20%/districts.shp: $(foreach ext,$(SHAPEFILE_EXT),shapefile/20%/b.$(ext))
	mkdir -p $(dir $@)
	yarn run mapshaper \
		-i $< \
		-clean \
		-each 'id=this.properties.BZNR || this.properties.BEZIRK; name=this.properties.BZNAME || this.properties.NAME; KTNR=this.properties.KTNR || this.properties.KT' \
		-filter-fields id,name,KTNR \
	  -o format=shapefile encoding=utf8 $@

# Clean up municipalities
# - Unify IDs
# - Remove lakes (ID 9000+) and Liechtenstein municipalities from older shapefiles (ID 7000+)
20%/municipalities.shp: $(foreach ext,$(SHAPEFILE_EXT),shapefile/20%/g.$(ext))
	mkdir -p $(dir $@)
	yarn run mapshaper \
		-i $< $(if $(findstring 2017,$@),encoding=win1252,) \
		-clean \
		-each 'id=this.properties.GMDNR || this.properties.GMDE; name=this.properties.GMDNAME || this.properties.NAME; KTNR=this.properties.KTNR || this.properties.KT' \
		-filter-fields id,name,KTNR \
		-filter '+id < 7000' \
	  -o format=shapefile encoding=utf8 $@

# Clean up lakes
# - Unify IDs
# - Remove Lago di Como (9780)
20%/lakes.shp: $(foreach ext,$(SHAPEFILE_EXT),shapefile/20%/s.$(ext))
	mkdir -p $(dir $@)
	yarn run mapshaper \
		-i $< \
		-clean \
		-each 'id=this.properties.SEENR || this.properties.GMDNR || this.properties.GMDE; name=this.properties.SEENAME || this.properties.GMDNAME || this.properties.NAME' \
		-filter-fields id,name \
		-filter '+id !== 9780' \
	  -o format=shapefile encoding=utf8 $@

# Generate targets based on
#   - types (g=Gemeinde, k=Kanton, l=Landesgrenze, s=See), and
#   - extensions (shp, dbf, prj)
#
# Examples: 2020/g.shp, 2019/l.dbf, etc.

define extract_from_archive
## 2010 – 2017 contain unique folder structures
shapefile/2010/$(1).$(2): downloads/2010.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< g1g10_shp_121130/$$(subst l1,L1,$$(subst s1,S1,$$(subst k1,K1,$$(subst g1,G1,$$(subst b1,B1,G1$(1)10.$(2)))))) > $$@
shapefile/2011/$(1).$(2): downloads/2011.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< g1g11_shp_121130/$$(subst l1,L1,$$(subst s1,S1,$$(subst k1,K1,$$(subst g1,G1,$$(subst b1,B1,G1$(1)11.$(2)))))) > $$@
shapefile/2012/$(1).$(2): downloads/2012.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< g1g12_shp_121130/$$(subst l1,L1,$$(subst s1,S1,$$(subst k1,K1,$$(subst g1,G1,$$(subst b1,B1,G1$(1)12.$(2)))))) > $$@
shapefile/2013/$(1).$(2): downloads/2013.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2013/shp/g1$(1)13.$(2) > $$@
shapefile/2014/$(1).$(2): downloads/2014.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2014/shp/g1$(1)14.$(2) > $$@
shapefile/2015/$(1).$(2): downloads/2015.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< shp/g1$(1)15.$(2) > $$@
shapefile/2016/$(1).$(2): downloads/2016.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2016/shp/g1$(1)16.$(2) > $$@
shapefile/2017/$(1).$(2): downloads/2017.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2017/shp/LV95/g1$(1)17.$(2) > $$@

# Municipalities from 2021 are versioned by date in the file name
shapefile/2021-07/g.$(2): downloads/2021.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2021-LV95/shp/g1g21_01072021.$(2) > $$@

shapefile/2021-07/$(1).$(2): downloads/2021.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2021-LV95/shp/g1$(1)21.$(2) > $$@

# There is no 01072021 prj file, so we use the one from 180042021
shapefile/2021-07/g.prj: downloads/2021.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2021-LV95/shp/g1g21_18042021.prj > $$@

shapefile/2021-04/g.$(2): downloads/2021.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2021-LV95/shp/g1g21_18042021.$(2) > $$@

shapefile/2021-04/$(1).$(2): downloads/2021.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2021-LV95/shp/g1$(1)21.$(2) > $$@

shapefile/2021/g.$(2): downloads/2021.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2021-LV95/shp/g1g21_01012021.$(2) > $$@

shapefile/2021/$(1).$(2): downloads/2021.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_2021-LV95/shp/g1$(1)21.$(2) > $$@

shapefile/2022/$(1).$(2): downloads/2022.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ag-b-00.03-875-gg22/ggg_2022_LV95/shp/g1$(1)22.$(2) > $$@

shapefile/2022-05/g.$(2): downloads/2022.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ag-b-00.03-875-gg22/ggg_2022_LV95/shp/g1g22_20220501.$(2) > $$@

shapefile/2022-05/$(1).$(2): downloads/2022.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ag-b-00.03-875-gg22/ggg_2022_LV95/shp/g1$(1)22.$(2) > $$@

shapefile/2023/$(1).$(2): downloads/2023.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ag-b-00.03-875-gg23/ggg_2023_LV95/shp/g1$(1)23.$(2) > $$@

shapefile/2024/$(1).$(2): downloads/2024.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ag-b-00.03-875-gg24/ggg_2024_LV95/shp/g1$(1)24.$(2) > $$@

# Files from 2018 on seem to be consistently structured
shapefile/20%/$(1).$(2): downloads/20%.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_20$$*-LV95/shp/g1$(1)$$*.$(2) > $$@
endef
$(foreach type,g k l s b,$(foreach ext,$(SHAPEFILE_EXT),$(eval $(call extract_from_archive,$(type),$(ext)))))

# rename = $(if $(findstring districts,$(1)),b,$(if $(findstring lakes,$(1)),s,$(if $(findstring municipalities,$(1)),g,$(if $(findstring cantons,$(1)),k,$(if $(findstring countries,$(1)),l,$(if $(findstring b,$(1)),districts,$(if $(findstring s,$(1)),lakes,$(if $(findstring g,$(1)),municipalities,$(if $(findstring k,$(1)),cantons,$(if $(findstring l,$(1)),countries,$(1)))))))))))

# test-rename:
# 	@echo 'l -> $(call rename,l)'
# 	@echo 's -> $(call rename,s)'
# 	@echo 'g -> $(call rename,g)'
# 	@echo 'k -> $(call rename,k)'
# 	@echo 'b -> $(call rename,b)'
# 	@echo 'countries -> $(call rename,countries)'
# 	@echo 'lakes -> $(call rename,lakes)'
# 	@echo 'municipalities -> $(call rename,municipalities)'
# 	@echo 'cantons -> $(call rename,cantons)'
# 	@echo 'districts -> $(call rename,districts)'

downloads/2024.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://dam-api.bfs.admin.ch/hub/api/dam/assets/30487000/master"

downloads/2023.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://dam-api.bfs.admin.ch/hub/api/dam/assets/24106754/master"

downloads/2022.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://dam-api.bfs.admin.ch/hub/api/dam/assets/22484210/master"

downloads/2021.zip:
	mkdir -p $(dir $@)
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/17964056/master"

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

