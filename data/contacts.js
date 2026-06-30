/* ============================================================
   contacts.js — Social / contact platforms.
   Sets window.DK_CONTACTS — no fetch, works on file:// and GitHub Pages.

   Each entry:
     platform : display name AND Simple Icons slug lookup key
                (lowercase, exact match to simpleicons.org slug where possible)
                e.g. "github", "twitter", "instagram", "youtube",
                     "discord", "linkedin", "spotify", "twitch",
                     "bluesky", "mastodon", "itch.io", "steam",
                     "soundcloud", "bandcamp", "reddit", "tiktok"
     username : shown in the list item
     href     : full URL — set to null to show as display-only (no link)
   ============================================================ */
window.DK_CONTACTS = [
  {
    platform: "github",
    username: "@DRAVKNOX-Studios",
    href:     "https://github.com/DRAVKNOX-Studios"
  },
/*  {
    platform: "discord",
    username: "yourusername",
    href:     "https://discord.gg/yourinvite"
  }, */
 {
    platform: "youtube",
    username: "@dravknox",
    href:     "https://youtube.com/@dravknox"
  },
  {
    platform: "instagram",
    username: "dravknox",
    href:     "https://instagram.com/dravknox"
  },
  {
    platform: "bluesky",
    username: "DRAVKNOX",
    href:     "https://bsky.app/profile/dravknox.bsky.social"
  }
/*  {
    platform: "spotify",
    username: "Veltrun",
    href:     null
  } */
];
