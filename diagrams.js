/* ============================================================
   Diagrams — hand-built inline SVG, no image files, no libraries.

   Everything themes off the same CSS variables as the rest of the
   site, so diagrams follow the light/dark toggle automatically.

   To edit a project diagram, change its `stages` array below.
   ============================================================ */

(function () {
  'use strict';

  var W = 168;   // node width
  var H = 72;    // node height
  var G = 30;    // gap between nodes
  var PAD = 18;  // outer padding
  var TOP = 40;  // y of the node row

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function defs() {
    return '<defs>' +
      '<marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
        '<path d="M0,0 L10,5 L0,10 z" fill="var(--accent-dim)"/></marker>' +
      '<marker id="ar-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
        '<path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker>' +
      '</defs>';
  }

  function nodeX(i) { return PAD + i * (W + G); }

  /* One pipeline node: numbered box with a title and up to two sub-lines. */
  function node(i, s) {
    var x = nodeX(i), cx = x + W / 2;
    var subs = [].concat(s.sub || []);
    var h = '';
    h += '<rect x="' + x + '" y="' + TOP + '" width="' + W + '" height="' + H + '" rx="8" ' +
         'fill="var(--bg-raised)" stroke="var(--line)"/>';
    h += '<text x="' + (x + 12) + '" y="' + (TOP - 10) + '" font-family="var(--mono)" font-size="10.5" ' +
         'letter-spacing="1.2" fill="var(--accent)">' + String(i + 1).padStart(2, '0') + '</text>';
    h += '<text x="' + cx + '" y="' + (TOP + (subs.length ? 27 : 42)) + '" text-anchor="middle" ' +
         'font-family="var(--sans)" font-size="13.5" font-weight="600" fill="var(--ink)">' + esc(s.title) + '</text>';
    subs.forEach(function (t, k) {
      h += '<text x="' + cx + '" y="' + (TOP + 45 + k * 14) + '" text-anchor="middle" ' +
           'font-family="var(--mono)" font-size="10" fill="var(--ink-dim)">' + esc(t) + '</text>';
    });
    return h;
  }

  /* Straight connector between node i and node i+1. */
  function link(i) {
    var x1 = nodeX(i) + W + 5, x2 = nodeX(i + 1) - 3, y = TOP + H / 2;
    return '<path d="M' + x1 + ',' + y + ' H' + x2 + '" stroke="var(--accent-dim)" ' +
           'stroke-width="1.5" fill="none" marker-end="url(#ar)"/>';
  }

  /* Dashed feedback path: down from `from`, along a bar, back up into `to`. */
  function feedback(stages, fb) {
    var barY = TOP + H + 76, barH = 52;
    var toX = nodeX(fb.to), fromX = nodeX(fb.from);
    var barX = toX, barW = fromX + W - toX;
    var laneX = toX - G / 2;                  // gap lane left of the target node
    var fromCx = fromX + W / 2;
    var h = '';

    h += '<rect x="' + barX + '" y="' + barY + '" width="' + barW + '" height="' + barH + '" rx="8" ' +
         'fill="var(--accent-bg)" stroke="var(--accent-dim)" stroke-dasharray="4 3"/>';
    h += '<text x="' + (barX + barW / 2) + '" y="' + (barY + 21) + '" text-anchor="middle" ' +
         'font-family="var(--sans)" font-size="13" font-weight="600" fill="var(--accent)">' + esc(fb.title) + '</text>';
    h += '<text x="' + (barX + barW / 2) + '" y="' + (barY + 39) + '" text-anchor="middle" ' +
         'font-family="var(--mono)" font-size="10" fill="var(--ink-mid)">' + esc(fb.sub) + '</text>';

    // out of the last stage, straight down into the top of the bar
    h += '<path d="M' + fromCx + ',' + (TOP + H) + ' V' + (barY - 3) + '" ' +
         'stroke="var(--accent)" stroke-width="1.5" fill="none" stroke-dasharray="4 3" marker-end="url(#ar-a)"/>';
    // out of the bar, up into the target stage
    h += '<path d="M' + barX + ',' + (barY + barH / 2) + ' H' + laneX + ' V' + (TOP + H / 2) + ' H' + (toX - 3) + '" ' +
         'stroke="var(--accent)" stroke-width="1.5" fill="none" stroke-dasharray="4 3" marker-end="url(#ar-a)"/>';
    return h;
  }

  /* Assemble a pipeline diagram. */
  function pipeline(stages, fb) {
    var w = PAD * 2 + stages.length * W + (stages.length - 1) * G;
    var h = fb ? TOP + H + 76 + 52 + PAD : TOP + H + PAD;
    var svg = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" ' +
              'style="width:100%;min-width:' + Math.round(w * 0.72) + 'px;height:auto;display:block">';
    svg += defs();
    for (var i = 0; i < stages.length - 1; i++) svg += link(i);
    stages.forEach(function (s, i) { svg += node(i, s); });
    if (fb) svg += feedback(stages, fb);
    return svg + '</svg>';
  }

  /* ---------- per-project diagrams ---------- */

  var D = {};

  D['options-scanner'] = {
    caption: 'Daily pipeline, with the Friday reflection loop that amends the scoring frameworks.',
    svg: pipeline([
      { title: 'Scan',    sub: ['NASDAQ / NYSE', 'RSI · MACD · EMA'] },
      { title: 'Distill', sub: ['creator posts', '→ framework-v1.md'] },
      { title: 'Score',   sub: ['LLM vs framework', '5 providers'] },
      { title: 'Alert',   sub: ['≤ 10 / week', 'Telegram · email'] },
      { title: 'Journal', sub: ['R-multiples', 'P&L + backtest'] }
    ], {
      from: 4, to: 1,
      title: 'Weekly reflection',
      sub: 'finds repeat misses → drafts framework-v2 → human approves or rejects'
    })
  };

  D['ai-learning-skill'] = {
    caption: 'One product plus one job function in; fifteen calibrated, quizzed sessions out.',
    svg: pipeline([
      { title: 'Input',     sub: ['a real product', '+ your role'] },
      { title: 'Research',  sub: ['stack + rivals', 'third-party first'] },
      { title: 'Calibrate', sub: ['profile + quiz', 'sets depth'] },
      { title: 'Generate',  sub: ['15 HTML days', '+ quizzes'] },
      { title: 'Deliver',   sub: ['manifest.json', 'daily email'] }
    ])
  };

  D['unhooked'] = {
    caption: 'The economy loop. Energy is earned by behaviour; Gems are paid and deliberately buy no advantage.',
    svg: pipeline([
      { title: 'Stay under',  sub: ['self-set', 'daily limit'] },
      { title: 'Earn Energy', sub: ['behaviour only', 'never purchased'] },
      { title: 'Feed + care',  sub: ['food costs', 'Energy'] },
      { title: 'Pet evolves',  sub: ['egg → baby →', 'stage effects'] },
      { title: 'Gems',        sub: ['cosmetics only', 'no gameplay edge'] }
    ], {
      from: 3, to: 0,
      title: 'Fairness guardrail',
      sub: 'avg_daily_buff ≤ 0.20 · paid recovery restores baseline only · no leaderboards'
    })
  };

  /* ---------- small glyphs for the overview strip ---------- */

  function glyph(body) {
    return '<svg viewBox="0 0 44 44" width="44" height="44" fill="none" ' +
      'stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      body + '</svg>';
  }

  var GL = {
    'options-scanner': glyph(
      '<path d="M4 30 L12 22 L18 26 L28 12 L34 18" stroke="var(--accent)"/>' +
      '<circle cx="34" cy="18" r="2.4" fill="var(--accent)" stroke="none"/>' +
      '<path d="M8 38 A14 14 0 0 0 36 34" stroke="var(--accent-dim)" stroke-dasharray="3 3"/>' +
      '<path d="M33 31 L37 34 L33 37" stroke="var(--accent-dim)"/>'
    ),
    'ai-learning-skill': glyph(
      '<rect x="5" y="8" width="34" height="28" rx="3" stroke="var(--accent-dim)"/>' +
      '<path d="M5 16 H39" stroke="var(--accent-dim)"/>' +
      '<path d="M11 22 h5 M22 22 h5 M11 29 h5" stroke="var(--accent)"/>' +
      '<circle cx="29" cy="29" r="3" stroke="var(--accent)"/>'
    ),
    'unhooked': glyph(
      '<rect x="13" y="4" width="18" height="30" rx="3" stroke="var(--accent-dim)"/>' +
      '<path d="M19 9 h6" stroke="var(--accent-dim)"/>' +
      '<path d="M22 16 v9 M18.5 21.5 L22 25 L25.5 21.5" stroke="var(--accent)"/>' +
      '<path d="M15 40 c0-3 3-5 7-5 s7 2 7 5" stroke="var(--accent)"/>'
    )
  };

  /* ---------- the high-level method diagram ---------- */

  var METHOD = pipeline([
    { title: 'Frame',      sub: ['the decision,', 'not the feature'] },
    { title: 'Build',      sub: ['end to end,', 'myself'] },
    { title: 'Instrument', sub: ['evals, budgets,', 'audit trail'] },
    { title: 'Amend',      sub: ['drafted by the', 'system, gated'] }
  ], {
    from: 3, to: 0,
    title: 'Every loop closes',
    sub: 'a system that cannot tell you it was wrong is a system you cannot improve'
  });

  window.DIAGRAMS = { project: D, glyph: GL, method: METHOD };
})();
