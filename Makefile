#
# Geodata
# https://www.bfs.admin.ch/bfs/de/home/dienstleistungen/geostat/geodaten-bundesstatistik/administrative-grenzen/generalisierte-gemeindegrenzen.html
#

YEARS := 2010 2011 2012 2013 2014 2015 2016 2017 2018 2019 2020

.PHONY: all topojson shapefile

all: shapefile topojson

shapefile: $(foreach year,$(YEARS),shapefile-$(year))

topojson:
	@echo "topojson: TODO"

# topojson: \
# 	public/topojson/ch-2020.json \
# 	public/topojson/ch-2019.json \
# 	public/topojson/ch-2018.json \
# 	public/topojson/ch-2017.json \
# 	public/topojson/ch-2016.json \
# 	public/topojson/ch-2015.json \
# 	public/topojson/ch-2014.json \
# 	public/topojson/ch-2013.json \
# 	public/topojson/ch-2012.json \
# 	public/topojson/ch-2011.json \
# 	public/topojson/ch-2010.json

# ---

SHAPEFILE_TARGETS := $(foreach ext,shp dbf prj,$(foreach type,g k l s,shapefile/20%/$(type).$(ext)))
.PRECIOUS: $(SHAPEFILE_TARGETS)

shapefile-20%: $(SHAPEFILE_TARGETS)
	@echo Shapefiles 20$* extracted

# public/topojson/ch-20%.json: shapefile/g1g%.shp shapefile/g1k%.shp shapefile/g1s%.shp shapefile/g1g%.prj shapefile/g1k%.prj shapefile/g1s%.prj shapefile/g1g%.dbf shapefile/g1k%.dbf shapefile/g1s%.dbf
# 	mkdir -p $(dir $@)
# 	yarn run mapshaper \
# 	  -i shapefile/g1g$*.shp shapefile/g1k$*.shp shapefile/g1s$*.shp combine-files string-fields=* encoding=utf8 \
# 		-clean \
# 	  -rename-layers municipalities,cantons,lakes \
# 	  -proj wgs84 \
# 		-simplify 50% \
# 	  -o format=topojson drop-table id-field=GMDNR,KTNR,GMDE,KT $@

# Generate targets based on
#   - types (g=Gemeinde, k=Kanton, l=Landesgrenze, s=See), and
#   - extensions (shp, dbf, prj)
#
# Examples: shapefile/2020/g.shp, shapefile/2019/l.dbf, etc.

# 2015 is nested 1 level deeper
downloads/GGG_15_V161025.zip: downloads/2015.zip
	mkdir -p $(dir $@)
	unzip -p $< GGG_15_V161025.zip > $@
define extract_from_archive
## 2010 – 2017 contain unique folder structures
shapefile/2010/$(1).$(2): downloads/2010.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< g1g10_shp_121130/$$(subst l1,L1,$$(subst s1,S1,$$(subst k1,K1,$$(subst g1,G1,G1$(1)10.$(2))))) > $$@
shapefile/2011/$(1).$(2): downloads/2011.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< g1g11_shp_121130/$$(subst l1,L1,$$(subst s1,S1,$$(subst k1,K1,$$(subst g1,G1,G1$(1)11.$(2))))) > $$@
shapefile/2012/$(1).$(2): downloads/2012.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< g1g12_shp_121130/$$(subst l1,L1,$$(subst s1,S1,$$(subst k1,K1,$$(subst g1,G1,G1$(1)12.$(2))))) > $$@
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

# Files from 2018 on seem to be consistently structured
shapefile/20%/$(1).$(2): downloads/20%.zip
	@mkdir -p $$(dir $$@)
	unzip -p $$< ggg_20$$*-LV95/shp/g1$(1)$$*.$(2) > $$@
endef
$(foreach type,g k l s,$(foreach ext,shp dbf prj,$(eval $(call extract_from_archive,$(type),$(ext)))))

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

