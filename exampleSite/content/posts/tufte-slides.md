---
title: "Slides"
subtitle: "One page, read as an article or shown with reveal.js"
date: 2026-11-10T10:00:00+01:00
author: "Massimo Nocentini"
description: "The slides output format: a page that lists it in its outputs is also a reveal.js deck, a slide at each heading and each thematic break, with sidenotes, figures and math laid out by Tufte CSS on every slide."
tags: ["slides", "reveal.js"]
categories: ["Documentation"]
# The article (html) and the deck (slides.html, linked in the line above).
outputs: ["html", "slides"]
slides:
  transition: slide
---

{{< newthought >}}This page is also a slide deck.{{< /newthought >}} Its front matter lists the `slides` output format, so Hugo writes `slides.html` next to the article, and the line under the title links to it. The deck shows the same content, cut into slides by [reveal.js](https://revealjs.com).{{< sidenote >}}reveal.js 6, loaded from a CDN with its hash checked, or served by the site with `params.selfHosted`.{{< /sidenote >}}

{{< notes >}}
These are speaker notes: press **s** in the deck to open the speaker view. The article does not show them.
{{< /notes >}}

## Writing slides

Each `##` heading starts a slide, and so does a thematic break (`---`) for a slide without a heading. Everything else is the theme's Markdown and shortcodes:

- sidenotes and margin notes stay in the margin of their slide;{{< marginnote >}}A margin note on a slide.{{< /marginnote >}}
- figures, tables and listings keep their numbers;
- math, theorems and citations work as in the article.

Add `{.fragment}` on the line after a paragraph or a list to show it one step later.
{.fragment}

---

A slide without a heading: one idea, set large enough to be read from the back of the room. “Above all else show the data.”{{< sidenote >}}Edward R. Tufte, *The Visual Display of Quantitative Information*, 1983.{{< /sidenote >}}

## Math on a slide

$$
\sum_{k=0}^{n} \binom{n}{k} x^k = (1 + x)^n
$$

The binomial theorem, with $x = 1$: $\sum_{k} \binom{n}{k} = 2^n$.

{{< notes >}}
Derive the special case $x = 1$ on the board.
{{< /notes >}}

## A figure

{{< fig src="/images/latex/hilbertcurves.svg" alt="Hilbert curves of degrees 1 to 5" label="fig:slides-hilbert" >}}Hilbert curves of degrees 1 to 5, as in the [sample handout](/posts/sample-handout/).{{< /fig >}}

Figure {{< xref "fig:slides-hilbert" >}} sits in the text column, its caption in the margin.

## Options

The deck takes reveal.js options from `params.slides` and from the page's front matter `slides` (this page: `transition: slide`):

```yaml
outputs: ["html", "slides"]
slides:
  transition: slide
  slideNumber: false
```

Keys: **←** **→** to move, **Esc** for the overview, **f** for full screen, **s** for the speaker notes.
