/* Convert .pb files to OpenType.js FontDeclaration. TODO: generate pb from JSON */
function parsePb(pb) {
	let json = ('\n' + pb)
		.replace(/([^{])\n([^}])/g,'$1,\n$2')
		.replace(' {',':{')
		.replace(/\n *([a-z_]+):/g,'\n"$1":')
		.replace(/_(url|\w)/g,(f,l)=>l.toUpperCase())
		;
	let obj = JSON.parse('{'+json+'}');
	return {
		...obj,
		...obj.fonts,
		fonts: undefined,
		familyName: obj.name,
		weightClass: obj.fonts.weight,
		tables: {
			os2: {
				achVendID: obj.vendor,
				bProportion: obj.bProportion
			}
		}
	}
}
/* NODE: generate a iconmoon-like JSON from a list of svgs

"icon": {
	"paths": [
		"M512 32l-512 512 96 96 96-96v416h256v-192h128v192h256v-416l96 96 96-96-512-512zM512 448c-35.346 0-64-28.654-64-64s28.654-64 64-64c35.346 0 64 28.654 64 64s-28.654 64-64 64z"
	],
	"tags": [
		"home",
		"house"
	],
	"defaultCode": 58880,
	"grid": 16
},
"properties": {
	"ligatures": "home2, house2",
	"name": "home2"
}
*/
const buildJson = (pb,...svgs) => ({
	IcoMoonType: "selection",
	height: 8,
	metadata: parsePb(require('fs').readFileSync(pb)),
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
				name: props[0]
			}
		}))
		// iconmoon json expect only 1 unicode per glyph
		// split our unicodes into multiple glyphs with .defaultCode:int
		.map(({_unicodes, icon, properties}, idx) =>
			_unicodes.length ? _unicodes.map(u => ({icon:{defaultCode:u, ...icon},properties})) : [{icon:{defaultCode:0xE000+idx, ...icon}, properties}]
		).flat()
		.sort((a, b) => a.defaultCode - b.defaultCode)
});
const buildPb = (pb) => JSON.stringify(parsePb(require('fs').readFileSync(pb, 'utf8')), null, 2)
const actions = {buildJson, buildPb};
if(typeof window === 'undefined' && process.argv[2] in actions) {
	process.stdout.write(JSON.stringify(actions[process.argv[2]](...process.argv.slice(3)), null, 2))
}
