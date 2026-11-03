---
# A chapter of a tufte-book (a page inside a section whose _index.md sets
# `book: true`). Create it with:
#   hugo new content --kind chapter books/my-book/my-chapter.md
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
linkTitle: ""            # short title (\chapter[short]{…}): contents, navigation, running heads
date: {{ .Date }}
draft: true
weight: 10               # reading order (0 = unweighted, last); never the date
label: "ch:{{ .File.ContentBaseName }}"   # target of the xref shortcode
matter: main             # front | main | appendix | back
# unnumbered: true       # \chapter*: no chapter number
# intoc: false           # leave the chapter out of the table of contents
# abstract: ""           # Markdown, shown under the chapter title
# tufte: {}              # per-chapter options, e.g. {headings: {number: 1}}
---

{{< newthought >}}The opening words{{< /newthought >}} of the chapter.

## A first section {#sec:{{ .File.ContentBaseName }}-first}

Every level-two heading opens a new section.
