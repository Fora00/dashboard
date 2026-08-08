/**
 * yt-declutter — the bookmarklet payload.
 *
 * This module has NO imports on purpose: no React, no Dexie, nothing from
 * `src/lib/`. It is a pure string factory. Everything inside
 * `HIDE_HOME_SOURCE` is plain ES5 JavaScript (not TypeScript) because it is
 * shipped verbatim inside a `javascript:` URI and executed by YouTube's page,
 * where no compiler ever runs.
 *
 * ## What it targets
 *
 * YouTube mobile web (`m.youtube.com`) renders its bottom tab bar as:
 *
 *     <ytm-pivot-bar-renderer role="tablist">
 *       <ytm-pivot-bar-item-renderer>
 *         <div class="pivot-bar-item-tab pivot-w2w" role="tab" aria-selected="true">
 *           <span class="yt-core-attributed-string" role="text">Home</span>
 *         </div>
 *       </ytm-pivot-bar-item-renderer>
 *       ... Shorts / Create / Subscriptions / You ...
 *     </ytm-pivot-bar-renderer>
 *
 * Each tab carries a per-tab identifier class (`pivot-w2w` — YouTube's
 * internal name for the "what to watch" Home feed — or `pivot-home` on newer
 * builds; siblings use `pivot-shorts`, `pivot-subs`). We match on the item
 * that contains one of the Home classes, so Shorts/Subscriptions/Search are
 * never touched. Two language-independent fallbacks follow (an `<a href="/">`
 * inside the item, then an exact label match), because YouTube's markup drifts
 * between web-app versions.
 *
 * The payload never uses positional selectors (`:nth-of-type(1)`), which is
 * how most public filter lists do this — those silently hide Shorts the day
 * YouTube reorders the bar.
 *
 * ## Why a MutationObserver
 *
 * YouTube mobile web is a client-side-routed SPA: opening a video and going
 * back re-creates the pivot bar, so a one-shot hide only survives until the
 * first in-app navigation. The observer re-applies the hide on every subtree
 * change. It deliberately never disconnects — a page reload clears it, and the
 * bookmarklet is meant to be re-tapped per session.
 *
 * The hide is done with `display: none !important` rather than `.remove()`,
 * which keeps the observer from seeing its own work: we subscribe to
 * `childList` only, so an inline style change produces no mutation record and
 * therefore no feedback loop.
 */

/**
 * The bookmarklet body: plain ES5, no `return` at the top level, every
 * statement semicolon-terminated so it survives being collapsed onto one line.
 * The whole thing is wrapped in a try/catch and every DOM call is individually
 * guarded — if YouTube's markup has moved on, it silently does nothing rather
 * than breaking the page.
 */
