# Portfolio site

Static site. No build step, no dependencies, no framework. Five files.

| File | What it is |
|---|---|
| `index.html` | Page shell — title, meta tags, nav |
| `portfolio.js` | **All content.** Edit this to change words and what shows |
| `diagrams.js` | The SVG architecture diagrams |
| `styles.css` | Design system |
| `app.js` | Renders the page and runs the Customize panel |

## Preview it locally

```bash
python3 -m http.server 4173 --directory portfolio
```

Then open <http://localhost:4173>. (Opening `index.html` by double-click also works.)

## Pick what to display

Add `?edit=1` to the URL:

```
http://localhost:4173/?edit=1
```

A **⚙ Customize** button appears bottom-right. It opens a checkbox panel covering every section, every project, every block inside a project (diagram, problem, what I built, decisions, metrics, stack), every stat, every job, and every contact row. Unchecking hides it immediately.

Two things to know:

- Those choices live in **your browser only**. Visitors still see everything.
- To make them permanent, hit **Copy config** and paste the clipboard over the entire contents of `portfolio.js`. That bakes your choices into the file that ships.

Without `?edit=1` there is no Customize button, so visitors never see it.

## Publish it free on GitHub Pages

```bash
cd portfolio
git init && git add -A && git commit -m "Portfolio site"
gh repo create KIBA0993.github.io --public --source=. --push
```

Then in the repo: **Settings → Pages → Source: `main` / root**. Live at `https://kiba0993.github.io` in about a minute.

Using `KIBA0993.github.io` as the repo name gets you the clean root URL. Any other repo name works too — it just lands at `kiba0993.github.io/<repo-name>` instead.

## Before you send the link to anyone

- [ ] **Add outcome metrics to the experience section.** Every role in `portfolio.js` has an empty `bullets: []`. One line each, with a number you can defend in an interview. This is the single highest-value edit on the page — right now the section lists titles and dates and proves nothing. Your own `profile/resume_routing.md` truthfulness gate applies: no invented metrics.
- [ ] Re-read the three project write-ups. They were drafted from your READMEs and source — correct anything that overstates.
- [ ] Decide on **Unhooked**. It is the strongest pure-PM artifact of the three (real PRD, economy design, payments hardening) but the weakest AI signal, and the repo began as a Figma export. The `notes` line says so. Keep it for PM roles; consider unchecking it for AI-engineering roles.
- [ ] Check the tagline. "I build AI products, not just roadmaps for them" is a deliberate swing — it is a claim a hiring manager will test.

## Tailoring per application

The Customize panel makes this cheap. Two useful presets:

- **Fintech / risk PM roles** — everything on. The scanner is the lead.
- **AI platform roles** — uncheck Unhooked, uncheck the Insurance-heavy older roles in Experience, keep the method diagram.

Save a preset by copying the config into a second file (`portfolio.fintech.js`) and swapping the `<script src>` in `index.html`.
