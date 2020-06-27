
/**
	OpenType does not support 8x8 grid, and Y coordinate are inverted
	We must translate to the nearest supported grid : 16*16
*/
function normalize(p, w=16, h=16) {
	let [x,y] = p.match(/[0-9.]+/g)
	return [x*2, h-y*2]
}
const func = {
	M:'moveTo',
	L:'lineTo',
	C:'curveTo',   c:'bezierCurveTo',
	Q:'quadTo',    q:'quadraticCurveTo',
	Z:'closePath', z:'closePath'
};
const toPath = (path, str) => (path[func[str[0]]||'lineTo'](...normalize(str)), path);
function glyphName({unicodes:[u]=[],ligatures:[l]=[]}) {
	return u ? 'uni' + ('000'+u.toString(16).toUpperCase()).slice(-4) : l;
}
function makeFont(opentype, {glyphs=[], ...font}) {
	const notdefGlyph = {name: '.notdef', path: [['M',2,3],['L',4,5],['L',6,3]], unicodes:[0]};
	/* list letters that'll be needed for our ligatures */
	const ligaLetters = [...new Set(glyphs.reduce((c,g) => c += g.ligatures.join(''),""))];
	/* generate an stub glyph for every missing but required letters */
	const ligaStubGlyphs = ligaLetters.map(c=>c.charCodeAt(0))
		.filter(c => !glyphs.find(g => g.unicodes.includes(c)))
		.map(c => ({unicodes:[c], path:[]}));

	const openGlyphs = [notdefGlyph, ...ligaStubGlyphs, ...glyphs]
	.map((glyph, index) => new opentype.Glyph({
			index: glyph.by = index,
			unicodes: glyph.unicodes.length ? glyph.unicodes : [0xE000 + index],
			path: glyph.path.reduce(toPath, new opentype.Path()),
			name: glyph.name || glyphName(glyph),
			advanceWidth: font.unitsPerEm,
	}));

	const f = new opentype.Font({...font, glyphs:openGlyphs});
	glyphs.forEach(({ligatures=[],by}) =>
		ligatures.forEach(ligature =>
			f.substitution.add("liga", {
				sub: ligature.split('').map(c => f.charToGlyphIndex(c)),
				by
			})
		)
	);
	return f;
}

if (typeof process !== "undefined") {
	opentype = require("./opentype.js");//Promise.resolve(require("./opentype.js"))
	const json = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));
	process.stdout.write(Buffer.from(makeFont(opentype, json).toArrayBuffer()))
}

/*
document.addEventListener('DOMContentLoaded', () =>{
	document.querySelectorAll('li[id^=latin-]').forEach(el=>el.classList.add('check'));
	makeFont(List)
})*/
//const font = makeFont(transform(serializeFiles(process.argv.slice(3))), parsePb(pb));
//process.stdout.write(Buffer.from(font.toArrayBuffer()))
