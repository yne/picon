# The Pico-icon set

[![preview](https://raw.githubusercontent.com/yne/picon/gh-pages/solid.png)](list.html)

[Download](https://github.com/yne/picon/releases) | [Icon finder](https://yne.fr/picon/list) | [Editor](https://yne.fr/picon/edit)

- ~850 libre icons released as ligatured Font, SVG, PNG, and JSON [icomoon](https://icomoon.io/app) project, [compare](https://github.com/yne/picon/wiki/format)
- Hackable: Remove any useless icon using the [Icomoon](https://icomoon.io/app) app (`min` variant already available if you don't want care about ASCII glyphs)
- Lightweight: Average SVGs are 5x lighter than Fontawesome, [source](https://github.com/yne/picon/wiki/size)
- Designed on a 8px grid: to be readable at 8px 16px 24px 32px 48px ... [demo](https://github.com/yne/picon/wiki/render)
- Thousand of icon [composition](#composition) possible
- CDN backed via [unpkg.com](https://unpkg.com/picon) and [jsdelivr.net](https://cdn.jsdelivr.net/npm/picon)

# Usage

```html
<!-- SVG: for casual usage -->
<img src="//unpkg.com/picon/solid/app.svg" alt="app">

<!-- Sprites: for massive usage -->
<svg><use xlink:href="//unpkg.com/picon/solid.svg#app"></use></svg>

<!-- Font: for ligature junky -->
<style>
@font-face {
  src: url(https://unpkg.com/picon);
  font-family: picon;
}
.picon { font-family: picon; }
</style>

<span class=picon>app</span>
```

> Tips: Always use a versioned CDN url (ex: `https://unpkg.com/picon@21.5.5`) for production

# Mardown Integration

If you don't need the `~~strikeout~~` mardown feature you can create a rule to show striked text as icons:

```css
del, s {
	font-family:picon; 
	text-decoration: none;
}
```

[Live Demo](https://codepen.io/qxc32034/pen/PopoOzZ)

# Composition

To stay lightweight, Picon does not provide any composed icons like `call-in`, `call-out`, `call-forward`.

Following the previous Mardown `<del>` example, you can compose using:

```html
<style>
del {
	font-family: picon;
	word-spacing: -2em; /* Same size overlay */
	text-decoration: none; /* un-strike */
	text-shadow:/* white halo */
	-1px -1px 0 white,
	-1px -0px 0 white,
	-1px  1px 0 white,
	-0px -1px 0 white,
	-0px -0px 0 white,
	-0px  1px 0 white,
	 1px -1px 0 white,
	 1px -0px 0 white,
	 1px  1px 0 white;
}
del>sup,del>sub{
	font-size: .5em; /* twice smaller */
	margin-left: -1em; /* right side*/
}
del>sup{vertical-align:text-top;}
del>sub{vertical-align:text-bottom;}
</style>
```

> Note: replace `del` with `s` or `.picon` according to your Mardown processor

you can now associate any [parent](list#parent) with any [child](list#child%7Carrow%7Clang) icon:

```html
<del>microphone not</del>
<del>wifi4<sub>!</sub></del>
<del>printer<sub>magnifier</sub></del>
<del>bluetooth<sub>add</sub></del>
<del>gsm0<sub>chain</sub></del>
<del>wifi4<sub>5g</sub></del>
<del>lock<sub>warning</sub></del>
<del>file<sub>attachment</sub></del>
<del>calendar<sub>add</sub></del>
<del>battery<sub>bolt</sub></del>
<del>file<sub>markdown</sub></del>
<del>call<sup>rightward</sup></del>
<del>drive<sub>wrench</sub></del>
<del>screen<sub>colors</sub></del>
<del>picture<sub>contrast</sub></del>
```

[Live Demo](https://codepen.io/qxc32034/pen/PopoOzZ)

# HTML text element

As opposed to SVG, ligatured font can be used in text-only elements (`<option>`, `<input>` ...):

```html
<input type=reset class=picon value=cross>

<select>
	<optgroup label=iconless>
		<option>wifi0
	</optgroup>
	<optgroup class=picon label="wifi0">
		<option>wifi0
		<option>wifi4
	</optgroup>
</select>
```

[Live Demo](https://codepen.io/qxc32034/pen/zYZYPra)

# Pseudo-element

Font can react from states and attributes.

For example it can automatically display the corresponding language icon to a `<pre>` element:

```html
<pre lang=js>
function example(){
	return 0;
}
</pre>

<style>
pre[lang]::before{
	font-family: picon;
	content: attr(lang);
	float: right;
}
</style>
```

[Live Demo](https://codepen.io/qxc32034/pen/XWMWzWE)

It can also help to unify browser style for input typefile/checkbox/radio:

```html
<input type=file data-before=file style=width:1em>
<input type=checkbox data-before=ballot data-before-checked=checked style=appearance:none>
<input type=radio data-before=false data-before-checked=true style=appearance:none>
<style>
[data-before]::before{
	font-family: picon;
	content: attr(data-before);
}
[data-before-checked]:checked::before{
	font-family: picon;
	content: attr(data-before-checked);
}
</style>
```

[Live Demo](https://codepen.io/qxc32034/pen/wvJvrVM)

# Color gradient

```html
<style>
.rainbow{
	background: linear-gradient(
	#5eb544 00.0% 37.5%,
	#f5b226 37.5% 50.0%,
	#ed7e1e 50.0% 62.5%,
	#d9383c 62.5% 75.0%,
	#913b92 75.0% 87.5%,
	#0098d5 87.5% 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}
<style>
<input type=search class="picon rainbow">
```

[Live Demo](https://codepen.io/qxc32034/pen/ZEeEXNX)

# Animation

Add a hourglass spinner to any disabled button

```html
<style>
@font-face {
  src: url(https://unpkg.com/picon);
  font-family: picon;
}
@keyframes hourglass {
	0%{content:'hourglass1'}
	10%{content:'hourglass2'}
	20%{content:'hourglass3'}
	30%{content:'hourglass4'}
	40%{content:'hourglass5'}
	50%{content:'hourglass5'}
	60%{content:'hourglass6'}
	70%{content:'hourglass7'}
	80%{content:'hourglass8'}
}
button:disabled::after{
	font-family: picon;
	content: 'hourglass1';
	animation: hourglass 1s infinite;
}
</style>
<button onclick="disabled=true">Upload</button>
```

[Live Demo](https://codepen.io/qxc32034/pen/yLMLzwb)

> Note: `::before` and `::after` pseudo-element only work on HTML elements that accept children (`<input>` with `type` set to `text`,`button`)
