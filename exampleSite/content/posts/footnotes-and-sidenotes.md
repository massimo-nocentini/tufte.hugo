---
title: "Footnotes and Sidenotes"
subtitle: "Margin notes for asides, footnotes at the end of each section"
date: 2026-10-06T09:00:00+02:00
author: "Massimo Nocentini"
description: "A page that mixes sidenotes and real footnotes, with the footnotes listed at the end of each section (footnoteplacement: section)."
tags: ["sidenotes", "footnotes", "markdown"]
categories: ["Documentation"]
footnoteplacement: section
---

{{< newthought >}}A printed page{{< /newthought >}} can carry two kinds of
note at once: short asides in the margin and longer notes at the foot of the
page.{{< sidenote >}}Sidenotes are numbered 1, 2, 3 … by Tufte CSS's counter.{{< /sidenote >}}
This page does the same. Its front matter sets `footnoteplacement: section`, so
the real footnotes of each section are listed at the end of that
section.[^fn-placement]

<!--more-->

## Notes in the margin

A Markdown footnote becomes a sidenote by default.[^aside] The `sidenote`
shortcode always does,{{< sidenote >}}Even on a page in `endnotes` mode.{{< /sidenote >}}
and a margin note has no number at all.{{< marginnote >}}A margin note, from the `marginnote` shortcode.{{< /marginnote >}}
Math works in every kind of note.{{< sidenote >}}For instance $e^{i\pi} + 1 = 0$.{{< /sidenote >}}

## Notes below the text

A label that starts with `fn-` keeps a Markdown footnote a real
footnote,[^fn-proof] and the `footnote` shortcode always gives
one.{{< footnote >}}Written as `{{</* footnote */>}}…{{</* /footnote */>}}`. Inline Markdown, math such as $\sum_{k=1}^n k = n(n+1)/2$ and citations work inside it.{{< /footnote >}}
Because the page also has numbered sidenotes, footnotes are marked with
letters (`footnotestyle = "auto"`), so the two sequences never look alike.

A footnote can be referenced twice;[^fn-twice] both references link to the
same item, and its backlinks return to each of them.[^fn-twice]

## Choosing between them

| Kind of note | Use |
|:--|:--|
| short aside, gloss, citation | sidenote: `{{</* sidenote */>}}` or `[^x]` |
| unnumbered remark, small figure | `{{</* marginnote */>}}`, `{{</* marginfigure */>}}` |
| proof, long digression, several paragraphs | footnote: `{{</* footnote */>}}` or `[^fn-x]` |

Tufte's own books use only sidenotes, and tufte-latex turns LaTeX's
`\footnote` into a sidenote.{{< sidenote >}}See the [LaTeX to Hugo cheat sheet](/posts/latex-to-hugo/).{{< /sidenote >}}
Real footnotes are for documents that also need the classic article
convention.

[^aside]: Written `[^aside]`: no prefix, so it follows the page's mode (sidenotes).

[^fn-placement]: With the default `footnoteplacement: page` all footnotes are collected in one list at the end of the article.

[^fn-proof]: Written `[^fn-proof]`. A real footnote can be long and hold several paragraphs, because the list below the section is block content.

    This is the second paragraph of the same footnote.

[^fn-twice]: This footnote is referenced twice in the same sentence.
