# Dravknox Studios: Website

**Live site:** [dravknox.github.io](https://dravknox.github.io) <!-- update with your actual URL -->

The official website for Dravknox Studios, an independent creative studio spanning tech, games, 3D art, and music. One founder. Three divisions. Built to last.

---

## Overview

This repository hosts the full source for the Dravknox Studios website. There are two distinct experiences served from the same codebase:

- **Professional site** (`index-pro.html`) -- A clean, typographic landing page with light and dark mode, scroll-reveal animations, a filterable project grid, and an embedded FAQ assistant.
- **OS site** (`index.html`) -- An interactive fake desktop OS called **Payne-less UI: Great Grand-daddy**, the Talvrek division UI branding for the current version of the site. Features draggable windows, a taskbar, a boot screen, a ticker, and full keyboard and touch support.

Both sites share the same data layer (`js/data.js`) and FAQ engine (`js/faq.js`). Content lives in one place.

---

## Structure

```
/
├── index.html              # OS site entry point (Payne-less UI: Great Grand-daddy)
├── index-pro.html          # Professional site entry point
├── css/
│   ├── style.css           # OS site styles
│   └── style-pro.css       # Professional site styles
├── js/
│   ├── data.js             # All project data, FAQ knowledge base, and news entries
│   ├── faq.js              # DK_ASSIST chatbot engine (keyword matching)
│   ├── os.js               # OS site core: boot, windows, drag, taskbar, launcher
│   ├── projects.js         # Project detail windows and fake document renderers
│   └── pro.js              # Professional site controller
└── assets/
    └── logo/               # Division and studio logos
```

---

## Divisions

| Division | Focus | Tagline |
|---|---|---|
| **Talvrek** | Software, FOSS apps, Python tools | Systems that outlast empires. |
| **Embrvaal** | Games (Godot), 3D art (Blender) | Art that evokes WTF is that? |
| **Veltrun** | Rock, Nu Metal, Synthwave remixes | Louder than it needs to be. Exactly as intended. |

---

## Features

**OS site (Payne-less UI: Great Grand-daddy)**
- Boot screen with division selection
- Draggable, resizable, minimizable, and fullscreenable windows
- Taskbar with open window tracking and a start menu
- Scrolling ticker strip
- Per-division desktop themes (Talvrek, Embrvaal, Veltrun)
- Responsive: full-screen windows on mobile, snap-scroll launcher, tablet icon grid
- Motion reduction toggle for accessibility
- Keyboard navigation with focus trapping and Escape to close
- Fake document viewers: PDF, DOCX, and XLSX renderers
- Confidential folder viewer with two-pane file browser

**Professional site**
- Light and dark mode with localStorage persistence and OS preference fallback
- Scroll-reveal animations via IntersectionObserver
- Filterable project grid by division
- Project detail modal with tabbed layout
- Active nav link highlighting on scroll
- Mobile hamburger menu
- Hero card parallax on mouse move
- Embedded DK_ASSIST FAQ chatbot

**Shared**
- DK_ASSIST: keyword-matching FAQ engine with stemming, bigram support, and fuzzy fallback
- Single data source for projects, news, and FAQ knowledge base
- No build tools, no dependencies, no frameworks; plain HTML, CSS, and JavaScript

---

## Running Locally

No build step required. Open either HTML file directly in a browser, or serve the directory with any static server:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000` for the OS site or `http://localhost:8000/index-pro.html` for the professional site.

---

## Deployment

This site is deployed via GitHub Pages. To deploy your own fork:

1. Fork this repository.
2. Go to **Settings > Pages**.
3. Set the source to the `main` branch, root directory.
4. GitHub Pages will serve `index.html` as the default entry point.

The professional site is accessible at `your-username.github.io/index-pro.html`.

---

## Updating Content

All content is in `js/data.js`. No other files need to be edited for routine updates.

- **Add a project:** Add an entry to the `PROJECTS` object. Set `brand` to `dk`, `vl`, or `em` for the correct division.
- **Add a news item:** Add an entry to `NEWS_DATA`.
- **Update the FAQ:** Add or edit entries in `FAQ_KB`. Each entry has a `keys` array (words to match) and an `answer` string.
- **Update stats:** Edit the `DESK_DATA` object in `js/os.js` for the OS desktop widgets, and the stat blocks in `index-pro.html` for the professional site.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styles | CSS3, custom properties, no preprocessor |
| Scripts | Vanilla JavaScript (ES6+), no frameworks |
| Fonts | DM Serif Display, DM Sans, DM Mono (pro site) via Google Fonts |
| Fonts | Orbitron, Share Tech Mono, Rajdhani (OS site) via Google Fonts |
| Hosting | GitHub Pages |

---

## License

The code in this project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for full terms.

**What this means in plain terms:**

- You may use, copy, modify, and distribute this code for any purpose, including commercial projects.
- You do not need to credit Dravknox Studios, though a mention or link back is appreciated.
- The MIT License covers the code only. It does not grant any rights to the branding, logos, division names, or other intellectual property listed in the Branding Notice below.
- Those are reserved separately and are not part of this license.

---

## Branding Notice

The following are the intellectual property of Dravknox Studios and are not covered by the open license:

- The name **Dravknox Studios** and all associated wordmarks
- Division names: **Talvrek**, **Embrvaal**, **Veltrun**
- The **Payne-less UI** name and branding
- All logos under `assets/logo/`
- The name **Dakiee**
- All original written content, lore, and world-building material

These may not be reproduced, reused, or adapted without explicit written permission.

---

## Status

The studio is in active setup. The names are done. The products will be too.

**Please Stand By.**

---

*Dravknox Studios. Built by consumers, for consumers.*
