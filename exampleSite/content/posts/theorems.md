---
title: "Theorems and Proofs"
subtitle: "amsthm's theorem environments, numbered and cross-referenced"
date: 2026-11-02T09:00:00+01:00
description: "Theorems, lemmas, definitions, remarks and proofs as in LaTeX's amsthm: shared counters, numbering within sections, notes, the end-of-proof symbol, \\qedhere, cross-references and a list of theorems."
tags: ["latex", "math", "documentation"]
categories: ["Documentation"]
references:
  lang2002:
    type: book
    author: Serge Lang
    title: Algebra
    edition: "3"
    series: Graduate Texts in Mathematics
    volume: 211
    publisher: Springer
    address: New York
    year: 2002
tufte:
  headings: {number: 1}
  theorems:
    kinds:
      theorem: {within: section}
      conjecture: {counter: conjecture}
      principle: {name: Principle, style: definition}
---

LaTeX's `amsthm` package gives mathematics its theorem environments:
theorems, lemmas and definitions with a run-in head, a number and an
optional note, and proofs that end with a small square. The theme has the
same environments as block shortcodes. This page uses them on a little
group and ring theory, numbered within sections as
`\newtheorem{theorem}{Theorem}[section]` would.

<!--more-->

The front matter of this page plays the role of the preamble:

```yaml
tufte:
  headings: {number: 1}                  # numbered ## sections
  theorems:
    kinds:
      theorem: {within: section}         # \newtheorem{theorem}{Theorem}[section]
      conjecture: {counter: conjecture}  # \newtheorem{conjecture}{Conjecture}
      principle: {name: Principle, style: definition}   # \theoremstyle{definition}
                                         # \newtheorem{principle}[theorem]{Principle}
```

Every built-in kind (lemma, proposition, corollary, definition, example,
remark…) shares the counter `theorem`, as in the AMS templates, so the
definition, theorem and lemma below read 1.1, 1.2 and 1.3. Conjectures have
a counter of their own, and on a page that is not a book chapter it is not
reset by sections: they read 1 and 2.

## Groups

{{< definition label="def:group" >}}
{{< marginnote >}}A margin note on a line of its own at the start of a theorem takes no room in the text: the head still runs into the first paragraph.{{< /marginnote >}}

A *group* is a set $G$ with an associative operation $G \times G \to G$, an
identity element $e$ and, for every $g \in G$, an inverse $g^{-1}$ with
$g g^{-1} = g^{-1} g = e$. A *subgroup* is a subset that is a group under
the same operation.
{{< /definition >}}

The definition above is `{{</* definition label="def:group" */>}}…{{</* /definition */>}}`.
Definitions, examples and exercises are set upright (`\theoremstyle{definition}`);
theorems, lemmas, propositions, corollaries and conjectures in italics
(`plain`); remarks and notations upright with an italic head (`remark`).

{{< theorem "Lagrange" "thm:lagrange" >}}
If $H$ is a subgroup of a finite group $G$, the order of $H$ divides the
order of $G$.{{< sidenote >}}Lagrange proved it in 1771 for groups of permutations of the roots of a polynomial; the general statement came with Galois and Jordan.{{< /sidenote >}}
{{< /theorem >}}

The theorem was written `{{</* theorem "Lagrange" "thm:lagrange" */>}}`: the
first argument is the note in parentheses (`\begin{theorem}[Lagrange]`), the
second its label. The named form is `{{</* theorem note="Lagrange" label="thm:lagrange" */>}}`.
A sidenote in a theorem stays upright.

{{< proof of="thm:lagrange" label="prf:lagrange" >}}
By {{< xref "lem:coset" "full" >}} every left coset $gH$ has as many elements
as $H$, and two left cosets are equal or disjoint. So $G$ is the disjoint
union of $[G:H]$ cosets of $|H|$ elements each, and $|G| = [G:H]\,|H|$.

{{< marginnote >}}Nor does one at the end of a proof: the symbol still ends the last line.{{< /marginnote >}}
{{< /proof >}}

`{{</* proof of="thm:lagrange" */>}}` names the theorem it proves; `{{</* proof */>}}`
says just “Proof”, and `{{</* proof "Sketch" */>}}` gives any other head
(`\begin{proof}[Sketch]`). A proof that ends with a paragraph has the
end-of-proof symbol at the end of its last line.

