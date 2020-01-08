# [Easy](#Usage) [Hackable](#Hackable) **[PI](#Pico)[CON](#Icon)** [Font](#Font)

Download as [Font](picon.woff2) or [SVGs](picon.zip)

## Usage

Picon is a **ligature**-based icon font, and so, it does not require any external CSS stylesheet, or any javascript.

Import it:
```css
@font-face {
  font-family:picon;
  src:url(//yne.fr/picon/picon.woff2);
}
```

Declare it the way you like it:
```css
// the good
.picon { font-family:picon; }
// the bad
picon { font-family:picon; }
// and the ugly
del { font-family:picon; text-decoration: none;}
```

Use it :
```html
<del>app</del>
```
to get the app ~~app~~ icon

## Hackable

Picon is **MIT Licencied**, so you can [modify it](editor.html) and even rebuild your own custom version that suits you the best.

## Pico sized

Picon strive to be:

<details><summary>the lightest iconset</summary>

| Name                                             | Avg. SVGs sizes |
|:----------                                       | ---:|
| [Entypo](http://www.entypo.com/)                 | 1070.060 Bytes |
| [Clarity](https://clarity.design/icons)          |  916.036 Bytes |
| [Fontawesome](https://fontawesome.com)           |  754.582 Bytes |
| [Jam](https://jam-icons.com/)                    |  535.844 Bytes |
| [Material](https://material.io/resources/icons/) |  479.151 Bytes |
| [Feather](https://feathericons.com/)             |  378.872 Bytes |
| [Picon](https://yne.fr/picon)                    |  144.137 Bytes |

Those values have been computed using the following line

```sh
find -name '*.svg' -printf '%s\n' | awk '{s+=$0} END {printf s/NR}'
```

</details>

<details><summary>readable down to 8px * 8px</summary>

| Iconset                                          | 🖼 | 📞 | 🔈 | 🕷️ |
|---                                               |---|---|---|---|
| [Clarity](https://clarity.design/icons)          | ![](.github/pages/compare/clarity-pic.png) | ![](.github/pages/compare/clarity-phone.png) | ![](.github/pages/compare/clarity-vol.png) | ![](.github/pages/compare/clarity-bug.png) |
| [Feather](https://feathericons.com/)             | ![](.github/pages/compare/feather-pic.png) | ![](.github/pages/compare/feather-phone.png) | ![](.github/pages/compare/feather-vol.png) | ![](.github/pages/compare/feather-bug.png) |
| [Fontawesome](https://fontawesome.com)           | ![](.github/pages/compare/fontawesome-pic.png) | ![](.github/pages/compare/fontawesome-phone.png) | ![](.github/pages/compare/fontawesome-vol.png) | ![](.github/pages/compare/fontawesome-bug.png) |
| [Jam](https://jam-icons.com/)                    | ![](.github/pages/compare/jam-pic.png) | ![](.github/pages/compare/jam-phone.png) | ![](.github/pages/compare/jam-vol.png) | ![](.github/pages/compare/jam-bug.png) |
| [Material](https://material.io/resources/icons/) | ![](.github/pages/compare/material-pic.png) | ![](.github/pages/compare/material-phone.png) | ![](.github/pages/compare/material-vol.png) | ![](.github/pages/compare/material-bug.png) |
| [Picon](https://yne.fr/picon)                    | ![](.github/pages/compare/picon-pic.png) | ![](.github/pages/compare/picon-phone.png) | ![](.github/pages/compare/picon-vol.png) | ![](.github/pages/compare/picon-bug.png) |
| [Entypo](http://entypo.com/)                     | ![](.github/pages/compare/entypo-pic.png) | ![](.github/pages/compare/entypo-phone.png) | ![](.github/pages/compare/entypo-vol.png) | ![](.github/pages/compare/entypo-bug.png) |

</details>

## Font

If want to have icons on your website, you may hesistate between using a couple of SVG, or importing a for or simply use unicode glyphs.

Picon is available as SVGs or as a font. But font format offer the following advantages:

- it will assure you to have a **reproducible** result on any plateform (unlike unicode).
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

Neat font tricks:

- text-based animation (`@keyframe` + `content:'hourglass-0'`)
- attribut based (`[lang]`, `:disabled`, `:checked`) icons changes
- icon composition

# Icon

