# tufte.hugo

A [Hugo](https://gohugo.io) theme built on [Tufte CSS](https://github.com/edwardtufte/tufte-css).
You write ordinary Markdown with a few shortcodes. The theme produces the markup Tufte CSS expects:
sidenotes, margin notes, margin and full-width figures, epigraphs, `<section>`-wrapped articles and
ET Book typography. It also includes the parts a blog needs: a paginated home page, archives, tags,
a table of contents, previous/next links, comments, server-side math, syntax highlighting, dark mode
and five languages.

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
- [Footnotes as sidenotes](#footnotes-as-sidenotes)
- [Math](#math)
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
        block = true            # REQUIRED for {.fullwidth} on tables and {cite="…" author="…"} on blockquotes
        title = true
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
| `description` | `""` | Last fallback for `<meta name="description">`. The page's front matter `description` comes first, then its `subtitle`, then (regular pages only) the first 160 characters of its plain-text summary; this value is used only when all of them are empty, so mostly on the home page and list pages. |
| `dateFormat` | `"January 2, 2006"` | Go layout used for dates (localised by Hugo). |
| `sections` | `"h2"` | `"h2"`: wrap the article in a new `<section>` at each `<h2>`. `"none"`: put the whole article in one `<section>`. Front matter `sections` overrides it. |
| `footnotes` | `"sidenotes"` | `"sidenotes"`: Markdown footnotes become numbered sidenotes. `"endnotes"`: keep Goldmark's list at the end. Front matter `footnotes` overrides it. |
| `etBook` | `true` | Load the bundled ET Book web fonts. With `false`, the fallback serif stack from Tufte CSS is used. |
| `showReadingTime` | `true` | Show the reading time in the post metadata. |
| `showWordCount` | `false` | Show the word count in the post metadata. |
| `showPostNav` | `true` | Show previous and next post links at the end of posts. |
| `toc` | `false` | Show a table of contents. Front matter `toc` overrides it. |
| `readMore` | `true` | Show a "Read more" link under each summary. |
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
| `leqno` | `false` | Put equation tags (`\tag{…}`) on the left. |
| `errorColor` | `""` | Colour of invalid TeX. Empty: the theme's red, adapted to dark mode. |
| `strict` | `"error"` | KaTeX `strict` mode: `"error"`, `"ignore"` or `"warn"` (`ignore` and `warn` need Hugo 0.147.6 / 0.147.7 for the server engine). |
| `minRuleThickness` | `0.04` | Minimum thickness of fraction lines, in em. |
| `katexVersion` | `"0.16.11"` | KaTeX version of the CDN files. The bundled hashes (in `data/tufte/vendor.toml`) are for 0.16.11; another version also needs `katexIntegrity` (CSS), `katexJSIntegrity` and `katexAutoRenderIntegrity` (client engine), or the build stops. |
| `katexCSS` | `""` | Optional: another URL for the KaTeX stylesheet, with `katexIntegrity` as its SRI hash. |

### `[params.giscus]` and `[params.comments]`

| Key | Default | Meaning |
|---|---|---|
| `giscus.repo` | `""` | `owner/repo` that hosts the discussions. Giscus is enabled only when `repo`, `repoId`, `category` and `categoryId` are all set; with only some of them the build prints a warning and shows no giscus comments. |
| `giscus.repoId` | `""` | Repository id from <https://giscus.app>. |
| `giscus.category` | `""` | Discussion category name. |
| `giscus.categoryId` | `""` | Discussion category id. |
| `giscus.mapping` | `"pathname"` | How pages are mapped to discussions. |
| `giscus.theme` | `"preferred_color_scheme"` | Giscus colour theme. |
| `giscus.lang` | `""` | Giscus interface language (for example `"it"`). Empty: the site language. |
| `comments.enable` | `true` | Allow comments on posts. Front matter `comments` overrides it. |

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
| `title` | Page title, rendered as the article's `<h1>`. |
| `subtitle` | Rendered as `<p class="subtitle">` under the title. Also used as the meta description when `description` is empty. |
| `date` | Publication date. |
| `lastmod` | Last modification. Shown as "updated on" when it differs from `date`. |
| `author` | Author name for this page. Overrides `params.author.name`. |
| `description` | Meta description and summary for social cards. When empty, the meta description falls back to `subtitle`, then (regular pages) the plain-text summary, then `params.description`. |
| `tags`, `categories` | Taxonomy terms. Both are listed in the post metadata (categories first, separated by commas; tags in small caps). |
| `toc` | `true`/`false`. Overrides `params.toc`. |
| `showReadingTime`, `showWordCount` | `true`/`false`. Override `params.showReadingTime` / `params.showWordCount` for this page. |
| `showPostNav` | `true`/`false`. Overrides `params.showPostNav` for this page. |
| `sections` | `"h2"`/`"none"`. Overrides `params.sections`. |
| `footnotes` | `"sidenotes"`/`"endnotes"`. Overrides `params.footnotes`. |
| `math` | `true` always loads the KaTeX assets on this page (with the client engine, this also makes KaTeX scan the article for `$…$`, `$$…$$`, `\(…\)`, `\[…\]` when the passthrough extension is off). `false` never loads them, even if the page contains math. |
| `mathMacros` | KaTeX macros for this page, added to `params.math.macros` (same list-of-pairs form), e.g. `mathMacros: [["\\E", "\\mathbb{E}"]]` in YAML. |
| `comments` | `true`/`false`. Overrides `params.comments.enable`. |
| `draft` | Hugo's standard draft flag. |
| `images` | Images for Open Graph and Twitter cards. |
| `layout` | Set `layout: archive` on a page to render the archives (posts grouped by year). |

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
- **Note numbering.** Every sidenote, margin note, margin figure, figure caption and converted footnote gets
  a unique id (`<hash of the page URL>-<n>`), so ids do not collide on list pages that show several summaries.

Everything else is done with the shortcodes and Markdown features below.

## Shortcodes

There are two kinds of shortcodes:

- **Inline** (`sidenote`, `marginnote`, `newthought`, `sans`) are used **inside a paragraph**, with the
  `{{< name >}}…{{< /name >}}` form. Their inner text is rendered as *inline* Markdown (emphasis, links,
  code and inline math work; lists and paragraphs do not).
- **Block** (`epigraph`, `blockquote`, `fullwidth`) are placed **on their own lines**. Their inner text is
  rendered as *block* Markdown, so it can contain several paragraphs.

Shortcodes can be nested with the `{{< >}}` form, e.g. a `sidenote` inside a `blockquote`, or a `figure`
inside `fullwidth`. The HTML of the nested shortcode is kept as is and the Markdown around it is still
rendered, also with `markup.goldmark.renderer.unsafe = false` (balanced HTML tags written by hand in the
inner text are kept the same way).

Keep an inline shortcode on the same line as the word it annotates. A line break before it inserts a
space before the note number.

### `sidenote`

A numbered note in the margin. On narrow screens it can be toggled by tapping its number.

```markdown
Tufte CSS uses sidenotes{{< sidenote >}}This is a sidenote with *emphasis* and a [link](https://edwardtufte.github.io/tufte-css/).{{< /sidenote >}} instead of footnotes.
```

Output:

```html
<label for="sn-1a2b3c-1" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-1a2b3c-1" class="margin-toggle"/><span class="sidenote">This is a sidenote …</span>
```

Markdown footnotes (`[^1]`) become sidenotes automatically. See [Footnotes as sidenotes](#footnotes-as-sidenotes).

### `marginnote`

Like a sidenote, but without a number. On narrow screens it is toggled by a ⊕ symbol.

```markdown
This sentence has a margin note.{{< marginnote >}}A margin note is not numbered.{{< /marginnote >}}
```

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
| `cite` | Title of the work, rendered in `<cite>` after the author. |
| `url` | Source URL. It becomes the `cite` attribute of the `<blockquote>` and links the footer. |
| `footer` | Complete footer text (inline Markdown). It replaces `author` and `cite`. |
| `class` | Extra classes for the `<div class="epigraph">`. |

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
prints a warning when you set them): put the attribution in the attribute line of each quote. Only
`class` applies to both forms. So `{{< epigraph author="X" >}}` around a `> quote` does not attribute
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

```markdown
{{< figure src="exports-imports.png" alt="Exports and imports chart"
    caption="From Edward Tufte, *Visual Display of Quantitative Information*, page 92." >}}

{{< figure type="fullwidth" src="napoleons-march.png" alt="Napoleon's march"
    caption="Figurative map of the successive losses of the French Army in the Russian campaign, 1812–1813." >}}
```

A main figure produces:

```html
<figure><label for="mn-1a2b3c-2" class="margin-toggle">&#8853;</label><input type="checkbox" id="mn-1a2b3c-2" class="margin-toggle"/><span class="marginnote">From Edward Tufte, …</span><img src="…" alt="…"></figure>
```

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
code or prose.

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

```markdown
![Exports and imports of Scotland](exports-imports.png "From Edward Tufte, *Visual Display of Quantitative Information*, page 92.")
```

An image counts as a block only when the site sets
`markup.goldmark.parser.wrapStandAloneImageWithinParagraph = false` (see
[Required site configuration](#required-site-configuration)). Without it, every image is inline.

A block image can also be a full-width or margin figure. Put a class attribute on the line after it (this
requires `parser.attribute.block = true`). Other attributes, such as `{width=300}`, are passed to the
`<img>`:

```markdown
![Napoleon's march](napoleons-march.png "Charles Joseph Minard, 1869.")
{.fullwidth}

![A rhinoceros](rhino.png "Dürer’s rhinoceros.")
{.margin}
```

`{.fullwidth}` gives `<figure class="fullwidth">` with a `<figcaption>`. `{.margin}` puts the image and its
caption in the margin, like the `marginfigure` shortcode. The shortcodes offer more options (`attr`,
`link`, `inline`).

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

## Footnotes as sidenotes

With `footnotes = "sidenotes"` (the default), ordinary Markdown footnotes are turned into numbered sidenotes
when the page is built. Goldmark's endnote list is removed:

```markdown
Tufte prefers sidenotes to footnotes.[^why] Named or numbered labels both work.[^1]

[^why]: The reader's eye does not have to leave the line of text.
[^1]: Paragraph breaks inside a footnote become line breaks in the sidenote.
```

Summaries on list pages are converted in the same way. To keep classic endnotes on one page, set
`footnotes: endnotes` in its front matter. To keep them for the whole site, set `params.footnotes = "endnotes"`.
In endnotes mode, the footnote references in a summary on a list page link to the endnotes on the post's own page.

## Math

All math is typeset with [KaTeX](https://katex.org). By default (`params.math.engine = "server"`) it is rendered
**at build time** with Hugo's `transform.ToMath`, so pages do not need JavaScript: the browser only needs the
KaTeX stylesheet for fonts and layout. With `params.math.enable = "auto"`, the theme loads it only on pages
that contain math, or on pages with `math: true` in front matter.

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

**Invalid TeX never stops the build.** KaTeX runs with `throwOnError = false`; Hugo prints a warning with the
page, the line and the expression, and the page shows the source as `<code class="math-error">`. This includes
undefined commands, such as a typo (`\RRR`) or a macro that was not defined.

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

**Equation numbers.** `\tag{1}` numbers a display equation as in LaTeX (on the right; `leqno = true` puts it on
the left). The `equation`, `align` and `gather` environments number their lines, but KaTeX counts each formula
separately, so each starts again from (1): use `\tag` on pages with several numbered formulas.

**Client engine.** With `params.math.engine = "client"` the render hook writes
`<span class="math math-inline">\(…\)</span>` and `<span class="math math-display">\[…\]</span>` (TeX
escaped), and pages with math load `katex.min.js` and `contrib/auto-render.min.js` (deferred, with SRI), which
typeset those elements with the same options and macros. On the home page and on section pages, the
summaries keep their TeX too, so the script there gets the `mathMacros` of every page in the current pager as
well (if two of those pages define the same macro differently, the later one wins). On a site without the
passthrough extension, set
`math: true` on a page and KaTeX's auto-render scans its article for `$…$`, `$$…$$`, `\(…\)` and `\[…\]`.

**CDN, hashes and self-hosting.** KaTeX 0.16.11 is loaded from jsDelivr with the SRI hashes in
`data/tufte/vendor.toml`. With `params.selfHosted = true`, the files are downloaded at build time, checked
against those hashes and published under `/katex/`. The stylesheet loads its fonts from `fonts/` next to itself,
so a self-hosted site must copy KaTeX's `dist/fonts/` directory to `static/katex/fonts/`.

## Syntax highlighting

Code uses Hugo's built-in Chroma highlighter and the monospace style of Tufte CSS.

- With `markup.highlight.noClasses = false` (recommended), Chroma emits CSS classes. The theme's
  `assets/css/syntax.css` colours them, with light and dark palettes.
- With Hugo's default (`noClasses = true`), Chroma writes inline styles from `markup.highlight.style`.
  The theme keeps the layout but does not change the colours.

## Pages and layouts

| Page | Template | Notes |
|---|---|---|
| Home | `home.html` | Intro from `content/_index.md` (if `homeIntro`), then paginated summaries of `mainSections`. |
| Section list | `list.html` | Paginated summaries. |
| Single page | `page.html` | Title, subtitle, metadata, optional TOC, sectioned content, tags, post navigation, comments. |
| Taxonomy | `taxonomy.html` | All terms with page counts (for example `/tags/`). |
| Term | `term.html` | Pages for one term (for example `/tags/typography/`). |
| Archives | `archive.html` | Any page with `layout: archive`. It lists all posts grouped by year. |
| Not found | `404.html` | Localised "page not found" page. |

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
  is set. Comments appear on regular pages when `params.comments.enable` (or front matter `comments`) is true.
- **Google Analytics**: set `services.googleAnalytics.id`. It loads only in production builds.
- **Social links** come from `[params.social]` and appear in the footer.
- **SEO**: Hugo's embedded Open Graph, Twitter card and schema templates are included. The canonical URL and
  RSS alternate link are emitted in `<head>`. Use the `images` front matter for social card images.

## Customisation

**Extra CSS.** Put a file in your site's `assets/` and list it in `customCSS`. It is appended to the theme's
CSS bundle after `tufte.css`, `theme.css` and `syntax.css`, so its rules take precedence.

```toml
[params]
  customCSS = ["css/custom.css"]
```

The bundle is minified only in production (`hugo.IsProduction`), fingerprinted, and loaded with an SRI
`integrity` attribute. Never edit `assets/css/tufte.css`: it is vendored verbatim from upstream, and theme
changes live in `assets/css/theme.css`.

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

**Favicon.** If your site has `static/favicon.ico`, it is linked automatically.

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

`exampleSite/` contains a complete demo, including a full Markdown port of the Tufte CSS demo page. From the
theme's root directory, run:

```sh
hugo server -s exampleSite
```

The example site sets `theme = "tufte.hugo"` and `themesDir = "../.."`, so the theme directory must be named
`tufte.hugo`. Continuous integration builds the example site with Hugo 0.146.0 and the latest release
(`.github/workflows/ci.yml`).

## Credits

- [Tufte CSS](https://github.com/edwardtufte/tufte-css) by Dave Liepmann and contributors, MIT License.
  `assets/css/tufte.css` is vendored without changes, except that the `@font-face` rules were moved to
  `assets/css/et-book.css`. See [LICENSE-tufte-css](LICENSE-tufte-css).
- [ET Book](https://github.com/edwardtufte/et-book) by Dmitry Krasny, Bonnie Scranton and Edward Tufte,
  MIT License. The font files in `static/et-book/` are taken from the Tufte CSS distribution.
- The theme structure follows [Beautiful Hugo](https://github.com/halogenica/beautifulhugo).
- [KaTeX](https://katex.org) for math typesetting (MIT License).

tufte.hugo is © 2026 Massimo Nocentini and released under the [MIT License](LICENSE).
