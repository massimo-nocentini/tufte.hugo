---
title: "Customizing Tufte-LaTeX"
linkTitle: "Customizing Tufte-LaTeX"
weight: 30
label: "ch:customizing"
tufte:
  headings:
    number: 1
---

The Tufte-LaTeX document classes are designed to closely emulate Tufte's book
design by default. However, each document is different and you may encounter
situations where the default settings are insufficient. This chapter explores
many of the ways you can adjust the Tufte-LaTeX document classes to better fit
your needs.{{< marginnote >}}This chapter sets `tufte: {headings: {number: 1}}` in its front matter, so its sections are numbered, as described in the section on numbered section headings below.{{< /marginnote >}}

## File Hooks {#sec:filehooks}

{{< index "file hooks|(" >}}If you create many documents using the Tufte-LaTeX classes, it's easier to
store your customizations in a separate file instead of copying them into the
preamble of each document. The Tufte-LaTeX classes provide three file hooks:
`tufte-common-local.tex`{{< index "file hooks!common" >}}{{< index "tufte-common-local.tex@`tufte-common-local.tex`" >}}, `tufte-book-local.tex`{{< index "file hooks!book" >}}{{< index "tufte-book-local.tex@`tufte-book-local.tex`" >}}, and
`tufte-handout-local.tex`{{< index "file hooks!handout" >}}{{< index "tufte-handout-local.tex@`tufte-handout-local.tex`" >}}.

`tufte-common-local.tex`
: If this file exists, it will be loaded by all of the Tufte-LaTeX document
  classes just prior to any document-class-specific code. If your
  customizations or code should be included in both the book and handout
  classes, use this file hook.

`tufte-book-local.tex`
: If this file exists, it will be loaded after all of the common and
  book-specific code has been read. If your customizations apply only to the
  book class, use this file hook.

`tufte-handout-local.tex`
: If this file exists, it will be loaded after all of the common and
  handout-specific code has been read. If your customizations apply only to
  the handout class, use this file hook.

In this theme the same role is played by `params.customCSS` (extra
stylesheets appended to the bundle) and by the empty `*_custom.html`
partials. The body carries the class `tufte-book` or `tufte-handout`, so a
stylesheet can target one kind of document only.{{< index "file hooks|)" >}}

## Numbered Section Headings {#sec:numbered-sections}

{{< index "headings!numbered" >}}While Tufte dispenses with numbered headings in his books, if you require them,
they can be enabled by changing the value of the `secnumdepth`{{< index "secnumdepth counter@`secnumdepth` counter" >}}
counter. From the table below, select the heading level at which numbering
should stop and set the `secnumdepth` counter to that value. For
example, if you want parts and chapters numbered, but don't want numbering for
sections or subsections, use the command:{{< index "setcounter command@`\setcounter`" >}}

```text
\setcounter{secnumdepth}{0}
```

The default `secnumdepth` for the Tufte-LaTeX document classes is $-1$. In
this theme, chapters are numbered with `tufte.book.numberChapters = true` and
sections with `tufte.headings.number` (`1` numbers `##`, `2` also `###`); a
heading with `{.unnumbered}` is skipped.

{{< table caption="Heading levels used with the `secnumdepth` counter." >}}
| Heading level                         | Value  |
|:--------------------------------------|-------:|
| Part (in `tufte-book`)                | $-1$   |
| Part (in `tufte-handout`)             | $0$    |
| Chapter (only in `tufte-book`)        | $0$    |
| Section                               | $1$    |
| Subsection                            | $2$    |
| Subsubsection                         | $3$    |
| Paragraph                             | $4$    |
| Subparagraph                          | $5$    |
{{< /table >}}

## Changing the Paper Size {#sec:paper-size}

The Tufte-LaTeX classes currently only provide three paper sizes: {{< sc >}}a4{{< /sc >}},
{{< sc >}}b5{{< /sc >}}, and {{< sc >}}us{{< /sc >}} letter. To specify a different paper size (and/or
margins), use the `\geometry`{{< index "geometry command@`\geometry` (`geometry` package)" >}}{{< index "geometry package@`geometry` package" >}}{{< index "packages!geometry@`geometry`" >}} command in the preamble of your
document (or one of the file hooks). The full documentation of the
`\geometry` command may be found in the `geometry` package
documentation.{{< cite "pkg-geometry" >}} This theme sets the paper of its print
stylesheet with `tufte.print.paper` (`"letter"`, `"a4"` or `"b5"`), using the
same text and margin widths as the LaTeX classes.

