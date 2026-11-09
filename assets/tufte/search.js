/*
 * tufte.hugo site search (README "Search").
 *
 * Reads its settings from <script type="application/json"
 * id="tufte-search-config"> (layouts/_partials/js.html,
 * tufte/search/config.html). On the first search it loads Fuse.js and the
 * index (layouts/home.searchindex.json): Fuse.js is an ES module, so it is
 * added as <script type="module" integrity=…>, which the browser checks
 * against its hash, and then imported from the same URL, which the browser
 * takes from its module map instead of fetching it again.
 *
 * Boxes: the header box (form[data-tufte-search="box"], a combobox whose
 * best matches show under it) and the results page
 * (form[data-tufte-search="page"], layout "search", query in ?q=). Both
 * forms are hidden until this script runs.
 *
 * window.tufteSearch exposes the engine for site scripts:
 *   tufteSearch.load()            → Promise of the engine
 *   engine.search(query, limit)   → [{entry, section, terms}]
 * where entry is an index entry (title, url, where, date, sections) and
 * section the index of its best-matching section.
 */
(function () {
  'use strict';

  var TOKEN = /[\p{L}\p{M}\p{N}_]+/gu;
  var MARKS = /\p{M}+/gu;

  // Lower case without diacritics, one output string per input character,
  // so that a position in the folded text is a position in the text.
  function foldChars(text) {
    var out = [];
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      var f = c.toLowerCase().normalize('NFD').replace(MARKS, '');
      out.push(f.length === 1 ? f : c.toLowerCase().length === 1 ? c.toLowerCase() : c);
    }
    return out;
  }

  function fold(text) {
    return foldChars(text).join('');
  }

  function terms(query) {
    var seen = {};
    var list = [];
    (fold(query).match(TOKEN) || []).forEach(function (t) {
      if (t.length > 1 && !seen[t]) {
        seen[t] = true;
        list.push(t);
      }
    });
    return list;
  }

  function count(text, list) {
    var f = fold(text || '');
    var n = 0;
    list.forEach(function (t) {
      if (f.indexOf(t) >= 0) n++;
    });
    return n;
  }

  // The section of an entry that holds most of the query's words (a
  // heading counts twice); 0 when none holds any (a fuzzy match).
  function bestSection(entry, list) {
    var best = 0;
    var bestScore = 0;
    (entry.sections || []).forEach(function (s, i) {
      var score = 2 * count(s.heading, list) + count(s.text, list) + count((s.notes || []).join(' '), list);
      if (score > bestScore) {
        best = i;
        bestScore = score;
      }
    });
    return best;
  }

  function createEngine(Fuse, entries, options) {
    options = options || {};
    var fuse = new Fuse(entries, {
      keys: [
        { name: 'title', weight: 3 },
        { name: 'sections.heading', weight: 2 },
        { name: 'where', weight: 0.5 },
        { name: 'sections.text', weight: 1 },
        { name: 'sections.notes', weight: 0.8 }
      ],
      threshold: typeof options.threshold === 'number' ? options.threshold : 0.3,
      ignoreLocation: true,
      ignoreDiacritics: true,
      minMatchCharLength: 2,
      useTokenSearch: true,
      tokenMatch: 'all',
      includeScore: true
    });
    return {
      entries: entries,
      search: function (query, limit) {
        query = (query || '').trim();
        if (query.length < 2) return [];
        var list = terms(query);
        var hits = limit ? fuse.search(query, { limit: limit }) : fuse.search(query);
        return hits.map(function (h) {
          return { entry: h.item, section: bestSection(h.item, list), terms: list, score: h.score };
        });
      }
    };
  }

  // A piece of TEXT of about LEN characters around the first word of LIST
  // it holds (else its start), as a fragment with the words in <mark>.
  function snippet(text, list, len) {
    var frag = document.createDocumentFragment();
    text = text || '';
    var chars = foldChars(text);
    var folded = chars.join('');
    var first = -1;
    list.forEach(function (t) {
      var i = folded.indexOf(t);
      if (i >= 0 && (first < 0 || i < first)) first = i;
    });
    // cut at a space near the cut point, else (text with few spaces,
    // such as Chinese or a long URL) at the point itself
    var start = 0;
    if (first > len / 3) {
      var cut = first - Math.floor(len / 3);
      var sp0 = text.lastIndexOf(' ', cut);
      start = sp0 >= 0 && cut - sp0 <= 20 ? sp0 + 1 : cut;
    }
    var end = start + len;
    if (end < text.length) {
      var sp = text.lastIndexOf(' ', end);
      end = sp > start && end - sp <= 20 ? sp : end;
    } else {
      end = text.length;
    }
    // the marked ranges inside [start, end)
    var ranges = [];
    list.forEach(function (t) {
      var i = folded.indexOf(t, start);
      while (i >= 0 && i < end) {
        ranges.push([i, Math.min(i + t.length, end)]);
        i = folded.indexOf(t, i + t.length);
      }
    });
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var pos = start;
    if (start > 0) frag.appendChild(document.createTextNode('… '));
    ranges.forEach(function (r) {
      if (r[0] < pos) {
        if (r[1] <= pos) return;
        r[0] = pos;
      }
      if (r[0] > pos) frag.appendChild(document.createTextNode(text.slice(pos, r[0])));
      var m = document.createElement('mark');
      m.textContent = text.slice(r[0], r[1]);
      frag.appendChild(m);
      pos = r[1];
    });
    if (pos < end) frag.appendChild(document.createTextNode(text.slice(pos, end)));
    if (end < text.length) frag.appendChild(document.createTextNode(' …'));
    return frag;
  }

  // The text a result shows: of its best section, the text or the note
  // that holds most of the words.
  function resultText(hit) {
    var s = (hit.entry.sections || [])[hit.section];
    if (!s) return '';
    var best = s.text || '';
    var bestN = count(best, hit.terms);
    (s.notes || []).forEach(function (n) {
      var c = count(n, hit.terms);
      if (c > bestN || !best) {
        best = n;
        bestN = c;
      }
    });
    return best;
  }

  function resultURL(hit) {
    var s = (hit.entry.sections || [])[hit.section];
    return hit.entry.url + (s && s.id ? '#' + encodeURIComponent(s.id) : '');
  }

  var api = { createEngine: createEngine, snippet: snippet, terms: terms, fold: fold };
  window.tufteSearch = api;

  var cfgEl = document.getElementById('tufte-search-config');
  if (!cfgEl) return;
  var cfg;
  try {
    cfg = JSON.parse(cfgEl.textContent);
  } catch (e) {
    return;
  }
  var msg = cfg.msg || {};
  var rules = null;
  var numbers = null;
  try {
    rules = new Intl.PluralRules(cfg.locale || undefined);
    numbers = new Intl.NumberFormat(cfg.locale || undefined);
  } catch (e) {
    rules = null;
    numbers = null;
  }

  // One pass, so that a query holding "{count}" or "$&" stays as typed.
  function format(s, query, n) {
    return (s || '').replace(/\{(query|count)\}/g, function (m, k) {
      if (k === 'query') return query;
      return n === undefined ? '' : numbers ? numbers.format(n) : String(n);
    });
  }

  function countText(n, query) {
    if (n === 0) return format(msg.none, query);
    var cat = rules ? rules.select(n) : (n === 1 ? 'one' : 'other');
    return format(cat === 'one' ? msg.one : msg.other, query, n);
  }

  var enginePromise = null;

  function loadFuse() {
    var url = new URL(cfg.fuse, document.baseURI).href;
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.type = 'module';
      if (cfg.fuseIntegrity) s.integrity = cfg.fuseIntegrity;
      s.crossOrigin = 'anonymous';
      s.onload = function () {
        import(url).then(function (m) { resolve(m.default); }, reject);
      };
      s.onerror = function () { reject(new Error('tufte search: cannot load ' + url)); };
      s.src = url;
      document.head.appendChild(s);
    });
  }

  function load() {
    if (!enginePromise) {
      var index = fetch(cfg.index, { credentials: 'same-origin' }).then(function (r) {
        if (!r.ok) throw new Error('tufte search: ' + cfg.index + ': ' + r.status);
        return r.json();
      });
      enginePromise = Promise.all([loadFuse(), index]).then(function (v) {
        return createEngine(v[0], v[1], { threshold: cfg.threshold });
      });
      enginePromise.catch(function (e) {
        console.error(e);
        enginePromise = null;
      });
    }
    return enginePromise;
  }
  api.load = load;

  function meta(entry) {
    return [entry.where, entry.date].filter(Boolean).join(' · ');
  }

  // One result: title (and section heading), where · date, snippet.
  function resultNode(hit, len, tag, id) {
    var el = document.createElement(tag);
    el.className = 'search-result';
    var a = document.createElement('a');
    a.href = resultURL(hit);
    if (id) {
      a.id = id;
      a.setAttribute('role', 'option');
      a.setAttribute('aria-selected', 'false');
      a.tabIndex = -1;
    }
    var title = document.createElement('span');
    title.className = 'search-result-title';
    title.textContent = hit.entry.title || msg.untitled || '';
    a.appendChild(title);
    var s = (hit.entry.sections || [])[hit.section];
    if (s && s.heading) {
      var h = document.createElement('span');
      h.className = 'search-result-heading';
      h.textContent = s.heading;
      a.appendChild(document.createTextNode(' '));
      a.appendChild(h);
    }
    var m = meta(hit.entry);
    if (m) {
      var mm = document.createElement('span');
      mm.className = 'search-result-meta';
      mm.textContent = m;
      a.appendChild(document.createTextNode(' '));
      a.appendChild(mm);
    }
    var text = resultText(hit);
    if (text) {
      var sn = document.createElement('span');
      sn.className = 'search-result-text';
      sn.appendChild(snippet(text, hit.terms, len));
      a.appendChild(document.createTextNode(' '));
      a.appendChild(sn);
    }
    el.appendChild(a);
    return el;
  }

  function editable(el) {
    return el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  }

  // The header box: a combobox with a list of the best matches, in a panel
  // under the box that also shows "no results" or an error.
  function setupBox(form) {
    var input = form.querySelector('input[type="search"]');
    var panel = form.querySelector('.site-search-results');
    var list = panel && panel.querySelector('[role="listbox"]');
    var note = panel && panel.querySelector('.search-result-none');
    var status = form.querySelector('[role="status"]');
    if (!input || !list || !note) return;
    form.hidden = false;
    var active = -1;
    var timer = null;
    var seq = 0;

    function options() {
      return list.querySelectorAll('[role="option"]');
    }

    function setActive(i) {
      var opts = options();
      if (!opts.length) return;
      if (i < 0) i = opts.length - 1;
      if (i >= opts.length) i = 0;
      opts.forEach(function (o, k) {
        o.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
      active = i;
      input.setAttribute('aria-activedescendant', opts[i].id);
      opts[i].scrollIntoView({ block: 'nearest' });
    }

    function close() {
      seq++;
      panel.hidden = true;
      list.textContent = '';
      note.hidden = true;
      active = -1;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }

    // Keep the panel on screen: it hangs from the box's end edge, unless
    // that would push it past the start of the window (a header that
    // wraps puts the box at the start of its line).
    function place() {
      panel.classList.remove('site-search-results-start');
      var r = panel.getBoundingClientRect();
      if (r.left < 8 || r.right > document.documentElement.clientWidth - 8) {
        panel.classList.add('site-search-results-start');
      }
    }

    function show(nodes, text) {
      list.textContent = '';
      nodes.forEach(function (n) { list.appendChild(n); });
      note.textContent = nodes.length ? '' : text;
      note.hidden = !!nodes.length;
      panel.hidden = false;
      active = -1;
      input.setAttribute('aria-expanded', nodes.length ? 'true' : 'false');
      input.removeAttribute('aria-activedescendant');
      if (status) status.textContent = text;
      place();
    }

    function run() {
      var q = input.value.trim();
      var my = ++seq;
      if (q.length < 2) {
        close();
        return;
      }
      var loading = setTimeout(function () {
        if (my === seq) show([], msg.loading || '');
      }, 150);
      load().then(function (engine) {
        clearTimeout(loading);
        if (my !== seq) return;
        var hits = engine.search(q);
        var nodes = hits.slice(0, cfg.maxResults || 8).map(function (h, i) {
          return resultNode(h, 110, 'div', list.id + '-' + i);
        });
        show(nodes, countText(hits.length, q));
      }, function () {
        clearTimeout(loading);
        if (my === seq) show([], msg.error || '');
      });
    }

    input.addEventListener('focus', function () { load().catch(function () {}); });
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(run, 120);
    });
    form.addEventListener('keydown', function (e) {
      if (e.isComposing) return;
      if (e.key === 'Escape') {
        if (!panel.hidden) {
          e.preventDefault();
          close();
          input.focus();
        } else if (input.value) {
          e.preventDefault();
          input.value = '';
        } else {
          input.blur();
        }
      }
    });
    input.addEventListener('keydown', function (e) {
      if (e.isComposing) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (panel.hidden) {
          run();
          return;
        }
        setActive(active + (e.key === 'ArrowDown' ? 1 : -1));
      } else if (e.key === 'Enter') {
        var opts = options();
        if (active >= 0 && opts[active]) {
          e.preventDefault();
          window.location.href = opts[active].href;
        }
      }
    });
    form.addEventListener('submit', function (e) {
      var q = input.value.trim();
      if (!q) {
        e.preventDefault();
        return;
      }
      if (form.getAttribute('action')) return; // the results page
      e.preventDefault();
      load().then(function (engine) {
        var hits = engine.search(q, 1);
        if (hits.length) window.location.href = resultURL(hits[0]);
        else show([], countText(0, q));
      }, function () {
        show([], msg.error || '');
      });
    });
    panel.addEventListener('mousedown', function (e) {
      // keep the focus in the box while a result is clicked
      if (e.target.closest('[role="option"]')) e.preventDefault();
    });
    form.addEventListener('focusout', function (e) {
      if (!e.relatedTarget || !form.contains(e.relatedTarget)) close();
    });
    document.addEventListener('click', function (e) {
      if (!form.contains(e.target)) close();
    });
    if (cfg.hotkey) {
      document.addEventListener('keydown', function (e) {
        if (e.key === cfg.hotkey && !e.isComposing && !e.ctrlKey && !e.metaKey && !e.altKey && !editable(document.activeElement)) {
          e.preventDefault();
          input.focus();
          input.select();
        }
      });
    }
  }

  // The results page: every match of ?q=, updated as the query changes.
  function setupPage(form) {
    var input = form.querySelector('input[type="search"]');
    var section = form.parentNode;
    var status = section.querySelector('.search-status');
    var list = section.querySelector('.search-results');
    if (!input || !list) return;
    form.hidden = false;
    var timer = null;
    var seq = 0;

    function run(push) {
      var q = input.value.trim();
      var my = ++seq;
      var url = new URL(window.location.href);
      if (q) url.searchParams.set('q', q);
      else url.searchParams.delete('q');
      if (url.href !== window.location.href) {
        window.history[push ? 'pushState' : 'replaceState'](null, '', url.href);
      }
      list.textContent = '';
      if (q.length < 2) {
        if (status) status.textContent = '';
        return;
      }
      if (status) status.textContent = msg.loading || '';
      load().then(function (engine) {
        if (my !== seq) return;
        var hits = engine.search(q);
        hits.forEach(function (h) { list.appendChild(resultNode(h, 240, 'li')); });
        if (status) status.textContent = countText(hits.length, q);
      }, function () {
        if (my === seq && status) status.textContent = msg.error || '';
      });
    }

    input.value = new URLSearchParams(window.location.search).get('q') || '';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearTimeout(timer);
      run(true);
    });
    input.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { run(false); }, 200);
    });
    window.addEventListener('popstate', function () {
      input.value = new URLSearchParams(window.location.search).get('q') || '';
      run(false);
    });
    if (input.value) run(false);
    else input.focus();
  }

  function init() {
    document.querySelectorAll('form[data-tufte-search="box"]').forEach(setupBox);
    document.querySelectorAll('form[data-tufte-search="page"]').forEach(setupPage);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
