
/**
 * SVG coordiates start at top-left
 * Opentype coordiates start at bottom-left and must be at least 16x16 based
 * We need to invert the y axis (odd coord) and scale glyph grid to match font grid
*/
function normalize(str, mata, ico={}, properties) {
	const ratio = mata.unitsPerEm / ico.grid;
	const norm = (str.match(/[-0-9.]+/g)||[]).map((n,i) => (i & 1) ? (ico.grid-n)*ratio : n*ratio)
	//console.error(properties.name, ratio, str, norm);
	return norm;
}
const func = {
	' ': 'lineTo',//backward compatibility
	M: 'moveTo',
	L: 'lineTo',
	C: 'curveTo',
	c: 'bezierCurveTo',
	Q: 'quadTo',
	q: 'quadraticCurveTo',
	Z: 'closePath',
	z: 'closePath'
};
function glyphName({ligatures, defaultCode}) {
	return ligatures || ('uni' + ('000' + defaultCode.toString(16).toUpperCase()).slice(-4));
}

// convert icomoon-like declaration:
// {icon: {defaultCode: 0, tags: [], grid: 8, paths:["M3,2"]}, properties: { ligatures: "zip", name: "zip"}}
// to OpenType Glyph declaration
function makeFont(opentype, { icons = [], metadata }) {
	const notdefGlyph = { icon: { defaultCode: 0, grid: 8, paths: ['M2,3L4,5L6,3'] }, properties: { name: '.notdef' } };
	/* list letters that'll be needed for our ligatures */
	const ligaChars = [...new Set(icons.reduce((acc, ico) => acc += ico.properties.ligatures || '', ""))];
	/* generate an stub glyph for every missing but required letters */
	const ligaStubGlyphs = ligaChars.map(c => c.charCodeAt(0))
		.filter(c => !icons.find(i => i.icon.defaultCode === c))
		.map(c => ({icon:{ defaultCode: c, paths: ['M2,3L4,5L6,3'], grid: 8}}));
	const glyphs = [notdefGlyph, ...ligaStubGlyphs, ...icons]
		.map(({icon, properties={}}, index) => new opentype.Glyph({
			index: (properties.__index = index), // stored for next stage
			unicode: icon.defaultCode,//.length ? icon.unicodes : [0xE000 + index],
			path: (icon.paths[0].match(/[a-zA-Z][^a-zA-Z]+/g)||[]).reduce((path, str) => (path[func[str[0]] || 'lineTo'](...normalize(str, metadata, icon, properties)), path), new opentype.Path()),
			name: properties.name || glyphName(icon),
			advanceWidth: icon.grid*2,
		}));
	const f = new opentype.Font({ ...metadata, glyphs });
	// reverse() so ligatures with more components are (we hope) ahead of those with fewer components
	icons.reverse().forEach(({ properties:{ligatures = [], __index} }) =>
		ligatures.split(' ').forEach(ligature =>
			f.substitution.add("liga", {
				sub: ligature.split('').map(c => f.charToGlyphIndex(c)),
				by: __index
			})
		)
	);
	return f;
}

if (typeof process !== "undefined") {
	const opentype = require("./opentype.js");//Promise.resolve(require("./opentype.js"))
	const json = JSON.parse(require('fs').readFileSync(process.argv[2] || '/dev/stdin', 'utf8'));
	process.stdout.write(Buffer.from(makeFont(opentype, json).toArrayBuffer()));
}

/*
document.addEventListener('DOMContentLoaded', () =>{
	document.querySelectorAll('li[id^=latin-]').forEach(el=>el.classList.add('check'));
	makeFont(List)
})*/
//const font = makeFont(transform(serializeFiles(process.argv.slice(3))), parsePb(pb));
//process.stdout.write(Buffer.from(font.toArrayBuffer()))
