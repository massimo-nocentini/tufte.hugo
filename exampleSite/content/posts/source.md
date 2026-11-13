---
title: "Source"
subtitle: "Adobe's Source Serif 4, Source Sans 3 and Source Code Pro"
date: 2026-11-13T09:00:00+01:00
author: "Massimo Nocentini"
description: "A page set in Adobe's Source families: Source Serif 4 for the text, Source Sans 3 for the sans-serif and Source Code Pro, the theme's monospaced face, for the code."
tags: ["typography"]
categories: ["Documentation"]
# This page only; params.font sets the whole site.
font: source
# Old-style figures in the text (tufte-latex's osf), Source Serif 4's onum.
tufte:
  numerals: oldstyle
---

{{< newthought >}}The Source families are Adobe's first open-source fonts{{< /newthought >}}: Paul D. Hunt drew Source Sans in 2012 and Source Code from it, a monospaced companion for programmers, and Frank Grießhammer drew Source Serif from the transitional types of Pierre-Simon Fournier.{{< sidenote >}}The fonts are free, under the SIL Open Font License, and come with the theme in `static/source/`, Adobe's files as released. LaTeX loads the same families with `\usepackage{sourceserifpro}`, `sourcesanspro` and `sourcecodepro`.{{< /sidenote >}} The three share their proportions, so a page set in them reads as one voice in three registers.

## Turning it on

This page sets the family in its front matter,

```yaml
font: source    # Source Serif 4 and Source Sans 3
```

and a whole site sets it in its configuration:

```toml
[params]
  font = "source"
```

Source Code Pro needs no setting: it is the theme's monospaced face whatever the text font, but Libertinus, which keeps its own Libertinus Mono.

## The text faces

Source Serif 4 has true small caps, so {{< smallcaps >}}small capitals{{< /smallcaps >}} and the first words of a {{< newthought >}}new thought{{< /newthought >}} come from the font and are not shrunk capitals; old-style figures, which the numbers of the notes always use and which this page turns on for the whole text (1984, 2026) with the class option `numerals: oldstyle`; ligatures (*fi*, *fl*, *ff*, *ffi*); and Greek and Cyrillic: ἀρχή, λόγος, азбука.{{< marginnote >}}Every face holds Latin, Greek and Cyrillic in one file, about 60 to 110 kB, which a browser downloads only for a page that uses it.{{< /marginnote >}} Its *italic* is a true italic, and there is **bold** and ***bold italic***.

The sans-serif, {{< sans >}}Source Sans 3{{< /sans >}}, replaces Gill Sans wherever the theme sets sans-serif: in the `sans` shortcode, in the tables and with the `sfsidenotes` class option.

| Face | Use on this page |
|:-----|:-----------------|
| Source Serif 4 | text, headings, notes |
| Source Sans 3 | tables, `sans` |
| Source Code Pro | code, on every page |
{#tab:source-faces caption="The three Source families and where the theme uses them."}

Code is set in Source Code Pro, whose figures are lining even in a text with old-style ones (`n = 1984`):

```go
func gauss(n int) int { return n * (n + 1) / 2 }
```

The math keeps its own font: KaTeX's by default, or Euler or Libertinus Math with `mathFont` ($e^{i\pi} + 1 = 0$).