export const HIDE_HOME_SOURCE: string = `
try {
  var w = window;
  var d = document;
  var MARK = 'data-ytdeclutter-home';
  var HOME_CLASSES = ['.pivot-home', '.pivot-w2w'];
  var HOME_LABELS = ['home', 'inizio', 'inicio', 'accueil', 'startseite'];
  var matches = function (el, sel) {
    try {
      var fn = el.matches || el.webkitMatchesSelector || el.msMatchesSelector;
      return fn ? !!fn.call(el, sel) : false;
    } catch (err) { return false; }
  };
  var find = function (el, sel) {
    try { return el.querySelector(sel); } catch (err) { return null; }
  };
  var hide = function (el) {
    if (el && el.style && el.style.setProperty) {
      el.setAttribute(MARK, '1');
      el.style.setProperty('display', 'none', 'important');
    }
  };
  var isHome = function (item) {
    var i;
    for (i = 0; i < HOME_CLASSES.length; i++) {
      if (matches(item, HOME_CLASSES[i]) || find(item, HOME_CLASSES[i])) { return true; }
    }
    var link = find(item, 'a[href]');
    if (link) {
      var href = link.getAttribute('href') || '';
      if (href === '/' || href.indexOf('/?') === 0) { return true; }
    }
    var label = (item.textContent || '').trim().toLowerCase();
    if (label) {
      for (i = 0; i < HOME_LABELS.length; i++) {
        if (label === HOME_LABELS[i]) { return true; }
      }
    }
    return false;
  };
  var hideMobileHome = function () {
    var bars = d.querySelectorAll('ytm-pivot-bar-renderer');
    var b;
    for (b = 0; b < bars.length; b++) {
      var items = bars[b].querySelectorAll('ytm-pivot-bar-item-renderer');
      if (!items.length) { items = bars[b].children; }
      if (items.length < 2) { continue; }
      var i;
      for (i = 0; i < items.length; i++) {
        var item = items[i];
        if (!item || item.nodeType !== 1) { continue; }
        if (item.getAttribute(MARK) || isHome(item)) { hide(item); break; }
      }
    }
  };
  var hideDesktopHome = function () {
    var entries = d.querySelectorAll('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer');
    var i;
    for (i = 0; i < entries.length; i++) {
      if (entries[i].getAttribute(MARK) || find(entries[i], 'a[href="/"]')) { hide(entries[i]); }
    }
  };
  var apply = function () {
    try { hideMobileHome(); } catch (err) {}
    try { hideDesktopHome(); } catch (err) {}
  };
  var scheduled = false;
  var schedule = function () {
    if (!scheduled) {
      scheduled = true;
      w.setTimeout(function () { scheduled = false; apply(); }, 50);
    }
  };
  apply();
  if (!w.__ytDeclutterHome) {
    w.__ytDeclutterHome = apply;
    var root = d.body || d.documentElement;
    if (root && w.MutationObserver) {
      new w.MutationObserver(schedule).observe(root, { childList: true, subtree: true });
    }
    var events = ['yt-navigate-start', 'yt-navigate-finish', 'state-navigateend', 'popstate', 'pageshow'];
    var k;
    for (k = 0; k < events.length; k++) {
      try { w.addEventListener(events[k], schedule, true); } catch (err) {}
    }
    var delays = [0, 150, 500, 1500, 4000];
    var t;
    for (t = 0; t < delays.length; t++) { w.setTimeout(apply, delays[t]); }
  }
} catch (err) {}
`;

/**
 * Collapse the source onto a single line.
 *
 * Deliberately naive — it only drops whole-line `//` comments and squeezes
 * whitespace, which is safe *because* `HIDE_HOME_SOURCE` is written for it:
 * no trailing comments, no regex literals, no multi-line expressions, no
 * double spaces inside string literals, and a semicolon on every statement.
 * Keep those invariants if you edit the payload.
 */
function minify(source: string): string {
  return source
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('//'))
    .join(' ')
    .replace(/ {2,}/g, ' ');
}

/**
 * The full `javascript:` URI, ready to drop straight into an `<a href>`.
 *
 * The body is percent-encoded, which matters here beyond good manners: the
 * dashboard runs under HashRouter, so a raw `#` in the payload would truncate
 * the URI. (There is no `#` today, but encoding removes the whole class of
 * problem, along with spaces and quotes.)
 *
 * NOTE for whoever builds the page: React 19 *throws* on a `javascript:` URL
 * passed as a JSX `href` (it was a warning up to React 18). Set it on the DOM
 * node instead — see `bookmarkletRef` below.
 */
export function buildBookmarkletHref(): string {
  return 'javascript:' + encodeURIComponent('(function(){' + minify(HIDE_HOME_SOURCE) + '})();');
}

/**
 * Ref callback that installs the bookmarklet href imperatively, bypassing
 * React 19's `javascript:`-URL guard:
 *
 *     <a ref={bookmarkletRef} ...>Hide YouTube Home</a>
 *
 * Plain DOM, no React import — the type is structural.
 */
export function bookmarkletRef(el: HTMLAnchorElement | null): void {
  if (el) el.setAttribute('href', buildBookmarkletHref());
}
