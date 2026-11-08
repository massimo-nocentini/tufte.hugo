# Agent Notes: tufte.hugo

This is a **Hugo theme**, not a standalone site. Its job is to turn Markdown into the exact markup that
[Tufte CSS](https://github.com/edwardtufte/tufte-css) expects. All changes are template-level (Go templates,
HTML, CSS, YAML i18n). There is no package manager, JavaScript, build tool or unit test suite. Hugo's own build
is the only check.

## Build / Verify

The theme directory must be named `tufte.hugo`. The example site uses `theme = "tufte.hugo"` and
`themesDir = "../.."`.

```bash
hugo -s exampleSite --gc --panicOnWarning      # build into exampleSite/public
hugo server -s exampleSite --disableFastRender  # live preview
```

CI (`.github/workflows/ci.yml`) builds the example site with the `latest` Hugo (standard edition).
It checks for sidenote, margin note, section, epigraph and KaTeX markup (the `katex.min.css` version must match
the KaTeX that Hugo embeds: `katex-base` classes need 0.18+; the bundle must keep theme.css's
`html body { counter-reset: sidenote-counter katexEqnNo mmlEqnNo }`, which outranks katex.min.css's `body` reset)
and for duplicate ids, then runs a second minified
build with `HUGO_PARAMS_SECTIONS=none` and `HUGO_PARAMS_FOOTNOTES=endnotes`. Two §11 steps check sidenotes and
real footnotes together (`posts/footnotes-as-sidenotes`: one `section.footnotes`; `posts/footnotes-and-sidenotes`:
`div.footnotes.footnotes-section` per section; letter marks, links in both directions, no Goldmark leftovers)
in the default build and in the minified variant. The tufte-latex acceptance
script (written by the step "Write the tufte-latex acceptance script") greps every page for unresolved markers
(`TUFTENEST`, `raw HTML omitted`, `sn-end`, `cap-end`, empty `tufte-num` tokens, `xref-missing`, placeholders,
`bib-missing`) and duplicate ids, and checks the handout (`posts/sample-handout`: figures 1–3, table 1,
bibliography), the book (`books/sample-book`: continuous numbering, cross-chapter xrefs, lists, index,
`print.html`), `books/parts-demo` (camelCase `numberChapters`, the frontispiece) and `posts/latex-to-hugo`
(including real footnotes and the list of listings). Variant builds run it
in `markers` mode with `HUGO_PARAMS_TUFTE_STYLE=latex`, with `HUGO_PARAMS_MATH_ENGINE=client` (which also checks
that the KaTeX script and stylesheet have the same version) and with A4 paper, `nobib` and numbered sections.
An `HUGO_UGLYURLS=true` build checks that each book's landing and `print.html` stay separate files (the `print`
output format needs `noUgly`: on 0.146 it would otherwise overwrite the landing `books/b.html`).
The step "Build a 200-chapter book within the time limit" gates performance: it generates a book of 200
chapters (html + `print.html`; sidenotes, cross-chapter xrefs, labelled figures, citations, per-chapter
`references` cited author-year and across chapters (1200 entries in plainnat extra-label groups), index entries,
a list of figures, a bibliography and an index) in `$RUNNER_TEMP`, builds it with `--panicOnWarning` under
`timeout 240`, and checks a cross-chapter xref number, the extra labels (2000a…) of two author-year cites
and the print document. Cross-page results must stay
memoised in `.Store`, or this step times out; read a memo only through `_partials/tufte/memo.html` and store
it with the build stamp (`"b" (partialCached "tufte/build-stamp.html" "stamp" "stamp")`), so that the rebuilds of
`hugo server` and `hugo --watch` recompute it. The stamp lives in `hugo.Store` and changes only at the end of a
build (a keyed `templates.Defer` in `baseof.html`): never derive it from a value partialCached can evict, since
from about 160 chapters up partialCached evicts its own entries during a build. The step builds with
`--templateMetrics` and fails when `func/content-raw.html` runs 24 times per chapter or more (memos recomputed
within one build). It also starts the book under `hugo server` and checks that an edit of chapter 1 renumbers
the last chapter, and that undoing it renumbers it back. The last step, "Check nested and mixed footnotes", builds a small
site in `$RUNNER_TEMP/nested` (footnotes inside `footnote`/`sidenote`/`fig` shortcodes and inside Markdown
footnotes, `[^x]` in an image title and a table caption, a label repeated in the body and in a `table` shortcode,
`footnotes: endnotes`). It checks every post for leftover footnote markers, balanced `<span>`s, unique ids and
no dangling `#` links; that inner notes follow the outer mark and no note text is lost; that `[^x]` in an image
title or table caption does not change the kind of the page's other notes; one list item per footnote; and that
the automatic summaries on the home and section pages are closed.
Any change to the example content must keep those checks true.

