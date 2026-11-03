---
title: "Parts and Appendices"
subtitle: "A small book that exercises parts, numbered chapters and appendices"
book: true
author: "Massimo Nocentini"
publisher: "tufte.hugo"
date: 2026-10-28
description: "A two-part book with numbered chapters, continuous figure numbers and a lettered appendix."
outputs: ["html", "print"]   # also a single-page print view, print.html
bibliography: refs.bib   # a BibTeX file of this bundle, merged with data/bibliography.yaml
frontispiece:            # the illustration facing the title page
  src: /images/latex/hilbertcurves.svg
  alt: "Hilbert curves of degrees 1 to 5"
  caption: "*Frontispiece.* Hilbert curves of degrees 1 to 5; the curve of degree $n$ visits all $4^n$ cells of the grid."
tufte:
  book:
    numberChapters: true
    tocDepth: 1
---

Each sub-section of a book is a *part* (LaTeX's `\part`), numbered with
roman numerals; its chapters are listed on the part's own page. This book
also sets `tufte: {book: {numberChapters: true, tocDepth: 1}}`, so chapters
are numbered and the contents list their sections.

The illustration before the title page is the book's *frontispiece*, set
with the front matter `frontispiece: {src, alt, caption}`; its caption sits
in the margin like a figure's, but it is not numbered.

The book's citations come from a BibTeX file of the book bundle, `refs.bib`,
read directly by the theme.
