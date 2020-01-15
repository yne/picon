function normalize(p,w=16,h=16) {
	let [x,y] = p.match(/[0-9.]+/g)
	return [x*2, h-y*2]
}
function applyFont(font) {
	let ret = document.fonts.add(new FontFace(font.names.fontFamily.en, font.toArrayBuffer()));
}
function toPath(path,str){
	if(!str)return path;
	if(str[0]=='M')path.moveTo(...normalize(str));
	else path.lineTo(...normalize(str));
	return path;
}
function blankGlyph(unicode){
	return new opentype.Glyph({name:unicode, unicode, advanceWidth:16, path: new opentype.Path()})
}
function makeFont(form, advanceWidth=16, familyName="picon", styleName="medium"){
	if(typeof opentype === "undefined")
		return document.body.append(Object.assign(document.createElement('script'),{
			src:'https://cdn.jsdelivr.net/npm/opentype.js',
			onload: ()=>makeFont(...arguments)
		}));
	const checkdGlyph = [...form.querySelectorAll('.check img')].map(path=>[path.closest('li').id.replace(/^latin-/,''), path.src.slice(20+67,-15)]);
	const notdefGlyph = new opentype.Glyph({name: '.notdef', unicodes: 0,advanceWidth, path: new opentype.Path()});
	const alphaGlyphs = "-abcdefghijklmnopqrstuvwxyz0123456789".split('').filter(c=>!checkdGlyph.find(([C])=>c==C)).map(c=>[c,"M2,5 4,3 6,5"]);
	// fill required glyph (for ligature) with blank glyph (if not in the checkdGlyph)
	const svgs = [...alphaGlyphs, ...checkdGlyph];
	var ligatures = [];
	const glyphs = [notdefGlyph, ...svgs.map(([names,pathData],i) => {
		const [name,uni] = names.split('.').map(decodeURIComponent);
		const isLatin = (name.length==1 && name.charCodeAt(0) < 255);
		const unicode = isLatin ? name.charCodeAt(0) : 0xE000+i;
		const path = pathData.split(' ').reduce(toPath,new opentype.Path());
		const glyph = new opentype.Glyph({name, unicode, advanceWidth, path});
		if(!isLatin)ligatures.push({sub: name, by:glyph});
		return glyph;
	})]
	const fontMetrics = {unitsPerEm: advanceWidth, ascender: advanceWidth, descender: -Number.EPSILON};
	const font = new opentype.Font({familyName, styleName,...fontMetrics, glyphs});
	ligatures.forEach(({sub,by}) => {
		const liga = {
			sub:sub.split('').map(e=>e.charCodeAt(0)).map(unicode=>glyphs.findIndex(g=>g.unicode==unicode)),
			by:glyphs.indexOf(by)
		}
		font.substitution.add("liga", liga);
	});
	document.fonts.add(new FontFace(font.names.fontFamily.en, font.toArrayBuffer()));
	applyFont(font);
	font.download();
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
/*
document.addEventListener('DOMContentLoaded', () =>{
	document.querySelectorAll('li[id^=latin-]').forEach(el=>el.classList.add('check'));
	makeFont(List)
})*/
