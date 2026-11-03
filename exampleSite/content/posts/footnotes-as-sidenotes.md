---
title: "Footnotes as Sidenotes"
subtitle: "Write ordinary Markdown footnotes, read them in the margin"
date: 2026-10-05T09:00:00+02:00
author: "Massimo Nocentini"
description: "How tufte.hugo turns Markdown footnotes into Tufte-style sidenotes, and how to opt out."
tags: ["sidenotes", "footnotes", "markdown"]
categories: ["Documentation"]
---

{{< newthought >}}Footnotes are the most portable{{< /newthought >}} way to write a note in Markdown: every editor previews them, every converter understands them, and they survive a move to another blog engine.[^portable] Sidenotes are the better way to *read* a note. This theme lets you write the first and publish the second.

## How it works

Hugo renders footnotes as a superscript link in the text and a numbered list at the end of the page.[^goldmark] After Hugo has rendered the page, the theme rewrites that output: each reference becomes the label, checkbox and `span.sidenote` that Tufte CSS expects, the note text is moved next to its reference, and the list at the bottom is removed.

Nothing changes in your source. This paragraph, for example, is written as

```markdown
Hugo renders footnotes as a superscript link in the text
and a numbered list at the end of the page.[^goldmark]

[^goldmark]: Footnotes come from Goldmark's *footnote*
    extension, which Hugo enables by default.
```

and the note appears in the margin, numbered automatically by Tufte CSS's counter.

## What a footnote may contain

Notes are rendered as inline text inside a `span`, so they can hold anything that fits in a sentence: *emphasis*, **strong text**, `code`, and links.[^inline] Paragraph breaks inside a long footnote are kept as line breaks.[^long]

Footnote labels do not have to be numbers. Words make the source easier to read,[^words] and the theme handles both kinds of label the same way. The number displayed is always the position of the note on the page, not its label.

A footnote can be referenced more than once.[^twice] Each reference gets its own sidenote, so the reader never has to look for the first one.[^twice]

## Footnotes on list pages

Summaries on the home page and on section pages go through the same conversion, and every note gets an identifier derived from the page's permalink and a counter. Two posts shown on the same list page therefore never fight over the same checkbox.

## Opting out

Set `footnotes = "endnotes"` in the `[params]` of your site configuration to keep Hugo's ordinary footnote list everywhere, or set it in the front matter of a single page:

```yaml
---
title: "A page with endnotes"
footnotes: endnotes
---
```

The post [Small Multiples]({{< relref "posts/small-multiples.md" >}}) on this site does exactly that.

For notes that should not be numbered, use the `marginnote` shortcode instead:{{< marginnote >}}This is a margin note, written with the `marginnote` shortcode. It has no number; on small screens it hides behind the &#8853; symbol.{{< /marginnote >}} there is no Markdown syntax for an unnumbered note.

[^portable]: CommonMark has no footnotes, but GitHub, Pandoc, MultiMarkdown, Obsidian and Goldmark all accept the same `[^label]` syntax.

[^goldmark]: Footnotes come from Goldmark's *footnote* extension, which Hugo enables by default.

[^inline]: For example, a link to the [Tufte CSS repository](https://github.com/edwardtufte/tufte-css), some `inline code` and a word in *italics*.

[^long]: This is the first paragraph of a long note.

    This is its second paragraph, indented by four spaces in the source. In the margin it starts on a new line.

[^words]: This note is labelled `[^words]` in the source.

[^twice]: This note is referenced twice in the paragraph, and appears next to each reference.
