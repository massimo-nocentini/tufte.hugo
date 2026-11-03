---
title: "About"
subtitle: "This site and its theme"
description: "About the tufte.hugo theme and its example site."
comments: false
---

This is the example site of **tufte.hugo**, a theme for the [Hugo](https://gohugo.io) static site generator by Massimo Nocentini. It is built on [Tufte CSS](https://github.com/edwardtufte/tufte-css), the stylesheet by Dave Liepmann and Edward Tufte that brings the conventions of Tufte's books to the web.{{< sidenote >}}Tufte CSS is distributed under the MIT license; the ET Book typeface, designed by Dmitry Krasny, Bonnie Scranton and Edward Tufte, is distributed under the MIT license as well.{{< /sidenote >}}

## What the theme does

The theme's only ambition is to produce the HTML that Tufte CSS was written for, from ordinary Markdown:

- each `h2` opens a new `section`, so paragraph widths and sidenotes line up;
- footnotes become numbered sidenotes in the right margin;
- shortcodes cover margin notes, figures in the margin or across the full page, epigraphs and attributed block quotes;
- math is rendered at build time with KaTeX, and code is highlighted by Hugo's Chroma, without any JavaScript.

On a narrow screen the margin disappears.{{< marginnote >}}Tap the &#8853; symbol, or a sidenote number, to show a note inline.{{< /marginnote >}} Notes and margin figures are then hidden behind small toggles that the reader can open one at a time.

## Credits

Tufte CSS was created by [Dave Liepmann](http://www.daveliepmann.com) and is now an Edward Tufte project. The site structure follows [Beautiful Hugo](https://github.com/halogenica/beautifulhugo). The theme itself is released under the MIT license.
