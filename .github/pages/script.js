let svgs = [];
window.addEventListener('DOMContentLoaded', (event) => {
	const template = document.querySelector('template');
	if(!template)return console.log('please add a <template> (via CI)')
	const lines = template.innerHTML.split(/\n/);
	svgs = lines.map(e=>e.split(/\s+/)).filter(_=>_.length>1).sort();
	showImg(svgs, document.getElementById('list'));
	
	//applyFont(makeFont(svgs));
});
function toSVG(g,size){
	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><path d="${g.join(' ')}"></path></svg>`
}
function el(tag,attr={}){
	return Object.keys(attr).reduce((e,a)=>(e[a]=attr[a],e),document.createElement(tag));
}
function showImg(svgs, grid) {
	grid.innerHTML="";
	const sorted = svgs
		.map(([name,...path])=>[name.split(/[-\.]/)[0],name,el('img',{tabIndex:-1,onclick:copyTextToClipboard,name,src:`data:image/svg+xml;utf8,`+toSVG(path,8)})])
		.map((icon,_,icons) => (icon[0]=icons.filter(([c])=>c==icon[0]).length==1?'':icon[0],icon))
		.sort(([cat],[_cat])=>cat.localeCompare(_cat))
		.reduce((map,[cat,name,img])=>((map[cat]=(map[cat]||el('span',{"aria-label":cat}))).append(img),map),{});
	Object.values(sorted).forEach(cat => grid.append(cat))
}

function normalize(p,w=16,h=16){
	let [x,y] = p.match(/[0-9.]+/g)
	return [x*2, h-y*2]
}
function applyFont(font){
	let ret = document.fonts.add(new FontFace(font.names.fontFamily.en, font.toArrayBuffer()));
	console.log(ret)
}
function toPath(path,str){
	if(!str)return path;
	if(str[0]=='M')path.moveTo(...normalize(str));
	else path.lineTo(...normalize(str));
	return path;
}
function makeFont(svgs, advanceWidth=16, familyName="picon", styleName="medium"){
	const notdefGlyph = new opentype.Glyph({
		name: '.notdef', unicodes: 0,advanceWidth, path: new opentype.Path()});
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
	return font;
}


function copyTextToClipboard(ev) {
	var text = ev.target.name;
  if (navigator.clipboard)
		return navigator.clipboard.writeText(text).then(function() {
		  console.log('Async: Copying to clipboard was successful!');
		}, function(err) {
		  console.error('Async: Could not copy text: ', err);
		});
  var textArea = el("textarea", {value:text, style:"position:fixed"});
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var msg = document.execCommand('copy') ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
