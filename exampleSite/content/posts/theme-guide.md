---
title: "Theme Guide"
subtitle: "Installing, configuring and writing for tufte.hugo"
date: 2026-10-28T09:00:00+01:00
author: "Massimo Nocentini"
description: "A practical guide to the tufte.hugo theme: installation, configuration, front matter, shortcodes and render hooks."
tags: ["hugo", "theme", "configuration"]
categories: ["Documentation"]
toc: true
---

{{< epigraph author="Edward Tufte" cite="The Visual Display of Quantitative Information" >}}
Above all else show the data.
{{< /epigraph >}}

{{< newthought >}}This guide walks through{{< /newthought >}} everything needed to publish a site with tufte.hugo: installing the theme, the settings it reads, the front matter it understands, and the shortcodes that produce Tufte's layouts. The README of the theme is the complete reference; this page is the tour.

## Installation

The theme needs the latest Hugo release (0.169.0 or later); the standard edition is enough, since the theme ships plain CSS and needs neither Sass nor JavaScript tooling.

As a Git submodule:

```shell
hugo new site my-site && cd my-site
git init
git submodule add https://github.com/massimo-nocentini/tufte.hugo themes/tufte.hugo
echo 'theme = "tufte.hugo"' >> hugo.toml
hugo server
```

As a Hugo module, initialise your site as a module and import the theme:

```toml
[module]
  [[module.imports]]
    path = "github.com/massimo-nocentini/tufte.hugo"
```

The `exampleSite` folder of the theme, the site you are reading, is a working configuration to start from.

## Required site settings

Hugo does not merge `[markup]` from a theme, so three Goldmark settings must be copied into your own configuration:

```toml
[markup.goldmark.parser]
  wrapStandAloneImageWithinParagraph = false  # images on their own line become figures
  autoHeadingID = true                        # the default: keep it (section numbers, xref, TOC)
  [markup.goldmark.parser.attribute]
    block = true                              # {.sans}, {.fullwidth}, quote attribution

[markup.goldmark.extensions.passthrough]      # math, see "Math and Code"
  enable = true
  [markup.goldmark.extensions.passthrough.delimiters]
    block = [['\[', '\]'], ['$$', '$$']]
    inline = [['\(', '\)'], ['$', '$']]

[markup.highlight]
  noClasses = false                           # colours from the theme's syntax.css
```

Raw HTML can stay disabled (`unsafe = false`): nothing in the theme depends on it.

## Theme parameters

All parameters live under `[params]` and have sensible defaults. The ones you will most likely change:

| Parameter         | Default        | Effect                                                    |
| :---------------- | :------------- | :-------------------------------------------------------- |
| `subtitle`        | empty          | Line under the site title on the home page                |
| `sections`        | `"h2"`         | Start a new `section` at each `h2`, or `"none"`           |
| `footnotes`       | `"sidenotes"`  | Turn footnotes into sidenotes, or keep `"endnotes"`       |
| `etBook`          | `true`         | Load the ET Book web fonts                                |
| `showReadingTime` | `true`         | Reading time in the post meta line                        |
| `toc`             | `false`        | Table of contents at the top of posts                     |
| `math.enable`     | `"auto"`       | Load the KaTeX stylesheet only where math appears         |
| `math.font`       | `"katex"`      | `"euler"`: formulas in Zapf's Euler (MathML)              |
| `customCSS`       | `[]`           | Extra stylesheets from your `assets/` folder              |
| `search.enable`   | `false`        | Search box in the header and a results page               |

Author and social links go in `[params.author]` and `[params.social]`; comments use Giscus (`[params.giscus]`) or Hugo's Disqus template, and `[params] comments = false` (short for `[params.comments] enable = false`) turns them off site-wide.

## Front matter

Besides the usual `title` (optional: a short note without one is called by its `linkTitle`, else “Untitled”, i18n key
`untitled`, and a section, book or part whose `_index.md` has none by its directory name, humanized, wherever a
title is shown, so no heading or link is left empty), `date`, `tags` and `categories`, posts may set:

- `subtitle`, shown in the style of Tufte's subtitles below the title;
- `sections`, `footnotes` and `toc`, overriding the site parameters for one page (this page sets `toc: true`);
- `math: true` to force the KaTeX stylesheet;
- `mathFont: euler` to set this page's formulas in Euler, as [Euler Math](/posts/euler-math/) does;
- `comments: false` to hide comments;
- `searchHidden: true` to keep the page out of the site search.

## Writing with shortcodes

Inline shortcodes go *inside* a paragraph, with no line breaks around them, exactly where the note or span should appear:

```markdown
Tufte uses sidenotes.{{</* sidenote */>}}Like this one.{{</* /sidenote */>}} He also
uses margin notes.{{</* marginnote */>}}Without a number.{{</* /marginnote */>}}

{{</* newthought */>}}In his later books{{</* /newthought */>}}, Tufte starts …

Set a few words in {{</* sans */>}}Gill Sans{{</* /sans */>}}.
```

