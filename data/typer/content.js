// Payne-less: Typer — site content
// All the words live here. Change your mind about a sentence? This is the only
// file you need to touch.

const TYPER_CONTENT = {

  quotes: [
    "I am a keyboard. I type characters. I consume almost no resources and respect your privacy.",
    "If you want Gboard with every cloud and AI feature known to mankind, I'm not it."
  ],

  features: [
    {
      title: "Smart Typing",
      body: "Suggestions show up as you go, and it'll guess your next word before you've even tapped a key. It quietly learns how you write, so it just keeps getting better."
    },
    {
      title: "Auto-Correct",
      body: "Catches your typos and fat-finger taps without turning every message into a guessing game."
    },
    {
      title: "Contraction Expansion",
      body: "Type im, get I'm. Type dont, get don't. It even sorts out the capital letters so you never start a sentence with a lowercase i."
    },
    {
      title: "Long-Press Alternates",
      body: "Hold a key and every accent and symbol it hides shows up in a popup. No need to dig through a whole separate layout."
    },
    {
      title: "Undo, Properly",
      body: "There's an actual undo button sitting in the suggestion bar. It's just Ctrl+Z under the hood, so it works wherever that works."
    },
    {
      title: "Key Previews & Haptics",
      body: "Every tap pops up a little magnified bubble so you know what you just hit, plus a buzz with its own strength per key. Switch it off if you'd rather type in peace."
    },
    {
      title: "Emoji Central",
      body: "The full emoji lineup, skin tones included, with your favorites remembered. Type the name and it'll suggest the emoji before you even open the panel."
    },
    {
      title: "Clipboard Memory",
      body: "Hangs onto your last 20 copies, images and all. Pin the ones you use constantly so they never get bumped off."
    },
    {
      title: "Your Own Dictionary",
      body: "Teach it the slang, names, and jargon your phone refuses to recognize."
    },
    {
      title: "Takes Rejections Seriously",
      body: "Backspace right after a correction and it undoes itself. Reject the same word three times and it stops trying altogether."
    },
    {
      title: "Themes & Accents",
      body: "Light, Dark, Forest, Ocean, Dusk, or full blackout AMOLED, paired with a dozen accent colors and a font size slider."
    },
    {
      title: "Privacy, Actually",
      body: "No internet permission at all, not even a little. No analytics, no accounts, no cloud anything. Password and email fields are automatically left out of the learning."
    }
  ],

  stats: [
    { value: "19–25", unit: "MB", label: "RAM, sitting idle" },
    { value: "~40", unit: "MB", label: "RAM, while you type" },
    { value: "4", unit: "MB", label: "Total app size" },
    { value: "5", unit: "MB", label: "Dictionary file" }
  ],

  requirements: {
    min: [
      ["Android version", "8.0 Oreo (API 26)"],
      ["Google services", "Not needed"],
      ["Internet connection", "Not needed"],
      ["RAM", "1.0 GB"],
      ["Disk space", "50 MB"],
      ["Custom ROMs", "GrapheneOS, LineageOS, AOSP, most others too"]
    ],
    max: [
      ["Android version", "16, Baklava (API 36)"]
    ]
  },

  forYou: [
    "Your RAM and battery deserve better than getting eaten alive.",
    "You'd rather your typing never touched anyone's cloud.",
    "You're running a de-Googled phone, custom ROM, or anything privacy-leaning.",
    "You want real auto-correct without an internet connection doing the thinking.",
    "You like software that does one job and actually does it well."
  ],

  notForYou: [
    "You're after cloud suggestions and AI baked into your keyboard.",
    "You want GIF search, stickers, chatbots, translation, the works.",
    "You need gesture typing to swipe your way through messages.",
    "You expect a feature-for-feature Gboard or SwiftKey clone.",
    "You need a dozen languages supported right this second.",
    "You want five hundred toggles for every tiny thing."
  ],

  screenshots: [
    { file: "Setup.png", label: "Setup Wizard" },
    { file: "Typing.png", label: "Typing & Predictions" },
    { file: "Numbers.png", label: "Numbers & Symbols" },
    { file: "Customize.jpg", label: "Customization" },
    { file: "Emoji.png", label: "Emoji Panel" },
    { file: "Clipboard.png", label: "Clipboard Manager" }
  ],

  downloads: [
    {
      name: "Direct APK",
      desc: "Skip the page, grab the file. Latest build, straight off the release.",
      url: "https://github.com/DRAVKNOX-Studios/payne-less-typer/releases/latest/download/payne-less-typer.apk",
      icon: "android",
      primary: true
    },
    {
      name: "GitHub Releases",
      desc: "Every version ever shipped, with changelogs and the occasional honest bug list.",
      url: "https://github.com/DRAVKNOX-Studios/Payne-less-Typer/releases",
      icon: "github",
      primary: false
    },
    {
      name: "Build it yourself",
      desc: "Clone it, crack open Android Studio, hit run. Needs Android 8.0 or up.",
      url: "https://github.com/DRAVKNOX-Studios/Payne-less-Typer",
      icon: "code",
      primary: false
    }
  ],

  codeLinks: [
    {
      name: "Source on GitHub",
      desc: "Pure Java, no XML layouts anywhere, keys drawn straight onto a canvas.",
      url: "https://github.com/DRAVKNOX-Studios/Payne-less-Typer"
    },
    {
      name: "Code Documentation",
      desc: "The why behind the mmap dictionary, the bigram engine, all of it.",
      url: "https://github.com/DRAVKNOX-Studios/Payne-less-Typer/blob/main/CODE_DOCS.md"
    },
    {
      name: "Contributing Guide",
      desc: "Read this first if you're opening a PR. Templates exist for a reason.",
      url: "https://github.com/DRAVKNOX-Studios/Payne-less-Typer/blob/main/CONTRIBUTING.md"
    }
  ],

  underTheHood: [
    "The dictionary is memory-mapped, so looking words up is basically instant without loading the whole thing into RAM.",
    "Every screen is built in code, skipping the Android LayoutInflator entirely.",
    "Clipboard history lives in a local Room database, so it survives even if the keyboard process gets killed.",
    "Keys and popups are drawn straight onto a Canvas, which is why everything feels snappy.",
    "A personal bigram model learns how you write and quietly gets better the more you use it."
  ]

};
