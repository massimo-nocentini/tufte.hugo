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

CI (`.github/workflows/ci.yml`) builds the example site with Hugo `0.146.0` and `latest` (standard edition).
It checks for sidenote, margin note, section, epigraph and KaTeX markup and for duplicate ids, then runs a second
minified build with `HUGO_PARAMS_SECTIONS=none` and `HUGO_PARAMS_FOOTNOTES=endnotes`.

## Hugo Version and Config

- Minimum Hugo is `0.146.0`, declared in `hugo.toml` (`[module.hugoVersion]`) and `theme.toml` (`min_version`).
  The standard edition is enough. Use only template functions that exist in 0.146.
- The theme's `hugo.toml` holds every `[params]` default. Hugo deep-merges `params` and site values win; `[menus]`
  is merged shallowly. `[markup]`, `[taxonomies]`, `[pagination]` and `[services]` are **not** merged by default
  (a site may opt in with `_merge = "deep"`). The required
  Goldmark settings (`wrapStandAloneImageWithinParagraph = false`, `parser.attribute.block = true`, the passthrough
  extension for math, `highlight.noClasses = false`) therefore live in `exampleSite/hugo.toml` and are documented
  in `README.md`.

## Architecture

The theme uses the Hugo 0.146 template system: `layouts/baseof.html`, `home.html`, `page.html`, `list.html`,
`taxonomy.html`, `term.html`, `archive.html`, `404.html`, plus `layouts/_partials/`, `layouts/_shortcodes/` and
`layouts/_markup/`.

- `assets/css/tufte.css` is **vendored verbatim** from upstream (minus `@font-face`). Never edit it. Put
  overrides in `assets/css/theme.css`.
- `assets/css/et-book.css` contains the ET Book `@font-face` rules. They point to `../et-book/` because the bundle
  is published under `/css/`. The fonts are in `static/et-book/`.
- `layouts/_partials/css.html` concatenates `et-book.css` (if `params.etBook`), `tufte.css`, `theme.css`,
  `syntax.css` and `params.customCSS` into `css/tufte-hugo.css`. It minifies only when `hugo.IsProduction`,
  fingerprints, and emits SRI.
- `layouts/_partials/func/content.html` post-processes `.Content` and `.Summary`. It first applies
  `func/footnotes.html` (Goldmark footnotes become sidenotes when the mode is `sidenotes`), then
  `func/sectionize.html` (`<section>` at each `<h2>` when the mode is `h2`).
- `layouts/_partials/func/note-id.html` returns a unique note id (`<md5(RelPermalink)[:6]>-<n>`, counter in
  `.Page.Store` key `tufteNoteCounter`). Every sidenote, margin note, figure caption and converted footnote
  **must** use it. Ids must stay unique on list pages that show several summaries.
- `layouts/_partials/tufte/figure.html` is the shared figure renderer for the `figure`, `marginfigure` and
  `fullwidthfigure` shortcodes.
- Notes and captions are `<span>`s and must never hold block elements. `tufte/render-inner.html` (inline mode)
  and `func/footnotes.html` pass their HTML through `func/inline-figures.html`, which turns a `<figure>` made
  by the image render hook (an image alone in a note) back into a plain `<img>`.
- `i18n/` has `en`, `it`, `fr`, `de`, `es`. Every key must exist in all five files.
- `layouts/_partials/func/lang.html` hides the Hugo 0.158 renames of the Language methods (`Lang` → `Name`,
  `LanguageName` → `Label`, `LanguageCode` → `Locale`, `LanguageDirection` → `Direction`). Never call those
  methods directly: the deprecated ones warn (and `--panicOnWarning` fails CI) on new Hugo, the new ones do not
  exist on old Hugo.

## Gotchas

- **Tufte CSS widths apply only to direct children of `<section>`** (`section > p`, `section > table`, …). Do not
  wrap content in extra `div`s inside sections. Do not use `<article>` for list items, because Tufte pads
  `article`. Use `div.post-summary`.
- **Sidenote markup is whitespace-sensitive.** Emit label, input and span on one line with `{{- -}}` trims, so
  that no space leaks into the paragraph. The inner text is inline: use `.Page.RenderString` (inline mode) and
  never put block elements inside the `span`.
- **Inline vs block shortcodes.** `sidenote`, `marginnote`, `newthought` and `sans` are inline. `epigraph`,
  `blockquote` and `fullwidth` render `.Inner` with `RenderString (dict "display" "block")`.
- **Math is KaTeX**, server-side by default (`transform.ToMath` in `_markup/render-passthrough.html`;
  `params.math.engine = "client"` keeps the TeX for KaTeX JS). Options and macros come from
  `_partials/func/math-options.html`. The hook sets `.Page.Store "hasMath"`. The head is rendered before the
  content, so the head must touch the content first (or use `templates.Defer`) before it decides whether to load
  the KaTeX assets (`_partials/tufte/katex.html`). CDN URLs and SRI hashes live in `data/tufte/vendor.toml`
  (emitted by `_partials/tufte/vendor.html`, which also handles `params.selfHosted`): bump URL and hash together.
- **`.IsBlock` in `render-image.html`** works only when the site sets
  `wrapStandAloneImageWithinParagraph = false`.
- **Use `relURL` / `.RelPermalink`** for assets and links. `absURL` / `.Permalink` are acceptable only in
  canonical, Open Graph, Twitter, schema and RSS output.
- **The CSS class names are a contract** between `layouts/` and `assets/css/theme.css`. Rename a class in both
  places or not at all.
- **Document features.** Each new param, front matter key, shortcode or render hook goes in `README.md` and in
  an example-site page (`exampleSite/content/posts/theme-guide.md`).
