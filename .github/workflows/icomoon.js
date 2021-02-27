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
			"M1,8L3,8L3,5L5,5L5,8L7,8L7,4L8,4L4,0L0,4L1,4"
		],
		"tags": [
			"building",
			"house"
		],
		"defaultCode": 58880,
		"grid": 8
	},
	"properties": {
		"ligatures": "home",
		"name": "home"
	},
	...
]
**/
const log = (str) => (console.error(str), str);
process.stdout.write(JSON.stringify(((metadata, ...svgs) => ({
	IcoMoonType: "selection",
	height: 32, // preview size
	metadata: JSON.parse(require('fs').readFileSync(metadata)),
	icons: svgs.map(p => ({
		props: require('path').basename(p, '.svg').split('.'),
		data: require('fs').readFileSync(p, 'utf8')
	}))
		.map(({ props, data }, idx) => ({
			_unicodes: props.filter(p => p.startsWith('%')).map(xx => decodeURIComponent(xx).charCodeAt(0)),
			icon: {
				tags: props.filter(p => p.startsWith('#')).map(h => h.slice(1)),
				grid: +(data.match(/ viewBox="\d+ \d+ \d+ (\d+)"/) || [16]).slice(-1)[0],
				paths: [...data.matchAll(/ d="(.*?)"/g)].map(d => d[1])
			},
			properties: {
				ligatures: props.filter(p => p.match(/^[a-z]/)).join(', '),
				name: props[0].startsWith('%') ? null : props[0].replace(/^\d/, s => '_' + s)
			}
		}))
		// iconmoon json expect only 1 unicode per glyph
		// split our unicodes into multiple glyphs with .defaultCode:int
		.map(({ _unicodes, icon, properties }, idx) =>
			_unicodes.length ? _unicodes.map(u => ({ icon: { defaultCode: u, ...icon }, properties })) : [{ icon: { defaultCode: 0xE000 + idx, ...icon }, properties }]
		).flat().map(el => ({ ...el, properties: { ...el.properties, name: el.properties.name || 'uni' + ('0000' + el.icon.defaultCode.toString(16).toUpperCase()).slice(-4) } }))
		.sort((a, b) => a.icon.defaultCode - b.icon.defaultCode)
}))(...process.argv.slice(2)), null, 2));

