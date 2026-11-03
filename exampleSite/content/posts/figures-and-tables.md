---
title: "Figures and Tables"
subtitle: "Main-column, margin and full-width graphics; tables that keep to the grid"
date: 2026-10-20T09:00:00+02:00
author: "Massimo Nocentini"
description: "The three kinds of Tufte figures written with Markdown images and shortcodes, and Markdown tables rendered for Tufte CSS."
tags: ["figures", "tables", "images"]
categories: ["Documentation"]
images: ["images/table-example-be-page-159.png"]
---

{{< newthought >}}Graphics belong next to the words{{< /newthought >}} that discuss them. Tufte CSS knows three places to put them: the main text column, the margin, and the full width of the page. tufte.hugo gives each one a shortcode, and handles plain Markdown images too.

## Markdown images

A Markdown image on a line of its own becomes a `figure`. Its title, the quoted text after the path, becomes the caption, shown as a margin note beside the image:

![A table of figures from Beautiful Evidence](images/table-example-be-page-159.png "From Edward Tufte, Beautiful Evidence, page 159.")

Without a title the image is still a figure, just without a caption. An image inside a sentence stays inline. This requires `wrapStandAloneImageWithinParagraph = false` in the Goldmark parser settings of your site.{{< sidenote >}}Otherwise Goldmark wraps every image in a paragraph and the image render hook cannot tell a figure from an inline picture.{{< /sidenote >}}

Image paths are looked up first among the resources of the page bundle, then among the site's global assets, and finally used as plain URLs. The image above lives in the site's `assets/images/` directory.

## The figure shortcode

The `figure` shortcode replaces Hugo's built-in one and accepts a `type`: `main` (the default), `margin` or `fullwidth`. Captions are Markdown:

{{< figure src="images/table-example-be-page-159.png" alt="A table of figures from Beautiful Evidence" caption="The same page, placed with the `figure` shortcode. Captions may contain *emphasis* and [links](https://www.edwardtufte.com/book/beautiful-evidence/)." >}}

## Margin figures

{{< marginfigure src="images/table-example-be-page-159.png" alt="A table of figures from Beautiful Evidence" caption="A margin figure: the image and its caption sit in the margin, next to this paragraph." inline="true" >}} Small, ancillary graphics go in the margin. The `marginfigure` shortcode, which is the same as `figure` with `type="margin"`, puts the image inside a margin note. Write it at the start of a paragraph, on the same line as the text, with `inline="true"`, so the margin note becomes part of that paragraph. On a narrow screen it hides behind the &#8853; toggle, like any other margin note.

Keep margin figures small and simple: the margin is about a third as wide as the text column.

## Full-width figures

Wide graphics, like time series and maps, need the full width of the page. Use `fullwidthfigure`, or `figure` with `type="fullwidth"`; the caption goes below the image:

{{< fullwidthfigure src="images/table-example-be-page-159.png" alt="A table of figures from Beautiful Evidence" caption="A full-width figure with its caption in a `figcaption`." >}}

## Tables

Markdown tables are wrapped in a `div.table-wrapper`, which scrolls horizontally on narrow screens instead of breaking the layout. Column alignment is kept:

| Book                                           | Year | Subject                                   |
| :--------------------------------------------- | :--: | :---------------------------------------- |
| The Visual Display of Quantitative Information | 1983 | Statistical graphics and data-ink         |
| Envisioning Information                        | 1990 | Maps, layering and small multiples        |
| Visual Explanations                            | 1997 | Images of cause, motion and evidence      |
| Beautiful Evidence                             | 2006 | Sparklines, mapped pictures, analytic design |
| Seeing with Fresh Eyes                         | 2020 | Meaning, space, data, truth               |

Tufte's tables are sparse: few rules, no shading, and numbers aligned on the right so that their digits line up.{{< marginnote >}}Alignment comes from the colons in the delimiter row: `:--` left, `:-:` centre, `--:` right.{{< /marginnote >}}

A table can take the full width of the page with the `fullwidth` attribute on the line after it. This one lists powers, factorials, Fibonacci numbers $F_n$, primes $p_n$ and triangular numbers $T_n$; its header cells are inline math:

| $n$ | $n^2$ | $n^3$ | $n^4$ | $2^n$ | $3^n$ | $n!$ | $F_n$ | $p_n$ | $T_n$ |
| --: | ----: | ----: | ----: | ----: | ----: | ---: | ----: | ----: | ----: |
|   1 |     1 |     1 |     1 |     2 |     3 |    1 |     1 |     2 |     1 |
|   2 |     4 |     8 |    16 |     4 |     9 |    2 |     1 |     3 |     3 |
|   3 |     9 |    27 |    81 |     8 |    27 |    6 |     2 |     5 |     6 |
|   4 |    16 |    64 |   256 |    16 |    81 |   24 |     3 |     7 |    10 |
|   5 |    25 |   125 |   625 |    32 |   243 |  120 |     5 |    11 |    15 |
|   6 |    36 |   216 |  1296 |    64 |   729 |  720 |     8 |    13 |    21 |
|  10 |   100 |  1000 | 10000 |  1024 | 59049 | 3628800 |  55 |    29 |    55 |
{.fullwidth}

## Video and other embeds

The `youtube` shortcode embeds a video through YouTube's privacy-enhanced domain, inside the `iframe-wrapper` that keeps its aspect ratio at every screen width:

{{< youtube YslQ2625TR4 >}}

For any other embeddable page there is the `iframe` shortcode, with `src`, `title` and an optional `ratio`.
