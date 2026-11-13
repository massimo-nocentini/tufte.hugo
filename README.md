# tufte.hugo

A [Hugo](https://gohugo.io) theme built on [Tufte CSS](https://github.com/edwardtufte/tufte-css).
You write ordinary Markdown with a few shortcodes. The theme produces the markup Tufte CSS expects:
sidenotes, margin notes, margin and full-width figures, epigraphs, `<section>`-wrapped articles and
ET Book typography. It also includes the parts a blog needs: a paginated home page, archives, tags,
a table of contents, previous/next links, comments, server-side math, syntax highlighting, dark mode
and five languages.

It can also do at HTML level what the [Tufte-LaTeX](https://github.com/Tufte-LaTeX/tufte-latex) classes do in
TeX: numbered figures and tables with captions in the margin, citations in the margin with a bibliography,
cross-references, multi-chapter books with a title page, contents, lists of figures and tables and an index,
amsthm's theorems and proofs, and a print stylesheet with the LaTeX page geometry (see [tufte-latex parity](#tufte-latex-parity)).

The theme is organised like [Beautiful Hugo](https://github.com/halogenica/beautifulhugo) and uses the
Hugo template system introduced in 0.146 (`layouts/baseof.html`, `home.html`, `page.html`, `list.html`, plus
`layouts/_partials/`, `layouts/_shortcodes/` and `layouts/_markup/`).

- **Hugo**: the latest release (0.169.0 or newer; an older Hugo stops the build with an error). The standard edition is enough; the extended edition is not required.
- **License**: MIT (see [LICENSE](LICENSE)). Tufte CSS and ET Book are MIT as well (see [Credits](#credits)).

## Contents

- [Installation](#installation)
- [Required site configuration](#required-site-configuration)
- [Theme parameters](#theme-parameters)
- [Front matter](#front-matter)
- [Writing in the Tufte style](#writing-in-the-tufte-style)
- [Shortcodes](#shortcodes)
- [Render hooks](#render-hooks)
- [Footnotes and sidenotes](#footnotes-and-sidenotes)
- [Fonts](#fonts)
- [Math](#math) ([Euler and Libertinus math](#euler-and-libertinus-math))
- [tufte-latex parity](#tufte-latex-parity): [options](#options-paramstufte), [notes](#notes-in-the-margin),
  [floats](#floats-figures-tables-listings), [cross-references](#cross-references-and-labels),
  [theorems](#theorems-and-proofs), [bibliography](#bibliography), [books](#books), [index](#index), [printing](#printing-and-pdf),
  [warnings](#warnings), [LaTeX to Hugo cheat sheet](#latex-to-hugo-cheat-sheet)
- [Syntax highlighting](#syntax-highlighting)
- [Pages and layouts](#pages-and-layouts)
- [Search](#search)
- [Slides](#slides)
- [Comments, analytics and social links](#comments-analytics-and-social-links)
- [Customisation](#customisation)
- [Languages](#languages)
- [Example site](#example-site) ([deploying it to GitHub Pages](#deploying-the-example-site-to-github-pages))
- [Credits](#credits)

## Installation

### As a Git submodule

```sh
git submodule add https://github.com/massimo-nocentini/tufte.hugo.git themes/tufte.hugo
```

```toml
# hugo.toml
theme = "tufte.hugo"
```

To update it later, run `git submodule update --remote themes/tufte.hugo`.

### As a Hugo module

You need Go installed. Run this in your site:

```sh
hugo mod init github.com/USERNAME/SITENAME
```

```toml
# hugo.toml
[module]
  [[module.imports]]
    path = "github.com/massimo-nocentini/tufte.hugo"
```

```sh
hugo mod get -u github.com/massimo-nocentini/tufte.hugo
```

### By copying

You can also clone or download the repository into `themes/tufte.hugo` and set `theme = "tufte.hugo"`.

## Required site configuration

Hugo deep-merges `[params]` from a theme (site values win) and merges `[menus]` shallowly (a theme menu
is added only when the site does not define one; this theme defines none). `[markup]`, `[taxonomies]`,
`[pagination]` and `[services]` are **not** merged by default (a site can opt in with `_merge = "deep"`,
but the theme's `hugo.toml` ships no `[markup]` settings). The theme's render hooks depend on the
following Goldmark settings, so copy them into your **site** `hugo.toml`:

```toml
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = false            # not needed: every Tufte construct has a shortcode or render hook
    [markup.goldmark.parser]
      # REQUIRED. A stand-alone image is then passed to the image render hook as a block
      # (.IsBlock) and rendered as a <figure>, not as <p><img></p>.
      wrapStandAloneImageWithinParagraph = false
      autoHeadingID = true      # the default; KEEP IT: section numbers, xref names and the TOCs follow
                                # headings by their ids (a heading without one: warning tufte-heading-id)
      [markup.goldmark.parser.attribute]
        block = true            # REQUIRED for {.fullwidth} on tables, {cite="…" author="…"} on blockquotes
                                # and labels/captions on images, tables and equations ({#fig:x})
        title = true            # {#sec:x} labels on headings
    [markup.goldmark.extensions]
      # The footnote extension is on by default; the theme turns footnotes into sidenotes.
      # With footnote = false, [^x] stays literal text everywhere, in shortcodes' text too.
      [markup.goldmark.extensions.passthrough]
        enable = true           # REQUIRED for math
        [markup.goldmark.extensions.passthrough.delimiters]
          block = [['\[', '\]'], ['$$', '$$']]
          inline = [['\(', '\)'], ['$', '$']]
  [markup.highlight]
    noClasses = false           # use the theme's syntax.css (light and dark palettes)
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 3

[pagination]
  pagerSize = 5

[taxonomies]
  tag = "tags"
  category = "categories"

[[menus.main]]
  name = "Posts"
  pageRef = "/posts"
  weight = 10
[[menus.main]]
  name = "Tags"
  pageRef = "/tags"
  weight = 20
[[menus.main]]
  name = "Archives"
  pageRef = "/archives"
  weight = 30
```

`menu` and `menus` are equivalent spellings. The entries of the `main` menu are shown in the site header. The current page gets the `active` class.

## Theme parameters

The theme's `hugo.toml` sets every default listed below. Site values under `[params]` override them,
and nested tables are merged key by key. The on/off parameters (`etBook`, `showReadingTime`, `toc`,
`comments.enable`, `math.fleqn`…) also accept the strings `"true"`/`"false"` (and `"yes"`/`"no"`, `"1"`/`"0"`,
`"on"`/`"off"`), which is what a `HUGO_PARAMS_*` environment variable gives for a key your own `hugo.toml`
does not set (`HUGO_PARAMS_ETBOOK=false hugo`).

| Parameter | Default | Meaning |
|---|---|---|
| `subtitle` | `""` | Shown under the site title on the home page. |
| `description` | `""` | Last fallback for `<meta name="description">`. The page's front matter `description` comes first, then its `subtitle`, then (regular pages, book landings and part pages) the first 160 characters of its plain-text summary; this value is used only when all of them are empty, so mostly on the home page and the other list pages. |
| `dateFormat` | `""` | Go layout of the dates of the post metadata, summaries and title blocks (Hugo translates the month and day names). Empty: the language's i18n key `dateFormat`, which is `":date_long"` in all five theme languages: Hugo's localized long date (`March 5, 2024`, `5 marzo 2024`, `5. März 2024`, `5 de marzo de 2024`), so the order of day and month follows the language too. A language without the key (one the theme does not translate, such as `pt` or `ja`) gets the English value, `":date_long"` as well (`5 de março de 2024`, `2024年3月5日`). |
| `archiveDateFormat` | `""` | Go layout of the month and day in the archive and term lists. Empty: the language's i18n key `archiveDateFormat` (`"Jan 2"` in English, `"2 Jan"` in Italian, French and Spanish, `"2. Jan"` in German). Hugo has no localized month-and-day token, so a language the theme does not translate gets the English layout (`"Jan 2"`, month first; where the locale data of the Hugo release has no abbreviated month name, as Japanese, Korean and Arabic on Hugo 0.169, the full name takes its place: `"3月 5"`, the same for `Mon` in any date layout): set the key in your own `i18n/LANG.yaml`, or `archiveDateFormat` under `[languages.LANG.params]`. |
| `sections` | `"h2"` | `"h2"`: wrap the article in a new `<section>` at each `<h2>` that is not nested in another element (a quote, a list, a `div`, or any element of raw HTML, such as a `form` or a block link). `"none"`: put the whole article in one `<section>`. The booleans `false` and `true` read as `"none"` and `"h2"`, and so do the strings `"false"`/`"no"`/`"off"`/`"0"` and `"true"`/`"yes"`/`"on"`/`"1"` (a `HUGO_PARAMS_SECTIONS=false` environment variable reaches the theme as a string), and an empty value means `"h2"`; any other value warns (`tufte-bad-option`) and uses `"h2"`. Front matter `sections` overrides it. |
| `footnotes` | `"sidenotes"` | `"sidenotes"`: Markdown footnotes `[^x]` become numbered sidenotes (labels starting with `fn-` stay real footnotes). `"endnotes"` (alias `"footnotes"`): they are real footnotes, listed by the theme in a `<section class="footnotes">` below the text (labels starting with `sn-` become sidenotes). Front matter `footnotes` overrides it. See [Footnotes and sidenotes](#footnotes-and-sidenotes) for `footnotestyle` and `footnoteplacement`. |
| `etBook` | `true` | Load the bundled ET Book web fonts. With `false`, the fallback serif stack from Tufte CSS is used. |
| `font` | `"etbook"` | The text font: `"etbook"` (ET Book, Tufte's own), `"libertinus"` (Libertinus Serif, with Libertinus Sans and Mono) or `"source"` (Adobe's Source Serif 4, with Source Sans 3). Code is in Source Code Pro with every value but `"libertinus"`. Front matter `font` overrides it for one page; any other value prints the warning `tufte-bad-option` and is ignored. See [Fonts](#fonts). |
| `showReadingTime` | `true` | Show the reading time in the post metadata. |
| `showWordCount` | `false` | Show the word count in the post metadata. |
| `showPostNav` | `true` | Show previous and next post links at the end of posts. |
| `toc` | `false` | Show a table of contents. Front matter `toc` overrides it. |
| `readMore` | `true` | Show a "Read more" link under each summary that Hugo cut (`.Truncated`: a `<!--more-->` divider, or an automatic summary shorter than the page). |
| `homeIntro` | `true` | Render the content of `content/_index.md` above the post list on the home page. |
| `customCSS` | `[]` | Paths under your site's `assets/` (for example `["css/custom.css"]`). They are appended to the CSS bundle, so they win. A single string is accepted too, with several paths separated by commas (as `HUGO_PARAMS_CUSTOMCSS` gives it). |
| `copyright` | `""` | Footer text (Markdown; several paragraphs become lines of one). Default: Hugo's top-level `copyright` when the site sets it, else `© YEAR Author`. The RSS `<copyright>` is the top-level `copyright`, else this text as plain text. |
| `selfHosted` | `false` | `true`: download the third-party files (KaTeX, and Fuse.js for the [search](#search)) at build time, check them against their SRI hashes and serve them from your site instead of the CDN. See [Math](#math). |
| `mainSections` | Hugo default | Sections listed on the home page and archives. Set it with Hugo's **top-level** `mainSections` key (for example `mainSections = ["posts"]`, above `[params]`); when unset, Hugo computes it from the section with the most pages. The legacy `params.mainSections` is still honoured and wins when set. |

### `[params.author]`

| Key | Meaning |
|---|---|
| `name` | Default author for posts, the copyright line and metadata. |
| `email` | Author e-mail. Not shown on the pages, but **published in the RSS feeds**, as Hugo's own feed does: `<managingEditor>` and `<webMaster>` of every feed, and the `<author>` of each item whose page has no front-matter `author` (RSS 2.0 wants an address there). Leave it empty to keep it out of the feeds (items then credit the author with `<dc:creator>`). Use `params.social.email` for a visible link. |
| `url` | Author home page. |

A plain string, `[params] author = "Jane Doe"` (the form many other themes use), is accepted too and
counts as the `name`.

### `[params.social]`

Links shown in the footer. Leave a key empty to hide it. Besides the user name or handle, `github`, `gitlab`,
`bluesky`, `twitter`, `linkedin` and `orcid` accept a full profile URL: a value is taken as a URL only when it
starts with `http://` or `https://`, so a user name such as `httpie` still links to `https://github.com/httpie`. A leading `@` of a handle is dropped (`@jack` links to `https://x.com/jack`). The `twitter` value also
gives the `twitter:site` card of every page (`@jack`, also when it is written as a profile URL).

| Key | Value |
|---|---|
| `github` | user name (`https://github.com/<value>`) |
| `gitlab` | user name (`https://gitlab.com/<value>`) |
| `mastodon` | full profile URL (for example `https://mastodon.social/@me`) |
| `bluesky` | handle (`https://bsky.app/profile/<value>`) |
| `twitter` | user name (`https://x.com/<value>`) |
| `linkedin` | profile slug (`https://www.linkedin.com/in/<value>`) |
| `orcid` | ORCID iD (`https://orcid.org/<value>`) |
| `email` | address (`mailto:<value>`) |
| `rss` | `true` (default) shows a link to the site RSS feed |

### `[params.math]`

| Key | Default | Meaning |
|---|---|---|
| `enable` | `"auto"` | `"auto"`: load the KaTeX assets only on pages that contain math. `true`: load them on every page. `false`: never load them. |
| `engine` | `"server"` | `"server"`: typeset at build time with Hugo's `transform.ToMath` (no JavaScript). `"client"`: keep the TeX in the page and typeset it in the browser with `katex.min.js`. |
| `font` | `"katex"` | `"katex"`: KaTeX's own fonts and layout. `"euler"`: the formulas in Hermann Zapf's Euler, as LaTeX's `euler`/`eulervm` packages set them. `"libertinus"`: in Libertinus Math, the math font of the [Libertinus](#fonts) family. With `"euler"` and `"libertinus"` KaTeX writes MathML and the browser lays it out with the bundled font. Front matter `mathFont` overrides it for one page; any other value prints the warning `tufte-bad-option` and is ignored. See [Euler and Libertinus math](#euler-and-libertinus-math). |
| `macros` | `[]` | KaTeX macros for the whole site, merged with front matter `mathMacros` (the page wins). Write them as a list of pairs, `[["\\RR", "\\mathbb{R}"]]`: Hugo lowercases the keys of maps, so the map form `{ "\\RR" = "…" }` would define `\rr`. A list of `{ name = "\\RR", value = "\\mathbb{R}" }` tables works too. |
| `fleqn` | `false` | Set display math flush left (with a 2em indent). |
| `leqno` | `false` | Put equation numbers on the left, as LaTeX's `leqno`: both the theme's `\label` numbers and KaTeX's `\tag{…}`. |
| `errorColor` | `""` | Colour of invalid TeX. Empty: the theme's red, adapted to dark mode. |
| `strict` | `"error"` | KaTeX `strict` mode: `"error"`, `"ignore"` or `"warn"`. |
| `minRuleThickness` | `0.04` | Minimum thickness of fraction lines, in em: a number (`0.05`; `"0.05em"` works too). Any other value prints the warning `tufte-bad-option` and uses `0.04`. |
| `katexVersion` | `"auto"` | KaTeX version of the CDN files. `"auto"` (or empty) loads the release that Hugo embeds, 0.18.4 (see [Math](#math)). A version listed in `data/tufte/vendor.toml` uses the bundled hashes; any other version also needs `katexIntegrity` (CSS), `katexJSIntegrity` and `katexAutoRenderIntegrity` (client engine), or the build stops. The former default `"0.16.11"` counts as `"auto"`. |
| `katexCSS` | `""` | Optional: another URL for the KaTeX stylesheet, with `katexIntegrity` as its SRI hash. It is always loaded as a stylesheet, whatever its form (a query string, a fragment or no `.css` extension are fine). |

The short form `math = true` (or `false`, `"auto"`) directly under `[params]`, as in Hugo's own math guide,
also works: it is read as `[params.math] enable = …`, with every other key at its default. Any other value
for `params.math` prints the warning `tufte-bad-option` and uses the defaults.

### `[params.giscus]` and `[params.comments]`

| Key | Default | Meaning |
|---|---|---|
| `giscus.repo` | `""` | `owner/repo` that hosts the discussions. Giscus is enabled only when `repo`, `repoId`, `category` and `categoryId` are all set; with only some of them the build prints the warning `tufte-bad-option` and shows no giscus comments. |
| `giscus.repoId` | `""` | Repository id from <https://giscus.app>. |
| `giscus.category` | `""` | Discussion category name. |
| `giscus.categoryId` | `""` | Discussion category id. |
| `giscus.mapping` | `"pathname"` | How pages are mapped to discussions. |
| `giscus.theme` | `"preferred_color_scheme"` | Giscus colour theme. |
| `giscus.lang` | `""` | Giscus interface language (for example `"it"`). Empty: the site language. |
| `comments.enable` | `true` | Allow comments on pages inside a section (posts). Front matter `comments` overrides it; a page outside any section (such as `/about/`) needs `comments: true` in its front matter. |
| `comments` | — | Shorthand: `[params] comments = false` (or `true`, or `HUGO_PARAMS_COMMENTS=false`) is the same as `comments.enable`. Any other single value prints the warning `tufte-bad-option` and leaves comments on. |

### `[params.search]`

The site search; see [Search](#search) for the setup (it needs the home page's `searchindex` output).

| Key | Default | Meaning |
|---|---|---|
| `enable` | `false` | `true`: a search box in the site header on every page, and the results page (a page with `layout: search`) works. Without the `searchindex` output on the home page the build prints the warning `tufte-search-output` and shows no box. Also `HUGO_PARAMS_SEARCH_ENABLE=false`. |
| `sections` | `[]` | Page types (`.Type`: the top-level section, or front matter `type`) to index, for example `["posts", "books"]`; the entry `"mainSections"` stands for the site's main sections. Empty: every page. |
| `contentChars` | `0` | The most characters of text and notes indexed per page (headings are always kept). `0`: the whole page. Lower it to make the index of a large site smaller. |
| `maxResults` | `8` | How many matches show under the header box (1–999). The results page shows them all. |
| `threshold` | `0.3` | How fuzzy a match may be, from `0` (each word as typed) to `1` (anything matches): Fuse.js's `threshold`. |
| `hotkey` | `"/"` | The key that puts the cursor in the header box, when no input field has it. `""`: none. |

### Hugo services

| Setting | Effect |
|---|---|
| `[services.disqus] shortname = "…"` | Disqus comments via Hugo's embedded template. |
| `[services.googleAnalytics] id = "G-…"` | Google Analytics via Hugo's embedded template, in production builds only. |

A full example:

```toml
mainSections = ["posts"]

[params]
  subtitle = "Notes on mathematics and code"
  description = "A personal notebook."
  footnotes = "sidenotes"
  customCSS = ["css/custom.css"]
  [params.author]
    name = "Ada Lovelace"
    url = "https://example.org"
  [params.social]
    github = "ada"
    orcid = "0000-0002-1825-0097"
  [params.math]
    enable = "auto"
    engine = "server"
    macros = [["\\RR", "\\mathbb{R}"], ["\\abs", "\\left\\lvert #1 \\right\\rvert"]]
  [params.giscus]
    repo = "ada/blog"
    repoId = "R_xxx"
    category = "Comments"
    categoryId = "DIC_xxx"
```

## Front matter

| Key | Meaning |
|---|---|
| `title` | Page title, rendered as the article's `<h1>`, and the `<title>`, OpenGraph, Twitter, schema.org and RSS title. Hugo does not require one: a page, section, book, part or term without `title` (or with an empty one) is called by its `linkTitle`; else a term by the term, a section (book, part) by its directory name, humanized (`my-book` → “My Book”; also a top-level section without `_index.md`, which Hugo would call “My-Book”), and a regular page by the translated “Untitled” (i18n key `untitled`). That name is used in its h1, `<title>`, summaries, archive and term lists, navigation (and the book navigation's label), book contents and RSS item, so no heading or link is ever empty. The home page keeps Hugo's default, the site title. |
| `linkTitle` | Short title for links (Hugo's link title): summary titles, the archive and term lists, the previous/next post navigation and book navigation. Default: `title`. |
| `subtitle` | Rendered as `<p class="subtitle">` under the title. Also used as the meta description when `description` is empty. |
| `date` | Publication date. |
| `lastmod` | Last modification. Shown as "(updated on …)" after the date, in the post metadata line, when it falls on a later day than `date`. It is not shown when the page sets `dateText` (the free text replaces the whole date) or `showDate: false`, with `tufte.titleBlock = "latex"`, or in book chapters. |
| `author` | Author name for this page. Overrides `params.author.name` (also in the page's RSS item, as `<dc:creator>`). |
| `description` | Meta description and summary for social cards. When empty, the meta description falls back to `subtitle`, then (regular pages, book landings and part pages) the plain-text summary, then `params.description`. |
| `tags`, `categories` | Taxonomy terms. Both are listed in the post metadata (categories first, separated by commas; tags in small caps). |
| `toc` | `true`/`false`. Overrides `params.toc`. |
| `showReadingTime`, `showWordCount` | `true`/`false`. Override `params.showReadingTime` / `params.showWordCount` for this page. Both are part of the post metadata line, which `tufte.titleBlock = "latex"` and book chapters do not show. |
| `showPostNav` | `true`/`false`. Overrides `params.showPostNav` for this page. |
| `sections` | `"h2"`/`"none"` (or `true`/`false`, also as strings: `"yes"`/`"no"`, `"on"`/`"off"`, `"1"`/`"0"`). Overrides `params.sections`. |
| `footnotes` | `"sidenotes"`/`"endnotes"`. Overrides `params.footnotes`. |
| `math` | `true` always loads the KaTeX assets on this page (with the client engine, this also makes KaTeX scan the article for `$…$`, `$$…$$`, `\(…\)`, `\[…\]` when the passthrough extension is off). `false` never loads them, even if the page contains math. The strings `"true"`/`"false"` (also `yes`/`no`, `on`/`off`, `1`/`0`) work the same; `"auto"` keeps the detection. |
| `font` | `"etbook"`, `"libertinus"` or `"source"`: the text font of this page, over `params.font` (see [Fonts](#fonts)). On a book's root it sets the whole book. |
| `mathFont` | `"katex"`, `"euler"` or `"libertinus"`: the math font of this page, over `params.math.font` (see [Euler and Libertinus math](#euler-and-libertinus-math)). |
| `mathMacros` | KaTeX macros for this page, added to `params.math.macros` (same list-of-pairs form), e.g. `mathMacros: [["\\E", "\\mathbb{E}"]]` in YAML. |
| `comments` | `true`/`false`. Overrides `params.comments.enable`. `true` is needed on pages outside any section (such as `content/about.md`), which have no comments otherwise. |
| `draft` | Hugo's standard draft flag. |
| `images` | Images for Open Graph and Twitter cards: page resources, absolute URLs, or paths under the site root (`/images/card.png`, resolved against the base path also on a site hosted under a subpath). A page without `images` uses the site-wide `params.images`, resolved the same way. |
| `layout` | Set `layout: archive` on a page to render the archives (posts grouped by year; undated pages, such as book chapters, last under “Undated”, in the order of the RSS feed: each book's chapters in its reading order, then the other undated pages), or `layout: search` for the search results page (see [Search](#search)). |
| `searchHidden` | `true` keeps the page out of the search index (see [Search](#search)). |
| `outputs` | Hugo's output formats of the page. `["html", "slides"]` also makes the page a reveal.js deck, `slides.html` (see [Slides](#slides)); `["html", "rss", "print"]` on a book gives its `print.html` (see [Books](#books)). |
| `slides` | reveal.js options for this page's slides, over `params.slides`, key by key (see [Slides](#slides)). |

Create a post with the bundled archetype:

```sh
hugo new content posts/my-first-post.md
```

## Writing in the Tufte style

Some Tufte CSS conventions are produced automatically:

- **Sections.** Tufte CSS limits paragraph width only for direct children of `<section>`. With
  `sections = "h2"`, the theme starts a new `<section>` at each `## Heading`. Content before the first
  `##` gets a section of its own. Empty sections are never emitted.
- **Article header.** The page title becomes `<h1>`, front matter `subtitle` becomes `<p class="subtitle">`,
  and the date, author, reading time and tags appear in a small sans-serif line under them.
- **Headings keep to the text column.** The title, the subtitle and every heading (`#` to `######`, the
  summary titles of list pages) are at most as wide as the paragraphs, as tufte-latex sets `\section`,
  `\subsection` and the handout's title in the text block: a long one wraps there instead of running over the
  margin column, and its notes (a heading's sidenote, a `thanks` note on the title) land in the margin column
  as a paragraph's do. On paper too; on phones everything is one column. The titles tufte-book sets full width
  stay so: a book's chapter and part titles and its title page.
- **Tables** are wrapped in `<div class="table-wrapper">` so they scroll on small screens.
- **Note ids.** Every sidenote, margin note, margin figure and figure caption made by a shortcode or a render
  hook gets a unique id (`<hash of the page URL>-<n>`, from a per-page counter, e.g. `sn-1a2b3c-4`). A Markdown
  footnote turned into a sidenote gets a deterministic id built from Goldmark's reference id
  (`sn-<hash>-fnref-<n>`, e.g. `sn-1a2b3c-fnref-2`), and a real footnote gets `fn-<hash>-<key>` and
  `fnref-<hash>-<key>` (the key is the Markdown label, or `s<n>` for the `footnote` shortcode; a second
  reference to the same footnote gets `fnref2-<hash>-<key>`, a third `fnref3-…`). A `footnotemark` and its
  `footnotetext` share a name-based id, `sn-<hash>-ft-<name>` (e.g. `sn-1a2b3c-ft-fm`), so that the mark's
  label points at the text's checkbox; a name with characters other than letters, digits, `-` and `_` has them
  replaced by `-` and gets the first 6 hex digits of the name's md5 appended (`"x.y"` → `ft-x-y-b2d4cd`), and a
  later `footnotetext` of the same name gets `.2`, `.3`… (`sn-1a2b3c-ft-fm.2`). The hash comes from the page URL,
  so ids do not collide on list pages that show several summaries.

Everything else is done with the shortcodes and Markdown features below.

## Shortcodes

There are two kinds of shortcodes:

- **Inline** (`sidenote`, `marginnote`, `newthought`, `sans`) are used **inside a paragraph**, with the
  `{{< name >}}…{{< /name >}}` form. Their inner text is rendered as *inline* Markdown (emphasis, links,
  code and inline math work; paragraph breaks become line breaks). A note is a `<span>`, so a list, code
  block, quote or table in it is turned into inline blocks laid out like the original, and the warning
  `tufte-block-in-note` suggests `marginblock` or a real footnote instead. A line that only *starts* like a
  block is text, as in `\sidenote{1984. …}`: a lone list marker (`1984. The year`, `- said she`), a heading
  marker or a rule (`* * *`, `---`) keeps its characters; two or more items of the same kind are a list.
  Captions (`caption=`, an image title, `{… caption="…"}`), `author=`/`cite=` and `verse` lines are always
  literal: no list, quote or code block starts in them. A float shortcode nested in a
  note (`figure`, `fig`, `fullwidthfigure`, `table`, `listing`, `subfigures`, `iframe`, `youtube`, `video`,
  or a block shortcode such as `epigraph`) cannot float there either (tufte-latex: “Float(s) lost”): a
  figure becomes its plain image followed by its caption as text, unnumbered (an `xref` to its label
  finds nothing), and the others become inline blocks whose caption is a plain line above them (not a margin
  note, so no `tufte-note-in-note`), with the same warning (a generated list too:
  `listoffigures`, `bibliography`, `printindex` or `tableofcontents` in a note is shown there as inline blocks).
- **Block** (`epigraph`, `blockquote`, `fullwidth`, `details`, `notes`) are placed **on their own lines**. Their inner text is
  rendered as *block* Markdown, so it can contain several paragraphs.

Call every theme shortcode with the `{{< >}}` delimiters, never with `{{% %}}`: the theme renders the inner
Markdown itself, and with `{{% %}}` Hugo passes the shortcode's HTML back to Goldmark, which drops it
(`<!-- raw HTML omitted -->`) when `unsafe = false`.

Shortcodes can be nested with the `{{< >}}` form, e.g. a `sidenote` inside a `blockquote`, or a `figure`
inside `fullwidth`. The HTML of the nested shortcode is kept as is and the Markdown around it is still
rendered, also with `markup.goldmark.renderer.unsafe = false`. HTML tags written by hand in the inner text
follow the site's Goldmark setting: with `unsafe = false` they are dropped (warning `tufte-raw-html`), as in
the body. A third-party shortcode that prints HTML inside a theme shortcode needs `[params.tufte]
innerHTML = true`, which keeps every balanced run of tags in inner texts (only for trusted content); in a
sidenote, margin note or caption, block elements in such a run (the `<div>` and `<pre>` of `highlight`) become
inline blocks, as Markdown blocks there do (warning `tufte-block-in-note`).
Escaped shortcodes (written with Hugo's `/* … */` escape) in inner texts print as text, as in the body. A Markdown
footnote referenced in a shortcode's inner text (a caption, a note, a table cell, a `subfigures` image title,
a quote's `author`, `cite` or `footer`: `[^x]`) becomes a real footnote of the page, listed below the text,
whether its `[^x]:` definition is written inside the inner text or elsewhere on the page (also in a block
quote or a list item, `> [^x]: …`, `- [^x]: …`; it is copied whole, code blocks included, and stays block
content in the list even when the inner text is a note or caption; a cite in it gives the footnote's citation
block). A `[^x]` with no definition prints the warning `tufte-undefined-ref`. A margin
note or caption cannot hold a sidenote, so such a footnote stays a real footnote whatever the `footnotes`
mode, and so do its references in the text: a footnote referenced both in the text and in a shortcode's inner
text (or in the front-matter `abstract` or `thanks`) is one real footnote, with one mark and one item that has
a backlink to each reference, never a sidenote plus a footnote with the same text. A footnote *defined* inside
the `abstract`, or inside one `thanks` text (of the title or of an author), belongs to that field only, as in a
book's dedication (see Books): `abstract: "Text[^1]\n\n[^1]: …"` next to a body `[^1]: …` gives two notes, and
neither definition is lost; a `[^x]` that the field references without defining it is the body's `[^x]`.
A site's own shortcode that renders Markdown with footnotes itself (`.Page.RenderString`, `markdownify`)
gets its own footnotes too: Goldmark numbers them from 1 like the page's, but each one keeps its own text and
id (a sidenote, or a real footnote by `footnotes` mode; such a note has no Markdown label, so a `fn-`/`sn-`
prefix there is not read), and Goldmark's list goes.

A shortcode may sit inside a Markdown blockquote, with every line of it, closing tag included, quoted
(`> {{< marginblock >}}`, `> Text.`, `> {{< /marginblock >}}`): the quote markers belong to the enclosing
quote and are removed from the inner text. A quote written *inside* a block shortcode (its closing tag on
an unquoted line of its own) stays a quote.

A block shortcode may also be indented where Markdown needs it: in the continuation of a list item, or in a
`[^fn-…]` footnote with more than one paragraph (4 spaces). Every theme shortcode reads its inner text with
Hugo's `.InnerDeindent`, so the indentation of the opening tag is removed from each of its lines: the
paragraphs, lists, tables and fenced code inside it read as if they started at the left margin. Indent the
opening tag, the inner lines and the closing tag alike. A listing or table that ends a real footnote is
followed by the footnote's back-link in a paragraph of its own.

Keep an inline shortcode on the same line as the word it annotates. A line break before it inserts a
space before the note number.

**One-line form.** For a short text, the four inline shortcodes also accept the text as their only
positional parameter, or as the named parameter `text`, in a self-closing call (no closing tag):

```markdown
A short aside.{{< sidenote "Written on one line." />}} Another.{{< marginnote text="Also one line." />}}
{{< newthought "Small capitals" />}} open a thought; {{< sans "Gill Sans" />}} changes the face.
```

Never mix positional and named parameters in one call: `{{< sidenote "text" offset="1bl" />}}` is an error;
write `{{< sidenote text="text" offset="1bl" />}}`.

### `sidenote`

A numbered note in the margin. On narrow screens it can be toggled by tapping its number.

```markdown
Tufte CSS uses sidenotes{{< sidenote >}}This is a sidenote with *emphasis* and a [link](https://edwardtufte.github.io/tufte-css/).{{< /sidenote >}} instead of footnotes.
```

Output:

```html
<label for="sn-1a2b3c-1" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-1a2b3c-1" class="margin-toggle"/><span class="sidenote">This is a sidenote …</span>
```

Named parameters: `text` (instead of the inner text), `number` (a custom mark that does not step the
counter), `offset` (move the note up or down), `label` (for `xref`) and `cite` (references appended to the
note); see [Notes in the margin](#notes-in-the-margin).

Markdown footnotes (`[^1]`) become sidenotes automatically. See [Footnotes and sidenotes](#footnotes-and-sidenotes), which also explains real footnotes on the same page.

### `marginnote`

Like a sidenote, but without a number. On narrow screens it is toggled by a ⊕ symbol.

```markdown
This sentence has a margin note.{{< marginnote >}}A margin note is not numbered.{{< /marginnote >}}
```

Named parameters: `text`, `offset` and `cite`, as for `sidenote`.

### `newthought`

Small caps for the first words of a new section or thought.

```markdown
{{< newthought >}}In his later books{{< /newthought >}}, Tufte starts each section with a bit of vertical space.
```

Output: `<span class="newthought">In his later books</span>`.

### `sans`

Sans-serif text.

```markdown
Tufte CSS also defines a {{< sans >}}sans-serif style{{< /sans >}} for occasional use.
```

Output: `<span class="sans">sans-serif style</span>`.

### `epigraph`

An opening quotation. The shortcode has two forms.

**Form 1: one quote.** The inner text is the quote itself (block Markdown), and the attribution comes
from parameters. All parameters are optional:

| Parameter | Meaning |
|---|---|
| `author` | Attribution (inline Markdown). |
| `cite` | Title of the work, rendered in `<cite>` after the author. `work` is an alias (the key used by a book's `epigraphs:` list). |
| `url` | Source URL. It becomes the `cite` attribute of the `<blockquote>` and links the footer. |
| `footer` | Complete footer text (inline Markdown). It replaces `author` and `cite`. |
| `class` | Extra classes for the `<div class="epigraph">`. |
| `style` | `"open"`: the book's opening-epigraph look (`\openepigraph`: sans-serif capitals, class `open-epigraph`). |

```markdown
{{< epigraph author="George Orwell" cite="Politics and the English Language" >}}
The English language becomes ugly and inaccurate because our thoughts are foolish,
but the slovenliness of our language makes it easier for us to have foolish thoughts.
{{< /epigraph >}}
```

Output:

```html
<div class="epigraph"><blockquote><p>…</p><footer>George Orwell, <cite>Politics and the English Language</cite></footer></blockquote></div>
```

**Form 2: several quotes.** When the inner text starts with `>` (Markdown block quotes) or renders to a
`<blockquote>` (for example nested `blockquote` shortcodes), the content is placed in the
`<div class="epigraph">` as is. Each quote carries its own source as a block attribute line right after
it (`{author="…" cite="…" url="…"}` or `{footer="…"}`, handled by the
[blockquote render hook](#blockquotes-and-alerts-render-blockquotehtml); it needs
`markup.goldmark.parser.attribute.block = true`). This is how the showcase post renders Tufte's three
epigraphs:

```markdown
{{< epigraph >}}
> The English language . . . becomes ugly and inaccurate because our thoughts are foolish, but the slovenliness of our language makes it easier for us to have foolish thoughts.
{author="George Orwell, “Politics and the English Language”"}

> For a successful technology, reality must take precedence over public relations, for Nature cannot be fooled.
{author="Richard P. Feynman" cite="“What Do You Care What Other People Think?”"}

> I do not paint things, I paint only the differences between things.
{footer="Henri Matisse, *Henri Matisse Dessins: thèmes et variations* (Paris, 1943), 37"}
{{< /epigraph >}}
```

In form 2 the `author`, `cite`, `url` and `footer` parameters of the shortcode are **ignored** (Hugo
prints the warning `tufte-bad-option` when you set them): put the attribution in the attribute line of each quote.
`class` and `style` apply to both forms. So `{{< epigraph author="X" >}}` around a `> quote` does not attribute
the quote; write the quote without `>` (form 1) or add `{author="X"}` under it (form 2).

### `blockquote`

A block quotation with an attribution footer. It takes the same parameters as `epigraph` (`author`, `cite`,
`url`, `footer`), and `class` adds classes to the `<blockquote>` itself.

```markdown
{{< blockquote author="Friedrich Nietzsche" cite="Twilight of the Idols" >}}
It is my ambition to say in ten sentences what others say in a whole book.
{{< /blockquote >}}
```

Output: `<blockquote><p>…</p><footer>Friedrich Nietzsche, <cite>Twilight of the Idols</cite></footer></blockquote>`.

You can also attribute a plain Markdown blockquote with block attributes. See [render-blockquote](#blockquotes-and-alerts-render-blockquotehtml).

### `figure`

Replaces Hugo's built-in `figure` shortcode and renders all three Tufte figure styles.

| Parameter | Meaning |
|---|---|
| `src` | Image path. It is looked up as a page resource (page bundle), then as a global resource in `assets/`, and otherwise used as a URL (for example a file in `static/`). As in Hugo's own image hook, a percent-encoded name (`my%20pic.png`) and a `?query` or `#fragment` (kept on the resource's URL) find the resource too; the same holds for Markdown images and the `video` sources. |
| `alt` | Alternative text. |
| `caption` | Caption (inline Markdown). For `main`, it is a margin note next to the image. For `fullwidth`, it is a `<figcaption>`. For `margin`, it is placed under the image in the margin. |
| `type` | `main` (default), `margin` or `fullwidth`. |
| `link` | Wrap the image in a link to this URL. |
| `target`, `rel` | The `target` and `rel` attributes of that link (`target="_blank" rel="noopener"`), as in Hugo's built-in `figure`. |
| `loading` | `lazy` (default) or `eager`, the `<img loading>` attribute: `eager` for an image at the top of the page. A Markdown image takes it as an attribute (`{loading="eager"}`). |
| `width`, `height` | `<img>` dimensions. Raster images from page or global resources get their intrinsic size by default (none when Hugo cannot decode the file, e.g. a JPEG saved as `.png`). |
| `title` | Shown in bold before the caption. It is not emitted as an `<img title>` attribute. |
| `attr` | Attribution text, appended to the caption. |
| `attrlink` | URL that the `attr` text links to. |
| `class` | Extra classes for the `<figure>` (for `margin`, for the wrapping `<p>`, or for the `<span class="marginnote">` when `inline="true"`). |
| `inline` | `"true"` (only for `type="margin"`): leave out the wrapping `<p>`, so that the margin figure can be placed inside a paragraph. |
| `label`, `short`, `numbered`, `captionpos`, `offset`, `cite` | Numbering, cross-references, caption position and citations, as in LaTeX: see [Floats](#floats-figures-tables-listings). |

```markdown
{{< figure src="exports-imports.png" alt="Exports and imports chart"
    caption="From Edward Tufte, *Visual Display of Quantitative Information*, page 92." >}}

{{< figure type="fullwidth" src="napoleons-march.png" alt="Napoleon's march"
    caption="Figurative map of the successive losses of the French Army in the Russian campaign, 1812–1813." >}}
```

A main figure with a caption produces (on a page without numbered floats, see `floats.number`):

```html
<figure class="tufte-figure" id="auto-1a2b3c-2"><label for="mn-1a2b3c-2" class="margin-toggle">&#8853;</label><input type="checkbox" id="mn-1a2b3c-2" class="margin-toggle"/><span class="marginnote caption"><span class="caption-text">From Edward Tufte, …</span></span><img src="…" alt="…" width="…" height="…" loading="lazy"/></figure>
```

When floats are numbered, the caption starts with `<span class="caption-label">Figure&nbsp;3:</span>`, and a
`label` gives the figure that id instead of `auto-…` (see [Floats](#floats-figures-tables-listings)). A figure
without a caption is just `<figure class="tufte-figure"><img …/></figure>`.

### `marginfigure`

The same as `figure` with `type="margin"`: the image is placed in the margin as a margin note. It takes the
same parameters as `figure`, except `type`.

By default it is a block: put it in a paragraph of its own, with a **blank line** before and after it,
just before the paragraph it accompanies. It is then wrapped in its own `<p>`. Do not put it on the line
right before the text with no blank line in between: Markdown would join both into one paragraph, and the
nested `<p>` breaks the paragraph apart (use `inline="true"` for that, see below).

```markdown
{{< marginfigure src="rhino.png" alt="Image of a Rhinoceros"
    caption="F.J. Cole, “The History of Albrecht Dürer’s Rhinoceros in Zoological Literature,” *Science, Medicine, and History: Essays on the Evolution of Scientific Thought and Medical Practice* (London, 1953), ed. E. Ashworth Underwood, 337-356. From page 71 of Edward Tufte’s *Visual Explanations*." >}}
```

To place it **inside a paragraph**, add `inline="true"`. This leaves out the wrapping `<p>`. Without it,
the browser would split the paragraph around a nested `<p>`. The Tufte CSS demo puts it at the start of the
paragraph, on the same line as the text:

```markdown
{{< marginfigure inline="true" src="rhino.png" alt="A rhinoceros" caption="Dürer’s rhinoceros." >}} But tight integration of graphics with text …
```

or anywhere inside a sentence:

```markdown
The rhinoceros{{< marginfigure inline="true" src="rhino.png" alt="A rhinoceros" caption="Dürer’s rhinoceros." >}} was drawn from a description.
```

### `fullwidthfigure`

The same as `figure` with `type="fullwidth"`: `<figure class="fullwidth">` with a `<figcaption>`.

```markdown
{{< fullwidthfigure src="napoleons-march.png" alt="Napoleon's march" caption="Charles Joseph Minard, 1869." >}}
```

### `fullwidth`

A block that spans the full width of the page instead of the 55% text column. Use it for wide tables,
code or prose. Its only parameter, the named `class`, adds classes to the `<div class="fullwidth">`
(`{{< fullwidth class="justify" >}}`). A sidenote, margin note or citation in its paragraphs, lists or
definitions stays in the margin column, and the wide text wraps around it (LaTeX would overprint it).

```markdown
{{< fullwidth >}}
| Year | Exports | Imports |
|-----:|--------:|--------:|
| 1700 | 400     | 300     |
| 1780 | 1,400   | 900     |
{{< /fullwidth >}}
```

### `iframe`

Embeds a responsive iframe inside `<figure class="iframe-wrapper">`.

| Parameter | Meaning |
|---|---|
| `src` | URL to embed (required). It can also be given as the first positional parameter. |
| `title` | Accessible title of the iframe (default: the translated "Embedded content", i18n key `embeddedContent`). |
| `ratio` | Aspect ratio, for example `16/9` (default), `4:3` or `4x3`. |
| `allow` | Value of the iframe's `allow` attribute. |
| `class` | Extra classes for the `<figure>`. |

```markdown
{{< iframe src="https://player.vimeo.com/video/76979871" title="The New Vimeo Player" ratio="16/9" >}}
```

### `youtube`

Embeds a YouTube video through the privacy-enhanced `youtube-nocookie.com` domain, inside
`<figure class="iframe-wrapper">`. It replaces Hugo's built-in `youtube` shortcode and takes the same
parameters, with the same defaults and the same
[player parameters](https://developers.google.com/youtube/player_parameters) in the URL, except `loading`
(lazy here). The video id can be positional or named. The other parameters need the named form; their names
are case-insensitive (`allowFullScreen` or `allowfullscreen`). Booleans are `true`/`false`, `1`/`0` or
`yes`/`no`, quoted or not. An invalid value, an unknown parameter or an id that is not a YouTube id (such as a
URL) prints the warning `tufte-bad-option`, and an invalid value falls back to the default. Only the player
parameters that differ from YouTube's defaults are written in the URL. As with Hugo's shortcode,
`[privacy.youtube] disable = true` in the site configuration removes every embed (and skips every check, so
old embeds never fail a `--panicOnWarning` build); the host is always
`youtube-nocookie.com`, whatever `privacy.youtube.privacyEnhanced` says.

| Parameter | Meaning |
|---|---|
| `id` | Video id (required). |
| `title` | Accessible title of the iframe (default: the translated "YouTube video", i18n key `youtubeVideo`). |
| `start`, `end` | Start and end time, in whole seconds (at most 9 digits); `end` must be after `start`. |
| `autoplay` | Play when the page loads (default `false`). It also mutes the video, as browsers require. |
| `mute` | Start muted (default `false`). |
| `loop` | Repeat the video (default `false`); `start` and `end` apply to the first play only. |
| `controls` | Player controls (default `true`); `controls=false` hides them. |
| `allowFullScreen` | Allow full-screen mode (default `true`). |
| `loading` | The iframe's `loading` attribute: `lazy` (default; Hugo's own default is `eager`) or `eager`. |
| `class` | Extra classes for the `<figure>`. |

```markdown
{{< youtube YE7VzlLtp-4 >}}

{{< youtube id="YE7VzlLtp-4" title="Edward Tufte" start="30" end="90" controls=false >}}
```

### `video`

A self-hosted video as a Tufte figure: in the text column with its caption as a margin note, or full width
with a `<figcaption class="caption-margin">` (as a full-width image: in the margin column under the video on wide
screens and in print). `src` and `poster` resolve like figure sources (page resource, `assets/` resource,
`static/` path, URL); a resource also gives the `<source>` its MIME type. A `data:` URI is accepted for an
image `poster` (`data:image/…`) and a video or audio `src` (`data:video/…`, `data:audio/…`, whose MIME type
becomes the `<source>` type); any other scheme than `http`, `https` and `mailto` is replaced by `#ZgotmplZ`.

| Parameter | Meaning |
|---|---|
| `src` | Video file (required). |
| `poster` | Image shown before playback. |
| `caption` | Caption, inline Markdown; a shortcode in it behaves as in a figure's `caption=` (a `cite` joins one citation block after the caption). |
| `title` | Accessible label of the video (default: the caption as plain text, without its notes, citations, footnote text and the MathML copy of its math, as a figure's alt text). |
| `type` | `main` (default) or `fullwidth`. |
| `controls` | Player controls, on by default; `controls="false"` hides them. |
| `autoplay`, `loop`, `muted`, `playsinline` | `"true"` to enable. `autoplay` implies `muted` and `playsinline`. |
| `width`, `height` | Attributes of the `<video>`. |
| `class` | Extra classes for the `<figure>`. |

```markdown
{{< video src="flow.mp4" poster="flow.jpg" caption="Water flow, *slowed down*." >}}

{{< video src="/media/loop.webm" type="fullwidth" autoplay="true" loop="true" >}}
```

### `details`

A collapsible block. The theme replaces Hugo's built-in [`details`](https://gohugo.io/shortcodes/details/)
shortcode with its own version. The parameters and the `<details><summary>…</summary>…</details>` output are
the same. The inner text is block Markdown and is rendered like the inner text of `blockquote`, `epigraph`
and `fullwidth`: nested theme shortcodes are kept, and a Markdown footnote `[^x]` in it becomes a real
footnote of the page (see [Shortcodes](#shortcodes)). With Hugo's version, `[^x]` printed as literal text.
The theme keeps the `<details>` element in the text column and sets its summary in the sans face. Its lists
(like those of an alert) are indented 5% of the block, so that the notes of their items and definitions reach
the margin column, on screen and on paper. Use the
`{{< >}}` form: with `{{% %}}` and `unsafe = false`, Goldmark drops the element.

Numbered sidenotes inside the block count in the page's numbering, whether the block is open or closed. A
browser does not render the content of a closed `<details>`, so its sidenote marks do not step the CSS
counter. After a block whose content holds N numbered marks, the theme therefore emits
`<span class="sn-skip-details" aria-hidden="true" style="--sn-skip: N"></span>`. This span steps the counter
N times only while the block is closed (`details:not([open]) + .sn-skip-details`), so the marks after the
block keep the numbers that `xref` prints. Marks in the `summary` are always visible and are not counted, nor
are marks in the text of a real footnote referenced inside the block (that text is listed after the section,
outside the block). The same applies to a `<details>` written as raw HTML.

| Parameter | Meaning |
|---|---|
| `summary` | Text of the `<summary>`, inline Markdown (default: the translated “Details”, i18n key `details`). |
| `open` | `true` shows the content initially (default `false`). |
| `class` | `class` attribute of the `<details>`. |
| `name` | `name` attribute: of the `<details>` elements with the same name, only one is open at a time. |
| `title` | `title` attribute of the `<details>`. |

```markdown
{{< details summary="Why sidenotes?" >}}
Because the eye never leaves the sentence.[^eye]
{{< /details >}}

[^eye]: The definition may be anywhere on the page.
```

### `notes`

Speaker notes for the [slides](#slides) of a page. The inner text is block Markdown, rendered like the inner
text of `details`; the output is `<aside class="notes">…</aside>`. reveal.js shows the notes of a slide in its
speaker view (the **s** key) and hides them on the slide; the article hides them too (`theme.css`), and the
search index leaves them out.

```markdown
## The cholera map

{{< notes >}}
Point at the Broad Street pump before showing the deaths.
{{< /notes >}}
```

## Render hooks

Plain Markdown is rendered into Tufte markup by the hooks in `layouts/_markup/`.

### Images (`render-image.html`)

| Markdown | Output |
|---|---|
| Image inside a paragraph | a plain `<img loading="lazy">` |
| Image alone on its line, with a title | `<figure>` with the title as a margin-note caption |
| Image alone on its line, without a title | `<figure><img></figure>` |
| Image in a table cell (even alone in it) | a plain `<img>`, its title as tooltip: never a figure, no number. The tooltip is plain text (math as its TeX source, `$x^2$`; a cross-reference as its number); a sidenote, `cite` or `[^x]` in the title cannot sit in an attribute, so it follows the image in the cell (a `[^x]` stays a footnote of the page). The same holds for a shortcode in the title of an image inside a paragraph, also inside a shortcode's inner text (`blockquote`, `epigraph`, `details`, a `table` cell) |
| Linked image alone on its line, `[![alt](src "Caption")](url)` | the same figure, with the link around the `<img>` only |
| Markup in the alt text, `![A *chart* of $x^2$[^src]](src)` | the alt text is plain text: emphasis dropped, math as its TeX source (`$x^2$`), a cross-reference as its number. A shortcode (`sidenote`, `cite`…) or a footnote `[^x]` in it cannot sit in the attribute: its note, citation or footnote mark follows the image (in a margin figure its text stays inline, as in a caption), and a `[^x]` stays a footnote of the page |

```markdown
![Exports and imports of Scotland](exports-imports.png "From Edward Tufte, *Visual Display of Quantitative Information*, page 92.")
```

An image counts as a block only when the site sets
`markup.goldmark.parser.wrapStandAloneImageWithinParagraph = false` (see
[Required site configuration](#required-site-configuration)). Without it, every image is inline.

A linked image alone on its line (`[![alt](src "Caption")](url)`) is a figure too: the link goes around the
image inside the figure, and the paragraph around it is dropped (a `<figure>` may not sit inside a `<p>` or
an `<a>`). A linked image with a title that shares its line with text becomes a linked plain image followed
by its caption. Attributes on the next line apply to the link's paragraph, not to the image: its id
(`{#fig:x}`) becomes the figure's label, as for an unlinked image, but a class is dropped with the paragraph,
so a linked image is always a main figure: for a linked margin or full-width figure use the `marginfigure` or
`fullwidthfigure` shortcode with `link="…"`.

A block image can also be a full-width or margin figure. Put a class attribute on the line after it (this
requires `parser.attribute.block = true`). Other attributes, such as `{width=300}`, are passed to the
`<img>`:

```markdown
![Napoleon's march](napoleons-march.png "Charles Joseph Minard, 1869.")
{.fullwidth}

![A rhinoceros](rhino.png "Dürer’s rhinoceros.")
{.margin}
```

`{.fullwidth}` gives `<figure class="fullwidth">` with a `<figcaption>`. `{.margin}` (or its aliases
`{.marginfigure}` and `{.marginnote}`) puts the image and its caption in the margin, like the `marginfigure`
shortcode. Other classes go on the `<figure>`. The LaTeX-like float options work as attributes too:

| Attribute | Meaning |
|---|---|
| `#fig:x` (id) | The label, for `xref`; it numbers the figure ([Floats](#floats-figures-tables-listings)). |
| `short` | Short caption for the list of figures. |
| `offset` | Moves the caption, e.g. `offset="1bl"` (one baseline down) or `offset="-1rem"`; on a margin image it moves the whole figure. |
| `captionpos` | `"bottom"` aligns the caption with the bottom of the image. Main and full-width images only: on a margin image it prints the warning `tufte-bad-option`. |
| `cite` | Citation keys (`cite="tufte2001,tufte2006"`) whose references are appended to the caption. |
| `numbered` | `numbered=false`: no number for this figure. |

```markdown
![A helix](helix.svg "The helix $x = \cos(2\pi z)$.")
{#fig:helix .margin offset="1bl" cite="tufte2001"}
```

The shortcodes offer more options (`attr`, `link`, `inline`).

Inside a sidenote, a margin note, a figure caption, a `footnote` shortcode or a Markdown footnote turned
sidenote, an image is always rendered as a plain inline `<img>`, even when it is alone (a `<figure>` cannot
sit in the note's `<span>`); its title, if any, follows it as text. A Markdown footnote that stays a real
footnote (`[^fn-…]`) is block content in the footnote list: an image alone in its own paragraph there is a
figure, numbered with the others in the order the page shows it (see “Footnotes and sidenotes”).
For an image in the margin, use the `marginfigure` shortcode, or put the image in a
`marginnote`:

```markdown
Text.{{< marginnote >}}![A rhinoceros](rhino.png) Dürer’s rhinoceros.{{< /marginnote >}} More text.
```

### Tables (`render-table.html`)

Each table is wrapped in `<div class="table-wrapper">`, and column alignment is kept. Add `{.fullwidth}`
on the line after the table to span the page (this requires `parser.attribute.block = true`):

```markdown
| Name | Value |
|:-----|------:|
| a    | 1     |
{.fullwidth}
```

With a `caption` or an id, a Markdown table becomes a numbered table float, rendered exactly like the
`table` shortcode ([Floats](#floats-figures-tables-listings)). The attributes are:

| Attribute | Meaning |
|---|---|
| `#tab:x` (id) | The label, for `xref`. Without a `caption`, the table is labelled but not numbered. |
| `caption` | The caption, inline Markdown; it numbers the table. |
| `short` | Short caption for the list of tables. |
| `offset` | Moves the caption, e.g. `offset="1bl"`. |
| `captionpos` | `"bottom"` aligns the caption with the bottom of the table. |
| `cite` | Citation keys whose references are appended to the caption. |
| `numbered` | `numbered=false`: no number for this table (and no entry in the list of tables). |
| `.fullwidth` | The table spans the page (`table*`). |

```markdown
| Size | Points |
|:-----|-------:|
| tiny | 5      |
{#tab:sizes caption="Font sizes, *in points*." short="Font sizes" cite="tufte2001"}
```

### Blockquotes and alerts (`render-blockquote.html`)

A plain blockquote is rendered as `<blockquote>`. To add an attribution footer, put block attributes on the
line after it (this requires `parser.attribute.block = true`):

```markdown
> I do not paint things, I paint only the differences between things.
{author="Henri Matisse" cite="Henri Matisse Dessins: thèmes et variations"}
```

GitHub-style alerts are rendered as `<blockquote class="alert alert-note">` (and `alert-tip`,
`alert-important`, `alert-warning`, `alert-caution`) with a small-caps sans label (`alert-title`):

```markdown
> [!NOTE]
> Margin notes are hidden behind a ⊕ toggle on small screens.
```

### Headings (`render-heading.html`)

Each heading gets its `id` and a small `#` anchor link (`<a class="heading-anchor">`, hidden from screen
readers) that appears on hover. Second-level headings also start a new `<section>` (see `sections`).

A heading may hold a shortcode (a sidenote, a citation…). Hugo computes heading ids and the tables of
contents before shortcodes run, so its automatic id would contain a placeholder such as
`hahahugoshortcode10s0hbhb`, whose number changes with the Hugo version and with every shortcode earlier
on the page. The theme removes these placeholders from the ids and from the links of the page and book
contents, and an entry of those contents whose heading holds a shortcode takes its text from the rendered
heading, so the words the shortcode prints are kept (`## The {{</* smallcaps */>}}NASA{{</* /smallcaps */>}} data`
is listed in full) and margin material is left out: `## Notes {{</* sidenote */>}}…{{</* /sidenote */>}}` gets the id `notes` on
every Hugo version. The same holds inside the inner text of a block shortcode (`details`, `fullwidth`…):
the shortcode's output is left out of the id there too. When another heading of the page already has the cleaned id
(`## Results {{</* sidenote */>}}…{{</* /sidenote */>}}` and a plain `## Results`), the heading that holds the shortcode
gets `results-1` (then `-2`…, the first suffix no other heading uses, as Goldmark does), so it keeps its own id,
section number and contents link; headings without a shortcode never change id. This applies to the headings of
the page content. Inside the inner text of a block shortcode, two headings that differ only by their shortcodes
also get distinct ids, but there the later one in document order takes the `-1`, `-2`… suffix, even when it is
the heading without a shortcode (`### Proof {{</* sidenote */>}}…{{</* /sidenote */>}}` then a plain `### Proof` in one
`details` give `proof` and `proof-1`). An automatic id may also change when you edit the heading: give such headings an explicit id
(`## Notes {{</* sidenote */>}}…{{</* /sidenote */>}} {#sec:notes}`).

Goldmark makes heading ids unique within one Markdown document, but the inner text of a block shortcode
(`details`, `blockquote`, `fullwidth`, `marginblock`, `abstract`…) and the front-matter `abstract` are each
rendered on their own. A heading there whose id the page already uses (a heading of the text, a heading of
an earlier inner text, any other element) gets the first free `-1`, `-2`… suffix, with its `#` anchor link:
two `{{</* details */>}}### Proof …{{</* /details */>}}` blocks give `proof` and `proof-1`. The headings of
the text keep their ids, so the table of contents and `[…](#id)` links still reach them. An id written
there (`### Proof {#sec:proof}`) is a label, not an automatic id: it follows the rules of
[cross-references](#cross-references-and-labels) together with the headings of the text, in document order (written on
two headings, the first one keeps it, the later one is renamed and `tufte-duplicate-label` is warned).

### Links (`render-link.html`)

Resolves links to other pages and to page resources to their site-relative URL, so content works under a
sub-path `baseURL`. External links are rendered unchanged, and so are paths made only of dot segments
(`./`, `../`), which the browser resolves against the page's URL (`[up](../)` on `/posts/a/` is `/posts/`). A link title (`[text](url "Title")`) is a plain-text
tooltip; a shortcode in it (`sidenote`, `cite`) cannot sit in the attribute: its plain text stays in the
tooltip and its note or citation follows the link.

### Math (`render-passthrough.html`)

See [Math](#math).

### Code blocks (`render-codeblock.html`)

Fenced code blocks are highlighted by Hugo's Chroma. If you add `{.fullwidth}` to the fence, the block spans
the full page width:

````markdown
```go {.fullwidth}
fmt.Println("a very long line that deserves the whole page width ...")
```
````

## Footnotes and sidenotes

A page can have **both** kinds of note at the same time: *sidenotes*, set in the right margin next to the
line they annotate (Tufte's way), and *real footnotes*, collected in a list below the text (the way of a
standard LaTeX article). Ordinary Markdown footnotes become sidenotes by default, so most writers never need
anything else. Tufte-LaTeX's `\footnote` is a sidenote too; the `footnote` shortcode below is for the classic
article footnote.

### Which kind of note you get

| You write | `footnotes = "sidenotes"` (default) | `footnotes = "endnotes"` (alias `"footnotes"`) |
|:--|:--|:--|
| `{{< sidenote >}}…{{< /sidenote >}}` | sidenote | sidenote |
| `{{< footnote >}}…{{< /footnote >}}` | real footnote | real footnote |
| `[^label]` | sidenote | real footnote |
| `[^fn-label]` (label starts with `fn-`) | real footnote | real footnote |
| `[^sn-label]` (label starts with `sn-`) | sidenote | sidenote |
| `{{< marginnote >}}…{{< /marginnote >}}` | unnumbered margin note | unnumbered margin note |

So a page can mix both with plain Markdown:

```markdown
Tufte prefers sidenotes.[^why] A proof is better below the text.[^fn-proof]
The shortcodes always give the same kind{{< footnote >}}A real footnote, whatever the mode.{{< /footnote >}}
of note.{{< sidenote >}}A sidenote, whatever the mode.{{< /sidenote >}}

[^why]: The reader's eye does not have to leave the line of text.
[^fn-proof]: A real footnote can hold several paragraphs.

    This is its second paragraph.
```

The `footnote` shortcode is **inline** (write it right after the word it annotates, inside the paragraph).
Its text is inline Markdown and may contain math, `cite`, `xref` and the other inline shortcodes. It also
takes the one-line form `{{< footnote "Text." />}}` and an optional `label="fn:x"`, so that
`{{< xref "fn:x" >}}` prints the footnote's mark and links to it. On its own page, `xref` also reaches a
Markdown footnote kept as a real footnote by its label (`{{< xref "fn-proof" >}}` for `[^fn-proof]`). Such a
label stays local to its page, as in Markdown: chapters of a book may reuse `[^fn-proof]`, it is never
reported as a duplicate, and any other label with the same key (a heading's id included) wins over it.

Markdown footnote labels match by exact text, as in Goldmark: they may contain spaces (`[^my note]`), and a
definition may sit in a block quote (`> [^q]: …`) or a list item. A `[^x]` that Goldmark does not read as a
reference stays literal text and does not change which footnote gets which label: an escaped `\[^fn-x]`, one in
code (fenced, indented or a code span), in math (with the passthrough delimiters shown above) or in an HTML tag.

Inside a sidenote the text is inline: paragraph breaks of a long Markdown footnote become line breaks, and
a list, code block, quote or table becomes inline blocks (a list keeps its own numbering, from its start, and
never renumbers a list that holds the note; warning `tufte-block-in-note`: label such a note
`[^fn-…]` to keep it a real footnote). A float cannot sit in a sidenote either (tufte-latex: “Float(s) lost”):
a `figure`, `fig` or `fullwidthfigure` shortcode there is shown as its plain image with its caption as text,
unnumbered and without its `label` (warning `tufte-block-in-note`), a `marginfigure` the same way (warning
`tufte-note-in-note`); an image alone in the note (the image render hook) is a plain image, without warning. A real footnote is block content in its list, so its paragraphs,
lists and code blocks stay as they are.

Marks written next to each other (`[^a][^b]`, two `footnote` shortcodes, a footnote mark right after a
sidenote, two `footnotemark`s in a table cell) are separated by a superscript comma, as tufte-latex's `\multfootsep`: footnotes 1 and 2 read “¹,²”,
never “¹²” (footnote 12), and roman or alphabetic marks never run together (“i,ii”, not “iii”). A footnote mark
gets a `<sup class="footnote-sep">,</sup>` before it, a sidenote mark the class `sidenote-number--multi`.

A `cite` in a Markdown footnote turned sidenote (`[^a]: As shown {{< cite "tufte2006" >}}.`, the form of
tufte-latex's `\footnote{… \cite{…}}`) adds its references as a citation block at the end of that sidenote,
as `cite` does inside the `sidenote` shortcode: one footnote stays one numbered note (in a footnote that stays
a real footnote, the block ends the footnote). A `sidenote` or
`marginnote` shortcode in such a footnote cannot float inside it: its text stays inline in the note and the
warning `tufte-note-in-note` is printed.

The same holds for the shortcodes: a `sidenote` or `marginnote` (or a margin figure) nested in a `sidenote`,
`marginnote`, `footnotetext` or `marginblock`, in a cell of a `margintable`, or in a figure or table caption
(a `subfigures` image title too), would float out of the margin column (tufte-latex stops with “Float(s) lost”). Its toggle is dropped, its text
stays inline as `<span class="note-in-note">…</span>`, it takes no number, and `tufte-note-in-note` is printed.
A margin figure there loses its float too: it is shown as its plain image with its caption as text, without
“Figure N:”, unnumbered, not in the list of figures, and its `label` is lost.
A `cite` nested there is fine: its references become the holder's citation block.

A note in the text of a link (`[see this[^1]](https://…)`, `[text {{< sidenote >}}…{{< /sidenote >}}](https://…)`,
a `marginnote` or `cite` there, a footnote mark of a real footnote) is moved, with its mark, to just after
the link, as tufte-latex sets `\href{url}{text\footnote{…}}`: a link may not hold the note's toggle, nor the
links inside the note. Any other link in link text (an `xref`, `[go {{< xref "fig:x" >}}](https://…)`) loses
its own link and keeps its text.

### Options

The options below go under `[params]` in the site configuration, or in a page's front matter (the page
wins). They are also accepted under `[params.tufte]` and the `tufte:` front matter map.

| Option | Values | Default | Meaning |
|:--|:--|:--|:--|
| `footnotes` | `"sidenotes"`, `"endnotes"` (or `"footnotes"`) | `"sidenotes"` | What a Markdown footnote `[^label]` becomes (see the table above). |
| `footnotestyle` | `"auto"`, `"arabic"`, `"alpha"`, `"roman"`, `"symbol"` | `"auto"` | Marks of the real footnotes. `auto` is arabic (1, 2, 3) on a page without numbered sidenotes and alphabetic (a, b, … z, aa) otherwise, so the two sequences never look alike. `symbol` follows LaTeX's `\fnsymbol`: `*` `†` `‡` `§` `¶` `‖` `**` `††` `‡‡`, then letters. |
| `footnoteplacement` | `"page"`, `"section"` | `"page"` | `page`: one list at the end of the article, in `<section class="footnotes">`, before the References (the automatic list, or a `{{< bibliography >}}` written after the text). `section`: a list at the end of each `<section>` (each `##` heading, see `sections`) where the notes are referenced, the closest the web gets to the bottom of a printed page; the notes of the title block and of the front-matter `abstract` go to the first section's list. |
| `citeas` | `"sidenote"`, `"footnote"` | `"sidenote"` | Where `{{< cite >}}` puts its reference; a single `cite` can override it with `as="footnote"`. Any other value prints the warning `tufte-bad-option` once, naming the page or configuration that sets it, and uses `"sidenote"`. |

```yaml
---
title: "A page with both kinds of notes"
footnotes: sidenotes        # [^x] → sidenote, [^fn-x] → footnote
footnotestyle: symbol       # *, †, ‡ …
footnoteplacement: section  # a footnote list at the end of each section
---
```

### Numbering and markup

Sidenotes and footnotes are numbered independently. Sidenotes keep Tufte CSS's counter (1, 2, 3 …); real
footnotes are numbered in the order in which they appear on the page, whether they come from Markdown or
from the shortcode, and their marks are written into the HTML, so they are the same in summaries, in print
and in cross-references. In a book, footnote numbering restarts in each chapter.

```html
…text<sup class="footnote-ref" id="fnref-3f2a9c-fn-proof"><a href="#fn-3f2a9c-fn-proof" role="doc-noteref">a</a></sup>…

<section class="footnotes footnotes-alpha" role="doc-endnotes" aria-label="Footnotes">
  <hr class="footnotes-sep">
  <ol class="footnotes-list">
    <li id="fn-3f2a9c-fn-proof" class="footnote-item" data-mark="a"><p>Text <a href="#fnref-3f2a9c-fn-proof" class="footnote-backref" role="doc-backlink" aria-label="Back to text">↩︎</a></p></li>
  </ol>
</section>
```

`3f2a9c` is a hash of the page URL, so ids stay unique on list pages that show several summaries. The rest
of the id is the whole Markdown label, prefix included (`[^fn-proof]` → `fn-3f2a9c-fn-proof`), or `s<n>` for
the `footnote` shortcode. The list carries the class `footnotes-<style>` (`footnotes-arabic`,
`footnotes-alpha`, `footnotes-roman`, `footnotes-symbol`); an arabic item has `value="N"`, the other styles
write the mark in `data-mark`. With `footnotePlacement = "section"` each list is a
`<div class="footnotes footnotes-section footnotes-<style>">` at the end of its section. A footnote
referenced twice gets one item with a backlink to each reference. On list pages, footnote references are
removed from summaries (a summary has no footnote list to link to), while sidenotes in summaries are kept.

Older configurations keep working: `footnotes = "endnotes"` without any `sn-` label renders Markdown
footnotes as a footnote list, as before.

A footnote inside a real footnote (a `footnote` shortcode or a `[^x]` in a `footnote` shortcode, a `footnote`
shortcode or a reference such as `[^fn-b]` in the definition of a `[^fn-a]` that stays a real footnote) is
moved out of it: its mark follows the outer footnote's mark in the text, and its item follows the outer item
in the list. A Markdown footnote referenced in the definition of another one (`[^a]: See [^b].`) is converted
by its own label: in a footnote turned sidenote, a real footnote keeps its mark in the sidenote, and a
sidenote stays inline as `<span class="note-in-note">` (warning `tufte-note-in-note`). A sidenote or margin
note inside a real footnote stays inside the footnote's list item, and is numbered there: a sidenote's number
(also the one `xref` prints) follows the order in which the page shows the notes, the footnote list after the
text (or after its section with `footnotePlacement = "section"`). So do the figures, tables, listings and
labelled equations in a real footnote's text: they take their numbers (in the text, in `xref` and in the
lists of figures, tables and listings) where the footnote list shows them, after those of the text before
it, so the numbers on the page run in order. Markdown footnote labels match by exact
text, as in Goldmark (`[^fn-Proof]` is not a reference to `[^fn-proof]:`).

## Fonts

The text is set in **ET Book**, the typeface Edward Tufte had made for his books (`static/et-book/`), with Gill
Sans for the sans-serif, as in Tufte CSS, and Adobe's **Source Code Pro** for code (bundled; Tufte CSS names
Consolas). Two other families can set the text: Libertinus and Source.

### Libertinus

`params.font = "libertinus"` (or front matter
`font: libertinus` on one page) sets it in **Libertinus** instead, the OpenType family that Khaled Hosny forked
from Linux Libertine and Biolinum and Caleb Maclennan maintains, as `\usepackage{libertinus}` does in LaTeX:

```toml
[params]
  font = "libertinus"   # Libertinus Serif, Sans and Mono
[params.math]
  font = "libertinus"   # and Libertinus Math for the formulas (optional)
```

- **Faces.** Libertinus Serif for the text, Libertinus Sans wherever the theme sets sans-serif (the `sans`
  shortcode, tables, the navigation, `sfsidenotes`), Libertinus Mono for code. The math font is a separate
  choice: `params.math.font = "libertinus"` sets the formulas in Libertinus Math, drawn to match the serif (see
  [Euler and Libertinus math](#euler-and-libertinus-math)); KaTeX's fonts and Euler work with it too.
- **Figures and small caps.** Libertinus has true small capitals (the `newthought` and `smallcaps` shortcodes,
  `font-variant: small-caps`). Its old-style figures come, as ET Book's, from a face of their own, "Libertinus
  OSF Digits" (the digits of Libertinus Serif, 2 kB): the note numbers use them, and `tufte.numerals =
  "oldstyle"` (`osf`) turns them on for the serif text, while the sans and code keep their lining figures.
- **Books.** The `font` of a book's root (its `_index.md`) sets the whole book, its `print.html` included; a
  chapter may set its own, which `print.html` does not follow (it is one document, in the book's font).
- **Files.** The fonts are bundled in `static/libertinus/` (version 7.051, SIL Open Font License,
  `static/libertinus/OFL.txt`). Each text face is split in two files, the Latin characters and the rest (Greek,
  Cyrillic, Hebrew, IPA, symbols), with the `unicode-range` of each in `assets/css/libertinus.css`: a page
  downloads only the faces it uses, and the second file only when it shows one of its characters (about
  100 kB each). Libertinus Math (380 kB) is not split.
- **How it works.** The theme reads every face from the CSS variables `--tufte-serif`, `--tufte-serif-old`,
  `--tufte-serif-osf`, `--tufte-sans` and `--tufte-mono`; `font = "libertinus"` puts the class
  `tufte-font-libertinus` on `<html>`, which redefines them. A `customCSS` file can redefine them too, for
  another family (and `etBook = false` leaves out ET Book's `@font-face` rules).

See the example site's [Libertinus](https://massimo-nocentini.github.io/tufte.hugo/posts/libertinus/) post.

### Source

`params.font = "source"` (or front matter `font: source`) sets the text in Adobe's **Source Serif 4** and the
sans-serif in **Source Sans 3**; code is in **Source Code Pro** with every `font` but `libertinus` (which keeps
Libertinus Mono), so the three families, drawn to the same proportions, set a page together:

```toml
[params]
  font = "source"   # Source Serif 4 and Source Sans 3 (code: Source Code Pro, always)
```

- **Faces.** Source Serif 4 for the text, Source Sans 3 wherever the theme sets sans-serif (the `sans`
  shortcode, tables, the navigation, `sfsidenotes`), Source Code Pro for `code`, code blocks, `kbd` and
  `samp`. Each family in Regular, Italic, Bold and Bold Italic, with Latin, Greek and Cyrillic; Source Serif 4
  and Source Sans 3 have true small capitals. The math font is a separate choice (`params.math.font`).
- **Figures.** Old-style figures come, as ET Book's and Libertinus's, from a face of their own, "Tufte Serif4
  OSF Digits" (the digits of Source Serif 4 mapped to its `onum` forms, 2 kB): the note numbers use them, and
  `tufte.numerals = "oldstyle"` turns them on for the serif text, while the sans and code keep their lining
  figures.
- **Files.** The fonts are bundled in `static/source/`: Adobe's static WOFF2 files of Source Serif 4 4.005
  (its default "Text" optical size), Source Sans 3 3.052 and Source Code Pro 2.042, **unchanged**, about 60 to
  110 kB each, each downloaded only by a page that uses it. They are under the SIL Open Font License with the
  Reserved Font Name “Source” (`static/source/OFL.txt`), so the theme does not subset them, unlike Libertinus,
  and the digits face, a Modified Version, carries a name of its own.
- **How it works.** As for Libertinus: `font = "source"` puts the class `tufte-font-source` on `<html>`, which
  redefines `--tufte-serif`, `--tufte-serif-old`, `--tufte-serif-osf` and `--tufte-sans`
  (`assets/css/source.css`); `--tufte-mono` names Source Code Pro already.

See the example site's [Source](https://massimo-nocentini.github.io/tufte.hugo/posts/source/) post.

## Math

All math is typeset with [KaTeX](https://katex.org). By default (`params.math.engine = "server"`) it is rendered
**at build time** with Hugo's `transform.ToMath`, so pages do not need JavaScript: the browser only needs the
KaTeX stylesheet for fonts and layout. With `params.math.enable = "auto"`, the theme loads it only on pages
that show math, or on pages with `math: true` in front matter. The test is made on the page as it is shown,
so math copied from other pages counts too: chapter titles and headings in the book contents or a
`tableofcontents`, index entries, captions in a list of figures, a `name` cross-reference to a title with
math, and the summaries of a list page.

Math needs the Goldmark passthrough extension in the **site** configuration (see
[Required site configuration](#required-site-configuration)):

```markdown
Inline math: \(e^{i\pi} + 1 = 0\) or $a^2 + b^2 = c^2$.

Display math stays within the text column:

$$
\int_0^\infty e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}
$$
```

Display equations are wrapped in an element with the `math-display` class, which keeps them inside the 55% text
column (full width inside `fullwidth`). Math also works inside sidenotes, margin notes, figure captions and
footnotes turned into sidenotes, since their text goes through the same render hook. Inside a note, a margin
block or a real footnote, display math and quotations take the note's smaller size, as `\footnotesize` does in
LaTeX. Math in a block quote or an alert (a quoted theorem, `> $$ … $$` over several `>` lines, or inline math
broken over two quoted lines) works too: Goldmark hands the hook the quote markers `>` of the continuation
lines, and the hook removes them when every line after the first starts with `>`, so KaTeX never prints them.

**Invalid TeX does not stop a normal build.** KaTeX runs with `throwOnError = false`; Hugo prints the
warning `tufte-math-error` with the page, the line and the expression, and the page shows the source as
`<code class="math-error">`. This includes undefined commands, such as a typo (`\RRR`) or a macro that was not
defined. Like every theme warning, it stops a `--panicOnWarning` build unless the site lists it in
`ignoreLogs = ["tufte-math-error"]` (see [Warnings](#warnings)).

**Macros.** Define them for the site in `params.math.macros` and per page in front matter `mathMacros`; the
page's win. Use a list of pairs, because Hugo lowercases map keys:

```toml
[params.math]
  macros = [["\\RR", "\\mathbb{R}"], ["\\abs", "\\left\\lvert #1 \\right\\rvert"]]
```

```yaml
mathMacros:
  - ["\\E", "\\mathbb{E}"]
```

**Equation numbers.** A `\label{eq:x}` inside `$$…$$` (or the `equation` shortcode with a label) numbers a
display equation as in LaTeX: one counter per page (per book when `continuous`), the number on the right (on
the left with `leqno = true`), and
`{{< eqref "eq:x" >}}` prints it (see [Equations](#equations)). KaTeX's own `equation`, `align` and `gather`
environments number their rows with a CSS counter of KaTeX's (`katexEqnNo`) that runs through the whole web page
and knows nothing of the theme's counter, so the two would repeat each other's numbers: in a display with a
`\label` the theme hides KaTeX's row numbers (the display has one number, the theme's), and elsewhere use
`\label` (or the starred environments, `aligned`, `gathered`) rather than mix the two on one page.
`\tag{…}` sets a fixed tag (on the right; `leqno = true`
puts it on the left, with the `\label` numbers); with a `\label` too, `eqref` prints the tag.

**Client engine.** With `params.math.engine = "client"` the render hook writes
`<span class="math math-inline">\(…\)</span>` and `<span class="math math-display">\[…\]</span>` (TeX
escaped), and pages with math load `katex.min.js` and `contrib/auto-render.min.js` (deferred, with SRI), which
typeset those elements with the same options and macros. On the home page and on section pages, the
summaries keep their TeX too, so the script there gets the `mathMacros` of every page in the current pager as
well (if two of those pages define the same macro differently, the later one wins). On a site without the
passthrough extension, set
`math: true` on a page and KaTeX's auto-render scans its article for `$…$`, `$$…$$`, `\(…\)` and `\[…\]`.

**KaTeX version.** With the server engine the HTML is produced by the KaTeX that Hugo embeds, and the
stylesheet must come from the same release: KaTeX 0.18 renamed the classes of its output (`base` →
`katex-base`, `strut` → `katex-strut`, `tag` → `katex-tag`, …), so an older stylesheet leaves the math
unstyled. Every supported Hugo (0.169.0 and later) embeds KaTeX 0.18, so the theme loads `katex@0.18.4`,
the first (newest) `[[katex]]` entry of `data/tufte/vendor.toml`:

| Hugo | Embedded KaTeX | Stylesheet and scripts loaded |
|---|---|---|
| 0.169.0 and later | 0.18.x | `katex@0.18.4` |

The client engine loads `katex.min.js` and `auto-render.min.js` of the same release as the stylesheet, so
script and CSS always agree. Setting `katexVersion` to a release that differs from Hugo's embedded one gives
the warning `tufte-katex-version` with the server engine.

**CDN, hashes and self-hosting.** The files are loaded from jsDelivr with the SRI hashes listed per release
in `data/tufte/vendor.toml` (one `[[katex]]` entry per bundled release, newest first).
With `params.selfHosted = true`, the files are downloaded at build time, checked against those hashes and
published under `/katex/`. Your own hashes (`katexIntegrity`, `katexJSIntegrity`, `katexAutoRenderIntegrity`)
may take any form a browser accepts: `sha256-`, `sha384-` or `sha512-` (cdnjs publishes sha512), or several
hashes separated by spaces; as in a browser, only the strongest algorithm listed counts, and the file must match
one of its hashes, or the build stops. The stylesheet loads its fonts from `fonts/` next to itself, so a self-hosted site
must copy the `dist/fonts/` directory of the **same** KaTeX release to `static/katex/fonts/`.

### Euler and Libertinus math

Two other fonts can set the formulas of a page or of the whole site:

- **Euler**, Hermann Zapf's upright mathematical alphabet, which the AMS commissioned and *Concrete
  Mathematics* made famous, as `\usepackage{eulervm}` does in LaTeX: the text stays in its font, and so does
  text inside a formula (`\text{…}`);
- **Libertinus Math**, the math font of the Libertinus family (see [Fonts](#fonts)), drawn to match Libertinus
  Serif, with italic letters, as `\usepackage{libertinus}` sets them.

```toml
[params.math]
  font = "euler"     # or "libertinus": the whole site
```

```yaml
mathFont: euler      # or libertinus: one page (front matter)
```

KaTeX's own output is drawn for KaTeX's fonts: it places every glyph with their measurements, so another font
would sit wrongly. With `font = "euler"` or `"libertinus"` KaTeX writes **MathML** only, and the browser lays it
out with the font, an OpenType math font that carries its own layout rules (script sizes, fraction gaps,
stretching delimiters and radicals): [Euler Math](https://ctan.org/pkg/euler-math) by Khaled Hosny and Daniel
Flipo (version 0.77, 261 kB as WOFF2, in `static/euler-math/`) or Libertinus Math (version 7.051, 380 kB, in
`static/libertinus/`), both under the SIL Open Font License, each downloaded only by pages that show a formula in
it. Chrome and Edge 109+, Firefox and Safari 16.4+ lay out MathML.

Everything else works as with KaTeX's fonts, with both engines: inline and display math, macros, math in notes
and captions, `\label` numbers and `eqref`, `fleqn` and `leqno`, `\qedhere`, the search index and the page
descriptions (both read the formula's TeX). Some details:

- **`\tag{…}`** is printed by the theme, as a `\label` number is (KaTeX's MathML tag is a full-width table that
  browsers do not lay out): `(X)`, or `X` for `\tag*{X}`, on the right (on the left with `leqno`).
- **What Chromium leaves out.** MathML Core, which Chrome and Edge implement, ignores `mathvariant`, the
  layout attributes of tables and `menclose`, and spaces operators by a dictionary that knows nothing of TeX's
  rules. The theme makes up for them (`tufte/mathml-core.html` at build time, the same in the client
  engine's script, `theme.css`):
  - `\mathbb{R}`, `\mathcal`, `\mathscr`, `\mathfrak`, `\mathbf`, `\boldsymbol`, `\mathsf` and `\mathtt`
    become the characters of the Unicode mathematical alphabets (ℝ, ℱ, 𝔤, 𝐯…), which both fonts have
    (Euler Math but for the lowercase script letters, which come from another font); `\textbf`, `\textit`, `\texttt` and
    `\textsf` inside a formula are styled by `theme.css`;
  - a sign is unary where TeX makes it so (`= -1`, `f(-x)`, `x^{-1}`: no space around it);
  - an operator name (`\sin`, `\det`, `\lim`, `\operatorname`) gets TeX's thin space after it before a letter,
    a number or a fraction (`\sin\theta`, `\lim_{n} a_n`; `\sin(x)` stays tight) and before it after a
    letter or a number (`2\sin x`);
  - the columns of `aligned`, `align`, `gather`, matrices, `cases` and `array` keep their alignment, spacing and
    rules (`{c|c}`, `\hline`), up to 12 columns (the 13th and later take the 12th's);
  - `\boxed`, `\fbox`, `\cancel`, `\bcancel` and `\xcancel` are drawn; `\overline`, `\underline`,
    `\widehat`, `\widetilde` and `\bar` use the accents the fonts stretch;
  - an inline formula and the punctuation right after it (`$x$,`) stay on one line (`span.tufte-nobr`):
    Chromium would break the line between them.
- **What Safari and Firefox need.** WebKit (Safari, and every browser on iPhone and iPad) and Firefox lay out
  the MathML attributes themselves, but differ from Chromium elsewhere, and `theme.css` takes care of it:
  the column alignment that Chromium needs would scatter the content of a table cell in WebKit, so it reaches
  the cell only; a numbered `equation`, `align` or `gather` spans the line, so that its rows sit in the
  middle and its numbers at the margin (WebKit showed it empty, a million pixels to the right); and a display
  is an inline block where `display: inline math` is unknown, so that `fleqn` sets it flush left. The
  hanging punctuation of the paragraphs (Safari only) stops at a formula: WebKit lays out each token of an
  inline formula as a line of its own, and hung its opening parentheses over the letter before them.
  WebKit draws no generated content in MathML, so the row numbers of those environments, a CSS counter of
  KaTeX's, do not show in Safari: number the displays with `\label`.
- **Markup.** The MathML sits in the span KaTeX uses for it in its usual output,
  `<span class="katex tufte-math-FONT"><span class="katex-mathml"><math>…</math></span></span>` (with the client
  engine, `<span class="katex tufte-math-FONT"><math>`), which `theme.css` shows instead of hiding, in the font
  its class names (`tufte-math-euler`, `tufte-math-libertinus`); a display is wrapped in `span.katex-display`, as
  before. The KaTeX stylesheet is still loaded (it styles the error output and the
  display wrappers); its fonts are not downloaded.
- **Numbered environments.** KaTeX's `equation`, `align` and `gather` number their rows with a CSS counter of
  their own, as with KaTeX's fonts (it runs through the page and knows nothing of the theme's `\label`
  numbers: number displays with `\label`, as recommended above). `\notag` and `\nonumber` work; a `\tag` on
  a row of such an environment cannot be printed (KaTeX's MathML drops it and the row keeps KaTeX's number):
  the build warns, `tufte-mathml-tag`; write the row as a display of its own, or use `mathFont: katex` on that
  page.

See the example site's [Euler Math](https://massimo-nocentini.github.io/tufte.hugo/posts/euler-math/) and
[Libertinus](https://massimo-nocentini.github.io/tufte.hugo/posts/libertinus/) posts.

## tufte-latex parity

Beyond Tufte CSS, the theme reproduces at HTML level what the
[Tufte-LaTeX](https://github.com/Tufte-LaTeX/tufte-latex) document classes do in TeX: `tufte-handout` for single
pages and `tufte-book` for multi-chapter books. That covers margin material with offsets, numbered floats with
their captions in the margin, citations in the margin with a bibliography, cross-references, book structure
(front, main and back matter, parts, chapters, appendices), a title page, contents, lists of figures and
tables, an index, LaTeX-like typographic options and a print stylesheet with the LaTeX page geometry. The
theorem environments of the `amsthm` package, the usual companion of the classes for mathematics, are covered
too (see [Theorems and proofs](#theorems-and-proofs)). The
[cheat sheet](#latex-to-hugo-cheat-sheet) at the end of this section maps every LaTeX feature to its
counterpart.

Every regular page outside a book is a **handout** (body class `tufte-handout`). A section whose `_index.md`
sets `book: true` is a **book** (body class `tufte-book`). Nothing changes for existing pages: with the
default `style = "css"`, a page without labels or cross-references renders exactly as before.

### Placement rule

Hugo removes the `<p>` around a shortcode that stands alone on a line. So:

- **Inline** shortcodes are written *inside* a paragraph, right after the word they belong to: `sidenote`,
  `marginnote`, `footnote`, `cite`, `xref`, `eqref`, `label`, `index`, `footnotemark`, `newthought`, `sans`,
  `allcaps`, `smallcaps`, `sc`, `textls`, `nohyphens`, `paragraph`, `bibentry`, `nocite`, and `marginfigure`
  with `inline="true"`.
- **Block** shortcodes *stand alone*, with a blank line before and after: `figure`, `fig`, `fullwidthfigure`,
  `marginfigure`, `table`, `fullwidthtable`, `margintable`, `marginblock`, `listing`, `subfigures`,
  `equation`, `footnotetext`, `bibliography`, `listoffigures`, `listoftables`, `listoflistings`,
  `printindex`, `tableofcontents`, `abstract`, `verse`, `clearpage`, `tuftebreak`, `clearmargin`, and the
  theorem shortcodes `theorem`, `lemma`, `proposition`, `corollary`, `definition`, `example`, `remark`, `thm`,
  `proof` and `listoftheorems` (`qedhere` is inline).
  A block written inside a paragraph (`Text {{< bibliography >}}`) would put block HTML in a `<p>`: the theme
  then splits the paragraph around it (the text before and after it stay paragraphs; emphasis or a link open
  around the block is closed before it and opened again after it; a block inside a block, such as a `details`
  in an `epigraph`, is split the same way) and prints the warning `tufte-block-in-paragraph`. In a tight list
  item, a table cell or a definition, which hold their text without a `<p>`, a block written inside emphasis or
  a link (`- Text *em {{< figure … >}} end*`) gets the same warning: the emphasis or link is closed before the
  block and opened again after it, and the item stays whole.

Shortcodes nest: a `cite`, `xref`, `smallcaps` or `index` inside a `sidenote`, a `fig` caption or a `table`
works as expected. Never mix positional and named parameters in one call: each shortcode has a short
positional form (`{{< xref "fig:x" "full" >}}`) and a named form (`{{< xref ref="fig:x" fmt="full" >}}`).
The inline formatting shortcodes also have a one-line form, `{{< smallcaps "PDF" />}}`, and so do
`sidenote`, `marginnote`, `footnote`, `newthought` and `sans` (see [Shortcodes](#shortcodes)).

### Required site settings

The settings of [Required site configuration](#required-site-configuration) are enough. Two of them matter
more here: `parser.attribute.block = true` gives ids and captions to Markdown images, tables and display
equations (`{#fig:x}`), and `parser.attribute.title = true` gives headings their labels
(`## Page Layout {#sec:page-layout}`). Keep Goldmark's default `parser.autoHeadingID = true`: section
numbers, the names `xref` gives to labels and the tables of contents follow headings by their ids, and a `##`
or `###` heading without one is left out of them (warning `tufte-heading-id`; the page's table of contents
keeps its text, without a link).

### Options: `[params.tufte]`

All keys are optional and case-insensitive. Each one can be set in the site configuration under
`[params.tufte]`, or in front matter under `tufte:`. A value is looked up **key by key**: the page, then the
part it belongs to, then the book root, then the site, then the defaults of the style preset. So a chapter can
set `tufte: {justified: true}` and keep everything else from the book and the site. A chapter in a section
inside a part takes the options of that part; the inner section's own `tufte:` is not read. (Do not use Hugo's
`cascade` for `tufte`: it replaces the whole map.) `tufte` must be a map, and so must each group of dotted keys
(`headings`, `book`, `print`…): `tufte: latex` or `headings: 2` is ignored with the warning `tufte-bad-option`;
write `tufte: {style: latex}` and `headings: {number: 2}`.

| Key | Default (`css` / `latex`) | LaTeX | Meaning |
|---|---|---|---|
| `style` | `"css"` | — | Preset of defaults: `"css"` (Tufte CSS look) or `"latex"` (tufte-handout / tufte-book look). |
| `titleBlock` | `"css"` / `"latex"` | `\maketitle` | `"css"`: h1, subtitle and the post metadata line. `"latex"`: an italic `\LARGE` title, italic author and date lines (the `##`/`###` headings then take `\section`'s `\Large` and `\subsection`'s `\large`), followed by a line with only the categories and tags; the reading time, word count and “updated on” date of the metadata line are not shown. |
| `justified` | `false` | `justified` | Justify the body text: paragraphs, list items, quotes, epigraphs, alerts, `details` blocks and the `fullwidth` shortcode (notes, captions, tables, the open epigraphs and the index keep their own alignment). |
| `hyphenate` | `false` / `true` | — | Automatic hyphenation of the same text blocks of the column (needs `<html lang>`). Inline code, code blocks, `kbd`, `samp`, autolinked URLs and bibliography links are never hyphenated, as `\texttt` and `\url` in TeX. |
| `indent` | `false` / `true` | book `\parindent` | Paragraphs of running text indented instead of separated by space (the copyright page and the subtitle, meta line and "Read more" of a post summary keep their own spacing). |
| `sfsidenotes` | `false` | `sfsidenotes` | Sans-serif margin material, title block and abstract (chapter titles stay italic serif, as in tufte-book). |
| `letterspacing` | `true` | `ls` / `nols` | Letterspacing of `allcaps`, `smallcaps`, `sc`, `newthought`. |
| `numerals` | `"lining"` / `"oldstyle"` | mathpazo `osf` | Old-style figures in the text (ET Book; bold text takes the figures of ET Book's semi-bold old-style face, as mathpazo's bold keeps old-style figures). |
| `marginals` | `"auto"` | `marginals=` | Alignment of all margin material: `justified`, `raggedright`, `raggedleft`, `raggedouter`, `auto` (follows `justified`). |
| `sidenote.align`, `marginnote.align`, `caption.align`, `citation.align` | `""` | `sidenote=` … | Override `marginals` for one kind of margin material. |
| `sidenote.font`, `marginnote.font`, `caption.font`, `citation.font` | `""` | `\setsidenotefont` … | Words: `italic`, `upright`, `sans`, `serif`, `mono`, `small`, `smaller`, `normal`, and a `#hex` colour (used as given in both colour schemes, so it must read on the dark background too). `small` and `smaller` are 0.9 and 0.8 of the default note size (0.99rem and 0.88rem; 0.9rem and 0.8rem with `sfsidenotes`), in rem, so the size is the same wherever the note sits (paragraph, title heading, caption, citation inside a note). |
| `floats.number` | `"auto"` / `true` | — | Number figures and tables: `true`, `false`, or `"auto"`: always in a book; in a handout as soon as the page has a labelled float (even one that gets no number itself: no caption, or `numbered=false`) or a labelled equation, or any `xref` or `eqref`, whatever it points to (a cross-reference to a section also numbers the page's captioned floats), or a `listoffigures`, `listoftables` or `listoflistings` (a list of floats is a list of numbered floats). Set `false` to keep Tufte CSS's unnumbered captions on such a page. |
| `headings.number` | `0` | `secnumdepth` | `1` numbers `##`, `2` numbers `##` and `###`. `{.unnumbered}` skips one heading. In a book with `numberChapters`, a numbered chapter's sections read 2.1, 2.2…; the landing, a part page and an unnumbered, front- or back-matter chapter continue the sections of the last numbered chapter (1.3 after 1.2, as `\section` after `\chapter*`), or 0.1, 0.2… before the first one. |
| `headings.strict` | `false` | — | `#####`/`######` give a warning (`false`) or stop the build (`true`). |
| `bibliography.data` | `"bibliography"` | `\bibliography{…}` | Key of the data tree (`hugo.Data`) holding the database (`data/bibliography.yaml`, `.json`, `.toml`, or a `data/bibliography/` directory). |
| `bibliography.style` | `"tufte"` / `"plainnat"` | `\bibliographystyle` | List order: `tufte` (order of citation) or `plainnat` (sorted as plainnat.bst does: by the full author names, last name first, then year, then cite key; no title). With `bibliography.margin = false` the `[n]` numbers follow that order too: `plainnat` numbers the sorted list, so the first citation may read `[3]`, as natbib does. |
| `bibliography.list` | `true` (books: `false`) | `\nobibliography` | Append the list of references at the end of a handout. |
| `bibliography.margin` | `true` | `nobib` | `false`: citations become `[n]`, linked to the list, which is numbered `[n]` in the order of `bibliography.style` (order of first citation, or sorted with `plainnat`). With no list to link to (a book without a `{{< bibliography >}}` chapter, a handout with `bibliography.list = false` and no `{{< bibliography >}}`), the numbers are printed unlinked and `tufte-no-bibliography` is warned. |
| `bibliography.heading` | `""` | — | Heading of the list; empty means the translated “References” (handouts) or “Bibliography” (books). |
| `book.numberChapters` | `false` | `secnumdepth` | Number the chapters (tufte-book leaves them unnumbered). |
| `book.continuous` | `true` | — | Sidenote, figure, table and equation numbers run through the whole book. |
| `book.toc` | `true` | `\tableofcontents` | Contents on the book's landing page; `false` is like leaving out `\tableofcontents`. It is not `notoc`, which keeps the contents and only reverts them to LaTeX's standard design. |
| `book.tocDepth` | `0` | `notoc` (closest) | `0`: chapters only; `1`: also their `##` sections, the closest to `notoc` (the contents keep the theme's design). A chapter written as an `.html` content file (which Goldmark does not render, so its headings are not the theme's) is listed without sections. |
| `book.titlepage` | `true` | `titlepage` / `notitlepage` | Full title page on the landing page. |
| `print.paper` | `"letter"` | `a4paper`, `b5paper` | Paper of the print stylesheet: `"letter"`, `"a4"`, `"b5"`. |
| `print.runningHeads` | `false` / `true` | `fancyhdr` | Running heads when printing (Chromium 131 or later). |
| `theorems.look` | `"tufte"` / `"amsthm"` | — | Theorem heads: `tufte` (small capitals, no bold) or `amsthm` (bold, as amsthm sets them). See [Theorems and proofs](#theorems-and-proofs). |
| `theorems.within` | `"auto"` | `\newtheorem{…}{…}[section]`, `\numberwithin` | Default `within` of every theorem counter that does not set its own: `auto` (per chapter in a book with `numberChapters` or `continuous = false`, else through the page or the book), `none` (or `""`), `chapter`, `section`. |
| `theorems.shared` | `true` | `\newtheorem{lemma}[theorem]{Lemma}` | Kinds without a `counter` share the counter `theorem` (as the AMS templates do); `false`: each kind has its own counter (amsthm's default). |
| `theorems.qed` | `"blacksquare"` / `"openbox"` | `\qedsymbol` | End-of-proof symbol: `blacksquare` (■), `openbox` (□), `none` (or `""`), or any text (`"∎"`, `"Q.E.D."`). |
| `theorems.kinds.K.name` | — | `\newtheorem{K}{Name}` | Heading word of kind `K` (else the i18n key `thm` + `K` capitalised, e.g. `thmAxiom`). Declares the kind. |
| `theorems.kinds.K.style` | `plain`; `definition` for definition, example, exercise; `remark` for remark, notation | `\theoremstyle` | `plain` (italic body), `definition` (upright body) or `remark` (upright body, italic head). |
| `theorems.kinds.K.counter` | — | `\newtheorem{K}[C]{…}` | Counter of kind `K` (a lowercase word); unset: `theorem` with `shared`, else `K`. A `C` that is a kind numbering with another counter is followed to that counter. |
| `theorems.kinds.K.within` | — | `\newtheorem{K}{…}[within]` | `within` of the counter named `K` (same values as `theorems.within`); on a numbered kind that numbers with another counter (and so on the kinds that follow it there) it is ignored (`tufte-bad-option`). |
| `theorems.kinds.K.numbered` | `true` | `\newtheorem*` | `false`: kind `K` is unnumbered. |
| `theorems.kinds.K.qed` | `""` | thmtools `qed=` | End symbol of kind `K`, with the values of `theorems.qed` (`""`: none). |
| `debug` | `false` | `debug` | Outlines the layout and prints extra warnings. |
| `innerHTML` | `false` | — | `true`: keep HTML tags in the inner text of the theme's shortcodes even with `unsafe = false` (for third-party shortcodes nested in them; trusted content only). |

The theme's own `hugo.toml` sets only `[params.tufte] style = "css"`; every other default comes from the
preset, so that `style = "latex"` can change it. `tufte.style = "latex"` on one page gives that page the
LaTeX look:

```yaml
---
title: "An Example of the Usage of the Tufte-Handout Style"
tufte:
  style: latex
  sidenote: {font: "italic"}
---
```

### Front matter for handouts and chapters

| Key | LaTeX | Meaning |
|---|---|---|
| `tufte` | class options | Any key of the table above. |
| `author` | `\author` | A name, a list of names, or a list of `{name, thanks}`. Falls back to `params.author.name`. Each `thanks` is a sidenote after the name, in the author line (`titleBlock = "latex"`) or in the metadata line (`"css"`). With `"css"`, a page's own `author` is always shown (the metadata line then appears on an undated page too), while the `params.author.name` fallback appears only in a metadata line that the page already has (a date, `dateText`, categories or tags), so an undated About page gets no byline. |
| `thanks` | `\thanks` | A string or a list: sidenotes attached to the title. Like an author's `thanks`, the text is inline Markdown in which shortcodes work (`cite`, `xref`, `smallcaps`…; escape the inner quotes in YAML): it is processed with the content, so the notes are numbered before the abstract's and the body's, a `cite` joins the note's citation block and the reference list, and an `xref` is resolved. A text that starts like a list item (`1984. A grant`) stays text; a `sidenote` inside stays inline (`tufte-note-in-note`). |
| `dateText` | `\date{text}` | Free text shown instead of the date (`date` remains the sort key), in both title blocks and in the summaries' metadata line. It replaces the whole date statement, so no “updated on” `lastmod` date follows it. |
| `showDate` | `\date{}` | `false` (or `"false"`) hides the date (both title blocks, summaries). |
| `abstract` | `abstract` environment | Markdown, rendered as `<section class="abstract">` after the title. Shortcodes work in it (`cite`, `xref`, `sidenote`…; escape the inner quotes in YAML): it is processed with the content, so its notes and citations are numbered and listed with the page's and its cross-references resolve. The `abstract` shortcode does the same inside the content. |
| `nocite` | `\nocite` | A list of keys, or `"*"`, added to the bibliography without citing them. |
| `bibliography` | `\bibliography{file}` | A page resource or an `assets/` path of a `.json`, `.yaml`, `.toml` or `.bib` database, merged with the site database. |
| `references` | — | Inline entries, a map key → entry in the [native schema](#bibliography). |
| `label` | `\label` after `\chapter` | Label of the page itself (`ch:design`), for `xref`. |
| `linkTitle` | `\title[plain]{…}` | Short title: the summary and list titles, the post navigation and the print running head use it; `<title>`, the h1 and the metadata keep `title`. |

`<title>` and the metadata (OpenGraph, Twitter card, schema.org, RSS item and channel titles) use the plain
text of `title`. `linkTitle` (default: `title`), the `\title[plain]{…}` of LaTeX, is the short form used where the
title is a link or a locator: summary titles, the archive and the term and taxonomy lists, the post navigation,
the book contents and navigation, the running heads and the chapter title of an `xref` `page`. Every h1 (pages, sections, the home page, terms, taxonomies, the archive, book parts
and chapters, `print.html`), summary titles, the archive, the term and taxonomy lists, the tag and category links of a page and the term page's link back to its taxonomy render it, so a title may contain inline Markdown such as `` `tufte-book` ``, `*emphasis*` or a
`[link](…)`. Math (`$…$`, `\(…\)`) is typeset in an h1 and in the generated contents that copy a title (the book
contents, a `tableofcontents`, an `xref` `name`, `page` or `auto` that prints the title, and the index and
list locators), and left as written in `<title>`,
the metadata, summary titles, the archive and term lists, and the post and book navigation, while the
Markdown around it is still rendered (`"*Fast* Euler $e^{i\pi}$"` gives `Fast Euler $e^{i\pi}$` in
`<title>`). Links are kept in an h1 and unwrapped in lists; `<` is text, never raw HTML.
The OpenGraph, Twitter and schema.org descriptions are the same
text as `<meta name="description">`: `description`, else `subtitle`, else the processed summary without
its margin material.

### Notes in the margin

| Shortcode | Parameters | LaTeX |
|---|---|---|
| `sidenote` | `text`, `number` (1–8 characters; does not step the counter), `offset`, `label`, `cite` | `\sidenote[number][offset]{…}` |
| `marginnote` | `text`, `offset`, `cite` | `\marginnote[offset]{…}`, `\marginpar` |
| `footnotemark` | `name` (or positional) | `\footnotemark` |
| `footnotetext` | `name` (or positional), `offset`, `text` | `\footnotetext[offset]{…}` (standalone) |
| `marginblock` | `offset`, `label` | a `minipage` in the margin (block content) |

**Offsets** move a note, caption or margin float down (positive) or up (negative): any CSS length (`px`,
`rem`, `em`, `ex`, `pt`, `pc`, `in`, `cm`, `mm`) or `Nbl`, *N* times the body `\baselineskip` (2rem).
Anything else prints the warning `tufte-bad-offset` and is ignored.

```markdown
Text.{{< sidenote number="*" offset="-2bl" >}}A note moved up by two lines.{{< /sidenote >}}
Text.{{< sidenote label="sn:why" >}}A labelled note.{{< /sidenote >}} As note {{< xref "sn:why" >}} says…
```

`footnotemark`/`footnotetext` put a mark where a note cannot go (a table cell) and its text after the
block. The name only pairs them: each `footnotetext` takes the marks of its name written since the previous
`footnotetext` of that name, so two tables may each use `"w"` (names that differ only in characters other than
letters, digits, `-` and `_`, such as `"x.y"` and `"x y"`, stay distinct). The text shows the current counter,
as in LaTeX, so no other numbered note may sit between the two:

```markdown
{{< table caption="Pages of the front matter." >}}
| Page content | Page |
|:--|--:|
| Frontispiece{{< footnotemark "frontispiece" >}} | 2 |
{{< /table >}}

{{< footnotetext name="frontispiece" offset="-7bl" >}}The contents of this page vary.{{< /footnotetext >}}
```

A `marginblock` holds paragraphs, lists or a small table, and is toggled with ⊕ on small screens. Like every
margin float it is placed between two paragraphs, at section level.

### Floats: figures, tables, listings

Figures and tables get a number, a caption label (“Figure 3:”) in the margin and an id when they have a
caption and are numbered (see `floats.number`). Figures, tables and listings have separate counters.

| Shortcode / Markdown | LaTeX |
|---|---|
| `{{< figure src="…" caption="…" label="fig:x" >}}` | `figure` + `\caption` + `\label` |
| `{{< fig src="…" label="fig:x" >}}Caption with *Markdown*, $x^2$ and {{< cite "key" >}}{{< /fig >}}` (positional: `{{< fig "rhino.png" >}}Caption{{< /fig >}}`, src only) | the same, with a caption that may contain shortcodes |
| `{{< marginfigure … >}}`, `type="margin"` | `marginfigure` |
| `{{< fullwidthfigure … >}}`, `type="fullwidth"` | `figure*` |
| `![alt](src "Caption")` + `{#fig:x}` on the next line (also `.margin`, `.fullwidth`, `short=…`) | the same, in Markdown |
| `{{< table caption="…" label="tab:x" >}}` + a Markdown table + `{{< /table >}}` | `table` |
| a Markdown table + `{#tab:x caption="…"}` on the next line (also `short=…`, `numbered=false`, `captionpos=…`, `offset=…`, `cite=…`, `.fullwidth`; `{#tab:x}` alone: a labelled table without a number) | `table` |
| `{{< fullwidthtable … >}}`, `{{< table type="fullwidth" … >}}` | `table*` |
| `{{< margintable caption="…" offset="…" >}}…{{< /margintable >}}` | `margintable` |
| `{{< listing caption="…" label="lst:x" style="ruled" >}}` + a fenced code block | algorithm/listing floats (`plain`, `ruled`, `boxed`) |
| `{{< subfigures cols=2 type="fullwidth" caption="…" >}}` + images on consecutive lines | `\fbox` grids, subfigures |

Common parameters of the float shortcodes (`figure`, `marginfigure`, `fullwidthfigure`, `fig`, `table`,
`fullwidthtable`, `margintable`, `listing`, `subfigures`):

| Parameter | LaTeX | Meaning |
|---|---|---|
| `label` | `\label` | Key for `xref` (e.g. `fig:helix`; `:` and `-` are equivalent). |
| `short` | `\caption[short]{…}` | Caption used in the lists of figures and tables and by `xref` `fmt="name"`: inline Markdown, and a text that starts like a list item (`1869. Minard's map`) prints as written. |
| `offset` | `\caption[][offset]{…}`, `marginfigure[offset]` | Moves the caption (a margin float moves as a whole, image or table with its caption). |
| `captionpos` | `\setfloatalignment{b}` | `"top"` (default) or `"bottom"`: align the caption with the bottom of the float. Text-column and full-width floats only: a margin float (`marginfigure`, `margintable`, `type="margin"`) has a fixed caption position (after the image in a margin figure, before the table in a `margintable`), and `captionpos="bottom"` on it prints the warning `tufte-bad-option`. |
| `numbered` | — | `false`: no number for this float (and no entry in the lists of figures and tables, like `\caption*`). With a `label`, `xref` still finds it and prints its name: the short caption, else the caption, else the `alt` text. The same holds for a labelled float without a caption; one with no text at all (a table with only a label) gives, as `\ref` after a `\label` with no `\caption`, the number of the enclosing section (in a numbered chapter or on a part page, the chapter or part number outside a numbered section), else its title. |
| `cite` | `\cite` in `\caption` | Keys whose references are appended to the caption. |
| `class` | — | Extra classes for the `<figure>` (for `margintable`, for the margin block). |
| `type` | `figure*`, `table*` | `"main"` (default) or `"fullwidth"` (`table`, `listing`, `subfigures`; the figures and `subfigures` also take `"margin"`: a grid in the margin, with `cols` columns and its caption below it, like a `marginfigure`). |

`figure`, `marginfigure` and `fullwidthfigure` keep their single-tag form (they never take inner content).
`fig` is their block form and must be closed. In `subfigures`, put the images on consecutive lines (a blank
line between them works too: every image in it is a cell of the grid, never a figure of its own). In `table`, `fullwidthtable`, `margintable` and
`listing`, a caption may also be given as a paragraph of the inner content, like `\caption` inside the
environment: before the table or code, or after it (where tufte-latex writes `\caption`, after the `tabular`).
Without a `caption` parameter, the first such paragraph is the caption. A Markdown footnote `[^1]`
in a `table` cell or caption is a real footnote listed below the text; for a note in the margin beside the
table, as in LaTeX, use `footnotemark`/`footnotetext`. In `subfigures`, the title of each image becomes a
subcaption under it, lettered in order: `![Alt](a.png "Handout")` gives “(a) Handout”. Like every caption,
the title is inline Markdown (`"*Book*"`, `"$x^2$"`, a shortcode: a `cite` joins the float's citation block, a
`sidenote` or `marginnote` stays inline text with the warning `tufte-note-in-note`); it is taken off the image, so no tooltip repeats it.
A linked image, `[![Alt](thumb.png "Handout")](full.png)` (a thumbnail linking to the full-size image), keeps its
link and gets its subcaption the same way; a title of the link itself (`(full.png "Tip")`) stays the link's tooltip.
A shortcode in the caption of a Markdown image (its title) or table (`caption="…"`) behaves as in a
`caption=` parameter: a `cite` joins the caption's citation block, a `sidenote` or `marginnote` stays inline
text with the warning `tufte-note-in-note`, and the shortcode's text is part of the image's alt text and of the
name an `xref` gives an unnumbered float (`numbered=false`).
`cols` sets the number of columns of the `subfigures` grid (1–12, default 2; another value prints the
warning `tufte-bad-option` and is ignored).

### Cross-references and labels

| Shortcode | LaTeX | Output |
|---|---|---|
| `{{< xref "fig:x" >}}` | `\ref` | the number, or the name of an unnumbered target |
| `{{< xref "fig:x" "full" >}}` | `Figure~\ref{fig:x}` | “Figure 3”, with a non-breaking space |
| `{{< xref "sec:x" "name" >}}` | `\nameref` | the section title; for a float, its short caption, else its caption, else its `alt` text; for a `label`, a labelled sidenote, an equation, or a float with none of those texts (a table with only a label), the title of the innermost enclosing `##` or `###` heading |
| `{{< xref "err:x" "page" >}}` | `\pageref` | the title of the enclosing section (`##`) or subsection (`###`); in a book, the target chapter's title (`linkTitle`) when the target is in another chapter |
| `{{< xref "fig:x" "num" >}}` | — | the number only, `??` when there is none |
| `{{< xref "fig:x" "auto" >}}` | `\ref` | the default format, written out: the number, else the name |
| `{{< xref "eq:x" "eq" >}}` | `\eqref` | the number in parentheses, “(3)”, like `eqref` |
| `{{< eqref "eq:x" >}}` | `\eqref` | “(3)” |
| `{{< label "err:x" >}}` | `\label` anywhere | an anchor at that point; `xref` prints the number of the enclosing numbered section, else of the enclosing numbered chapter, appendix or part (`\label` after `\chapter` or `\part`: “1”, “A”, “I”; `full` says “Chapter 1”, “Appendix A”, “Part I”: tufte-book numbers parts), else the title of the innermost enclosing `##`/`###` heading (the one `name` prints) |

Named forms: `{{< xref ref="fig:x" fmt="full" >}}`, `{{< eqref ref="eq:x" >}}`, `{{< label key="err:x" >}}`.

Labels come from `label=` on floats, notes and the `label` shortcode, from `{#id}` on headings, images, tables
and equations, from `\label{…}` inside display math, and from front matter `label` (a chapter). Keys are
normalised: lowercase, and `:` and every other punctuation mark except `_` and `-` (`.`, `+`, `/`…) become `-`,
so `fig:x` and `fig-x` are the same label, while `eq:1.2` (`eq-1-2`) and `eq:12` stay distinct. A key needs at least one letter or digit: `{{< label "!!!" >}}`
stops the build, and such a `label=` elsewhere is ignored with the warning `tufte-bad-option`. Labels are **global within a book**: `xref` looks in the
current page first, then in the whole book, so references work across chapters, forwards and backwards. To
point at a page outside the book, write `path#key` (`{{< xref "/posts/other.md#fig:x" "full" >}}`).
Unknown keys print `??` and the warning `tufte-undefined-ref`.

`name` and `page` print a title as plain text (no emphasis, links or notes), but math in it stays typeset,
as `\nameref` prints it: `## Growth of $x^2$ {#sec:g}` gives “Growth of x²”, and so do the `printindex`
locators of a handout. The same holds for a page or chapter title (a front-matter `label`, the chapter of a
`page` reference, a `label` written before the first heading): `title: "The *Fast* Way $x^2$"` prints
“The Fast Way x²”. Where only text fits (a figure's alt text derived from its caption, the page
description, warnings), a formula reads as its TeX, `$x^2$`.

A key defined twice prints `tufte-duplicate-label`, and the first definition wins (a later element with the
same id, e.g. a second `{{< label "dup:x" >}}` written `dup-x`, gets the id `dup-x-2`, so the page stays
valid HTML). Headings are the
exception: the id Goldmark derives from a heading's title (`## Results` → `results`) gives way to any
other label with that key (`label="results"` on a figure), with the same warning. An id written in the
Markdown (`## Results {#results}`) is a label like any other: written on two headings of a page (also a
heading in the inner text of a block shortcode such as `details` or `blockquote`), it is warned, and the
later heading in document order gets `results-2` (its table-of-contents entry follows); when it repeats the
id Goldmark gave an earlier heading (`## Intro` twice makes `intro-1`, then `## Other {#intro-1}`), the
automatic one yields and becomes `intro-1-2`, with a warning; in two chapters of a
book, it is warned as any label (`xref` reaches the first in reading order). When the two elements would
carry the same HTML id, the other element is renamed (`results-figure`), so the page has no duplicate id,
xrefs reach the figure and the table of contents still reaches the heading. Rename one of them to silence
the warning. A `####` run-in heading, like the `paragraph` shortcode, prints the enclosing section number
with `auto` when headings are numbered (`\ref` after `\paragraph`), or the chapter number outside a numbered
section of a numbered chapter, and its title with `name`.

Section numbers (with `headings.number`) are not shown in Hugo's `.TableOfContents`. A heading written inside a
block shortcode (`fullwidth`, `details`, `blockquote`…) is numbered like the others and listed in the page contents
and the book contents too (Hugo's `.TableOfContents` and `.Fragments` never see it: the theme adds it in document
order, at the nesting of its level; when the page has no heading of its own the levels are Hugo's defaults, h2 and
h3 in a `<ul>`). Math in a heading is typeset in the page contents and the book contents (Hugo itself
leaves the TeX raw), the words printed by a shortcode in a heading are kept there (Hugo
builds those texts before shortcodes run), and links in a heading are unwrapped there.

### Lists of figures and tables, contents

`{{< listoffigures >}}`, `{{< listoftables >}}` and `{{< listoflistings >}}` (standalone) list the floats of
the whole book inside a book (the landing body, the part pages and the chapters, in the reading order of
the numbering), or of the page; on a handout with `floats.number = "auto"` such a list numbers the page's captioned floats. `heading="…"` changes their heading; `heading=""` removes it
(useful when the page title already says “List of Figures”). An entry shows the short caption, else the caption
as written, without its margin material (sidenotes, margin notes, citations). A second list of the same kind on a page gets the
heading id `tufte-list-of-figures-2` (and so on), as a second index gets `tufte-index-2`; a generated heading also skips an id that the page's own headings use (after `## Tufte index`, the index heading is `tufte-index-2`). `{{< tableofcontents >}}` prints the book's contents
inside a book, or the page's own table of contents (like front matter `toc: true`). Inside a book it takes
the named parameters `depth` (`0` lists the chapters, `1` adds their `##` sections; default `book.tocDepth`)
and `heading` (the heading text; `heading=""` removes it). Outside a book both are ignored.

### Equations

A display equation is numbered when it has a label: `\label{…}` inside `$$…$$`, or `label="…"` (or the
positional label, `{{< equation "eq:euler" >}}`) on the `equation` shortcode. An `equation` without a label is
displayed unnumbered, unlike LaTeX's `equation` environment:

```markdown
$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi} \label{eq:gauss}
$$

{{< equation label="eq:euler" >}}
e^{i\pi} + 1 = 0
{{< /equation >}}

Equations {{< eqref "eq:gauss" >}} and {{< eqref "eq:euler" >}} …
```

The number is set on the right of the column and shares one counter per page (per book when `continuous`).
KaTeX's own environments (`equation`, `align`, `gather`) number their rows with KaTeX's CSS counter
(`katexEqnNo`, reset only on `body`), which runs through the web page on its own: it does not know the theme's
numbers, follow a book or skip `\label`led displays, so an unlabelled `align` after equation (1) also shows (1).
Use `\label` or the shortcode for numbered equations, and `align*`, `aligned` or `gathered` for the others; do
not mix the two kinds on one page. In a display with a `\label` the theme hides KaTeX's row numbers (they do
not step KaTeX's counter either), so `\begin{equation} … \label{eq:x} \end{equation}` shows only the theme's
number. A display gets **one** number, however many rows it has:
in an `aligned` or `align` block with a `\label` on each row, only the first label is kept, and the others are
reported (`tufte-bad-option`) since references to them would print `??`. Write one `$$…$$` per numbered row. TeX
comments are honoured: everything after an unescaped `%` on a line (not `\%`) is removed before the labels are
read, so a `\label` in a comment neither numbers the display nor replaces its real label.

`\tag` with a `\label` works as in amsmath: the tag is the equation's number. In
`$$ E = mc^2 \tag{$\star$} \label{eq:star} $$` KaTeX prints the tag (⋆), the theme adds no number of its
own, the counter does not step (the next labelled equation is still (1)), and `{{< eqref "eq:star" >}}`
prints “(⋆)” (`xref` with `num` or `auto` gives “⋆”). `\tag*{A.1}` is the same without the parentheses
in the display. The same holds for the `equation` shortcode.

### Theorems and proofs

The theorem environments of LaTeX's `amsthm` package (with the usual thmtools and cleveref conveniences) are
block shortcodes: `theorem`, `lemma`, `proposition`, `corollary`, `definition`, `example`, `remark`, `proof`,
and `thm` for any other kind. Like every block shortcode they stand on their own lines, with a blank line
before and after, and they must be closed (`{{< lemma >}}…{{< /lemma >}}`; a self-closed one shows its head
alone and prints `tufte-empty`). The example site's [Theorems and Proofs](exampleSite/content/posts/theorems.md)
page shows all of it, except the options that would change its numbers (`theorems.shared`, `theorems.within`
on its own, `theorems.look` and `theorems.qed`, shown in the configuration examples below).

```markdown
{{< definition label="def:group" >}}
A *group* is a set $G$ with an associative operation, an identity and inverses.
{{< /definition >}}

{{< theorem "Lagrange" "thm:lagrange" >}}
If $H$ is a subgroup of a finite group $G$, then $|H|$ divides $|G|$.
{{< /theorem >}}

{{< proof of="thm:lagrange" >}}
The cosets of $H$ partition $G$ and have $|H|$ elements each.
{{< /proof >}}

{{< thm "conjecture" "Goldbach" "conj:goldbach" >}}
Every even integer greater than $2$ is the sum of two primes.
{{< /thm >}}

{{< lemma note="Zorn" label="lem:zorn" >}}
Every nonempty partially ordered set in which every chain has an upper bound has a maximal element.
{{< /lemma >}}

{{< thm kind="axiom" name="Axiom" style="definition" >}}
There is a set with no elements.
{{< /thm >}}
```

This gives “Definition 1. A *group* is…”, “Theorem 2 (Lagrange). *If H is…*”, “*Proof of Theorem 2.* The
cosets… ■”, “Conjecture 3 (Goldbach). …”, “Lemma 4 (Zorn). …” and “Axiom 5. …” (a kind used with `name=` needs
no declaration, and shares the counter `theorem`): the head runs into the first paragraph, as amsthm sets
it (a body that starts with a list, a display or code has the head on a line of its own). The body is block
Markdown: paragraphs, lists, display and labelled equations, tables, code, figures, sidenotes, margin notes,
citations, footnotes and nested shortcodes all work in it.

**Parameters.** Positional: `0` = note, `1` = label (`thm`: `0` = kind, `1` = note, `2` = label). Never mix
positional and named parameters in one call.

| Parameter | amsthm | Meaning |
|---|---|---|
| `kind` | the environment | `thm` only, required: a lowercase word (`^[a-z][a-z0-9_-]*$`); a missing or invalid kind stops the build. |
| `note` (alias `title`) | `\begin{theorem}[note]` | The note in parentheses after the number: inline Markdown with math and shortcodes. |
| `label` | `\label` | The cross-reference key; it becomes the theorem's `id`. Any key works; the kind, not the prefix, decides the word `xref` prints (`thm:`, `lem:`, `def:`… are only a convention). A `{{< label "k" >}}` anywhere in the body (`\begin{theorem}\label{k}`, also in a proof nested in it) refers to the theorem too, as in LaTeX: “Theorem 2” with `full`, “2” by default; the link goes to that anchor. In a proof on its own, `{{< label >}}` refers to the enclosing section, as `\label` there does. |
| `numbered` | `\newtheorem*` | `false`: no number, the counter does not step. `true` numbers one of an unnumbered kind. Another word (not `true`/`false`/`yes`/`no`/`on`/`off`/`1`/`0`) warns `tufte-bad-option` and keeps the kind's default. |
| `style` | `\theoremstyle` | `plain`, `definition` or `remark`, for this one theorem. |
| `name` | the word of `\newtheorem` | The heading word of this one theorem (`name="Main Theorem"`). |
| `cite` | `[\cite{x}]` in the note | Citation keys (`"a,b"`), one citation sidenote right after the head. |
| `qed` | thmtools `qed=` | An end symbol for this theorem (none by default): see QED below. |
| `class` | — | Extra classes on the theorem's `<section>`. |

`{{< proof >}}…{{< /proof >}}` is amsthm's `proof`: “*Proof.*” in italics, an upright body and an end-of-proof
symbol. `{{< proof "Sketch" >}}` (or `title="…"`, inline Markdown) replaces the word, as
`\begin{proof}[Sketch]`, followed by a period unless the title already ends with one or with `?`, `!`, `:`, `;` or
`,` (amsthm's `\@addpunct`: `{{< proof "Sketch." >}}` reads “*Sketch.*”); `of="thm:x"` (or `path#key`) says “*Proof of Theorem 2.*”,
with a link to the theorem; `qed=` changes the symbol of this proof; `label` gives it an anchor (`xref` then
prints its head). A theorem in a proof, a proof in a theorem and a theorem in a theorem all work: each sets
its own body style. Theorems also work in list items, quotes, `details`, `fullwidth`, `marginblock` and the
`footnote` shortcode; in a `sidenote`, `marginnote` or caption they are set inline in the note, numbered like
the others.

**Kinds.** The built-in kinds, all numbered and all on the counter `theorem`:

| Kind | Shortcode | Style | i18n key |
|---|---|---|---|
| theorem, lemma, proposition, corollary | `theorem`, `lemma`, `proposition`, `corollary` | plain (italic body) | `thmTheorem`, `thmLemma`, `thmProposition`, `thmCorollary` |
| conjecture, claim | `thm "conjecture"`, `thm "claim"` | plain | `thmConjecture`, `thmClaim` |
| definition, example | `definition`, `example` | definition (upright body) | `thmDefinition`, `thmExample` |
| exercise | `thm "exercise"` | definition | `thmExercise` |
| remark | `remark` | remark (upright body, italic head) | `thmRemark` |
| notation | `thm "notation"` | remark | `thmNotation` |
| (proof) | `proof` | italic head, upright body, never numbered | `thmProof`, `thmProofOf` |

Declare a kind of your own (`\newtheorem`) under `theorems.kinds` in the options, in the site configuration
or in front matter:

```toml
[params.tufte.theorems]
  shared = false                          # amsthm's default: one counter per kind
  [params.tufte.theorems.kinds.theorem]
    within = "section"                    # \newtheorem{theorem}{Theorem}[section]
  [params.tufte.theorems.kinds.lemma]
    counter = "theorem"                   # \newtheorem{lemma}[theorem]{Lemma}
  [params.tufte.theorems.kinds.axiom]     # \theoremstyle{definition}\newtheorem*{axiom}{Axiom}
    name = "Axiom"
    style = "definition"
    numbered = false
```

```yaml
tufte:
  theorems: {kinds: {conjecture: {counter: conjecture}}}   # merged key by key: the rest stays
```

The heading word of a kind is, in this order: the shortcode's `name=`, `theorems.kinds.K.name`, the i18n key
`thm` + the kind with a capital (`thmAxiom`: add it to your site's `i18n/<lang>.yaml` to translate a kind of
your own), the English word of a built-in kind, and last the kind itself, capitalised (“Axiom”). A `thm` of a
kind that is neither built in nor declared (no `theorems.kinds.K.*` key) and has no `name=` is the
“Environment undefined” of LaTeX: it is shown with that last word and prints `tufte-thm-kind`.

**Numbering.** amsthm semantics, with the AMS templates' choice as the default:

- **Counters.** Every kind without its own `counter` uses the counter `theorem` (`theorems.shared = true`), so a
  lemma after Theorem 2.3 is Lemma 2.4, as in `amsart.template` and `amsbook.template`. `theorems.shared =
  false` gives each kind its own counter, as a bare `\newtheorem{lemma}{Lemma}` does; `kinds.K.counter = "C"`
  is `\newtheorem{K}[C]{…}`. When `C` is a kind that itself numbers with another counter (`lemma: {counter:
  definition}` while the definitions share `theorem`), the lemmas follow it to that counter, so they number
  with the definitions (amsthm would stop with “No counter 'definition' defined”). The shared counter is the
  one the kind `theorem` resolves to: `kinds.theorem.counter = "lemma"` (`\newtheorem{lemma}{Lemma}`
  `\newtheorem{theorem}[lemma]{Theorem}`) puts every kind without a `counter` on `lemma`, one sequence. A loop
  of `counter` options (`theorem → lemma → theorem`) warns `tufte-bad-option`, naming the options set.
- **Within.** `within` belongs to a counter, as amsthm's `[within]` belongs to the `\newtheorem` that defines
  the counter: `kinds.C.within` for the counter `C` (on a kind that shares another kind's counter it is
  ignored, with `tufte-bad-option`, since amsthm does not allow `[shared]` and `[within]` together), else
  `theorems.within`. Values: `auto` (default), `none` (or `""`), `chapter`, `section`. `auto` numbers within the
  chapter in a book whose chapters are numbered (`book.numberChapters`) or whose numbering is per chapter
  (`book.continuous = false`), and through the page or the book otherwise.
- **Sections.** `within = "section"` gives 1.1, 1.2, 2.1… on a page with numbered `##` sections
  (`headings.number`); unnumbered sections (`{.unnumbered}`) do not reset the counter, as `\section*`. On a
  page without numbered sections the chapter rule is used instead, and `tufte-thm-within` is printed.
- **Books.** Within `none`, a counter runs through the whole book in reading order, whatever
  `book.continuous` says (a LaTeX counter that is never reset). Within `chapter`, in a book with
  `numberChapters`, it restarts in each numbered chapter and is prefixed with the chapter's number or letter:
  Theorem 2.1 in chapter 2, Definition A.1 in appendix A; a chapter that is not numbered there (`unnumbered:
  true`, front or back matter) continues the previous chapter's numbers. In a book **without**
  `numberChapters`, within `chapter` (also `auto` with `continuous = false`) restarts in every chapter at 1,
  with no prefix, as the floats do with `continuous = false`: equal numbers recur in different chapters
  (Theorem 1 in each), so a cross-chapter `xref` prints the same text as a local one; use `within = "none"`
  for unique numbers through the book. Labels are global within a book,
  so `xref` reaches a theorem of another chapter. In `print.html` the ids are those of the print document
  (`tufte-c3-thm-x`).
- A lemma inside a proof is numbered in document order, after the theorem being proved, as in LaTeX.

**Cross-references.** A theorem's label works with every `xref` format:

| `xref` format | LaTeX | Theorem | Proof |
|---|---|---|---|
| (default), `auto` | `\ref` | the number (“2.3”); the word for an unnumbered theorem (“Remark”) | its head |
| `full` | cleveref `\cref` | “Lemma 2.3”, with a non-breaking space; the name of an unnumbered one | its head |
| `name` | `\nameref` | the note (“Lagrange”), else “Lemma 2.3” | its head |
| `num` | — | the number, `??` when there is none | `??` |
| `page` | `\pageref` | the enclosing section, or the chapter in another chapter of a book | the same |
| `eq` | — | the number in parentheses | `(??)` |

An unknown key prints `??` and `tufte-undefined-ref`, also in `proof of=`. A key defined twice prints
`tufte-duplicate-label`, and each theorem still shows its own number. An unlabelled theorem gets the id
`tufte-thm-…`; an unlabelled proof gets none.

**QED.** A proof ends with the end-of-proof symbol at the right end of its last line, or on a line of its own
when it ends with a list, a display, code, a table or a nested block (as amsthm does after a display without
`\qedhere`). Margin material at the start or end of a body (a margin figure, note or table, a `marginblock`, a
`label` on its own line) takes no room in the text column, so the head still runs into the first paragraph and
the symbol still ends the last one. `{{< qedhere >}}` (inline) puts the symbol where it stands, such as at the end of the last list
item, and `\qedhere` written inside display math (`$$ … \qedhere $$`, `\[ … \]`, the `equation` shortcode) puts it
at the right end of that display (after its number when it is numbered, with either math engine); the proof
then prints no symbol at its end. Only the first `\qedhere` of a
proof prints the symbol, as in amsthm (it uses up the proof's symbol): later ones print nothing. Outside a proof, `{{< qedhere >}}`
simply prints the symbol (`\qed`). A `\qedhere` takes the symbol of the proof (or theorem) that holds it, so
it still works where `theorems.qed = "none"` and a proof sets `qed=` (or a kind its `qed`); with no symbol at
all it prints nothing. The symbol is `theorems.qed` for proofs, `theorems.kinds.K.qed` for a kind
(none by default; thmtools' `qed=`, e.g. examples that end with `◊`), and `qed=` on one shortcode:
`blacksquare` (■, the default with `style = "css"`), `openbox` (□, amsthm's `\openbox`, the default with
`style = "latex"`), `none` (or `""`), or any text (`qed="Q.E.D."`, `"∎"`). The two boxes are drawn with CSS,
so they look the same in every font. The symbol is no float: it sits at the right end of its line whatever the
notes beside the paragraph, and when the line is full it moves to a new line of the paragraph with room for a
box (1.6em; for a text symbol the estimate `--thm-qed-room-text`, 5em, which `customCSS` may change). It is left
out of the page's meta description. Equation numbers and `eqref` (`span.eqref`) stay upright in an italic
theorem, as `\eqref` (`\textup`) does.

**List of theorems.** `{{< listoftheorems >}}` (standalone) is thmtools' `\listoftheorems`: every theorem of
the book inside a book, or of the page (proofs are never listed), as “Theorem 1.2 Lagrange”, with the
heading “List of Theorems” (`id="tufte-list-of-theorems"`). `kinds="theorem,lemma"` lists only those kinds;
`heading="…"` changes the heading and `heading=""` removes it.

**Looks.** `theorems.look = "tufte"` (the default with `style = "css"`) sets the heads in small capitals,
without bold, in the spirit of Tufte's books; `"amsthm"` (the default with `style = "latex"`) sets them in bold,
as amsthm does. Remark and proof heads are italic in both looks; the note is upright.

**Markup and classes.** For `customCSS`, a theorem is a nested `<section>` (so Tufte CSS's widths apply to its
paragraphs):

```html
<section class="tufte-thm thm-plain thm-kind-theorem thm-look-tufte" id="thm-lagrange" data-thm="theorem" data-counter="theorem" data-within="section"><p><span class="thm-head"><span class="thm-name">Theorem</span>&nbsp;<span class="thm-num"><span class="tufte-num" data-kind="thm" data-key="thm-lagrange">1.2</span></span> <span class="thm-note">(<span class="thm-note-text">Lagrange</span>)</span><span class="thm-punct">.</span></span> If …</p></section>
<section class="tufte-proof thm-kind-proof thm-look-tufte"><p><span class="thm-head"><span class="thm-name">Proof</span><span class="thm-punct">.</span></span> … <span class="thm-qed thm-qed-blacksquare" role="img" aria-label="End of proof">■</span></p></section>
```

The classes are `tufte-thm`, `tufte-proof`, the styles `thm-plain`, `thm-definition`, `thm-remark`, the kind
`thm-kind-K` (one per kind, e.g. `thm-kind-lemma`: style one kind with it), the looks `thm-look-tufte` and
`thm-look-amsthm`, the head parts `thm-head`, `thm-name`, `thm-num`, `thm-note`, `thm-note-text`, `thm-punct`,
`p.thm-headline` (a head on a line of its own), the QED symbol `thm-qed` with `thm-qed-openbox`,
`thm-qed-blacksquare` or `thm-qed-text`, `p.thm-qed-line` (the symbol on its own line) and the attribute
`data-qedhere` (`thm-qed-none` marks, in the content pipeline only, a `\qedhere` with no symbol yet; it never
reaches the page). A `label` anchor in a theorem's body carries `data-thm-in="ID"`, the theorem's id. In a note, a theorem is a `span[data-sn="section"].tufte-thm` (or `.tufte-proof`); the list
of theorems is `ol.tufte-lof[data-kind="thm"]`, with `lof-num` and `lof-where` as in the lists of figures.

**Limitations.**

- `\swapnumbers`, `\newtheoremstyle` (custom head fonts and spacing: use `thm-kind-K` and `customCSS`), thmtools'
  `restatable` and `\setcounter` on a theorem counter are not supported, nor `within` a subsection.
- One key per `xref`: cleveref's `\cref{a,b}` (“Theorems 1 and 2”) is not supported.
- A theorem cannot be wrapped in an inline shortcode other than a note (`sans`, `newthought`, `smallcaps`, `sc`,
  `allcaps`, `textls`, `nohyphens`, `verse`, a `details` summary…): it is shown as an inline block in that style
  and warned `tufte-block-in-note`. Only a `sidenote`, `marginnote`, `footnotetext` or caption sets it inline
  without a warning; a `marginblock` or `footnote` holds it as a block.
- A theorem inside a Markdown footnote definition (`[^1]: {{< lemma >}}…`) is not supported; in a real
  footnote's text, theorem numbers follow the document order, not the order of the footnote list.
- `\qedhere` in a display of several rows (`aligned`) puts the symbol at the end of the whole display, not of
  the row. `\qedhere` in inline math (`$…$`) is not removed (KaTeX reports it).
- A site shortcode named `theorem`, `example`… replaces the theme's (Hugo: the site wins).
- The heads are set when the page is rendered: the word is translated in the page's language, and changing
  `theorems.look` changes no number.

### Bibliography

**Citing.** `{{< cite "key" >}}` puts the full reference in a numbered sidenote, as `\cite` does in
tufte-latex. Several keys: `{{< cite "a,b" >}}` or `{{< cite "a" "b" >}}`. Named parameters: `keys` (alias
`key`), `offset`, `as` (`"footnote"` puts the reference in a real footnote, see `citeas`),
`page` (“, p. 42”; a range or list, `"42-45"`, `"42, 45"`, gives “, pp. 42–45” with an en dash; the
abbreviation is translated, i18n keys `bibPageAbbr` and `bibPagesAbbr`: German “S. 42”), `note` (any postnote; with `page` it comes after the locator: `page="42" note="emphasis added"` gives “, p. 42, emphasis added”) and `mode` (`margin`, the default: the reference in a sidenote;
`text` → “Tufte (2001)”, `paren` → “(Tufte 2001)”, `author`, `year`: inline, without a sidenote; several keys are
separated by “;”, as natbib does: “Tufte (2001); Knuth (1984)”). As plainnat's
extra labels do, two or more works cited in the same bibliography scope (the page, or the whole book) with the same
author label (“Adams”, “Adams and Brown”, “Adams et al.”) and the same year get a letter after the year, in
author-year citations (“Adams (1999a) and Adams (1999b)”, “(Adams 1999a; Adams 1999b)”) and in their references
(“…, 1999a.”), in plainnat's order (full author names, last name first, then year, then cite key: “Adam Adams” gets 1999a before “Zed Adams”);
the letter is kept wherever such a citation's text is copied (the page and book contents, `xref` `name`, the
lists, a figure's alt text, the page description). Inside a sidenote, a margin note, a footnote, a margin block or
a caption (also a `caption="…"` parameter), `cite` does not cut the text: as in tufte-latex, the references of
all its cites (and of the holder's own `cite=`) are gathered after the text, in one block joined “E1; E2; and
E3”. A `cite` in a table cell, in the `table` or `fullwidthtable` shortcode as in a Markdown table, stays a
numbered sidenote in that cell; in a `margintable`, which already sits in the margin, the references of its
cells are gathered after its caption. Keys are case-insensitive.

A sidenote or margin note in a table cell (a `cite` as above, or a `sidenote` / `[^x]` sidenote) keeps its
number in the cell, and on a wide screen and on paper its text goes to the margin column at the height of
its row. Such a note is placed on its own, so it does not stack below a note just above it: move it with
an `offset` when two collide. Where the margin column is taken or the table is itself in the margin or in
a footnote (a full-width table, a table inside `fullwidth`, a `margintable`, a real footnote), the note is
set as a small block under the cell's text instead. On a phone it opens under the cell's text, as any note.
It is set in the margin face of the other notes (serif by default, as `\@tufte@marginfont`), not in the
sans face of the table.

| Shortcode | LaTeX |
|---|---|
| `{{< bibentry "key" >}}` (named: `key="…"`) | `\bibentry{key}`: the formatted entry, inline, without a final period (add your own punctuation) |
| `{{< nocite "a,b" >}}` (or `{{< nocite "a" "b" >}}`; named: `keys="a,b"`), `{{< nocite "*" >}}`, front matter `nocite: [a]` | `\nocite` |
| `{{< bibliography >}}` (standalone; `all=true`, `heading="…"`) | `\bibliography{…}` |
| front matter `tufte: {bibliography: {list: false}}` | `\nobibliography` |

On a handout the list of references is appended automatically at the end of the page when the page cites
anything (`bibliography.list`), unless the page has its own `{{< bibliography >}}`. In a book, add a
back-matter chapter whose body is `{{< bibliography heading="" >}}`; it lists every key cited in the book
(landing body and part pages included), in the order of `bibliography.style` (first citation in reading order,
or sorted with `plainnat`, the `latex` preset), numbered `[n]` only with `bibliography.margin = false`.
`all=true` widens only its own list (the cited keys, then the rest of the database); `{{< nocite "*" >}}`
widens every list. Either way the extra labels (1999a, 1999b) are computed over every entry listed, as
`\nocite{*}` makes plainnat label the whole database, so a cited work keeps the letter that tells it from
an uncited one of the same author and year. A page may hold several lists: the second gets ids `tufte-references-2` and `ref-KEY-2`
(and so on), and citations link to the first.

**The database.** The theme reads `data/bibliography.yaml` (or `.json`, `.toml`, or several files in
`data/bibliography/`; `bibliography.data` changes the name). Two schemas are accepted:

- **Native**, a BibTeX-like map from key to entry:

  ```yaml
  tufte2006:
    type: book       # book inbook article incollection inproceedings proceedings
                     # phdthesis mastersthesis techreport manual booklet misc online
                     # unpublished
    author: Edward R. Tufte          # "A and B", or a list of "First Last", "Last, First",
                                     # "Last, Jr, First", {family, given, suffix} or
                                     # {literal}; as in BibTeX, "John von Neumann" =
                                     # "von Neumann, John", and a final "and others"
                                     # prints "et al." (“Doe et al. (2010)”)
    title: Beautiful Evidence
    publisher: Graphics Press, LLC
    address: Cheshire, Connecticut   # alias place, location
    year: 2006
    month: May                       # name, abbreviation or 1–12
    edition: First
    isbn: 0-9613921-7-7
    # also: editor, booktitle, journal, volume, number, pages, series, chapter,
    # institution, school, organization, howpublished, note, doi, url, issn,
    # genre (BibTeX's `type` field: "Doctoral dissertation", "Working Paper";
    # it replaces "PhD thesis", "Technical Report" or the word "chapter")
    # (issn is printed for article, misc and online, as plainnat does; isbn for
    # every type but article, theses, techreport, manual and unpublished;
    # urldate is accepted and not printed, as plainnat has no such field)
  ```

- **CSL-JSON or CSL-YAML**, a list of items with `id`, `type`, `author`, `issued`, `title`,
  `container-title`, `publisher`, `publisher-place`, `volume`, `issue`, `page`, `edition`, `URL`, `DOI`,
  `ISBN`, `ISSN`, `note`, `genre`, `collection-title` and `collection-number` (the series and the number in
  it); names may carry a `suffix` (CSL types are mapped to the BibTeX ones). CSL rich text in the text fields
  (title, container, publisher, place, series, genre, institution, note…), as pandoc writes it, is rendered:
  `<i>`, `<b>`, `<sup>`, `<sub>` and `<span style="font-variant:small-caps;">` become italics (upright inside
  an italic title), bold, super- and subscripts and small capitals (`span.sc`), `<span class="nocase">` is
  dropped (no case is ever changed), and HTML entities (`&amp;`) are decoded; any other or unmatched tag is
  printed as text, and the other fields (volume, pages, identifiers…) and the citation labels keep only the
  plain text.

**Converting a `.bib` file.** The robust route is [pandoc](https://pandoc.org), which understands all of
BibTeX and LaTeX accents:

```sh
pandoc refs.bib -t csljson -o data/bibliography.json
```

A page (or a book root) can also add its own database with front matter `bibliography: refs.json` (a page
resource or an `assets/` path; `.json`, `.yaml`, `.toml`) or with inline `references:`; later sources win.
A book has one database, as a LaTeX document does: the site database, then the `bibliography:` and
`references:` of every part and chapter, then the book root's own. A page's own sources win on that page,
except inside a book on a key the book already holds: as BibTeX keeps the first of repeated entries, the root's
entry, else the first one in reading order, wins on every page of the book, and a chapter that redefines it with a
different entry prints the warning `tufte-duplicate-cite`. So a key defined in one chapter can be cited from any
page of the book, and the book's bibliography lists the same entry the citations show.
Cite keys are case-insensitive, as in BibTeX: a key repeated within one database (a `.bib` file, a data file or
directory, the `references:` list; `tufte01` and `Tufte01` are the same key) keeps its first entry, and the
repeat prints the warning `tufte-duplicate-cite`.
A `.bib` file can be read directly (`bibliography: refs.bib`) by a simple built-in reader: `@string`
macros, `month = dec`, two levels of braces, common accents (`\'e`, `\"o`, `\c{c}`…), the dash and
quote ligatures (`---`, `--`, ``` ``…'' ```, `` `…' ``; an apostrophe becomes ’), `~` and `\url{}` are handled, anything more exotic is not. `url`, `doi` and `eprint` are taken verbatim
(`~user` and `--` stay as written), `\url{…}` inside `howpublished`, `note` or any other text field becomes a link when it is an
`http`, `https` or `ftp` address, the same rule as for the `url` field (anything else, such as a `javascript:` URL from an
imported file, is printed as text), and math
(`$k$-means`, `$\pi$-calculus`, `\(…\)`) is kept and typeset with KaTeX, in any database format; a
literal dollar is written `\$`. Each file is parsed once per build, however many chapters cite from it. The example site's `data/bibliography.yaml` is a hand
conversion of tufte-latex's `sample-handout.bib`.

**Format.** Entries follow plainnat as used by tufte-latex: “Edward R. Tufte. *Beautiful Evidence*.
Graphics Press, LLC, first edition, May 2006. ISBN 0-9613921-7-7.” (an `address` would follow the
publisher). The `edition` is printed as plainnat does in English: a word lowercased (“first edition”), a
number as an ordinal (`2` or `"02"` → “2nd edition”). In the theme's other languages a positive whole number,
or an English ordinal (`Second`, `2nd`, up to `Twentieth`), takes the language's own form, number first
(German “2. Auflage”, French “2e édition”/“1re édition”, Italian “2ª edizione”, Spanish “2.ª edición”); any
other value (`"3.1"`, `Revised`, `0`, more than six digits) keeps the English phrase as written (“3.1
edition”, “revised edition”) rather than mixing languages. An `inproceedings` with an `address`, and any `proceedings`, end the book block with the address and
the date, and the organization and publisher follow as a sentence of their own (“In *Proc. of Conf*, pages
3–4, NY, 2019. ACM.”), as plainnat prints them. A series without a volume prints “*Title*. Number 12 in
Lecture Notes. Pub, 1992.” (“In *Book*, number 4 in LN, pages 1–3.” for a part of a book), with a volume
“*Title*, volume 2 of *Series*.”. As plainnat does, a `pages` field that holds one page prints “page 42” (“pages 3–4”, “pages 3, 7”
or “pages 7+” for a range or a list). An `inbook` is a part of a book whose `title` is the book's title
(“*Whole Book*, chapter 7. Pub, 1996.”); with a `booktitle` it is printed as an `incollection`. The `genre`
(BibTeX's `type` field) replaces “PhD thesis”, “Technical Report” or “chapter” (“Doctoral dissertation, Uni,
1994.”). A misc, booklet or manual with nothing but a date after its title, and an inproceedings without
address, organization and publisher, close the previous sentence with the date (“Misc title, 2015.”); an
unpublished entry puts its note before the date (“In preparation, 2014.”). A final `and others` prints “et
al.” in the entry (“Jane Doe et al.”, “A, B, et al.”) and in the citation (“Doe et al. (2010)”); a name
suffix (“King, Jr., Martin Luther”) is printed in the entry (“Martin Luther King, Jr.”) and left out of the
citation (“King (1963)”), as natbib does. As in `tufte.bst`, titles are italic only for books, manuals, theses and proceedings; misc,
online, unpublished and booklet titles stay upright, and the titles of articles and chapters are plain
too, with their journal or book in italics. Titles and the `genre` keep the case they are written in:
plainnat lowercases the titles of articles, chapters and misc entries (“Article title”), but the theme
cannot tell the words a `.bib` file protects with braces (`{PhD}`), and the other formats have no such
protection at all. DOIs and URLs are links. An unknown key prints `[key?]` and the warning `tufte-unknown-cite`. With
`bibliography.margin = false` it prints `[key?]` in place of a number (natbib's `[?]`), takes no number and no entry in
the list (BibTeX leaves it out of the `.bbl`), so the known entries keep consecutive numbers.

### Books

A book is a section whose `_index.md` sets `book: true`; its regular pages are the chapters and its
sub-sections are **parts**.
A book cannot hold another book: a section with `book: true` inside a book is read as a part of the
outer book (the outermost `book: true` wins; warning `tufte-book-structure`), so its numbers, contents,
navigation and `print.html` are those of the outer book.

The whole site can also be one book: set `book: true` in `content/_index.md`. The home page is then the
landing (title page, contents…, and the `print` output if listed in its `outputs`, e.g.
`["html", "rss", "print"]`: keep `rss`, since that list replaces the home page's formats), the top-level regular
pages are the chapters and the top-level sections are the parts. Tag and category pages stay outside the
book, and the home page no longer lists post summaries.

```
content/books/my-book/
  _index.md            # book: true, title, author, publisher, epigraphs, copyrightPage, dedication…
  figures.md           # matter: front, title: List of Figures — body: {{< listoffigures heading="" >}}
  introduction.md      # matter: front, unnumbered: true
  first-chapter.md     # weight: 10, label: ch:first
  part-two/_index.md   # a part (\part): title, weight
  part-two/second.md   # a chapter of that part
  appendix.md          # matter: appendix  → lettered A, B, …
  bibliography.md      # matter: back — body: {{< bibliography heading="" >}}
  general-index.md     # matter: back, title: Index — body: {{< printindex heading="" >}}
```

Name the index chapter anything but `index.md`: that name would make its directory a leaf bundle. Create a
book and its chapters with the archetypes: `hugo new content --kind book books/my-book` and
`hugo new content --kind chapter books/my-book/first-chapter.md`.

**Book root front matter** (`_index.md`):

| Key | LaTeX | Meaning |
|---|---|---|
| `book` | `\documentclass{tufte-book}` | `true` makes the section a book. Reserved. |
| `title`, `subtitle`, `linkTitle` | `\title[plain]{…}` | |
| `author`, `thanks` | `\author`, `\thanks` | As for handouts, except on the title page (`book.titlepage`, the default): tufte-book's `\maketitlepage` prints `\thanklesstitle`, so the `thanks` are shown as notes marked “\*” that take no number (the first numbered note of the book is 1), and the author line shows names only. Without a title page the landing's title block numbers them as a handout does. |
| `publisher`, `publisherPlain` | `\publisher` | Markdown and plain-text versions (several Markdown paragraphs become lines). |
| `halftitle` | `\blankpage` | `true`: a half-title page, in print only. |
| `epigraphs` | `\openepigraph` | A list of `{quote, author, work}`; the quote is Markdown. |
| `frontispiece` | the frontispiece | `{src, alt, caption}` (or just a `src` string): an image on the page facing the title page. `src` is looked up like the `figure` shortcode's (a resource of the book bundle, then `assets/`, then a `static/` path or a URL); `caption` is inline Markdown, set in the margin like a figure caption, never numbered; `alt` defaults to the plain caption. |
| `copyrightPage` | the copyright page | A Markdown string, or a map `{year, holder, publisher, url, license, printing}` (defaults: the year of `date`, the author, the publisher, and “First printing, MONTH YEAR” from `date`; `printing: false` removes that line; `publisher` is inline Markdown, several paragraphs become lines; `license` is Markdown blocks). |
| `dedication` | the dedication | Markdown. Shown on the landing, right after the contents. To place it elsewhere among the front pages, as `sample-book.tex` does after the lists of figures and tables, put `dedication` on a front-matter chapter instead (below). |
| `outputs` | — | `["html", "rss", "print"]` adds `print.html`, the whole book as one document. Front-matter `outputs` replaces the section's output formats instead of adding to them, so list `html` and `rss` too: leaving out `rss` drops the book's feed (`index.xml`). |
| `tufte` | class options | Apply to every chapter (a chapter can still override any key). |

The landing page shows, in this order, the half-title (print), the epigraphs, the frontispiece, the title
page, the copyright page, the contents, the dedication and the body of `_index.md`.

The Markdown of these fields (epigraph quote, author and work, frontispiece caption, publisher, copyright
page, dedication, and a chapter's `dedication`) is processed with the page's content, as the `abstract` is.
Shortcodes run in it (`xref`, `cite`, `sidenote`…), and its notes, citations and cross-references are numbered
and resolved together with those of the landing. Its Markdown footnotes become the theme's footnotes. A
`[^x]` whose definition is in the `_index.md` body is the same footnote as the body's `[^x]`. A footnote defined
inside the field itself (`"To you[^1]\n\n[^1]: …"`) belongs to that field only, so `[^1]` in the epigraph and
`[^1]` in the dedication are two different notes.

**Chapter front matter:** `title`, `linkTitle` (short title for the contents, navigation, lists and running
heads, like `\chapter[short]{…}`), `weight` (reading order: first by `matter` — front, main, appendix, back —, so a front-matter chapter
comes before every main chapter whatever its weight; then by weight, negative weights first, unweighted (0)
last, a part and the loose chapters interleaving by the part's weight and the part's chapters by their own;
then by file name, a part by its directory name; never by date; a part's chapters stay together, as after
`\part`: a part sorts by the matter of its earliest chapter, and its chapters by matter, weight and file name
within it), `matter` (`front`, `main` — the default —, `appendix`, `back`; only main matter is numbered,
appendices are lettered), `unnumbered: true` (`\chapter*`), `intoc: false` (left out of the contents; its part is still listed), `label`,
`dedication` (Markdown: the chapter is a dedication page, the dedication text in place of the chapter head; use it
with `matter: front` and `intoc: false` and a weight that puts it where it belongs in the front matter),
and any handout key except those of the author and date line: a chapter's title block has the chapter number,
the title (with its `thanks`), the subtitle and the abstract, like `\chapter`, so `author`, `dateText`,
`showDate` and the post metadata keys (`showReadingTime`, `showWordCount`, `lastmod`) are ignored there. A part's `_index.md` takes `title`, `weight` and `label`; parts are numbered I, II, …

Chapters show a “Contents” link and previous/next links in reading order instead of the post navigation,
and no comments. With `book.continuous` (default) sidenotes, figures, tables and equations are numbered
through the whole book, in the order of the whole-book `print.html`: first the landing body, then each
part page before the first chapter of its part, so a chapter page shows exactly the numbers of the
printed book. With `continuous = false` sidenotes restart at 1 on every chapter and part page, on the site
and in print. Figures, tables, listings and equations restart in each numbered chapter
(`book.numberChapters`) and read “2.1”, “2.2”, … (chapter.number, as `\thechapter.\arabic{figure}` in LaTeX);
a part page, an unnumbered chapter or a back-matter chapter does not step the chapter number, so, as after
`\part` or in a `\chapter*`, it continues the last numbered chapter (“2.3” after figure 2.2), and the landing
and the front matter share one plain sequence (1, 2, …). So the lists and cross-references stay unambiguous.
Without `numberChapters` every page restarts them at 1. Parts are one level deep, like `\part`: the pages of a section inside a
part are read as chapters of that part (warning `tufte-book-structure`), and that section's own page is not
part of the book. Do not use front matter `toc` for the book contents (it is the per-page TOC switch),
nor `copyright` (the site footer); use `book.toc` and `copyrightPage`. A site `layouts/section.html` would
override the theme's `list.html` and therefore the book landing page.

Numbers, cross-references, the contents, the lists, the bibliography and the index of a book are computed
from all its chapters and cached for one build. `hugo server` rebuilds them after every change, so a figure
added to chapter 1 renumbers the figures of chapter 3 and the references to them on the next page load. If a
page ever looks stale (for example with a browser that keeps an old copy), reload it, or restart
`hugo server`; a one-shot `hugo` build is always consistent. These results are kept in each page's `.Store`,
marked with the build that computed them, so large books stay fast in every mode (a 200-chapter book builds,
or starts under `hugo server`, in seconds), and a rebuild of `hugo server` or `hugo --watch` computes them
again instead of reusing the old values.

### Index

`{{< index "RAW" >}}` (inline) marks an index entry with `makeindex` syntax: `a!b!c` for sub-entries (at
most three levels, as in `makeindex`: deeper ones are folded into the third, with the warning
`tufte-bad-option`),
`sort@display` for each level (the display text is inline Markdown, so `` `code` `` works; a text that starts like a block, `1984. Orwell` or `+ (plus)`, prints as written, as do the `see` texts), `|see{x}`,
`|seealso{x}`, and `|(` … `|)` for ranges (a range that ends in another chapter or section prints both
locators, “2–4”, and absorbs the ones inside it; one that ends where it starts prints one). As `makeindex`
reports them, `{{< printindex >}}` warns (`tufte-bad-option`) about a `|)` with no open range (it is listed as a
plain locator), a `|(` that is never closed (it is listed from its opening locator) and a second `|(` while the
same entry's range is still open (it is absorbed by that range); the open and the close must use the same entry
(`a!b|(` … `a!b|)`). Named alternatives: `term` (alias `entry`), `see`, `seealso`.
As in `makeindex`, `"` is the quote character: `"!`, `"@`, `"|` and `""` are a literal `!`, `@`, `|` and `"`
(a `"` before any other character is kept as written). Inside a double-quoted shortcode parameter the `"` is
written `\"`, or the parameter is written in backticks: `{{< index "Yahoo\"!" >}}`, ``{{< index `user"@example` >}}``,
`{{< index term="a\"|b" >}}`. An empty level (`Yahoo!`) or a page format such as `|textbf` (HTML has no page
numbers) prints the warning `tufte-bad-option`.
`{{< printindex >}}` (standalone) prints the index of the book (or of the page) in three columns, with links to
the chapters (or sections) where each entry occurs; an entry in the landing body or on a part page is
located by the book or part title. As in `makeindex`, entries that start with a symbol come first (“+ (plus)”,
“1984. Orwell”), then the pure numbers in numeric order (42 before 1984), then the words, sorted with the site
language's collation; a space separates the symbols, the numbers and each initial letter (accented initials stay
with their base letter, “Élan” under E, unless the language sorts the letter on its own, like Spanish “ñ”). Its named parameter `heading` changes the heading text
(default “Index”); `heading=""` removes it.

```markdown
{{< index "typefaces" >}}{{< index "fonts|see{typefaces}" >}}{{< index "typefaces!sizes" >}}
{{< index "class options!a4paper@`a4paper`" >}}
```

An index as a Hugo taxonomy is not offered: `/index/` would clash with Hugo's index files.

### Headings

`##` and `###` are the A- and B-heads (italic, unnumbered unless `headings.number`). `####` is a run-in
paragraph heading (`\paragraph`); the `{{< paragraph >}}Title{{< /paragraph >}}` shortcode gives the same
inside a paragraph, at its start; the one-line form `{{< paragraph "Title" />}}` takes the title as its
positional argument. Its named form takes `text` (the title, instead of inner content) and
`label` (`\label` right after `\paragraph`): `{{< paragraph label="par:align" >}}Alignment{{< /paragraph >}}`
puts the id on the run-in title, and `{{< xref "par:align" "name" >}}` prints “Alignment” (`\nameref`);
`auto` prints the section number when headings are numbered, else the title. `#####` and `######` do not exist in tufte-latex: they print the warning
`tufte-heading-depth`, or stop the build with `headings.strict = true`.

A sidenote or margin note in a heading (`## Title{{< sidenote >}}…{{< /sidenote >}}`) goes in the note
column. In a `####` run-in heading it is placed absolutely at the height of the heading, so it does not
stack below a long note of the previous paragraph: move it with an offset if the two overlap.

### Typography shortcodes

| Shortcode | LaTeX | Effect |
|---|---|---|
| `allcaps` | `\allcaps` | Upper case, letterspaced 0.2em (`\textls[200]`). |
| `smallcaps` | `\smallcaps` | Lower case set in small capitals, letterspaced 0.05em (`\textls[50]`). |
| `sc` | `\textsc` | Small capitals, case kept, letterspaced 0.05em. |
| `textls` | `\textls[n]` | Letterspacing: thousandths of an em (`"100"`) or a CSS length. Forms: `{{< textls "100" >}}text{{< /textls >}}`, `{{< textls "100" "text" />}}`, named `{{< textls amount="50" text="text" />}}` (or `amount` with inner text). |
| `nohyphens` | `\nohyphens` | No hyphenation (`{.nohyphens}` on a paragraph does the same). |
| `verse` | `verse` | Lines and stanzas (blank lines) of a poem. Each line is literal inline Markdown (`* * *`, `- said she` and `1914. The war` print as written). |
| `abstract` | `abstract` | The abstract block. |
| `epigraph style="open"` | `\openepigraph` | The sans-serif, upper-case opening epigraph. |
| `tuftebreak` | `\tuftebreak` | Vertical space between paragraphs. |
| `clearmargin` | `\FloatBarrier` | What follows starts below everything in the margin. |
| `clearpage` | `\clearpage` | A page break when printing. |

Paragraph attributes: `{.justify}`, `{.raggedright}`, `{.raggedleft}`, `{.nohyphens}`. Description lists
(Markdown definition lists) are styled like LaTeX's `description`.

### Printing and PDF

The print stylesheet reproduces the page geometry of `tufte-common.def` for `print.paper`:

| Paper | Page | Margins (top right bottom left) | Text column | Margin column |
|---|---|---|---|---|
| `letter` | 8.5 × 11 in | 1in 0.86in 1.48in 1in | 65% | 30% |
| `a4` | A4 | 27.4mm 20.6mm 28.2mm 24.8mm | 65% | 30% |
| `b5` | 176 × 250 mm | 28.7mm 14.69mm 34.1mm 14.66mm | 70% | 25% |

Sidenotes, margin notes and captions are printed in the margin column (never behind toggles), floats are not
split across pages, chapters and the front-matter pages (title, copyright, contents, dedication…) start on a new
page, and external links in the text column (not in notes, captions or the bibliography) show their URL (once: a link
whose text is its address, like `<https://…>` or `\url`, is not repeated). As tufte-book is `openright`
(`\cleardoublepage`), the title page, the landing's contents and dedication, every part and every chapter (the
bibliography and index chapters included) open on a right-hand page, and the frontispiece is printed on the
left-hand page facing the title page; the browser inserts a blank page where one is needed (Chromium honours these
left/right page breaks; a browser that does not just starts a new page). Print to PDF
from the browser. A book with `outputs: ["html", "rss", "print"]` has `print.html` next to its landing page
(front-matter `outputs` replaces Hugo's default formats, so keep `rss` in the list or the book loses its feed;
with `uglyURLs = true` the print document stays `books/b/print.html`, next to the landing `books/b/index.html`:
the theme's `print` output format sets `noUgly`, so it never takes the `x.html` name of a list page that Hugo
writes ugly, such as a taxonomy term): the
title pages, the contents and every chapter in one document, with cross-chapter links (relative, root-relative,
or absolute ones from `ref` and `absURL`) turned into links inside the document, and relative image and video
URLs (`src`, `poster`, `srcset`) resolved against their chapter. Each chapter is an `<article id="tufte-cN">` and each part an `<article id="tufte-pK">`,
and the ids inside them get the `tufte-cN-`/`tufte-pK-` prefix, so they never collide with the ids of the
landing body, which keep their names (except one in that namespace — `tufte-landing`, the landing's own article,
or one starting with `tufte-c`/`tufte-p` and a digit, or `tufte-l-` — which gets the `tufte-l-` prefix, with the
links to it: `## Tufte c0` is `#tufte-l-tufte-c0` in `print.html`; the theme's own ids, such as the `<main id="tufte-main">` landmark,
are in the `tufte-` namespace; when a page's content uses one itself, as `## Tufte main` does, the theme's
element takes the next free id, `tufte-main-2`, and the skip link follows it; a bibliography entry
`ref-KEY` likewise becomes `ref-KEY-2`, with the citation links, when a heading of its page has the id
`ref-KEY`). `print.runningHeads = true` adds running heads with the page number in
Chromium 131 and later: a handout prints its title (`linkTitle` when set, as
`\title[plain]`) and the page number at the top right of every page but the first (one-sided, as
with `oneside`; the author is not shown), and a book alternates, with the book title on left pages and the chapter title on right pages (like
`twoside`). As in tufte-book's `\frontmatter`, the landing's pages and the `matter: front` chapters show only the
page number in the outer corner, and the half title, epigraphs, frontispiece, title page and copyright page
show nothing (`\thispagestyle{empty}`), nor do the part pages of `print.html` (`\part`'s plain style is empty in tufte-book) and, in a browser that supports `@page :blank`, the blank pages left before a right-hand page (`\cleardoublepage`). Unlike `\chapter`'s plain style, the first page of each chapter in `print.html` still shows its running head: CSS matches only the first page of the whole document with `:first`, not the first page of each chapter (a chapter printed from its own page has no head on its first page). Other browsers print without running heads. They are set in capitals letterspaced like
`\smallcaps` (0.05em), without letterspacing under `letterspacing = false` (`nols`).

### Warnings

Every warning of the theme is printed with `warnidf` and one of the ids below, so each kind can be silenced
with Hugo's `ignoreLogs` (for example `ignoreLogs = ["tufte-unknown-cite", "tufte-math-error"]`). With
`--panicOnWarning` any warning that is not ignored stops the build. No warning is printed for summaries on list
pages. Build errors (`errorf`, such as `headings.strict` or a `katexVersion` without its hashes) always stop the
build and cannot be ignored.

| Id | When |
|---|---|
| `tufte-undefined-ref` | `xref` or `eqref` to an unknown key; a Markdown footnote `[^x]` in a shortcode's inner text with no `[^x]:` definition on the page. |
| `tufte-duplicate-label` | The same key defined twice in a page or a book, including a label equal to a heading's id and an explicit heading id (`{#sec:x}`) written twice (Markdown footnote labels, and two headings whose ids Goldmark derived from their titles, are never reported). |
| `tufte-unknown-cite` | A cited key is not in the database. |
| `tufte-duplicate-cite` | A cite key repeated within one bibliography database (keys are case-insensitive), or defined with different entries by two pages of one book (the root, then the parts and chapters in reading order); the first entry is kept, as BibTeX does ("Repeated entry"). |
| `tufte-heading-depth` | A `#####` or `######` heading (an error with `headings.strict`). |
| `tufte-heading-id` | A `##` or `###` heading without an id (the site sets `markup.goldmark.parser.autoHeadingID = false` and the heading has no `{#id}`): it is left out of section numbering and of the names `xref` gives to labels, and its entry in the page's table of contents is plain text, without a link. |
| `tufte-unlabeled-float` | A numbered float without a label (only with `debug`). |
| `tufte-bad-offset` | An invalid `offset`. |
| `tufte-bad-option` | An unknown or invalid value of an option or parameter: `tufte.*` options (an enum word not in the list, a boolean that is not `true`/`false`/`yes`/`no`/`on`/`off`/`1`/`0`, `headings.number` outside 0–2; the default is used instead; a `tufte` value that is not a table, such as `tufte: latex`, or a single value in place of an option group, such as `headings: 2` for `headings: {number: 2}`, is ignored), `sections`, `params.math.engine`, `strict` and `macros`, a missing `customCSS` file or a `customCSS` that is neither a list nor a string, partial `params.giscus` settings, an `iframe` `ratio` or `video` `type`, `epigraph` parameters ignored by its block-quote form, a theorem's invalid `style`, `numbered`, `counter` name, `theorems.look` or `within` value, both `note` and `title` (or `title` and `of` on a `proof`), a `within` on a kind that shares another kind's counter, a loop of theorem counters, a `label=` key without a letter or digit, a second `\label` in one display equation, an `index` entry deeper than three levels, with an empty level (`Yahoo!`: quote it, `Yahoo"!`) or with a page format other than `see`, `seealso`, `(` and `)` (`|textbf` has no effect), and the like. |
| `tufte-empty` | A shortcode with nothing to show: an empty `sidenote`, `marginnote`, `footnote`, `footnotetext` or `equation`, a theorem shortcode (`theorem`, `lemma`, `proof`, `thm`…) with no body, a `nocite` without a key, `subfigures` without images, a `table`, `margintable` or `fullwidthtable` with no table, or a `listing` with no code block, in its body (it keeps its caption, number and any text; a Markdown table written on one line with its tags, `{{< margintable >}} \| a \| b \| {{< /margintable >}}`, is a paragraph of pipes, not a table: put each row on its own line). |
| `tufte-math-error` | KaTeX could not render an expression (server engine); the source is shown as `<code class="math-error">`. |
| `tufte-raw-html` | Hand-written HTML in a shortcode's text was dropped (`unsafe = false`; see `innerHTML`). |
| `tufte-block-in-note` | A list, code block, quote or table in a sidenote, margin note or caption (or in a Markdown footnote turned sidenote, or in HTML kept by `innerHTML`), shown as inline blocks; or a float or block shortcode (`figure`, `table`, `listing`, `iframe`, `epigraph`…) nested in one, shown as a plain image with its caption, or as inline blocks, unnumbered. A theorem or proof in a note or caption is set inline without this warning (a list, code block or table in its body still gets it); in another inline shortcode (`sans`, `newthought`, `verse`…) it is warned. |
| `tufte-thm-kind` | A `thm` of a kind that is neither built in nor declared (`theorems.kinds.K.*`) and has no `name=`: shown with the kind capitalised as its word, on a counter of its own unless `theorems.shared` (LaTeX: “Environment undefined”). |
| `tufte-thm-within` | `within = "section"` for a theorem counter on a page with no numbered `##` section (`headings.number = 0`, or only unnumbered sections): numbered within the chapter instead (or through the page outside a book). |
| `tufte-block-in-paragraph` | A block shortcode (figure, margin block, bibliography, list of figures, contents, index…) written inside a paragraph instead of on its own lines; the paragraph is split around it. Inside emphasis or a link in a tight list item, table cell or definition, the emphasis or link is closed before it and opened again after it. Inside an unclosed raw-HTML `<span>` it is left in place (the warning says so). |
| `tufte-footnote-labels` | Some Markdown footnotes of a page could not be matched with Goldmark's rendered footnotes, so their `fn-`/`sn-` label prefix is ignored (the message names them; please report it). |
| `tufte-no-bibliography` | Numbered citations (`bibliography.margin = false`) with no reference list to link to: a book without a `{{< bibliography >}}` chapter, or a handout with `bibliography.list = false` and no `{{< bibliography >}}`. The numbers are printed unlinked. |
| `tufte-note-in-note` | A `sidenote`, `marginnote` or `marginfigure` shortcode inside a Markdown footnote turned sidenote, or inside a `sidenote`, `marginnote`, `footnotetext` or `marginblock` shortcode, a `margintable` cell, a figure/table caption or a `subfigures` image title: its text is shown inline. |
| `tufte-book-structure` | A section inside a part of a book (parts are one level deep), a `book: true` section inside a book, or an unlisted section (`build: {list: never}`) in a book that holds listed pages, which fall out of the book. |
| `tufte-orphan-footnotemark` | A `footnotemark` without its `footnotetext` (only with `debug`). |
| `tufte-bib-format` | A bibliography database that cannot be read. |
| `tufte-katex-version` | `params.math.katexVersion` differs from the KaTeX that Hugo embeds (server engine). |
| `tufte-mathml-tag` | A `\tag` on a row of a multi-row `align`, `gather` or similar environment with a MathML math font (`params.math.font = "euler"` or `"libertinus"`): MathML output cannot print it (see [Euler and Libertinus math](#euler-and-libertinus-math)). |
| `tufte-search-output` | `params.search.enable` is true but the home page has no `searchindex` output, so there is no index to search (see [Search](#search)); the search box is left out. |

### LaTeX to Hugo cheat sheet

One row per feature of the tufte-latex classes. **must** and **should** features are implemented,
**could** features are extras, **wont** rows say why a LaTeX feature has no HTML counterpart. Option names
such as `tufte.justified` are keys of `[params.tufte]` (or of the `tufte:` front matter map). The example site
has the same table with live examples ([From LaTeX to Hugo](exampleSite/content/posts/latex-to-hugo.md)), a
port of `sample-handout.tex` and a port of `sample-book.tex`. Rows 107–117 are the theorem environments of the `amsthm`
package, which the classes do not define but mathematical texts load with them.

| # | tufte-latex | tufte.hugo | Status | Notes |
|--:|:--|:--|:--|:--|
| 1 | `\documentclass{tufte-handout}` | any page outside a book | must | body class `tufte-handout` |
| 2 | `\documentclass{tufte-book}` | a section whose `_index.md` (or `content/_index.md`, for a whole-site book) sets `book: true` | must | its pages are the chapters; see [Books](#books) |
| 3 | class options (`justified`, `sfsidenotes`, `nols`, `marginals`…) | `[params.tufte]` in the site config; `tufte:` in front matter | must | resolved key by key: page → part → book → site → style preset |
| 4 | “looks like tufte-handout” | `tufte.style = "latex"` | should | preset: LaTeX title block, hyphenation, indented paragraphs, old-style figures, plainnat, running heads |
| 5 | `\sidenote{}`, `\footnote{}` | `{{< sidenote >}}…{{< /sidenote >}}`, Markdown `[^1]` | must | tufte-latex's `\footnote` is a sidenote; footnote ids are deterministic |
| 5a | a classic footnote (`\footnote` of the `article` class) | `{{< footnote >}}…{{< /footnote >}}`, Markdown `[^fn-x]` (any `[^x]` with `footnotes = "endnotes"`) | must | listed below the text, numbered apart from the sidenotes; see [Footnotes and sidenotes](#footnotes-and-sidenotes) |
| 6 | `\sidenote[num][offset]{}` | `{{< sidenote number="*" offset="-2bl" >}}…{{< /sidenote >}}` | must | a custom number does not step the counter |
| 7 | `\marginnote[offset]{}`, `\marginpar{}` | `{{< marginnote offset="1bl" >}}…{{< /marginnote >}}` | must |  |
| 8 | multiple marks (`\multfootsep`) | automatic | could | adjacent marks (sidenotes and real footnotes) are separated by a comma |
| 9 | `\footnotemark` + `\footnotetext[offset]{}` | `{{< footnotemark "row3" >}}` + standalone `{{< footnotetext name="row3" offset="-7bl" >}}…{{< /footnotetext >}}` | should | no other numbered note between mark and text |
| 10 | `\label` on a sidenote (“see note 7”) | `{{< sidenote label="sn:x" >}}…{{< /sidenote >}}` | should | `{{< xref "sn:x" >}}` prints its number |
| 11 | block content in the margin | `{{< marginblock >}}…{{< /marginblock >}}` | should | paragraphs, lists, tables; toggled on mobile |
| 12 | `\cite[offset]{a,b}` | `{{< cite "a,b" >}}`, `{{< cite "a" "b" >}}`, `{{< cite keys="a,b" offset="-1bl" >}}` | must | the full reference as a numbered sidenote |
| 13 | `\cite` inside `\sidenote`, `\marginnote`, `\caption` | a nested `{{< cite >}}`, or `cite="a,b"` on the note or figure | should | the reference is appended under the note |
| 14 | natbib `\citet`, `\citep`, `\citeauthor`, `\citeyear` (+ page) | `{{< cite keys="a" mode="text" page="42" >}}`; modes `text`, `paren`, `author`, `year` | could | inline text, no sidenote |
| 15 | `\bibentry{key}` | `{{< bibentry "key" >}}` | must | the formatted entry, inline |
| 16 | `\bibliography{f}` + `\bibliographystyle` | automatic at the end of a handout; `{{< bibliography >}}` anywhere (standalone) | must | `tufte.bibliography.style = "tufte"` (citation order) or `"plainnat"` (sorted; with `nobib` the `[n]` follow the sorted list) |
| 17 | `\nobibliography` | `tufte: {bibliography: {list: false}}` | must |  |
| 18 | `\nocite{a}`, `\nocite{*}` | `{{< nocite "a,b" >}}`, `{{< nocite "*" >}}`, front matter `nocite: [a]` | should |  |
| 19 | class option `nobib` | `tufte.bibliography.margin = false` | should | a citation becomes `[n]`, linked to the list (numbered in the order of `bibliography.style`) |
| 20 | `.bib` database | `data/bibliography.yaml` (native), `data/bibliography.json` (CSL-JSON), front matter `bibliography: refs.json` or `references:` | must | see [Bibliography](#bibliography) |
| 21 | `.bib` read directly | `bibliography: refs.bib` (page resource or asset) | could | a simple BibTeX reader; pandoc → CSL-JSON is more robust |
| 22 | `\doi{}`, `\url{}` in entries | fields `doi`, `url` | must | rendered as links |
| 23 | `figure` + `\caption` + `\label` | `{{< figure src="…" caption="…" label="fig:x" >}}`; `![alt](src "caption")` + `{#fig:x}`; `{{< fig src="…" label="fig:x" >}}caption{{< /fig >}}` | must | “Figure N:” starts the margin caption |
| 24 | `\caption[short]{}` | `short="…"` | should | used in the list of figures |
| 25 | `\caption[][offset]{}` | `offset="1bl"` | should |  |
| 26 | `\setfloatalignment{b}`, `[b]` | `captionpos="bottom"` | should | caption aligned with the bottom of the float |
| 27 | `figure*` | `{{< fullwidthfigure >}}`, `type="fullwidth"`, `{.fullwidth}` | must | the caption floats in the margin column |
| 28 | `marginfigure[offset]` | `{{< marginfigure offset="…" label="…" >}}`, `{{< fig type="margin" >}}` | must |  |
| 29 | figure without caption | any figure without `caption` | must | unnumbered |
| 30 | `table` + `\caption` | `{{< table caption="…" label="tab:x" >}}` + a Markdown table; a Markdown table + `{#tab:x caption="…"}` | must | its own counter |
| 31 | `table*` | `{{< fullwidthtable >}}`, `{{< table type="fullwidth" >}}` | should |  |
| 32 | `margintable[offset]` | `{{< margintable caption="…" offset="…" >}}…{{< /margintable >}}` | should |  |
| 33 | booktabs | Markdown tables | should | rules come from the CSS; `\cmidrule` and `\multicolumn` are **wont** (no Markdown syntax) |
| 34 | algorithm / listing floats | `{{< listing caption="…" label="lst:x" style="ruled" >}}` + a fenced code block | could | styles `plain`, `ruled`, `boxed` |
| 35 | subfigures, `\fbox` image grids | `{{< subfigures cols=2 type="fullwidth" caption="…" >}}` with images on consecutive lines | could | linked images (thumbnails) keep their link and subcaption |
| 36 | `\ref` | `{{< xref "fig:x" >}}` | must | forward references work |
| 37 | `Figure~\ref{fig:x}` | `{{< xref "fig:x" "full" >}}` | must | with a non-breaking space |
| 38 | `\nameref` | `{{< xref "sec:x" "name" >}}` | must |  |
| 39 | `\pageref` | `{{< xref "err:x" "page" >}}` | should | the enclosing section title; in a book, the chapter title for a target in another chapter |
| 40 | `\eqref` | `{{< eqref "eq:x" >}}` | should | “(3)” |
| 41 | `\label` anywhere | `{{< label "err:x" >}}` | should |  |
| 42 | `\listoffigures`, `\listoftables` | `{{< listoffigures >}}`, `{{< listoftables >}}`, `{{< listoflistings >}}` (standalone) | should | the whole book inside a book, else the page |
| 43 | numbered equations + `\label` | `$$ … \label{eq:x} $$`, `{{< equation label="eq:x" >}}…{{< /equation >}}` | should |  |
| 44 | `\chapter{}`, `\chapter[short]{}` | a page of the book: `title`, `linkTitle` | must |  |
| 45 | `\chapter*{}` | `unnumbered: true` | should |  |
| 46 | `\part{}` | a sub-section (`_index.md`) inside the book | should | roman numerals |
| 47 | `\frontmatter`, `\mainmatter`, `\backmatter` | `matter: front`, `main`, `back` | should | only main matter is numbered |
| 48 | `\appendix` | `matter: appendix` | should | lettered A, B, … |
| 49 | `\tableofcontents` (book) | automatic on the book's landing page; `{{< tableofcontents >}}` | must | italic, no leaders |
| 50 | `\tableofcontents` (handout) | front matter `toc: true`; `{{< tableofcontents >}}` | must |  |
| 51 | `\maketitle` (full title page) | the book's landing page | must | `tufte.book.titlepage` |
| 52 | `\maketitle` (handout title block) | `tufte.titleBlock = "latex"` | should | italic author and date lines |
| 53 | `\title[plain]`, `\author[plain]`, `\publisher` | `title`, `linkTitle`, `author`, `publisher`, `publisherPlain` | should |  |
| 54 | `\date{}`, `\date{text}` | `showDate: false`, `dateText: "Spring 2026"` | should | `date` stays the sort key |
| 55 | `\thanks` | `thanks: "…"`, `author: [{name: …, thanks: …}]` | should | a sidenote in the title |
| 56 | `abstract` environment | front matter `abstract:`, `{{< abstract >}}…{{< /abstract >}}` | should |  |
| 57 | `\openepigraph`, epigraph pages | book root `epigraphs:`; `{{< epigraph style="open" >}}` | should |  |
| 58 | epigraph (tufte-css) | `{{< epigraph >}}` | must |  |
| 59 | copyright page | book root `copyrightPage:` | should | Markdown string or `{year, holder, publisher, url, license, printing}` |
| 60 | dedication | book root `dedication:` | should |  |
| 61 | frontispiece | book root `frontispiece: {src, alt, caption}` | could | an unnumbered figure, caption in the margin, before the title page |
| 62 | `\blankpage`, `\cleardoublepage`, `\clearpage` | `{{< clearpage >}}`; `halftitle: true` | could | print only |
| 63 | running heads (fancyhdr) | `tufte.print.runningHeads = true` | could | print only, Chromium ≥ 131 |
| 64 | the book printed as one PDF | book root `outputs: [html, rss, print]` → `…/print.html` | should | see [Printing](#printing-and-pdf) |
| 65 | `\index{…}` with `!`, `@`, `\|see{}`, `\|seealso{}`, `\|(`, `\|)` | `{{< index "classes!a4paper" >}}`, same syntax | should |  |
| 66 | `\printindex` | `{{< printindex >}}` (standalone) | should | three columns |
| 67 | the index as a site taxonomy | — | **wont** | `/index/` clashes with Hugo's index files; use the shortcode |
| 68 | counters continuous across a book | `tufte.book.continuous = true` (default) | should |  |
| 69 | `\section`, `\subsection` (italic, unnumbered) | `##`, `###` | must | in `\Large` and `\large` (1.68rem, 1.54rem) with `style = "latex"` or `titleBlock = "latex"`, below the title; tufte.css's sizes otherwise |
| 70 | `\paragraph{}` (run-in) | `#### Title`, or `{{< paragraph >}}Title{{< /paragraph >}}` | should |  |
| 71 | no `\subsubsection` | a warning on `#####`/`######`; `tufte.headings.strict = true` makes it an error | should | Bringhurst §4.2.2 |
| 72 | `secnumdepth` | `tufte.headings.number = 0`, `1` or `2`; `{.unnumbered}` | could |  |
| 73 | `\section[short]{}` in the TOC | — | **wont** | Hugo builds its TOC from the headings themselves |
| 74 | `\newthought{}` | `{{< newthought >}}…{{< /newthought >}}` | must |  |
| 75 | `\tuftebreak`, `\tufteskip` | `{{< tuftebreak >}}` | could |  |
| 76 | `\allcaps{}` | `{{< allcaps >}}…{{< /allcaps >}}`, `{{< allcaps "nasa" />}}` | must |  |
| 77 | `\smallcaps{}` | `{{< smallcaps >}}…{{< /smallcaps >}}` | must |  |
| 78 | `\textsc{}` | `{{< sc >}}…{{< /sc >}}` | should |  |
| 79 | `\textls[n]{}` | `{{< textls "100" >}}…{{< /textls >}}` | could | thousandths of an em, or a CSS length |
| 80 | `ls`, `nols` | `tufte.letterspacing` | should |  |
| 81 | `\textsf`, `\sffamily` | `{{< sans >}}…{{< /sans >}}` | must |  |
| 82 | `justified`, ragged right, hyphenation | `tufte.justified`, `tufte.hyphenate`, `{.justify}`, `{.raggedleft}` | must |  |
| 83 | `sidenote=`, `marginnote=`, `caption=`, `citation=`, `marginals=` | `tufte.marginals`, `tufte.sidenote.align`, … | should |  |
| 84 | `\setsidenotefont` and friends | `tufte.sidenote.font = "italic sans"` | should | words: `italic upright sans serif mono small smaller normal #hex` |
| 85 | `sfsidenotes` | `tufte.sfsidenotes = true` | must |  |
| 86 | book `\parindent` paragraphs | `tufte.indent = true` | should |  |
| 87 | old-style figures (mathpazo `osf`) | `tufte.numerals = "oldstyle"` | could |  |
| 88 | `fonts`, `nofonts` | `params.etBook` | must |  |
| 89 | `fullwidth` environment | `{{< fullwidth >}}…{{< /fullwidth >}}` | must |  |
| 90 | `quote`, `quotation` | Markdown `>`; `{{< blockquote >}}` | must |  |
| 91 | `verse` | `{{< verse >}}…{{< /verse >}}` | should |  |
| 92 | `description` lists | Markdown definition lists | should |  |
| 93 | math | KaTeX: `$…$`, `$$…$$`, `\(…\)`, `\[…\]` | must | see [Math](#math) |
| 94 | `\nohyphens{}`, `\nohyphenation` | `{{< nohyphens >}}…{{< /nohyphens >}}`, `{.nohyphens}` | could |  |
| 95 | `\FloatBarrier` | `{{< clearmargin >}}` | could | `clear: right` |
| 96 | `debug` option | `tufte.debug = true` | could | outlines and extra warnings |
| 97 | letter, `a4paper`, `b5paper` | `tufte.print.paper = "letter"`, `"a4"`, `"b5"` | must | geometry from `tufte-common.def` |
| 98 | `symmetric`, `\forcerectofloat`, `\forceversofloat` | — | **wont** | a screen has no spreads, and a float cannot change side per printed page |
| 99 | `twoside`, `oneside` | — | **wont** | folded into running heads: a book alternates (book title on left pages, chapter title on right pages); a handout prints its title and the page number at the top right of every page but the first |
| 100 | `bidi` | the language's `direction` (`<html dir>`) | could |  |
| 101 | `hyper`, `colorlinks`, PDF metadata | — | **wont** | links are native; colours via `customCSS`; metadata is in `<head>` |
| 102 | `tufte-*-local.tex` hooks | `params.customCSS`, the `*_custom.html` partials | must | body classes `tufte-book`/`tufte-handout` allow scoping |
| 103 | `\hangp`, `\hangleft`, `\hangstar` | — | **wont** | sample-book macros, not class features; CSS `hanging-punctuation` (Safari only) is used |
| 104 | setspace `doublespace` | — | **wont** | loaded by `tufte-common.def`, but it is a general line-spacing package, not a class feature: set the leading with CSS (`line-height`) through `customCSS` |
| 105 | doc macros (`\doccmd`…), text shortcuts (`\TL`, `\monthyear`) | inline code, your own shortcodes | **wont** | not class features |
| 106 | TeX machinery (`\morefloats`, engine detection, `\TufteRecalculate`, other paper options) | — | **wont** | no meaning in HTML |
| 107 | amsthm `\newtheorem{k}{Word}` | `{{< theorem >}}…{{< /theorem >}}`, `lemma`, `proposition`, `corollary`, `definition`, `example`, `remark`; any kind with `{{< thm "k" >}}…{{< /thm >}}`; `tufte.theorems.kinds.k.name` | should | the amsthm package, not a class feature; see [Theorems and proofs](#theorems-and-proofs) |
| 108 | amsthm `\newtheorem*{k}{Word}` | `tufte.theorems.kinds.k.numbered = false`; `numbered=false` on one theorem | should |  |
| 109 | amsthm `\newtheorem{k}[c]{Word}` (shared counter) | `tufte.theorems.kinds.k.counter = "c"` | should | every kind shares `theorem` by default (`tufte.theorems.shared`), as in `amsart.template` |
| 110 | amsthm `\newtheorem{k}{Word}[section]`, `\numberwithin` | `tufte.theorems.kinds.c.within`, `tufte.theorems.within`: `"section"`, `"chapter"`, `"none"`, `"auto"` | should | `auto`: per chapter in a book with numbered chapters or `book.continuous = false` (without `numberChapters` every chapter restarts at 1, no prefix), else through the page or the book |
| 111 | amsthm `\theoremstyle{plain\|definition\|remark}` | `tufte.theorems.kinds.k.style`; `style=` on one theorem | should |  |
| 112 | `\begin{theorem}[note]` + `\label` | `{{< theorem "note" "thm:x" >}}…{{< /theorem >}}`, `{{< lemma note="…" label="lem:x" >}}` | should | the note in parentheses after the number; a `{{< label "thm:x" >}}` in the body refers to the theorem too |
| 113 | amsthm `proof`, `\begin{proof}[Head]` | `{{< proof >}}…{{< /proof >}}`, `{{< proof "Head" >}}`, `{{< proof of="thm:x" >}}` | should | “Proof of Theorem 2.1.” |
| 114 | `\qedhere`, `\qedsymbol` | `{{< qedhere >}}`, `\qedhere` in display math; `tufte.theorems.qed`, `qed=` | should | `blacksquare` ■ (`css`), `openbox` □ (`latex`), `none` or any text |
| 115 | `\ref`, cleveref `\cref`, `\nameref` to a theorem | `{{< xref "thm:x" >}}`, `{{< xref "thm:x" "full" >}}`, `{{< xref "thm:x" "name" >}}` | should | “2.1”, “Theorem 2.1”, the note |
| 116 | thmtools `\listoftheorems` | `{{< listoftheorems >}}` (standalone) | should | `kinds="theorem,lemma"`, `heading=""` |
| 117 | `\swapnumbers`, `\newtheoremstyle`, thmtools `restatable` | — | **wont** | heads come in two looks (`tufte.theorems.look`: `tufte`, `amsthm`); restyle one kind with `thm-kind-k` in `customCSS` |
| 118 | `\usepackage{euler}`, `eulervm` | `[params.math] font = "euler"`; front matter `mathFont: euler` | could | MathML set in the bundled Euler Math font; text and `\text{…}` stay in ET Book |
| 119 | `\usepackage{libertinus}`, `libertinus-otf` | `[params] font = "libertinus"` and `[params.math] font = "libertinus"`; front matter `font`, `mathFont` | could | Libertinus Serif, Sans and Mono for the text, Libertinus Math (MathML) for the formulas |
| 120 | Beamer slides of a handout | `outputs: ["html", "slides"]`: `slides.html`, a reveal.js deck | could | a slide at each `##` and `---`; `{{< notes >}}` for speaker notes |
| 121 | `\usepackage{sourceserifpro}`, `sourcesanspro`, `sourcecodepro` | `[params] font = "source"`; front matter `font` | could | Source Serif 4 for the text, Source Sans 3 for the sans-serif; Source Code Pro is the code font of every page but Libertinus's |

## Syntax highlighting

Code uses Hugo's built-in Chroma highlighter and the monospace style of Tufte CSS.

- With `markup.highlight.noClasses = false` (recommended), Chroma emits CSS classes. The theme's
  `assets/css/syntax.css` colours them, with light and dark palettes.
- With Hugo's default (`noClasses = true`), Chroma writes inline styles from `markup.highlight.style`.
  The theme keeps the layout but does not change the colours.

## Pages and layouts

| Page | Template | Notes |
|---|---|---|
| Home | `home.html` | Its `<h1>` is the title of `content/_index.md` when that differs from the site title; otherwise the site title, visually hidden (the header already shows it). Intro from `content/_index.md` (if `homeIntro`), then paginated summaries of `mainSections`. With `book: true` in `content/_index.md`, the book landing (`tufte/book/landing.html`). |
| Section list | `list.html` | Paginated summaries. |
| Single page | `page.html` | Title, subtitle, metadata, optional TOC, sectioned content, tags, post navigation, comments. |
| Taxonomy | `taxonomy.html` | All terms with page counts (for example `/tags/`). |
| Term | `term.html` | Pages for one term (for example `/tags/typography/`). |
| Search | `search.html` | Any page with `layout: search`: its title and content, then a search box and the results of the query in its URL (`?q=`). See [Search](#search). |
| Archives | `archive.html` | Any page with `layout: archive`. It lists all posts grouped by year (pages without a date, such as book chapters, last under an “Undated” heading, as on term pages, in the order of the RSS feed: each book's chapters in its reading order, book after book, then the other undated pages in Hugo's default order). |
| Not found | `404.html` | Localised "page not found" page. |
| Book landing | `list.html` → `tufte/book/landing.html` | A section with `book: true`: title page, contents, dedication. See [Books](#books). |
| Book part | `list.html` → `tufte/book/part.html` | A sub-section of a book: part number, title and its chapters. |
| Book chapter | `page.html` → `tufte/book/chapter.html` | A page inside a book: chapter number, content, book navigation. |
| Slides | `page.slides.html` | `slides.html` of a page with `outputs: ["html", "slides"]`: its content as a reveal.js deck. See [Slides](#slides). |
| Whole book | `list.print.html` | `print.html` of a book with `outputs: ["html", "rss", "print"]` (keep `rss`: front-matter `outputs` replaces the default formats, feed included). |
| RSS feeds | `rss.xml` | Hugo's feed, with each item's description taken from the theme's processed summary (numbers and cross-references resolved). Items are ordered by publication date, newest first (Hugo orders by weight first), so the limit `[services.rss] limit` keeps the newest posts; undated pages (book chapters, which have a weight and no date) come after the dated ones and have no `<pubDate>`: each book's chapters in its reading order (matter, weight, file name, parts kept together, as in the book contents), book after book, then any other undated pages in Hugo's default order (weight, then title). The feed of a book's section (`/BOOK/index.xml`) or of one of its parts lists all its chapters, those inside its parts included (a section outside a book lists its own pages, as in Hugo). |

Every template takes a page's text from `partialCached "func/content.html" …`, never from Hugo's `.Content`,
`.Summary` or `.Plain`, which still hold the theme's unresolved markers. Do the same in a template you override
or add (see “Overriding templates” under [Customisation](#customisation)).

To create the archives page, add `content/archives.md`:

```markdown
---
title: Archives
layout: archive
---
```

Summaries use Hugo's `<!--more-->` divider when it is present. Otherwise Hugo builds an automatic summary.
A summary is shown on other pages (the home page, section lists, the feed), so its links are resolved against
its own page: a fragment link (`[details](#details)`) points to the page (`/posts/x/#details`), and a
page-relative link or image (`[other](../other/)`, `img.png`) gets the URL the browser would give it on the page
(`/posts/other/`).

## Search

A full-text search of the site, as in [Beautiful Hugo](https://github.com/halogenica/beautifulhugo): a search
box in the site header shows the best matches as you type, and a results page lists them all. It runs in the
browser with [Fuse.js](https://www.fusejs.io/) on an index that Hugo writes at build time, so it needs no
server and no third-party service. It is off by default, since it is the theme's only JavaScript.

Turn it on in the site configuration, and give the home page the theme's `searchindex` output (Hugo does not
merge `[outputs]` from a theme, and a site's `[outputs]` replaces the default formats, so keep `html` and `rss`):

```toml
[params.search]
  enable = true

[outputs]
  home = ["html", "rss", "searchindex"]
```

Then add the results page, `content/search.md`:

```markdown
---
title: Search
layout: search
---
```

**Using it.** Type in the header box, or press <kbd>/</kbd> to go there (`params.search.hotkey`). The best
matches show under the box (up to `maxResults`): the page title, the section heading of the match, where the
page is (a chapter's book, a post's section) and its date, and a few lines of text around the words searched
for, which are highlighted. The arrow keys move through the matches, <kbd>Enter</kbd> opens one, and
<kbd>Esc</kbd> closes the list. <kbd>Enter</kbd> on the query itself opens the results page
(`/search/?q=…`), which lists every match; without a results page it opens the best match. A match links
to its section (`/posts/x/#heading`).

Words match in any order, and each must appear somewhere in the page (its title, headings, text or notes).
They match with a little fuzziness (`threshold`): a typo still finds the word (“lagrnge”), and accents are
ignored (“theoreme” finds “théorème”). Matches in titles weigh most, then section headings, then the text and
the notes.

**The index.** `searchindex` is a JSON file, `/search-index.json` (`/LANG/search-index.json` for each
language of a multilingual site), made by `layouts/home.searchindex.json`. It is built from the HTML the
reader sees, so numbers, cross-references and citations read as on the page, and each entry is

| Key | Value |
|---|---|
| `title` | The plain title. |
| `url` | The page's `RelPermalink` (so it works on a site served under a subpath). |
| `where` | The book of a chapter or part, else the section of a page below the home page. |
| `date` | The date of a regular page as the page shows it (front matter `dateText`; `""` when it is undated or `showDate: false`). |
| `sections` | The text cut at each `##`–`####` heading with an id (run-in headings included): a list of `{id, heading, text, notes}`; the first has `id` and `heading` `""`. `notes` holds the text of the section's sidenotes, margin notes and margin citations, which are kept apart so that they do not split its sentences. Math reads as its TeX (`$x^2$`, `$$…$$`); heading anchors, footnote marks, end-of-proof symbols, scripts, media, code line numbers and the generated lists (lists of figures, tables, listings and theorems; the index; a table of contents) are left out. |

Regular pages are indexed, and the home, section, book and part pages that have text of their own. Left out:
pages with `searchHidden: true` in their front matter, pages with `layout: search` or `layout: archive`, pages
that are not rendered (build options `render: never`, or `render: link` in the page's own front matter: one that
gets it through `cascade` needs `searchHidden: true` too), and with `params.search.sections` the pages of other types. The index of
the example site is about 150 kB (about 50 kB compressed); `contentChars` makes it smaller.

**Loading.** Every page links a small script (`assets/tufte/search.js`, fingerprinted, with SRI) and the
settings it reads (`<script type="application/json" id="tufte-search-config">`). Fuse.js and the index load
only when a reader first uses the box (or opens the results page). Fuse.js comes from jsDelivr, pinned with an
SRI hash in `data/tufte/vendor.toml` (`[fuse]`); since Fuse.js 7.3 it is an ES module, so the script adds it
as `<script type="module" integrity=…>` and then imports it from the same URL, which the browser takes from
its module cache. With `params.selfHosted = true` the theme downloads it at build time and serves it from your
site. Without JavaScript the header box is not shown and the results page says so.

**Customising.** The box and the results are styled in `assets/css/theme.css` (`.site-search`,
`.site-search-results`, `.search-page`, `.search-result*`). The strings come from the i18n keys `searchLabel`,
`searchPlaceholder`, `searchLoading`, `searchError`, `searchNoResults`, `searchResults` (`one`/`other`;
`{count}` and `{query}` are filled in by the script), `searchNoScript` and `searchOff`. A script of yours can
search too: `window.tufteSearch.load()` returns a promise of the engine, whose `search(query, limit)` returns
`{entry, section, terms}` objects (`entry` is an index entry, `section` the index of its best-matching
section).

## Slides

A page can also be a slide deck. List the `slides` output format, which the theme declares, in its front matter:

```yaml
outputs: ["html", "slides"]
```

and Hugo writes `slides.html` next to the article (`/posts/my-talk/slides.html`), the same content shown with
[reveal.js](https://revealjs.com). The article's metadata line links to its slides, and the title slide links
back. A site gives every page slides with Hugo's `[outputs] page = ["html", "slides"]`.

- **Slides.** A slide starts at each `##` heading and at each thematic break (`---`) at the top level of the
  article; the break itself is not shown. With `sections: none` only the breaks cut. A **title slide** comes
  first: title (with its `thanks` notes), subtitle, authors, date and the link to the article (`titleSlide =
  false` leaves it out); a front-matter `abstract` follows on a slide of its own. Speaker notes are left out of
  the article, its description, the RSS feed and the search index.
- **Layout.** Each slide is a `<section>` that Tufte CSS lays out as in the article: the text column, the
  sidenotes and margin notes in the margin, figures, tables, listings, theorems and math, with their numbers
  and cross-references. reveal.js scales the slide (`width` × `height`, 1024 × 640 by default) to the window.
  In a narrow window the theme's phone layout applies, with its ⊕ toggles. Dark mode follows the system, as on
  the article. A slide shows what fits: write slides short (reveal.js does not scroll a slide).
- **Speaker notes.** The [`notes`](#notes) shortcode; the **s** key opens reveal.js's speaker view.
- **Fragments.** `{.fragment}` on the line after a paragraph, a list or a table (Goldmark's block attributes)
  shows it one step later; reveal.js's other fragment classes (`fade-up`, `highlight-red`…) work the same way.
- **Keys.** **←** **→** or **Space** to move, **Esc** or **o** for the overview, **f** for full screen, **s** for
  the speaker notes, **?** for the list.
- **PDF.** Open `slides.html?print-pdf` and print to PDF (Chrome or Edge, margins none, background graphics
  on): one page per slide, laid out as on screen (the slides' stylesheet leaves out the article's print rules).

Options: `[params.slides]`, and the page's front matter `slides` over it, key by key. Hugo lowercases the
keys of front matter maps; the theme matches the reveal.js names in any case.

| Key | Default | Meaning |
|---|---|---|
| `titleSlide` | `true` | The title slide. |
| `width`, `height` | `1024`, `640` | The slide size, in pixels, that reveal.js scales to the window (16:10). |
| `margin` | `0.04` | The space around the slide, a fraction of the window. |
| `center` | `false` | `false`: each slide starts at the top, so headings line up; `true`: centred vertically. |
| `transition` | `"fade"` | `none`, `fade`, `slide`, `convex`, `concave` or `zoom`. |
| `slideNumber` | `"c/t"` | The slide number (`"c/t"`: 3/12; `false`: none), bottom left. |
| `hash` | `true` | Each slide has its own URL (`slides.html#/3`). |
| `controls`, `progress` | `true` | The arrows and the progress bar. |

Any other of these reveal.js options may be set too: `transitionSpeed`, `backgroundTransition`, `minScale`,
`maxScale`, `loop`, `navigationMode`, `autoSlide`, `showNotes`, `fragments`, `overview`, `keyboard`, `touch`,
`mouseWheel`, `pdfSeparateFragments`, `pdfMaxPagesPerSlide`, `autoAnimate`, `viewDistance`. Another key prints the
warning `tufte-bad-option`. A string such as `"true"` or `"1200"` (an `HUGO_PARAMS_SLIDES_*` environment
variable) is read as a boolean or a number. A right-to-left language sets reveal.js's `rtl`.

```yaml
slides:
  transition: slide
  slideNumber: false
```

reveal.js 6.0.2 (its core stylesheet, script and notes plugin, no reveal.js theme) comes from the jsDelivr CDN
with SRI hashes (`data/tufte/vendor.toml` `[reveal]`), or from your site with `params.selfHosted`.
`layouts/page.slides.html` writes the deck (no site header, navigation or footer); its canonical link is the
article. reveal.js takes every `<section>` inside a slide for a vertical slide of its own, so the sections a
slide holds (a theorem, a proof) are `<tufte-section>` elements in `slides.html`, and the slides' copy of the
theme stylesheet styles them as sections. Vertical slides and per-slide backgrounds are not supported.

See the example site's [Slides](https://massimo-nocentini.github.io/tufte.hugo/posts/tufte-slides/) post and its
[deck](https://massimo-nocentini.github.io/tufte.hugo/posts/tufte-slides/slides.html).

## Comments, analytics and social links

- **Giscus** is used when `params.giscus.repo`, `repoId`, `category` and `categoryId` are all set. **Disqus** is used when `services.disqus.shortname`
  is set. Comments appear on regular pages inside a section (such as `/posts/…`) when `params.comments.enable`
  (or front matter `comments`) is true. Pages outside any section, such as `content/about.md`, have no comments
  unless their front matter sets `comments: true`. Book chapters never have comments.
- **Google Analytics**: set `services.googleAnalytics.id`. It loads only in production builds.
- **Social links** come from `[params.social]` and appear in the footer.
- **SEO**: Hugo's embedded Open Graph, Twitter card and schema templates are included. The canonical URL and
  RSS alternate link are emitted in `<head>`. Use the `images` front matter for social card images.
  Without a `description` (or `subtitle`), `<meta name="description">` is built from the page's processed
  summary with margin material (sidenotes, margin notes, citations) left out. The Open Graph, Twitter and
  schema.org descriptions are the same text: the theme removes the title and description tags of Hugo's
  templates and emits its own.
- **Pages that are not rendered** (`build: {render: never, list: always}`) are listed without links (in
  summaries, the archive, the book contents, the lists of figures, tables and listings and the index), and
  the post navigation, the book navigation and feeds skip them. Hugo leaves such pages out of taxonomy terms,
  so they appear in neither term pages nor term feeds. An `xref` to a label on such a
  page prints its text without a link. With `book.tocDepth = 1` the contents list such a chapter's `##`
  sections too, also without links. In a book's print document, where the chapter is still printed, the
  xref, the contents entry (and its sections) and the list and index entries link to the chapter or the label
  there.
- **Pages that are not listed** (`build: {list: never}`) are in no page collection, so a book cannot read them
  as chapters: such a page under a book section is an ordinary page (handout layout, its own numbers and
  labels, no book navigation), and an `xref` from the book to one of its labels is undefined; use a full
  `xref` path (`/books/b/page.md#fig:x`) to reach it. `list: local` pages stay chapters. An unlisted
  **section** under a book (a part, or a section inside one) is not in its parent's sections either, so the
  book cannot read it as a part: the section page and every page under it, listed or not, are ordinary pages
  outside the book (no contents entry, numbers, navigation or `print.html`), and the warning
  `tufte-book-structure` names the section when listed pages fall out this way (set `build: {list: never}` on
  those pages too, or drop it from the section). An unlisted section with `book: true` is a book of its own.

## Customisation

**Extra CSS.** Put a file in your site's `assets/` and list it in `customCSS`. It is appended to the theme's
CSS bundle after `et-book.css` (when `etBook` is on), `tufte.css`, `theme.css`, `tufte-latex.css` and
`syntax.css`, in this order, so its rules take precedence. Its `@import` statements (a web font's stylesheet,
for example) are moved to the top of the bundle, since a browser ignores an `@import` that follows other rules;
a relative `@import` URL is then resolved against the bundle, published under `/css/`.

```toml
[params]
  customCSS = ["css/custom.css"]
```

The bundle is minified only in production (`hugo.IsProduction`), fingerprinted, and loaded with an SRI
`integrity` attribute. Never edit `assets/css/tufte.css`: it is vendored verbatim from upstream. The theme's
own rules live in `assets/css/theme.css` (site chrome, lists, code, alerts, dark mode) and
`assets/css/tufte-latex.css` (the tufte-latex layer: note offsets, numbered floats, citations, books, index,
class options and the print geometry). Page-dependent values (margin-note fonts and alignment, paper size,
running heads) are emitted in a small `<style>` after the bundle by `tufte/head-style.html`.

**Extra JavaScript.** The theme ships no JavaScript, except the optional [search](#search). Files in your site's `assets/js/tufte/*.js` (that folder
only) are concatenated in file-name order into `js/tufte-hugo.js`, minified in production, fingerprinted and
loaded on every page as one classic script with `defer` and an SRI `integrity` attribute. They are not ES
modules: an `import` there is a syntax error. Other files under `assets/js/` (for example your own `js.Build`
entry points) are left alone; load their output yourself from `head_custom.html` or `scripts_custom.html`.

**Template hooks.** These partials are empty in the theme. Create a file with the same name in your site's
`layouts/_partials/` to inject markup:

| Partial | Where it is rendered |
|---|---|
| `head_custom.html` | end of `<head>` |
| `header_custom.html` | right after the site header (`</header>`), before `<main>` |
| `before_content.html` | inside the `<article>`, after the title block (title, subtitle, metadata, TOC) and before the content |
| `after_content.html` | inside the `<article>`, after the content (and the summaries and pagination on section pages), before post navigation and comments |
| `footer_custom.html` | right after the site footer (`</footer>`) |
| `scripts_custom.html` | end of `<body>` |

`before_content.html` and `after_content.html` are rendered on single pages, section lists and the archives
page. They are not rendered on the home page (unless `content/_index.md` sets `book: true`: the home page is
then the book landing, which renders them like any book landing) or on taxonomy and term pages. Their context
is the page.
Wrap what you add in a `<section>` to keep it in the Tufte text column.

**Overriding templates.** Any theme file can be replaced by a file at the same path in your site, for example
`layouts/page.html`, `layouts/_partials/post-meta.html` or `layouts/_shortcodes/sidenote.html`.
Take a page's content from the theme's pipeline, not from Hugo's `.Content`, `.Summary` or `.Plain`: those
still hold the theme's unresolved markers (empty figure and table numbers, raw cross-reference keys such as
`fig:rhino`, unconverted footnotes, internal `sn-end`/`tufte-num` elements). The final HTML is
`partialCached "func/content.html" . (or .RelPermalink .Path) false` (the page's sections) or
`partialCached "func/content.html" (dict "page" . "summary" true) (or .RelPermalink .Path) true` (its summary),
the same calls that `page.html`, `post-summary.html` and `rss.xml` make; the front-matter abstract is left out
of both and returned by `partial "tufte/abstract.html" .`. A custom output, such as a JSON search index, uses
the same call. For plain text, drop the heading anchors (`#`) and the margin toggles (`⊕`) first, and put a
space before each block and note, so that the words of a sidenote do not run into the sentence before it:

```go-html-template
{{- $html := partialCached "func/content.html" $p (or $p.RelPermalink $p.Path) false | string -}}
{{- $html = $html | replaceRE `<a class="heading-anchor"[^>]*>[^<]*</a>|<label [^>]*class="margin-toggle[^"]*"[^>]*>[^<]*</label>` ""
      | replaceRE `<(/?)(p|li|h[1-6]|span class="(?:sidenote|marginnote))\b` " <$1$2" -}}
{{- $text := $html | plainify | htmlUnescape | replaceRE `\s+` " " | strings.TrimSpace -}}
```

**Favicon.** If your site has `static/favicon.ico` and/or `static/favicon.svg`, they are linked
automatically (`<link rel="icon">`, the SVG with `type="image/svg+xml"`).

**Dark mode.** The theme follows the reader's `prefers-color-scheme`, with the same colours as Tufte CSS
(`#151515` background, `#ddd` text).

## Languages

The theme ships translations for English, Italian, French, German and Spanish (`i18n/`). Use Hugo's standard
multilingual configuration (`[languages]`). To translate into another language, add `i18n/<lang>.yaml` to your
site with the keys from `i18n/en.yaml`; a key missing there (or the whole file) falls back to the theme's
English string, so the navigation, the skip link and the 404 page are never left without text, and never in
the default language's words either (Hugo's own fallback, which the theme bypasses for its strings: a Japanese
page of an Italian-default site reads “Skip to content”, not “Vai al contenuto”, until `i18n/ja.yaml` has
`skipToContent`). The theme reads that file from your project's `i18n/` directory (`.yaml`, `.yml`, `.toml` or
`.json`, named by the language key in any casing, as Hugo reads it: `ja`, `pt-br`/`pt-BR`, or with a script
subtag `zh-Hans`, `zh-Hant-TW`, `sr-Latn`); strings for a sixth language that come
from another theme or module are not seen, so copy them into your project's `i18n/`. Bibliography entries have their own keys for words whose sense
differs from the interface: `bibOf` ("volume 42 *of* Series"), `bibNumber` and `bibIn` ("*number* 12 *in*
Lecture Notes", capitalized at the start of a sentence), `bibChapter` (the lowercase "chapter 3"
inside an entry), `bibPage` (the lowercase "page 42" of an entry with one page; a range takes `pages`), `bibPageAbbr` and `bibPagesAbbr` (the page locator of `cite page=`: “p. 42”, “pp. 42–45”;
German “S.”) and `bibNamesLast`, the join before the last of three or more names, a template with
`{{ .Names }}` and `{{ .Last }}` (English `"{{ .Names }}, and {{ .Last }}"` keeps plainnat's serial comma;
Italian `"{{ .Names }} e {{ .Last }}"` has none). `edition` is a template with `{{ .Edition }}`, which is a
plain number (“2”) in every language but English, where it is the ordinal (“2nd”); a non-numeric edition
does not use the language's template but the English phrase (Bibliography, Format).
The theorem environments use `thmTheorem`, `thmLemma`, `thmProposition`, `thmCorollary`, `thmConjecture`,
`thmClaim`, `thmDefinition`, `thmExample`, `thmExercise`, `thmRemark`, `thmNotation` and `thmProof` for their
words (a kind of your own reads `thm` + its name capitalised, such as `thmAxiom`, from your `i18n/<lang>.yaml`),
`thmProofOf` for the head of `proof of=`, a template with `{{ .Ref }}` (the reference to the theorem; Italian,
French and Spanish put it in parentheses, “Dimostrazione (Teorema 2)”, since the article would depend on the
kind), `thmPunct` for the period after a head, `thmQed` for the spoken name of the end-of-proof symbol and
`listOfTheorems` for the heading of `listoftheorems`.

Titles that Hugo writes in English are translated too: the 404 page (`pageNotFound`, also in `<title>` and the
social titles), a taxonomy page whose title is Hugo's default, the title-cased plural (no content `_index.md`
for it, or one without a `title`), with the key named after the plural (`tags`, `categories`; add a key such
as `series` to your `i18n/<lang>.yaml` for your own taxonomies), and an archive page without a `title`
(`archives`; its year list is labelled `allPosts` for screen readers).

On a multilingual site, a page that has translations gets a small language switcher under the site header
(`nav.site-languages`, labelled with each language's `label`, formerly `languageName`) and
`<link rel="alternate" hreflang="…">` tags in `<head>` (not on pagers 2 and later, whose translations have no
matching pager). In a book's `print.html` the switcher links to the other languages' `print.html`. On a
multihost site (a `baseURL` per language) the switcher links to a translation on another host by its absolute
URL. Hugo (up to 0.169 at least) publishes global resources, the theme's stylesheet among them, without the
path of a language's `baseURL`: on a multihost site, give each language a `baseURL` without a path
(`https://it.example/`, not `https://it.example/sub/`). `<html>` carries the language's `locale`
(formerly `languageCode`) and, when `direction` (formerly `languageDirection`) is set, a `dir` attribute
(`layouts/_partials/func/lang.html`).

**Right-to-left languages.** Tufte CSS is a left-to-right grid. With `dir="rtl"` the theme keeps that grid,
so the page layout does not change: the text column is on the left, and sidenotes, margin notes, margin
figures and captions are in the right margin. The navigation keeps its layout too: the links with `←`
(“Previous post”, the older one; “Newer posts” of the paginator) are on the left, those with `→` (“Next post”,
the newer one; “Older posts”) on the right. Inside each block, the text
runs right to left: paragraphs, headings, lists, tables (columns from right to left), captions and notes
align to the right. List markers and footnote marks (numbers or letters) hang on the right, in the list's
indent, and so do the other indents (verse lines, index subentries, nested entries of the contents, lists in
notes and margin blocks). On paper a list keeps its indent on the left, where the margin geometry measures it,
and its markers hang just right of the text column. Headings are as wide as the text column (on screen and on paper), so they end where the
paragraphs do, and their notes (a heading note, a `thanks` note on the title) stay in the margin column. Code
and math stay left to right. In the margin, the default alignment (`marginals = "auto"`) is flush to the start
of the line, which is the right edge under `dir="rtl"`. A `####` run-in heading is shown as an ordinary
heading. The back links of taxonomy terms and of the 404 page use `→` under `dir="rtl"`, and the "Read more"
link of a summary uses `←` (the forward arrow in that reading direction, at the end of its text).

## Example site

`exampleSite/` contains a complete demo, including a full Markdown port of the Tufte CSS demo page, a port
of Tufte-LaTeX's `sample-handout.tex` (`posts/sample-handout/`, with its bibliography in
`data/bibliography.yaml`), a port of `sample-book.tex` as a multi-chapter book (`books/sample-book/`), a
small book with parts and numbered chapters (`books/parts-demo/`, with theorems numbered within chapters),
the LaTeX to Hugo cheat sheet with live examples (`posts/latex-to-hugo.md`) and the theorem environments
(`posts/theorems.md`). From the theme's root directory, run:

```sh
hugo server -s exampleSite
```

The example site sets `theme = "tufte.hugo"` and `themesDir = "../.."`, so the theme directory must be named
`tufte.hugo`. Continuous integration builds the example site with the latest Hugo release
(`.github/workflows/ci.yml`) and checks:

- the Tufte markup (sidenotes, margin notes, sections, epigraphs, KaTeX output with the stylesheet of the
  KaTeX release that Hugo embeds) and unique ids;
- sidenotes and real footnotes on the same page (`posts/footnotes-as-sidenotes` with the list at the end of
  the page, `posts/footnotes-and-sidenotes` with a list per section): references and backlinks in both
  directions, letter marks, no Goldmark leftovers, also in a minified build with `sections = "none"` and
  `footnotes = "endnotes"`;
- the tufte-latex acceptance checks: no unresolved markers, unique ids on every page (including the book's
  `print.html`), the numbering of the handout's floats, continuous numbering and cross-references across
  the book's chapters, the lists, the bibliography, the index, the parts demo (numbered chapters, parts, a
  `.bib` bundle resource, the frontispiece) and the cheat-sheet page;
- theorems: the numbers of `posts/theorems` (within sections, a counter of its own, a nested lemma), its
  cross-references, proof heads, end-of-proof symbols (inline, on a line of their own, `\qedhere` in a display)
  and list of theorems; theorems numbered within the chapters of `books/parts-demo` (Theorem 1.1,
  Definition A.1), a cross-chapter reference to a theorem and its link in `print.html`; the `amsthm` look and
  open box with `tufte.style = "latex"`, and `\qedhere` with KaTeX in the browser;
- variant builds with `tufte.style = "latex"`, with `math.engine = "client"` (KaTeX in the browser, with a
  script and stylesheet of the same version) and with A4 paper, numbered sections and `nobib` citations;
- performance: a generated 200-chapter book (with `print.html`, cross-chapter references, figures, theorems, citations,
  chapters with their own `references` cited author-year and from other chapters, a list of figures, a
  bibliography and an index) must build with `--panicOnWarning` within 240 seconds, with its cross-chapter
  numbers, extra labels (2000a, 2000b…) and print document correct, and without computing a page's cached
  results twice in one build (counted with `--templateMetrics`); under `hugo server`, an edit of the first
  chapter must renumber the last one;
- nested and mixed footnotes, in a small generated site: footnotes inside `footnote`, `sidenote` and `fig`
  shortcodes and inside Markdown footnotes, `[^x]` in an image title and in a table caption, and a label
  repeated in the body and in a `table` shortcode. The pages must have no footnote markers left, balanced
  `<span>`s, unique ids, no dangling links and every note's text; a note in a title or caption must not change
  the kind (sidenote or real footnote) of the page's other notes; the automatic summaries must be closed.

### Deploying the example site to GitHub Pages

`.github/workflows/pages.yml` builds the example site and publishes it with GitHub Pages on every push to
`master` (and on demand, from the Actions tab). It installs the latest Hugo release, the same one that
continuous integration tests: the version is looked up at run time in the GitHub releases API (with the
workflow's own token) and printed in the log and the job summary, and the standard edition `.deb` is checked
against the release checksums before it is installed. It then builds with
`hugo --gc --minify --panicOnWarning --baseURL <Pages URL>/` in the production environment, checks that no
URL of the Pages host escapes the site's base path (links, images and `srcset`, `og:image` and
`twitter:image`, CSS `url()`, the sitemap and the RSS feed), and deploys the result with
`actions/deploy-pages`. The site is a project site under a subpath
(`https://massimo-nocentini.github.io/tufte.hugo/`); the theme writes every link and asset URL through
`relURL`/`.RelPermalink`, and resolves a root-absolute path written by an author (`/images/…`, `/index.xml`)
against the base path wherever it takes one: Markdown links and images (also in notes and footnotes), the
`src`, `link` and `attrlink` of the figure shortcodes, the `url` of `blockquote` and `epigraph`, the `src` of
`iframe` and `video`, and the front-matter `images` (or the site-wide `params.images`) of the Open Graph, Twitter
and schema.org tags. So root paths in content get the subpath too.

One-time setup: in the repository, open **Settings → Pages → Build and deployment** and set **Source** to
**GitHub Actions**. The workflow needs no secrets (it reads the Hugo release with the automatic
`GITHUB_TOKEN`); its permissions are `contents: read`, `pages: write` and `id-token: write`. A fork works under its own name too: the workflow checks the theme out into a directory
named `tufte.hugo` and takes the base URL from `actions/configure-pages` (a custom domain included).

## Credits

- [Tufte CSS](https://github.com/edwardtufte/tufte-css) by Dave Liepmann and contributors, MIT License.
  `assets/css/tufte.css` is vendored without changes, except that the `@font-face` rules were moved to
  `assets/css/et-book.css`. See [LICENSE-tufte-css](LICENSE-tufte-css).
- [ET Book](https://github.com/edwardtufte/et-book) by Dmitry Krasny, Bonnie Scranton and Edward Tufte,
  MIT License. The font files in `static/et-book/` are taken from the Tufte CSS distribution.
- The theme structure follows [Beautiful Hugo](https://github.com/halogenica/beautifulhugo).
- [KaTeX](https://katex.org) for math typesetting (MIT License).
- [Tufte-LaTeX](https://github.com/Tufte-LaTeX/tufte-latex) (Apache License 2.0) is the model of the
  tufte-latex parity features. The example site ports its `sample-handout.tex`, `sample-book.tex` and
  `sample-handout.bib`; the figures in `exampleSite/static/images/latex/` were converted to SVG from the PDF
  graphics of its `graphics/` directory.

tufte.hugo is © 2026 Massimo Nocentini and released under the [MIT License](LICENSE).
