/* ============================================================
   projects.js — Project catalogue for all divisions.
   Sets window.DK_PROJECTS — no fetch, works on file:// and GitHub Pages.

   Each entry:
     division  : "talvrek" | "embrvaal" | "veltrun"
     id        : unique slug
     name      : display name
     tagline   : one-liner shown under the name in the modal
     icon      : path relative to site root, or null for letter-avatar
     href      : URL the card links to — relative page or absolute URL
                 Set to null to make the card non-navigating (Phase 2 hook)
   ============================================================ */
window.DK_PROJECTS = [

  /* ── Talvrek — Software ──────────────────────────────────── */
  {
    division: "talvrek",
    id:       "typer",
    name:     "Payne-less: Typer",
    tagline:  "Types and shuts up",
    icon:     "assets/typer/typerlogo.png",
    href:     "typer.html",
    status:   "Active dev",
    languages: [
      { name: "Java",       pct: 96.9 },
      { name: "Python", pct: 3.1 }
    ],
    platforms: ["Android"]
  },

  /* ── Embrvaal — Games ────────────────────────────────────── */
  {
    division: "embrvaal",
    id:       "flop",
    name:     "Floppy Bird",
    tagline:  "An impossible Flight!",
    icon:     "assets/floppy/floppy-logo.svg",
    href:     "floppy.html",
    status:   "Released",
    languages: [
      { name: "HTML",       pct: 100 },
    ],
    platforms: ["Windows", "macOS", "Linux", "Android", "iOS"]
  },

  /* ── Veltrun — Music ─────────────────────────────────────── */
  /* ── Coming Soon ─────────────────────────────────────────── */

];
