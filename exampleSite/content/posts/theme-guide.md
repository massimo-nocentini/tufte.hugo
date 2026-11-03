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

The theme needs Hugo 0.146 or later; the standard edition is enough, since the theme ships plain CSS and needs neither Sass nor JavaScript tooling.

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
| `customCSS`       | `[]`           | Extra stylesheets from your `assets/` folder              |

Author and social links go in `[params.author]` and `[params.social]`; comments use Giscus (`[params.giscus]`) or Hugo's Disqus template.

## Front matter

Besides the usual `title`, `date`, `tags` and `categories`, posts may set:

- `subtitle`, shown in the style of Tufte's subtitles below the title;
- `sections`, `footnotes` and `toc`, overriding the site parameters for one page (this page sets `toc: true`);
- `math: true` to force the KaTeX stylesheet;
- `comments: false` to hide comments.

## Writing with shortcodes

Inline shortcodes go *inside* a paragraph, with no line breaks around them, exactly where the note or span should appear:

```markdown
Tufte uses sidenotes.{{</* sidenote */>}}Like this one.{{</* /sidenote */>}} He also
uses margin notes.{{</* marginnote */>}}Without a number.{{</* /marginnote */>}}

{{</* newthought */>}}In his later books{{</* /newthought */>}}, Tufte starts …

Set a few words in {{</* sans */>}}Gill Sans{{</* /sans */>}}.
```

Here they are at work: a sidenote,{{< sidenote >}}The content of a note is Markdown: *italics*, `code` and [links](https://gohugo.io) are all fine.{{< /sidenote >}} a margin note,{{< marginnote >}}Margin notes have no number.{{< /marginnote >}} and a few words in {{< sans >}}a sans-serif face{{< /sans >}}.

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

Collapsible asides use Hugo's built-in `details` shortcode; the theme keeps them in the text column:

{{< details summary="Why sidenotes rather than footnotes?" >}}
A sidenote sits next to the sentence it annotates, so the reader's eye never has to jump to the bottom of the page and back.
{{< /details >}}

A self-hosted video becomes a Tufte figure, with its caption in the margin (or in a `figcaption` with `type="fullwidth"`):

```markdown
{{</* video src="flow.mp4" poster="flow.jpg" caption="Water flow, *slowed down*." */>}}
```

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
> Hugo 0.146 introduced the template system this theme uses. Older versions will not build it.

> [!TIP]
> Run `hugo server --navigateToChanged` while writing, to jump to the page you are editing.

> [!IMPORTANT]
> Keep `wrapStandAloneImageWithinParagraph = false`, or images lose their captions.

> [!WARNING]
> A single `$` starts inline math with the configuration above.

> [!CAUTION]
> Do not edit the vendored `tufte.css`; override it in a stylesheet listed in `customCSS`.

## Customisation

The theme leaves empty partials for you to override from your site's `layouts/_partials/` folder: `head_custom.html`, `header_custom.html`, `before_content.html`, `after_content.html`, `footer_custom.html` and `scripts_custom.html`. Stylesheets listed in `params.customCSS` are appended to the theme's CSS bundle, so their rules win.

On a multilingual site, the header links every page to its translations, and the head lists them as `hreflang` alternates. Translations for the theme's few words, such as "Read more" or "Older posts", are provided in English, Italian, French, German and Spanish.
