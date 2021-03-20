## Usage

Picon is a **ligature**-based icon font, and so, it does not require any external CSS stylesheet, or any javascript.

Import it:
```css
@font-face {
  font-family:picon;
  src:url(//yne.fr/picon/Picon-Regular.woff2);
}
```

Declare it the way you like it, here is some examples:
```css
/* the safe */
.picon { font-family:picon; }
/* the brave */
i { font-family:picon; }
/* the markdown lover */
del { font-family:picon; text-decoration: none;}
```

Use it :
```html
<del>app</del>
```
to get the app ~~app~~ icon

## Hackable

Picon is under **[SIL Open Font License 1.1](https://github.com/yne/picon/blob/master/OFL.txt) licenced**, so you can

- rebuild your own version
- use it in any commercial project
- [modify it](editor.html)
- redistribute/sell it (if you can)

## Pico sized

Picon strive to be:

<details><summary>the lightest iconset</summary>

| Name                                             | Avg. SVGs sizes |
|:----------                                       |             ---:|
| [Picon](https://yne.fr/picon)                    |  144 Bytes |
| [Feather](https://feathericons.com/)             |  378 Bytes |
| [Material](https://material.io/resources/icons/) |  479 Bytes |
| [Jam](https://jam-icons.com/)                    |  535 Bytes |
| [Fontawesome](https://fontawesome.com)           |  754 Bytes |
| [Clarity](https://clarity.design/icons)          |  916 Bytes |
| [Entypo](http://www.entypo.com/)                 | 1070 Bytes |

Those values have been computed using the following line

```sh
find -name '*.svg' -printf '%s\n' | awk '{s+=$0} END {printf s/NR}'
```

</details>

<details><summary>readable down to 8px * 8px</summary>

| Iconset                                          | 🖼 | 📞 | 🔈 | 🕷️ |
|---                                               |---|---|---|---|
| [Clarity](https://clarity.design/icons)          | ![pic-clarity](.github/pages/compare/clarity-pic.png)     | ![phone-clarity](.github/pages/compare/clarity-phone.png)     | ![vol-clarity](.github/pages/compare/clarity-vol.png)     | ![bug-clarity](.github/pages/compare/clarity-bug.png) |
| [Feather](https://feathericons.com/)             | ![pic-feather](.github/pages/compare/feather-pic.png)     | ![phone-feather](.github/pages/compare/feather-phone.png)     | ![vol-feather](.github/pages/compare/feather-vol.png)     | ![bug-feather](.github/pages/compare/feather-bug.png) |
| [Fontawesome](https://fontawesome.com)           | ![pic-fawesom](.github/pages/compare/fontawesome-pic.png) | ![phone-fawesom](.github/pages/compare/fontawesome-phone.png) | ![vol-fawesom](.github/pages/compare/fontawesome-vol.png) | ![bug-fawesom](.github/pages/compare/fontawesome-bug.png) |
| [Jam](https://jam-icons.com/)                    | ![pic-jamicon](.github/pages/compare/jam-pic.png)         | ![phone-jamicon](.github/pages/compare/jam-phone.png)         | ![vol-jamicon](.github/pages/compare/jam-vol.png)         | ![bug-jamicon](.github/pages/compare/jam-bug.png) |
| [Material](https://material.io/resources/icons/) | ![pic-materia](.github/pages/compare/material-pic.png)    | ![phone-materia](.github/pages/compare/material-phone.png)    | ![vol-materia](.github/pages/compare/material-vol.png)    | ![bug-materia](.github/pages/compare/material-bug.png) |
| [Picon](https://yne.fr/picon)                    | ![pic-picon  ](.github/pages/compare/picon-pic.png)       | ![phone-picon  ](.github/pages/compare/picon-phone.png)       | ![vol-picon  ](.github/pages/compare/picon-vol.png)       | ![bug-picon  ](.github/pages/compare/picon-bug.png) |
| [Entypo](http://entypo.com/)                     | ![pic-entypo ](.github/pages/compare/entypo-pic.png)      | ![phone-entypo ](.github/pages/compare/entypo-phone.png)      | ![vol-entypo ](.github/pages/compare/entypo-vol.png)      | ![bug-entypo ](.github/pages/compare/entypo-bug.png) |

</details>

## Font

If want to have icons on your website, you may hesitate between using a couple of SVG, or importing a for or simply use unicode glyphs.

Picon is available as SVGs or as a font. But font format offer the following advantages:

- it will assure you to have a **reproducible** result on any platform (unlike unicode).
- it can bundle many icons while being **lightweight** because of it binary and compressed format (unlike SVG).
- it can be used in **text-only** section like input placeholder or pseudo element (unlike SVG).
- it can be **colored** to match your style (unlike unicode or SVG that needs to be embedded to do that).
- it can have any brand logo or **custom icon** you may need (unlike Unicode)

|Criteria     |Uni|SVG|Font|
|:------------|:---:|:---:|:---:|
|Coloration   | ✗ | ✗ | ✓  |
|Lightweight  | ✓ | ✗ | ✓  |
|Reproductible| ✗ | ✓ | ✓  |
|Custom Glyph | ✗ | ✓ | ✓  |
|Text-based   | ✓ | ✗ | ✓  |
|Multi-shade  | ✓ | ✓ | ✗  |

## Secret snippets

The following are for advanced users only.

<details>
<summary>Animation <a name=wifi></a></summary>

Because why not

```css
@keyframes wifi {
	0%,100%{content:'wifi-0'}
	20%{content:'wifi-1'}
	40%{content:'wifi-2'}
	60%{content:'wifi-3'}
	80%{content:'wifi-4'}
}
.wifi:after{
	font-family:Picon;
	content:'wifi-4';
	animation: wifi 1s infinite;
}
```

</details>

<details>
<summary>Icons in my form ?</summary>

Any HTML element that display text (reset button, select ...) can also display Picon icons:

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

</details>

<details>
<summary>attribute based icon</summary>

Display the language icon of a `<pre lang=js>var i=0</pre>` :

```css
pre[lang]:after{
	font-family:Picon;
	content:'lang-' attr(lang);
	float:right;
}
```

</details>

<details>
<summary>Icon stacking</summary>

You can stack multiple icons with the following CSS snippet:

```css
[data-picon]{
	position: relative;
	font-size:32px;
}
[data-picon]:after{
	content:attr(data-picon);
	position: absolute;
	left: 0;
	text-shadow: 0 -2px white;
}
```

Example: Stack a `cross` icon over a `volume` icon:

```html
<del data-picon=cross>volume</del>
```

</details>

