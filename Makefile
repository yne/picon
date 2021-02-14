all: solid/solid.woff2 solid/solid.tar.bz2
# intermediate "target : requirements" rules
%.ttf: %.n.ttf ; ttfautohint $^ $@
%.n.ttf: %.otf ; fontforge -lang=ff -c 'Open($^);Generate($@)'
%.woff2: %.otf ; woff2_compress $^
%.tar.bz2:     ; tar cj --transform 's/#.*/svg/' $(dir $@)*.svg > $@
%.json:        ; node .github/workflows/icomoon.js $(dir $@)manifest.json $(dir $@)*.*.svg > $@
%.otf: %.json .github/pages/opentype.js ; node .github/pages/build.js <$< >$@

# external deps
.github/pages/opentype.js:; wget https://cdn.jsdelivr.net/npm/opentype.js@1.3.3 -O $@

#bottom right left down up %c2%b0 fast

# page target
%.md.html: %.md   ; curl -s -HContent-Type:text/x-markdown https://api.github.com/markdown/raw --data-binary @- <$^ | sed s/user-content-// >$@
%.html: %.html.m4 ; m4 <$^ >$@
