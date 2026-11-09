---
title: "Euler Math"
subtitle: "Hermann Zapf's Euler for the formulas, ET Book for the text"
date: 2026-11-09T09:00:00+01:00
author: "Massimo Nocentini"
description: "The math of a page set in Euler, Hermann Zapf's upright mathematical alphabet, as the euler and eulervm packages set it in LaTeX: KaTeX writes MathML and the browser lays it out with the Euler Math font."
tags: ["math", "katex", "typography"]
categories: ["Documentation"]
# This page only; params.math.font = "euler" sets the whole site.
mathFont: euler
mathMacros:
  - ["\\RR", "\\mathbb{R}"]
---

{{< newthought >}}Hermann Zapf drew Euler{{< /newthought >}} for the American Mathematical Society in the early 1980s, with Donald Knuth and his students at Stanford: an upright alphabet with the look of a mathematician's handwriting, which avoids the slant of the usual math italic.{{< sidenote >}}Knuth set *Concrete Mathematics* (with Graham and Patashnik, 1989) in Euler for the formulas and Concrete Roman for the text, a typeface he made for it from Computer Modern. In LaTeX the `euler` and `eulervm` packages do the same with any text font.{{< /sidenote >}} This page sets its formulas in Euler and its text in ET Book, as `\usepackage{eulervm}` would.

## Turning it on

One page sets `mathFont: euler` in its front matter, as this one does; a whole site sets

```toml
[params.math]
  font = "euler"
```

KaTeX then writes MathML only, which the browser typesets with Euler Math, the OpenType version of Euler by Khaled Hosny and Daniel Flipo, bundled with the theme.{{< sidenote >}}An OpenType math font carries its own layout rules: the size of superscripts, the gap above a fraction bar, how far a radical or a brace stretches. MathML hands them to the browser, while KaTeX's own output is drawn for its own fonts and would place another font's letters with the wrong measurements.{{< /sidenote >}} Text inside a formula, written with `\text{…}`, stays in the text font, ET Book.

## Inline and display

In the running text: Euler's identity $e^{i\pi} + 1 = 0$, a sum $\sum_{k=0}^{n} \binom{n}{k} = 2^n$, the letters $\alpha, \beta, \gamma, \varphi, x, y, z$ upright, as Zapf drew them, and the other alphabets: $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \RR$, a $\sigma$-algebra $\mathcal{F}$, a Lie algebra $\mathfrak{g}$, a vector $\mathbf{v}$. A display stands on its own lines:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi},
\qquad
\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} = \prod_{p\ \text{prime}} \frac{1}{1 - p^{-s}}.
$$

Multi-line derivations keep their alignment,

$$
\begin{aligned}
(a + b)^2 &= (a + b)(a + b) \\
          &= a^2 + ab + ba + b^2 \\
          &= a^2 + 2ab + b^2,
\end{aligned}
$$

and matrices and cases work as well:

$$
R_\theta = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix},
\qquad
|x| = \begin{cases} x & \text{if } x \ge 0, \\ -x & \text{otherwise.} \end{cases}
$$

## Numbers and references

A `\label` numbers a display, as everywhere else in the theme:

$$
\binom{n}{k} = \frac{n!}{k!\,(n-k)!} \label{eq:binomial}
$$

and {{< eqref "eq:binomial" >}} refers to it. A `\tag` gives a display a name of its own, here the one *Concrete Mathematics* uses for the sum of a geometric progression:

$$
\sum_{0 \le k < n} x^k = \frac{1 - x^n}{1 - x}, \quad x \ne 1. \tag{2.26}
$$

A sidenote holds math in Euler too.{{< sidenote >}}For every $x \in \RR$, $\lfloor x \rfloor \le x < \lfloor x \rfloor + 1$.{{< /sidenote >}}

## A proof

{{< theorem note="Gauss" numbered=false >}}
For every integer $n \ge 0$, $\sum_{k=0}^{n} k = \frac{n(n+1)}{2}$.
{{< /theorem >}}

{{< proof >}}
Write the sum twice, once forwards and once backwards, and add the two term by term:

$$
2\sum_{k=0}^{n} k = \sum_{k=0}^{n} \bigl(k + (n - k)\bigr) = (n + 1)\,n. \qedhere
$$
{{< /proof >}}

## Browsers

Chrome and Edge (109 and later), Firefox and Safari (16.4 and later) lay out MathML. The theme adds what KaTeX's MathML leaves to the browser and Chromium does not do: the alignment and spacing of the columns of `aligned`, matrices and `cases`, the other alphabets, unary signs ($f(-x) = -f(x)$), the thin space around an operator name ($2\sin\theta$, $\lim_{n\to\infty} a_n$), boxes and strikes ($\boxed{E = mc^2}$, $\frac{\cancel{2}\,x}{\cancel{2}}$) and wide accents ($\overline{AB}$, $\widehat{xyz}$). A page that keeps the default, `font = "katex"`, is set by KaTeX in its own fonts, as on the [math and code](/posts/math-and-code/) page.
