---
title: "Paper Geometry"
matter: appendix
weight: 10
label: "ch:geometry"
---

With `matter: appendix`, a chapter is an appendix, like those after LaTeX's
`\appendix`. In a book with numbered chapters (`tufte: {book: {numberChapters:
true}}`) appendices are lettered A, B, …: see the
[Parts and Appendices](/books/parts-demo) book. This book keeps tufte-book's
unnumbered chapters, so its appendix has no letter either. It
records the page geometry of the three paper sizes of the Tufte-LaTeX classes,
which the theme's print stylesheet reproduces ({{< xref "sec:paper-size" "name" >}}).

{{< table label="tab:geometry" caption="Text block and margin column of the three paper sizes, from `tufte-common.def`." short="Paper geometry." >}}
| Paper  | Text width | Gap     | Margin column | Lines per page |
|:-------|-----------:|--------:|--------------:|---------------:|
| letter | 26 pc      | 2 pc    | 12 pc         | 44             |
| a4     | 107 mm     | 8.2 mm  | 49.4 mm       | 49             |
| b5     | 102.66 mm  | 7.33 mm | 36.66 mm      | 38             |
{{< /table >}}
