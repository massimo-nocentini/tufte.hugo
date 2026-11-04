---
# A tufte-book. Create it with:
#   hugo new content --kind book books/my-book
# then add chapters with:
#   hugo new content --kind chapter books/my-book/first-chapter.md
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
subtitle: ""
book: true                 # makes this section a book (tufte-book)
date: {{ .Date }}
draft: true
author: ""                 # a name, a list of names, or [{name: …, thanks: …}]
publisher: ""              # may contain Markdown; publisherPlain is the plain-text version
# publisherPlain: ""
# thanks: "Thanks to …"   # \thanks on the title: a sidenote on the title page
# halftitle: true          # print only: a half-title page before everything else
epigraphs: []              # opening epigraphs (\openepigraph):
#  - quote: "The quotation, in *Markdown*."
#    author: "Somebody"
#    work: "A Work"
copyrightPage:             # a Markdown string, or this map (all keys optional)
  year: ""                 # default: the year of `date`
  holder: ""               # default: the author
  publisher: ""            # default: publisherPlain or publisher
  url: ""
  license: ""              # Markdown
  # printing: ""           # default: "First printing, MONTH YEAR" from `date`; false removes it
dedication: ""             # Markdown
# frontispiece: {src: "", alt: "", caption: ""}
outputs: ["html", "rss", "print"] # "print" adds print.html (the whole book as one document); this list replaces the defaults, so keep "rss" for the book feed
# The body below (optional) is shown on the landing page, after the title
# page, the contents and the dedication.
tufte:
  style: latex             # "latex" | "css"; any other [params.tufte] key may be set here
  # book:
  #   numberChapters: false
  #   continuous: true
  #   toc: true
  #   tocDepth: 0
  #   titlepage: true
---
