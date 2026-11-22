/* Stride Door Coach — coaching content.
   The method follows the coach's door-to-door breakdowns (Nick) and his live
   training sessions with Blake, Dylan, Drew and Gabe. Lines are rewritten for
   Stride's services and for Queensland.
   Tokens in {braces} are filled from the setup sheet. " // " marks a pause. */
(function () {
  'use strict';

  var services = {
    windows: {
      label: 'Windows', noun: 'windows', short: 'window clean',
      see: 'Dull glass, dirty frames and tracks',
      spot: 'the dirtiest window near the front door',
      show: "It's just this stuff // washing down all the windows, and then the frames and the sills where the dirt kind of just sits.",
      count: 'run round and count the windows',
      countTip: 'Count the panes. Note screens and any upper-level glass. Pick the worst window you can both stand at, close to the door.',
      stack: ['All the glass, by hand', 'Every frame, all the way round', 'The sills and the tracks', 'Screens out, washed, back in'],
      stackLine: "So a lot of people will just scrub and squeegee the glass. // We hand wash all the glass, but also the frames all the way round // and then all the sills and the tracks.",
      why: "What happens if you just do the glass // when it rains, all the stuff from the frames and the sills just drips back down.",
      fiddly: 'the frames and the tracks',
      whole: 'every window, frame, sill and track on the place',
      scope: "That's all the exterior glass, frames, sills and tracks.",
      diy: 'Even the high ones?',
      guy: 'Does he do the frames and tracks, or mostly the glass?',
      honest: 'Sprinkler scale and salt pitting are in the glass, and cleaning will not lift them. Point them out at the window, before the price.',
      link: "One thing I noticed walking round // the driveway's got that dark band coming through. Same day, same ute. Want a price on that too?",
      throwIn: 'the glass on the front door and the porch light',
      callout: 320, saving: 80
    },
    driveway: {
      label: 'Driveway', noun: 'driveway', short: 'driveway clean',
      see: 'Dark bands, green edges, tyre marks',
      spot: 'the darkest band on the driveway',
      show: "See this dark band here? // That's not dirt, it's growth. It's in the pores, so a hose won't shift it.",
      count: 'pace out the driveway',
      countTip: 'Pace the slab for square metres. Check the finish (plain, exposed aggregate, stencilled), oil spots, and where the water will run.',
      stack: ['The whole slab with a rotary surface cleaner', 'Edges and expansion joints by hand', 'The crossover and the kerb', 'A rinse-down of everything around it'],
      stackLine: "So we run a rotary surface cleaner over the whole slab so it comes up even // then the edges and the joints by hand // the crossover and the kerb out the front // and we rinse down everything around it when we're done.",
      why: "If you just go at it with a wand you get tiger stripes. The surface cleaner is what keeps it even.",
      fiddly: 'the edges and the joints',
      whole: 'the whole driveway, edges, joints and the crossover',
      scope: "That's the whole slab, the edges, the joints and the crossover.",
      diy: 'With a wand, or have you got a surface cleaner?',
      guy: 'Does he use a surface cleaner, or a wand?',
      honest: 'Oil that has soaked in, rust and old sealer may only lighten. Say what you expect to get before you give the price.',
      link: "The surface cleaner's out anyway // the front path and the patio are the same setup. Want me to pace those out as well?",
      throwIn: 'the front path',
      callout: 380, saving: 80
    },
    house: {
      label: 'House wash', noun: 'house', short: 'house wash',
      see: 'Green on the shady wall, cobwebs under the eaves',
      spot: 'the green patch on the shaded wall',
      show: "It's this here // the green coming up the wall on the shady side, and the cobwebs up under the eaves.",
      count: 'walk round and look at the walls',
      countTip: 'Walk every wall. Note the material (weatherboard, render, brick), flaking paint, and which side has gone green. That side is where you both stand.',
      stack: ['Every wall, soft washed', 'Eaves, soffits and fascia', 'Cobwebs and wasp nests gone', 'Garage door, downpipes and trims'],
      stackLine: "So it's every wall, soft washed // the eaves and the fascia up top // all the cobwebs and nests out of the corners // and the garage door, downpipes and trims while we're there.",
      why: "High pressure forces water into the joints and lifts paint. We treat it, let it sit, then rinse at low pressure.",
      fiddly: 'the eaves and the shady side',
      whole: 'every wall, the eaves, the fascia and the trims',
      scope: "That's every exterior wall, the eaves, the fascia and the trims.",
      diy: 'With the pressure washer?',
      guy: 'Does he soft wash it, or pressure wash?',
      honest: 'Flaking paint and perished render can lift under any wash. Point at it on the walk-round so it is never a surprise.',
      link: "We wash top down, so the windows are best done straight after the walls // nothing settles back on clean glass. Want me to add them while we're here?",
      throwIn: 'the garage door',
      callout: 560, saving: 100
    },
    gutters: {
      label: 'Gutters', noun: 'gutters', short: 'gutter clean',
      see: 'Grass in the gutter, stains down the fascia',
      spot: 'the worst stretch of gutter you can see from the lawn',
      show: "See the grass growing out of that corner? // I'll pop the camera up and show you what's actually sitting in there.",
      count: 'walk the gutter line and get a couple of photos',
      countTip: 'Walk the gutter line, count the downpipes, and take two photos from the pole camera. The photo is your pain point: they cannot see it from the ground.',
      stack: ['Every run cleared by hand', 'Downpipes flushed and tested', 'Everything bagged and taken away', 'Before and after photos'],
      stackLine: "So every run gets cleared by hand // the downpipes get flushed and tested so we know they're taking water // it all gets bagged and taken away // and you get before and after photos, because you can't see it from down here.",
      why: "Gutters only matter when it rains, and round here that's all at once. It goes over the edge and back under the fascia.",
      fiddly: 'the downpipes',
      whole: 'every gutter run and every downpipe',
      scope: "That's every gutter run and every downpipe, cleared and flushed.",
      diy: 'Up the ladder yourself?',
      guy: 'Does he flush the downpipes, or just scoop the runs?',
      honest: 'Two-storey and steep sections are assessed on site. If a run cannot be reached safely, say so now and price what you can do.',
      link: "While I'm up there I see the roof and the fascia // if the walls are due a wash I'll show you the photo.",
      throwIn: 'a flush of the shed downpipes',
      callout: 290, saving: 70
    },
    roof: {
      label: 'Roof', noun: 'roof', short: 'roof clean',
      see: 'Black streaks, lichen or moss on the tiles',
      spot: 'the side of the roof with the black streaks, seen from the lawn',
      show: "See the black streaks on that side, and the lichen spots? // That's growth. It sits in the tile and holds the damp against it.",
      count: 'walk round and look at every side of the roof',
      countTip: 'Walk right round and look at every face from the ground. Note the material (concrete tile, terracotta, Colorbond), its age, the pitch, and which side is worst. Take two photos. Do not get on the roof to quote.',
      stack: ['Every face of the roof, at low pressure', 'Ridge capping and valleys', 'Gutters and downpipes checked afterwards', 'Paths, plants and walls protected and rinsed'],
      stackLine: "So it's every face of the roof, done at low pressure // the ridge capping and the valleys // then we check the gutters and downpipes for anything that's washed down // and the paths, plants and walls all get protected and rinsed off.",
      why: "Driveway pressure strips a tile. We check what the roof is made of and how old it is first, then clean it gently.",
      fiddly: 'the ridges and the valleys',
      whole: 'the whole roof, ridges and valleys included',
      scope: "That's every face of the roof, the ridge capping and the valleys.",
      diy: 'Up on the roof yourself?',
      guy: 'Does he pressure blast it, or do it at low pressure?',
      honest: 'Cleaning does not repair a roof. Cracked tiles, failed pointing and rust get reported, and they need a roofer. If the roof is too brittle or too steep to work safely, say so now and do not price it.',
      link: "While we're set up for the roof // the gutters fill with what comes off it, so most people get those cleared the same day. Want a price on both?",
      throwIn: 'a clear-out of the front gutters',
      callout: 780, saving: 120
    },
    solar: {
      label: 'Solar', noun: 'solar panels', short: 'solar panel clean',
      see: 'A film or bird mess on the panels',
      spot: 'a spot on the lawn where you can both see the panels',
      show: "See the film along the bottom edge of the panels, and the bird mess? // That's shading the cells underneath.",
      count: 'count the panels',
      countTip: 'Count the panels and note the roof pitch, the height and how you would reach them. Look for nesting under the array. Take a photo: from the ground they cannot see how dirty the glass is. If the panels already look clean, tell them so and do not sell it.',
      stack: ['Every panel, glass and frame', 'Deionised water and a soft brush only', 'The edges where the dirt collects', 'A check for nesting and shading'],
      stackLine: "So it's every panel, glass and frame // done with deionised water and a soft brush, no detergent and no pressure // the bottom edges where it all collects // and we check under the array for nesting while we're up there.",
      why: "Rain doesn't clean them, it leaves streaks. And tap water dries with mineral spots on the glass, which is why we use deionised.",
      fiddly: 'the bottom edges of the panels',
      whole: 'every panel on the roof',
      scope: "That's every panel, glass and frame, and the edges where it collects.",
      diy: 'With the hose?',
      guy: 'Does he use deionised water, or the hose?',
      honest: 'Never promise a percentage. How much output comes back depends on how dirty they were. Nothing electrical is touched, and panels are not cleaned in the heat of the day.',
      link: "We've got the pure water out for the panels // it's the same gear we use on windows. Want a price on those too?",
      throwIn: 'the glass on the front door',
      callout: 220, saving: 50
    }
  };

  var strategies = {
    anchor: {
      label: 'Job on the street',
      blurb: 'You have a booked job nearby. The neighbour is your proof and your reason for the price.',
      bridge: "My name's {me}. // Have you just seen me on {street} at all, the past couple of days?",
      what: "we're just helping {neighbour}, and we're coming back on {runDay}.",
      reason: "we're already here for {neighbour}",
      reasonLong: "While we're already here for {neighbour}",
      spots: "we've got room for two more on the day",
      coach: 'Real name, real day. "We are doing the Hendersons on Thursday" makes you a known figure on the street before you have said what you do.'
    },
    cold: {
      label: 'Cold street',
      blurb: 'No job here yet. You are building the first one, so the run itself is the reason.',
      bridge: "My name's {me}. // Have you just seen me on {street} at all today?",
      what: "we're just doing a run of homes on {street}, and we're coming back on {runDay}.",
      reason: "we're doing the street in one run",
      reasonLong: "While we're doing {street} in one run",
      spots: "we're capping the run at five homes",
      coach: 'The first sale on a street is the hard one: the coach puts it at 5 to 10 percent. Once you have a name to drop it goes to 20, 30, even 40. So your only job here is to earn that first name.'
    }
  };

  /* The sales process. Your lines follow the coach's own doors as closely as the
     surface allows: each "you" line is one full turn, the way he says it between
     homeowner replies. n = the note shown while the line is held. do = what your
     body does while you say it. silent = the homeowner only looks. */
  var beats = [
    {
      id: 'hello', half: 'front', title: 'The opener', time: 'First 10 seconds',
      goal: 'Sound like someone who popped over. First name, then a question. No company, no pitch.',
      done: 'They ask what you need, or what you are doing.',
      pattern: true, strategyNote: true,
      lines: [
        { who: 'you', t: "Hello, hello. // How's it going?", n: "Pattern interrupt. Nobody selling anything opens like this, so the \"not interested\" reflex has nothing to fire at." },
        { who: 'them', t: "Good. How are you?" },
        { who: 'you', t: "I'm living the dream. // {bridge}", n: "Not the answer they expect, then first name only and a question. No company. They end up asking you what you are doing, so the rest is an answer and not a pitch." },
        { who: 'them', t: "No." },
        { who: 'you', t: "No? // Good-looking bloke in the work shirt.", n: "His line is \"good-looking dudes in the black t-shirts\". A small joke keeps it light while they work out who you are." },
        { who: 'them', t: "What do you need?" }
      ],
      move: 'Two steps back from the door, side-on. Smile before you speak. Sound a little unsure of yourself.',
      why: "A homeowner has a script for salespeople: a knock, \"Hi, I'm so-and-so from such-and-such, we're doing…\", and \"not interested\" is out before you finish. Every line that fits that script triggers it. The coach calls those sales patterns. So his opener contains nothing a salesman would say: \"Hello, hello\", \"living the dream\", a first name, and a question they have to stop and think about.",
      trap: "The Duo opened with \"Be quick with you, we were just helping your neighbour Julie\" in one breath. Same words the coach would use, but fired at her with no gap, so it landed as a pitch.",
      who: 'The coach, on the Pitch Perfect Duo',
      ways: [
        { by: 'Nick', name: '"What\'s up?"', lines: [
          { who: 'you', t: "Hello, hello. // How are you doing?" },
          { who: 'them', t: "I'm good. What's up?" },
          { who: 'you', t: "My name's {me}. // Have you kind of just seen us?" },
          { who: 'them', t: "What are you talking about?" }
        ], note: 'Valentina. When they skip the small talk, so does he: first name and the question, straight away.' },
        { by: 'Nick', name: 'They were ready for you', lines: [
          { who: 'you', t: "Oh, my goodness. You were ready for me. // Sorry to startle you." },
          { who: 'them', t: "(Laughs.)" },
          { who: 'you', t: "My name's {me}. // Have you just seen me on {street} the past two or three days?" },
          { who: 'them', t: "Yeah." },
          { who: 'you', t: "You have!" }
        ], note: 'The door opened before he knocked. He reacted to that, laughed at himself, and carried on.' },
        { by: 'Nick', name: '"Can I help you?"', lines: [
          { who: 'you', t: "Hello, hello." },
          { who: 'them', t: "Can I help you?" },
          { who: 'you', t: "How are you doing?" },
          { who: 'them', t: "Fine. Can I help you?" },
          { who: 'you', t: "I don't know // I was just popping over. My name's {me}. Have you seen me on {street} the past couple of days?" },
          { who: 'them', t: "No. How can I help you?" }
        ], note: 'The old bloke. A salesman would launch into the pitch here. He says he does not know, and that he just popped over.' },
        { by: 'Nick', name: '"What\'s going on?"', lines: [
          { who: 'you', t: "Hello, hello. // What's going on?" },
          { who: 'them', t: "What is going on?" },
          { who: 'you', t: "Uh, nothing much. // Have you just kind of seen me on {street} at all? Like, the past two days?" },
          { who: 'them', t: "I really haven't noticed." }
        ], note: 'Vinnie. Answering his own question with "nothing much" is the pattern break: he has no agenda.' },
        { by: 'Nick', name: 'A grand entrance', lines: [
          { who: 'you', t: "Hello, hello. // That was a grand entrance." },
          { who: 'them', t: "What's up?" },
          { who: 'you', t: "Nothing much. // Have you just seen us at all on {street}, the past like two days?" },
          { who: 'them', t: "No." }
        ], note: 'He reacted to how she opened the door. (That house had a no-soliciting sign and it went badly. Skip any house with one.)' },
        { by: 'Nick', name: 'Something to react to', lines: [
          { who: 'you', t: "Hello, hello. // Sorry to disturb the guard dog." },
          { who: 'them', t: "(Laughs.)" },
          { who: 'you', t: "I like the van. Is that you guys?" },
          { who: 'them', t: "My mother-in-law's." },
          { who: 'you', t: "I was going to say, I wondered if it was just for hauling the kids around. // That'd be pretty efficient." }
        ], note: 'Alisa. Two real things in front of him, the dog and the van. It only works if it is true at this door.' },
        { by: 'Nick', name: 'Just popping over', lines: [
          { who: 'you', t: "Hello, hello. // How's it going?" },
          { who: 'them', t: "Good. How are you?" },
          { who: 'you', t: "I'm doing good. // My name's {me}. I was just popping over." }
        ], note: 'The Christmas street. "Doing good" instead of "living the dream". Same shape.' },
        { by: 'Nick', name: 'Second knock', nomix: true, lines: [
          { who: 'you', t: "Hello, hello. // I came by a little bit earlier, but I think you guys might have been out the back." },
          { who: 'you', t: "Have you seen me? // The very good-looking young man in the work shirt?" },
          { who: 'them', t: "You are very good." },
          { who: 'you', t: "Well, thank you." }
        ], note: 'Pat. Nobody answered the first time, so he came back and made the first knock part of the joke.' },
        { by: 'Nick', name: 'Coming back to a maybe', nomix: true, lines: [
          { who: 'you', t: "Oh, howdy howdy. // We're back again." },
          { who: 'them', t: "Did the price just drop?" },
          { who: 'you', t: "Well, what happened was, // do you know {neighbour}? We're going to be doing them too." }
        ], note: 'Going back to a maybe once you have booked a neighbour. The new booking is the reason for the knock.' },
        { by: 'Blake', name: 'Do you know…?', only: 'anchor', lines: [
          { who: 'you', t: "Hello, hello. // Do you know {neighbour}, by any chance?" },
          { who: 'them', t: "Yeah, we know them." }
        ], note: 'Blake\'s name-drop works. Say one name, then wait for the nod. He lost the effect by listing three names and carrying straight on.' },
        { by: 'The coach', name: 'A quieter homeowner', lines: [
          { who: 'you', t: "Hello. // How are you?" },
          { who: 'them', t: "Fine." },
          { who: 'you', t: "{bridge}" },
          { who: 'them', t: "No." }
        ], note: 'His advice rather than a door he knocked: "Meet people where they are." Big energy at a calm older bloke reads as a salesman, so drop your pace to theirs.' }
      ]
    },
    {
      id: 'steps', half: 'front', title: 'What you are doing, shown', time: '10 to 25 seconds',
      goal: 'Say what you are doing in one breath, and show it on their house.',
      done: 'They are off the doorstep and looking at the surface.',
      lines: [
        { who: 'you', t: "{what}", n: "Why you are on their street, in one breath. \"Helping\" a neighbour makes you a known figure, not a stranger selling something." },
        { who: 'you', t: "I can kind of show you // you want to take two steps?", do: 'Walk to {spot} as you say it. Look at it, not at them.', n: "Gets them away from the door, where they can shut it on you in two seconds. Showing beats telling." },
        { who: 'you', t: "{show}", n: "Name the parts while they are looking at them. From here it is you and them against the dirt." },
        { who: 'them', silent: true, t: "Looks at it. Says nothing.", n: "This is normal. They usually just look. Do not fill the silence." }
      ],
      move: 'Shoulder to shoulder, both facing the surface. Point with an open hand.',
      why: "At the door it is you against the homeowner. At the problem it is the two of you against the dirt. Once they see it, it becomes a problem they did not have a minute ago.",
      trap: "Blake stood ten feet back talking about \"the idea of window cleaning\" while the homeowner kept a hand on the door. The Duo ran both halves at the door, \"the absolute worst place for a sales conversation\".",
      who: 'The coach, on Blake and the Duo',
      ways: [
        { by: 'Nick', name: 'All in one breath', lines: [
          { who: 'you', t: "{what} I can kind of show you // {show}", do: 'Already walking to {spot}.' },
          { who: 'them', silent: true, t: "Follows. Looks." }
        ], note: 'How it sounds at most of his doors: one flowing answer to "what do you need?", said while he is already moving to the window.' }
      ]
    },
    {
      id: 'quick', half: 'front', title: 'Go for the price', time: '25 to 40 seconds',
      goal: 'Get to the next step. You are after the price here. The sale comes later.',
      done: 'You are walking round the house.',
      lines: [
        { who: 'you', t: "While we're here we're just taking ${saving} off each home, so it's super cheap.", n: "The reason comes before any number. A discount with no reason looks desperate." },
        { who: 'you', t: "I can {count}, meet you back here in thirty seconds, and just give you a quick price // just so you kind of know.", do: 'Nod, turn your feet, and start walking before they answer.', n: "A courtesy, not a question. \"Do you want a quote?\" from a stranger gets the safe answer, and the safe answer is no." },
        { who: 'them', t: "Um, sure.", easy: true }
      ],
      move: 'Say it as something you do for everyone. It should not sound like a question.',
      why: "You cannot sell until there is a price on the table, so the whole front half only exists to get you to the count.",
      trap: "Asking, then standing there looking at them, waiting. The coach's praise for Blake was exactly this: he nodded and turned his feet before the homeowner could respond.",
      who: 'The coach, on Blake',
      ways: [
        { by: 'Nick', name: 'They will not let you look', lines: [
          { who: 'you', t: "I tell you what // I've done a few of these builds, I think I know roughly." },
          { who: 'you', t: "It would normally be ${callout} for most of these builds. While we're here we take ${saving} off each home, so it would just be ${price} for literally the entire thing." },
          { who: 'them', silent: true, t: "Thinks about it." }
        ], note: 'When someone will not let you walk round, he still puts a number on the table from the front. An offer they can say yes to beats no offer at all.' },
        { by: 'The Duo', name: 'Two of you', lines: [
          { who: 'you', t: "{partner}'ll run round and count it up while we chat. // Thirty seconds." },
          { who: 'them', t: "Okay." }
        ], note: 'The Duo split it: one opens, one counts and presents. If you knock in a pair, the opener keeps the conversation warm while the count happens.' }
      ]
    },
    {
      id: 'loop', half: 'front', title: 'If they brush you off', time: 'Only when needed',
      goal: 'Go past the objection without answering it: disarm, one small reason, shrink the ask, move.',
      done: 'You are walking round the house, or they have asked you to go and you have gone.',
      process: 'front',
      lines: [
        { who: 'them', t: "I have a guy that does it." },
        { who: 'you', step: 'f1', t: "Nice. Most people do." },
        { who: 'you', step: 'f2', t: "We're doing a bunch in bulk, so we're just taking ${saving} off each home." },
        { who: 'you', step: 'f3', t: "I can {count} and at least let you know what the price is. If you don't want to do it, all good, but that way you at least kind of know." },
        { who: 'you', step: 'f4', t: "Got my running shoes on. I'll meet you back here.", do: 'Nod and go before they answer.' }
      ],
      move: 'One light loop. If they say no again or ask you to go, thank them and leave.',
      why: "There is no offer on the table yet, so this \"no\" has nothing to do with your price. The coach calls it a smokescreen: a reflex from someone who does not want to be sold. So he does not argue with it.",
      trap: "Believing it. \"If I take that at face value and stop there, there is a zero percent chance of closing that deal.\" The other trap is pushing a real no. When the old bloke said \"please let me go\", the coach said \"you're free to go whenever, have a fantastic day\" and walked.",
      who: 'The coach, on his own doors',
      ways: [
        { by: 'Dylan', name: 'The haircut', lines: [
          { who: 'them', t: "Um, actually, no thanks." },
          { who: 'you', step: 'f1', t: "Is it more the service, or my haircut that's kind of throwing you off?" },
          { who: 'them', t: "(Laughs.)" },
          { who: 'you', step: 'f3', t: "Twenty seconds, even faster. I'll just let you know and then we'll get out of your hair." },
          { who: 'you', step: 'f2', t: "Little information never hurts." },
          { who: 'them', t: "Oh, okay." }
        ], note: 'A joke drops the guard, and then she said "oh, okay". The coach: "her saying no is not logical, it is just a bodily reaction."' },
        { by: 'Nick', name: 'Busy right now', lines: [
          { who: 'them', t: "I'm busy eating ice cream." },
          { who: 'you', step: 'f1', t: "That's why we're here // you eat the ice cream." },
          { who: 'you', step: 'f3', t: "I'll be thirty seconds." },
          { who: 'you', step: 'f4', t: "I'll meet you back here. My name's {me}, by the way." }
        ], note: 'The coach\'s fix for Drew and the ice-cream bloke: turn the reason they cannot talk into the reason you will be quick.' },
        { by: 'Nick', name: 'Three in a row', lines: [
          { who: 'them', t: "I'm all set." },
          { who: 'you', step: 'f3', t: "If you want, I can at least just take a quick look and give you my price, that way you at least kind of know." },
          { who: 'them', t: "I have a housekeeper." },
          { who: 'you', step: 'f1', t: "Most people have the housekeeper." },
          { who: 'you', step: 'f2', t: "We actually just hand clean everything." },
          { who: 'you', step: 'f3', t: "I can at least just take thirty seconds and at least let you know." },
          { who: 'them', t: "I think I'm okay." },
          { who: 'you', step: 'f4', t: "Got my running shoes on. I'll take a quick look, I'll meet you back here." }
        ], note: 'His own door with Valentina, close to word for word. Three brush-offs, and he never answers one of them. Every reply points at the same small thing: thirty seconds and a price. Had she said "no, please go", he would have gone.' }
      ]
    },
    {
      id: 'count', half: 'count', title: 'The count', time: '30 to 60 seconds, alone',
      goal: 'Come back with a number, the worst example and one honest compliment.',
      done: 'You have a call-out price, a run price and the spot you will both stand at.',
      lines: [
        { who: 'move', t: '{countTip}', n: "You are choosing where the back half happens. Pick the worst example near the door." },
        { who: 'move', t: 'Decide your call-out price and your run price before you walk back. Find one thing you like out the back to open with.', n: "Deciding the number in front of them reads as making it up. The compliment restarts the conversation warm." }
      ],
      move: 'Be as quick as you said you would be. Thirty seconds was a promise.',
      why: "The front half only existed to earn this minute. Use it to find the spot where you will both stand for the back half.",
      trap: "Coming back to the door. If you present where you knocked, you are back to you against them.",
      who: 'The coach',
      ways: []
    },
    {
      id: 'back', half: 'back', title: 'Back at the problem', time: 'Re-entry',
      goal: 'Restart warm, and present at the dirt.',
      done: 'You are both standing at the worst spot, facing it.',
      lines: [
        { who: 'you', t: "Hello, hello. // I like the setup back there.", n: "Restart warm. One honest compliment shows you noticed the place." },
        { who: 'them', t: "It's nice." },
        { who: 'you', t: "I can kind of show you super quick right here // just this one by the door, it's a good example.", do: 'Stand beside them, both facing {spot}.', n: "Present at the dirt, never back at the door. They pay more when they are looking straight at the problem." }
      ],
      move: 'Shoulder to shoulder, facing the surface.',
      why: "Same reason as the front half, with more riding on it, because now you are making an offer. The coach reckons someone who would spend $400 at the door will spend $500 or more when they are looking straight at the problem.",
      trap: "The Duo gave the price at the door and still got $299. The coach's point is what that habit costs across fifty doors a day.",
      who: 'The coach, on the Duo',
      ways: []
    },
    {
      id: 'stack', half: 'back', title: 'Break it into parts', time: '15 seconds',
      goal: 'Make the job sound as big as it really is.',
      done: 'You have named every part and touched or pointed at each one.',
      lines: [
        { who: 'you', t: '{stackLine}', do: 'Touch or point at each part as you name it.', n: "Name every part. They picture the minimum unless you break it down, and then the price looks small beside the work." },
        { who: 'you', t: '{why}', n: "Why half a job is not enough. This is the reason they pay for the lot." },
        { who: 'them', silent: true, t: "Looks where you are pointing. Says nothing.", n: "In the videos they rarely answer here. They look. That is them seeing it, so carry on to the price." }
      ],
      move: 'Touch or point at each part as you name it. One part per breath.',
      why: "If you say \"{noun}\", they picture the minimum. The coach names even the little ledges: \"it's like, oh my gosh, they're doing so much.\"",
      trap: "Shrinking your own offer. Gabe was asked \"is that inside too?\" and said \"that's just the exterior\". The coach's version: \"That's all the exteriors.\" Same fact, opposite feeling.",
      who: 'The coach, to Gabe',
      ways: [
        { by: 'Nick', name: 'They ask the price early', lines: [
          { who: 'you', t: "So, we wash all the glass, but also the frames and all the trim…" },
          { who: 'them', t: "What would it cost to do it once?" },
          { who: 'you', t: "While we're already here, we take ${saving} off each home, so it comes down to just ${price}." }
        ], note: 'Valentina cut in mid-stack. He answered straight away, with the reason attached. Do not make them wait for a number they have asked for.' }
      ]
    },
    {
      id: 'price', half: 'back', title: 'The price, with a reason', time: '10 seconds',
      goal: 'Call-out price, the reason it drops, the run price, the guarantee. Then stop talking.',
      done: 'The number is out, you have said the guarantee, and you are quiet.',
      lines: [
        { who: 'you', t: "If you were to call us out, it's normally ${callout} for a one-off appointment.", n: "The anchor. It has to be your real one-off price." },
        { who: 'you', t: "{reasonLong}, we just take ${saving} off each home // so it comes all the way down to just ${price} for {whole}.", do: 'Say the number looking at the surface, not at them.', n: "Reason first, then the number. Staring at someone while you wait for an answer is pressure, and pressure brings the guard back up." },
        { who: 'you', t: "And then we have a full guarantee // as soon as we're done, you and I walk round and make sure it looks perfect for you. Nothing to pay until then.", do: 'Then say nothing.', n: "Takes the risk out of saying yes. He adds it whenever he senses hesitation." },
        { who: 'them', silent: true, t: "Quiet for a second.", n: "Let them think. The next person to speak should be them." }
      ],
      move: 'Eyes on the dirt while you say the number. Count two seconds of quiet in your head.',
      why: "A discount with no reason looks desperate. One with a reason (we are already on your street) keeps your standing and makes the offer better.",
      trap: "Blake held eye contact the whole way through the price. The coach: \"there is somebody making an offer and waiting for your response. Even if it is a reasonable offer, the pressure contributes to more self-defence.\"",
      who: 'The coach, on Blake',
      ways: [
        { by: 'Stride', name: 'Honest limit first', lines: [
          { who: 'you', t: "One thing before the price // {honestLine}" },
          { who: 'you', t: "Everything else comes up. Normally ${callout}, while we're here it's ${price}." }
        ], note: 'Stride\'s own rule, not the coach\'s: say what will not come up before the price. It reads as straight, and it removes the argument afterwards.' }
      ]
    },
    {
      id: 'stall', half: 'back', title: 'If they stall on the price', time: 'Only when needed',
      goal: 'Guide them to a decision: stay in it, find the real hesitation, one reason, one move, ask.',
      done: 'They have said yes, or a clear no and you have their name.',
      process: 'back',
      lines: [
        { who: 'them', t: "Do you have a card?" },
        { who: 'you', step: 'b1', t: "I do, in the ute. It's just down the street." },
        { who: 'them', t: "Let me think about it." },
        { who: 'you', step: 'b2', t: "Is it kind of just the price for you?" },
        { who: 'you', step: 'b3', t: "To be honest, you'd be my last spot. If you could just leave a really good review when we're done…" },
        { who: 'you', step: 'b4', t: "…I could call it ${deal}, and we'll still do {throwIn}." },
        { who: 'you', step: 'b5', t: "Would that make it a no-brainer?" },
        { who: 'them', t: "All right. I'll go ahead and do it." }
      ],
      move: 'Stay beside them, still facing the surface. Ask your one question, then wait for the answer.',
      why: "With a price on the table the hesitation can be real, so now he does ask about it. A card or \"I'll call you\" means \"I don't know\", and that never turns into a job later.",
      trap: "Gabe heard \"I'm pretty good\" and went straight to \"25 off, 50 off\" with no question and no reason. Drew offered \"next Wednesday\" while the run was still possible and got \"we'll call you\".",
      who: 'The coach, to Gabe and Drew',
      ways: [
        { by: 'Nick', name: 'They are away', lines: [
          { who: 'them', t: "We won't be here." },
          { who: 'you', step: 'b1', t: "That's fine, we do everything from the outside. We don't need you to be here." },
          { who: 'you', step: 'b4', t: "I'll shoot you a text when we finish up, and you just pay once you've had a chance to check it out." },
          { who: 'you', step: 'b5', t: "So I'll pop you on for {runDay}?" }
        ], note: 'A logistics problem, so he solves it and asks. He does not offer another date: "You never want to put that on the table until it is a 100 percent guaranteed no."' },
        { by: 'Nick', name: 'Call me in spring', lines: [
          { who: 'them', t: "I'll call you back in the spring." },
          { who: 'you', step: 'b1', t: "You totally could." },
          { who: 'you', step: 'b3', t: "The reason I was popping over is just that {reason}. That's why I'm able to take ${saving} off. It's not a forever deal." },
          { who: 'you', step: 'b5', t: "Do you want to do it while we're here?" }
        ], note: 'The re-anchor. It reminds them why the price exists and turns "later" back into "do I want this, yes or no".' },
        { by: 'Nick', name: 'A real no', lines: [
          { who: 'them', t: "Reasonable, but I don't need it." },
          { who: 'you', step: 'b1', t: "Sure." },
          { who: 'you', step: 'b2', t: "Would there be a price that does make sense for you?" },
          { who: 'them', t: "I'm not going to do it." },
          { who: 'you', step: 'out', t: "No worries. // What's your name?" }
        ], note: 'Vinnie. One question found out it was a no at any price, in ten seconds. Name, handshake, next door.' }
      ]
    },
    {
      id: 'book', half: 'back', title: 'Book it and get the name', time: 'The close',
      goal: 'A decision today, a name, a number, and it in writing.',
      done: 'You have their name and phone number written down, and the day agreed.',
      lines: [
        { who: 'them', t: "Okay. Let's do it.", easy: true },
        { who: 'you', t: "Perfect. // My name's {me}, what was yours?", n: "The name is what you say at the next door. His one regret on Drew's first sale was not getting it." },
        { who: 'them', t: "Sandra." },
        { who: 'you', t: "And what's a good phone number for you? I'll shoot you a text.", n: "A number turns a maybe into a booking, and the text puts your details in their hand without a card." },
        { who: 'them', t: "(Gives it.)" },
        { who: 'you', t: "We'll see you {runDay}. // Is there any time that doesn't work? We're pretty flexible.", n: "He asks about time restraints rather than offering slots. It assumes the day is settled." },
        { who: 'you', t: "I'll pop it in writing for you now. You've got ten business days to change your mind, no charge, and nothing to pay until you've walked round with me.", n: "Not from the coach. Queensland requires this for a door-knocked job over $100. Said plainly, it also makes yes feel safe." }
      ],
      move: 'Offer the handshake. Write the name down before you leave the driveway.',
      why: "The name is worth as much as the job, because it opens the next door. The coach on Drew's first sale: \"we definitely should have gotten the name.\"",
      trap: "Leaving a card. \"I don't know\" is as good as a no. People who are not sure with you standing there will not get sure on their own later.",
      who: 'The coach, on Drew',
      ways: [
        { by: 'Nick', name: 'Then the next surface', lines: [
          { who: 'you', t: '{link}' },
          { who: 'them', t: "Sure." }
        ], note: 'The coach counts the first number as "pre-upsells". Once they have said yes, the next surface is an easy add.' }
      ]
    },
    {
      id: 'leave', half: 'back', title: 'Leave well, either way', time: 'Every door',
      goal: 'A name, a handshake and a good note to finish on.',
      done: 'You know their name and they would wave you down next time.',
      lines: [
        { who: 'them', t: "Nope. Thank you very much." },
        { who: 'you', t: "What's your name?", n: "A no with a name is a job in spring, and a name you can use next door if they did book." },
        { who: 'them', t: "John." },
        { who: 'you', t: "John, I'm {me}. Nice to meet you. // If you see us on {runDay}, feel free to flag us down.", n: "Finish on a good note. Your mood at this door is your opener at the next one." },
        { who: 'them', t: "No worries. Have a great day." }
      ],
      move: 'Smile, shake, walk. Carry that into the next door.',
      why: "\"My only goal is to do my job: avoid sales patterns, take people as far through the process as I can, and give as many people as possible the chance to buy.\" Do that at every door and the coach reckons you close one in five.",
      trap: "Measuring the door by the sale. You control the process. You do not control whether their mate does it for $175.",
      who: 'The coach, after John and Alisa',
      ways: []
    }
  ];

  /* How the coach handles a no. Two ladders: before there is a price, and after.
     Every objection reply below is tagged with the rung it stands on. */
  var process = {
    front: {
      title: 'Before the price: go past it', when: 'No price yet',
      line: 'There is no offer on the table, so the no is a reflex. He does not answer it. He goes past it, to the price.',
      steps: [
        { k: 'f1', name: 'Disarm', what: 'Agree with them, or make them laugh. Never argue the objection.', ex: '"Most people have the housekeeper."' },
        { k: 'f2', name: 'One small reason', what: 'A few words on why this is different, or cheap, right now.', ex: '"We just hand-clean everything."' },
        { k: 'f3', name: 'Shrink the ask', what: 'Ask for thirty seconds and a price. You are not asking for the job.', ex: '"I can at least take thirty seconds and let you know."' },
        { k: 'f4', name: 'Move', what: 'Nod, turn your feet and go before they answer.', ex: '"Got my running shoes on. I\'ll meet you back here."' }
      ],
      out: 'A second no, or "please go": thank them and leave. That one is real.'
    },
    back: {
      title: 'After the price: guide them to a decision', when: 'Price is out',
      line: 'Now the hesitation can be real, so he finds it. One question, one reason, one move, then he asks.',
      steps: [
        { k: 'b1', name: 'Stay in it', what: 'A card or a call-back means "I don\'t know". Stay warm and stay put.', ex: '"I do, in the van."' },
        { k: 'b2', name: 'Find the real one', what: 'One question, then wait for the answer.', ex: '"Is it kind of the price, or the value?"' },
        { k: 'b3', name: 'Give a reason', what: 'Why you can do better for them, on this run.', ex: '"You\'d be the last spot. If you could leave a review…"' },
        { k: 'b4', name: 'One move', what: 'One better number, or one thing thrown in. Once.', ex: '"I could call it 199 and still scrub the front porch."' },
        { k: 'b5', name: 'Ask', what: 'Ask for the decision. Then go straight to the day and the phone number.', ex: '"Would that make it a no-brainer?"' }
      ],
      out: 'Still no: get the name, shake hands, and knock again once you have booked a neighbour.'
    },
    out: { name: 'Leave well' },
    big: { name: 'Answer big' }
  };

  /* His objection playbook: every objection in the three videos, grouped by type.
     Each play is the real exchange, close to word for word, including what he said
     when they pushed back a second time. US details are swapped for local ones
     (truck → ute, a weekday → the run day, dollar figures → your prices).
     throw: 'front' | 'back' marks plays a practice door can throw at you. */
  var playbook = [
    {
      id: 'someone', stage: 'front', title: 'We already have someone',
      hear: ['I have a guy that does it.', 'We have our cleaner guy coming to do them.', 'I have a housekeeper.'],
      means: 'A reflex. There is no price on the table yet, so there is nothing to compare their guy with.',
      move: '"Most people do." Or "{proofCap} did too, until they heard the deal." Then straight back to the price. He never argues about the guy and never runs him down.',
      plays: [
        { id: 'someone-valentina', by: 'Nick', door: 'Valentina', result: 'Booked', win: true, throw: 'front',
          note: 'Three brush-offs in a row, and he never answers one of them. Each reply points at the same small thing: a quick look and a price.',
          lines: [
            { who: 'them', t: "I'm all set." },
            { who: 'you', step: 'f3', t: "If you want, I can at least just take a quick look and just give you my price, that way you at least kind of know." },
            { who: 'them', t: "I have a housekeeper." },
            { who: 'you', step: 'f1', t: "Most people have the housekeeper," },
            { who: 'you', step: 'f2', t: "but we actually just hand clean everything." },
            { who: 'you', step: 'f3', t: "I can at least just take thirty seconds and at least just let you know." },
            { who: 'them', t: "I think I'm okay." },
            { who: 'you', step: 'f4', t: "Got my running shoes on. I'll take a quick look, I'll meet you back here. I'll be right back." }
          ] },
        { id: 'someone-vinnie', by: 'Nick', door: 'Vinnie', result: 'Got to a price · no sale · got his name', throw: 'front',
          note: '"Barbra did too until she heard the deal." He uses a neighbour as the answer to "I have a guy", then goes straight back to the price.',
          lines: [
            { who: 'them', t: "I have a guy that does it." },
            { who: 'you', step: 'f1', t: "Nice. I will say, {proof} did too, until they heard the deal." },
            { who: 'you', step: 'f2', t: "We're doing a bunch in bulk, so we're just taking ${saving} off each home." },
            { who: 'you', step: 'f3', t: "I can {count}, and at least let you know what the price is. If you don't want to do it, all good, but that way you at least kind of know." },
            { who: 'them', t: "I do most of it myself. I've got a guy for the rest." },
            { who: 'you', step: 'f1', t: "Yeah? {diy}" },
            { who: 'them', t: "Yeah, I get it done." },
            { who: 'you', step: 'f4', t: "Okay. While we're doing it for pretty cheap, I'll count it up and let you know what it is. If you want to do it, cool. If not, all good." }
          ] },
        { id: 'someone-alisa', by: 'Nick', door: 'Alisa', result: 'Got to a price · no sale (her guy is a mate)', throw: 'front',
          note: 'He gets curious about their guy instead of competing with him, then asks if there is "any percentage chance".',
          lines: [
            { who: 'them', t: "We have our cleaner guy coming to do them." },
            { who: 'you', step: 'f1', t: "Does he pressure wash, or what? How does he do it, do you know?" },
            { who: 'them', t: "He pressure washes, and he takes the screens off and does all that too." },
            { who: 'you', step: 'f2', t: "Nice. I will say, we're doing it for super cheap." },
            { who: 'you', step: 'f3', t: "Do you think there's any percentage chance?" },
            { who: 'them', t: "Um, it kind of depends." },
            { who: 'you', step: 'f4', t: "I'd have to {count}, but I've got my shoes on. I can jog around and let you know. I'll be super quick. What's your name?" }
          ] }
      ]
    },
    {
      id: 'diy', stage: 'front', title: 'We do it ourselves',
      hear: ['My wife likes to do it.', 'I do it myself.', 'I usually do it myself.'],
      means: 'Pride, and often true. They have still never heard your price.',
      move: '"Sure." Then a real question about how they do it, or he points at the bit they missed. Then the price anyway, even if he has to say it from the front.',
      plays: [
        { id: 'diy-vinnie', by: 'Nick', door: 'Vinnie', result: 'Price given · no sale · got his name',
          note: 'Five nos, and he still gets the price out, asks one question about it, and leaves with a name. "They cannot buy if they do not know what we are doing and how much it is."',
          lines: [
            { who: 'them', t: "I do it myself." },
            { who: 'you', t: "Yeah? {diy}" },
            { who: 'them', t: "Yep." },
            { who: 'you', t: "Okay. While we're doing it for pretty cheap, I'll count it up, let you know what it is. If you want to do it, cool. If not…" },
            { who: 'them', t: "I don't want to." },
            { who: 'you', t: "You sure? Well, I'll at least tell you, cause I've done this build a couple of times. ${callout} for a one-off appointment. While we're doing every fifth home, we just take off ${saving}. It's just a lot easier to wheel over. So it comes down to literally ${price} for {whole}." },
            { who: 'you', t: "I will say, while we're doing it dirt cheap, does that sound somewhat reasonable for just ${price}?" },
            { who: 'them', t: "Reasonable, but I don't need it." },
            { who: 'you', step: 'b2', t: "Sure. Would there be a price that does make sense for you? Or would you just do it yourself no matter what?" },
            { who: 'them', t: "I'm not going to do it." },
            { who: 'you', step: 'out', t: "No worries. Well, what's your name?" }
          ] },
        { id: 'diy-john', by: 'Nick', door: 'John', result: 'Price given · no sale · got his name',
          note: 'He could not walk round, so he pointed at the frames from the door and put a price on the table anyway.',
          lines: [
            { who: 'them', t: "My wife likes to. Not that she likes to do it, but she does it." },
            { who: 'you', t: "Sure." },
            { who: 'them', t: "We just did them a month ago." },
            { who: 'you', t: "Oh, really?" },
            { who: 'them', t: "Do you see water spots?" },
            { who: 'you', t: "It's hard to see in the shade. I can see a little bit on {fiddly}, though. It's dirt that's kind of etched in. And when it rains, a lot of the time that stuff drips back down." },
            { who: 'you', t: "It's normally a bit pricey if you were to call us out. ${callout} for a one-off appointment. While we're here, though, we take ${saving} off each home, cause it's a lot easier to wheel over. So it'd just be ${price}." },
            { who: 'them', t: "Nope. Thank you very much." },
            { who: 'you', step: 'out', t: "What's your name? // {me}, nice to meet you. Well, if you see us on {runDay}, feel free to flag us down." }
          ] }
      ]
    },
    {
      id: 'done', stage: 'front', title: 'We just had it done',
      hear: ['We just did them a month ago.', 'I did it not too long ago.', "I'm pretty good."],
      means: 'They did part of it. The part nobody likes doing is usually still there.',
      move: '"Oh, really?" or "I got you." Then he assumes the yes and asks a logistics question: "Is the gate on the left or the right?"',
      plays: [
        { id: 'done-rob', by: 'Gabe', door: 'Rob', result: 'Got round the back and gave a price', throw: 'front',
          note: 'The gate question is the move. It assumes the walk-round is happening, so the only thing left to answer is which way.',
          lines: [
            { who: 'them', t: "I'm pretty good." },
            { who: 'you', step: 'f1', t: "Pretty good. // Have you had it done recently?" },
            { who: 'them', t: "I did it not too long ago." },
            { who: 'you', step: 'f1', t: "I got you." },
            { who: 'you', step: 'f3', t: "I can get you the price. If you like it, awesome. If not, no big deal at all." },
            { who: 'you', step: 'f4', t: "But is the gate on the left, or the right?" },
            { who: 'them', t: "No gate. It's all open." },
            { who: 'you', step: 'f4', t: "Sounds good. I'll meet you back here in thirty seconds. What's your name?" }
          ] }
      ]
    },
    {
      id: 'busy', stage: 'front', title: "I'm busy",
      hear: ["I'm busy eating ice cream.", "I'm in the middle of doing something."],
      means: 'Probably true, and not a no. Their reason is your reason to be quick.',
      move: '"That\'s why we\'re here. You keep going, I\'ll be thirty seconds."',
      plays: [
        { id: 'busy-drew', by: 'The coach, fixing Drew\'s door', door: 'The ice-cream bloke', result: 'Drew let him go. This is what the coach said to say', throw: 'front',
          note: 'Drew took "I\'m busy" as the end. The coach: turn their reason into the reason you will be quick, then give your name.',
          lines: [
            { who: 'them', t: "I think it's the heat of the day, and I'm busy eating ice cream." },
            { who: 'you', step: 'f1', t: "Well, there you go. That's why we're here." },
            { who: 'you', step: 'f3', t: "You eat the ice cream, I'll be thirty seconds." },
            { who: 'you', step: 'f4', t: "I'll meet you back here. My name's {me}, by the way." }
          ] }
      ]
    },
    {
      id: 'nothanks', stage: 'front', title: 'No thanks',
      hear: ['Um, actually, no thanks.', "I'm good right now.", "I'm all set."],
      means: 'A flinch, not a decision. There is no offer yet. You get one light go at it.',
      move: 'A joke, then the smallest possible ask: "Twenty seconds, even faster."',
      plays: [
        { id: 'nothanks-dylan', by: 'Dylan', door: 'Cindy', result: 'Booked', win: true, throw: 'front',
          note: 'The joke drops her guard, and twenty seconds is easy to say yes to. The coach: "her saying no is not logical, it is just a bodily reaction."',
          lines: [
            { who: 'them', t: "Um, actually, no thanks. Thank you." },
            { who: 'you', step: 'f1', t: "Is it more like the service, or my haircut, that's kind of throwing you off?" },
            { who: 'them', t: "(Laughs.) It's pretty bad right now." },
            { who: 'you', step: 'f3', t: "Twenty seconds, even faster. I'll just let you know, and then we'll get out of your hair." },
            { who: 'you', step: 'f2', t: "Little information never hurts." },
            { who: 'them', t: "Oh, okay." }
          ] },
        { id: 'nothanks-miss', by: 'Nick', door: 'His own miss', result: 'No',
          note: 'Even the coach slips. He asked a yes-or-no question and got the safe answer. Compare "I\'ll give you a quick price, just so you know", said while you start walking.',
          lines: [
            { who: 'them', t: "I'm good right now." },
            { who: 'you', t: "Would you want a quick price?" },
            { who: 'them', t: "No, not right now." }
          ] }
      ]
    },
    {
      id: 'cardfront', stage: 'front', title: 'Got a card? (before the price)',
      hear: ["You don't have a card or anything?", "I'm going to do it, but not now."],
      means: 'A polite way to end it. If they will not let you walk round, the price has to come to them.',
      move: 'Find the reason with one question, find something to like, then price it from the front: "I\'ve done a few of these builds, I think I know roughly."',
      plays: [
        { id: 'cardfront-seller', by: 'Nick', door: 'The woman selling her house', result: 'Price given · no sale',
          note: '"Is that probably a deal? No. But I\'m going to take it as far as I can, just cause maybe one of those is a deal."',
          lines: [
            { who: 'them', t: "I'm going to be doing that, but not now. And you don't have a card or anything?" },
            { who: 'you', t: "I do, in the ute. We had the two spots on {runDay}, so we always take ${saving} off whenever we're out here." },
            { who: 'them', t: "I can't do that." },
            { who: 'you', t: "Is there any particular reason for {runDay}?" },
            { who: 'them', t: "I'm trying to get the house ready for sale." },
            { who: 'you', t: "Oh, really? You guys selling it soon? // That looks pretty good. The brick on this place is nice." },
            { who: 'you', t: "The cards are in the ute, but I could even tell you what it would be, if you wanted to write it down, or I could shoot you a text." },
            { who: 'you', t: "I tell you what, I've done a few of these builds, I think I know roughly. It would normally be ${callout}. While we're here, though, we take ${saving} off each home. If we could fit you in, it would just be ${price} for literally the entire thing." },
            { who: 'them', t: "But thank you." },
            { who: 'you', step: 'out', t: "It was a pleasure meeting you." }
          ] }
      ]
    },
    {
      id: 'realno', stage: 'front', title: 'A real no', hard: true,
      hear: ['Please let me go.', "I don't appreciate the interruption.", 'A No Junk Mail or Do Not Knock sign.'],
      means: 'Not a smokescreen. They asked you to leave, or the sign did.',
      move: 'Leave, warmly, straight away: "You\'re free to go whenever. Have a fantastic day."',
      plays: [
        { id: 'realno-old', by: 'Nick', door: 'The old bloke', result: 'Walked away', hard: true,
          note: 'One light question when he said he was busy. The moment he asked to be let go, Nick let him go. In Queensland you must leave when asked and not come back for 30 days.',
          lines: [
            { who: 'them', t: "Thank you very much. I'm in the middle of doing something. We don't need it, and I'll see you later." },
            { who: 'you', t: "Totally cool. Is that what you're up to? The {noun}?" },
            { who: 'them', t: "No, sir. Please let me go, because I'm in the middle of something and I really need to go. Please let me go." },
            { who: 'you', step: 'out', t: "You're free to go whenever. I'm just having a conversation. Have a fantastic day, sir." }
          ] },
        { id: 'realno-sign', by: 'Nick', door: 'The no-soliciting sign', result: 'Walked away', hard: true,
          note: 'He knocked a house with a sign and copped it. Skip any house with one.',
          lines: [
            { who: 'them', t: "No, I'm not interested. Thank you." },
            { who: 'them', t: "I don't appreciate the interruption. We really do have a no-soliciting policy in the neighbourhood." },
            { who: 'you', step: 'out', t: "I'm sorry. // Well, have a great day." }
          ] }
      ]
    },
    {
      id: 'card', stage: 'back', title: 'Got a card? / Let me think about it',
      hear: ['Do you have a card?', 'Let me think about it.', 'Can I call you when I get back?'],
      means: '"I don\'t know." And "I don\'t know" never turns into a job, because nobody rings back.',
      move: 'Stay in it ("I do, in the ute"), then a reason and one better number now: "If I can bypass the few hours and you thinking about it…"',
      plays: [
        { id: 'card-valentina', by: 'Nick', door: 'Valentina', result: 'Booked', win: true, throw: 'back',
          note: 'He never argued with "let me think about it". He offered to save her the thinking.',
          lines: [
            { who: 'them', t: "Do you have a card?" },
            { who: 'you', step: 'b1', t: "I do, in the ute, yeah. It's just kind of down the street." },
            { who: 'them', t: "I'm running somewhere. Let me think about it. Put your card in the letterbox. Can I call you when I get back in a couple of hours?" },
            { who: 'you', step: 'b1', t: "I'll get my phone number and email to you." },
            { who: 'you', step: 'b4', t: "If I can bypass the few hours and you thinking about it, can we call it ${deal}?" },
            { who: 'them', t: "…All right. I'll do it." }
          ] }
      ]
    },
    {
      id: 'partner', stage: 'back', title: "I'd have to ask my partner",
      hear: ["I'd have to ask my wife.", "I've got to ask my husband.", 'Let me ask real quick.'],
      means: 'Sometimes true, sometimes a soft exit. One question tells you which.',
      move: 'Try to get the partner to the problem. If not: "Is it a thing where, if I could do a bit cheaper, you could say yes?" Then a reason, one move, and the guarantee.',
      plays: [
        { id: 'partner-christmas', by: 'Nick', door: 'The Christmas house', result: 'Booked, $50 under the run price', win: true, throw: 'back',
          note: 'He saw the husband wince at the price, tried to bring the wife out, then gave one reason (last spot), one condition (a review) and one move.',
          lines: [
            { who: 'them', t: "Have you got a card?" },
            { who: 'you', step: 'b1', t: "I don't on me. I was just kind of filling the last spot for {runDay}." },
            { who: 'you', step: 'b2', t: "Is she free? I wanted to show her {throwIn}, just so she knows we could take care of that too." },
            { who: 'them', t: "You know what? Not this time." },
            { who: 'you', step: 'b1', t: "Okay, sure. I will say, I know there was a buildup. I know she's just kind of busy. It does, you know, kind of need done." },
            { who: 'them', t: "Yeah. You know what, I did it myself a few months ago. I usually do it myself." },
            { who: 'you', step: 'b3', t: "Sure, I hear you. I will say, since it does kind of need it, and you guys would be the last spot, it'd make my day easier to just fill you guys." },
            { who: 'you', step: 'b4', t: "If you could just leave an awesome review once we're done doing a good job, I could just call it ${deal}, and we'll still scrub down {throwIn}." },
            { who: 'them', t: "All right. I'll go ahead and do it." }
          ] },
        { id: 'partner-gabe', by: 'Gabe', door: 'Gabe\'s first door', result: 'A maybe, then booked on a comeback',
          note: 'He tested whether the husband was real, texted the quote, and came back later with a neighbour booked. The comeback closed it.',
          lines: [
            { who: 'them', t: "Like I said, I can't. My husband's working now, so I've got to ask him." },
            { who: 'you', step: 'b1', t: "No problem. Let me do this: I'll send you an estimate. What's a good phone number for you?" },
            { who: 'you', step: 'b2', t: "I will say, we're just trying to fill the last spot. Is it a thing where if I could give you a little bit cheaper of a price, you could say yes? Or is it something you really just have to talk to him about?" },
            { who: 'them', t: "Yeah, I've got to ask him." },
            { who: 'you', step: 'b1', t: "Gotcha. No problem. I'll text you that information, and a couple of days before we're out here, I'll shoot you a text and see if you guys want to get it done." }
          ] },
        { id: 'partner-drew', by: 'The coach, coaching Drew', door: 'The couple leaving town', result: 'Booked', win: true, throw: 'back',
          note: 'Coach to Drew: "If there\'s any hesitancy when he comes back, just mention the full guarantee."',
          lines: [
            { who: 'them', t: "Let me ask real quick." },
            { who: 'you', step: 'b1', t: "No worries." },
            { who: 'you', step: 'b4', t: "And just so you know, we have a full guarantee. As soon as we're done, I don't want you to pay anything until you've walked around and made sure it all looks perfect." },
            { who: 'them', t: "All right. ${deal}'s perfect." }
          ] }
      ]
    },
    {
      id: 'price', stage: 'back', title: "It's more than I wanted",
      hear: ["I'm pretty good.", "Our guy only charges less.", 'Can you take another fifty off?'],
      means: 'Price, or value? You do not know yet, so do not move the price yet.',
      move: '"Is it kind of the price, or the value?" Then a reason ("we only have one spot left") and one move. Never two drops in one breath.',
      plays: [
        { id: 'price-coach', by: 'The coach, redoing Gabe\'s door', door: 'Rob', result: 'How it should have gone', throw: 'back',
          note: 'Gabe said "let us earn your business, I\'ll take another 50 off… 25". The coach: "This guy is desperate." Ask first, give a reason, make one move.',
          lines: [
            { who: 'them', t: "I'll call you back in the spring, if you take another fifty off." },
            { who: 'you', step: 'b2', t: "Is it kind of the price, or the value, to be honest?" },
            { who: 'you', step: 'b3', t: "We only have one spot left anyways." },
            { who: 'you', step: 'b4', t: "Why don't we call it ${deal} for the whole thing, and just make it look awesome for you." },
            { who: 'them', t: "All right. Sounds good." }
          ] },
        { id: 'price-alisa', by: 'Nick', door: 'Alisa', result: 'No sale. The right call',
          note: 'Her reason was loyalty to a mate with a newborn, not money. He made one offer, heard the real reason, and stopped.',
          lines: [
            { who: 'them', t: "Our guy who does our house and our windows is ${deal}." },
            { who: 'you', t: "Really?" },
            { who: 'them', t: "He's also a friend." },
            { who: 'you', t: "Well, ${deal} is pretty hard to beat." },
            { who: 'you', step: 'b2', t: "Is he already scheduled, or is he just kind of due to come in at some point soon?" },
            { who: 'them', t: "I think it's in the next two weeks." },
            { who: 'you', step: 'b2', t: "Is there a price where it would make sense for you?" },
            { who: 'them', t: "Probably not. They just had a baby. I can't take the job off him." },
            { who: 'you', step: 'out', t: "I hear you. I hear you. // Fair enough. I'll text you in the springish time." }
          ] }
      ]
    },
    {
      id: 'away', stage: 'back', title: "We won't be home / Not today",
      hear: ["We won't be here.", "It's not going to be today.", "We're leaving town."],
      means: 'A logistics problem you can solve. Do not offer another date.',
      move: '"We do everything from the outside, you don\'t need to be here." Then a reason to do it with the neighbour, and one move. A later date only goes on the table when this one is a definite no.',
      plays: [
        { id: 'away-pat', by: 'Nick', door: 'Jim\'s neighbours, second knock', result: 'Booked, $50 under', win: true, throw: 'back',
          note: 'Drew had offered "next Wednesday" and got "we\'ll call you". Nick went back with a second neighbour booked and re-anchored on doing it with them.',
          lines: [
            { who: 'them', t: "It's not going to be today, okay?" },
            { who: 'you', step: 'b1', t: "I will say, just to know that we have the spot secure, if you'd prefer to wait, we totally could." },
            { who: 'you', step: 'b3', t: "So if you wanted to do it with them, we could even call it ${deal}, just because it would be really convenient, cause we wouldn't even have to come back." },
            { who: 'you', step: 'b5', t: "Would that sound good? Just to fit you in with them." },
            { who: 'them', t: "What if we're not here?" },
            { who: 'you', step: 'b1', t: "If you weren't here, then we just text you an invoice, and you guys just pay once you've checked it out." },
            { who: 'them', t: "Do it for ${deal}." }
          ] },
        { id: 'away-prehandle', by: 'The coach, coaching Drew', door: 'Jim\'s neighbours', result: 'Say this before the price',
          note: 'When you already know they are going away, handle it inside the presentation so it never becomes the objection.',
          lines: [
            { who: 'you', t: "We pop out all the screens, we do everything from the outside. So you guys will just come home later to a clean house." },
            { who: 'you', t: "I'll just shoot you an invoice, and as soon as you get home, make sure everything looks super awesome. You can just pay once you've had a chance to check it out." }
          ] }
      ]
    },
    {
      id: 'later', stage: 'back', title: "We'll call you / In the spring",
      hear: ["We'll call you.", "I'll call you back in the spring.", "We'll look at next week."],
      means: 'They like you and they are putting it off. Later almost never comes.',
      move: 'The re-anchor: "The reason I was popping over is just because you\'re right next door. That\'s why I\'m able to take it off. It\'s not a forever deal."',
      plays: [
        { id: 'later-reanchor', by: 'The coach, coaching Drew', door: 'Jim\'s neighbours', result: 'How to bring it back to now', throw: 'back',
          note: '"When you re-anchor them, it changes their frame. He\'s just popping by because he\'s doing Jim right now. Do I want this, yes or no?"',
          lines: [
            { who: 'them', t: "We'll just call you when we're back." },
            { who: 'you', step: 'b1', t: "Yeah, you totally could." },
            { who: 'you', step: 'b3', t: "The reason I was popping over is just because {reason}. That's why I'm able to take ${saving} off. This isn't like a forever deal." },
            { who: 'you', step: 'b5', t: "Do you want to do it while we're here?" },
            { who: 'them', t: "Yeah, okay. Let's just do it." }
          ] }
      ]
    },
    {
      id: 'compare', stage: 'back', title: 'Did someone else come through?',
      hear: ['Did you guys come through here in the spring?', 'Were there some other fellas?'],
      means: 'They are comparing you with someone. A joke keeps it light and keeps you moving.',
      move: '"Probably not as good-looking, I assume."',
      plays: [
        { id: 'compare-pat', by: 'Nick', door: 'Pat', result: 'Booked', win: true,
          note: 'He did not ask who they were or what they charged. A joke, and on to booking.',
          lines: [
            { who: 'them', t: "Did you guys come through here in the spring? Were there some other fellas that swung by?" },
            { who: 'you', t: "This is my first time. // Probably not as good-looking, I assume." },
            { who: 'them', t: "I don't know. They were pretty cute." },
            { who: 'you', t: "Oh, darn." }
          ] }
      ]
    },
    {
      id: 'extra', stage: 'back', title: 'Can you throw in…?',
      hear: ['If you do everything, including the screens, for that, you\'ve got a deal.', "I'll only talk to you if you'll do my sliding doors."],
      means: 'A buying signal. They are already negotiating the job.',
      move: 'A barter keeps your price: "If we can get a good review from you when we\'re done, we can do that for free."',
      plays: [
        { id: 'extra-barter', by: 'Nick', door: 'The woman who walked out', result: 'Booked', win: true, throw: 'back',
          note: 'He did not drop the number. He traded the extra for a review.',
          lines: [
            { who: 'them', t: "If you do everything, including {throwIn}, for ${deal}, you've got a deal." },
            { who: 'you', step: 'b3', t: "I tell you what, we'll do a little bit of a barter here." },
            { who: 'you', step: 'b4', t: "If we can get a good review from you whenever we're done doing a good job, we can call it ${deal} for everything, and do {throwIn} for free." },
            { who: 'them', t: "Okay." }
          ] }
      ]
    },
    {
      id: 'inside', stage: 'back', title: 'Is that the whole lot?',
      hear: ['Is that inside too?', 'Is that everything?'],
      means: 'A buying question. Answer it big.',
      move: '"That\'s all the exteriors." Never "that\'s just the outside".',
      plays: [
        { id: 'inside-gabe', by: 'The coach, to Gabe', door: 'Lynn', result: 'Booked',
          note: '"If you demean what you are doing with your own words, you are stacking the odds against yourself."',
          lines: [
            { who: 'them', t: "Is that inside too?" },
            { who: 'you', step: 'big', t: "That's all the exteriors. // {scope}" }
          ] }
      ]
    }
  ];
  // the flat list the drills and practice doors use
  var objections = [];
  playbook.forEach(function (g) {
    g.plays.forEach(function (pl) { objections.push(Object.assign({ group: g, stage: g.stage, them: pl.lines[0].t, hard: g.hard || pl.hard }, pl)); });
  });

  /* Door sim. Each choice: v best|ok|miss, g = change to their guard (minus is good). */
  var scenarios = [
    {
      id: 'warm', title: 'The warm door', level: 'Start here', strategy: 'any',
      blurb: 'A friendly homeowner and no pushback. The risk here is rushing or over-selling.',
      based: 'Gabe and Lynn', guard: 55, win: 40,
      nodes: [
        { stage: 'door', them: "(The door opens.) Hey. How are you?",
          choices: [
            { v: 'best', g: -12, t: "Hello, hello. I'm living the dream. // Is that the guard dog back there?", reply: "Ha, she's harmless. Yeah, not bad.", c: 'Nothing in that fits the script she has for salespeople, so the reflex has nothing to fire at. She has answered twice and you have not pitched.' },
            { v: 'miss', g: 18, t: "Good! I'm {me} from Stride, we're doing {noun} on your street and taking ${saving} off, I can run round and give you a price?", reply: "Oh. Um. Okay…", c: 'She let you, because she is nice. That was still one run-on sentence. The coach to Gabe: "Slow down. It is a conversation."' },
            { v: 'ok', g: 6, t: "Hi, I'm {me} from Stride Exterior Cleaning.", reply: "Hi…?", c: 'Name and company is exactly how she expects a salesman to start. That is the pattern. Break it first, first name next, and say what you are doing only once they ask.' }
          ] },
        { stage: 'door', them: "So what brings you round?",
          choices: [
            { v: 'best', g: -10, t: "{bridge}", reply: "No, I haven't. What are you doing?", c: 'First name only and a question. Now she is the one asking what you are doing, so everything after this is an answer and not a pitch.' },
            { v: 'ok', g: 0, t: "We clean {noun}. We're in the area this week.", reply: "Right.", c: 'True, and flat. You gave her nothing to ask about.' },
            { v: 'miss', g: 14, t: "We're the best-rated exterior cleaners in the Redlands and we've got a special on today only.", reply: "Mm-hm.", c: 'A claim and a deadline. That is the sales pattern everyone has heard before, and "today only" has to be true to say it.' }
          ] },
        { stage: 'pain', them: "What are you doing, exactly?",
          choices: [
            { v: 'best', g: -14, t: "I can show you, actually, if you want to take two steps. // {what} {show}", reply: "(She steps out and looks at it.)", c: 'She is off the door and looking at it. She did not say anything, and she does not need to. Now it is the two of you against the dirt.' },
            { v: 'ok', g: 2, t: "We clean {whole}. It makes a big difference.", reply: "I'm sure.", c: 'Telling. She is still on the doorstep picturing "the idea" of it.' },
            { v: 'miss', g: 10, t: "Honestly, your {noun} really need it. When did you last have it done?", reply: "It's not that bad.", c: 'From the doorstep that sounds like criticism. At the surface she would have said it herself.' }
          ] },
        { stage: 'pain', them: "So what does something like that cost?",
          choices: [
            { v: 'best', g: -8, t: "I'll {count} and give you a quick price, just so you know. // Thirty seconds, I'll meet you back here.", reply: "Sure.", c: 'A courtesy that does not need an answer. Nod, turn your feet, go.' },
            { v: 'ok', g: 4, t: "Would you like me to do a quote for you?", reply: "Um… I guess?", c: 'It worked on a warm door. On a cooler one, a yes or no question gets the safe answer, and the safe answer is no.' },
            { v: 'miss', g: 6, t: "Probably around ${price}, something like that.", reply: "Oh. Okay. I'll have a think.", c: 'You priced it before she had seen the parts. No stack, no reason for the number, and now she is thinking about it at the door.' }
          ] },
        { stage: 'pain', them: "(You are back.) That was quick. So what do you reckon?",
          choices: [
            { v: 'best', g: -12, t: "{stackLine} // {why}", reply: "(She looks along the frames. Says nothing.)", c: 'One part per breath, pointing as you go. In the videos they rarely answer here. They look, and that is the point.' },
            { v: 'miss', g: 8, t: "It's ${price}.", reply: "Hm. For {noun}?", c: 'A bare number with nothing beside it. She is comparing it with the minimum she pictured.' },
            { v: 'ok', g: -2, t: "We'd do {whole}, top to bottom.", reply: "Okay.", c: 'True, but it goes past in one breath. Break it into parts and touch each one.' }
          ] },
        { stage: 'pain', them: "And how much is all that?",
          choices: [
            { v: 'best', g: -10, t: "If you called us out for a one-off it's normally ${callout}. {reasonLong}, we take ${saving} off // so it's just ${price}. And you don't pay until you've walked round with me.", reply: "That's not bad at all.", c: 'Anchor, reason, number, guarantee. You looked at the surface and then stopped talking.' },
            { v: 'ok', g: 2, t: "It's ${price} for everything, which is a really good price.", reply: "Is it?", c: 'She has nothing to measure it against. The call-out price and the reason are what make it good.' },
            { v: 'miss', g: 12, t: "It's ${price}… but I could probably do ${deal} if that helps?", reply: "Oh. Why's that?", c: 'You dropped your own price before she objected. The coach: only when it is the difference between a sale and no sale, and always with a reason.' }
          ] },
        { stage: 'shake', them: "Is that the whole lot?",
          choices: [
            { v: 'best', g: -8, t: "{scope} // I'm {me}, by the way. What was your name?", reply: "Lynn. Yeah, let's do it.", c: 'Answered big, then straight to the name. You will use "Lynn" at the next door.' },
            { v: 'miss', g: 10, t: "No, that's just the outside.", reply: "Oh. Just the outside.", c: 'The exact slip the coach pulled Gabe up on. "Just" makes your own offer smaller.' },
            { v: 'ok', g: 0, t: "Yep, everything outside.", reply: "Okay. Yeah, go on then.", c: 'Fine. Name the parts again and it sounds like more.' }
          ] }
      ],
      endings: {
        win: { title: 'Booked', text: 'Lynn is on the run. You have a name for the next door, and you never once sounded like you were selling.' },
        mid: { title: '"Send me the details"', text: 'She liked you, but the guard never fully dropped. Look back at where you told instead of showed.' },
        lose: { title: 'Door closed', text: 'Too much, too fast. Run it again and let her talk in the first ten seconds.' }
      }
    },
    {
      id: 'guy', title: '"We\'ve got a guy"', level: 'Front-half pushback', strategy: 'any',
      blurb: 'Three brush-offs before there is a price, then a request for your card.',
      based: 'Nick and Valentina', guard: 70, win: 45,
      nodes: [
        { stage: 'door', them: "(Door opens a crack.) I'm good. What's up?",
          choices: [
            { v: 'best', g: -8, t: "My name's {me}. // Have you seen us on {street} at all?", reply: "What are you talking about?", c: 'First name, no company, and a question she did not expect. She is curious now, which beats defensive.' },
            { v: 'miss', g: 15, t: "I won't take much of your time. We're offering discounted {short}s in your area today.", reply: "No, thank you.", c: '"I won\'t take much of your time" is what every salesman says. Her guard was up before you finished.' },
            { v: 'ok', g: 4, t: "Sorry to bother you! Have you got a minute?", reply: "Not really.", c: 'An apology and a yes or no question. You gave her the easy way out.' }
          ] },
        { stage: 'pain', them: "What is it you're doing?",
          choices: [
            { v: 'best', g: -10, t: "I'll show you // you want to take two steps? {what} {show}", reply: "(She takes one step out.) I have a housekeeper for that.", c: 'She only came one step. That still gets her hand off the door.' },
            { v: 'ok', g: 4, t: "We do {short}s. {whole}.", reply: "I have a housekeeper for that.", c: 'Fine, but said through a doorway. Nothing for her to look at.' },
            { v: 'miss', g: 12, t: "Exterior cleaning. Can I ask who does yours at the moment?", reply: "I have someone. I'm all set.", c: 'You invited the objection and got it.' }
          ] },
        { stage: 'pain', obj: 'front', them: "I have a housekeeper. I'm all set.",
          choices: [
            { v: 'best', g: -10, t: "Most people have the housekeeper. // We just do the outside by hand, {fiddly}. I'll take thirty seconds and at least let you know.", reply: "I think I'm okay.", c: 'Agree, one tiny reason, back to the price. You did not argue the housekeeper.' },
            { v: 'miss', g: 14, t: "With respect, a housekeeper won't do {fiddly} properly. That needs the right gear.", reply: "I said I'm all set.", c: 'You fought a smokescreen with logic and insulted her housekeeper on the way.' },
            { v: 'ok', g: 6, t: "No worries. Can I leave you a card?", reply: "Sure. (She will never ring.)", c: 'You believed it. The coach: "zero percent chance of closing that deal".' }
          ] },
        { stage: 'pain', obj: 'front', them: "I think I'm okay.",
          choices: [
            { v: 'best', g: -12, t: "Got my runners on. // I'll take a quick look and meet you back here.", reply: "(She laughs.) …Okay. Quickly.", c: 'Light, moving, and asking for nothing but half a minute. A "think" is not a "no". If she had said "no, please go", you would go.' },
            { v: 'miss', g: 20, t: "Honestly, it'll be the best price you'll get all year. You'd be mad not to at least hear it.", reply: "No. Thank you. (Door closing.)", c: 'Pressure. That is the one thing a front-half loop must never carry.' },
            { v: 'ok', g: -2, t: "Would it be alright if I just had a quick look?", reply: "…I suppose.", c: 'It got you there, but asking permission gives her one more chance to say no.' }
          ] },
        { stage: 'pain', them: "(You are back.) So? What would it cost to do it once?",
          choices: [
            { v: 'best', g: -10, t: "{stackLine} // Normally ${callout}. {reasonLong}, it comes down to ${price}.", reply: "Do you have a card?", c: 'She asked for the price and still got the stack first. The number arrived with its reason.' },
            { v: 'ok', g: 0, t: "${price}, and that's with ${saving} off.", reply: "Do you have a card?", c: 'Right number, but no parts, so the price has nothing to sit beside.' },
            { v: 'miss', g: 10, t: "What were you hoping to pay?", reply: "I wasn't hoping to pay anything. Do you have a card?", c: 'You asked her to negotiate before you made an offer.' }
          ] },
        { stage: 'pain', obj: 'back', them: "Put your card in the letterbox. I'll call you in a couple of hours.",
          choices: [
            { v: 'best', g: -16, t: "I'll get you my number. // If I can save you the couple of hours: you'd be my last spot on the run. Leave us a review after and I'll call it ${deal}.", reply: "(A pause.) …Oh, fine. I'll do it.", c: 'A card is "I don\'t know". You gave her certainty: a reason, a better number and a decision she could make now.' },
            { v: 'ok', g: 4, t: "Is it the price, or the timing?", reply: "I just need to think.", c: 'The right question. You still need the next move: a reason and one adjustment.' },
            { v: 'miss', g: 8, t: "No problem at all. I'll pop one in the letterbox.", reply: "Thank you. Bye.", c: 'She was neutral, not sold and not unsold, and you let her go home that way.' }
          ] }
      ],
      endings: {
        win: { title: 'Booked at ${deal}', text: 'Three brush-offs and a card request, and she booked. You never argued and you only went back for the price.' },
        mid: { title: 'Card in the letterbox', text: 'You got to a price, which is the job. The last step is refusing to believe "I\'ll call you".' },
        lose: { title: 'Door closed', text: 'The loops only work when they are light. Humour and thirty seconds. Never pressure.' }
      }
    },
    {
      id: 'neighbour', title: 'Next door to the job', level: 'Job on the street', strategy: 'anchor',
      blurb: 'You are booked next door. They like the price, and then they tell you they are going away.',
      based: 'Drew, Nick and Jim\'s neighbours', guard: 50, win: 38,
      nodes: [
        { stage: 'door', them: "(A couple, pulling into the driveway.) Howdy.",
          choices: [
            { v: 'best', g: -10, t: "Hello, hello. How's your day been? // My name's {me}. Do you know {neighbour}?", reply: "Yeah, we know them. Why's that?", c: 'One name, then a pause. They asked why. Drew said the whole pitch in one breath here.' },
            { v: 'ok', g: 2, t: "Hi! We're doing {neighbour} and taking ${saving} off for neighbours. I can count it up and give you that rate.", reply: "Where are you from?", c: 'All correct, and all at once. They had to ask who you even are.' },
            { v: 'miss', g: 14, t: "Hi folks, quick one. We've done most of the street already.", reply: "Have you? Who?", c: 'If it is not true, do not say it. One real name beats ten vague ones, and they will check.' }
          ] },
        { stage: 'pain', them: "And what are you doing for them?",
          choices: [
            { v: 'best', g: -12, t: "I'll show you on yours // {show} Same thing at theirs on {runDay}. I'll {count} and give you the neighbour price.", reply: "(They look at it.) You do the screens? …Okay.", c: 'Shown on their own house, then the assumptive price.' },
            { v: 'ok', g: 0, t: "A full {short}. I can do you a quote if you like?", reply: "Do you want a quote, honey?", c: 'A yes or no question, so now they are consulting each other about whether to let you look.' },
            { v: 'miss', g: 10, t: "Everything. Honestly it's the best value on the street.", reply: "Right.", c: 'A claim with nothing to look at.' }
          ] },
        { stage: 'pain', them: "(You are back with the count.) We're actually away from tomorrow, just so you know.",
          choices: [
            { v: 'best', g: -12, t: "That's fine, it's all outside. You don't need to be home. // I'll text you photos when it's done, you check it when you're back, and there's nothing to pay till then.", reply: "Oh. That's easy.", c: 'The coach told Drew to pre-handle this before the price: "So you guys will just come home to a clean house."' },
            { v: 'miss', g: 10, t: "No worries, when are you back? I could do the week after instead.", reply: "We'll give you a call when we're back.", c: 'You put a later date on the table and they took it. The coach: "If you give them the option out of the gate, you lose the sale in the moment."' },
            { v: 'ok', g: 2, t: "Ah, okay. Well, let me give you the price anyway.", reply: "Sure.", c: 'You kept going, which is right. The objection is still sitting there unanswered.' }
          ] },
        { stage: 'pain', them: "So what is it?",
          choices: [
            { v: 'best', g: -10, t: "{stackLine} // Normally ${callout}. Because we're already here for {neighbour}, it's ${price} for the lot.", reply: "It won't be this week. Can we call you when we're back?", c: 'Stack, anchor, reason, number. And they still reach for the later date.' },
            { v: 'ok', g: 2, t: "${price} for everything, with the neighbour discount.", reply: "Okay. Can we call you when we're back?", c: 'Right price, thin presentation.' },
            { v: 'miss', g: 8, t: "${price}, or I can do next Wednesday if that's easier.", reply: "Yeah, we'll look at next Wednesday. We'll call you.", c: 'The offer and the exit in the same sentence.' }
          ] },
        { stage: 'pain', obj: 'back', them: "Can we just call you when we're back?",
          choices: [
            { v: 'best', g: -14, t: "You totally could. // The only reason it's ${price} is that I'm next door on {runDay}. It's not a forever price. If we fit you in with them I'll call it ${deal}, and you pay when you've seen it.", reply: "…Do it for ${deal}.", c: 'Re-anchor, a reason, one move. This is the "small fix" the coach made to get Drew\'s third sale.' },
            { v: 'ok', g: 4, t: "Sure. What's the best number to text the quote to?", reply: "(They give it.) We'll be in touch.", c: 'A text is better than a card. It is still a maybe, and most maybes fade.' },
            { v: 'miss', g: 12, t: "I can't promise this price when you ring back.", reply: "Then we'll take our chances.", c: 'True, but said as a threat. Give the reason for the price and they will work it out themselves.' }
          ] }
      ],
      endings: {
        win: { title: 'Two on the same day', text: 'Both neighbours on one run. Next door you can say "we are doing the two houses beside you".' },
        mid: { title: '"We\'ll call you"', text: 'Swing back once the first job is locked: "We are doing both your neighbours now." That is how the coach closed it.' },
        lose: { title: 'Lost the moment', text: 'A later date is only for when the run is a definite no.' }
      }
    },
    {
      id: 'spouse', title: '"I\'d have to ask"', level: 'Back-half pushback', strategy: 'any',
      blurb: 'The price is out. Now it is the partner, the budget and "maybe in spring".',
      based: 'Gabe and Rob, Nick and the Christmas house', guard: 48, win: 38,
      nodes: [
        { stage: 'pain', obj: 'back', them: "(You have just said ${price}. He winces a little.) Have you got a card?",
          choices: [
            { v: 'best', g: -8, t: "They're in the ute. // Is it more the price, or the timing?", reply: "Bit of both. I'd have to ask my wife, she's flat out in there.", c: 'You saw the wince and asked about it. The coach: "I literally saw him grimace, so I knew I might need the discount."' },
            { v: 'miss', g: 10, t: "I could do ${deal}?", reply: "Oh. Uh. I'd have to ask my wife.", c: 'A price drop with no reason, before you knew the problem. That is what the coach called desperate.' },
            { v: 'ok', g: 4, t: "Sure, I'll grab you one.", reply: "Thanks. I'd have to ask my wife anyway.", c: 'A card is a polite ending. Ask one question before you fetch it.' }
          ] },
        { stage: 'pain', obj: 'back', them: "I'd have to ask my wife.",
          choices: [
            { v: 'best', g: -10, t: "Of course. Is she free for a sec? // I'd love to show her this bit, it'll take thirty seconds.", reply: "She's up to her elbows in dishes. Not this time, mate.", c: 'Try to get both of them to the problem. It did not work here, and it was the right thing to try.' },
            { v: 'ok', g: 0, t: "If I did a bit better on the price, is it a yes? Or is it genuinely one to run past her?", reply: "I'd still have to ask.", c: 'Gabe\'s question. It tells you if the partner is real. Here it is.' },
            { v: 'miss', g: 14, t: "Surely you can make a call on ${price} yourself?", reply: "Excuse me?", c: 'You made it about his standing in his own house.' }
          ] },
        { stage: 'pain', obj: 'back', them: "Not this time. I usually do it myself anyway.",
          choices: [
            { v: 'best', g: -14, t: "I hear you. // It does need doing, though, and you'd be my last spot on the run. If you two could leave us a review after, I'll call it ${deal} and throw in {throwIn}.", reply: "(He looks at it again.) …${deal}. Alright. Go on.", c: 'Reason, number, sweetener. It reads as a solution to his problem, not a trick. The coach\'s exact close at the Christmas house.' },
            { v: 'ok', g: 6, t: "No worries. What about in the spring?", reply: "Yeah, spring. Call me then.", c: 'You offered the exit yourself.' },
            { v: 'miss', g: 12, t: "What about ${deal}? …${floor}?", reply: "Mate, I said no.", c: 'Two drops in one breath. The coach to Gabe: "Pants, undergarments, all of them off."' }
          ] },
        { stage: 'shake', them: "So when would you be here?",
          choices: [
            { v: 'best', g: -6, t: "{runDay}. Morning or arvo? // I'm {me}, by the way. What was your name?", reply: "Rob. Arvo's good.", c: 'Logistics and the name. Then put it in writing, with the ten-business-day line.' },
            { v: 'ok', g: 0, t: "{runDay}. I'll text you the details.", reply: "Righto.", c: 'Booked. You forgot the name, and that is the bit you need for the next door.' },
            { v: 'miss', g: 8, t: "I could start right now if you want and you can pay me after?", reply: "Now? No, no.", c: 'In Queensland a door-knocked job over $100 cannot start or be paid for inside the ten-business-day cooling-off. The decision is today. The work is on the run day.' }
          ] }
      ],
      endings: {
        win: { title: 'Booked at ${deal}', text: 'You only moved the price when it was the difference between a sale and no sale, and you gave a reason.' },
        mid: { title: '"Call me in spring"', text: 'Get his number, text the quote, and knock again when you have booked a neighbour.' },
        lose: { title: 'Walked away', text: 'Price drops without a reason cost you the status you built at the surface.' }
      }
    },
    {
      id: 'readno', title: 'Read the no', level: 'Judgement', strategy: 'any',
      blurb: 'Three doors where the right move is to stop. The job is to tell a smokescreen from a real no.',
      based: 'Nick: the old bloke, the no-soliciting sign, Alisa', guard: 60, win: 60, independent: true,
      nodes: [
        { stage: 'door', them: "(Second time he has said it.) I'm in the middle of something. Please, let me go.",
          choices: [
            { v: 'best', g: -10, t: "You're free to go whenever. // Have a fantastic day.", reply: "Thank you.", c: 'The coach said exactly this and walked. A second, plain request to leave is a real no, and in Queensland you must go and not call back for 30 days.' },
            { v: 'miss', g: 25, t: "Thirty seconds, I promise. You won't regret it.", reply: "I asked you to leave.", c: 'This is where persistence turns into a complaint about Stride on the street Facebook group.' },
            { v: 'ok', g: 0, t: "No worries. Can I leave a flyer?", reply: "No.", c: 'He asked to be let go. Just go, warmly.' }
          ] },
        { stage: 'door', them: "(A sticker by the bell: DO NOT KNOCK.)",
          choices: [
            { v: 'best', g: -10, t: "Skip the house.", reply: "(You walk on.)", c: 'The sign is the homeowner asking you to leave before you arrive. The coach knocked one in his video and got "I don\'t appreciate the interruption". Here it also breaks the law.' },
            { v: 'miss', g: 25, t: "Knock anyway. You're a friendly local, not a salesman.", reply: "Can you not read?", c: 'She was right to be cross. Walk past every one of these.' },
            { v: 'ok', g: 5, t: "Pop a flyer in the letterbox instead.", reply: "(Probably fine.)", c: 'Check the letterbox too. If it says no junk mail, the answer is the same.' }
          ] },
        { stage: 'pain', them: "Our guy does the whole house for $175. He's a mate. They just had a baby. I can't take the job off him.",
          choices: [
            { v: 'best', g: -10, t: "Fair enough, I wouldn't either. // I'll text you my number for next time. What was your name?", reply: "Alisa. You're doing a great job, by the way.", c: 'You asked "is there a price where it makes sense?", she said probably not, and you believed it. Name, number, smile, next door.' },
            { v: 'miss', g: 20, t: "I'll match the $175 and do a better job than he will.", reply: "I just told you I can't.", c: 'She gave you a reason that has nothing to do with money. Beating the price asks her to let a mate down.' },
            { v: 'ok', g: 2, t: "No worries. Have a good one.", reply: "You too.", c: 'Right call, but you left the name behind. A warm no with a name is a job in spring.' }
          ] }
      ],
      endings: {
        win: { title: 'Good judgement', text: 'A reason gets one light loop. A refusal gets a thank-you. Telling them apart protects Stride\'s name on every street.' },
        mid: { title: 'Mostly right', text: 'When in doubt, leave warm. The next door is ten metres away.' },
        lose: { title: 'Too pushy', text: 'Being pleasantly persistent stops at the first clear no.' }
      }
    }
  ];

  /* Film room: what the coach said about each door. */
  var film = [
    {
      id: 'breakdowns', title: 'Three doors, broken down', sub: 'The coach reviews Blake, the Duo and one of his own',
      reps: [
        { who: 'Blake', result: 'Booked · $200', win: true,
          line: "\"Do you know Gracie by any chance? There's also a Joyce, there's a Sashi…\"",
          good: ['High, confident energy. Came across as a hard-working local kid.', 'Said "I\'ll run around and give you a quick price", then nodded and turned his feet before the homeowner answered.'],
          cost: ['The front half was one long pitch with no pauses, so the jokes did not land.', 'Stood ten feet back while the homeowner held the door. He talked about the idea of clean windows with nothing to look at.', 'Held eye contact right through the price, which is pressure.'],
          fix: 'Make it back and forth, slow down, pull them to the window on the front half too, and look at the glass when you say the number.' },
        { who: 'Dylan, Pitch Perfect Duo', result: 'Booked · $299', win: true,
          line: "\"Is it more like the service, or my haircut, that's kind of throwing you off?\"",
          good: ['Looped back after "no thanks" with a joke. Her guard dropped and she said "oh, okay".', 'Asked for twenty seconds, which is a small thing to agree to.'],
          cost: ['Went straight into the pitch: who, what and the discount inside the first breath.', 'Both halves happened at the door. No showing, no shared problem.'],
          fix: 'Nothing about who you are or what you do for the first seven seconds. Present at the dirtiest window. The coach reckons the same customer pays $500 or more out there.' },
        { who: 'Nick (the coach)', result: 'Booked · $249, down from $349', win: true,
          line: "\"Got my running shoes on. I'll take a quick look, I'll meet you back here.\"",
          good: ['Short lines and questions, so it was a real back and forth.', '"You want to take two steps?" She only came part way, and that was enough.', 'Treated "I\'m all set" and "I have a housekeeper" as smokescreens and went back for the price each time.', 'Broke the window into glass, frames, sills and the little ledges, so $349 looked small.', 'On "let me think about it": a reason, then a better price. "God, I\'ll do it."'],
          cost: [],
          fix: 'This is the model door. Listen for how little he says each time he speaks.' }
      ]
    },
    {
      id: 'drew', title: 'An afternoon with Drew', sub: 'Three sales, $725, just under an hour',
      reps: [
        { who: 'Nick and the home seller', result: 'No sale', win: false,
          line: "\"I've done a few of these builds, I think I know roughly.\"",
          good: ['She would not let him count, so he priced it from the front and still got an offer on the table.', 'Left on "it was a pleasure meeting you".'],
          cost: ['His own review: "I feel like I could have slowed down a little bit there."'],
          fix: 'Even the coach rushes. Give yourself one note after every door.' },
        { who: 'Nick and the old bloke', result: 'Walked away', win: false,
          line: "\"You're free to go whenever. I'm just having a conversation. Have a fantastic day, sir.\"",
          good: ['The man asked to be let go. He let him go, warmly.'],
          cost: [],
          fix: 'Staying detached from the outcome is a skill, and you can practise it.' },
        { who: 'Drew and the ice cream', result: 'No sale', win: false,
          line: "\"I think it's the heat of the day, and I'm busy eating ice cream.\"",
          good: ['Opened with a compliment about the garden.'],
          cost: ['Moved into the pitch while the homeowner was still talking.', 'Took "I\'m busy" as the end of it.'],
          fix: '"That\'s why we\'re here. You eat the ice cream, I\'ll be thirty seconds and meet you back here."' },
        { who: 'Drew and the couple leaving town', result: 'Booked · $200', win: true,
          line: "\"One last Hail Mary… I'd love to do it all for 200 bucks flat.\"",
          good: ['When "not today" came, he did not debate dates. He went back in with a reason and a better price.', 'The coach added the guarantee line: you do not pay until you have walked round.'],
          cost: ['"A lot of talking at him rather than it being back and forth."', 'Forgot to get the name, so there was nothing to drop at the next door.'],
          fix: 'Get the name every time. It is what you open the next door with.' },
        { who: 'Drew and Jim\'s neighbours', result: 'Stalled, then booked · $225', win: true,
          line: "\"…or I'm wide open next week. I could throw you on for Wednesday.\"",
          good: ['Popped the screens out and showed the process at the window.'],
          cost: ['Offered next Wednesday while this run was still possible. They said "we\'ll call you".'],
          fix: 'The coach swung back later: "We are doing Pat next door too. To fit you in with them we would take off fifty." Closed. A later date only goes on the table when the run is a definite no.' },
        { who: 'Nick and Pat', result: 'Booked · $299', win: true,
          line: "\"Do you know Jim, two houses down? We're helping him.\"",
          good: ['Used the fresh booking as proof straight away.', 'Glass, frames, sills, tracks. Then call-out price, reason, run price, guarantee.'],
          cost: [],
          fix: 'The first sale on a street is 5 to 10 percent. With a name to drop it is 20 to 40.' }
      ]
    },
    {
      id: 'gabe', title: 'Live training with Gabe', sub: 'Six conversations, three jobs, $749',
      reps: [
        { who: 'Gabe and Lynn', result: 'Booked · $299', win: true,
          line: "\"Oh, that's just the exterior.\"",
          good: ['The words were all there and she had no pushback.'],
          cost: ['Too fast: "It is a conversation, not talking at her."', '"Just the exterior" shrank his own offer.'],
          fix: 'Slow down and think as you talk. And say "that\'s all the exteriors".' },
        { who: 'Nick and John', result: 'No sale', win: false,
          line: "\"What's your name? … John. I'm Nick. Nice to meet you.\"",
          good: ['John\'s wife does the windows. He still looked at the frames with him and got a price out.', 'Name, handshake, "flag us down Tuesday".'],
          cost: [],
          fix: '"They cannot buy if they do not know what we are doing and how much it is."' },
        { who: 'Nick and Alisa', result: 'No sale', win: false,
          line: "\"Is there a price where it would make sense for you?\"",
          good: ['Asked about her guy, then "any percentage chance?", then the price question.', 'When the reason turned out to be loyalty to a mate with a newborn, he stopped.'],
          cost: [],
          fix: 'Some doors are not winnable today. He left with her number and a job for the spring.' },
        { who: 'Gabe and Rob', result: 'No sale', win: false,
          line: "\"I'll take another 50 bucks off. 25. Let us earn your business.\"",
          good: ['Got round the back and gave a clear price with the guarantee.'],
          cost: ['Dropped the price twice in one breath, with no reason.'],
          fix: '"Is it kind of the price, or the value? … We only have one spot left anyway. Why don\'t we call it 149 and make it look awesome for you."' },
        { who: 'Nick and the Christmas house', result: 'Booked · $199', win: true,
          line: "\"If you guys could leave an awesome review once we're done, I could call it 199.\"",
          good: ['Saw the husband wince at $349 and knew a discount might be needed.', 'Tried to bring the wife out to see it.', 'One drop, with a reason and a thrown-in front porch.'],
          cost: [],
          fix: 'Discount only when it is the difference between a sale and no sale.' },
        { who: 'Gabe\'s comeback', result: 'Booked · $249', win: true,
          line: "\"We're helping Tom across the street now as well. We have just one open spot.\"",
          good: ['Went back to an earlier "I have to think about it" with a new neighbour booked.', 'Gave a reason, one adjustment, and asked "would that make it a no-brainer?"'],
          cost: [],
          fix: 'Comebacks work. Every new booking on a street is a reason to knock an old maybe again.' },
        { who: 'The woman who walked out', result: 'Booked · $300', win: true,
          line: "\"Speaking of windows… would you have any interest?\"",
          good: ['She came out to see why they were filming. He asked.', 'Traded free screens for a review. A barter kept the price intact.'],
          cost: [],
          fix: 'Talk to everybody.' }
      ]
    }
  ];

  var rules = [
    { t: 'People like to buy. They hate being sold.', d: 'Most lost doors are lost to self-defence. Wrong words lose far fewer. The coach reckons 70 to 80 percent would say yes if they truly heard the offer.' },
    { t: 'Break the pattern.', d: 'For seven seconds, say nothing a salesman would say. Then your first name and a question. No company, no service, no offer.' },
    { t: 'A conversation has gaps.', d: 'Short lines. Pauses. Your voice going up and down. A filler word or two so you sound human.' },
    { t: 'Get them off the door.', d: 'Two steps to the dirt. It becomes you and them against the problem.' },
    { t: 'Front half: go for the price, not the sale.', d: 'You cannot sell until there is a number. Every front-half move is about getting to the count.' },
    { t: 'Before the price, go past the objection.', d: 'It is a smokescreen. Disarm, one small reason, shrink the ask, move. Never argue it.' },
    { t: 'Break the job into its parts.', d: 'Name every part and the price looks small beside the work.' },
    { t: 'Every discount needs a reason.', d: 'On the street already, last spot on the run, a review. No reason looks desperate.' },
    { t: 'After the price, guide them to a decision.', d: '"I don\'t know" is a no. Stay in it, find the real hesitation, give a reason, make one move, ask.' },
    { t: 'Do the job, not the outcome.', d: 'Take each person as far as they will comfortably go, leave with a name, carry the mood to the next door.' }
  ];

  /* The pattern he breaks. Left: what a homeowner expects from a salesman. Right: what the coach does. */
  var patterns = [
    ['A rehearsed "Hi there, how are you today?"', '"Hello, hello." Then a remark about whatever just happened: "You were ready for me!"'],
    ['"Good thanks, and yourself?"', '"I\'m living the dream."'],
    ['Name, company and service in one breath', 'First name only, then a question: "Have you seen me on Waterfront the past couple of days?"'],
    ['A reason for calling, delivered straight away', '"I don\'t know, I was just popping over."'],
    ['Polished and word-perfect', '"Just a dude." Filler words, "kind of", thinking as he talks.'],
    ['Stands at the door and talks', '"You want to take two steps?" He walks to the window.'],
    ['"Would you like a free quote?" and waits', '"I\'ll take a quick look, just so you know." He is already walking.'],
    ['Argues the objection, or gives up', '"Most people have a guy." Or a joke: "Is it the service, or the haircut?"'],
    ['Stares at you waiting for a yes', 'Says the price looking at the window.']
  ];

  /* What this method is built from. Add to it as more of his videos are transcribed. */
  var sources = [
    ['Three live doors, broken down', 'The coach reviews Blake, the Pitch Perfect Duo and one of his own sales.'],
    ['An afternoon knocking with Drew', 'Three sales and $725 in under an hour, coached door by door.'],
    ['Live door-to-door training with Gabe', 'Six conversations, three jobs, feedback after every door.']
  ];

  var cues = [
    'A dog barking behind the screen door', 'A garden that someone clearly loves', 'A boat on a trailer in the driveway',
    'Kids\' bikes dumped on the lawn', 'They are mid-way through washing the car', 'A caravan under a cover',
    'Wind chimes and a very tidy porch', 'They opened the door before you knocked', 'A Broncos flag in the window',
    'They are carrying shopping in', 'A brand new letterbox', 'Someone up a ladder hanging lights'
  ];

  var qld = {
    intro: 'The coach works in the US. Door-knocking in Queensland falls under the Australian Consumer Law rules for unsolicited sales. This is a plain summary from the ACCC and Queensland Government pages, not legal advice. Check the detail with the Office of Fair Trading before your first run.',
    points: [
      ['Hours', 'Knock 9am to 6pm on weekdays and 9am to 5pm on Saturdays. No Sundays, no public holidays.'],
      ['Say who you are', 'You must tell them your name, the business and why you are there before you start selling. The coach never names his company at the door. The coach never names his company at the door, and this script follows him, so it does not either. If you want to cover the rule, wear the Stride shirt, and you can switch on a "We are from Stride" line in Settings.'],
      ['Leave when asked', 'If they ask you to go, go, and do not call back for 30 days. A Do Not Knock sticker counts. So: one light loop on a reason, none on a refusal.'],
      ['Over $100: put it in writing', 'A door-knocked job over $100 needs a written agreement and a 10-business-day cooling-off notice.'],
      ['No work or money in the cooling-off', 'You cannot start the job or take payment, deposit included, until those ten business days are up. So the decision is made today and the work happens on the run day.'],
      ['Prices and names must be real', 'The call-out price has to be what you really charge for a one-off. Only name neighbours you have actually booked.']
    ],
    links: [
      ['Queensland Government: rules door-to-door salespeople must follow', 'https://www.qld.gov.au/law/your-rights/consumer-rights-complaints-and-scams/buying-products-and-services/understanding-sales-practices/rules-door-to-door-salespeople-must-follow'],
      ['ACCC: door-to-door and telemarketing sales, for businesses', 'https://www.accc.gov.au/business/advertising-promoting-your-business/door-to-door-telemarketing-sales']
    ]
  };

  window.DC = window.DC || {};
  window.DC.content = { sources: sources, playbook: playbook, services: services, strategies: strategies, beats: beats, patterns: patterns, process: process, objections: objections,
    scenarios: scenarios, film: film, rules: rules, cues: cues, qld: qld };
})();
