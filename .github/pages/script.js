function normalize(p,w=16,h=16) {
	let [x,y] = p.match(/[0-9.]+/g)
	return [x*2, h-y*2]
}
function applyFont(font) {
	let ret = document.fonts.add(new FontFace(font.names.fontFamily.en, font.toArrayBuffer()));
	console.log(ret)
}
function toPath(path,str){
	if(!str)return path;
	if(str[0]=='M')path.moveTo(...normalize(str));
	else path.lineTo(...normalize(str));
	return path;
}
function makeFont(form, advanceWidth=16, familyName="picon", styleName="medium"){
	if(typeof opentype === "undefined")
		return document.body.append(Object.assign(document.createElement('script'),{
			src:'https://cdn.jsdelivr.net/npm/opentype.js',
			onload: ()=>makeFont(...arguments)
		}));
	const svgs = [...form.querySelectorAll(':checked+svg')].map(path=>[path.closest('a').id, path.getAttribute('d')]);
	const notdefGlyph = new opentype.Glyph({name: '.notdef', unicodes: 0,advanceWidth, path: new opentype.Path()});
	const alphaGlyphs = [];/*"-abcdefghijklmnopqrstuvwxyz0123456789".split('').map(name=>new opentype.Glyph({
		name, unicode: name.charCodeAt(0), advanceWidth, path: new opentype.Path()}));*/
	var ligatures = [];
	const glyphs = [notdefGlyph,...alphaGlyphs, ...svgs.map((svg,i) => {
		const [name,uni] = svg[0].split('.');
		const unicode = (!name&&uni&&uni.length==1)?uni.charCodeAt(0):0xE000+i;
		const path = svg.slice(1).reduce(toPath,new opentype.Path());
		const glyph = new opentype.Glyph({name:name||uni, unicode, advanceWidth, path});
		if(name)ligatures.push({sub: name, by:glyph});
		return glyph;
	})]
	const fontMetrics = {unitsPerEm: advanceWidth, ascender: advanceWidth, descender: -Number.EPSILON};
	const font = new opentype.Font({familyName, styleName,...fontMetrics, glyphs});
	ligatures.forEach(({sub,by}) => font.substitution.add("liga",{
		sub:sub.split('').map(e=>e.charCodeAt(0)).map(unicode=>glyphs.findIndex(g=>g.unicode==unicode)),
		by:glyphs.indexOf(by)
	}) );
	document.fonts.add(new FontFace(font.names.fontFamily.en, font.toArrayBuffer()));
	console.log(font);
}

function filter(form,className="highlight") {
	form.querySelectorAll(`.${className}`).forEach(e=>e.classList.remove(className))
	if(form.q.value)
		form.querySelectorAll(`a[id*='${form.q.value}']`).forEach(e=>e.classList.add(className));
}
function highlightCheck(checked){
	form.querySelectorAll('.highlight [type=checkbox]').forEach(e=>e.checked=checked)
}
let prevToggle=null;
function toggle(checkbox, event){
	event.stopPropagation();//avoid <a> "clip" event
	if(event.shiftKey && prevToggle) {
		const all = [...checkbox.form.querySelectorAll('a>[type=checkbox]')];
		const [from, to] = [prevToggle,checkbox].map(c=>all.findIndex(e=>c==e)).sort();
		all.slice(from+1,to).forEach(cb=>cb.checked^=1);
	}
	prevToggle = checkbox;
}
function clip(target, event) {
	event.stopPropagation();
	const text = target.id;
  if (!navigator.clipboard)
		return alert(`No clipboard API to copy ${text}`);
	setTimeout(() => target.classList.remove('copied'),1000);
	navigator.clipboard.writeText(target.id).then(
		res => target.classList.add('copied'),
		err => alert(`Unable to copy ${text}\n`+err));
}
