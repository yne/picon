const TODO = {bProportion:9, achVendID:'!YNE'}
function parsePb(pb) {
	const obj = JSON.parse('{'+('\n' + pb)
		.replace(/([^{])\n([^}])/g,'$1,\n$2')
		.replace(' {',':{')
		.replace(/\n *([a-z_]+):/g,'"$1":')
		+'}');
	//{familyName: obj.name,weightClass: obj.fonts.weight,...obj, ...obj.fonts}
	return {
		familyName: obj.name,
		styleName: obj.fonts.style_name,
		postScriptName: obj.fonts.post_script_name,
		version: obj.version,
		designer: obj.designer,
		designerUrl: obj.designer_url,
		license: obj.license,
		licenseURL: obj.license_url,
		manufacturer: obj.manufacturer,
		manufacturerURL: obj.manufacturer_url,
		weightClass: obj.fonts.weight,
		description: obj.description,
		copyright: obj.fonts.copyright,
		trademark: obj.fonts.trademark,
	}
}
/*
@svgs = ["../svg/a-name.alias.svg","/abs/path/to.my.svg"]
@return = [
	[["latin-a.à"],"<svg ..."],
	[["app"], "<svg ..."],
	...
]
*/
function serializeFiles(svgs) {
	const fs = require('fs');
	const path = require('path');
	return svgs.map(svg => [
		path.basename(svg, '.svg'),
		fs.readFileSync(svg, {encoding:"utf-8"})
	])
}
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
/**
@glyphs = [
	[["latin-a.à"],"<svg ..."],
	[["app"], "<svg ..."],
	...
]
@return = [
		["a", Path(4,2)],
		["à", Path(4,2)],
		["app", Path(4,2)],
		...
	]
TODO: promise
**/
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
function transform(glyphs) {
	if(!opentype) {
		opentype = require("./opentype.js");
	}
	return glyphs
		.map(([name, svg]) => [
			name.split('.').map(e=>{console.error(e);return e}).map(n=>decodeURIComponent(n.replace(/^latin-/,''))),
			(svg.split('"')[5]||'').split(' ').filter(Boolean).reduce(toPath, new opentype.Path())
		]).reduce((all, [names,path])=>{
			names.forEach(name=>all.push([name,path]));
			return all;
		},[])
}

function makeFont(checkdGlyph, metadata={}, advanceWidth=16) {
	const notdefGlyph = new opentype.Glyph({name: '.notdef', advanceWidth, path: ['M2,3','4,5','6,3'].reduce(toPath, new opentype.Path())});
	const alphaGlyphs = "-abcdefghijklmnopqrstuvwxyz0123456789".split('').filter(c=>!checkdGlyph.find(([C])=>c==C)).map(c=>[c,new opentype.Path()]);
	// fill required glyph (for ligature) with blank glyph (if not in the checkdGlyph)
	const svgs = [...alphaGlyphs, ...checkdGlyph];
	var ligatures = [];
	const glyphs = [notdefGlyph, ...svgs.map(([fname, path], i) => {
		const isLatin = (fname.length==1/* && fname.charCodeAt(0) <= 0xFF*/);
		const unicode = isLatin ? fname.charCodeAt(0) : 0xE000+i;
		console.error(isLatin, unicode.toString(16), fname)
		const name = isLatin?'uni'+('000'+(fname.charCodeAt(0)).toString(16)).slice(-4):fname.replace(/-/g,'_')
		const glyph = new opentype.Glyph({unicode, advanceWidth, path, name});
		if(!isLatin)ligatures.push({sub: fname, by:glyph});
		return glyph;
	})]
	const fontMetrics = {unitsPerEm: advanceWidth, ascender: advanceWidth, descender: -Number.EPSILON};
	const font = new opentype.Font({...metadata,...fontMetrics, glyphs});
	ligatures.forEach(({sub,by}) => {
		const liga = {
			sub:sub.split('').map(e=>e.charCodeAt(0)).map(unicode=>glyphs.findIndex(g=>g.unicode==unicode)),
			by:glyphs.indexOf(by)
		}
		font.substitution.add("liga", liga);
	});
	return font;
}

/*
 DOM event related function
 */
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
/*
document.addEventListener('DOMContentLoaded', () =>{
	document.querySelectorAll('li[id^=latin-]').forEach(el=>el.classList.add('check'));
	makeFont(List)
})*/
if(typeof process !== "undefined") {
	const fs = require('fs');
	const pb = fs.readFileSync(process.argv[2], {encoding:"utf-8"});
	const font = makeFont(transform(serializeFiles(process.argv.slice(3))), parsePb(pb));
	process.stdout.write(Buffer.from(font.toArrayBuffer()))
}

