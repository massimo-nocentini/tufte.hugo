---
title: "From LaTeX to Hugo"
subtitle: "Every feature of tufte-handout and tufte-book, in Markdown"
date: 2026-10-30
description: "A cheat sheet that maps each feature of the tufte-latex document classes to its Markdown or shortcode equivalent, with a live example of every shortcode."
tags: ["latex", "typography", "documentation"]
categories: ["Documentation"]
---

{{< abstract >}}
This page maps every feature of the `tufte-handout` and `tufte-book` LaTeX
classes to the Markdown, shortcode or setting that does the same with this
theme, and then shows each shortcode at work. The two ports of the
Tufte-LaTeX samples, the [handout](/posts/sample-handout/) and the
[book](/books/sample-book/), show them in context.
{{< /abstract >}}

The table is in “{{< xref "sec:cheat-sheet" "name" >}}”, and the live examples
start with “{{< xref "sec:notes" "name" >}}”.

<!--more-->

{{< tableofcontents >}}

## The cheat sheet {#sec:cheat-sheet}

The status column says how complete the counterpart is: **must** and
**should** features are implemented, **could** features are extras, and
**wont** rows explain why a LaTeX feature has no web counterpart. Option
names such as `tufte.justified` are keys of `[params.tufte]` in the site
configuration, or of the `tufte:` map in a page's front matter. Rows
107–117 are the theorem environments of the `amsthm` package, which the
classes do not define but mathematical texts load with them.

{{< marginnote >}}**Placement rule.** *Inline* shortcodes (`sidenote`, `marginnote`, `footnote`, `cite`, `xref`, `eqref`, `label`, `index`, `footnotemark`, `newthought`, `sans`, `allcaps`, `smallcaps`, `sc`, `textls`, `nohyphens`, `paragraph`, `bibentry`, `nocite`, and `marginfigure` with `inline="true"`) are written inside a paragraph. *Block* shortcodes (`figure`, `fig`, `table`, `marginblock`, `equation`, `footnotetext`, `bibliography`, `printindex`…) stand alone, with blank lines around them.{{< /marginnote >}}

