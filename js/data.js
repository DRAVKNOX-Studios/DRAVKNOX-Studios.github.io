// data.js -- all the project and FAQ data for Payne-less UI: Great Grand-daddy
// yes it's one file. yes it works. no we don't have a database yet, calm down.

const STANDBY = {
  blurb: "We're just getting started. The names are done, the products will be too. Please Stand By.",
  tags: ['COMING SOON'],
  req: [],
  install: [],
  devlog: [],
  dl: false,
  dlLabel: null,
  age: 'E'
};

const PROJECTS = {

  /* TALVREK -- tech division. software. systems. the serious one (relatively) */

  /* hydrahog: {
    name: 'HYDRAHOG', ico: '🐗', brand: 'dk',
    // TODO: exists. is real. will be here. eventually. probably.
  }, */

  /* virtual_giftwrap: {
    name: 'VIRTUAL GIFTWRAP', ico: '🎁', brand: 'dk',
    // TODO: yes it's a gift wrapper. no it's not stupid. yes it will ship.
  }, */

  talvrek_placeholder: {
    name: 'TALVREK', ico: '⚡', brand: 'dk',
    ...STANDBY
  },

  /* EMBRVAAL GAMES -- games division. godot. blender. creative chaos. */

  /* voidrunner: {
    name: 'VOID RUNNER', ico: '🚀', brand: 'vl',
    // TODO: fill in when the game isn't held together with duct tape and prayers
  }, */

  /* neonblades: {
    name: 'NEON BLADES', ico: '⚔️', brand: 'vl',
    // TODO: yes. it exists. stop asking.
  }, */

  /* EMBRVAAL 3D ART -- renders. blender. things that make people say "wait how" */

  /* renders: {
    name: 'RENDERS', ico: '🖼️', brand: 'vl',
    // TODO: fill in when the renders are done cooking. blender's slow. you know this.
  }, */

  embrvaal_art_placeholder: {
    name: 'EMBRVAAL 3D ART', ico: '🎨', brand: 'vl',
    ...STANDBY
  },

  /* EMBRVAAL CONTENT -- devlogs, videos, the "oh so you make YouTube content now" era */

  /* devlogs: {
    name: 'DEVLOGS', ico: '▶️', brand: 'vl',
    // TODO: link YouTube channel when it actually exists and has more than 2 subscribers
  }, */

  embrvaal_content_placeholder: {
    name: 'EMBRVAAL CONTENT', ico: '🎬', brand: 'vl',
    ...STANDBY
  },

  floppy_bird: {
    name: 'FLOPPY BIRD',
    ico: '🐦',
    brand: 'vl',
    blurb: 'A cursed little flight toward impossible food. Find it. Play it.',
    tags: ['EMBRVAAL', 'MICRO GAME', 'FIND & PLAY'],
    req: [],
    install: [],
    devlog: [],
    dl: false,
    dlLabel: null,
    age: 'E',
    teaserOnly: true
  },

  /* VELTRUN MUSIC -- the music division. rock. nu metal. synthwave. too loud. perfect. */

  /* remix_vol1: {
    name: 'REMIX VOL.1', ico: '🎧', brand: 'em',
    // TODO: fill in when it drops. it will drop. the neighbours will know.
  }, */

  veltrun_music_placeholder: {
    name: 'VELTRUN MUSIC', ico: '🎧', brand: 'em',
    ...STANDBY
  },

  /* VELTRUN LIVE -- live sets. one person. too many synthesizers. */

  /* liveset01: {
    name: 'LIVE SET 01', ico: '🎙️', brand: 'em',
    // TODO: it's not ready. neither are we. stand by.
  }, */

  veltrun_live_placeholder: {
    name: 'VELTRUN LIVE', ico: '🎹', brand: 'em',
    ...STANDBY
  },

  /* EMBRVAAL CONFIDENTIAL FOLDER -- lore files, design docs, and general paranoia */

  /* confidential: {
    name: 'CONFIDENTIAL', ico: '🗂️', brand: 'vl',
    type: 'folder',
    files: [
      // vr-worldbible, nb-design-doc, hz-metrics, deepnet-lore, project-null
      // TODO: fill in when the lore is cooked. it's getting there. the folder name is not a bit.
    ]
  }, */

  confidential: {
    name: 'CONFIDENTIAL', ico: '🗂️', brand: 'vl',
    type: 'folder',
    ...STANDBY,
    files: []
  }

};

