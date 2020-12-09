The Ligature-based pico icon font.

```html
<style>
@font-face {
  font-family:picon;
  src:url(//yne.fr/picon/Picon-Regular.woff2);
}
.picon { font-family:picon; }
</style>
<span class=picon>app</span>
```

## Hackable

Picon is under **[SIL Open Font License 1.1](https://github.com/yne/picon/blob/master/OFL.txt) Licencied**, so you can

- build it
- use it
- break it
- sell it

## Pico sized

| Name                                             | Avg. SVGs sizes |
|:----------                                       |             ---:|
| [Picon](https://yne.fr/picon)                    |       144 Bytes |
| [Feather](https://feathericons.com/)             |       378 Bytes |
| [Material](https://material.io/resources/icons/) |       479 Bytes |
| [Jam](https://jam-icons.com/)                    |       535 Bytes |
| [teenyicons](https://teenyicons.com/)            |       597 Bytes |
| [Fontawesome](https://fontawesome.com)           |       754 Bytes |
| [Clarity](https://clarity.design/icons)          |       916 Bytes |
| [Entypo](http://www.entypo.com/)                 |      1070 Bytes |

## Pico readability (8x8)

| Iconset                                          | 🖼 | 📞 | 🔈 | 🕷️ |
|---                                               |---|---|---|---|
| [Clarity](https://clarity.design/icons)          | ![pic-clarity](.github/pages/compare/clarity-pic.png)     | ![phone-clarity](.github/pages/compare/clarity-phone.png)     | ![vol-clarity](.github/pages/compare/clarity-vol.png)     | ![bug-clarity](.github/pages/compare/clarity-bug.png) |
| [Entypo](http://entypo.com/)                     | ![pic-entypo ](.github/pages/compare/entypo-pic.png)      | ![phone-entypo ](.github/pages/compare/entypo-phone.png)      | ![vol-entypo ](.github/pages/compare/entypo-vol.png)      | ![bug-entypo ](.github/pages/compare/entypo-bug.png) |
| [Feather](https://feathericons.com/)             | ![pic-feather](.github/pages/compare/feather-pic.png)     | ![phone-feather](.github/pages/compare/feather-phone.png)     | ![vol-feather](.github/pages/compare/feather-vol.png)     | ![bug-feather](.github/pages/compare/feather-bug.png) |
| [Fontawesome](https://fontawesome.com)           | ![pic-fawesom](.github/pages/compare/fontawesome-pic.png) | ![phone-fawesom](.github/pages/compare/fontawesome-phone.png) | ![vol-fawesom](.github/pages/compare/fontawesome-vol.png) | ![bug-fawesom](.github/pages/compare/fontawesome-bug.png) |
| [Jam](https://jam-icons.com/)                    | ![pic-jamicon](.github/pages/compare/jam-pic.png)         | ![phone-jamicon](.github/pages/compare/jam-phone.png)         | ![vol-jamicon](.github/pages/compare/jam-vol.png)         | ![bug-jamicon](.github/pages/compare/jam-bug.png) |
| [Material](https://material.io/resources/icons/) | ![pic-materia](.github/pages/compare/material-pic.png)    | ![phone-materia](.github/pages/compare/material-phone.png)    | ![vol-materia](.github/pages/compare/material-vol.png)    | ![bug-materia](.github/pages/compare/material-bug.png) |
| [Picon](https://yne.fr/picon)                    | ![pic-picon  ](.github/pages/compare/picon-pic.png)       | ![phone-picon  ](.github/pages/compare/picon-phone.png)       | ![vol-picon  ](.github/pages/compare/picon-vol.png)       | ![bug-picon  ](.github/pages/compare/picon-bug.png) |
| [Teenyicons](https://teenyicons.com/)            |   |

## SVG vs Font

If want to have icons on your website, you may hesistate between using a couple of SVG, or importing a for or simply use unicode glyphs.

Picon is available as SVGs or as a font. But font format offer the following advantages:

- it will assure you to have a **reproducible** result on any plateform (unlike unicode).
- it can bundle many icons while being **lightweight** because of it binary and compressed format (unlike SVG).
- it can be used in **text-only** section like input placeholder or pseudo element (unlike SVG).
- it can be **colored** to match your style (unlike unicode or SVG that needs to be inlined in your DOM).
- it can have any brand logo or **custom icon** you may need (unlike Unicode)

|Criteria     | Uni | SVG | Font|
|:------------|:---:|:---:|:---:|
|Coloration   |  ✗  |  ✗  |  ✓  |
|Lightweight  |  ✓  |  ✗  |  ✓  |
|Reproductible|  ✗  |  ✓  |  ✓  |
|Customizable |  ✗  |  ✓  |  ✓  |
|Text-based   |  ✓  |  ✗  |  ✓  |
|Multi-color  |  ✓  |  ✓  |  ✗  |

