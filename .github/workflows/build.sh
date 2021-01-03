#TODO: convert to Makefile
[ -z "$GITHUB_REPOSITORY" ] && echo "call with GITHUB_* variables set" && exit -1;
exit 42;
TAG=$(date +v%y.%m.%d)
COUNT=$(ls */*.svg|wc -l)
for f in $(find -name '*.m4'); do
  DIR=$(basename $(dirname $f))
  m4 \
  -DDIR=${DIR} \
  -DTAG=${TAG} \
  -DSHA=${GITHUB_SHA} \
  -DUSER=${GITHUB_ACTOR} \
  -DREPO=${GITHUB_REPOSITORY} \
  -DNAME=${GITHUB_REPOSITORY#*/} \
  -DHOST=${GITHUB_SERVER_URL} \
  -DCOUNT=${COUNT} \
  <${f} >${f%.*}
done
for font in */ ; do
  FONT=${font///};
  PSNAME=$(jq -r .postScriptName < ${FONT}/manifest.json)
  node .github/workflows/icomoon.js ${FONT}/manifest.json *.svg > ${FONT}.json
  node .github/pages/build.js < ${FONT}.json > $PSNAME.otf
  woff2_compress $PSNAME.otf
  fontforge -lang=ff -c 'Open($1);Generate($2)' $PSNAME.otf $PSNAME.nohint.ttf
  ttfautohint $PSNAME.nohint.ttf $PSNAME.ttf
  # SVG to PNG + rename
  (cd $font ; for ico in *.svg; do
    convert -density 8192 -resize 512x512 -background transparent $ico $FONT/${ico%%.*}.png
    mv $ico ${ico%%.*}.svg
  done)
done
size(){ du -sh $1 | awk '{print $1"B"}';}
[ -f README.html ] ||
  jq -n --arg text "$(<README.md)" '{"text":$text,"mode":"gfm","context":"'$GITHUB_REPOSITORY'"}' |
  curl -sd @- https://api.github.com/markdown > README.html
convert -background none  -density 5000 -resize 512x512 - favicon.png << favicon.svg

