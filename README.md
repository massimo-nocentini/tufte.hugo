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
and a print stylesheet with the LaTeX page geometry (see [tufte-latex parity](#tufte-latex-parity)).

The theme is organised like [Beautiful Hugo](https://github.com/halogenica/beautifulhugo) and uses the
Hugo 0.146 template system (`layouts/baseof.html`, `home.html`, `page.html`, `list.html`, plus
`layouts/_partials/`, `layouts/_shortcodes/` and `layouts/_markup/`).

- **Hugo**: 0.146.0 or newer. The standard edition is enough; the extended edition is not required.
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
- [Math](#math)
- [tufte-latex parity](#tufte-latex-parity): [options](#options-paramstufte), [notes](#notes-in-the-margin),
  [floats](#floats-figures-tables-listings), [cross-references](#cross-references-and-labels),
  [bibliography](#bibliography), [books](#books), [index](#index), [printing](#printing-and-pdf),
  [warnings](#warnings), [LaTeX to Hugo cheat sheet](#latex-to-hugo-cheat-sheet)
- [Syntax highlighting](#syntax-highlighting)
- [Pages and layouts](#pages-and-layouts)
- [Comments, analytics and social links](#comments-analytics-and-social-links)
- [Customisation](#customisation)
- [Languages](#languages)
- [Example site](#example-site)
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
      [markup.goldmark.parser.attribute]
        block = true            # REQUIRED for {.fullwidth} on tables, {cite="…" author="…"} on blockquotes
                                # and labels/captions on images, tables and equations ({#fig:x})
        title = true            # {#sec:x} labels on headings
    [markup.goldmark.extensions]
      # The footnote extension is on by default; the theme turns footnotes into sidenotes.
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
and nested tables are merged key by key.

| Parameter | Default | Meaning |
|---|---|---|
| `subtitle` | `""` | Shown under the site title on the home page. |
| `description` | `""` | Last fallback for `<meta name="description">`. The page's front matter `description` comes first, then its `subtitle`, then (regular pages, book landings and part pages) the first 160 characters of its plain-text summary; this value is used only when all of them are empty, so mostly on the home page and the other list pages. |
| `dateFormat` | `"January 2, 2006"` | Go layout used for dates (localised by Hugo). |
| `sections` | `"h2"` | `"h2"`: wrap the article in a new `<section>` at each `<h2>`. `"none"`: put the whole article in one `<section>`. Front matter `sections` overrides it. |
| `footnotes` | `"sidenotes"` | `"sidenotes"`: Markdown footnotes `[^x]` become numbered sidenotes (labels starting with `fn-` stay real footnotes). `"endnotes"` (alias `"footnotes"`): they are real footnotes, listed by the theme in a `<section class="footnotes">` below the text (labels starting with `sn-` become sidenotes). Front matter `footnotes` overrides it. See [Footnotes and sidenotes](#footnotes-and-sidenotes) for `footnotestyle` and `footnoteplacement`. |
| `etBook` | `true` | Load the bundled ET Book web fonts. With `false`, the fallback serif stack from Tufte CSS is used. |
| `showReadingTime` | `true` | Show the reading time in the post metadata. |
| `showWordCount` | `false` | Show the word count in the post metadata. |
| `showPostNav` | `true` | Show previous and next post links at the end of posts. |
| `toc` | `false` | Show a table of contents. Front matter `toc` overrides it. |
| `readMore` | `true` | Show a "Read more" link under each summary that Hugo cut (`.Truncated`: a `<!--more-->` divider, or an automatic summary shorter than the page). |
| `homeIntro` | `true` | Render the content of `content/_index.md` above the post list on the home page. |
| `customCSS` | `[]` | Paths under your site's `assets/` (for example `["css/custom.css"]`). They are appended to the CSS bundle, so they win. |
| `copyright` | `""` | Footer text. Default: `© YEAR Author`. |
| `selfHosted` | `false` | `true`: download the third-party files (KaTeX) at build time, check them against their SRI hashes and serve them from your site instead of the CDN. See [Math](#math). |
| `mainSections` | Hugo default | Sections listed on the home page and archives. Set it with Hugo's **top-level** `mainSections` key (for example `mainSections = ["posts"]`, above `[params]`); when unset, Hugo computes it from the section with the most pages. The legacy `params.mainSections` is still honoured and wins when set. |

### `[params.author]`

| Key | Meaning |
|---|---|
| `name` | Default author for posts, the copyright line and metadata. |
| `email` | Author e-mail. Not shown by the theme; available to your own templates (for example `head_custom.html`). Use `params.social.email` for a visible link. |
| `url` | Author home page. |

A plain string, `[params] author = "Jane Doe"` (the form many other themes use), is accepted too and
counts as the `name`.

### `[params.social]`

Links shown in the footer. Leave a key empty to hide it.

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
| `macros` | `[]` | KaTeX macros for the whole site, merged with front matter `mathMacros` (the page wins). Write them as a list of pairs, `[["\\RR", "\\mathbb{R}"]]`: Hugo lowercases the keys of maps, so the map form `{ "\\RR" = "…" }` would define `\rr`. A list of `{ name = "\\RR", value = "\\mathbb{R}" }` tables works too. |
| `fleqn` | `false` | Set display math flush left (with a 2em indent). |
| `leqno` | `false` | Put equation numbers on the left, as LaTeX's `leqno`: both the theme's `\label` numbers and KaTeX's `\tag{…}`. |
| `errorColor` | `""` | Colour of invalid TeX. Empty: the theme's red, adapted to dark mode. |
| `strict` | `"error"` | KaTeX `strict` mode: `"error"`, `"ignore"` or `"warn"` (`ignore` and `warn` need Hugo 0.147.6 / 0.147.7 for the server engine). |
| `minRuleThickness` | `0.04` | Minimum thickness of fraction lines, in em. |
| `katexVersion` | `"auto"` | KaTeX version of the CDN files. `"auto"` (or empty) loads the release that matches the Hugo running the build (see [Math](#math)). A version listed in `data/tufte/vendor.toml` uses the bundled hashes; any other version also needs `katexIntegrity` (CSS), `katexJSIntegrity` and `katexAutoRenderIntegrity` (client engine), or the build stops. The former default `"0.16.11"` counts as `"auto"`. |
| `katexCSS` | `""` | Optional: another URL for the KaTeX stylesheet, with `katexIntegrity` as its SRI hash. |

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
| `title` | Page title, rendered as the article's `<h1>`, and the `<title>`, OpenGraph, Twitter, schema.org and RSS title. |
| `linkTitle` | Short title for links (Hugo's link title): summary titles, the archive and term lists, the previous/next post navigation and book navigation. Default: `title`. |
| `subtitle` | Rendered as `<p class="subtitle">` under the title. Also used as the meta description when `description` is empty. |
| `date` | Publication date. |
| `lastmod` | Last modification. Shown as "updated on" when it differs from `date` (in the post metadata line, so not with `tufte.titleBlock = "latex"` nor in book chapters). |
| `author` | Author name for this page. Overrides `params.author.name`. |
| `description` | Meta description and summary for social cards. When empty, the meta description falls back to `subtitle`, then (regular pages, book landings and part pages) the plain-text summary, then `params.description`. |
| `tags`, `categories` | Taxonomy terms. Both are listed in the post metadata (categories first, separated by commas; tags in small caps). |
| `toc` | `true`/`false`. Overrides `params.toc`. |
| `showReadingTime`, `showWordCount` | `true`/`false`. Override `params.showReadingTime` / `params.showWordCount` for this page. Both are part of the post metadata line, which `tufte.titleBlock = "latex"` and book chapters do not show. |
| `showPostNav` | `true`/`false`. Overrides `params.showPostNav` for this page. |
| `sections` | `"h2"`/`"none"`. Overrides `params.sections`. |
| `footnotes` | `"sidenotes"`/`"endnotes"`. Overrides `params.footnotes`. |
| `math` | `true` always loads the KaTeX assets on this page (with the client engine, this also makes KaTeX scan the article for `$…$`, `$$…$$`, `\(…\)`, `\[…\]` when the passthrough extension is off). `false` never loads them, even if the page contains math. |
| `mathMacros` | KaTeX macros for this page, added to `params.math.macros` (same list-of-pairs form), e.g. `mathMacros: [["\\E", "\\mathbb{E}"]]` in YAML. |
| `comments` | `true`/`false`. Overrides `params.comments.enable`. `true` is needed on pages outside any section (such as `content/about.md`), which have no comments otherwise. |
| `draft` | Hugo's standard draft flag. |
| `images` | Images for Open Graph and Twitter cards. |
| `layout` | Set `layout: archive` on a page to render the archives (posts grouped by year; undated pages, such as book chapters, last under “Undated”). |

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
- **Tables** are wrapped in `<div class="table-wrapper">` so they scroll on small screens.
- **Note ids.** Every sidenote, margin note, margin figure and figure caption made by a shortcode or a render
  hook gets a unique id (`<hash of the page URL>-<n>`, from a per-page counter, e.g. `sn-1a2b3c-4`). A Markdown
  footnote turned into a sidenote gets a deterministic id built from Goldmark's reference id
  (`sn-<hash>-fnref-<n>`, e.g. `sn-1a2b3c-fnref-2`), and a real footnote gets `fn-<hash>-<key>` and
  `fnref-<hash>-<key>` (the key is the Markdown label, or `s<n>` for the `footnote` shortcode). The hash comes from the page URL, so ids do not collide on list pages that show
  several summaries.

Everything else is done with the shortcodes and Markdown features below.

## Shortcodes

There are two kinds of shortcodes:

- **Inline** (`sidenote`, `marginnote`, `newthought`, `sans`) are used **inside a paragraph**, with the
  `{{< name >}}…{{< /name >}}` form. Their inner text is rendered as *inline* Markdown (emphasis, links,
  code and inline math work; paragraph breaks become line breaks). A note is a `<span>`, so a list, code
  block, quote or table in it is turned into inline blocks laid out like the original, and the warning
  `tufte-block-in-note` suggests `marginblock` or a real footnote instead.
- **Block** (`epigraph`, `blockquote`, `fullwidth`) are placed **on their own lines**. Their inner text is
  rendered as *block* Markdown, so it can contain several paragraphs.

Shortcodes can be nested with the `{{< >}}` form, e.g. a `sidenote` inside a `blockquote`, or a `figure`
inside `fullwidth`. The HTML of the nested shortcode is kept as is and the Markdown around it is still
rendered, also with `markup.goldmark.renderer.unsafe = false`. HTML tags written by hand in the inner text
follow the site's Goldmark setting: with `unsafe = false` they are dropped (warning `tufte-raw-html`), as in
the body. A third-party shortcode that prints HTML inside a theme shortcode needs `[params.tufte]
innerHTML = true`, which keeps every balanced run of tags in inner texts (only for trusted content).
Escaped shortcodes (written with Hugo's `/* … */` escape) in inner texts print as text, as in the body. A Markdown
footnote referenced in a shortcode's inner text (a caption, a note, a table cell: `[^x]`) becomes a real
footnote of the page, listed below the text, whether its `[^x]:` definition is written inside the inner text
or elsewhere on the page (a `[^x]` with no definition prints the warning `tufte-undefined-ref`). A margin
note or caption cannot hold a sidenote, so such a footnote stays a real footnote whatever the `footnotes`
mode.

A shortcode may sit inside a Markdown blockquote, with every line of it, closing tag included, quoted
(`> {{< marginblock >}}`, `> Text.`, `> {{< /marginblock >}}`): the quote markers belong to the enclosing
quote and are removed from the inner text. A quote written *inside* a block shortcode (its closing tag on
an unquoted line of its own) stays a quote.

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
| `src` | Image path. It is looked up as a page resource (page bundle), then as a global resource in `assets/`, and otherwise used as a URL (for example a file in `static/`). |
| `alt` | Alternative text. |
| `caption` | Caption (inline Markdown). For `main`, it is a margin note next to the image. For `fullwidth`, it is a `<figcaption>`. For `margin`, it is placed under the image in the margin. |
| `type` | `main` (default), `margin` or `fullwidth`. |
| `link` | Wrap the image in a link to this URL. |
| `width`, `height` | `<img>` dimensions. Raster images from page or global resources get their intrinsic size by default. |
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
(`{{< fullwidth class="justify" >}}`).

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
| `title` | Accessible title of the iframe (default "Embedded content"). |
| `ratio` | Aspect ratio, for example `16/9` (default), `4:3` or `4x3`. |
| `allow` | Value of the iframe's `allow` attribute. |
| `class` | Extra classes for the `<figure>`. |

```markdown
{{< iframe src="https://player.vimeo.com/video/76979871" title="The New Vimeo Player" ratio="16/9" >}}
```

### `youtube`

Embeds a YouTube video through the privacy-enhanced `youtube-nocookie.com` domain, inside
`<figure class="iframe-wrapper">`. It replaces Hugo's built-in `youtube` shortcode. The video id can be
positional or named. The other parameters need the named form.

| Parameter | Meaning |
|---|---|
| `id` | Video id (required). |
| `title` | Accessible title of the iframe (default "YouTube video"). |
| `start`, `end` | Start and end time, in seconds. |
| `class` | Extra classes for the `<figure>`. |

```markdown
{{< youtube YE7VzlLtp-4 >}}
{{< youtube id="YE7VzlLtp-4" title="Edward Tufte" start="30" >}}
```

### `video`

A self-hosted video as a Tufte figure: in the text column with its caption as a margin note, or full width
with a `<figcaption>`. `src` and `poster` resolve like figure sources (page resource, `assets/` resource,
`static/` path, URL); a resource also gives the `<source>` its MIME type.

| Parameter | Meaning |
|---|---|
| `src` | Video file (required). |
| `poster` | Image shown before playback. |
| `caption` | Caption, inline Markdown. |
| `title` | Accessible label of the video (default: the caption as plain text). |
| `type` | `main` (default) or `fullwidth`. |
| `controls` | Player controls, on by default; `controls="false"` hides them. |
| `autoplay`, `loop`, `muted`, `playsinline` | `"true"` to enable. `autoplay` implies `muted` and `playsinline`. |
| `width`, `height` | Attributes of the `<video>`. |
| `class` | Extra classes for the `<figure>`. |

```markdown
{{< video src="flow.mp4" poster="flow.jpg" caption="Water flow, *slowed down*." >}}
{{< video src="/media/loop.webm" type="fullwidth" autoplay="true" loop="true" >}}
```

### `details` (Hugo built-in)

Hugo's own [`details`](https://gohugo.io/shortcodes/details/) shortcode (Hugo 0.140 and later) works as is;
the theme keeps the `<details>` element in the text column and sets its summary in the sans face.

```markdown
{{< details summary="Why sidenotes?" >}}
Because the eye never leaves the sentence.
{{< /details >}}
```

## Render hooks

Plain Markdown is rendered into Tufte markup by the hooks in `layouts/_markup/`.

### Images (`render-image.html`)

| Markdown | Output |
|---|---|
| Image inside a paragraph | a plain `<img loading="lazy">` |
| Image alone on its line, with a title | `<figure>` with the title as a margin-note caption |
| Image alone on its line, without a title | `<figure><img></figure>` |
| Linked image alone on its line, `[![alt](src "Caption")](url)` | the same figure, with the link around the `<img>` only |

```markdown
![Exports and imports of Scotland](exports-imports.png "From Edward Tufte, *Visual Display of Quantitative Information*, page 92.")
```

An image counts as a block only when the site sets
`markup.goldmark.parser.wrapStandAloneImageWithinParagraph = false` (see
[Required site configuration](#required-site-configuration)). Without it, every image is inline.

A linked image alone on its line (`[![alt](src "Caption")](url)`) is a figure too: the link goes around the
image inside the figure, and the paragraph around it is dropped (a `<figure>` may not sit inside a `<p>` or
an `<a>`). A linked image with a title that shares its line with text becomes a linked plain image followed
by its caption. A class attribute on the next line applies to the link's paragraph, not to the image, so a
linked image is always a main figure: for a linked margin or full-width figure use the `marginfigure` or
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
| `offset` | Moves the caption, e.g. `offset="1bl"` (one baseline down) or `offset="-1rem"`. |
| `captionpos` | `"bottom"` aligns the caption with the bottom of the image. |
| `cite` | Citation keys (`cite="tufte2001,tufte2006"`) whose references are appended to the caption. |
| `numbered` | `numbered=false`: no number for this figure. |

```markdown
![A helix](helix.svg "The helix $x = \cos(2\pi z)$.")
{#fig:helix .margin offset="1bl" cite="tufte2001"}
```

The shortcodes offer more options (`attr`, `link`, `inline`).

Inside a sidenote, a margin note, a figure caption or a footnote, an image is always rendered as a plain
inline `<img>`, even when it is alone (a `<figure>` cannot sit in the note's `<span>`); its title, if any,
follows it as text. For an image in the margin, use the `marginfigure` shortcode, or put the image in a
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
on the page. The theme removes these placeholders from the ids, from the links of the page and book
contents, and from their texts: `## Notes {{</* sidenote */>}}…{{</* /sidenote */>}}` gets the id `notes` on
every Hugo version. Two headings that differ only by their shortcodes would then share an id, and an
automatic id may later change if you edit the heading: give such headings an explicit id
(`## Notes {{</* sidenote */>}}…{{</* /sidenote */>}} {#sec:notes}`).

### Links (`render-link.html`)

Resolves links to other pages and to page resources to their site-relative URL, so content works under a
sub-path `baseURL`. External links are rendered unchanged.

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
`{{< xref "fn:x" >}}` prints the footnote's mark and links to it.

Inside a sidenote the text is inline: paragraph breaks of a long Markdown footnote become line breaks, and
a list, code block, quote or table becomes inline blocks (warning `tufte-block-in-note`: label such a note
`[^fn-…]` to keep it a real footnote). A real footnote is block content in its list, so its paragraphs,
lists and code blocks stay as they are.

A `cite` in a Markdown footnote turned sidenote (`[^a]: As shown {{< cite "tufte2006" >}}.`, the form of
tufte-latex's `\footnote{… \cite{…}}`) adds its references as a citation block at the end of that sidenote,
as `cite` does inside the `sidenote` shortcode: one footnote stays one numbered note (in a footnote that stays
a real footnote, the block ends the footnote). A `sidenote` or
`marginnote` shortcode in such a footnote cannot float inside it: its text stays inline in the note and the
warning `tufte-note-in-note` is printed.

The same holds for the shortcodes: a `sidenote` or `marginnote` (or a margin figure) nested in a `sidenote`,
`marginnote`, `footnotetext` or `marginblock`, in a cell of a `margintable`, or in a figure or table caption,
would float out of the margin column (tufte-latex stops with “Float(s) lost”). Its toggle is dropped, its text
stays inline as `<span class="note-in-note">…</span>`, it takes no number, and `tufte-note-in-note` is printed.
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
| `footnoteplacement` | `"page"`, `"section"` | `"page"` | `page`: one list at the end of the article, in `<section class="footnotes">`. `section`: a list at the end of each `<section>` (each `##` heading, see `sections`) where the notes are referenced, the closest the web gets to the bottom of a printed page. |
| `citeas` | `"sidenote"`, `"footnote"` | `"sidenote"` | Where `{{< cite >}}` puts its reference; a single `cite` can override it with `as="footnote"`. |

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
…text<sup class="footnote-ref" id="fnref-3f2a9c-proof"><a href="#fn-3f2a9c-proof" role="doc-noteref">a</a></sup>…

<section class="footnotes" role="doc-endnotes" aria-label="Footnotes">
  <hr class="footnotes-sep">
  <ol class="footnotes-list">
    <li id="fn-3f2a9c-proof" class="footnote-item" data-mark="a"><p>Text <a href="#fnref-3f2a9c-proof" class="footnote-backref" role="doc-backlink" aria-label="Back to text">↩︎</a></p></li>
  </ol>
</section>
```

`3f2a9c` is a hash of the page URL, so ids stay unique on list pages that show several summaries. A footnote
referenced twice gets one item with a backlink to each reference. On list pages, footnote references are
removed from summaries (a summary has no footnote list to link to), while sidenotes in summaries are kept.

Older configurations keep working: `footnotes = "endnotes"` without any `sn-` label renders Markdown
footnotes as a footnote list, as before.

Known limits: a footnote inside a `footnote` shortcode is moved out of it (its mark follows the outer
footnote's mark in the text, and its item follows the outer item in the list), and a sidenote or margin
note inside a footnote stays inside the footnote's list item.

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
footnotes turned into sidenotes, since their text goes through the same render hook.

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
environments number their lines, but KaTeX counts each formula separately, so each starts again from (1): use
`\label` for numbers that run through the document. `\tag{…}` sets a fixed tag (on the right; `leqno = true`
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
unstyled. The theme therefore picks the KaTeX release by Hugo version (`hugo.Version`):

| Hugo | Embedded KaTeX | Stylesheet and scripts loaded |
|---|---|---|
| 0.146.0 – 0.165.x | 0.16.x | `katex@0.16.21` |
| 0.166.0 and later | 0.18.x | `katex@0.18.4` |

The client engine loads `katex.min.js` and `auto-render.min.js` of the same release as the stylesheet, so
script and CSS always agree. Setting `katexVersion` to a release that differs from Hugo's embedded one gives
the warning `tufte-katex-version` with the server engine.

**CDN, hashes and self-hosting.** The files are loaded from jsDelivr with the SRI hashes listed per release
in `data/tufte/vendor.toml` (one `[[katex]]` entry per release, with the first Hugo version that embeds it).
With `params.selfHosted = true`, the files are downloaded at build time, checked against those hashes and
published under `/katex/`. The stylesheet loads its fonts from `fonts/` next to itself, so a self-hosted site
must copy the `dist/fonts/` directory of the **same** KaTeX release to `static/katex/fonts/`.

## tufte-latex parity

Beyond Tufte CSS, the theme reproduces at HTML level what the
[Tufte-LaTeX](https://github.com/Tufte-LaTeX/tufte-latex) document classes do in TeX: `tufte-handout` for single
pages and `tufte-book` for multi-chapter books. That covers margin material with offsets, numbered floats with
their captions in the margin, citations in the margin with a bibliography, cross-references, book structure
(front, main and back matter, parts, chapters, appendices), a title page, contents, lists of figures and
tables, an index, LaTeX-like typographic options and a print stylesheet with the LaTeX page geometry. The
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
  `printindex`, `tableofcontents`, `abstract`, `verse`, `clearpage`, `tuftebreak`, `clearmargin`.
  A block written inside a paragraph (`Text {{< bibliography >}}`) would put block HTML in a `<p>`: the theme
  then splits the paragraph around it (the text before and after it stay paragraphs) and prints the warning
  `tufte-block-in-paragraph`.

Shortcodes nest: a `cite`, `xref`, `smallcaps` or `index` inside a `sidenote`, a `fig` caption or a `table`
works as expected. Never mix positional and named parameters in one call: each shortcode has a short
positional form (`{{< xref "fig:x" "full" >}}`) and a named form (`{{< xref ref="fig:x" fmt="full" >}}`).
The inline formatting shortcodes also have a one-line form, `{{< smallcaps "PDF" />}}`, and so do
`sidenote`, `marginnote`, `footnote`, `newthought` and `sans` (see [Shortcodes](#shortcodes)).

### Required site settings

The settings of [Required site configuration](#required-site-configuration) are enough. Two of them matter
more here: `parser.attribute.block = true` gives ids and captions to Markdown images, tables and display
equations (`{#fig:x}`), and `parser.attribute.title = true` gives headings their labels
(`## Page Layout {#sec:page-layout}`).

### Options: `[params.tufte]`

All keys are optional and case-insensitive. Each one can be set in the site configuration under
`[params.tufte]`, or in front matter under `tufte:`. A value is looked up **key by key**: the page, then the
nearest part, then the book root, then the site, then the defaults of the style preset. So a chapter can
set `tufte: {justified: true}` and keep everything else from the book and the site. (Do not use Hugo's
`cascade` for `tufte`: it replaces the whole map.)

| Key | Default (`css` / `latex`) | LaTeX | Meaning |
|---|---|---|---|
| `style` | `"css"` | — | Preset of defaults: `"css"` (Tufte CSS look) or `"latex"` (tufte-handout / tufte-book look). |
| `titleBlock` | `"css"` / `"latex"` | `\maketitle` | `"css"`: h1, subtitle and the post metadata line. `"latex"`: italic author and date lines, followed by a line with only the categories and tags; the reading time, word count and “updated on” date of the metadata line are not shown. |
| `justified` | `false` | `justified` | Justify the body text. |
| `hyphenate` | `false` / `true` | — | Automatic hyphenation of the text column (needs `<html lang>`). |
| `indent` | `false` / `true` | book `\parindent` | Paragraphs indented instead of separated by space. |
| `sfsidenotes` | `false` | `sfsidenotes` | Sans-serif margin material, title block and abstract (chapter titles stay italic serif, as in tufte-book). |
| `letterspacing` | `true` | `ls` / `nols` | Letterspacing of `allcaps`, `smallcaps`, `sc`, `newthought`. |
| `numerals` | `"lining"` / `"oldstyle"` | mathpazo `osf` | Old-style figures in the text (ET Book). |
| `marginals` | `"auto"` | `marginals=` | Alignment of all margin material: `justified`, `raggedright`, `raggedleft`, `raggedouter`, `auto` (follows `justified`). |
| `sidenote.align`, `marginnote.align`, `caption.align`, `citation.align` | `""` | `sidenote=` … | Override `marginals` for one kind of margin material. |
| `sidenote.font`, `marginnote.font`, `caption.font`, `citation.font` | `""` | `\setsidenotefont` … | Words: `italic`, `upright`, `sans`, `serif`, `mono`, `small`, `smaller`, `normal`, and a `#hex` colour. `small` and `smaller` are 0.9 and 0.8 of the default note size (0.99rem and 0.88rem; 0.9rem and 0.8rem with `sfsidenotes`), in rem, so the size is the same wherever the note sits (paragraph, title heading, caption, citation inside a note). |
| `floats.number` | `"auto"` / `true` | — | Number figures and tables: `true`, `false`, or `"auto"`: always in a book; in a handout as soon as the page has a labelled float or equation, or any `xref` or `eqref`, whatever it points to (a cross-reference to a section also numbers the page's captioned floats), or a `listoffigures`, `listoftables` or `listoflistings` (a list of floats is a list of numbered floats). Set `false` to keep Tufte CSS's unnumbered captions on such a page. |
| `headings.number` | `0` | `secnumdepth` | `1` numbers `##`, `2` numbers `##` and `###`. `{.unnumbered}` skips one heading. |
| `headings.strict` | `false` | — | `#####`/`######` give a warning (`false`) or stop the build (`true`). |
| `bibliography.data` | `"bibliography"` | `\bibliography{…}` | Key of `site.Data` holding the database (`data/bibliography.yaml`, `.json`, `.toml`, or a `data/bibliography/` directory). |
| `bibliography.style` | `"tufte"` / `"plainnat"` | `\bibliographystyle` | List order: `tufte` (order of citation) or `plainnat` (sorted by author, year, title). |
| `bibliography.list` | `true` (books: `false`) | `\nobibliography` | Append the list of references at the end of a handout. |
| `bibliography.margin` | `true` | `nobib` | `false`: citations become `[n]`, linked to the list. |
| `bibliography.heading` | `""` | — | Heading of the list; empty means the translated “References” (handouts) or “Bibliography” (books). |
| `book.numberChapters` | `false` | `secnumdepth` | Number the chapters (tufte-book leaves them unnumbered). |
| `book.continuous` | `true` | — | Sidenote, figure, table and equation numbers run through the whole book. |
| `book.toc` | `true` | `notoc` | Contents on the book's landing page. |
| `book.tocDepth` | `0` | — | `0`: chapters only; `1`: also their `##` sections. |
| `book.titlepage` | `true` | `titlepage` / `notitlepage` | Full title page on the landing page. |
| `print.paper` | `"letter"` | `a4paper`, `b5paper` | Paper of the print stylesheet: `"letter"`, `"a4"`, `"b5"`. |
| `print.runningHeads` | `false` / `true` | `fancyhdr` | Running heads when printing (Chromium 131 or later). |
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
| `author` | `\author` | A name, a list of names, or a list of `{name, thanks}`. Falls back to `params.author.name`. Each `thanks` is a sidenote after the name, in the author line (`titleBlock = "latex"`) or in the metadata line (`"css"`). |
| `thanks` | `\thanks` | A string or a list: sidenotes attached to the title. |
| `dateText` | `\date{text}` | Free text shown instead of the date (`date` remains the sort key), in both title blocks and in the summaries' metadata line. |
| `showDate` | `\date{}` | `false` hides the date (both title blocks, summaries). |
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
and chapters, `print.html`), summary titles, the archive and the term and taxonomy lists render it, so a title may contain inline Markdown such as `` `tufte-book` ``, `*emphasis*` or a
`[link](…)`. Math (`$…$`, `\(…\)`) is typeset in an h1 and left as written everywhere else, while the
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
block. The text shows the current counter, as in LaTeX, so no other numbered note may sit between the two:

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
| a Markdown table + `{#tab:x caption="…"}` on the next line (`{#tab:x}` alone: a labelled table without a number) | `table` |
| `{{< fullwidthtable … >}}`, `{{< table type="fullwidth" … >}}` | `table*` |
| `{{< margintable caption="…" offset="…" >}}…{{< /margintable >}}` | `margintable` |
| `{{< listing caption="…" label="lst:x" style="ruled" >}}` + a fenced code block | algorithm/listing floats (`plain`, `ruled`, `boxed`) |
| `{{< subfigures cols=2 type="fullwidth" caption="…" >}}` + images on consecutive lines | `\fbox` grids, subfigures |

Common parameters of the float shortcodes (`figure`, `marginfigure`, `fullwidthfigure`, `fig`, `table`,
`fullwidthtable`, `margintable`, `listing`, `subfigures`):

| Parameter | LaTeX | Meaning |
|---|---|---|
| `label` | `\label` | Key for `xref` (e.g. `fig:helix`; `:` and `-` are equivalent). |
| `short` | `\caption[short]{…}` | Caption used in the lists of figures and tables. |
| `offset` | `\caption[][offset]{…}` | Moves the caption. |
| `captionpos` | `\setfloatalignment{b}` | `"top"` (default) or `"bottom"`: align the caption with the bottom of the float. Text-column and full-width floats only: a margin float (`marginfigure`, `margintable`, `type="margin"`) always has its caption after its body, and `captionpos="bottom"` on it prints the warning `tufte-bad-option`. |
| `numbered` | — | `false`: no number for this float (and no entry in the lists of figures and tables, like `\caption*`). With a `label`, `xref` still finds it and prints its name: the short caption, else the caption, else the `alt` text. The same holds for a labelled float without a caption; one with no text at all (a table with only a label) gives, as `\ref` after a `\label` with no `\caption`, the number of the enclosing section, else its title. |
| `cite` | `\cite` in `\caption` | Keys whose references are appended to the caption. |
| `class` | — | Extra classes for the `<figure>` (for `margintable`, for the margin block). |
| `type` | `figure*`, `table*` | `"main"` (default) or `"fullwidth"` (`table`, `listing`, `subfigures`; the figures also take `"margin"`). |

`figure`, `marginfigure` and `fullwidthfigure` keep their single-tag form (they never take inner content).
`fig` is their block form and must be closed. In `subfigures`, put the images on **consecutive lines**: a blank
line between them would turn each one into a figure of its own. In `table`, a caption may also be given as the
first paragraph of the inner content, like `\caption` inside the environment. A Markdown footnote `[^1]`
in a `table` cell or caption is a real footnote listed below the text; for a note in the margin beside the
table, as in LaTeX, use `footnotemark`/`footnotetext`. In `subfigures`, the title of each image becomes a
subcaption under it, lettered in order: `![Alt](a.png "Handout")` gives “(a) Handout”. Like every caption,
the title is inline Markdown (`"*Book*"`, `"$x^2$"`); it is taken off the image, so no tooltip repeats it.
A shortcode in the caption of a Markdown image (its title) or table (`caption="…"`) behaves as in a
`caption=` parameter: a `cite` joins the caption's citation block, and a `sidenote` or `marginnote` stays inline
text with the warning `tufte-note-in-note`.
`cols` sets the number of columns of the `subfigures` grid (1–12, default 2; another value prints the
warning `tufte-bad-option` and is ignored).

### Cross-references and labels

| Shortcode | LaTeX | Output |
|---|---|---|
| `{{< xref "fig:x" >}}` | `\ref` | the number, or the name of an unnumbered target |
| `{{< xref "fig:x" "full" >}}` | `Figure~\ref{fig:x}` | “Figure 3”, with a non-breaking space |
| `{{< xref "sec:x" "name" >}}` | `\nameref` | the section title, or the short caption |
| `{{< xref "err:x" "page" >}}` | `\pageref` | the enclosing section title; in a book, the target chapter's title (`linkTitle`) when the target is in another chapter |
| `{{< xref "fig:x" "num" >}}` | — | the number only, `??` when there is none |
| `{{< xref "fig:x" "auto" >}}` | `\ref` | the default format, written out: the number, else the name |
| `{{< xref "eq:x" "eq" >}}` | `\eqref` | the number in parentheses, “(3)”, like `eqref` |
| `{{< eqref "eq:x" >}}` | `\eqref` | “(3)” |
| `{{< label "err:x" >}}` | `\label` anywhere | an anchor at that point |

Named forms: `{{< xref ref="fig:x" fmt="full" >}}`, `{{< eqref ref="eq:x" >}}`, `{{< label key="err:x" >}}`.

Labels come from `label=` on floats, notes and the `label` shortcode, from `{#id}` on headings, images, tables
and equations, from `\label{…}` inside display math, and from front matter `label` (a chapter). Keys are
normalised: `fig:x` and `fig-x` are the same label. A key needs at least one letter or digit: `{{< label "!!!" >}}`
stops the build, and such a `label=` elsewhere is ignored with the warning `tufte-bad-option`. Labels are **global within a book**: `xref` looks in the
current page first, then in the whole book, so references work across chapters, forwards and backwards. To
point at a page outside the book, write `path#key` (`{{< xref "/posts/other.md#fig:x" "full" >}}`).
Unknown keys print `??` and the warning `tufte-undefined-ref`.

A key defined twice prints `tufte-duplicate-label`, and the first definition wins (a later element with the
same id, e.g. a second `{{< label "dup:x" >}}` written `dup-x`, gets the id `dup-x-2`, so the page stays
valid HTML). Headings are the
exception: the id Goldmark derives from a heading's title (`## Results` → `results`) gives way to any
other label with that key (`label="results"` on a figure), with the same warning. An id written in the
Markdown (`## Results {#results}`) is a label like any other. When the two elements would
carry the same HTML id, the other element is renamed (`results-figure`), so the page has no duplicate id,
xrefs reach the figure and the table of contents still reaches the heading. Rename one of them to silence
the warning. A `####` run-in heading, like the `paragraph` shortcode, prints the enclosing section number
with `auto` when headings are numbered (`\ref` after `\paragraph`), and its title with `name`.

Section numbers (with `headings.number`) are not shown in Hugo's `.TableOfContents`. Math in a heading is typeset in the page contents and the book contents (Hugo itself
leaves the TeX raw, or drops it on 0.146), and links in a heading are unwrapped there.

### Lists of figures and tables, contents

`{{< listoffigures >}}`, `{{< listoftables >}}` and `{{< listoflistings >}}` (standalone) list the floats of
the whole book inside a book (the landing body, the part pages and the chapters, in the reading order of
the numbering), or of the page; on a handout with `floats.number = "auto"` such a list numbers the page's captioned floats. `heading="…"` changes their heading; `heading=""` removes it
(useful when the page title already says “List of Figures”). A second list of the same kind on a page gets the
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
KaTeX's own environments (`equation`, `align`) restart their numbering in each formula: use `\label` or the
shortcode for numbers that run through the document. A display gets **one** number, however many rows it has:
in an `aligned` or `align` block with a `\label` on each row, only the first label is kept, and the others are
reported (`tufte-bad-option`) since references to them would print `??`. Write one `$$…$$` per numbered row.

`\tag` with a `\label` works as in amsmath: the tag is the equation's number. In
`$$ E = mc^2 \tag{$\star$} \label{eq:star} $$` KaTeX prints the tag (⋆), the theme adds no number of its
own, the counter does not step (the next labelled equation is still (1)), and `{{< eqref "eq:star" >}}`
prints “(⋆)” (`xref` with `num` or `auto` gives “⋆”). `\tag*{A.1}` is the same without the parentheses
in the display. The same holds for the `equation` shortcode.

### Bibliography

**Citing.** `{{< cite "key" >}}` puts the full reference in a numbered sidenote, as `\cite` does in
tufte-latex. Several keys: `{{< cite "a,b" >}}` or `{{< cite "a" "b" >}}`. Named parameters: `keys` (alias
`key`), `offset`, `as` (`"footnote"` puts the reference in a real footnote, see `citeas`),
`page` (“, p. 42”), `note` (any postnote) and `mode` (`margin`, the default: the reference in a sidenote;
`text` → “Tufte (2001)”, `paren` → “(Tufte 2001)”, `author`, `year`: inline, without a sidenote). Inside a sidenote, a margin note, a footnote, a margin block or
a caption (also a `caption="…"` parameter), `cite` does not cut the text: as in tufte-latex, the references of
all its cites (and of the holder's own `cite=`) are gathered after the text, in one block joined “E1; E2; and
E3”. A `cite` in a table cell, in the `table` or `fullwidthtable` shortcode as in a Markdown table, stays a
numbered sidenote in that cell; in a `margintable`, which already sits in the margin, the references of its
cells are gathered after its caption. Keys are case-insensitive.

| Shortcode | LaTeX |
|---|---|
| `{{< bibentry "key" >}}` (named: `key="…"`) | `\bibentry{key}`: the formatted entry, inline |
| `{{< nocite "a,b" >}}` (or `{{< nocite "a" "b" >}}`; named: `keys="a,b"`), `{{< nocite "*" >}}`, front matter `nocite: [a]` | `\nocite` |
| `{{< bibliography >}}` (standalone; `all=true`, `heading="…"`) | `\bibliography{…}` |
| front matter `tufte: {bibliography: {list: false}}` | `\nobibliography` |

On a handout the list of references is appended automatically at the end of the page when the page cites
anything (`bibliography.list`), unless the page has its own `{{< bibliography >}}`. In a book, add a
back-matter chapter whose body is `{{< bibliography heading="" >}}`; it lists every key cited in the book
(landing body and part pages included), numbered in reading order.
`all=true` widens only its own list (the cited keys, then the rest of the database); `{{< nocite "*" >}}`
widens every list. A page may hold several lists: the second gets ids `tufte-references-2` and `ref-KEY-2`
(and so on), and citations link to the first.

**The database.** The theme reads `data/bibliography.yaml` (or `.json`, `.toml`, or several files in
`data/bibliography/`; `bibliography.data` changes the name). Two schemas are accepted:

- **Native**, a BibTeX-like map from key to entry:

  ```yaml
  tufte2006:
    type: book       # book article incollection inproceedings phdthesis mastersthesis
                     # techreport manual misc online unpublished
    author: Edward R. Tufte          # "A and B", or a list of "First Last", "Last, First",
                                     # {family, given} or {literal}
    title: Beautiful Evidence
    publisher: Graphics Press, LLC
    address: Cheshire, Connecticut   # alias place, location
    year: 2006
    month: May                       # name, abbreviation or 1–12
    edition: First
    isbn: 0-9613921-7-7
    # also: editor, booktitle, journal, volume, number, pages, series, chapter,
    # institution, school, organization, howpublished, note, doi, url, urldate, issn
  ```

- **CSL-JSON or CSL-YAML**, a list of items with `id`, `type`, `author`, `issued`, `title`,
  `container-title`, `publisher`, `publisher-place`, `volume`, `issue`, `page`, `edition`, `URL`, `DOI`,
  `ISBN`, `note` (CSL types are mapped to the BibTeX ones).

**Converting a `.bib` file.** The robust route is [pandoc](https://pandoc.org), which understands all of
BibTeX and LaTeX accents:

```sh
pandoc refs.bib -t csljson -o data/bibliography.json
```

A page (or a book root) can also add its own database with front matter `bibliography: refs.json` (a page
resource or an `assets/` path; `.json`, `.yaml`, `.toml`) or with inline `references:`; later sources win.
A `.bib` file can be read directly (`bibliography: refs.bib`) by a simple built-in reader: `@string`
macros, `month = dec`, two levels of braces, common accents (`\'e`, `\"o`, `\c{c}`…), `--`, `~` and
`\url{}` are handled, anything more exotic is not. `url`, `doi` and `eprint` are taken verbatim
(`~user` and `--` stay as written), `\url{…}` inside `howpublished` or `note` becomes a link, and math
(`$k$-means`, `$\pi$-calculus`, `\(…\)`) is kept and typeset with KaTeX, in any database format; a
literal dollar is written `\$`. Each file is parsed once per build, however many chapters cite from it. The example site's `data/bibliography.yaml` is a hand
conversion of tufte-latex's `sample-handout.bib`.

**Format.** Entries follow plainnat as used by tufte-latex: “Edward R. Tufte. *Beautiful Evidence*.
Graphics Press, LLC, first edition, May 2006. ISBN 0-9613921-7-7.” (an `address` would follow the
publisher). As in `tufte.bst`, titles are italic only for books, manuals, theses and proceedings; misc,
online, unpublished and booklet titles stay upright, and the titles of articles and chapters are plain
too, with their journal or book in italics. DOIs and URLs are links. An unknown key prints `[key?]` and the warning `tufte-unknown-cite`.

### Books

A book is a section whose `_index.md` sets `book: true`; its regular pages are the chapters and its
sub-sections are **parts**.

The whole site can also be one book: set `book: true` in `content/_index.md`. The home page is then the
landing (title page, contents…, and the `print` output if listed in its `outputs`), the top-level regular
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
  general-index.md     # matter: back, title: Index — body: {{< printindex >}}
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
| `publisher`, `publisherPlain` | `\publisher` | Markdown and plain-text versions. |
| `halftitle` | `\blankpage` | `true`: a half-title page, in print only. |
| `epigraphs` | `\openepigraph` | A list of `{quote, author, work}`; the quote is Markdown. |
| `frontispiece` | the frontispiece | `{src, alt, caption}` (or just a `src` string): an image on the page facing the title page. `src` is looked up like the `figure` shortcode's (a resource of the book bundle, then `assets/`, then a `static/` path or a URL); `caption` is inline Markdown, set in the margin like a figure caption, never numbered; `alt` defaults to the plain caption. |
| `copyrightPage` | the copyright page | A Markdown string, or a map `{year, holder, publisher, url, license, printing}` (defaults: the year of `date`, the author, the publisher, and “First printing, MONTH YEAR” from `date`; `printing: false` removes that line). |
| `dedication` | the dedication | Markdown. Shown on the landing, right after the contents. To place it elsewhere among the front pages, as `sample-book.tex` does after the lists of figures and tables, put `dedication` on a front-matter chapter instead (below). |
| `outputs` | — | `["html", "print"]` adds `print.html`, the whole book as one document. |
| `tufte` | class options | Apply to every chapter (a chapter can still override any key). |

The landing page shows, in this order, the half-title (print), the epigraphs, the frontispiece, the title
page, the copyright page, the contents, the dedication and the body of `_index.md`.

**Chapter front matter:** `title`, `linkTitle` (short title for the contents, navigation, lists and running
heads, like `\chapter[short]{…}`), `weight` (reading order: first by `matter` — front, main, appendix, back —, so a front-matter chapter
comes before every main chapter whatever its weight; then by weight, negative weights first, unweighted (0)
last, a part and the loose chapters interleaving by the part's weight and the part's chapters by their own;
then by file name; never by date), `matter` (`front`, `main` — the default —, `appendix`, `back`; only main matter is numbered,
appendices are lettered), `unnumbered: true` (`\chapter*`), `intoc: false` (left out of the contents), `label`,
`dedication` (Markdown: the chapter is a dedication page, the dedication text in place of the chapter head; use it
with `matter: front` and `intoc: false` and a weight that puts it where it belongs in the front matter),
and any handout key except those of the author and date line: a chapter's title block has the chapter number,
the title (with its `thanks`), the subtitle and the abstract, like `\chapter`, so `author`, `dateText`,
`showDate` and the post metadata keys (`showReadingTime`, `showWordCount`, `lastmod`) are ignored there. A part's `_index.md` takes `title`, `weight` and `label`; parts are numbered I, II, …

Chapters show a “Contents” link and previous/next links in reading order instead of the post navigation,
and no comments. With `book.continuous` (default) sidenotes, figures, tables and equations are numbered
through the whole book, in the order of the whole-book `print.html`: first the landing body, then each
part page before the first chapter of its part, so a chapter page shows exactly the numbers of the
printed book. With `continuous = false` every chapter and part restarts at 1, on the site and in
print; in a numbered chapter (`book.numberChapters`) figures, tables, listings and equations then read
“2.1”, “2.2”, … (chapter.number, as `\thechapter.\arabic{figure}` in LaTeX), so the lists and
cross-references stay unambiguous. Parts are one level deep, like `\part`: the pages of a section inside a
part are read as chapters of that part (warning `tufte-book-structure`), and that section's own page is not
part of the book. Do not use front matter `toc` for the book contents (it is the per-page TOC switch),
nor `copyright` (the site footer); use `book.toc` and `copyrightPage`. A site `layouts/section.html` would
override the theme's `list.html` and therefore the book landing page.

Numbers, cross-references, the contents, the lists, the bibliography and the index of a book are computed
from all its chapters and cached for one build. `hugo server` rebuilds them after every change, so a figure
added to chapter 1 renumbers the figures of chapter 3 and the references to them on the next page load. If a
page ever looks stale (for example with a browser that keeps an old copy), reload it, or restart
`hugo server`; a one-shot `hugo` build is always consistent. In a one-shot build these results are kept
in each page's `.Store` for the whole build, so large books stay fast (a 200-chapter book builds in
seconds); `hugo server` recomputes them instead, since `.Store` survives its rebuilds.
`hugo --watch` (`hugo -w`) is not supported for books: it also keeps `.Store` across its incremental
rebuilds, but templates cannot tell it from a one-shot build, so numbers that depend on other chapters
(the sidenote counter of the next chapters, cross-chapter references, the contents) keep their old values
after an edit. Use `hugo server` for live editing, and a one-shot `hugo` build for the final site.

### Index

`{{< index "RAW" >}}` (inline) marks an index entry with `makeindex` syntax: `a!b!c` for sub-entries (at
most three levels, as in `makeindex`: deeper ones are folded into the third, with the warning
`tufte-bad-option`),
`sort@display` for each level (the display text is Markdown, so `` `code` `` works), `|see{x}`,
`|seealso{x}`, and `|(` … `|)` for ranges (a range that ends in another chapter or section prints both
locators, “2–4”, and absorbs the ones inside it; one that ends where it starts prints one). Named alternatives: `term` (alias `entry`), `see`, `seealso`.
`{{< printindex >}}` (standalone) prints the index of the book (or of the page) in three columns, with links to
the chapters (or sections) where each entry occurs; an entry in the landing body or on a part page is
located by the book or part title. Its named parameter `heading` changes the heading text
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
| `verse` | `verse` | Lines and stanzas (blank lines) of a poem. |
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
| `letter` | 8.5 × 11 in | 1.58in 0.86in 0.9in 1in | 65% | 30% |
| `a4` | A4 | 42.2mm 20.6mm 13.4mm 24.8mm | 65% | 30% |
| `b5` | 176 × 250 mm | 28.7mm 14.69mm 34.1mm 14.66mm | 70% | 25% |

Sidenotes, margin notes and captions are printed in the margin column (never behind toggles), floats are not
split across pages, chapters and the front-matter pages (title, copyright, contents, dedication…) start on a new
page, and external links in the text column (not in notes, captions or the bibliography) show their URL (once: a link
whose text is its address, like `<https://…>` or `\url`, is not repeated). Print to PDF
from the browser. A book with `outputs: ["html", "print"]` has `print.html` next to its landing page: the
title pages, the contents and every chapter in one document, with cross-chapter links turned into links
inside the document. Each chapter is an `<article id="tufte-cN">` and each part an `<article id="tufte-pK">`,
and the ids inside them get the `tufte-cN-`/`tufte-pK-` prefix, so they never collide with the ids of the
landing body, which keep their names (the theme's own ids, such as the `<main id="tufte-main">` landmark,
are in the `tufte-` namespace). `print.runningHeads = true` adds running heads with the page number in
Chromium 131 and later: a handout prints its title (`linkTitle` when set, as
`\title[plain]`) and the page number at the top right of every page but the first (one-sided, as
with `oneside`; the author is not shown), and a book alternates, with the book title on left pages and the chapter title on right pages (like
`twoside`); other browsers print without them. They are set in capitals letterspaced like
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
| `tufte-duplicate-label` | The same key defined twice in a page or a book, including a label equal to a heading's id. |
| `tufte-unknown-cite` | A cited key is not in the database. |
| `tufte-heading-depth` | A `#####` or `######` heading (an error with `headings.strict`). |
| `tufte-unlabeled-float` | A numbered float without a label (only with `debug`). |
| `tufte-bad-offset` | An invalid `offset`. |
| `tufte-bad-option` | An unknown or invalid value of an option or parameter: `tufte.*` options, `params.math.engine`, `strict` and `macros`, a missing `customCSS` file, partial `params.giscus` settings, an `iframe` `ratio` or `video` `type`, `epigraph` parameters ignored by its block-quote form, a `label=` key without a letter or digit, a second `\label` in one display equation, an `index` entry deeper than three levels, and the like. |
| `tufte-empty` | A shortcode with nothing to show: an empty `sidenote`, `marginnote`, `footnote`, `footnotetext` or `equation`, a `nocite` without a key, `subfigures` without images. |
| `tufte-math-error` | KaTeX could not render an expression (server engine); the source is shown as `<code class="math-error">`. |
| `tufte-raw-html` | Hand-written HTML in a shortcode's text was dropped (`unsafe = false`; see `innerHTML`). |
| `tufte-block-in-note` | A list, code block, quote or table in a sidenote, margin note or caption (or in a Markdown footnote turned sidenote), shown as inline blocks. |
| `tufte-block-in-paragraph` | A block shortcode (figure, margin block, bibliography, list of figures, contents, index…) written inside a paragraph instead of on its own lines; the paragraph is split around it. |
| `tufte-note-in-note` | A `sidenote` or `marginnote` shortcode inside a Markdown footnote turned sidenote, or inside a `sidenote`, `marginnote`, `footnotetext` or `marginblock` shortcode, a `margintable` cell or a figure/table caption: its text is shown inline. |
| `tufte-book-structure` | A section inside a part of a book (parts are one level deep). |
| `tufte-orphan-footnotemark` | A `footnotemark` without its `footnotetext` (only with `debug`). |
| `tufte-bib-format` | A bibliography database that cannot be read. |
| `tufte-katex-version` | `params.math.katexVersion` differs from the KaTeX that Hugo embeds (server engine). |

### LaTeX to Hugo cheat sheet

One row per feature of the tufte-latex classes. **must** and **should** features are implemented,
**could** features are extras, **wont** rows say why a LaTeX feature has no HTML counterpart. Option names
such as `tufte.justified` are keys of `[params.tufte]` (or of the `tufte:` front matter map). The example site
has the same table with live examples ([From LaTeX to Hugo](exampleSite/content/posts/latex-to-hugo.md)), a
port of `sample-handout.tex` and a port of `sample-book.tex`.

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
| 8 | multiple marks (`\multfootsep`) | automatic | could | adjacent marks are separated by a comma |
| 9 | `\footnotemark` + `\footnotetext[offset]{}` | `{{< footnotemark "row3" >}}` + standalone `{{< footnotetext name="row3" offset="-7bl" >}}…{{< /footnotetext >}}` | should | no other numbered note between mark and text |
| 10 | `\label` on a sidenote (“see note 7”) | `{{< sidenote label="sn:x" >}}…{{< /sidenote >}}` | should | `{{< xref "sn:x" >}}` prints its number |
| 11 | block content in the margin | `{{< marginblock >}}…{{< /marginblock >}}` | should | paragraphs, lists, tables; toggled on mobile |
| 12 | `\cite[offset]{a,b}` | `{{< cite "a,b" >}}`, `{{< cite "a" "b" >}}`, `{{< cite keys="a,b" offset="-1bl" >}}` | must | the full reference as a numbered sidenote |
| 13 | `\cite` inside `\sidenote`, `\marginnote`, `\caption` | a nested `{{< cite >}}`, or `cite="a,b"` on the note or figure | should | the reference is appended under the note |
| 14 | natbib `\citet`, `\citep`, `\citeauthor`, `\citeyear` (+ page) | `{{< cite keys="a" mode="text" page="42" >}}`; modes `text`, `paren`, `author`, `year` | could | inline text, no sidenote |
| 15 | `\bibentry{key}` | `{{< bibentry "key" >}}` | must | the formatted entry, inline |
| 16 | `\bibliography{f}` + `\bibliographystyle` | automatic at the end of a handout; `{{< bibliography >}}` anywhere (standalone) | must | `tufte.bibliography.style = "tufte"` (citation order) or `"plainnat"` (sorted) |
| 17 | `\nobibliography` | `tufte: {bibliography: {list: false}}` | must |  |
| 18 | `\nocite{a}`, `\nocite{*}` | `{{< nocite "a,b" >}}`, `{{< nocite "*" >}}`, front matter `nocite: [a]` | should |  |
| 19 | class option `nobib` | `tufte.bibliography.margin = false` | should | a citation becomes `[n]`, linked to the list |
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
| 35 | subfigures, `\fbox` image grids | `{{< subfigures cols=2 type="fullwidth" caption="…" >}}` with images on consecutive lines | could | a blank line between images would make them separate figures |
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
| 64 | the book printed as one PDF | book root `outputs: [html, print]` → `…/print.html` | should | see [Printing](#printing-and-pdf) |
| 65 | `\index{…}` with `!`, `@`, `\|see{}`, `\|seealso{}`, `\|(`, `\|)` | `{{< index "classes!a4paper" >}}`, same syntax | should |  |
| 66 | `\printindex` | `{{< printindex >}}` (standalone) | should | three columns |
| 67 | the index as a site taxonomy | — | **wont** | `/index/` clashes with Hugo's index files; use the shortcode |
| 68 | counters continuous across a book | `tufte.book.continuous = true` (default) | should |  |
| 69 | `\section`, `\subsection` (italic, unnumbered) | `##`, `###` | must |  |
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
| 104 | setspace `doublespace` | — | **wont** | not loaded by the classes |
| 105 | doc macros (`\doccmd`…), text shortcuts (`\TL`, `\monthyear`) | inline code, your own shortcodes | **wont** | not class features |
| 106 | TeX machinery (`\morefloats`, engine detection, `\TufteRecalculate`, other paper options) | — | **wont** | no meaning in HTML |

## Syntax highlighting

Code uses Hugo's built-in Chroma highlighter and the monospace style of Tufte CSS.

- With `markup.highlight.noClasses = false` (recommended), Chroma emits CSS classes. The theme's
  `assets/css/syntax.css` colours them, with light and dark palettes.
- With Hugo's default (`noClasses = true`), Chroma writes inline styles from `markup.highlight.style`.
  The theme keeps the layout but does not change the colours.

## Pages and layouts

| Page | Template | Notes |
|---|---|---|
| Home | `home.html` | Intro from `content/_index.md` (if `homeIntro`), then paginated summaries of `mainSections`. With `book: true` in `content/_index.md`, the book landing (`tufte/book/landing.html`). |
| Section list | `list.html` | Paginated summaries. |
| Single page | `page.html` | Title, subtitle, metadata, optional TOC, sectioned content, tags, post navigation, comments. |
| Taxonomy | `taxonomy.html` | All terms with page counts (for example `/tags/`). |
| Term | `term.html` | Pages for one term (for example `/tags/typography/`). |
| Archives | `archive.html` | Any page with `layout: archive`. It lists all posts grouped by year (pages without a date, such as book chapters, last under an “Undated” heading, as on term pages). |
| Not found | `404.html` | Localised "page not found" page. |
| Book landing | `list.html` → `tufte/book/landing.html` | A section with `book: true`: title page, contents, dedication. See [Books](#books). |
| Book part | `list.html` → `tufte/book/part.html` | A sub-section of a book: part number, title and its chapters. |
| Book chapter | `page.html` → `tufte/book/chapter.html` | A page inside a book: chapter number, content, book navigation. |
| Whole book | `list.print.html` | `print.html` of a book with `outputs: ["html", "print"]`. |
| RSS feeds | `rss.xml` | Hugo's feed, with each item's description taken from the theme's processed summary (numbers and cross-references resolved). |

To create the archives page, add `content/archives.md`:

```markdown
---
title: Archives
layout: archive
---
```

Summaries use Hugo's `<!--more-->` divider when it is present. Otherwise Hugo builds an automatic summary.

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
  summaries, the archive, term pages and the book contents), and the post navigation, the book navigation
  and feeds skip them.

## Customisation

**Extra CSS.** Put a file in your site's `assets/` and list it in `customCSS`. It is appended to the theme's
CSS bundle after `et-book.css` (when `etBook` is on), `tufte.css`, `theme.css`, `tufte-latex.css` and
`syntax.css`, in this order, so its rules take precedence.

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
page. They are not rendered on the home page or on taxonomy and term pages. Their context is the page.
Wrap what you add in a `<section>` to keep it in the Tufte text column.

**Overriding templates.** Any theme file can be replaced by a file at the same path in your site, for example
`layouts/page.html`, `layouts/_partials/post-meta.html` or `layouts/_shortcodes/sidenote.html`.

**Favicon.** If your site has `static/favicon.ico` and/or `static/favicon.svg`, they are linked
automatically (`<link rel="icon">`, the SVG with `type="image/svg+xml"`).

**Dark mode.** The theme follows the reader's `prefers-color-scheme`, with the same colours as Tufte CSS
(`#151515` background, `#ddd` text).

## Languages

The theme ships translations for English, Italian, French, German and Spanish (`i18n/`). Use Hugo's standard
multilingual configuration (`[languages]`). To translate into another language, add `i18n/<lang>.yaml` to your
site with the keys from `i18n/en.yaml`.

On a multilingual site, a page that has translations gets a small language switcher under the site header
(`nav.site-languages`, labelled with each language's `languageName`, or `label` from Hugo 0.158) and
`<link rel="alternate" hreflang="…">` tags in `<head>`. `<html>` carries the language's `languageCode`
(`locale` from Hugo 0.158) and, when `languageDirection` (`direction`) is set, a `dir` attribute (Tufte CSS
itself is designed left-to-right: margin notes stay in the right margin). The Language methods renamed in Hugo 0.158 are handled by
`layouts/_partials/func/lang.html`.

## Example site

`exampleSite/` contains a complete demo, including a full Markdown port of the Tufte CSS demo page, a port
of Tufte-LaTeX's `sample-handout.tex` (`posts/sample-handout/`, with its bibliography in
`data/bibliography.yaml`), a port of `sample-book.tex` as a multi-chapter book (`books/sample-book/`), a
small book with parts and numbered chapters (`books/parts-demo/`) and the LaTeX to Hugo cheat sheet with
live examples (`posts/latex-to-hugo.md`). From the theme's root directory, run:

```sh
hugo server -s exampleSite
```

The example site sets `theme = "tufte.hugo"` and `themesDir = "../.."`, so the theme directory must be named
`tufte.hugo`. Continuous integration builds the example site with Hugo 0.146.0 and the latest release
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
- variant builds with `tufte.style = "latex"`, with `math.engine = "client"` (KaTeX in the browser, with a
  script and stylesheet of the same version) and with A4 paper, numbered sections and `nobib` citations;
- performance: a generated 150-chapter book (with `print.html`, cross-chapter references, figures, citations,
  a list of figures, a bibliography and an index) must build with `--panicOnWarning` within 240 seconds, with
  its cross-chapter numbers and print document correct.

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
