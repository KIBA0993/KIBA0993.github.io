/* ============================================================
   Renderer + visual toggle panel.

   The site draws itself from window.PORTFOLIO (portfolio.js).
   Add ?edit=1 to the URL to get a checkbox panel for showing and
   hiding anything on the page. Choices persist in this browser;
   "Copy config" gives you a new portfolio.js to make them permanent.
   ============================================================ */

(function () {
  'use strict';

  var LS_OVERRIDES = 'sc-portfolio-overrides';
  var LS_THEME = 'sc-portfolio-theme';
  var EDIT = new URLSearchParams(location.search).has('edit');

  /* ---------- helpers ---------- */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Escape, then turn `backticked` spans into <code>. */
  function rich(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function loadOverrides() {
    try { return JSON.parse(localStorage.getItem(LS_OVERRIDES)) || {}; }
    catch (e) { return {}; }
  }

  function saveOverrides(o) {
    try { localStorage.setItem(LS_OVERRIDES, JSON.stringify(o)); } catch (e) {}
  }

  var overrides = loadOverrides();

  /* Resolve a dotted path against the config object.
     projects/approach/experience arrays are addressed by id or index. */
  function resolve(cfg, path) {
    var parts = path.split('.');
    var node = cfg;
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return null;
      var key = parts[i];
      if (Array.isArray(node)) {
        var idx = node.findIndex(function (x) { return x && x.id === key; });
        node = idx >= 0 ? node[idx] : node[Number(key)];
      } else {
        node = node[key];
      }
    }
    return node;
  }

  /* Build the live config: base content with saved toggles applied. */
  function buildConfig() {
    var cfg = clone(window.PORTFOLIO);
    Object.keys(overrides).forEach(function (path) {
      var parts = path.split('.');
      var leaf = parts.pop();
      var parent = parts.length ? resolve(cfg, parts.join('.')) : cfg;
      if (parent && typeof parent === 'object') parent[leaf] = overrides[path];
    });
    return cfg;
  }

  function on(v) { return v !== false; }
  function live(arr) { return (arr || []).filter(function (x) { return on(x.enabled); }); }

  /* ---------- section renderers ---------- */

  function renderHero(c) {
    var p = c.profile;
    var tag = esc(p.tagline).replace(/^(I build AI products)/, '<em>$1</em>');
    return '' +
      '<div class="wrap hero" id="top">' +
        '<div class="hero-kicker">' + esc(p.location) + '</div>' +
        '<h1>' + tag + '</h1>' +
        '<p class="hero-role">' + esc(p.title) + '</p>' +
        '<p class="hero-sub">' + esc(p.kicker) + '</p>' +
        '<p class="hero-lede">' + esc(p.lede) + '</p>' +
        '<div class="cta-row">' +
          '<a class="btn btn-primary" href="#work">See the work &rarr;</a>' +
          '<a class="btn" href="' + esc(p.github) + '" target="_blank" rel="noopener">GitHub</a>' +
          '<a class="btn" href="' + esc(p.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>' +
          '<a class="btn" href="mailto:' + esc(p.email) + '">Email</a>' +
        '</div>' +
        (p.availability ? '<div class="avail"><span class="dot"></span>' + esc(p.availability) + '</div>' : '') +
      '</div>';
  }

  function renderStats(c) {
    var items = live(c.stats);
    if (!items.length) return '';
    return '<div class="wrap"><div class="stats">' + items.map(function (s) {
      return '<div class="stat"><div class="stat-v">' + esc(s.value) + '</div>' +
             '<div class="stat-l">' + esc(s.label) + '</div></div>';
    }).join('') + '</div></div>';
  }

  function renderProject(pr, i) {
    var show = pr.show || {};
    var metrics = live(pr.metrics);
    var h = '<article class="project" id="' + esc(pr.id) + '">';

    h += '<div class="p-head">';
    h += '<div class="p-num">' + String(i + 1).padStart(2, '0') + '</div>';
    h += '<div class="p-title-col">';
    h += '<h3 class="p-title">' + esc(pr.title) + '</h3>';
    h += '<p class="p-sub">' + esc(pr.subtitle) + '</p>';
    h += '<div class="p-meta">';
    if (pr.status) h += '<span class="chip">' + esc(pr.status) + '</span>';
    if (pr.period) h += '<span>' + esc(pr.period) + '</span>';
    if (pr.role) h += '<span>' + esc(pr.role) + '</span>';
    if (pr.repo) h += '<a href="' + esc(pr.repo) + '" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none">Source &nearr;</a>';
    h += '</div></div></div>';

    if (pr.lede) h += '<p class="p-lede">' + rich(pr.lede) + '</p>';

    var dia = (window.DIAGRAMS && window.DIAGRAMS.project[pr.id]) || null;
    if (on(show.diagram) && dia) {
      h += '<figure class="p-diagram"><div class="diagram-scroll">' + dia.svg + '</div>' +
           '<figcaption>' + esc(dia.caption) + '</figcaption></figure>';
    }

    var blocks = [];

    if (on(show.problem) && pr.problem) {
      blocks.push('<div class="block"><div class="block-h">The problem</div><p>' + rich(pr.problem) + '</p></div>');
    }
    if (on(show.build) && pr.build && pr.build.length) {
      blocks.push('<div class="block"><div class="block-h">What I built</div><ol class="build-list">' +
        pr.build.map(function (b) { return '<li>' + rich(b) + '</li>'; }).join('') + '</ol></div>');
    }
    if (on(show.decisions) && pr.decisions && pr.decisions.length) {
      blocks.push('<div class="block" style="grid-column:1/-1"><div class="block-h">Decisions worth defending</div>' +
        pr.decisions.map(function (d) {
          return '<div class="dec"><div class="dec-k">' + rich(d.k) + '</div><div class="dec-v">' + rich(d.v) + '</div></div>';
        }).join('') + '</div>');
    }

    if (blocks.length) h += '<div class="p-body">' + blocks.join('') + '</div>';

    if ((on(show.metrics) && metrics.length) || (on(show.stack) && pr.stack)) {
      h += '<div class="p-foot">';
      if (on(show.metrics) && metrics.length) {
        h += '<div class="metric-row">' + metrics.map(function (m) {
          return '<div><div class="metric-k">' + esc(m.k) + '</div><div class="metric-v">' + esc(m.v) + '</div></div>';
        }).join('') + '</div>';
      }
      if (pr.repo) h += '<a class="btn" href="' + esc(pr.repo) + '" target="_blank" rel="noopener">Read the code &rarr;</a>';
      h += '</div>';
    }

    if (on(show.stack) && pr.stack && pr.stack.length) {
      h += '<div class="tags">' + pr.stack.map(function (t) {
        return '<span class="tag">' + esc(t) + '</span>';
      }).join('') + '</div>';
    }

    if (pr.notes) h += '<p class="p-note">' + rich(pr.notes) + '</p>';

    return h + '</article>';
  }

  function renderOverview(c) {
    var o = c.overview || {};
    var items = live(c.projects);
    if (!items.length) return '';
    return '<section class="band" id="overview"><div class="wrap">' +
      '<div class="section-head"><span class="eyebrow">At a glance</span><h2>' + esc(o.title) + '</h2></div>' +
      (o.lede ? '<p class="section-lede">' + esc(o.lede) + '</p>' : '') +
      '<div class="ov-grid">' + items.map(function (p) {
        var g = (window.DIAGRAMS && window.DIAGRAMS.glyph[p.id]) || '';
        return '<a class="ov-card" href="#' + esc(p.id) + '">' +
          '<div class="ov-glyph">' + g + '</div>' +
          '<div class="ov-title">' + esc(p.title) + '</div>' +
          '<div class="ov-sub">' + esc(p.subtitle) + '</div>' +
          (p.proves ? '<div class="ov-proves"><span>Proves</span>' + esc(p.proves) + '</div>' : '') +
          '<div class="ov-more">Read the case study &rarr;</div>' +
          '</a>';
      }).join('') + '</div></div></section>';
  }

  function renderProjects(c) {
    var items = live(c.projects);
    if (!items.length) return '';
    return '<section class="band" id="work"><div class="wrap">' +
      '<div class="section-head"><span class="eyebrow">01 / Work</span>' +
      '<h2>Things I built and still run</h2></div>' +
      items.map(renderProject).join('') +
      '</div></section>';
  }

  function renderApproach(c) {
    var a = c.approach || {};
    var items = live(a.items);
    if (!items.length) return '';
    return '<section class="band" id="approach"><div class="wrap">' +
      '<div class="section-head"><span class="eyebrow">02 / Approach</span><h2>' + esc(a.title) + '</h2></div>' +
      (a.lede ? '<p class="section-lede">' + esc(a.lede) + '</p>' : '') +
      (on(a.showDiagram) && window.DIAGRAMS
        ? '<figure class="p-diagram method"><div class="diagram-scroll">' + window.DIAGRAMS.method + '</div></figure>'
        : '') +
      '<div class="approach-grid">' + items.map(function (it, i) {
        return '<div class="approach-cell"><span class="num">' + String(i + 1).padStart(2, '0') + '</span>' +
               '<h3>' + rich(it.k) + '</h3><p>' + rich(it.v) + '</p></div>';
      }).join('') + '</div></div></section>';
  }

  function renderExperience(c) {
    var x = c.experience || {};
    var roles = live(x.items);
    var edu = live(x.education);
    if (!roles.length && !edu.length) return '';
    var h = '<section class="band" id="experience"><div class="wrap">' +
      '<div class="section-head"><span class="eyebrow">03 / Track record</span><h2>' + esc(x.title) + '</h2></div>';

    h += roles.map(function (r) {
      return '<div class="xp"><div class="xp-when">' + esc(r.period) + '</div><div>' +
        '<div class="xp-title">' + esc(r.title) + '</div>' +
        '<div class="xp-co"><b>' + esc(r.company) + '</b> · ' + esc(r.location) + '</div>' +
        (r.bullets && r.bullets.length
          ? '<ul>' + r.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>'
          : '') +
        '</div></div>';
    }).join('');

    if (edu.length) {
      h += '<div class="edu-grid">' + edu.map(function (e) {
        return '<div class="edu"><div class="edu-s">' + esc(e.school) + '</div>' +
               '<div class="edu-d">' + esc(e.degree) + '</div>' +
               '<div class="edu-y">' + esc(e.year) + '</div></div>';
      }).join('') + '</div>';
    }
    return h + '</div></section>';
  }

  function renderSkills(c) {
    var s = c.skills || {};
    var groups = live(s.groups);
    if (!groups.length) return '';
    return '<section class="band"><div class="wrap">' +
      '<div class="section-head"><span class="eyebrow">04 / Tooling</span><h2>' + esc(s.title) + '</h2></div>' +
      '<div class="skill-grid">' + groups.map(function (g) {
        return '<div><div class="skill-label">' + esc(g.label) + '</div><div class="skill-items">' +
          g.items.map(function (i) { return '<span>' + esc(i) + '</span>'; }).join('') + '</div></div>';
      }).join('') + '</div></div></section>';
  }

  function renderContact(c) {
    var k = c.contact || {}, p = c.profile;
    var rows = [];
    if (on(k.showEmail)) rows.push(['Email', p.email, 'mailto:' + p.email]);
    if (on(k.showLinkedin)) rows.push(['LinkedIn', 'linkedin.com/in/schen93', p.linkedin]);
    if (on(k.showGithub)) rows.push(['GitHub', 'github.com/KIBA0993', p.github]);
    if (on(k.showLocation)) rows.push(['Based in', p.location, null]);

    return '<section class="band contact" id="contact"><div class="wrap">' +
      '<div class="section-head"><span class="eyebrow">05 / Contact</span></div>' +
      '<h2>' + esc(k.title) + '</h2>' +
      '<p class="contact-lede">' + esc(k.lede) + '</p>' +
      '<div class="contact-list">' + rows.map(function (r) {
        var tag = r[2] ? 'a href="' + esc(r[2]) + '"' + (r[2].indexOf('mailto') ? ' target="_blank" rel="noopener"' : '') : 'div';
        var close = r[2] ? 'a' : 'div';
        return '<' + tag + ' class="contact-row"><span class="k">' + esc(r[0]) + '</span>' +
               '<span class="v">' + esc(r[1]) + '</span>' +
               (r[2] ? '<span class="arw">&nearr;</span>' : '') + '</' + close + '>';
      }).join('') + '</div></div></section>';
  }

  /* ---------- page ---------- */

  function render() {
    var c = buildConfig();
    var s = c.sections || {};
    var out = '';
    if (on(s.hero && s.hero.enabled)) out += renderHero(c);
    if (on(s.stats && s.stats.enabled)) out += renderStats(c);
    if (on(s.overview && s.overview.enabled)) out += renderOverview(c);
    if (on(s.projects && s.projects.enabled)) out += renderProjects(c);
    if (on(s.approach && s.approach.enabled)) out += renderApproach(c);
    if (on(s.experience && s.experience.enabled)) out += renderExperience(c);
    if (on(s.skills && s.skills.enabled)) out += renderSkills(c);
    if (on(s.contact && s.contact.enabled)) out += renderContact(c);

    out += '<div class="wrap"><footer>' +
      '<span>&copy; ' + new Date().getFullYear() + ' ' + esc(c.profile.name) + '</span>' +
      '<span>Built from scratch — no template, no framework</span>' +
      '</footer></div>';

    document.getElementById('app').innerHTML = out;
    if (EDIT) syncPanel();
  }

  /* ---------- edit panel ---------- */

  function setOverride(path, val) {
    overrides[path] = val;
    saveOverrides(overrides);
    render();
  }

  function currentValue(path) {
    if (path in overrides) return overrides[path];
    var v = resolve(clone(window.PORTFOLIO), path);
    return v !== false;
  }

  function row(path, label, strong) {
    return '<label class="ep-item' + (strong ? ' strong' : '') + '">' +
      '<input type="checkbox" data-path="' + esc(path) + '"' + (currentValue(path) ? ' checked' : '') + '>' +
      '<span>' + esc(label) + '</span></label>';
  }

  function buildPanel() {
    var base = window.PORTFOLIO;
    var h = '';

    h += '<div class="ep-group"><h4>Page sections</h4>';
    Object.keys(base.sections).forEach(function (k) {
      h += row('sections.' + k + '.enabled', base.sections[k].label, true);
    });
    h += '</div>';

    h += '<div class="ep-group"><h4>Stat band</h4>';
    base.stats.forEach(function (s, i) {
      h += row('stats.' + i + '.enabled', s.value + '  ·  ' + s.label);
    });
    h += '</div>';

    h += '<div class="ep-group"><h4>Projects</h4>';
    base.projects.forEach(function (p) {
      h += row('projects.' + p.id + '.enabled', p.title, true);
      h += '<div class="ep-sub">';
      [['diagram', 'Architecture diagram'], ['problem', 'The problem'], ['build', 'What I built'],
       ['decisions', 'Decisions'], ['metrics', 'Metric row'], ['stack', 'Stack tags']].forEach(function (f) {
        h += row('projects.' + p.id + '.show.' + f[0], f[1]);
      });
      (p.metrics || []).forEach(function (m, i) {
        h += row('projects.' + p.id + '.metrics.' + i + '.enabled', '· ' + m.k + ': ' + m.v);
      });
      h += '</div>';
    });
    h += '</div>';

    h += '<div class="ep-group"><h4>Approach points</h4>';
    h += row('approach.showDiagram', 'Method diagram', true);
    base.approach.items.forEach(function (it, i) { h += row('approach.items.' + i + '.enabled', it.k); });
    h += '</div>';

    h += '<div class="ep-group"><h4>Experience</h4>';
    base.experience.items.forEach(function (r, i) {
      h += row('experience.items.' + i + '.enabled', r.company + ' — ' + r.period);
    });
    base.experience.education.forEach(function (e, i) {
      h += row('experience.education.' + i + '.enabled', e.school);
    });
    h += '</div>';

    h += '<div class="ep-group"><h4>Tooling groups</h4>';
    base.skills.groups.forEach(function (g, i) { h += row('skills.groups.' + i + '.enabled', g.label); });
    h += '</div>';

    h += '<div class="ep-group"><h4>Contact rows</h4>';
    [['showEmail', 'Email'], ['showLinkedin', 'LinkedIn'], ['showGithub', 'GitHub'], ['showLocation', 'Location']]
      .forEach(function (f) { h += row('contact.' + f[0], f[1]); });
    h += '</div>';

    return h;
  }

  function syncPanel() {
    document.querySelectorAll('.edit-panel input[data-path]').forEach(function (cb) {
      cb.checked = currentValue(cb.dataset.path);
    });
    var n = document.querySelectorAll('.edit-panel input[data-path]:checked').length;
    var t = document.querySelectorAll('.edit-panel input[data-path]').length;
    var el = document.querySelector('.ep-count');
    if (el) el.textContent = n + ' of ' + t + ' items showing';
  }

  function mountEditor() {
    var fab = document.createElement('button');
    fab.className = 'edit-fab';
    fab.textContent = '⚙  Customize';

    var panel = document.createElement('aside');
    panel.className = 'edit-panel';
    panel.innerHTML =
      '<div class="ep-head"><h3>What to display</h3>' +
      '<button class="close" aria-label="Close">&times;</button></div>' +
      '<div class="ep-hint">Uncheck to hide. Changes save in this browser only — hit <b>Copy config</b> and paste over <code>portfolio.js</code> to make them permanent for visitors.</div>' +
      '<div class="ep-body">' + buildPanel() + '</div>' +
      '<div class="ep-foot">' +
      '<button class="ep-btn primary" id="ep-copy">Copy config</button>' +
      '<button class="ep-btn" id="ep-reset">Reset to file</button>' +
      '<div class="ep-count"></div>' +
      '</div>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    fab.addEventListener('click', function () { panel.classList.add('open'); });
    panel.querySelector('.close').addEventListener('click', function () { panel.classList.remove('open'); });

    panel.addEventListener('change', function (e) {
      if (e.target.matches('input[data-path]')) setOverride(e.target.dataset.path, e.target.checked);
    });

    document.getElementById('ep-reset').addEventListener('click', function () {
      overrides = {};
      saveOverrides(overrides);
      render();
    });

    document.getElementById('ep-copy').addEventListener('click', function () {
      var header = '/* ===========================================================\n' +
        '   CONTENT FILE — edit this to change the site.\n' +
        '   Or open index.html?edit=1, toggle things, hit Copy config,\n' +
        '   and paste the result over this whole file.\n' +
        '   =========================================================== */\n\n';
      var text = header + 'window.PORTFOLIO = ' + JSON.stringify(buildConfig(), null, 2) + ';\n';
      var btn = this;
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = '✓ Copied — paste into portfolio.js';
        setTimeout(function () { btn.textContent = 'Copy config'; }, 2600);
      }).catch(function () {
        var w = window.open('', '_blank');
        w.document.write('<pre>' + esc(text) + '</pre>');
      });
    });

    syncPanel();
  }

  /* ---------- theme ---------- */

  function initTheme() {
    var saved = localStorage.getItem(LS_THEME);
    if (saved) document.documentElement.dataset.theme = saved;
    document.getElementById('theme-toggle').addEventListener('click', function () {
      var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem(LS_THEME, next); } catch (e) {}
    });
  }

  /* ---------- boot ---------- */

  render();
  initTheme();
  if (EDIT) mountEditor();
})();
