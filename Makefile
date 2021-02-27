all: solid.min.woff2 solid.all.woff2 solid.tar.bz2 solid.svg # solid.all.woff2 solid.all.ttf solid.all.otf solid.tar.bz2 solid.all.json
clean:; rm -f *.svg *.ttf *.otf *.woff2 *.pb *.json *.tar.bz2

%.ttf: %.n.ttf ; ttfautohint $^ $@
%.n.ttf: %.otf ; fontforge -lang=ff -c 'Open("$^");Generate("$@")'
%.woff2: %.otf ; woff2_compress $^
%.tar.bz2: %   ; tar cj --transform='s|[.].*|.svg|;s|^.*/||' $^/*.svg > $@
%.all.json: %  ; node .github/workflows/icomoon.js $^/manifest.json $^/*.svg > $@
%.min.json: %.all.json ; jq 'del(.icons[]|select(.icon.tags|index("latin")))' <$^ > $@
%.svg: %.all.json ; jq -r < $^ '"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"0\" height=\"0\">\n" + (.icons | map("<symbol viewBox=\"0 0 \(.icon.grid) \(.icon.grid)\" id=\"\(.properties.name)\"><path d=\"\(.icon.paths[0])\"></path></symbol>") | join("\n")) + "\n</svg>"' > $@
%.otf: %.json .github/pages/opentype.js ; node .github/pages/build.js <$< >$@
%.pb: %.pb.m4  ; m4 -D JSONS="($(shell ls -m */manifest.json))" <$^ >$@


# external deps
.github/pages/opentype.js:; wget https://cdn.jsdelivr.net/npm/opentype.js@1.3.3/dist/opentype.js -O $@

# pages target
%.htm: %.md   ; curl -s -HContent-Type:text/x-markdown https://api.github.com/markdown/raw --data-binary @- <$^ | sed s/user-content-// >$@
%.html: %.html.m4 ; m4 <$^ >$@
