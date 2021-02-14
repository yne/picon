
/**
	OpenType does not support 8x8 grid, and Y coordinate are inverted
	We must translate X,Y to they nearest supported grid : 16*16
*/
function normalize(str, w = 16, h = 16) {
	return (str.match(/[0-9.]+/g)||[]).map((c,i) => (i & 1) * h - c * 2);
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
const toPath = (path, str) => (path[func[str[0]] || 'lineTo'](...normalize(str)), path);
function glyphName({ unicodes: [u] = [], ligatures: [l] = [] }) {
	return u ? 'uni' + ('000' + u.toString(16).toUpperCase()).slice(-4) : l;
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
		.map(c => ({ defaultCode: c, path: [] }));

	const glyphs = [notdefGlyph, ...ligaStubGlyphs, ...icons]
		.map(({icon, properties}, index) => new opentype.Glyph({
			index: (properties.__index = index), // stored for next stage
			unicodes: icon.defaultCode,//.length ? icon.unicodes : [0xE000 + index],
			path: (icon.paths[0].match(/[a-zA-Z][^a-zA-Z]+/g)||[]).reduce(toPath, new opentype.Path()),
			name: properties.name || glyphName(icon),
			advanceWidth: icon.grid,
		}));
	const f = new opentype.Font({ ...metadata, ascender: metadata.unitsPerEm, descender: 0, glyphs });
	icons.forEach(({ properties:{ligatures = [], __index} }) =>
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