Here they are at work: a sidenote,{{< sidenote >}}The content of a note is Markdown: *italics*, `code` and [links](https://gohugo.io) are all fine.{{< /sidenote >}} a margin note,{{< marginnote >}}Margin notes have no number.{{< /marginnote >}} and a few words in {{< sans >}}a sans-serif face{{< /sans >}}.

For a short text, the four of them also have a one-line form, with the text as the only positional parameter (or as the named parameter `text`) and a self-closing `/>}}`:

```markdown
A short aside.{{</* sidenote "Written on one line." /*/>}} Another one.{{</* marginnote text="Also on one line." /*/>}}
{{</* newthought "Small capitals" /*/>}} open a thought, {{</* sans "Gill Sans" /*/>}} changes the face.
```

{{< newthought "Like this" />}}: a one-line sidenote{{< sidenote "This note was written on one line, with its text as a positional parameter." />}} and a one-line margin note.{{< marginnote text="Written with the named parameter `text`." />}} The named parameters of `sidenote` (`number`, `offset`, `label`, `cite`) and `marginnote` (`offset`, `cite`) are described in [From LaTeX to Hugo]({{< relref "posts/latex-to-hugo.md" >}}).

Block shortcodes stand on lines of their own and take Markdown inside:

```markdown
{{</* epigraph author="Edward Tufte" cite="The Visual Display of Quantitative Information" */>}}
Above all else show the data.
{{</* /epigraph */>}}

{{</* blockquote author="Edward Tufte" cite="The Visual Display of Quantitative Information" */>}}
Graphical excellence is that which gives to the viewer the greatest number of ideas in the shortest time with the least ink in the smallest space.
{{</* /blockquote */>}}

{{</* fullwidth */>}}
This paragraph spans the full width of the page.
{{</* /fullwidth */>}}
```

The rendered block quote:

{{< blockquote author="Edward Tufte" cite="The Visual Display of Quantitative Information" >}}
Graphical excellence is that which gives to the viewer the greatest number of ideas in the shortest time with the least ink in the smallest space.
{{< /blockquote >}}

Collapsible asides use the `details` shortcode (the theme's version of Hugo's built-in one); the theme keeps them in the text column, and a Markdown footnote inside one becomes a footnote of the page. A sidenote inside one keeps its place in the page's numbering: the marks after the block show the same numbers whether it is open or closed.

{{< details summary="Why sidenotes rather than footnotes?" >}}
A sidenote sits next to the sentence it annotates,{{< sidenote >}}This numbered sidenote is inside the collapsible block. Close the block and the marks after it keep their numbers.{{< /sidenote >}} so the reader's eye never has to jump to the bottom of the page and back.[^fn-details]
{{< /details >}}

[^fn-details]: A real footnote, referenced from inside the collapsible block, listed below the text.

A block shortcode can be indented where Markdown asks for it, in a numbered step or in a real footnote of several paragraphs: the indentation of its opening tag is removed from the text inside it.[^fn-indented]

1. Write the data as a Markdown table, indented under the step:

    {{< table caption="A table inside a numbered step." >}}
    | Step | Ink |
    |------|-----|
    | 1    | low |
    {{< /table >}}

2. Show the code that reads it:

    {{< listing caption="A listing inside a numbered step." >}}
    ```go
    if ink > data {
        erase(ink)
    }
    ```
    {{< /listing >}}

[^fn-indented]: A real footnote whose second block is a listing, indented by four spaces like every continuation of a footnote.

    {{< listing caption="A listing inside a real footnote." >}}
    ```go
    ratio := data / ink
    ```
    {{< /listing >}}

A self-hosted video becomes a Tufte figure, with its caption in the margin (with `type="fullwidth"`, a `figcaption` in the margin column under the video, as for a full-width image):

```markdown
{{</* video src="flow.mp4" poster="flow.jpg" caption="Water flow, *slowed down*." */>}}
```

(The example site ships no video file, so this one is not shown live.) Its options:

- `src` (required) and `poster` resolve like figure sources: a page resource, an `assets/` resource, a `static/` path or a URL (also a `data:` URI with an image for `poster`, a video or audio for `src`);
- `caption` takes inline Markdown, and `title` is the accessible label of the video (default: the caption as plain text);
- `type` is `main` (default) or `fullwidth`;
- `controls` is on by default, and `controls="false"` hides the player controls;
- `autoplay`, `loop`, `muted` and `playsinline` take `"true"`, and `autoplay` implies `muted` and `playsinline`;
- `width` and `height` become attributes of the `<video>`, and `class` adds classes to the `<figure>`.

The [`video` section of the README](https://github.com/massimo-nocentini/tufte.hugo#video) has the same list.

Figures and embeds are covered in [Figures and Tables]({{< relref "posts/figures-and-tables.md" >}}), math and code in [Math and Code]({{< relref "posts/math-and-code.md" >}}), and footnotes in [Footnotes as Sidenotes]({{< relref "posts/footnotes-as-sidenotes.md" >}}).

## Plain Markdown

Much of Tufte CSS needs no shortcode at all.

A paragraph can be set in sans-serif with a block attribute on the line after it.
{.sans}

Block quotes can carry their attribution as attributes:

> To clarify, add detail.
{author="Edward Tufte" cite="Envisioning Information"}

GitHub-style alerts are rendered as quiet, labelled blocks:

> [!NOTE]
> The theme is tested only with the latest Hugo release and declares 0.169.0 as its minimum; an older version stops the build with an error.

> [!TIP]
> Run `hugo server --navigateToChanged` while writing, to jump to the page you are editing.

> [!IMPORTANT]
> Keep `wrapStandAloneImageWithinParagraph = false`, or images lose their captions.

> [!WARNING]
> A single `$` starts inline math with the configuration above.

> [!CAUTION]
> Do not edit the vendored `tufte.css`; override it in a stylesheet listed in `customCSS`.

Lists nest, and the notes and figure captions of a nested item still go to the margin column:

- An outer item.
  - A nested item with a sidenote.{{< sidenote >}}A note in a nested list item, in the margin column like any other.{{< /sidenote >}}
  - A nested item with a figure:

    ![The graph of y = sin x](/images/latex/sine.svg "A figure in a nested list item: it fills the item, its caption is in the margin.")

## Customisation

The theme leaves empty partials for you to override from your site's `layouts/_partials/` folder: `head_custom.html`, `header_custom.html`, `before_content.html`, `after_content.html`, `footer_custom.html` and `scripts_custom.html`. Stylesheets listed in `params.customCSS` are appended to the theme's CSS bundle, so their rules win. The theme ships no JavaScript, except the optional site search below; scripts you put in your site's `assets/js/tufte/` folder (that folder only) are bundled, fingerprinted and loaded deferred on every page as one classic script.

On a multilingual site, the header links every page to its translations, and the head lists them as `hreflang` alternates. Translations for the theme's few words, such as "Read more" or "Older posts", are provided in English, Italian, French, German and Spanish; in any other language they fall back to English until you add your own `i18n/<lang>.yaml`. The short dates of the archive follow the language too ("Jan 2" in English, "2 Jan" in Italian): set `archiveDateFormat` under `[params]` to choose another Go layout.

## Searching the site

This site has a search box in its header: type a few words, or press `/` to get there. The best
matches show under the box, each with the section where the words are and a few lines around them; the arrow
keys and Enter open one, and Enter on the query opens the [search page](/search/?q=sidenote),
which lists them all. Words may come in any order and with a typo (try “lagrnge”), and accents do not matter.

It is the theme's only JavaScript, and it is off unless the site turns it on and gives the home page the
index, the `searchindex` output:

```toml
[params.search]
  enable = true

[outputs]
  home = ["html", "rss", "searchindex"]
```

The results page is any page with `layout: search` (here `content/search.md`). The index is built from the
pages as they read, numbers and cross-references resolved, with the notes in the margin kept apart and math as
its TeX; `searchHidden: true` keeps a page out of it. Fuse.js, which does the matching, and the index load only
when someone searches.

## Writing like tufte-latex

Everything the Tufte-LaTeX classes offer has a counterpart: numbered figures
and tables with their captions in the margin, citations in the margin and a
bibliography, cross-references, lists of figures and tables, an index, and
multi-chapter books with a title page and contents. Options go under
`[params.tufte]` in the site configuration, or under `tufte:` in front
matter; `tufte: {style: latex}` gives a page the look of `tufte-handout`.
[From LaTeX to Hugo]({{< relref "posts/latex-to-hugo.md" >}}) maps every
LaTeX command to its shortcode, with live examples; the
[handout]({{< relref "posts/sample-handout/index.md" >}}) and the
[book]({{< relref "books/sample-book/_index.md" >}}) are ports of the two
Tufte-LaTeX samples.

## Theorems and proofs

The theorem environments of LaTeX's `amsthm` are block shortcodes:
`theorem`, `lemma`, `proposition`, `corollary`, `definition`, `example`,
`remark`, `thm` for any other kind, and `proof`. The note and the label are
the two positional arguments, and `{{</* proof of="thm:x" */>}}` names the
theorem it proves:

```markdown
{{</* lemma "Bézout" "lem:bezout" */>}}
For integers $a$ and $b$ there are integers $x$ and $y$ with $ax + by = \gcd(a, b)$.
{{</* /lemma */>}}
```

{{< lemma "Bézout" "lem:bezout" >}}
For integers $a$ and $b$ there are integers $x$ and $y$ with
$ax + by = \gcd(a, b)$.
{{< /lemma >}}

{{< proof of="lem:bezout" >}}
If $a = b = 0$, take $x = y = 0$. Otherwise the set of the integers
$ax + by$ has a smallest positive element $d$; it divides $a$ and $b$ (the
remainder of $a$ divided by $d$ is again of that form and smaller than $d$, so it is $0$),
and every common divisor of $a$ and $b$ divides $d$.
{{< /proof >}}

All kinds share one counter, as in the AMS templates; the options
`tufte.theorems.*` declare new kinds and change counters, numbering within
sections or chapters, the look of the heads and the end-of-proof symbol.
[Theorems and Proofs]({{< relref "posts/theorems.md" >}}) shows them all,
with cross-references and a list of theorems.
