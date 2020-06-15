
var opentype = null;
/**
	OpenType does not support 8x8 grid, and Y coordinate are inverted
	We must translate to the nearest supported grid : 16*16
*/
function normalize(p,w=16,h=16) {
	let [x,y] = p.match(/[0-9.]+/g)
	return [x*2, h-y*2]
}
function toPath(path,str){
	if(str[0] === 'M')
		path.moveTo(...normalize(str))
	else
		path.lineTo(...normalize(str))
	return path;
}
function glyphName({unicodes:[u]=[],ligatures:[l]=[]}) {
	return u?'uni'+('000'+u.toString(16).toUpperCase()).slice(-4):l;
}
function makeFont({glyphs=[], ...font}) {
	const notdefGlyph = {name: '.notdef', path: ['M2,3','4,5','6,3'], unicodes:[0]};
	const ligaGlyphs = [...new Set(glyphs.reduce((c,g)=>c+=g.ligatures.join(''),""))].map(c=>c.charCodeAt(0))
		.filter(c => !glyphs.find(g => g.unicodes.includes(c)))
		.map(c => ({unicodes:[c], path:[]}));

	const openGlyphs = [notdefGlyph, ...ligaGlyphs, ...glyphs]
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

/*
 DOM event related function
 */
/**
@form = <li id="latin-a.à"><img class=check src="data:..."></li><li>...
@return = [
	[["latin-a.à"],"<svg ..."],
	[["app"], "<svg ..."],
	...
]
*/
function serializeForm(form) {
	return [...form.querySelectorAll('.check img')]
	.map(path => [path.closest('li').id, path.src])
}
function filter(form,className="highlight") {
	const all = form.querySelectorAll('li');
	all.forEach(li=>li.hidden=false);
	form.querySelector("blockquote").hidden=!form.q.value
	if(!form.q.value)return;
	const rule = `li:not([id*='${form.q.value}'])`;
	const matched = form.querySelectorAll(rule)
	matched.forEach(li=>li.hidden=true)
	form.match.value = all.length - matched.length;
}
function updateCheck(form){
	const nbChecked = form.querySelectorAll('.check').length
	form.check.value=nbChecked
	form.check.parentElement.hidden=!nbChecked
}
function highlightCheck(form, checked){
	const list = form.querySelectorAll('li:not([hidden])')
	list.forEach(li=>li.classList=checked?"check":'')
	updateCheck(form)
}
let prevToggle=null;
function toggle(li, event){
	const form = li.closest('form');
	const all = [...form.querySelectorAll('li')];
	if (!prevToggle)prevToggle = li;
	const [from, to] = [prevToggle,li].map(c=>all.findIndex(e=>c==e));
	var els = event.shiftKey?all.slice(...(from > to ? [to,from] : [from+1,to+1])):[li];
	els.map(cb=>cb.classList.toggle("check"))
	prevToggle = li;
	updateCheck(form)
}
function clip(a, event) {
	event.stopPropagation();
	const text = a.innerText;
	if (!navigator.clipboard)
		return alert(`No clipboard API to copy ${text}`);
	setTimeout(() => a.classList.remove('copied'),1000);
	navigator.clipboard.writeText(text).then(
		res => a.classList.add('copied'),
		err => alert(`Unable to copy ${text}\n`+err));
}
if(typeof process !== "undefined") {
	opentype = require("./opentype.js");
	
	const json = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));
	process.stdout.write(Buffer.from(makeFont(json).toArrayBuffer()))
}

/*
document.addEventListener('DOMContentLoaded', () =>{
	document.querySelectorAll('li[id^=latin-]').forEach(el=>el.classList.add('check'));
	makeFont(List)
})*/
//const font = makeFont(transform(serializeFiles(process.argv.slice(3))), parsePb(pb));
//process.stdout.write(Buffer.from(font.toArrayBuffer()))