`.github/workflows/pages.yml` deploys the example site to GitHub Pages (push to `master`, Hugo `0.169.0`,
`--minify --panicOnWarning`, base URL from `actions/configure-pages`) under the subpath `/tufte.hugo/`. It fails
if any URL of the Pages host escapes that subpath (`href`/`src`/`srcset`, `og:image`/`twitter:image`, CSS
`url()`, sitemap and RSS), so build every URL with `relURL`/`.RelPermalink`,
and pass a root-absolute path an author writes (`/images/x.svg`) through `tufte/site-url.html` (`relURL` keeps a
leading-slash path as written).

## Hugo Version and Config

- The theme requires the latest Hugo release: minimum `0.169.0`, declared in `hugo.toml` (`[module.hugoVersion]`)
  and `theme.toml` (`min_version`); CI tests only `latest`. Raise both when a new feature needs a newer Hugo.
  The standard edition is enough. (Code paths for older Hugo, e.g. the KaTeX 0.16 entry in `vendor.toml` and
  the `func/lang.html` shim, are kept but no longer tested.)
- The theme's `hugo.toml` holds every `[params]` default, **except** `[params.tufte]`: it sets only
  `style = "css"`. All other tufte-latex defaults live in `layouts/_partials/tufte/defaults.html` (per style
  preset), so that `style = "latex"` can change them; adding a `[params.tufte]` leaf to `hugo.toml` would hide the
  preset. It also declares the `print` output format (book `print.html`) and the `text/x-bibtex` media type
  (`.bib` resources); Hugo merges `outputFormats` and `mediaTypes` from a theme. Hugo deep-merges `params` and site values win; `[menus]`
  is merged shallowly. `[markup]`, `[taxonomies]`, `[pagination]` and `[services]` are **not** merged by default
  (a site may opt in with `_merge = "deep"`). The required
  Goldmark settings (`wrapStandAloneImageWithinParagraph = false`, `parser.attribute.block = true`, the passthrough
  extension for math, `highlight.noClasses = false`) therefore live in `exampleSite/hugo.toml` and are documented
  in `README.md`.

## Architecture