| # | tufte-latex | tufte.hugo | Status | Notes |
|--:|:--|:--|:--|:--|
| 1 | `\documentclass{tufte-handout}` | any page outside a book | must | body class `tufte-handout` |
| 2 | `\documentclass{tufte-book}` | a section whose `_index.md` (or `content/_index.md`, for a whole-site book) sets `book: true` | must | its pages are the chapters; see [Books](https://github.com/massimo-nocentini/tufte.hugo#books) |
| 3 | class options (`justified`, `sfsidenotes`, `nols`, `marginals`…) | `[params.tufte]` in the site config; `tufte:` in front matter | must | resolved key by key: page → part → book → site → style preset |
| 4 | “looks like tufte-handout” | `tufte.style = "latex"` | should | preset: LaTeX title block, hyphenation, indented paragraphs, old-style figures, plainnat, running heads |
| 5 | `\sidenote{}`, `\footnote{}` | `{{</* sidenote */>}}…{{</* /sidenote */>}}`, Markdown `[^1]` | must | tufte-latex's `\footnote` is a sidenote; footnote ids are deterministic |
| 5a | a classic footnote (`\footnote` of the `article` class) | `{{</* footnote */>}}…{{</* /footnote */>}}`, Markdown `[^fn-x]` (any `[^x]` with `footnotes = "endnotes"`) | must | listed below the text, numbered apart from the sidenotes; see [Footnotes and sidenotes](https://github.com/massimo-nocentini/tufte.hugo#footnotes-and-sidenotes) |
| 6 | `\sidenote[num][offset]{}` | `{{</* sidenote number="*" offset="-2bl" */>}}…{{</* /sidenote */>}}` | must | a custom number does not step the counter |
| 7 | `\marginnote[offset]{}`, `\marginpar{}` | `{{</* marginnote offset="1bl" */>}}…{{</* /marginnote */>}}` | must |  |
| 8 | multiple marks (`\multfootsep`) | automatic | could | adjacent marks (sidenotes and real footnotes) are separated by a comma |
| 9 | `\footnotemark` + `\footnotetext[offset]{}` | `{{</* footnotemark "row3" */>}}` + standalone `{{</* footnotetext name="row3" offset="-7bl" */>}}…{{</* /footnotetext */>}}` | should | no other numbered note between mark and text |
| 10 | `\label` on a sidenote (“see note 7”) | `{{</* sidenote label="sn:x" */>}}…{{</* /sidenote */>}}` | should | `{{</* xref "sn:x" */>}}` prints its number |
| 11 | block content in the margin | `{{</* marginblock */>}}…{{</* /marginblock */>}}` | should | paragraphs, lists, tables; toggled on mobile |
| 12 | `\cite[offset]{a,b}` | `{{</* cite "a,b" */>}}`, `{{</* cite "a" "b" */>}}`, `{{</* cite keys="a,b" offset="-1bl" */>}}` | must | the full reference as a numbered sidenote |
| 13 | `\cite` inside `\sidenote`, `\marginnote`, `\caption` | a nested `{{</* cite */>}}`, or `cite="a,b"` on the note or figure | should | the reference is appended under the note |
| 14 | natbib `\citet`, `\citep`, `\citeauthor`, `\citeyear` (+ page) | `{{</* cite keys="a" mode="text" page="42" */>}}`; modes `text`, `paren`, `author`, `year` | could | inline text, no sidenote |
| 15 | `\bibentry{key}` | `{{</* bibentry "key" */>}}` | must | the formatted entry, inline |
| 16 | `\bibliography{f}` + `\bibliographystyle` | automatic at the end of a handout; `{{</* bibliography */>}}` anywhere (standalone) | must | `tufte.bibliography.style = "tufte"` (citation order) or `"plainnat"` (sorted; with `nobib` the `[n]` follow the sorted list) |
| 17 | `\nobibliography` | `tufte: {bibliography: {list: false}}` | must |  |
| 18 | `\nocite{a}`, `\nocite{*}` | `{{</* nocite "a,b" */>}}`, `{{</* nocite "*" */>}}`, front matter `nocite: [a]` | should |  |
| 19 | class option `nobib` | `tufte.bibliography.margin = false` | should | a citation becomes `[n]`, linked to the list (numbered in the order of `bibliography.style`) |
| 20 | `.bib` database | `data/bibliography.yaml` (native), `data/bibliography.json` (CSL-JSON), front matter `bibliography: refs.json` or `references:` | must | see [Bibliography](https://github.com/massimo-nocentini/tufte.hugo#bibliography) |
| 21 | `.bib` read directly | `bibliography: refs.bib` (page resource or asset) | could | a simple BibTeX reader; pandoc → CSL-JSON is more robust |
| 22 | `\doi{}`, `\url{}` in entries | fields `doi`, `url` | must | rendered as links |
| 23 | `figure` + `\caption` + `\label` | `{{</* figure src="…" caption="…" label="fig:x" */>}}`; `![alt](src "caption")` + `{#fig:x}`; `{{</* fig src="…" label="fig:x" */>}}caption{{</* /fig */>}}` | must | “Figure N:” starts the margin caption |
| 24 | `\caption[short]{}` | `short="…"` | should | used in the list of figures |
| 25 | `\caption[][offset]{}` | `offset="1bl"` | should |  |
| 26 | `\setfloatalignment{b}`, `[b]` | `captionpos="bottom"` | should | caption aligned with the bottom of the float |
| 27 | `figure*` | `{{</* fullwidthfigure */>}}`, `type="fullwidth"`, `{.fullwidth}` | must | the caption floats in the margin column |
| 28 | `marginfigure[offset]` | `{{</* marginfigure offset="…" label="…" */>}}`, `{{</* fig type="margin" */>}}` | must |  |
| 29 | figure without caption | any figure without `caption` | must | unnumbered |
| 30 | `table` + `\caption` | `{{</* table caption="…" label="tab:x" */>}}` + a Markdown table; a Markdown table + `{#tab:x caption="…"}` | must | its own counter |
| 31 | `table*` | `{{</* fullwidthtable */>}}`, `{{</* table type="fullwidth" */>}}` | should |  |
| 32 | `margintable[offset]` | `{{</* margintable caption="…" offset="…" */>}}…{{</* /margintable */>}}` | should |  |
| 33 | booktabs | Markdown tables | should | rules come from the CSS; `\cmidrule` and `\multicolumn` are **wont** (no Markdown syntax) |
| 34 | algorithm / listing floats | `{{</* listing caption="…" label="lst:x" style="ruled" */>}}` + a fenced code block | could | styles `plain`, `ruled`, `boxed` |
| 35 | subfigures, `\fbox` image grids | `{{</* subfigures cols=2 type="fullwidth" caption="…" */>}}` with images on consecutive lines | could | linked images (thumbnails) keep their link and subcaption |
| 36 | `\ref` | `{{</* xref "fig:x" */>}}` | must | forward references work |
| 37 | `Figure~\ref{fig:x}` | `{{</* xref "fig:x" "full" */>}}` | must | with a non-breaking space |
| 38 | `\nameref` | `{{</* xref "sec:x" "name" */>}}` | must |  |
| 39 | `\pageref` | `{{</* xref "err:x" "page" */>}}` | should | the enclosing section title; in a book, the chapter title for a target in another chapter |
| 40 | `\eqref` | `{{</* eqref "eq:x" */>}}` | should | “(3)” |
| 41 | `\label` anywhere | `{{</* label "err:x" */>}}` | should |  |
| 42 | `\listoffigures`, `\listoftables` | `{{</* listoffigures */>}}`, `{{</* listoftables */>}}`, `{{</* listoflistings */>}}` (standalone) | should | the whole book inside a book, else the page |
| 43 | numbered equations + `\label` | `$$ … \label{eq:x} $$`, `{{</* equation label="eq:x" */>}}…{{</* /equation */>}}` | should |  |
| 44 | `\chapter{}`, `\chapter[short]{}` | a page of the book: `title`, `linkTitle` | must |  |
| 45 | `\chapter*{}` | `unnumbered: true` | should |  |
| 46 | `\part{}` | a sub-section (`_index.md`) inside the book | should | roman numerals |
| 47 | `\frontmatter`, `\mainmatter`, `\backmatter` | `matter: front`, `main`, `back` | should | only main matter is numbered |
| 48 | `\appendix` | `matter: appendix` | should | lettered A, B, … |
| 49 | `\tableofcontents` (book) | automatic on the book's landing page; `{{</* tableofcontents */>}}` | must | italic, no leaders |
| 50 | `\tableofcontents` (handout) | front matter `toc: true`; `{{</* tableofcontents */>}}` | must |  |
| 51 | `\maketitle` (full title page) | the book's landing page | must | `tufte.book.titlepage` |
| 52 | `\maketitle` (handout title block) | `tufte.titleBlock = "latex"` | should | italic author and date lines |
| 53 | `\title[plain]`, `\author[plain]`, `\publisher` | `title`, `linkTitle`, `author`, `publisher`, `publisherPlain` | should |  |
| 54 | `\date{}`, `\date{text}` | `showDate: false`, `dateText: "Spring 2026"` | should | `date` stays the sort key |
| 55 | `\thanks` | `thanks: "…"`, `author: [{name: …, thanks: …}]` | should | a sidenote in the title |
| 56 | `abstract` environment | front matter `abstract:`, `{{</* abstract */>}}…{{</* /abstract */>}}` | should |  |
| 57 | `\openepigraph`, epigraph pages | book root `epigraphs:`; `{{</* epigraph style="open" */>}}` | should |  |
| 58 | epigraph (tufte-css) | `{{</* epigraph */>}}` | must |  |
| 59 | copyright page | book root `copyrightPage:` | should | Markdown string or `{year, holder, publisher, url, license, printing}` |
| 60 | dedication | book root `dedication:` | should |  |
| 61 | frontispiece | book root `frontispiece: {src, alt, caption}` | could | an unnumbered figure, caption in the margin, before the title page |
| 62 | `\blankpage`, `\cleardoublepage`, `\clearpage` | `{{</* clearpage */>}}`; `halftitle: true` | could | print only |
| 63 | running heads (fancyhdr) | `tufte.print.runningHeads = true` | could | print only, Chromium ≥ 131 |
| 64 | the book printed as one PDF | book root `outputs: [html, rss, print]` → `…/print.html` | should | see [Printing](https://github.com/massimo-nocentini/tufte.hugo#printing-and-pdf) |
| 65 | `\index{…}` with `!`, `@`, `\|see{}`, `\|seealso{}`, `\|(`, `\|)` | `{{</* index "classes!a4paper" */>}}`, same syntax | should |  |
| 66 | `\printindex` | `{{</* printindex */>}}` (standalone) | should | three columns |
| 67 | the index as a site taxonomy | — | **wont** | `/index/` clashes with Hugo's index files; use the shortcode |
| 68 | counters continuous across a book | `tufte.book.continuous = true` (default) | should |  |
| 69 | `\section`, `\subsection` (italic, unnumbered) | `##`, `###` | must | in `\Large` and `\large` (1.68rem, 1.54rem) with `style = "latex"` or `titleBlock = "latex"`, below the title; tufte.css's sizes otherwise |
| 70 | `\paragraph{}` (run-in) | `#### Title`, or `{{</* paragraph */>}}Title{{</* /paragraph */>}}` | should |  |
| 71 | no `\subsubsection` | a warning on `#####`/`######`; `tufte.headings.strict = true` makes it an error | should | Bringhurst §4.2.2 |
| 72 | `secnumdepth` | `tufte.headings.number = 0`, `1` or `2`; `{.unnumbered}` | could |  |
| 73 | `\section[short]{}` in the TOC | — | **wont** | Hugo builds its TOC from the headings themselves |
| 74 | `\newthought{}` | `{{</* newthought */>}}…{{</* /newthought */>}}` | must |  |
| 75 | `\tuftebreak`, `\tufteskip` | `{{</* tuftebreak */>}}` | could |  |
| 76 | `\allcaps{}` | `{{</* allcaps */>}}…{{</* /allcaps */>}}`, `{{</* allcaps "nasa" /*/>}}` | must |  |
| 77 | `\smallcaps{}` | `{{</* smallcaps */>}}…{{</* /smallcaps */>}}` | must |  |
| 78 | `\textsc{}` | `{{</* sc */>}}…{{</* /sc */>}}` | should |  |
| 79 | `\textls[n]{}` | `{{</* textls "100" */>}}…{{</* /textls */>}}` | could | thousandths of an em, or a CSS length |
| 80 | `ls`, `nols` | `tufte.letterspacing` | should |  |
| 81 | `\textsf`, `\sffamily` | `{{</* sans */>}}…{{</* /sans */>}}` | must |  |
| 82 | `justified`, ragged right, hyphenation | `tufte.justified`, `tufte.hyphenate`, `{.justify}`, `{.raggedleft}` | must |  |
| 83 | `sidenote=`, `marginnote=`, `caption=`, `citation=`, `marginals=` | `tufte.marginals`, `tufte.sidenote.align`, … | should |  |
| 84 | `\setsidenotefont` and friends | `tufte.sidenote.font = "italic sans"` | should | words: `italic upright sans serif mono small smaller normal #hex` |
| 85 | `sfsidenotes` | `tufte.sfsidenotes = true` | must |  |
| 86 | book `\parindent` paragraphs | `tufte.indent = true` | should |  |
| 87 | old-style figures (mathpazo `osf`) | `tufte.numerals = "oldstyle"` | could |  |
| 88 | `fonts`, `nofonts` | `params.etBook` | must |  |
| 89 | `fullwidth` environment | `{{</* fullwidth */>}}…{{</* /fullwidth */>}}` | must |  |
| 90 | `quote`, `quotation` | Markdown `>`; `{{</* blockquote */>}}` | must |  |
| 91 | `verse` | `{{</* verse */>}}…{{</* /verse */>}}` | should |  |
| 92 | `description` lists | Markdown definition lists | should |  |
| 93 | math | KaTeX: `$…$`, `$$…$$`, `\(…\)`, `\[…\]` | must | see [Math](https://github.com/massimo-nocentini/tufte.hugo#math) |
| 94 | `\nohyphens{}`, `\nohyphenation` | `{{</* nohyphens */>}}…{{</* /nohyphens */>}}`, `{.nohyphens}` | could |  |
| 95 | `\FloatBarrier` | `{{</* clearmargin */>}}` | could | `clear: right` |
| 96 | `debug` option | `tufte.debug = true` | could | outlines and extra warnings |
| 97 | letter, `a4paper`, `b5paper` | `tufte.print.paper = "letter"`, `"a4"`, `"b5"` | must | geometry from `tufte-common.def` |
| 98 | `symmetric`, `\forcerectofloat`, `\forceversofloat` | — | **wont** | a screen has no spreads, and a float cannot change side per printed page |
| 99 | `twoside`, `oneside` | — | **wont** | folded into running heads: a book alternates (book title on left pages, chapter title on right pages); a handout prints its title and the page number at the top right of every page but the first |
| 100 | `bidi` | the language's `direction` (`<html dir>`) | could |  |
| 101 | `hyper`, `colorlinks`, PDF metadata | — | **wont** | links are native; colours via `customCSS`; metadata is in `<head>` |
| 102 | `tufte-*-local.tex` hooks | `params.customCSS`, the `*_custom.html` partials | must | body classes `tufte-book`/`tufte-handout` allow scoping |
| 103 | `\hangp`, `\hangleft`, `\hangstar` | — | **wont** | sample-book macros, not class features; CSS `hanging-punctuation` (Safari only) is used |
| 104 | setspace `doublespace` | — | **wont** | loaded by `tufte-common.def`, but it is a general line-spacing package, not a class feature: set the leading with CSS (`line-height`) through `customCSS` |
| 105 | doc macros (`\doccmd`…), text shortcuts (`\TL`, `\monthyear`) | inline code, your own shortcodes | **wont** | not class features |
| 106 | TeX machinery (`\morefloats`, engine detection, `\TufteRecalculate`, other paper options) | — | **wont** | no meaning in HTML |
| 107 | amsthm `\newtheorem{k}{Word}` | `{{</* theorem */>}}…{{</* /theorem */>}}`, `lemma`, `proposition`, `corollary`, `definition`, `example`, `remark`; any kind with `{{</* thm "k" */>}}…{{</* /thm */>}}`; `tufte.theorems.kinds.k.name` | should | the amsthm package, not a class feature; see [Theorems and proofs](https://github.com/massimo-nocentini/tufte.hugo#theorems-and-proofs) |
| 108 | amsthm `\newtheorem*{k}{Word}` | `tufte.theorems.kinds.k.numbered = false`; `numbered=false` on one theorem | should |  |
| 109 | amsthm `\newtheorem{k}[c]{Word}` (shared counter) | `tufte.theorems.kinds.k.counter = "c"` | should | every kind shares `theorem` by default (`tufte.theorems.shared`), as in `amsart.template` |
| 110 | amsthm `\newtheorem{k}{Word}[section]`, `\numberwithin` | `tufte.theorems.kinds.c.within`, `tufte.theorems.within`: `"section"`, `"chapter"`, `"none"`, `"auto"` | should | `auto`: per chapter in a book with numbered chapters or `book.continuous = false` (without `numberChapters` every chapter restarts at 1, no prefix), else through the page or the book |
| 111 | amsthm `\theoremstyle{plain\|definition\|remark}` | `tufte.theorems.kinds.k.style`; `style=` on one theorem | should |  |
| 112 | `\begin{theorem}[note]` + `\label` | `{{</* theorem "note" "thm:x" */>}}…{{</* /theorem */>}}`, `{{</* lemma note="…" label="lem:x" */>}}` | should | the note in parentheses after the number; a `{{</* label "thm:x" */>}}` in the body refers to the theorem too |
| 113 | amsthm `proof`, `\begin{proof}[Head]` | `{{</* proof */>}}…{{</* /proof */>}}`, `{{</* proof "Head" */>}}`, `{{</* proof of="thm:x" */>}}` | should | “Proof of Theorem 2.1.” |
| 114 | `\qedhere`, `\qedsymbol` | `{{</* qedhere */>}}`, `\qedhere` in display math; `tufte.theorems.qed`, `qed=` | should | `blacksquare` ■ (`css`), `openbox` □ (`latex`), `none` or any text |
| 115 | `\ref`, cleveref `\cref`, `\nameref` to a theorem | `{{</* xref "thm:x" */>}}`, `{{</* xref "thm:x" "full" */>}}`, `{{</* xref "thm:x" "name" */>}}` | should | “2.1”, “Theorem 2.1”, the note |
| 116 | thmtools `\listoftheorems` | `{{</* listoftheorems */>}}` (standalone) | should | `kinds="theorem,lemma"`, `heading=""` |
| 117 | `\swapnumbers`, `\newtheoremstyle`, thmtools `restatable` | — | **wont** | heads come in two looks (`tufte.theorems.look`: `tufte`, `amsthm`); restyle one kind with `thm-kind-k` in `customCSS` |
{.fullwidth}

## Notes {#sec:notes}

A sidenote can carry a label, like LaTeX's `\label` inside `\sidenote`.{{< sidenote label="sn:demo" >}}This is the labelled sidenote. Its number is printed wherever it is referenced. A note may contain other inline shortcodes: a reference to {{< xref "fig:demo-hilbert" "full" >}}, or {{< smallcaps >}}Small Caps{{< /smallcaps >}}.{{< /sidenote >}} The text can then refer to {{< xref "sn:demo" "full" >}}, or simply to note {{< xref "sn:demo" >}}. A margin note can be moved down by two baselines{{< marginnote offset="2bl" >}}This margin note was written with `offset="2bl"`.{{< /marginnote >}} or up with a negative offset, and a Markdown footnote becomes a sidenote.[^fn]

[^fn]: Written as `[^fn]`, like `\footnote` in LaTeX.

tufte-latex has no classic footnotes: its `\footnote` is a sidenote. When a
note belongs below the text, as in a standard LaTeX article, the `footnote`
shortcode{{< footnote >}}This is a real footnote, written with the `footnote` shortcode. It is listed at the end of the page and marked with a letter, because the page also has numbered sidenotes.{{< /footnote >}}
and Markdown footnotes whose label starts with `fn-`[^fn-classic] give one,
next to the sidenotes.

[^fn-classic]: Written as `[^fn-classic]`: the `fn-` prefix keeps a Markdown footnote a real footnote.

{{< marginblock label="mb:demo" >}}
A **margin block** holds block content:

- a list,
- a second paragraph,
- or a small table.

It is LaTeX's `\marginpar` with a `minipage` inside.
{{< /marginblock >}}

The margin block next to this paragraph is a `marginblock` shortcode. Like every
float, it is anchored where it is written, so it is placed between paragraphs.

A table can carry note marks whose text is set apart, as with `\footnotemark`
and `\footnotetext`:

{{< table label="tab:demo-marks" caption="A table with a note mark." >}}
| Paper  | Text width{{< footnotemark "textwidth" >}} | Margin |
|:-------|-----------:|-------:|
| letter | 26 pc      | 12 pc  |
| a4     | 107 mm     | 49.4 mm|
{{< /table >}}

{{< footnotetext name="textwidth" offset="-3bl" >}}The width of the main text block, from `tufte-common.def`.{{< /footnotetext >}}

## Citations {#sec:citations}

A citation is a numbered sidenote with the full reference,{{< cite "tufte2001" >}}
several keys can be cited at once,{{< cite "tufte1990" "tufte1997" >}} and the note
can be moved like any other.{{< cite keys="tufte2006,bringhurst2005" offset="-1bl" >}}
In the natbib style, {{< cite keys="tufte1990" mode="text" >}} prints the author
and year in the text, and {{< cite keys="tufte2001" mode="paren" page="92" >}}
puts them in parentheses. The full entry can also be written inline:
{{< bibentry "bringhurst2005" >}}. The book by Mittelbach and Goossens is in the
bibliography below without being cited, thanks to `nocite`.{{< nocite "mittelbach2004" >}}

## Floats {#sec:floats}

{{< fig type="margin" src="/images/latex/helix.svg" alt="A helix" label="fig:demo-helix" short="A helix" >}}A margin figure whose caption cites a book:{{< cite "tufte1997" >}} the helix $x = \cos(2\pi z)$, $y = \sin(2\pi z)$.{{< /fig >}}

Figures and tables are numbered automatically as soon as the page has a
labelled float or equation, or any cross-reference (`xref` or `eqref`, to
anything, a section included); `tufte.floats.number = false` turns this off. The margin figure here is {{< xref "fig:demo-helix" "full" >}};
its caption contains a nested citation.

{{< figure src="/images/latex/hilbertcurves.svg" alt="Hilbert curves" caption="Hilbert curves of degrees 1 to 5, a main-column figure." label="fig:demo-hilbert" short="Hilbert curves" >}}

A plain Markdown image becomes a numbered figure when it has a title and an id:

![The graph of y = sin x](/images/latex/sine.svg "A Markdown image with `{#fig:demo-sine .fullwidth}` on the next line.")
{#fig:demo-sine .fullwidth}

That was {{< xref "fig:demo-sine" "full" >}}.

{{< margintable caption="A margin table." label="tab:demo-margin" >}}
| n | n² |
|--:|---:|
| 1 | 1  |
| 2 | 4  |
| 3 | 9  |
{{< /margintable >}}

{{< xref "tab:demo-margin" "full" >}} sits in the margin. The next one spans the
whole page, like `table*`:

{{< fullwidthtable caption="A full-width table: the paper geometry of the print stylesheet." label="tab:demo-full" >}}
| Paper  | Page size     | Margins (top right bottom left) | Text column | Margin column |
|:-------|:--------------|:--------------------------------|------------:|--------------:|
| letter | 8.5 × 11 in   | 1in 0.86in 1.48in 1in           | 65%         | 30%           |
| a4     | 210 × 297 mm  | 27.4mm 20.6mm 28.2mm 24.8mm     | 65%         | 30%           |
| b5     | 176 × 250 mm  | 28.7mm 14.69mm 34.1mm 14.66mm   | 70%         | 25%           |
{{< /fullwidthtable >}}

{{< listing caption="A listing float with the `ruled` style." label="lst:demo" style="ruled" >}}
```go
func main() {
	fmt.Println("Hello, Tufte")
}
```
{{< /listing >}}

{{< subfigures cols=2 caption="Two title pages side by side, as a grid of sub-figures." label="fig:demo-grid" >}}
![Title page of Envisioning Information](/images/latex/ei-title.svg)
![Title page of Beautiful Evidence](/images/latex/be-title.svg)
{{< /subfigures >}}

With `type="margin"` the grid is a margin figure, its caption below it:

{{< subfigures cols=2 type="margin" caption="The same title pages as a grid in the margin." >}}
![Title page of Envisioning Information](/images/latex/ei-title.svg "*Envisioning Information*")
![Title page of Beautiful Evidence](/images/latex/be-title.svg "*Beautiful Evidence*")
{{< /subfigures >}}

The lists of figures and tables of this page:

{{< listoffigures >}}

{{< listoftables >}}

{{< listoflistings >}}

## Cross-references {#sec:xrefs}

A reference prints a number ({{< xref "fig:demo-hilbert" >}}), a number with its
name ({{< xref "fig:demo-hilbert" "full" >}}), the caption or the title
(“{{< xref "sec:notes" "name" >}}”), or the place where the target is
({{< xref "err:demo" "page" >}}). Forward references work: equation
{{< eqref "eq:demo-gauss" >}} is defined in the next section. An arbitrary point
of the text gets a label with the `label` shortcode, like here.{{< label "err:demo" >}}

## Equations {#sec:equations}

A display equation with `\label` is numbered:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi} \label{eq:demo-gauss}
$$

So is one written with the `equation` shortcode:

{{< equation label="eq:demo-euler" >}}
e^{i\pi} + 1 = 0
{{< /equation >}}

Equations {{< eqref "eq:demo-gauss" >}} and {{< eqref "eq:demo-euler" >}} share one counter.

## Theorems {#sec:theorems-demo}

The theorem environments of `amsthm` are block shortcodes, written
`{{</* theorem "Euler" "thm:demo-euler" */>}}` (the note, then the label) and
`{{</* proof */>}}`:

{{< theorem "Euler" "thm:demo-euler" >}}
For every real $x$, $e^{ix} = \cos x + i \sin x$.
{{< /theorem >}}

{{< proof >}}
Split the power series of $e^{ix}$ into its even and odd terms:

$$
e^{ix} = \sum_{n \ge 0} \frac{(ix)^n}{n!} = \sum_{k \ge 0} \frac{(-1)^k x^{2k}}{(2k)!} + i \sum_{k \ge 0} \frac{(-1)^k x^{2k+1}}{(2k+1)!}. \qedhere
$$
{{< /proof >}}

At $x = \pi$, {{< xref "thm:demo-euler" "full" >}} gives
{{< eqref "eq:demo-euler" >}}. The `\qedhere` in the display puts the
end-of-proof symbol at its right end. [Theorems and Proofs]({{< relref "posts/theorems.md" >}})
shows the other kinds, shared counters, numbering within sections and the
list of theorems.

## Typography {#sec:typography-demo}

{{< newthought >}}Letterspacing{{< /newthought >}} is applied to
{{< allcaps >}}all capitals{{< /allcaps >}}, to {{< smallcaps >}}Small Capitals{{< /smallcaps >}},
to {{< sc >}}Mixed Small Caps{{< /sc >}} and, on request, to
{{< textls "100" >}}any text{{< /textls >}}. A word can be protected from
hyphenation: {{< nohyphens >}}incomprehensibilities{{< /nohyphens >}}. The one-line
form {{< allcaps "nasa" />}} works too.{{< index "letterspacing" >}}

#### Run-in heading

A level-four heading is set in italics at the start of its paragraph, like
LaTeX's `\paragraph`.

{{< paragraph >}}Run-in shortcode{{< /paragraph >}} The `paragraph` shortcode
does the same inside a paragraph.

This paragraph is justified and hyphenated with the `{.justify}` attribute,
whatever the site setting, which is how a single paragraph can follow the
`justified` class option of LaTeX while the rest of the page is set ragged
right.
{.justify}

{{< verse >}}
Tyger Tyger, burning bright,
In the forests of the night;
What immortal hand or eye,
Could frame thy fearful symmetry?

In what distant deeps or skies.
Burnt the fire of thine eyes?
{{< /verse >}}

{{< tuftebreak >}}

{{< epigraph style="open" author="Antoine de Saint-Exupéry" >}}
A designer knows that he has achieved perfection not when there is nothing
left to add, but when there is nothing left to take away.
{{< /epigraph >}}

{{< clearmargin >}}

The `clearmargin` shortcode above pushes this paragraph below everything that
is still in the margin, like `\FloatBarrier`; `clearpage` starts a new page
when printing.{{< index "typography!clearing floats" >}}

{{< clearpage >}}

## Index {#sec:index-demo}

Index entries use the syntax of `makeindex`: levels separated by `!`,{{< index "index!levels" >}}
a sort key before `@`,{{< index "index!sort key@sort key" >}} cross-references with
`|see{…}`{{< index "makeindex|see{index}" >}} and page ranges with `|(` and `|)`.
The quote character `"` makes the next `!`, `@`, `|` or `"` literal: ``{{</* index `index!quote "!` */>}}``
lists “quote !” under “index”.{{< index `index!quote "!` >}}
The index of this page:

{{< printindex >}}

The references below are written with `{{</* bibliography heading="Works cited" */>}}`
instead of the automatic list, which a handout leaves out when it has its own
`bibliography` shortcode; `all=true` would list every entry of the database.

{{< bibliography heading="Works cited" >}}
