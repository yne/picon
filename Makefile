all:  solid/solid.min.woff2 solid/solid.all.woff2 solid/solid.all.ttf solid/solid.all.otf solid/solid.min.otf solid/solid.tar.bz2 solid/solid.all.json
#clean:; rm -f solid/solid*
# intermediate "target : requirements" rules
%.ttf: %.n.ttf ; ttfautohint $^ $@
%.n.ttf: %.otf ; fontforge -lang=ff -c 'Open("$^");Generate("$@")'
%.woff2: %.otf ; woff2_compress $^
%.tar.bz2:     ; tar cj --transform 's/#.*/svg/' $(dir $@)*.svg > $@
%.all.json:    ; node .github/workflows/icomoon.js $(dir $@)manifest.json $(dir $@)*.*.svg > $@
%.min.json: %.all.json ; jq 'del(.icons[]|select(.icon.tags|index("latin")))' <$^ > $@
%.otf: %.json .github/pages/opentype.js ; node .github/pages/build.js <$< >$@

# external deps
.github/pages/opentype.js:; wget https://cdn.jsdelivr.net/npm/opentype.js@1.3.3/dist/opentype.js -O $@

#bottom right left down up %c2%b0 fast

# pages target
%.htm: %.md   ; curl -s -HContent-Type:text/x-markdown https://api.github.com/markdown/raw --data-binary @- <$^ | sed s/user-content-// >$@
%.html: %.html.m4 ; m4 <$^ >$@
