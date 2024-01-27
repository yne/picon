.PHONY: all serve clean
need := solid.woff2 solid.tar.bz2 solid.svg solid.json \
        flags.woff2 flags.tar.bz2 flags.svg flags.json# solid.png are too slow
all: $(need)
clean:; rm -f $(need) # opentype.js
serve:; python3 -m http.server

%.ttf: %.otf   ; fontforge -lang=ff -c 'Open("$^");AutoHint();Generate("$@")'
%.woff2: %.otf ; woff2_compress $^
%.bz2: %       ; bzip2 -z9 <$^ >$@
%.tar: %       ; tar -c --transform='s|[.].*|.svg|;s|^.*/||' $^/*.svg > $@
%.png: %       ; montage -background none -density 288 -tile 32 -monitor -geometry +3+3 $^/*.svg $@
%.png: %.svg   ; convert -background none -density 2304 $^ $@
%.json:%       ; node icomoon.js $^/manifest.json $^/*.svg > $@
%.svg: %.json  ; jq -r < $^ '"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"0\" height=\"0\">\n" + (.icons | map("<symbol viewBox=\"0 0 \(.icon.grid) \(.icon.grid)\" id=\"\(.properties.name)\">\([.icon.paths,.icon.colors]|transpose|map("<path d=\""+.[0]+"\" fill=\""+.[1]+"\"></path>")|join(""))</symbol>") | join("\n")) + "\n</svg>"' | sed 's/ fill=""//' > $@
%.pb:  %.pb.m4 ; m4 -D JSONS="($(shell ls -m */manifest.json))" <$^ >$@
%.otf: %.json opentype.js ; node otf.js <$< >$@

opentype.js:; curl -s https://opentype.js.org/dist/$@ -o $@

# override auto github README pages with custom mage
#index.html: README.md   ; curl -s -HContent-Type:text/x-markdown https://api.github.com/markdown/raw --data-binary @- <$^ | sed s/user-content-// >$@
#%.html: %.html.m4 ; m4 <$^ >$@

# fontbakery extra buildflow:
# docker run -ti python /bin/bash
# pip install fontbakery gftools
# mkdir ofl
# f=ofl/Picon-Regular.ttf
# wget 192.168.43.237:8000/solid.ttf -O $f && gftools fix-dsig --autofix $f && gftools fix-unwanted-tables $f && fontbakery check-googlefonts $f