## Customizing Marginal Material {#sec:marginal-material}

Marginal material includes sidenotes, citations, margin notes, and captions.
Normally, the justification of the marginal material follows the justification
of the body text. If you specify the `justified`{{< index "justified class option@`justified` class option" >}}{{< index "class options!justified@`justified`" >}} document class
option, all of the margin material will be fully justified as well. If you
don't specify the `justified` option, then the marginal material will
be set ragged right.

You can set the justification of the marginal material separately from the body
text using the following document class options: `sidenote`{{< index "sidenote class option@`sidenote` class option" >}}{{< index "class options!sidenote@`sidenote`" >}},
`marginnote`{{< index "marginnote class option@`marginnote` class option" >}}{{< index "class options!marginnote@`marginnote`" >}}, `caption`{{< index "caption class option@`caption` class option" >}}{{< index "class options!caption@`caption`" >}}, `citation`{{< index "citation class option@`citation` class option" >}}{{< index "class options!citation@`citation`" >}}, and
`marginals`{{< index "marginals class option@`marginals` class option" >}}{{< index "class options!marginals@`marginals`" >}}. Each option refers to its obviously corresponding
marginal material type. The `marginals` option simultaneously sets
the justification on all four marginal material types. Here they are
`tufte.sidenote.align`, `tufte.marginnote.align`, `tufte.caption.align`,
`tufte.citation.align` and `tufte.marginals`.

Each of the document class options takes one of five justification types:

`justified`{{< index "justified class option@`justified` class option" >}}{{< index "class options!justified@`justified`" >}}
: Fully justifies the text (sets it flush left and right).

`raggedleft`{{< index "raggedleft class option@`raggedleft` class option" >}}{{< index "class options!raggedleft@`raggedleft`" >}}
: Sets the text ragged left, regardless of which page it falls on.

`raggedright`{{< index "raggedright class option@`raggedright` class option" >}}{{< index "class options!raggedright@`raggedright`" >}}
: Sets the text ragged right, regardless of which page it falls on.

`raggedouter`
: Sets the text ragged left if it falls on the left-hand (verso) page of the
  spread and otherwise sets it ragged right. This is useful in conjunction
  with the `symmetric`{{< index "symmetric class option@`symmetric` class option" >}}{{< index "class options!symmetric@`symmetric`" >}} document class option. (On the web, where notes are
  always on the right, it is the same as `raggedright`.)

`auto`{{< index "auto class option@`auto` class option" >}}{{< index "class options!auto@`auto`" >}}
: If the `justified` document class option was specified, then set the text
  fully justified; otherwise the text is set ragged right. This is the
  default justification option if one is not explicitly specified.

For example,

```text
\documentclass[symmetric,justified,marginals=raggedouter]{tufte-book}
```

will set the body text of the document to be fully justified and all of the
margin material (sidenotes, margin notes, captions, and citations) to be flush
against the body text with ragged outer edges. The same in this theme:

```toml
[params.tufte]
  justified = true
  marginals = "raggedouter"
```

{{< newthought >}}The font and style{{< /newthought >}} of the marginal material may also be modified using the following commands:

```text
\setsidenotefont{font commands}
\setcaptionfont{font commands}
\setmarginnotefont{font commands}
\setcitationfont{font commands}
```

The `\setsidenotefont`{{< index "setsidenotefont command@`\setsidenotefont`" >}} sets the font and style for sidenotes, the
`\setcaptionfont`{{< index "setcaptionfont command@`\setcaptionfont`" >}} for captions, the `\setmarginnotefont`{{< index "setmarginnotefont command@`\setmarginnotefont`" >}} for
margin notes, and the `\setcitationfont`{{< index "setcitationfont command@`\setcitationfont`" >}} for citations. The
*font commands* can contain font size changes (e.g.,
`\footnotesize`, `\Huge`, etc.), font style changes (e.g.,
`\sffamily`, `\ttfamily`, `\itshape`, etc.), color changes (e.g.,
`\color{blue}`), and many other adjustments.

If, for example, you wanted the captions to be set in italic sans serif, you could use:

```text
\setcaptionfont{\itshape\sffamily}
```

In this theme the font is a list of words (`italic`, `upright`, `sans`,
`serif`, `mono`, `small`, `smaller`, `normal` and a `#hex` colour):

```toml
[params.tufte.caption]
  font = "italic sans"
```
