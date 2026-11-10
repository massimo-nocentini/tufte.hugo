---
title: "Libertinus"
subtitle: "One family for the text, the notes, the code and the math"
date: 2026-11-10T09:00:00+01:00
author: "Massimo Nocentini"
description: "A page set in Libertinus, the OpenType heir of Linux Libertine and Biolinum: Libertinus Serif for the text, Libertinus Sans and Mono, and Libertinus Math for the formulas."
tags: ["typography", "math", "katex"]
categories: ["Documentation"]
# This page only; params.font and params.math.font set the whole site.
font: libertinus
mathFont: libertinus
# Old-style figures in the text (tufte-latex's osf), Libertinus's onum.
tufte:
  numerals: oldstyle
---

{{< newthought >}}Libertinus is a family of fonts{{< /newthought >}} grown from Philipp Poll's Linux Libertine and Linux Biolinum, which Khaled Hosny forked in 2012 and which Caleb Maclennan now maintains.{{< sidenote >}}The fonts are free, under the SIL Open Font License, and come with the theme in `static/libertinus/`. LaTeX loads the same family with `\usepackage{libertinus}`, or `libertinus-otf` under XeLaTeX and LuaLaTeX.{{< /sidenote >}} It has a serif for the text, a sans-serif, a monospaced face and an OpenType math font drawn to match the serif, so a page set in it reads as one voice: the letters of $x$ and $f(x)$ in a formula are the letters of the text around them.

## Turning it on

This page sets both fonts in its front matter:

```yaml
font: libertinus       # Libertinus Serif, Sans and Mono
mathFont: libertinus   # Libertinus Math
```

and a whole site sets them in its configuration:

```toml
[params]
  font = "libertinus"
[params.math]
  font = "libertinus"
```

The two are independent: Libertinus text with Euler math (`mathFont: euler`), or ET Book text with Libertinus Math, work as well.

## The text faces

Libertinus Serif has true small caps, so {{< smallcaps >}}small capitals{{< /smallcaps >}} and the first words of a {{< newthought >}}new thought{{< /newthought >}} come from the font and are not shrunk capitals; old-style figures, which the numbers of the notes always use and which this page turns on for the whole text (1984, 2026) with the class option `numerals: oldstyle`; ligatures (*fi*, *fl*, *ff*, *ffi*); and Greek and Cyrillic: ἀρχή, λόγος, азбука.{{< marginnote >}}Each face comes in two files: the Latin characters, and the rest (Greek, Cyrillic, Hebrew, IPA, symbols), which a browser downloads only for a page that uses them, as this one does.{{< /marginnote >}} Its *italic* is a true italic, and there is **bold** and ***bold italic***.

The sans-serif, {{< sans >}}Libertinus Sans{{< /sans >}}, replaces Gill Sans wherever the theme sets sans-serif: in the `sans` shortcode, in the tables and with the `sfsidenotes` class option.

| Face | Use on this page |
|:-----|:-----------------|
| Libertinus Serif | text, headings, notes |
| Libertinus Sans | tables, `sans` |
| Libertinus Mono | code |
| Libertinus Math | formulas |
{#tab:libertinus-faces caption="The four faces of Libertinus and where the theme uses them."}

Code is set in Libertinus Mono:

```go
func gauss(n int) int { return n * (n + 1) / 2 }
```

## Math

Libertinus Math is an OpenType math font, so KaTeX hands the browser MathML, as for the [Euler](/posts/euler-math/) page: $e^{i\pi} + 1 = 0$, $\sum_{k=0}^{n} \binom{n}{k} = 2^n$, the alphabets $\mathbb{R}$, $\mathcal{F}$, $\mathfrak{g}$, $\mathbf{v}$, and displays,

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi},
\qquad
\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} = \prod_{p\ \text{prime}} \frac{1}{1 - p^{-s}},
$$

with their alignment and numbers:

$$
\begin{aligned}
(a + b)^2 &= (a + b)(a + b) \\
          &= a^2 + 2ab + b^2,
\end{aligned}
\qquad
\binom{n}{k} = \frac{n!}{k!\,(n-k)!}. \label{eq:libertinus-binomial}
$$

Equation {{< eqref "eq:libertinus-binomial" >}} has a number of its own, and a sidenote holds math in the same font.{{< sidenote >}}For every real $x$, $\lfloor x \rfloor \le x < \lfloor x \rfloor + 1$.{{< /sidenote >}} Unlike Euler, whose letters are upright, Libertinus Math sets the letters of variables in italic, as Computer Modern and most math fonts do.