{{< lemma label="lem:coset" >}}
For every $g \in G$ the map $h \mapsto gh$ is a bijection from $H$ onto the
coset $gH$.
{{< /lemma >}}

{{< proof of="lem:coset" >}}
The map is onto $gH$ by the definition of $gH$, and one to one because $g$
has an inverse:

$$
gh = gh' \implies h = g^{-1}(gh) = g^{-1}(gh') = h'. \label{eq:coset} \qedhere
$$
{{< /proof >}}

In a numbered display the `\qedhere` symbol follows the equation number.

{{< thm "conjecture" "Goldbach" >}}
{{< label "conj:goldbach" >}}
Every even integer greater than $2$ is the sum of two primes.
{{< /thm >}}

A kind without a shortcode of its own is written with `thm`:
`{{</* thm "conjecture" "Goldbach" */>}}`, the kind first. Its body starts
with `{{</* label "conj:goldbach" */>}}`, the port of
`\begin{conjecture}\label{conj:goldbach}`: a label in a theorem's body
refers to the theorem, so `{{</* xref "conj:goldbach" "full" */>}}` reads
{{< xref "conj:goldbach" "full" >}}.

{{< remark numbered=false label="rem:u" >}}
The converse of Lagrange's theorem fails: the alternating group $A_4$ has
order $12$ and no subgroup of order $6$.
{{< /remark >}}

That remark is unnumbered, `{{</* remark numbered=false label="rem:u" */>}}`, as
if declared with `\newtheorem*`; it takes no number from the counter.
A partial converse is due to Cauchy, here an unnumbered theorem whose note
carries a citation (`cite="lang2002"`):

{{< theorem note="Cauchy" numbered=false cite="lang2002" >}}
If a prime $p$ divides the order of a finite group $G$, then $G$ has an
element of order $p$.
{{< /theorem >}}

{{< proposition title="Cayley" numbered=false style="definition" class="fullwidth" >}}
Every group $G$ is isomorphic to a group of permutations: the map sending $g$ to the permutation
$x \mapsto gx$ of $G$ is an injective homomorphism from $G$ into the symmetric group on the set $G$.
{{< /proposition >}}

Cayley's theorem above is a proposition written with `title="Cayley"` (an
alias of the note), `numbered=false`, `style="definition"` (an upright body,
`\theoremstyle{definition}` for this one theorem) and `class="fullwidth"`,
which spans the text and the margin column.

{{< proof "Sketch of the proof" >}}
McKay's argument counts the $p$-tuples $(g_1, \dots, g_p)$ of elements of
$G$ whose product is $e$:

- there are $|G|^{p-1}$ of them, a multiple of $p$;
- a cyclic shift of such a tuple is another one, so they fall into orbits of $1$ or $p$ tuples;
- the orbits of one tuple are the $(g, \dots, g)$ with $g^p = e$; their number is a multiple of $p$, and $(e, \dots, e)$ is one of them, so some $g \ne e$ has order $p$.{{< qedhere >}}
{{< /proof >}}

The sketch ends with a list, so the symbol would go on a line of its own;
`{{</* qedhere */>}}` at the end of the last item puts it there instead, as
`\qedhere` does.

## Rings

{{< theorem label="thm:ring" >}}
The units of a ring $R$ with identity form a group $R^\times$ under
multiplication.
{{< /theorem >}}

{{< proof >}}
Multiplication is associative and $1$ is a unit, so it remains to see that
$R^\times$ is closed under inverses and products. Inverses first:

{{< lemma >}}
A unit $u$ has exactly one inverse $u^{-1}$, and $u^{-1}$ is a unit.
{{< /lemma >}}

{{< proof >}}
If $vu = 1 = uw$, then $v = v(uw) = (vu)w = w$; and $u$ is an inverse of
$u^{-1}$.
{{< /proof >}}

If $u$ and $v$ are units, so is $uv$, with inverse $v^{-1}u^{-1}$:

$$
(uv)(v^{-1}u^{-1}) = u(vv^{-1})u^{-1} = uu^{-1} = 1 = (v^{-1}u^{-1})(uv). \qedhere
$$
{{< /proof >}}

