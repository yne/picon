/* Convert .pb files to OpenType.js FontDeclaration. TODO: generate pb from JSON */
function parsePb(pb) {
	let json = ('\n' + pb)
		.replace(/([^{])\n([^}])/g,'$1,\n$2')
		.replace(' {',':{')
		.replace(/\n *([a-z_]+):/g,'\n"$1":')
		.replace(/_(url|\w)/g,(f,l)=>l.toUpperCase())
		;
	let obj = JSON.parse('{'+json+'}');
	return {
		...obj,
		...obj.fonts,action,
		fonts: undefined,
		familyName: obj.name,
		weightClass: obj.fonts.weight,
		tables: {
			os2: {
				achVendID: obj.vendor,
				bProportion: obj.bProportion
			}
		}
	}
}
/* NODE: generate a JSON from a list of svgs */
const re = {tag:/(\w+)-/g,uni:/(%..)+/g}
const buildJson = (pb,...svgs) => ({
	...parsePb(require('fs').readFileSync(pb)),
	glyphs: svgs.map(p => ({
		basename: require('path').basename(p, '.svg'),
		svg: require('fs').readFileSync(p, 'utf8')
	})).sort((a,b)=> a.basename < b.basename ? -1 : (a.basename > b.basename ? 1 : 0)).map((p, i) => ({
		tags: (p.basename.match(re.tag)||[]).map(tag=>tag.slice(0, -1)),
		unicodes: (p.basename.match(re.uni)||[]).map(xx=>decodeURIComponent(xx).charCodeAt(0)),
		ligatures: p.basename.replace(re.tag,'').replace(re.uni, '').split('.').filter(Boolean).map(r => decodeURIComponent(r)),
		viewBox: (p.svg.match(/ viewBox="\d+ \d+ (\d+) (\d+)"/)||[]).slice(-2),
		path: (p.svg.match(/ d=".*?"/g)||'').map(path => path.slice(4,-1))[0],
	}))
});
const buildPb = (pb) => JSON.stringify(parsePb(require('fs').readFileSync(pb, 'utf8')), null, 2)
const actions = {buildJson, buildPb};
if(typeof window === 'undefined' && process.argv[2] in actions) {
	process.stdout.write(JSON.stringify(actions[process.argv[2]](...process.argv.slice(3)), null, 2))
}
