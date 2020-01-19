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
function transform(glyphs) {
	/**
		OpenType does not support 8x8 grid, and Y coordinate are inverted
		We must translate to the nearest supported grid : 16*16
	*/
	if(!opentype) {
		opentype = require("./opentype.js");
	}
	function normalize(p,w=16,h=16) {
		let [x,y] = p.match(/[0-9.]+/g)
		return [x*2, h-y*2]
	}
	return glyphs
		.map(([name, svg]) => [
			name.replace(/^latin-/,'').split('.').map(decodeURIComponent),
			(svg.split('"')[5]||'').split(' ').filter(Boolean).reduce((path,str)=> {
				if(str[0] === 'M')
					path.moveTo(...normalize(str))
				else
					path.lineTo(...normalize(str))
				return path;
			}, new opentype.Path())
		]).reduce((all, [names,path])=>{
			names.forEach(name=>all.push([name,path]));
			return all;
		},[])
}

function makeFont(checkdGlyph, advanceWidth=16) {
	const notdefGlyph = new opentype.Glyph({name: '.notdef', advanceWidth, path: new opentype.Path()});
	const alphaGlyphs = "-abcdefghijklmnopqrstuvwxyz0123456789".split('').filter(c=>!checkdGlyph.find(([C])=>c==C)).map(c=>[c,new opentype.Path()]);
	// fill required glyph (for ligature) with blank glyph (if not in the checkdGlyph)
	const svgs = [...alphaGlyphs, ...checkdGlyph];
	var ligatures = [];
	const glyphs = [notdefGlyph, ...svgs.map(([name, path], i) => {
		const isLatin = (name.length==1 && name.charCodeAt(0) < 255);
		const unicode = isLatin ? name.charCodeAt(0) : 0xE000+i;
		const glyph = new opentype.Glyph({name, unicode, advanceWidth, path});
		if(!isLatin)ligatures.push({sub: name, by:glyph});
		return glyph;
	})]
	const fontLegal = {
		familyName: "Picon", styleName:"Regular", postScriptName:"Picon-Regular",/*fullName, fontSubfamily:"Regular",*/ version:"Version 1.0; git-0000000-release",
		designer: "yne", designerURL: "https://github.com/yne",
		manufacturer: "yne", manufacturerURL: "https://yne.fr",
		license: 'Apache', licenseURL: 'https://www.apache.org/licenses/LICENSE-2.0',
		description: "Easy Hackable PicoIcon Set", copyright: "2020", trademark: "2020",
	};
	const fontMetrics = {unitsPerEm: advanceWidth, ascender: advanceWidth, descender: -Number.EPSILON};
	const font = new opentype.Font({...fontLegal,...fontMetrics, glyphs});
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
	const font = makeFont(transform(serializeFiles(process.argv.slice(2))));
	process.stdout.write(Buffer.from(font.toArrayBuffer()))
}

