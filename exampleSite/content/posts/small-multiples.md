---
title: "Small Multiples"
subtitle: "A post that keeps its footnotes at the end"
date: 2025-07-02T10:00:00+02:00
author: "Massimo Nocentini"
description: "A short post on small multiples that sets footnotes: endnotes to keep Hugo's standard footnote list."
tags: ["data-visualization", "footnotes"]
categories: ["Essays"]
footnotes: endnotes
---

Small multiples are series of small graphics that share the same scales and design, repeated across the values of one variable.[^term] Because everything but the data stays constant, the eye compares the panels instead of decoding each one.

This post sets `footnotes: endnotes` in its front matter, so its notes are listed at the bottom of the page, as Hugo renders them by default, instead of being moved into the margin.[^why]

## Making them well

A few rules of thumb:

1. use the same axes and scales in every panel;
2. order the panels by something meaningful, such as time or magnitude;
3. label once, in the margin or on the first panel, not in every panel;
4. keep each panel small enough that the whole set fits in one view.

Margin notes still work in a page with endnotes, because they are written with a shortcode rather than with footnote syntax.{{< marginnote >}}A margin note on a page whose footnotes are endnotes.{{< /marginnote >}}

[^term]: Edward Tufte popularised the term in *Envisioning Information*.

[^why]: Endnotes suit long notes that would crowd the margin, such as bibliographies.
