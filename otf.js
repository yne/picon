
/**
 * SVG coordiates start at top-left
 * Opentype coordiates start at bottom-left and must be at least 16x16 based
 * We need to invert the y axis (odd coord) and scale glyph grid to match font grid
*/
function normalize(str, unitsPerEm, grid) {
	const ratio = unitsPerEm / grid;
	return (str.match(/[-0-9.]+/g) || []).map((n, i) => (i & 1) ? (grid - n) * ratio : n * ratio);
}
const func = {
	' ': 'lineTo',//backward compatibility
	'M': 'moveTo',
	'L': 'lineTo',
	'C': 'curveTo',
	'c': 'bezierCurveTo',
	'Q': 'quadTo',
	'q': 'quadraticCurveTo',
	'Z': 'closePath',
	'z': 'closePath'
};
function glyphName({ ligatures, defaultCode }) {
	return ligatures || ('uni' + ('000' + defaultCode.toString(16).toUpperCase()).slice(-4));
}

// convert icomoon-like declaration:
// {icon: {defaultCode: 0, tags: [], grid: 8, paths:["M3,2"]}, properties: { ligatures: "zip", name: "zip"}}
// to OpenType Glyph declaration
function makeFont(opentype, { icons = [], metadata }) {
	const notdefGlyph = { icon: { defaultCode: 0, grid: 8, paths: ['M2,3L4,5L6,3'] }, properties: { name: '.notdef' } };
	/* list letters that'll be needed for our ligatures */
	const ligaChars = [...new Set(icons.reduce((acc, { properties = {} }) => acc += properties.ligatures || '', ""))];
	/* generate an stub glyph for every missing (but required) letters */
	const ligaStubGlyphs = ligaChars.map(c => c.charCodeAt(0))
		.filter(c => !icons.find(i => i.icon.defaultCode === c))
		.map(c => ({ icon: { defaultCode: c, paths: ['M2,3L4,8L6,3'], grid: 8 }, properties: { name: 'liga'+c } }));

	/* COLOR extraction + utility */
	const color2int = (hrgb_a) => `${hrgb_a}FF`.slice(1, 9).match(/[a-fA-F0-9]{2}/g);
	const colorswap = ([r, g, b, o]) => Number.parseInt(`${b}${g}${r}${o}`, 16);
	const log = (x) => (console.log(x), x);
	/* Main glyphs transform loop */
	const glyphs = [notdefGlyph, ...ligaStubGlyphs, ...icons]
		// split colored-icon .paths  into multiple .__path + .__layer icons
		.map((i) => i.icon.paths.map((__path, __layer) => ({
			...i,
			__path,
			__layer,
			__color: (i.icon.colors || [])[__layer] ? colorswap(color2int((i.icon.colors || [])[__layer])) : undefined,
		}))).flat()
		// we can now add a unique .__index to each single-pathed-glyph
		.map((i, __index) => ({ ...i, __index }))
		// add a .glyph attribut to existing .icon + .property
		.map((i) => ({
			...i,
			glyph: new opentype.Glyph({
				index: i.__index,
				unicode: i.__layer ? 0xF000 - i : i.icon.defaultCode, // TODO: pre-scan for unused unicode unstead of back-pedaling
				path: (i.__path.match(/[a-zA-Z][^a-zA-Z]+/g) || []).reduce((path, str) => (path[func[str[0]] || 'lineTo'](...normalize(str, metadata.unitsPerEm, i.icon.grid)), path), new opentype.Path()),
				name: (i.properties.name || glyphName(i.icon)) + (i.__layer || ''),
				advanceWidth: Math.max(i.icon.grid, 16),
			})
		}));
	// build the palette using all glyph
	const colorRecords = [...new Set(glyphs.filter(g => g.__color !== undefined).map(g => g.__color))];
	if (colorRecords.length) {
		metadata.tables.cpal = { colorRecords };
	}
	// group-back colored glyph 
	const layersList = [...glyphs.filter(i => i.icon.colors).reduce((glyph, i) => glyph.set(i.icon.defaultCode, (glyph.get(i.icon.defaultCode) || []).concat(i) || [i]), new Map()).values()];
	metadata.tables.colr = {
		baseGlyphRecords: layersList.reduce(([sum, all], l) => [sum + l.length, all.concat({
			glyphID: l[0].__index,
			firstLayerIndex: sum,
			numLayers: l.length
		})], [0, []])[1],
		layerRecords: layersList.map(layers => layers.map(layer => ({
			glyphID: layer.__index,
			paletteIndex: colorRecords.indexOf(layer.__color)
		}))).flat()
	};
	const f = new opentype.Font({ ...metadata, glyphs: glyphs.map(g => g.glyph) });
	// reverse() so ligatures with more components are (we hope) ahead of those with fewer components

	glyphs.filter(g => !g.__layer).reverse().forEach(({ properties, __index}) =>
		(properties.ligatures ? properties.ligatures.split(' ') : []).forEach(liga =>
			f.substitution.add("liga", {
				sub: liga.split('').map(c => glyphs.find(g => g.icon.defaultCode === c.charCodeAt(0)).__index),
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