The lemma inside the proof is numbered 2.2, after the theorem it helps to
prove, as in LaTeX. The proof ends with a display, and `\qedhere` written in
the TeX puts the symbol at the right end of that display.

{{< corollary label="cor:unit" >}}
The nonzero elements of a field $F$ form a group under multiplication.
{{< /corollary >}}

{{< thm "conjecture" "Köthe" >}}
A ring with no nonzero nil two-sided ideal has no nonzero nil one-sided
ideal.
{{< /thm >}}

{{< proof of="cor:unit" >}}
In a field:

- every nonzero element is a unit, and $0$ is not, so $F^\times = F \setminus \{0\}$;
- {{< xref "thm:ring" "full" >}} makes it a group.
{{< /proof >}}

Without `\qedhere`, a proof that ends with a list has its symbol on a line
of its own.

{{< example qed="◇" >}}
The units of $\mathbb{Z}/8\mathbb{Z}$ are the classes of $1$, $3$, $5$ and
$7$. Each of them is its own inverse, so this group of order $4$ is not
cyclic; its subgroups have $1$, $2$ or $4$ elements, as
{{< xref "thm:lagrange" "full" >}} requires.
{{< /example >}}

The example ends with a symbol of its own, `{{</* example qed="◇" */>}}`
(thmtools' `qed=`); a proof takes `qed=` too, and `theorems.qed` sets the
symbol of every proof.

## Cross-references and other kinds {#sec:thm-xrefs}

A theorem's label works with `xref` like any other.
`{{</* xref "thm:lagrange" "full" */>}}` prints {{< xref "thm:lagrange" "full" >}}
(cleveref's `\cref`), `{{</* xref "thm:lagrange" "name" */>}}` its note,
{{< xref "thm:lagrange" "name" >}} (`\nameref`), and `{{</* xref "lem:coset" */>}}`
the number alone, {{< xref "lem:coset" >}}. An unnumbered remark is referred
to by its word, {{< xref "rem:u" >}}, and {{< xref "cor:unit" "full" >}} comes
from `{{</* xref "cor:unit" "full" */>}}`. The kind decides the word, whatever
the label's prefix. The other formats work too: `"num"` gives
{{< xref "lem:coset" "num" >}}, `"eq"` {{< xref "lem:coset" "eq" >}} and
`"page"` the section that holds the lemma, “{{< xref "lem:coset" "page" >}}”
(`\pageref`). A labelled proof, `{{</* proof of="thm:lagrange" label="prf:lagrange" */>}}`,
is referred to by its head: {{< xref "prf:lagrange" >}}.

A kind of your own is declared in the options, as this page does in its
front matter with `principle: {name: Principle, style: definition}`
(`\theoremstyle{definition}` `\newtheorem{principle}[theorem]{Principle}`),
and written with `thm`, here `{{</* thm kind="principle" numbered=false */>}}`:

{{< thm kind="principle" numbered=false >}}
If $n + 1$ objects are put into $n$ boxes, some box holds at least two of
them.
{{< /thm >}}

Without a declaration, `thm` gives the word itself with `name=`
(`{{</* thm kind="principle" name="Principle" */>}}`); a translated word comes
from an `i18n` key `thmPrinciple`.

{{< marginblock >}}
{{< definition note="Order" numbered=false >}}
The *order* $|G|$ of a group is its number of elements.
{{< /definition >}}
{{< /marginblock >}}

Theorems also work in a margin block, like the definition next to this
paragraph, and in a sidenote,{{< sidenote >}}{{< remark numbered=false >}}A theorem in a sidenote is set inline, in the note's type.{{< /remark >}}{{< /sidenote >}}
where they are set inline.

The heads here are in small capitals, the theme's look. `tufte: {theorems:
{look: amsthm}}` gives amsthm's bold heads, and `tufte: {style: latex}` turns
it on with the rest of the LaTeX look, together with amsthm's open box
$\square$ as the end-of-proof symbol (`theorems.qed`). The list of the
theorems of this page, thmtools' `\listoftheorems`, is
`{{</* listoftheorems */>}}`:

{{< listoftheorems >}}

A list of some kinds only, with a heading of its own, is
`{{</* listoftheorems kinds="conjecture" heading="Conjectures" */>}}`:

{{< listoftheorems kinds="conjecture" heading="Conjectures" >}}
