/* ============================================================
   studio.js — Studio metadata.
   Sets window.DK_DATA — no fetch, works on file:// and GitHub Pages.
   ============================================================ */
window.DK_DATA = {
  studio: {
    name:    "Dravknox",
    suffix:  "Studios",
    tagline: "Software · Games · Music",
    sub:     "You'll Own it and be Happier!",
    founded: 2026,

    about: [
      "An independent studio building software tools, games, and music - all under one roof.",
      "Every project ships with full ownership, no subscriptions, no lock-in."
    ],

    mission: "Build things people own, love, and keep."
  },

  founder: {
    name:   "Mr. Daks",
    role:   "Founder & Solo Developer",
    avatar: "assets/images/Mr. Daks.png",           /* path to image, e.g. "assets/images/founder.jpg" */
    bio:    "Slapping a personality 'cz corpo shit bore me",
   /* location: "Your City, Country", */
    status:   "Leave me alone!"   /* short availability/status line */
  },

  divisions: [
    {
      id:    "talvrek",
      name:  "Talvrek",
      label: "Software",
      sub:   "Tools & Systems",
      logo:  "assets/images/talvrek-logo.png",
      href:  "talvrek/index.html"
    },
    {
      id:    "embrvaal",
      name:  "Embrvaal",
      label: "Games",
      sub:   "Worlds & Experiences",
      logo:  "assets/images/embrvaal-logo.png",
      href:  "embrvaal/index.html"
    },
    {
      id:    "veltrun",
      name:  "Veltrun",
      label: "Music",
      sub:   "Sound & Emotion",
      logo:  "assets/images/veltrun-logo.png",
      href:  "veltrun/index.html"
    },
    {
      id:    "vault",
      name:  "The Vault",
      label: "Lore",
      sub:   "Secrets & Experiments",
      href:  "vault/index.html"
    }
  ]
};
