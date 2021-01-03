TAG_SVGS=$(wildcard */*.*.svg)
RAW_SVGS=$(subst \#*,x,${TAG_SVGS})
PNGS=$(SVGS:solid/%.svg=solid/%.png)
all: $(info ${RAW_SVGS})

#docs: $(PNGS)
%.png: %.svg ; echo convert -density 8192 -resize 512x512 -background transparent $^ $@
