window.DK_CHATBOT = {
  bot: {
    name: "SIGIL",
    opener: [
      "I am SIGIL. Ask me the studio things before the fog starts filing paperwork.",
      "SIGIL online. I answer Dravknox questions, mostly accurately, always with taste.",
      "Hey. I am SIGIL, the FAQ with eyeliner. What do you need?"
    ],
    fallback: [
      "That did not land cleanly in my little archive. Try one of these.",
      "I can smell a question in there, but not the exact one. Pick a nearby thread.",
      "Close, but the signal is fuzzy. These are the nearest doors."
    ],
    miss: [
      "I do not have that answer yet. Ask about the studio, divisions, ownership, contact, projects, or who built this place.",
      "That one is outside my current FAQ bones. I know Dravknox basics, division stuff, contact routes, and project ownership.",
      "No match in the sigil-stack. Try asking about Talvrek, Embrvaal, Veltrun, ownership, the founder, or contacts."
    ]
  },
  normalizer: {
    "u": "you",
    "ur": "your",
    "yr": "your",
    "r": "are",
    "tho": "though",
    "thx": "thanks",
    "pls": "please",
    "plz": "please",
    "abt": "about",
    "info": "information",
    "deets": "details",
    "wanna": "want to",
    "gonna": "going to",
    "gotta": "got to",
    "cz": "because",
    "cuz": "because",
    "bc": "because",
    "dev": "developer",
    "devs": "developers",
    "app": "software",
    "apps": "software",
    "game": "games",
    "ost": "music",
    "song": "music",
    "songs": "music",
    "paywall": "subscription",
    "subs": "subscription",
    "sub": "subscription",
    "own": "ownership",
    "buy": "ownership",
    "dm": "contact",
    "mail": "email",
    "socials": "contact",
    "links": "contact"
  },
  faq: [
    {
      id: "studio",
      questions: [
        "What is Dravknox Studios?",
        "Tell me about Dravknox",
        "What does this studio do?",
        "What is Dravknox about?",
        "Explain the whole studio"
      ],
      answers: [
        "Dravknox Studios is an independent umbrella for software, games, and music. Small, sharp, owner-first.",
        "It is one studio with three creative lanes: Talvrek for tools, Embrvaal for games, and Veltrun for sound.",
        "Dravknox builds things people can keep: useful software, playable worlds, and music with a pulse.",
        "The short version: independent software, games, and music, built without the usual subscription cage.",
        "Dravknox is the house. Talvrek codes, Embrvaal dreams in mechanics, Veltrun makes the noise beautiful."
      ]
    },
    {
      id: "talvrek",
      questions: [
        "What is Talvrek?",
        "Tell me about the software division",
        "What does Talvrek make?",
        "Do you build apps or tools?",
        "What is the code side of Dravknox?"
      ],
      answers: [
        "Talvrek is the software wing: tools, systems, utilities, and practical things with a little bite.",
        "Talvrek handles code. If it solves a problem and should not feel soulless, it probably lives there.",
        "The software division is for apps, tools, and systems built to be owned instead of rented forever.",
        "Talvrek makes the useful machinery: clean tools, focused workflows, and the occasional beautiful button.",
        "Code lives under Talvrek. It is the studio's practical brain, with fewer meetings and more shipping."
      ]
    },
    {
      id: "embrvaal",
      questions: [
        "What is Embrvaal?",
        "Tell me about the games division",
        "Does Dravknox make games?",
        "What kind of games do you build?",
        "What is the worlds and experiences side?"
      ],
      answers: [
        "Embrvaal is the games wing: worlds, systems, experiments, and playable ideas with teeth.",
        "Yes, Dravknox makes games through Embrvaal. That is where mechanics and atmosphere go to argue productively.",
        "Embrvaal is for interactive worlds and experiences, from small experiments to bigger game-shaped beasts.",
        "The games side is Embrvaal: less generic content mill, more strange worlds worth remembering.",
        "If Talvrek is the toolbench, Embrvaal is the door into playable trouble."
      ]
    },
    {
      id: "veltrun",
      questions: [
        "What is Veltrun?",
        "Tell me about the music division",
        "Does Dravknox make music?",
        "Where does sound live?",
        "What is the audio side of Dravknox?"
      ],
      answers: [
        "Veltrun is the music wing: sound, mood, tracks, and the emotional wiring under the studio.",
        "Music lives in Veltrun. It is for songs, scores, sound experiments, and whatever makes a scene breathe.",
        "Yes, Dravknox makes music through Veltrun, because silence is useful only until the drop arrives.",
        "Veltrun handles audio: atmosphere, sound, and music with a darker electric edge.",
        "The audio side is Veltrun. It turns feeling into waveform and then pretends that was the plan."
      ]
    },
    {
      id: "ownership",
      questions: [
        "What does You'll Own it and be Happier mean?",
        "Do I own what I buy?",
        "Is there a subscription?",
        "Why is ownership important?",
        "Are your products one time purchase?"
      ],
      answers: [
        "It means the studio prefers ownership over rent. Buy the thing, keep the thing, breathe easier.",
        "The intent is simple: fewer subscriptions, less lock-in, more stuff people actually own.",
        "Dravknox is built around owner-first projects. The exact model can vary, but the philosophy is not rental misery.",
        "Ownership matters because tools and art should not vanish the moment a billing portal sneezes.",
        "The line means what it says: the happier path is owning useful things, not feeding endless subscription vines."
      ]
    },
    {
      id: "founder",
      questions: [
        "Who made Dravknox?",
        "Who is the founder?",
        "Who is Mr Daks?",
        "Who built this website?",
        "Is this a solo studio?"
      ],
      answers: [
        "Dravknox is run by Mr. Daks, founder and solo developer, currently allergic to corpo beige.",
        "The founder is Mr. Daks. Solo developer, builder of the machinery, signer of the questionable status lines.",
        "Mr. Daks is the person behind Dravknox Studios: software, games, music, and stubborn independence.",
        "This is a solo-led studio. One person steering the ship, with enough tabs open to summon weather.",
        "Mr. Daks built the place. SIGIL just haunts the FAQ drawer with elegance."
      ]
    },
    {
      id: "contact",
      questions: [
        "How can I contact Dravknox?",
        "Where are your contact links?",
        "Can I email you?",
        "How do I reach the studio?",
        "Where can I find your socials?"
      ],
      answers: [
        "Use the Contact button in the bottom dock. It opens the current links without making a whole ceremony of it.",
        "Contact routes live in the bottom-right Contact panel. If a link exists, that is the cleanest path.",
        "Open Contact from the controls dock and pick the platform that fits. SIGIL endorses concise messages.",
        "The studio's contact links are in the Contact drop-up beside this chat button.",
        "Tap Contact in the bottom dock. The listed links are the current routes to the studio."
      ]
    },
    {
      id: "projects",
      questions: [
        "Where can I see projects?",
        "How do I view division projects?",
        "What has Dravknox made?",
        "Show me the projects",
        "Can I open a division?"
      ],
      answers: [
        "Click a division card. Talvrek, Embrvaal, and Veltrun open project panels when their data is ready.",
        "The division cards are the front doors. Hover for drama, click for projects.",
        "Projects are grouped by division. Pick Talvrek, Embrvaal, or Veltrun from the main cards.",
        "Use the central division cards to view what belongs where. The cards are not just decoration, thankfully.",
        "Open a division from the main grid. SIGIL recommends hovering first because the background shows off now."
      ]
    }
  ]
};