/* FAQ Knowledge Base -- every question a stranger could possibly ask, pre-answered.
   if something's missing, it's probably in the fallbacks. which is fine. */
const FAQ_KB = [
  {
    keys: ['who','make','build','create','founder','person','behind','one','solo','team','run','made','dakiee'],
    answer: "One person: Dakiee. Founder and lead developer behind all three divisions. Code, 3D art, and music remixing since 2020. Dravknox Studios is what happened when keeping them separate stopped making sense."
  },
  {
    keys: ['free','cost','price','pay','money','paid','purchase','buy','charge'],
    answer: "We're just getting started. Products are on the way. The mission is FOSS-first and consumer-friendly. No subscriptions, no bait-and-switch. Please stand by."
  },
  {
    keys: ['license','use','audio','commercial','project','track','pack','sfx','sound','music','allowed'],
    answer: "Music from Veltrun is remixed from CC0 sources. Licensing details will be posted clearly when releases drop. Stand by."
  },
  {
    keys: ['commission','hire','contract','freelance','work','available','collab','collaborate','custom'],
    answer: "Not taking commissions right now; still setting up. Reach out via the Contact window and we'll keep it on file."
  },
  {
    keys: ['engine','godot','unity','unreal','game','framework','tools','built','made with'],
    answer: "Godot for games. Blender for 3D art. Python for apps and tools. The rule: use what fits the project, not what's trendy."
  },
  {
    keys: ['bug','crash','issue','broken','error','report','problem','fix','wrong','not working','glitch'],
    answer: "Nothing is publicly released yet, so if something's broken, it's probably the website itself. Ping us via the Contact window."
  },
  {
    keys: ['newsletter','mailing','subscribe','email updates','notify','follow','updates'],
    answer: "No newsletter yet. Socials and channels are being set up. Please stand by. It won't be long."
  },
  {
    keys: ['why','website','design','portfolio','weird','unusual','desktop','os','windows style','payne-less','payneless','ui','great grand-daddy','grand daddy'],
    answer: "Because a scrolling landing page with pastel gradients is boring and life is short. An OS-style UI is more fun to build and more fun to use. Also it matches the vibe. The OS site is called Payne-less UI: Great Grand-daddy, which is the Talvrek division UI branding for the current version of the website."
  },
  {
    keys: ['embrvaal','games','gaming','art','3d','content','division','creative'],
    answer: "Embrvaal is the creative division: story-driven, stylized-realistic 3D action-adventure games in Godot, Blender renders, and visual content. Art that evokes WTF is that? Products coming. Stand by."
  },
  {
    keys: ['talvrek','software','apps','tools','code','dev','program','foss'],
    answer: "Talvrek is the software division. FOSS-first apps and Python tools for everyday people and indie devs. Anti-bloat, anti-subscription, anti-Adobe. Systems that outlast empires. Products coming. Stand by."
  },
  {
    keys: ['veltrun','music','rock','metal','synthwave','remix','audio','sound'],
    answer: "Veltrun is the music division. Rock, Nu Metal, and Synthwave, remixed from CC0 sources and tuned for Embrvaal's games. On YouTube. Louder than it needs to be. Exactly as intended."
  },
  {
    keys: ['contact','reach','email','discord','message','social','connect','find'],
    answer: "Socials and contact channels are being set up as part of the rebrand. Please stand by. The Contact window has the latest available channels."
  },
  {
    keys: ['blender','3d','model','asset','render','modelling'],
    answer: "All 3D work is done in Blender. Renders and asset packs are coming under Embrvaal. Stand by."
  },
  {
    keys: ['download','install','setup','run','get','link','where','how to'],
    answer: "Nothing is available for download yet. Products are in development. We're just getting started. Please stand by."
  },
  {
    keys: ['open source','source','github','repo','code','public','contribute','foss'],
    answer: "FOSS is a core commitment for Talvrek. Most apps and tools will be open source. Repos will be linked when projects are ready. Stand by."
  },
  {
    keys: ['rebrand','new','rename','fresh','start','launch','beginning'],
    answer: "Yep, full rebrand in progress. New accounts, new releases, everything under the Dravknox Studios umbrella. The names are done. The products will be too. Please stand by."
  },
  {
    keys: ['philippe','tremblay','ubisoft','subscription','own','games','enshittification'],
    answer: "You caught the reference. That's exactly what we're building against. You'll own everything. No subscriptions. No Philippe Tremblay."
  },
  {
    keys: ['switch','pro site','professional','normal site','switch site','other site','plain site','classic','change site','os site','cyberpunk','enter','boot','version'],
    answer: "There are two versions of the site. The professional site is the clean one with the nice fonts. The OS site is Payne-less UI: Great Grand-daddy, the cyberpunk desktop experience. You can switch between them using the button in the footer of the pro site, or the DRAVKNOX card on the OS boot screen."
  },
  {
    keys: ['floppy','bird','404','ragebait','hidden game','find it play it'],
    answer: "Floppy Bird is live under Embrvaal. It is intentionally discoverable. Find it. Play it."
  },
  {
    keys: ['hello','hi','hey','yo','sup','howdy','greetings','hiya'],
    answer: "Hey. SIGIL online. The studio is just getting started. Ask me anything about the divisions, the mission, or what's coming."
  },
  {
    keys: ['thank','thanks','cheers','appreciate','helpful','great','nice','cool','awesome','perfect'],
    answer: "Noted. Anything else? I know everything about this studio, which is easy since it's one person and I'm embedded in their website."
  },
  {
    keys: ['bye','goodbye','cya','later','exit','quit','done','finish','close'],
    answer: "Closing channel. Come back when the products drop. The OS will still be here."
  },
  {
    keys: ['how many','count','number','total','list all','projects','games','apps'],
    answer: "Still building. The names are done, the products will be too. Check back soon."
  },
  {
    keys: ['consumer','people','for us','mission','purpose','philosophy'],
    answer: "Built by consumers, for consumers. Stays true unlike Democracy. Software and games optimized for average hardware, no strings attached. That's the whole point."
  }
];

const FAQ_FALLBACKS = [
  "Not sure I caught that. Try asking about the studio, the divisions, or what's coming.",
  "Nothing solid on that one. Ask me about Talvrek, Embrvaal, Veltrun, or the mission.",
  "That one's outside what I know right now. Try asking about the rebrand, the philosophy, or how to get in touch.",
  "Hmm, can't help with that specifically. The studio covers apps, games, 3D art, and music. Ask me anything in those areas."
];

const FAQ_SUGGESTIONS = [
  "who makes this?",
  "what is Talvrek?",
  "what is Embrvaal?",
  "what is Veltrun?",
  "why this design?",
  "what's the mission?",
  "open source?",
  "how to contact?"
];

const NEWS_DATA = [
  { brand: 'all', date: '2026.05.01', title: 'Dravknox Studios: rebrand underway', body: "New accounts, new releases, everything under one roof. The names are done. The products will be too. Please stand by." },
];

const NEWS_BRAND_LABEL = {
  dk:  'Talvrek',
  vl:  'Embrvaal',
  em:  'Veltrun',
  all: 'All Divisions'
};
