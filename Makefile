TAGS=$(wildcard */*.*.svg)
SVGS=$(shell echo "$(TAGS)" | sed -E 's/\.[^ ]+?/.svg/g')
PNGS=$(SVGS:solid/%.svg=solid/%.png)

all: $(SVGS)
.github/pages/opentype.js:
	wget https://cdn.jsdelivr.net/npm/opentype.js $@
%.svg: %.svg
	echo $^ to $@
%.png: %.svg
	echo $^ $(shell echo $^ | sed -e s/number/$^/g )
#	echo convert -density 8192 -resize 512x512 -background transparent $^ $@
