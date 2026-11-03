---
title: "Margins"
weight: 1
label: "ch:margins"
---

The margin is where Tufte's books keep their notes.{{< sidenote label="sn:margin-width" >}}The margin column is 27.5% of the page wide on screen.{{< /sidenote >}} Chapter numbers come from the order of the chapters in the book, not from their dates. Knuth's line-breaking algorithm{{< cite "knuth1981" >}} and his book on TeX{{< cite "knuth1984" >}} come from the book's own `refs.bib`.

## A numbered figure {#sec:numbered-figure}

{{< fig src="/images/latex/helix.svg" alt="A helix" label="fig:demo-helix" type="margin" >}}A helix, figure number 1 of the book.{{< /fig >}}

Figures are numbered through the whole book: the sine wave in the next
chapter is {{< xref "fig:demo-sine" "full" >}}, while this helix is
{{< xref "fig:demo-helix" "full" >}}.

## Equations {#sec:equations}

Equation numbers continue across chapters too:

$$
e^{i\pi} + 1 = 0 \label{eq:euler}
$$

The next chapter refers back to {{< eqref "eq:euler" >}}.
