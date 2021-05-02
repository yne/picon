# The Pico-icon set

- ~810 libre icons released as SVG, Sprite, PNG, ligatured Font, and JSON ([icomoon](https://icomoon.io/app) compatible), (see: [format comparaison](https://github.com/yne/picon/wiki/format))
- Lightweight: Average SVGs are ~145 Bytes, that's 5 times lighter than Fontawesome (see: [size comparaison](https://github.com/yne/picon/wiki/size))
- Designed on a 8px grid: to be readable at 8px 16px 24px 32px 48px ... (see: [render comparaison](https://github.com/yne/picon/wiki/render))
- ~656100 icon composition possible (see: Advanced usage)
- CDN backed

# Basic Usage

```html
<!-- SVG standalone -->
<img src="//unpkg.com/picon/solid/app.svg" alt="app">

<!-- SVG Sprite -->
<svg><use xlink:href="//unpkg.com/picon/solid.svg#app"></use></svg>

<!-- Ligatured Font -->
<style>
@font-face {
  src: url(//unpkg.com/picon);
  font-family: picon;
}
.picon { font-family: picon; }
</style>
<span class=picon>app</span>
```

# Advanced Usage

## Mardown compatibility

If you don't need the "strikeout" mardown feature (`~~app~~`) you can create a rule to show them as icons:

```css
del { font-family:picon; text-decoration: none;}
```

## Composition

To stay lightweight Picon does not provide composed (call-in, call-out, call-forward) icons.
Here is how to create any possible icon composition:

- Same size overlay :
```html
<style>
/* stack same level space-separated icons */
.picon {word-spacing: -2em;}
/* stack smaller top/bottom icon */
.picon>sup,.picon>sub{
	font-size: .5em;
	margin-left: -1em;
}
.picon>sup{vertical-align:text-top;}
.picon>sub{vertical-align:text-bottom;}
.green{color: #080;}
.orange{color: #F80;}
.revert{color: #fff;mix-blend-mode:exclusion;}
</style>
<span class=picon>wifi-0 not</span>
<span class=picon>wifi-0<sub>+</sub></span>
<span class=picon>wifi-0<sup>+</sup></span>
```

```css
body{
	font-size: 96px;
}
h1 {
	background: linear-gradient(#30CFD0, #330867);
	background-clip: text;
	-webkit-text-fill-color: transparent;
}
```

# HTML integration

As opposed to SVG, font icons can be used in text-only elements:

```html

<input type=reset class=picon value=cross>

<select>
	<optgroup label=iconless>
		<option>wifi-0
	</optgroup>
	<optgroup class=picon label="wifi-0">
		<option>wifi-0
		<option>wifi-4
	</optgroup>
</select>
```

It can also react to elements states/attributes.

For example it can automatically display the corresponding language icon to a `<pre>` code element:

```html
<pre lang=js>{}</pre>
<style>
pre[lang]:after{
	font-family: picon;
	content: attr(lang);
	float: right;
}
</style>
```

# Animation

```html
<style>
@keyframes hourglass {
	0%,100%{content:'hourglass0'}
	10%{content:'hourglass1'}
	20%{content:'hourglass2'}
	20%{content:'hourglass3'}
	40%{content:'hourglass4'}
	20%{content:'hourglass5'}
	60%{content:'hourglass6'}
	20%{content:'hourglass7'}
	80%{content:'hourglass8'}
}
.wait:after{
	font-family: picon;
	content: 'hourglass-0';
	animation: hourglass 1s infinite;
}
</style>
<input type=submit disabled class=wait>
```
