/**
DESCRIPTION
  Generate a icomoon-compatible JSON file from a metadata.json and a list of (carefully named) svgs
USAGE
  icomoon.js metadata.json *.svg
INPUT
  home.#building.#house.svg
  %2f.#latin.svg
OUTPUT
[
	"icon": {
		"paths": [
			"M512 32l-512 512 96 96 96-96v416h256v-192h128v192h256v-416l96 96 96-96-512-512zM512 448c-35.346 0-64-28.654-64-64s28.654-64 64-64c35.346 0 64 28.654 64 64s-28.654 64-64 64z"
		],
		"tags": [
			"building",
			"house"
		],
		"defaultCode": 58880,
		"grid": 16
	},
	"properties": {
		"ligatures": "home2, house2",
		"name": "home2"
	},
	...
]
**/
const log = (str) => (console.error(str),str)
process.stdout.write(JSON.stringify(((metadata,...svgs) => ({
	IcoMoonType: "selection",
	height: 8,
	metadata: JSON.parse(require('fs').readFileSync(metadata)),
	icons: svgs.map(p => ({
			props: require('path').basename(p, '.svg').split('.'),
			data: require('fs').readFileSync(p, 'utf8')
		}))
		.map(({props, data}, idx) => ({
			_unicodes: props.filter(p=>p.startsWith('%')).map(xx=>decodeURIComponent(xx).charCodeAt(0)),
			icon: {
				tags: props.filter(p=>p.startsWith('#')).map(h=>h.slice(1)),
				grid: +(data.match(/ viewBox="\d+ \d+ \d+ (\d+)"/)||[16]).slice(-1)[0],
				paths: [...data.matchAll(/ d="(.*?)"/g)].map(d=>d[1])
			},
			properties: {
				ligatures: props.filter(p=>p.match(/^[a-z]/)).join(', '),
				name: props[0].startsWith('%') ? null : props[0].replace(/^\d/,s=>'_'+s)
			}
		}))
		// iconmoon json expect only 1 unicode per glyph
		// split our unicodes into multiple glyphs with .defaultCode:int
		.map(({_unicodes, icon, properties}, idx) =>
			_unicodes.length ? _unicodes.map(u => ({icon:{defaultCode:u, ...icon},properties})) : [{icon:{defaultCode:0xE000+idx, ...icon}, properties}]
		).flat().map(el => ({...el, properties:{...el.properties, name: el.properties.name || 'uni'+('0000'+el.icon.defaultCode.toString(16).toUpperCase()).slice(-4)}}))
		.sort((a, b) => a.icon.defaultCode - b.icon.defaultCode)
}))(...process.argv.slice(2)), null, 2))

