# Dravknox Studios - Website

**Live site:** [dravknox-studios.github.io](https://dravknox-studios.github.io)

The official website for Dravknox Studios - an independent creative studio spanning software, games, and music. One founder. Three divisions. Built to last.

***

## Design

The current iteration is codenamed **Payne-less UI: Great Granddaddy**. It is a single-page experience with a dark-first three-panel layout:

- **Left sidebar** - Studio stats panel, revealed on hover (`Stats`)
- **Center** - Hero wordmark + four division cards (Talvrek, Embrvaal, Veltrun, The Vault)
- **Right sidebar** - Studio info card, revealed on hover (`Info`)
- **Bottom controls dock** - Theme toggle, Motion toggle, SIGIL chatbot, Contact drop-up

A procedural animated canvas (`<canvas id="bg-canvas">`) renders behind all content as the ambient background. Theme defaults to dark; a light mode toggle is available in the bottom dock.

***

## Structure

```
/
├── index.html                  # Main entry point (Payne-less UI: Great Granddaddy)
├── floppy.html                 # Floppy disk interactive page
├── typer.html                  # Payne-less Typer standalone page
├── 404.html                    # Custom 404 error page
├── robots.txt
├── sitemap.xml
│
├── css/
│   ├── tokens.css              # Design tokens - type scale, spacing, color, radius
│   ├── layout.css              # Three-panel page grid
│   ├── hero.css                # Hero section (wordmark, tagline, rule dots)
│   ├── cards.css               # Division cards
│   ├── controls.css            # Bottom dock and control buttons
│   ├── background.css          # Canvas background layer styles
│   ├── theme.css               # Light/dark mode overrides
│   ├── modal-base.css          # Modal structural styles
│   ├── modal-projects.css      # Division project modal card styles
│   ├── dropup.css              # Contact drop-up list
│   ├── chatbot-panel.css       # SIGIL chatbot panel frame
│   ├── chatbot-messages.css    # SIGIL message bubbles and chips
│   ├── statscard.css           # Stats hover card
│   ├── infocard-layout.css     # Info card layout
│   ├── infocard-content.css    # Info card content styles
│   └── project-status.css      # Project status badge styles
│
├── js/
│   ├── bg-core.js              # Canvas setup, palette, animation loop
│   ├── bg-layers.js            # Four procedural background stream layers
│   ├── theme.js                # Theme toggle logic
│   ├── statscard.js            # Stats card population and hover reveal
│   ├── infocard.js             # Info card population and hover reveal
│   ├── project-status.js       # Live project status rendering
│   ├── modal-projects.js       # Builds project card HTML from data
│   ├── modal-core.js           # Modal open/close/keyboard events
│   ├── dropup-render.js        # Builds contact list HTML from data
│   ├── dropup-core.js          # Drop-up open/close/events
│   ├── chatbot.js              # SIGIL chatbot interaction logic
│   └── main.js                 # Page-level initialisation and event binding
│
├── data/
│   ├── studio.js               # Studio metadata (name, tagline, stats)
│   ├── projects.js             # All division projects data
│   ├── contacts.js             # Contact platform links
│   └── chatbot.js              # SIGIL knowledge base and response config
│
└── assets/
    ├── images/
    │   ├── talvrek-logo.png     # Talvrek division logo
    │   ├── embrvaal-logo.png    # Embrvaal division logo
    │   └── veltrun-logo.png     # Veltrun division logo
    └── favicon/
        ├── favicon.ico
        ├── favicon-32x32.png
        ├── favicon-16x16.png
        ├── apple-touch-icon.png
        └── site.webmanifest
```

***

## Divisions

| Division | Focus | Tagline |
|---|---|---|
| **Talvrek** | Software - tools and systems | Tools & Systems |
| **Embrvaal** | Games - worlds and experiences | Worlds & Experiences |
| **Veltrun** | Music - sound and emotion | Sound & Emotion |
| **The Vault** | Lore - secrets and experiments | Secrets & Experiments |

Clicking a division card opens the project modal for Talvrek, Embrvaal, and Veltrun. The Vault links to `vault/index.html`.

***

## Features

- **Procedural canvas background** - animated in real time by `bg-core.js` + `bg-layers.js`; four layered streams with a shared palette
- **Division project modal** - slides open from the right; populated from `data/projects.js` with per-project status badges
- **SIGIL chatbot** - floats above the bottom dock; knowledge base and chips defined in `data/chatbot.js`
- **Contact drop-up** - renders platform links from `data/contacts.js`
- **Stats card** - hover-revealed left sidebar card, populated from `data/studio.js` via `statscard.js`
- **Info card** - hover-revealed right sidebar card, populated via `infocard.js`
- **Theme toggle** - dark/light mode; dark is default
- **Motion toggle** - disables canvas animation and CSS transitions for accessibility (`prefers-reduced-motion` is also respected globally)
- **Keyboard navigation** - full keyboard support; modals trap focus and close on Escape
- **No build tools** - plain HTML, CSS, and vanilla JavaScript; no frameworks, no bundler, no dependencies

***

## Running Locally

No build step required. Open `index.html` directly in a browser, or serve the repo root with any static server:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Then visit `http://localhost:8000`.

***

## Updating Content

All content lives in the `data/` directory. No other files need editing for routine updates.

| File | What to edit |
|---|---|
| `data/studio.js` | Studio name, tagline, stats figures |
| `data/projects.js` | Add or update division projects |
| `data/contacts.js` | Contact platform links |
| `data/chatbot.js` | SIGIL knowledge base entries and suggested chips |

***

## Deployment

This site is deployed via GitHub Pages from the `main` branch root.

1. Fork this repository.
2. Go to **Settings → Pages**.
3. Set source to the `main` branch, root directory (`/`).
4. GitHub Pages will serve `index.html` as the default entry point.

***

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5, semantic elements |
| Styles | CSS3 - custom properties, no preprocessor, 14-file modular split |
| Scripts | Vanilla JavaScript (ES6+), no frameworks |
| Fonts | Space Grotesk, Inter, JetBrains Mono via Google Fonts |
| Background | Canvas 2D API (procedural animation) |
| Hosting | GitHub Pages |

***

## License

The code in this repository is licensed under the **MIT License**. See [LICENSE](LICENSE) for full terms.

In plain terms:
- You may use, copy, modify, and distribute the code for any purpose including commercial projects.
- Credit to Dravknox Studios is appreciated but not required.
- The MIT License covers code only - it does not grant rights to the branding, logos, division names, or any other intellectual property listed below.

***

## Branding Notice

The following are the intellectual property of Dravknox Studios and are **not** covered by the MIT License:

- The name **Dravknox Studios** and all associated wordmarks
- Division names: **Talvrek**, **Embrvaal**, **Veltrun**, **The Vault**
- The **Payne-less UI** name and branding
- All logos and artwork under `assets/`
- The name **SIGIL** as used for the studio chatbot
- All original written content, lore, and world-building material

These may not be reproduced, reused, or adapted without explicit written permission.

***

*Dravknox Studios. Building stuff with personality that lasts.*