The theme uses the Hugo 0.146 template system: `layouts/baseof.html`, `home.html`, `page.html`, `list.html`,
`taxonomy.html`, `term.html`, `archive.html`, `404.html`, `list.print.html` (a book's whole-book `print.html`,
output format `print`) and `rss.xml` (Hugo's feed, with item descriptions taken from the processed summary),
plus `layouts/_partials/`, `layouts/_shortcodes/` and `layouts/_markup/`.

- `assets/css/tufte.css` is **vendored verbatim** from upstream (minus `@font-face`). Never edit it. Put
  base-theme overrides in `assets/css/theme.css` and tufte-latex parity rules (offsets, numbered floats,
  citations, books, index, class options, print geometry) in `assets/css/tufte-latex.css`.
- `assets/css/et-book.css` contains the ET Book `@font-face` rules. They point to `../et-book/` because the bundle
  is published under `/css/`. The fonts are in `static/et-book/`.
- `layouts/_partials/css.html` concatenates `et-book.css` (if `params.etBook`), `tufte.css`, `theme.css`,
  `tufte-latex.css`, `syntax.css` and `params.customCSS` into `css/tufte-hugo.css`. Page-dependent CSS values
  go in the `<style>` of `tufte/head-style.html`, emitted after the bundle. It minifies only when `hugo.IsProduction`,
  fingerprints, and emits SRI.
- `layouts/_partials/func/content.html` post-processes `.Content` and `.Summary`: phase 1
  `func/content-raw.html` (`func/footnotes.html`: Markdown footnotes become sidenotes or real footnotes by mode
  and label prefix, plus leftover nest tokens), then `tufte/postprocess.html` (numbers, xrefs, citations,
  placeholders, footnote lists), then `func/sectionize.html` (`<section>` at each `<h2>` when the mode is
  `h2`).
- `layouts/_partials/func/note-id.html` returns a unique note id (`<md5(RelPermalink)[:6]>-<n>`, counter in
  `.Page.Store` key `tufteNoteCounter`). Every shortcode or hook that makes a sidenote, margin note, figure
  caption, index anchor or `footnote` **must** use it. Footnotes converted from Markdown do not: their ids are
  deterministic (`sn-<hash6>-fnref-N` for sidenotes, `fn-<hash6>-LABEL` for real footnotes), because phase 1 is
  cached. Nor does the checkbox of a `footnotemark`/`footnotetext` pair: both build `sn-<hash6>-ft-<name>` from the
  name (`tufte/ft-name.html`; `.2`, `.3`… for a later `footnotetext` of the same name, numbered by
  `func/content-raw.html`) so the mark's label finds the text; the mark's `data-ft` still comes from `note-id.html`.
  Ids must stay unique on list pages that show several summaries.
- `layouts/_partials/tufte/figure.html` is the shared float renderer: the `figure`, `marginfigure`,
  `fullwidthfigure` and `fig` shortcodes, the image render hook, the book frontispiece, and (through `Body`) the
  table, listing and subfigures floats.
- Notes and captions are `<span>`s and must never hold block elements. `tufte/render-inner.html` (inline mode)
  and `func/footnotes.html` pass their HTML through `func/inline-figures.html`, which turns a `<figure>` made
  by the image render hook (an image alone in a note) back into a plain `<img>`.
  Paragraphs in a note are flattened only through `func/flatten-p.html` (a `<p>` with attributes, such as an
  alert title or `{.class}`, becomes `span[data-sn="p"]`; never strip `</?p>` with a bare regex).
- `i18n/` has `en`, `it`, `fr`, `de`, `es`. Every key must exist in all five files. Templates translate with
  `partial "func/t.html" KEY` (or a dict with `key`, `count`, `data`), never `T` directly: it falls back to
  `i18n/en.yaml` (mounted as the asset `tufte/i18n-en.yaml` in `hugo.toml`, whose `[[module.mounts]]` must keep
  Hugo's default mounts) for a language without a theme i18n file.
- `layouts/_partials/func/lang.html` hides the Hugo 0.158 renames of the Language methods (`Lang` → `Name`,
  `LanguageName` → `Label`, `LanguageCode` → `Locale`, `LanguageDirection` → `Direction`). Never call those
  methods directly: the deprecated ones warn (and `--panicOnWarning` fails CI) on new Hugo, the new ones do not
  exist on old Hugo.

## Gotchas

- **Tufte CSS widths apply only to direct children of `<section>`** (`section > p`, `section > table`, …). Do not
  wrap content in extra `div`s inside sections. Do not use `<article>` for list items, because Tufte pads
  `article`. Use `div.post-summary`.
- **Sidenote markup is whitespace-sensitive.** Emit label, input and span on one line with `{{- -}}` trims, so
  that no space leaks into the paragraph. The inner text is inline: render it through `tufte/render-inner.html`
  (`"display" "inline"`) and never put block elements inside the `span`.
- **Inline vs block shortcodes.** `sidenote`, `marginnote`, `newthought` and `sans` are inline. `epigraph`,
  `blockquote` and `fullwidth` render `.Inner` through `tufte/render-inner.html` with `"display" "block"`.
  Never call `RenderString` on a shortcode's `.Inner` directly: `render-inner.html` restores nested-shortcode
  tokens, applies the raw-HTML policy (`unsafe`/`innerHTML`) and keeps escaped shortcodes as text.
- **Math is KaTeX**, server-side by default (`transform.ToMath` in `_markup/render-passthrough.html`;
  `params.math.engine = "client"` keeps the TeX for KaTeX JS). Options and macros come from
  `_partials/func/math-options.html`; read the site settings only through `_partials/func/math-config.html`
  (a site may set `params.math = true` instead of the table). The hook sets `.Page.Store "hasMath"`. The head is rendered before the
  content, so the head must touch the content first (or use `templates.Defer`) before it decides whether to load
  the KaTeX assets (`_partials/tufte/katex.html`). CDN URLs and SRI hashes live in `data/tufte/vendor.toml`
  (emitted by `_partials/tufte/vendor.html`, which also handles `params.selfHosted`): bump URL and hash together.
- **`.IsBlock` in `render-image.html`** works only when the site sets
  `wrapStandAloneImageWithinParagraph = false`.
- **Use `relURL` / `.RelPermalink`** for assets and links. `absURL` / `.Permalink` are acceptable only in
  canonical, Open Graph, Twitter, schema and RSS output, and for a link to a translation served from another
  host (multihost: a `baseURL` per language; the language switcher in `header.html`).
- **The CSS class names are a contract** between `layouts/` and `assets/css/theme.css` /
  `assets/css/tufte-latex.css`. Rename a class in both places or not at all.
- **Document features.** Each new param, front matter key, shortcode or render hook goes in `README.md` and in
  an example-site page (`exampleSite/content/posts/theme-guide.md`).

## tufte-latex parity (books, floats, citations, cross-references)

The spec is the parity table in `README.md` ("tufte-latex parity"). Key mechanics:

- **Two-phase content pipeline.** `func/content-raw.html` (phase 1: footnotes → sidenotes, nest tokens) never
  reads another page. `func/content.html` = raw → `tufte/postprocess.html` (numbers, xrefs, citations,
  placeholders for lists/bibliography/index/toc) → `func/sectionize.html`. Every cross-page scan (labels,
  counts, offsets, book contents, lists, bibliography, index) reads **phase 1 only**, through `partialCached`.
  Shortcodes never read other pages: `listoffigures`, `bibliography`, `printindex`, `tableofcontents` only emit
  `<div class="tufte-placeholder" data-what="…">`. Postprocess runs once per (page, summary)
  (`tufte/processed.html`, memoised). The front-matter `abstract` is rendered first in phase 1
  (`<section class="abstract">…</section><i class="tufte-abstract-end" hidden></i>`), so it is counted and
  resolved with the content; `func/content.html` cuts it off and `tufte/abstract.html` hands it to the title
  block. The title-block `thanks` notes (page and authors) come before it, up to
  `<i class="tufte-tn-end" hidden></i>` (`tufte/title-notes.html`, slots `title`, `aN`), for the same reason:
  never render a `thanks` text with `RenderString` in the title block. A book's front pages built from Markdown
  front matter (epigraphs, frontispiece, publisher, copyright page, root or chapter dedication) work the same
  way. `tufte/book/front-fields.html` renders them in phase 1 as
  `<i class="tufte-ff" data-slot="S" hidden></i>…<i class="tufte-ff-end" hidden></i>`, in landing order (before
  the title notes, before the abstract, after the abstract). `func/content.html` and `tufte/abstract.html` cut
  them off, and the partials read them back with mode `get`. Footnotes defined inside a field are relabelled by
  `tufte/book/fn-local.html`. `head.html` decides on KaTeX from that final HTML (same cached calls as the body), never by
  rendering content again (`.WordCount`).
- **Markers** (fixed attribute order, matched by regexes in postprocess): `span.tufte-num` number tokens,
  `a.xref`, placeholders, `span.tufte-anchor`, `span.index-anchor`, `data-cite`, `<i class="sn-end" hidden>`,
  `<i class="cap-end" hidden>`, `<i class="tufte-float" …>` (label of an unnumbered float, read by
  `tufte/labels.html`, removed by postprocess) and `<i class="tufte-block" hidden>`/`tufte-block-end` (a linked
  stand-alone image's figure, unwrapped from its `<p>` by `func/content-raw.html`),
  `<i class="tufte-attr" data-key=… data-at="img|a" hidden>TEXT<i class="tufte-attr-end" hidden></i>` with
  `TUFTEATTR<key>END` in the attribute (an image alt text or link title holding a shortcode or a `[^x]`,
  resolved by `tufte/attr-marks.html` in phase 1 or in `render-inner.html`), `<span class="bib-extra" data-key>`
  after a reference's or author-year citation's year (plainnat's 1999a, filled by postprocess from
  `tufte/bib/extra.html`), and
  `<span class="citation-block" data-nested="1">…</span><i class="cite-end" hidden></i>` (a cite nested in a
  note or float; its holder cuts it out and merges it into one block after the text with
  `tufte/cite-gather.html`), and `<hN data-tufte-inner id="…">` (a heading rendered by
  `tufte/render-inner.html`; `func/content-raw.html` makes its id unique on the page and drops the mark). An xref marker copied into a
  figure's derived alt text stays HTML-escaped there and `tufte/resolve-refs.html` replaces it with plain text.
  Never write HTML comments as markers (html/template strips them).
- **Nested shortcodes**: a child with `.Parent` stores its HTML in `.Page.Store` (`tufteNest`) and emits a
  `TUFTENEST…END` token; parents render `.Inner` through `tufte/render-inner.html`, which swaps tokens back. Every
  theme shortcode passes its output through `tufte/nest.html`.
- **Options**: always `tufte/opt.html` (page → part → book root → site → preset default, leaf by leaf, keys
  lowercased). Never `cascade` for `tufte`.
- **Books**: a section with `book: true`, or the home page (`content/_index.md`, a whole-site book; taxonomy
  pages stay out). `tufte/book/chapters.html` gives the reading order (matter, weight,
  file name — never date). Labels are global within a book; numbering offsets come from earlier chapters.
- **Warnings** use `warnidf` with the ids listed in README ("Warnings"); never warn in summary mode.
- **Example content**: `posts/sample-handout/` and `books/sample-book/` are ports of Tufte-LaTeX's samples
  (keep them faithful); `posts/latex-to-hugo.md` exercises every tufte-latex shortcode (the base shortcodes are
  shown in the other posts; `video` only as escaped code, since the site ships no video file; `bibliography`
  with a `heading`, so that page has no automatic list, while the handout keeps the automatic one and the book
  ports use `heading=""`; `all=true` runs on no example page); `books/parts-demo/` exercises parts,
  numbered chapters and appendices. The figures are in `exampleSite/static/images/latex/` (SVG converted from the
  Tufte-LaTeX PDFs; ink is `currentColor` with a dark-mode rule). The cheat-sheet table appears both in README and
  in `posts/latex-to-hugo.md` (where shortcodes are escaped as `{{</* … */>}}`): update both together.
- Generated headings use theme-namespaced ids (`tufte-references`, `tufte-index`, `tufte-list-of-figures`,
  `tufte-list-of-tables`, `tufte-list-of-listings`), so they never collide with Goldmark ids of the author's own
  headings (`## References` → `references`). Keep that prefix for any new generated heading, and pick the id with
  `tufte/gen-id.html`, which skips ids the page content already uses (`## Tufte index` → the index gets `tufte-index-2`).
- A content file named `index.md` makes its directory a leaf bundle: never name a book's index chapter so.

