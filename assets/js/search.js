// ---------- SITE SEARCH (command palette) ----------
// Modelled on the gh-600-study-notes search. The index is built in the browser
// the first time search is used: every page linked from the sidebar is fetched
// and split into one record per h2/h3 section, so a result lands on the exact
// heading. Nothing is generated at build time, so it can never drift from the
// content.
(() => {
  const ICONS = {
    search: 'M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z',
    x: 'M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z',
    file: 'M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z',
    hash: 'M6.368 1.01a.75.75 0 0 1 .623.859L6.57 4.5h3.98l.46-2.868a.75.75 0 0 1 1.48.237L12.07 4.5h2.18a.75.75 0 0 1 0 1.5h-2.42l-.64 4h2.56a.75.75 0 0 1 0 1.5h-2.8l-.46 2.869a.75.75 0 0 1-1.48-.237l.42-2.632H5.45l-.46 2.869a.75.75 0 0 1-1.48-.237l.42-2.632H1.75a.75.75 0 0 1 0-1.5h2.42l.64-4H2.25a.75.75 0 0 1 0-1.5h2.8l.46-2.868a.75.75 0 0 1 .858-.622ZM9.67 10l.64-4H6.33l-.64 4Z',
  };

  // Stripped before indexing: navigation chrome and the disclaimer repeated on every page.
  const NOISE = '.breadcrumb, .page-toc, .disclaimer, .page-nav, script, style, noscript, svg';
  const BLOCKS = 'p, li, td, th, tr, div, pre, blockquote, h1, h2, h3, h4, h5, h6, dt, dd, summary';
  const MAX_RESULTS = 30;

  const clean = (s) => s.replace(/\s+/g, ' ').trim();
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTyping = (el) =>
    el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

  function icon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', ICONS[name]);
    svg.appendChild(path);
    return svg;
  }

  // The sidebar is the page registry: every internal link in it gets indexed.
  function collectPages() {
    const seen = new Set();
    const pages = [];
    document.querySelectorAll('.sidebar a.sidebar-link[href]').forEach((link) => {
      let url;
      try {
        url = new URL(link.getAttribute('href'), location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin) return;
      url.hash = '';
      url.search = '';
      if (seen.has(url.href)) return;
      seen.add(url.href);
      const label = clean(
        Array.from(link.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent)
          .join(' ')
      );
      pages.push({ url: url.href, label });
    });
    return pages;
  }

  function record(page, heading, hash, text, isPage) {
    return {
      url: page.url + hash,
      page: page.label,
      heading,
      text,
      isPage,
      h: heading.toLowerCase(),
      l: page.label.toLowerCase(),
      t: text.toLowerCase(),
    };
  }

  function extract(html, page) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const main = doc.querySelector('.main-content');
    if (!main) return [];

    main.querySelectorAll(NOISE).forEach((n) => n.remove());
    // Keep words in neighbouring blocks and table cells apart once flattened to text.
    main.querySelectorAll(BLOCKS).forEach((el) => el.append(' '));
    main.querySelectorAll('br').forEach((el) => el.replaceWith(' '));

    // Card titles (home skill cards, exam-tips topics) are body text, not sections.
    const heads = Array.from(main.querySelectorAll('h2, h3')).filter((h) => !h.closest('.card'));
    const range = doc.createRange();
    const endAt = (i) => {
      if (i < heads.length) range.setEndBefore(heads[i]);
      else range.setEnd(main, main.childNodes.length);
    };
    const out = [];

    const h1 = main.querySelector('h1');
    range.setStart(main, 0);
    endAt(0);
    out.push(record(page, h1 ? clean(h1.textContent) : page.label, '', clean(range.toString()), true));

    let hash = '';
    heads.forEach((head, i) => {
      if (head.id) hash = '#' + head.id;
      range.setStartAfter(head);
      endAt(i + 1);
      out.push(record(page, clean(head.textContent), hash, clean(range.toString()), false));
    });
    return out;
  }

  function score(rec, terms, phrase) {
    let s = 0;
    for (const term of terms) {
      const inHeading = rec.h.includes(term);
      const inLabel = rec.l.includes(term);
      const inText = rec.t.includes(term);
      // Every term must match, so extra words narrow the results rather than widen them.
      if (!inHeading && !inLabel && !inText) return 0;
      const esc = escapeRe(term);
      const word = new RegExp(`(?:^|[^a-z0-9])${esc}(?![a-z0-9])`, 'g');
      const start = new RegExp(`(?:^|[^a-z0-9])${esc}`);
      // A whole word ("Max") outranks a word prefix ("maximum"), which outranks a match mid-word.
      const kind = (str) => (str.search(word) !== -1 ? 3 : start.test(str) ? 2 : 1);
      if (inHeading) s += 4 * kind(rec.h);
      if (inLabel) s += 3;
      if (inText) {
        const words = (rec.t.match(word) || []).length;
        s += words ? 3 + Math.min(words - 1, 3) : start.test(rec.t) ? 2 : 1;
      }
    }
    if (terms.length > 1) {
      if (rec.h.includes(phrase)) s += 25;
      else if (rec.t.includes(phrase)) s += 8;
    }
    if (rec.h === phrase) s += 30;
    // Only a tie-breaker: prefer the tighter section.
    if (rec.t.length < 900) s += 0.5;
    return s;
  }

  function highlight(text, terms) {
    const frag = document.createDocumentFragment();
    const lower = text.toLowerCase();
    const ranges = [];
    for (const term of terms) {
      for (let i = lower.indexOf(term); i !== -1; i = lower.indexOf(term, i + term.length)) {
        ranges.push([i, i + term.length]);
      }
    }
    ranges.sort((a, b) => a[0] - b[0]);

    const merged = [];
    for (const r of ranges) {
      const last = merged[merged.length - 1];
      if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
      else merged.push(r);
    }

    let cursor = 0;
    for (const [start, end] of merged) {
      frag.append(text.slice(cursor, start));
      const mark = document.createElement('mark');
      mark.textContent = text.slice(start, end);
      frag.append(mark);
      cursor = end;
    }
    frag.append(text.slice(cursor));
    return frag;
  }

  function snippet(text, terms) {
    const lower = text.toLowerCase();
    let at = -1;
    for (const term of terms) {
      const i = lower.indexOf(term);
      if (i !== -1 && (at === -1 || i < at)) at = i;
    }
    if (at === -1) return text.length > 160 ? text.slice(0, 160) + '…' : text;
    const start = Math.max(0, at - 70);
    const end = Math.min(text.length, at + 130);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }

  function init() {
    const trigger = document.querySelector('.search-trigger');
    if (!trigger) return;
    const pages = collectPages();
    if (typeof HTMLDialogElement !== 'function' || !pages.length) {
      trigger.remove();
      return;
    }

    const modal = document.createElement('dialog');
    modal.className = 'search-modal';
    modal.setAttribute('aria-label', 'Search the study notes');
    modal.innerHTML = `
      <div class="sm-inner">
        <div class="sm-field">
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="${ICONS.search}"/></svg>
          <input type="text" class="sm-input" inputmode="search" enterkeyhint="search"
            placeholder="Search the notes — agent mode, content exclusions, PRUs…"
            autocomplete="off" autocapitalize="off" spellcheck="false"
            role="combobox" aria-label="Search the study notes" aria-expanded="false"
            aria-controls="sm-results" aria-autocomplete="list">
          <button type="button" class="sm-close" aria-label="Close search">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="${ICONS.x}"/></svg>
          </button>
        </div>
        <p class="sm-status" role="status" aria-live="polite"></p>
        <ul class="sm-results" id="sm-results" role="listbox" aria-label="Search results"></ul>
        <div class="sm-foot" aria-hidden="true">
          <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to open</span>
          <span><kbd>esc</kbd> to close</span>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const input = modal.querySelector('.sm-input');
    const status = modal.querySelector('.sm-status');
    const list = modal.querySelector('.sm-results');

    let records = null;
    let building = null;
    let failed = false;
    let active = -1;

    function buildIndex() {
      if (records) return Promise.resolve(records);
      if (!building) {
        building = Promise.all(
          pages.map((page) =>
            fetch(page.url)
              .then((r) => (r.ok ? r.text() : ''))
              .then((html) => (html ? extract(html, page) : []))
              .catch(() => [])
          )
        ).then((groups) => {
          const all = groups.flat();
          // An empty index means every fetch failed: leave it unset so the next open retries.
          failed = !all.length;
          if (!failed) records = all;
          building = null;
          return all;
        });
      }
      return building;
    }

    function setActive(next) {
      const items = list.querySelectorAll('.sm-hit');
      if (!items.length) return;
      active = (next + items.length) % items.length;
      items.forEach((li, i) => {
        const on = i === active;
        li.classList.toggle('active', on);
        li.setAttribute('aria-selected', String(on));
        if (on) {
          li.scrollIntoView({ block: 'nearest' });
          input.setAttribute('aria-activedescendant', li.id);
        }
      });
    }

    function render(query) {
      const terms = [...new Set(query.toLowerCase().split(/\s+/).filter(Boolean))];
      list.textContent = '';
      active = -1;
      input.removeAttribute('aria-activedescendant');
      input.setAttribute('aria-expanded', 'false');

      if (!terms.length) {
        status.textContent = `Search across all ${pages.length} pages of notes.`;
        return;
      }
      if (!records) {
        status.textContent = failed
          ? 'Couldn’t load the search index. Check your connection and try again.'
          : 'Building the search index…';
        return;
      }

      const phrase = terms.join(' ');
      const hits = records
        .map((rec) => ({ rec, s: score(rec, terms, phrase) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, MAX_RESULTS)
        .map((r) => r.rec);

      status.textContent = hits.length
        ? `${hits.length}${hits.length === MAX_RESULTS ? '+' : ''} result${hits.length === 1 ? '' : 's'}`
        : `No results for “${query}”.`;
      if (!hits.length) return;

      hits.forEach((rec, i) => {
        const li = document.createElement('li');
        li.className = 'sm-hit';
        li.id = `sm-hit-${i}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');

        const a = document.createElement('a');
        a.href = rec.url;

        const body = document.createElement('span');
        body.className = 'sm-body';
        const crumb = document.createElement('span');
        crumb.className = 'sm-crumb';
        crumb.textContent = rec.page;
        const title = document.createElement('span');
        title.className = 'sm-title';
        title.append(highlight(rec.heading, terms));
        body.append(crumb, title);
        if (rec.text) {
          const text = document.createElement('span');
          text.className = 'sm-snippet';
          text.append(highlight(snippet(rec.text, terms), terms));
          body.append(text);
        }

        a.append(icon(rec.isPage ? 'file' : 'hash'), body);
        li.append(a);
        list.append(li);
      });

      input.setAttribute('aria-expanded', 'true');
      setActive(0);
    }

    function open() {
      if (modal.open) return;
      modal.showModal();
      input.focus();
      input.select();
      render(input.value.trim());
      if (!records) {
        buildIndex().then(() => {
          if (modal.open) render(input.value.trim());
        });
      }
    }

    function close() {
      if (modal.open) modal.close();
    }

    function go(href) {
      const url = new URL(href);
      close();
      if (url.pathname !== location.pathname) {
        location.href = url.href;
        return;
      }
      // Same page: scroll there ourselves, since re-assigning the current hash is a no-op.
      const target = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
      if (url.hash !== location.hash) history.pushState(null, '', url.hash || location.pathname + location.search);
      const behavior = reduceMotion() ? 'auto' : 'smooth';
      if (!target) {
        window.scrollTo({ top: 0, behavior });
        return;
      }
      target.scrollIntoView({ behavior, block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }

    trigger.addEventListener('click', open);
    ['pointerenter', 'focus'].forEach((type) =>
      trigger.addEventListener(type, () => void buildIndex(), { once: true })
    );
    modal.querySelector('.sm-close').addEventListener('click', close);

    // Close on a backdrop click, but not when a text selection drag merely ends there.
    let downOnBackdrop = false;
    modal.addEventListener('pointerdown', (e) => {
      downOnBackdrop = e.target === modal;
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal && downOnBackdrop) close();
    });

    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => render(input.value.trim()), 80);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(active + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(active - 1);
      } else if (e.key === 'Enter' && !e.isComposing) {
        const link = list.querySelector('.sm-hit.active a');
        if (link) {
          e.preventDefault();
          go(link.href);
        }
      }
    });

    list.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      go(link.href);
    });

    // GitHub's own shortcuts: Ctrl/Cmd+K from anywhere, "/" when not typing.
    document.addEventListener('keydown', (e) => {
      if (e.defaultPrevented || e.isComposing) return;
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        if (modal.open) close();
        else open();
      } else if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !modal.open && !isTyping(e.target)) {
        e.preventDefault();
        open();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
