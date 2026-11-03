---
title: "Reading Notes"
subtitle: "Quotations, alerts and a summary break"
date: 2025-12-09T10:00:00+01:00
author: "Massimo Nocentini"
description: "Short notes on reading Tufte, with attributed quotations, an alert and a manual summary."
tags: ["typography", "reading"]
categories: ["Essays"]
---

A few notes collected while rereading Tufte's books, with a sidenote in the summary.{{< sidenote >}}Sidenotes in summaries are converted too, and keep unique identifiers on list pages.{{< /sidenote >}} The text above the summary divider is what list pages show.

<!--more-->

## On quotations

Tufte CSS styles an attributed quotation as a `blockquote` with a `footer`. In Markdown, write the attribution as attributes on the line after the quote:

> Above all else show the data.
{author="Edward Tufte" cite="The Visual Display of Quantitative Information"}

The same quotation with the `blockquote` shortcode, which also accepts Markdown inside:

{{< blockquote author="Edward Tufte" cite="The Visual Display of Quantitative Information" >}}
Above all else show the data.
{{< /blockquote >}}

## On sans-serif

The body text is ET Book, a serif. For a contrasting voice, {{< sans >}}a few words in sans-serif{{< /sans >}} are enough; a whole paragraph can be switched with a block attribute.

> [!TIP]
> Use small caps sparingly: the `newthought` shortcode already provides them where Tufte uses them, at the start of a new idea.
