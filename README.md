# [Easy](#Usage) [Hackable](#Hackable) **[PI](#Pico)[CON](#Icon)** [Font](#Font)

## Usage

Import it:
```css
@font-face {
  font-family:picon;
  src:url(//yne.fr/picon/picon.woff2);
}
```

Declare it:
```css
del { // or .picon, rb, i ...
  font-family:picon;
}
```

Use it :
```html
<del>app</del>
```
to get the app ~~app~~ icon

## Hackable

Picon is **MIT Licencied**, so you can [modify it](editor)
and rebuild your own version that suits you the best

## Pico sized

Picon strive to :

<details><summary>have the lowest Byte Per Icon</summary>

| Name       | BPI |
|:---------- | ---:|
| Picon      | 180 |
| Fontawesome| 180 |
| Clarity    | 180 |
| Entypo     | 180 |
| Jam        | 180 |
| Feather    | 180 |
| Material   | 180 |

</details>

<details><summary>be readable down to 8px</summary>

| 🖼 | 📞 | 🔈 | 🕷️ | Iconset|
|---|---|---|---|---|
|   |   |   |   | Feather |
|   |   |   |   | Clarity |
|   |   |   |   | FontAwesome |
|   |   |   |   | Entypo |
|   |   |   |   | Picon |
|   |   |   |   | Material |
|   |   |   |   | Jam |

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

# Icon

[Download SVG](picon.tar.bz2)

