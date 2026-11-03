---
title: "Compatibility Issues"
weight: 40
label: "ch:compatibility"
---

When switching an existing document from one document class to a Tufte-LaTeX
document class, a few changes to the document may have to be made.

## Converting from `article` to `tufte-handout`

The following `article` class options are unsupported: `10pt`{{< index "class options!10pt@`10pt`" >}}, `11pt`, `12pt`, `a5paper`, `b5paper`, `executivepaper`, `legalpaper`, `landscape`, `onecolumn`, and `twocolumn`.

The following headings are not supported: `\subsubsection`{{< index "subsubsection command@`subsubsection` command" >}} and `\subparagraph`{{< index "subparagraph command@`subparagraph` command" >}}.

## Converting from `book` to `tufte-book`

The following `report` class options are unsupported: `10pt`, `11pt`, `12pt`, `a5paper`, `b5paper`, `executivepaper`, `legalpaper`, `landscape`, `onecolumn`, and `twocolumn`.

The following headings are not supported: `\subsubsection` and `\subparagraph`.

## Converting from LaTeX to this theme

A handout becomes an ordinary page and a book becomes a section whose
`_index.md` sets `book: true`; every command of the classes has a Markdown or
shortcode counterpart, listed in the [LaTeX to Hugo cheat
sheet](/posts/latex-to-hugo/). The design of the books themselves is
described in {{< xref "ch:tufte-design" "full" >}}.
