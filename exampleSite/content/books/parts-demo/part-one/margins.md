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

## Theorems {#sec:margin-theorems}

Theorems are numbered within the chapter in a book with numbered chapters,
as `\newtheorem{theorem}{Theorem}[chapter]` does in `amsbook`: this
chapter's theorem and lemma are 1.1 and 1.2.

{{< theorem "Margin width" "thm:margin-width" >}}
On a wide screen, the margin column is 27.5% of the page wide.
{{< /theorem >}}

{{< proof >}}
A paragraph is 55% of the page wide, and by {{< xref "lem:half-width" "full" >}}
a note is half as wide as its paragraph.
{{< /proof >}}

{{< lemma label="lem:half-width" >}}
A sidenote or a margin note is half as wide as the paragraph it belongs to.
{{< /lemma >}}

{{< proof >}}
Tufte CSS floats the note to the right of its paragraph with `width: 50%`
and a negative right margin of 60%.
{{< /proof >}}
