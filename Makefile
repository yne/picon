all: solid.min.woff2 solid.all.woff2 solid.tar.bz2 solid.svg solid.all.json # solid.png
clean:; rm -f *.svg *.ttf *.otf *.woff2 *.pb *.json *.tar.bz2 *.png

%.ttf: %.n.ttf ; ttfautohint $^ $@
%.n.ttf: %.otf ; fontforge -lang=ff -c 'Open("$^");Generate("$@")'
%.woff2: %.otf ; woff2_compress $^
%.tar.bz2: %   ; tar cj --transform='s|[.].*|.svg|;s|^.*/||' $^/*.svg > $@
%.png:      %  ; montage -background none -density 216 -geometry +4+4 $^/*.svg $@
%.png:  %.svg  ; convert -background none -density 2304 $^ $@
%.all.json: %  ; node icomoon.js $^/manifest.json $^/*.svg > $@
%.min.json: %.all.json ; jq 'del(.icons[]|select(.icon.tags|index("latin")))' <$^ > $@
%.svg: %.all.json ; jq -r < $^ '"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"0\" height=\"0\">\n" + (.icons | map("<symbol viewBox=\"0 0 \(.icon.grid) \(.icon.grid)\" id=\"\(.properties.name)\"><path d=\"\(.icon.paths[0])\"></path></symbol>") | join("\n")) + "\n</svg>"' > $@
%.otf: %.json opentype.js ; node otf.js <$< >$@
%.pb: %.pb.m4  ; m4 -D JSONS="($(shell ls -m */manifest.json))" <$^ >$@

# external deps (todo: upstream fix)
opentype.js:; curl https://cdn.jsdelivr.net/npm/opentype.js@1.3.3/dist/opentype.js | sed 's/: \(_13.*1\)/: Math.round(\1)/g' >$@

# override auto github README pages with custom mage
#index.html: README.md   ; curl -s -HContent-Type:text/x-markdown https://api.github.com/markdown/raw --data-binary @- <$^ | sed s/user-content-// >$@
#%.html: %.html.m4 ; m4 <$^ >$@

# fontbakery extra buildflow:
# docker run -ti python /bin/bash
# pip install fontbakery gftools
# mkdir ofl
# f=ofl/Picon-Regular.ttf
# wget 192.168.43.237:8000/solid.all.ttf -O $f && gftools fix-dsig --autofix $f && gftools fix-unwanted-tables $f && fontbakery check-googlefonts $f
