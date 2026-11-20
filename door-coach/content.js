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
      spot: 'the dirtiest window near the front door',
      show: "It's just this stuff here // the frames and the tracks, where all the dirt sits.",
      count: 'run round and count the windows',
      countTip: 'Count the panes. Note screens and any upper-level glass. Pick the worst window you can both stand at, close to the door.',
      stack: ['All the glass, by hand', 'Every frame, all the way round', 'The sills and the tracks', 'Screens out, washed, back in'],
      stackLine: "So we hand-clean all the glass // but also every frame, all the way round // the sills, the tracks down here // and the screens come out, get washed and go back in.",
      why: "If you only do the glass, the first bit of rain washes the dirt off the frames straight back down it.",
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
    }
  };

  var strategies = {
    anchor: {
      label: 'Job on the street',
      blurb: 'You have a booked job nearby. The neighbour is your proof and your reason for the price.',
      bridge: "I'm {me}, from Stride. // Have you seen us on {street} at all? We're doing {neighbour} on {runDay}.",
      reason: "we're already here for {neighbour}",
      reasonLong: "While we're already on {street} on {runDay} for {neighbour}",
      spots: "we've got room for two more on the day",
      coach: 'Real name, real day. "We are doing the Hendersons on Thursday" makes you a known figure on the street before you have said what you do.'
    },
    cold: {
      label: 'Cold street',
      blurb: 'No job here yet. You are building the first one, so the run itself is the reason.',
      bridge: "I'm {me}, from Stride. // Have you seen the ute on {street} at all today? We're lining up a run of homes here for {runDay}.",
      reason: "we're doing the street in one run",
      reasonLong: "Because we're doing {street} in one run on {runDay}",
      spots: "we're capping the run at five homes",
      coach: 'The first sale on a street is the hard one: the coach puts it at 5 to 10 percent. Once you have a name to drop it goes to 20, 30, even 40. So your only job here is to earn that first name.'
    }
  };

  /* The ten beats of the door. stage = what the 3D scene shows. */
  var beats = [
    {
      id: 'hello', half: 'front', title: 'Human first', time: 'First 7 seconds', stage: 'door',
      goal: 'Be a person who popped over. No pitch yet.',
      feel: 'This is just someone from down the road.',
      lines: [
        { who: 'you', t: "Hey, how are you going?" },
        { who: 'them', t: "Yeah, good thanks. You?" },
        { who: 'you', t: "Living the dream. // Is that the guard dog? He looks ferocious.", cue: 'React to one real thing' },
        { who: 'them', t: "Ha. He's all bark." }
      ],
      move: 'Two steps back from the door, side-on. Smile before you speak. Then stop and let them answer.',
      why: "Most lost sales are lost to sales resistance, and what you say has little to do with it. Every salesperson opens with who they are and what they sell, so the moment you do the same, their guard goes up before they have heard a word.",
      trap: "The Duo opened with \"Be quick with you, we were just helping your neighbour Julie\" in one breath. Same words the coach would use, but fired at her with no gap, so it landed as a pitch.",
      who: 'The coach, on the Pitch Perfect Duo',
      ways: [
        { by: 'Drew', name: 'The compliment', lines: [
          { who: 'you', t: "Hey, how are you going today?" },
          { who: 'them', t: "So far so good." },
          { who: 'you', t: "I had to stop and meet the expert gardener on the street.", cue: 'Only if the garden earns it' },
          { who: 'them', t: "Ha, I wish." }
        ], note: 'Works when it is true and you wait for the laugh. The coach\'s note to Drew: he was still talking when you moved on. Let it land.' },
        { by: 'Nick', name: 'The goofy one', lines: [
          { who: 'you', t: "Oh! // You were ready for me. Sorry, didn't mean to startle you." },
          { who: 'them', t: "That's alright." },
          { who: 'you', t: "How's your day going?" },
          { who: 'them', t: "Not bad." }
        ], note: '"Just a dude." A bit unsure of where he is, like he spawned out of nowhere. Nothing rehearsed about it.' },
        { by: 'Nick', name: 'For a quieter homeowner', lines: [
          { who: 'you', t: "Afternoon. // How are you?" },
          { who: 'them', t: "Fine." },
          { who: 'you', t: "Good to hear. // Nice spot you've got here." },
          { who: 'them', t: "Thanks." }
        ], note: 'Meet people where they are. Big energy at a calm older bloke reads as a salesman. Drop your pace to theirs.' }
      ]
    },
    {
      id: 'bridge', half: 'front', title: 'Who you are, as a question', time: '7 to 15 seconds', stage: 'door',
      goal: 'Say who you are and why you are here, and hand it straight back.',
      feel: 'Oh, these are the people working on my street.',
      lines: [
        { who: 'you', t: '{bridge}' },
        { who: 'them', t: "No, I haven't. What are you doing?" }
      ],
      move: 'Ask it, then wait. Their "what are you doing?" is the invitation you want.',
      why: "A question makes it a conversation. \"Have you seen us?\" also frames you as someone already working on the street. In Queensland you must give your name, your business and your reason for calling before any price talk, so this beat carries that too.",
      trap: "Blake listed three neighbours, the service, a joke and a discount without one pause. The coach: \"one big run-on sentence of information.\"",
      who: 'The coach, on Blake',
      strategyNote: true,
      ways: [
        { by: 'Blake', name: 'Do you know…?', only: 'anchor', lines: [
          { who: 'you', t: "I'm {me}, from Stride. // Do you know {neighbour}, by any chance?" },
          { who: 'them', t: "Yeah, we know them." },
          { who: 'you', t: "We're helping them out on {runDay}." }
        ], note: 'Blake\'s name-drop works. Say one name, then wait for the nod. He lost the effect by listing three names and carrying straight on.' },
        { by: 'Gabe', name: 'Just popping by', lines: [
          { who: 'you', t: "I was just popping by. I'm {me}, from Stride // we're down the road helping a few of the neighbours." },
          { who: 'them', t: "Oh yeah? With what?" }
        ], note: 'Fine words. The coach\'s one note to Gabe: slow down. "It is a conversation, you are not talking at her."' },
        { by: 'Nick', name: 'They have seen you', lines: [
          { who: 'you', t: "I'm {me}. // Have you seen us on {street} the last couple of days?" },
          { who: 'them', t: "Yeah, I have actually." },
          { who: 'you', t: "You have! // That's us, from Stride. I'll show you what we've been doing." }
        ], note: 'When they say yes, be pleased about it. Then go straight to showing them.' }
      ]
    },
    {
      id: 'steps', half: 'front', title: 'Two steps to the problem', time: '15 to 25 seconds', stage: 'pain',
      goal: 'Get them off the door and standing at the dirt.',
      feel: 'Huh. I had stopped noticing that.',
      lines: [
        { who: 'you', t: "I can show you, actually, if you want to take two steps." },
        { who: 'move', t: 'Walk to {spot}. Look at it, not at them.' },
        { who: 'you', t: '{show}' },
        { who: 'them', t: "Yeah… it has got pretty bad." }
      ],
      move: 'Start walking as you say it. Most people follow. If they only come one step, that still gets them off the door handle.',
      why: "At the door it is you against the homeowner, and they can close it in two seconds. At the problem it is the two of you against the dirt. Showing beats telling: once they see it, it becomes a problem they did not have a minute ago.",
      trap: "Blake stood ten feet back talking about \"the idea of window cleaning\" while the homeowner kept a hand on the door. The Duo ran both halves at the door, \"the absolute worst place for a sales conversation\".",
      who: 'The coach, on Blake and the Duo',
      ways: [
        { by: 'Nick', name: 'Spot it before you knock', lines: [
          { who: 'you', t: "I'll show you // it's just this one here." },
          { who: 'move', t: 'You picked the spot from the footpath. Walk straight to it.' },
          { who: 'you', t: '{show}' }
        ], note: 'Walking up, the coach already clocks the dirtiest window: "Rather than pitching them at the door, I am going to try to get them outside."' }
      ]
    },
    {
      id: 'quick', half: 'front', title: 'Go for the price', time: '25 to 40 seconds', stage: 'pain',
      goal: 'Get to the next step. You are after the price here. The sale comes later.',
      feel: 'No harm in knowing what it costs.',
      lines: [
        { who: 'you', t: "{reasonLong}, we take ${saving} off each home." },
        { who: 'you', t: "I'll {count} and give you a quick price, just so you know. // Thirty seconds, I'll meet you back here." },
        { who: 'move', t: 'Nod. Turn your feet. Start walking before they answer.' },
        { who: 'them', t: "Yeah, okay.", easy: true }
      ],
      move: 'Say it as something you do for everyone. It should not sound like a question.',
      why: "\"Do you want a quote?\" is a yes or no question from a stranger, and the safe answer is always no. \"I'll give you a quick price, just so you know\" is a courtesy. Now they have to go out of their way to stop you, and most people will not.",
      trap: "Asking, then standing there looking at them, waiting. The coach's praise for Blake was exactly this: he nodded and turned his feet before the homeowner could respond.",
      who: 'The coach, on Blake',
      ways: [
        { by: 'Nick', name: 'They will not let you look', lines: [
          { who: 'you', t: "I'll tell you what // I've done a few of these builds, so I know roughly." },
          { who: 'you', t: "Normally it's about ${callout} for a place like yours. On the run it comes down to ${price} for {whole}." }
        ], note: 'When someone will not let you walk round, the coach still puts a number on the table from the front. An offer they can say yes to beats no offer at all.' },
        { by: 'The Duo', name: 'Two of you', lines: [
          { who: 'you', t: "{partner}'ll run round and count it up while we chat. // Thirty seconds." },
          { who: 'them', t: "Okay." }
        ], note: 'The Duo split it: one opens, one counts and presents. If you knock in a pair, the opener keeps the conversation warm while the count happens.' }
      ]
    },
    {
      id: 'loop', half: 'front', title: 'If they brush you off', time: 'Only when needed', stage: 'door', guard: 0.75,
      goal: 'Go past the objection without answering it: disarm, one small reason, shrink the ask, move.',
      feel: 'Fine. Thirty seconds will not hurt.',
      process: 'front',
      lines: [
        { who: 'them', t: "We're right, thanks. We've got a guy." },
        { who: 'you', step: 'f1', t: "Most people do." },
        { who: 'you', step: 'f2', t: "{reasonCap}, so it's a fair bit cheaper." },
        { who: 'you', step: 'f3', t: "I'll take thirty seconds and at least let you know." },
        { who: 'you', step: 'f4', t: "Got my runners on. I'll meet you back here." },
        { who: 'move', t: 'Nod and go before they answer. You are asking for thirty seconds, nothing more.' }
      ],
      move: 'One light loop. If they give you a reason, answer it once. If they say no again or ask you to go, thank them and leave.',
      why: "There is no offer on the table yet, so this \"no\" has nothing to do with your price. The coach calls it a smokescreen: a reflex from someone who does not want to be sold. So do not argue with it. Agree, give a tiny reason, and go back for the price.",
      trap: "Believing it. \"If I take that at face value and stop there, there is a zero percent chance of closing that deal.\" The other trap is pushing a real no. When the old bloke said \"please let me go\", the coach said \"you're free to go whenever, have a fantastic day\" and walked.",
      who: 'The coach, on his own doors',
      ways: [
        { by: 'Dylan', name: 'The haircut', lines: [
          { who: 'them', t: "Um, actually, no thanks." },
          { who: 'you', step: 'f1', t: "Is it more the service, or the haircut that's putting you off?" },
          { who: 'them', t: "Ha! No, the haircut's fine." },
          { who: 'you', step: 'f3', t: "Twenty seconds. I'll let you know and get out of your hair." },
          { who: 'you', step: 'f2', t: "Bit of information never hurts." }
        ], note: 'A joke drops the guard, and then she said "oh, okay". The coach: "her saying no is not logical, it is just a bodily reaction."' },
        { by: 'Nick', name: 'Busy right now', lines: [
          { who: 'them', t: "I'm in the middle of something." },
          { who: 'you', step: 'f1', t: "No stress, you keep going." },
          { who: 'you', step: 'f2', t: "That's why we're here." },
          { who: 'you', step: 'f3', t: "I'll be thirty seconds." },
          { who: 'you', step: 'f4', t: "I'll meet you back here." }
        ], note: 'The coach\'s fix for Drew and the ice-cream bloke: turn the reason they cannot talk into the reason you will be quick.' },
        { by: 'Nick', name: 'Three in a row', lines: [
          { who: 'them', t: "I'm all set." },
          { who: 'you', step: 'f3', t: "I can at least take a quick look and give you my price, that way you know." },
          { who: 'them', t: "I have a housekeeper." },
          { who: 'you', step: 'f1', t: "Most people have the housekeeper." },
          { who: 'you', step: 'f2', t: "We just hand-clean the outside, {fiddly}." },
          { who: 'you', step: 'f3', t: "I can take thirty seconds and at least let you know." },
          { who: 'them', t: "I think I'm okay." },
          { who: 'you', step: 'f4', t: "Got my runners on. I'll take a quick look and meet you back here." }
        ], note: 'His own door with Valentina. Three brush-offs, and he never answers one of them. Each reply is shorter than the last, and every one points at the same small thing: thirty seconds and a price. A "think" is not a refusal. Had she said "no, please go", he would have gone.' }
      ]
    },
    {
      id: 'count', half: 'count', title: 'The count', time: '30 to 60 seconds, alone', stage: 'count',
      goal: 'Come back with a number, the worst example and one honest compliment.',
      feel: '(They are inside deciding you seem alright.)',
      lines: [
        { who: 'move', t: '{countTip}' },
        { who: 'move', t: 'Decide your call-out price and your run price before you walk back.' },
        { who: 'move', t: 'Find one thing you like out the back. You will open with it.' }
      ],
      move: 'Be as quick as you said you would be. Thirty seconds was a promise.',
      why: "You cannot sell anything until there is a price on the table. The whole front half only existed to earn this minute. Use it to find the spot where you will both stand for the back half.",
      trap: "Coming back to the door. If you present where you knocked, you are back to you against them.",
      who: 'The coach',
      ways: []
    },
    {
      id: 'back', half: 'back', title: 'Back at the problem', time: 'Re-entry', stage: 'pain',
      goal: 'Restart warm, and present at the dirt.',
      feel: 'He noticed the place. And he was quick.',
      lines: [
        { who: 'you', t: "Hello, hello. // I like the setup you've got out the back." },
        { who: 'them', t: "Oh, thanks. Took us a while." },
        { who: 'you', t: "I'll show you quick on this one here, it's a good example." },
        { who: 'move', t: 'Stand beside them, both facing {spot}.' }
      ],
      move: 'Shoulder to shoulder, facing the surface. Point with an open hand.',
      why: "Same reason as the front half, with more riding on it, because now you are making an offer. The coach reckons someone who would spend $400 at the door will spend $500 or more when they are looking straight at the problem.",
      trap: "The Duo gave the price at the door and still got $299. The coach's point is what that habit costs across fifty doors a day.",
      who: 'The coach, on the Duo',
      ways: []
    },
    {
      id: 'stack', half: 'back', title: 'Break it into parts', time: '15 seconds', stage: 'pain',
      goal: 'Make the job sound as big as it really is.',
      feel: 'They do all of that?',
      lines: [
        { who: 'you', t: '{stackLine}' },
        { who: 'you', t: '{why}' },
        { who: 'them', t: "Right. I didn't know that." }
      ],
      move: 'Touch or point at each part as you name it. One part per breath.',
      why: "If you say \"{noun}\", they picture the minimum. Name every part and the price that follows looks small next to the work. The coach names even the little ledges: \"it's like, oh my gosh, they're doing so much.\"",
      trap: "Shrinking your own offer. Gabe was asked \"is that inside too?\" and said \"that's just the exterior\". The coach's version: \"That's all the exteriors.\" Same fact, opposite feeling.",
      who: 'The coach, to Gabe',
      ways: []
    },
    {
      id: 'price', half: 'back', title: 'The price, with a reason', time: '10 seconds', stage: 'pain',
      goal: 'Call-out price, the reason it drops, the run price. Then stop talking.',
      feel: 'That is fair, and it will not be this price next month.',
      lines: [
        { who: 'you', t: "If you called us out for a one-off, it's normally ${callout}." },
        { who: 'you', t: "{reasonLong}, we take ${saving} off each home // so it comes down to just ${price} for {whole}." },
        { who: 'move', t: 'Say the number looking at the surface. Then say nothing.' },
        { who: 'you', t: "And when we're done, you and I walk round together and make sure you're happy. Nothing to pay until then." }
      ],
      move: 'Eyes on the dirt while you say the number. Count two seconds of quiet in your head.',
      why: "A discount with no reason looks desperate. One with a reason (we are already on your street) keeps your standing and makes the offer better. And staring at someone while you wait for an answer is pressure. Pressure brings the guard back up, and that leads to a no.",
      trap: "Blake held eye contact the whole way through the price. The coach: \"there is somebody making an offer and waiting for your response. Even if it is a reasonable offer, the pressure contributes to more self-defence.\"",
      who: 'The coach, on Blake',
      ways: [
        { by: 'Nick', name: 'Honest limit first', lines: [
          { who: 'you', t: "One thing before the price // {honestLine}" },
          { who: 'you', t: "Everything else comes up. Normally ${callout}, on the run it's ${price}." }
        ], note: 'Stride\'s own rule: say what will not come up before the price. It reads as straight, and it removes the argument afterwards.' }
      ]
    },
    {
      id: 'stall', half: 'back', title: 'If they stall on the price', time: 'Only when needed', stage: 'pain', guard: 0.5,
      goal: 'Guide them to a decision: stay in it, find the real hesitation, one reason, one move, ask.',
      feel: 'He is not pushing me. He is sorting it out for me.',
      process: 'back',
      lines: [
        { who: 'them', t: "Have you got a card? Let me think about it." },
        { who: 'you', step: 'b1', t: "They're in the ute." },
        { who: 'you', step: 'b2', t: "Is it more the price, or the timing?" },
        { who: 'them', t: "The price, a bit." },
        { who: 'you', step: 'b3', t: "Tell you what // you'd be my last spot on the run." },
        { who: 'you', step: 'b4', t: "If you could leave us a review when we're done, I'll call it ${deal} and throw in {throwIn}." },
        { who: 'you', step: 'b5', t: "Would that make it easy?" },
        { who: 'them', t: "…Yeah, alright. Go on." }
      ],
      move: 'Stay beside them, still facing the surface. Ask your one question, then wait for the answer.',
      why: "With a price on the table the hesitation can be real, so now you do ask about it. A card or \"I'll call you\" means \"I don't know\", and that never turns into a job later. So the coach stays, finds the real reason with one question, gives a reason for doing better, makes one move, and asks for the decision.",
      trap: "Gabe heard \"I'm pretty good\" and went straight to \"25 off, 50 off\" with no question and no reason. Drew offered \"next Wednesday\" while the run was still possible and got \"we'll call you\".",
      who: 'The coach, to Gabe and Drew',
      ways: [
        { by: 'Nick', name: 'They are away', lines: [
          { who: 'them', t: "We're away that week." },
          { who: 'you', step: 'b1', t: "That's fine, it's all outside. You don't need to be home." },
          { who: 'you', step: 'b4', t: "I'll text you photos when we're done and you check it when you're back. Nothing to pay till then." },
          { who: 'you', step: 'b5', t: "So I'll pop you on the run?" }
        ], note: 'A logistics problem, so he solves it and asks. He does not offer another date: "You never want to put that on the table until it is a 100 percent guaranteed no."' },
        { by: 'Nick', name: 'Call me in spring', lines: [
          { who: 'them', t: "Call me in the spring." },
          { who: 'you', step: 'b1', t: "I can do that." },
          { who: 'you', step: 'b3', t: "The only reason it's ${price} is that {reason} on {runDay}. It's not a forever price." },
          { who: 'you', step: 'b5', t: "Is it worth grabbing while we're here?" }
        ], note: 'The re-anchor. It reminds them why the price exists and turns "later" back into "do I want this, yes or no".' },
        { by: 'Nick', name: 'A real no', lines: [
          { who: 'them', t: "It's reasonable, but I don't need it." },
          { who: 'you', step: 'b1', t: "Fair enough." },
          { who: 'you', step: 'b2', t: "Is there a price where it would make sense for you?" },
          { who: 'them', t: "No. I just don't want it." },
          { who: 'you', step: 'out', t: "All good. // What was your name?" }
        ], note: 'Vinnie. One question found out it was a no at any price, in ten seconds. Name, handshake, next door.' }
      ]
    },
    {
      id: 'book', half: 'back', title: 'Book it and get the name', time: 'The close', stage: 'shake',
      goal: 'A decision today, a name, a number, and it in writing.',
      feel: 'Easy. And I can still change my mind.',
      lines: [
        { who: 'them', t: "Yeah, alright. Let's do it.", easy: true },
        { who: 'you', t: "Beautiful. // I'm {me}, by the way. What was your name?" },
        { who: 'them', t: "Sandra." },
        { who: 'you', t: "Sandra. // {runDay}, does morning or arvo suit you better?" },
        { who: 'you', t: "I'll pop it in writing for you now. You've got ten business days to change your mind, no charge, and nothing to pay until you've walked round with me." }
      ],
      move: 'Offer the handshake. Write the name down before you leave the driveway.',
      why: "The name is worth as much as the job. It is what you say at the next door. The coach's one regret on Drew's first sale: \"we definitely should have gotten the name.\" In Queensland the written agreement and the cooling-off line are the law for a door-knocked job over $100. Said plainly, they also take the risk out of saying yes.",
      trap: "Leaving a card. \"I don't know\" is as good as a no. People who are not sure with you standing there will not get sure on their own later.",
      who: 'The coach, on Drew',
      ways: [
        { by: 'Nick', name: 'Then the next thing', lines: [
          { who: 'you', t: '{link}' },
          { who: 'them', t: "Yeah, have a look." }
        ], note: 'The coach counts the first number as "pre-upsells". Once they have said yes, the next surface is an easy add.' }
      ]
    },
    {
      id: 'leave', half: 'back', title: 'Leave well, either way', time: 'Every door', stage: 'leave',
      goal: 'A name, a handshake and a good note to finish on.',
      feel: 'Nice bloke. I would wave him down.',
      lines: [
        { who: 'them', t: "It's a good price, but no. Not this time." },
        { who: 'you', t: "No worries at all. // What was your name?" },
        { who: 'them', t: "John." },
        { who: 'you', t: "John, I'm {me}. Good to meet you. // If you see us on {runDay}, flag us down." }
      ],
      move: 'Smile, shake, walk. Carry that into the next door.',
      why: "\"My only goal is to do my job: avoid sales patterns, take people as far through the process as I can, and give as many people as possible the chance to buy.\" A warm no lifts your state for the next door. Do that at every door and the coach reckons you close one in five.",
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

  /* Objection drills. stage: front (no offer yet) or back (price is out). */
  var objections = [
    { id: 'guy', stage: 'front', them: "We've got a guy who does it.",
      means: 'A reflex. There is no offer yet, so there is nothing to compare your guy with.',
      steps: [['f1', "Most people do."], ['f2', "{reasonCap}, so it's a fair bit cheaper."], ['f3', "I'll be thirty seconds, then at least you'll know."], ['f4', "Got my runners on. I'll meet you back here."]],
      why: 'The coach to Valentina: "Most people have the housekeeper." He never argues the guy. He goes back for the price.', by: 'Nick' },
    { id: 'guy2', stage: 'front', them: "Our guy's coming in a couple of weeks.",
      means: 'Could be real. Find out with a question before you decide.',
      steps: [['f1', "Nice. {guy}"], ['f2', "We're doing it pretty cheap on the run."], ['f3', "I'll count it up anyway. Any chance at all if the number's right?"], ['f4', "Got my runners on, back in thirty seconds."]],
      why: 'The coach asked Alisa "does he pressure wash, or how does he do it?" and then "do you think there is any percentage chance?" Being curious about their guy disarms better than competing with him.', by: 'Nick' },
    { id: 'done', stage: 'front', them: "We only did them a month ago.",
      means: 'They did part of it. The part nobody likes doing is probably still there.',
      steps: [['f1', "Oh, really? Good on you."], ['f2', "You can see it on {fiddly} though, that's the bit that gets missed."], ['f3', "I'll give you a quick price so you've got something to compare."], ['f4', "Thirty seconds, I'll meet you back here."]],
      why: 'John\'s wife did the glass. The coach pointed at the frames: "the dirt that is etched in, when it rains that drips back down." He showed him, then went for the price.', by: 'Nick' },
    { id: 'diy', stage: 'front', them: "I do it myself.",
      means: 'Pride, and often true. Respect it, then find the part they hate.',
      steps: [['f1', "Good on you. {diy}"], ['f2', "We're doing it pretty cheap on the run."], ['f3', "I'll count it up. If it's not worth it, no stress."], ['f4', "Back in thirty seconds."]],
      why: 'With Vinnie the coach asked "you do all the tall ones?" and let him explain. He still got to a price.', by: 'Nick' },
    { id: 'busy', stage: 'front', them: "I'm in the middle of dinner.",
      means: 'Probably true, and it is not a no.',
      steps: [['f1', "No stress, you keep going."], ['f2', "That's why we're here."], ['f3', "I'll be thirty seconds."], ['f4', "I'll meet you back here."]],
      why: 'Drew let the ice-cream bloke go. The coach: "That is why we are here. You eat the ice cream, I will be thirty seconds." Their reason becomes your reason.', by: 'The coach, to Drew' },
    { id: 'nothanks', stage: 'front', them: "Um, no thanks.",
      means: 'A flinch. You get one light go at it. A second no is a real no.',
      steps: [['f1', "Is it more the service, or the haircut?"], ['f3', "Twenty seconds. I'll let you know and get out of your hair."], ['f2', "Bit of information never hurts."]],
      why: 'Dylan\'s loop. It worked because it was funny and small: twenty seconds, not a clean. If they say no again, thank them and go.', by: 'Dylan' },
    { id: 'howmuch', stage: 'front', them: "How much is it?",
      means: 'Interest. Do not guess from the door if you can walk round.',
      steps: [['f2', "Depends on the house, I'd have to count it up."], ['f4', "Got my runners on, back in thirty seconds."]],
      why: 'A buying question on the front half is your ticket to the count. A number at the door skips the part where they see the problem.', by: 'Nick' },
    { id: 'leave', stage: 'front', them: "I said no. Please go.",
      means: 'A real no. So is a Do Not Knock sticker. There is no ladder for this one.',
      steps: [['out', "No worries at all. // Have a great day."]],
      why: 'The coach: "You are free to go whenever. Have a fantastic day, sir." In Queensland you must leave when asked and not call back for 30 days. It is also the brand: every street talks.', by: 'Nick', hard: true },
    { id: 'card', stage: 'back', them: "Have you got a card?",
      means: '"I don\'t know." And "I don\'t know" is a no, because nobody rings back.',
      steps: [['b1', "They're in the ute."], ['b2', "Is it more the price, or the timing?"], ['b3', "You'd be my last spot on the run."], ['b4', "Leave us a review after and I'll call it ${deal}."], ['b5', "Would that make it easy?"]],
      why: 'The coach: "If they do not have enough certainty with you right there in front of them, they are not going to develop it on their own time."', by: 'Nick' },
    { id: 'think', stage: 'back', them: "Let me think about it and I'll call you.",
      means: 'Neutral. Not sold, not unsold. They need one more reason.',
      steps: [['b1', "Totally."], ['b2', "What's the bit you're weighing up, the price or the day?"], ['b3', "Tell you what, you'd be my last spot on the run."], ['b4', "Leave us a review when we're done and I'll call it ${deal}, and throw in {throwIn}."], ['b5', "Would that make it easy?"]],
      why: 'Valentina went from "may I call you in a couple of hours" to "I\'ll do it". The discount had a reason, so it read as a solution and kept his standing.', by: 'Nick' },
    { id: 'spouse', stage: 'back', them: "I'd have to ask my husband.",
      means: 'Sometimes true, sometimes a soft exit. One question tells you which.',
      steps: [['b1', "Of course."], ['b2', "If I could do a bit better on the price, is it a yes? Or is it genuinely one to run past him?"], ['b3', "You'd be the last spot on the run."], ['b4', "I'll text you the quote at ${deal} so he can see it in writing."], ['b5', "What's the best number for you?"]],
      why: 'Gabe asked exactly this, got "I have to ask", texted the quote and moved on. He came back later with a new neighbour booked and closed it.', by: 'Gabe' },
    { id: 'price', stage: 'back', them: "That's more than I wanted to spend.",
      means: 'Price, or value? You do not know yet.',
      steps: [['b1', "Fair enough."], ['b2', "Is it the price, or is it more whether it needs doing?"], ['b3', "You'd be the last spot on the run."], ['b4', "Why don't we call it ${deal} and I'll make it look unreal for you."], ['b5', "Does {runDay} work?"]],
      why: 'Gabe jumped straight to "25 off, 50 off". The coach: "This guy is desperate." Ask first, give a reason, then one move.', by: 'The coach, to Gabe' },
    { id: 'notnow', stage: 'back', them: "We're away that week.",
      means: 'A logistics problem you can solve. Do not offer another date.',
      steps: [['b1', "That's fine, it's all outside. You don't need to be home."], ['b4', "I'll text you photos when we're done and you check it when you're back. Nothing to pay till then."], ['b5', "So I'll pop you on the run?"]],
      why: 'Drew offered "next Wednesday" and got "we\'ll call you". The coach: "You never want to put that on the table until it is a 100 percent guaranteed no."', by: 'The coach, to Drew' },
    { id: 'later', stage: 'back', them: "Call me in the spring.",
      means: 'They like you and they are putting it off.',
      steps: [['b1', "I can do that."], ['b3', "The only reason it's ${price} is that {reason} on {runDay}. It's not a forever price."], ['b5', "Is it worth grabbing while we're here?"]],
      why: 'The coach\'s re-anchor: "This is not a forever deal. It is just because I am helping Jim right now." It changes the question to do I want this, yes or no.', by: 'Nick' },
    { id: 'inside', stage: 'back', them: "Is that the whole lot?",
      means: 'A buying question, not an objection. Answer it big and never say "just".',
      steps: [['big', "{scope}"], ['b5', "{runDay}, morning or arvo?"]],
      why: '"If you demean what you are doing with your own words, you are stacking the odds against yourself."', by: 'The coach, to Gabe' },
    { id: 'noneed', stage: 'back', them: "It's reasonable, but I don't need it.",
      means: 'Maybe a no at any price. One question finds out.',
      steps: [['b1', "Fair enough."], ['b2', "Is there a price where it would make sense for you?"], ['out', "All good. // What was your name?"]],
      why: 'Vinnie said no at any number. The coach found out in ten seconds, got the name, and walked to the next door in a good mood.', by: 'Nick' }
  ];

  /* Door sim. Each choice: v best|ok|miss, g = change to their guard (minus is good). */
  var scenarios = [
    {
      id: 'warm', title: 'The warm door', level: 'Start here', strategy: 'any',
      blurb: 'A friendly homeowner and no pushback. The risk here is rushing or over-selling.',
      based: 'Gabe and Lynn', guard: 55, win: 40,
      nodes: [
        { stage: 'door', them: "(The door opens.) Hey. How are you?",
          choices: [
            { v: 'best', g: -12, t: "Good thanks, how's your day going? // Is that the guard dog back there?", reply: "Ha, she's harmless. Yeah, not bad.", c: 'Seven seconds of being a person. She has answered twice and you have not pitched.' },
            { v: 'miss', g: 18, t: "Good! I'm {me} from Stride, we're doing {noun} on your street and taking ${saving} off, I can run round and give you a price?", reply: "Oh. Um. Okay…", c: 'She let you, because she is nice. That was still one run-on sentence. The coach to Gabe: "Slow down. It is a conversation."' },
            { v: 'ok', g: 2, t: "Hi, I'm {me} from Stride Exterior Cleaning.", reply: "Hi…?", c: 'Clear and legal, but it lands cold. One human beat first, then who you are.' }
          ] },
        { stage: 'door', them: "So what brings you round?",
          choices: [
            { v: 'best', g: -10, t: "{bridge}", reply: "No, I haven't. What are you doing?", c: 'Name, business, reason, and it ends on a question. She asked what you are doing. That is the invitation.' },
            { v: 'ok', g: 0, t: "We clean {noun}. We're in the area this week.", reply: "Right.", c: 'True, and flat. You gave her nothing to ask about.' },
            { v: 'miss', g: 14, t: "We're the best-rated exterior cleaners in the Redlands and we've got a special on today only.", reply: "Mm-hm.", c: 'A claim and a deadline. That is the sales pattern everyone has heard before, and "today only" has to be true to say it.' }
          ] },
        { stage: 'pain', them: "What are you doing, exactly?",
          choices: [
            { v: 'best', g: -14, t: "I can show you, actually, if you want to take two steps. // {show}", reply: "Oh. Yeah, that has got bad.", c: 'She is off the door and looking at it. Now it is the two of you against the dirt.' },
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
            { v: 'best', g: -12, t: "{stackLine} // {why}", reply: "Right. I didn't realise it was all that.", c: 'One part per breath, pointing as you go. The job now sounds as big as it is.' },
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
            { v: 'best', g: -8, t: "I'm {me}, from Stride. // Have you seen us on {street} at all?", reply: "What are you talking about?", c: 'Short, and it ends on a question. She is curious now, which beats defensive.' },
            { v: 'miss', g: 15, t: "I won't take much of your time. We're offering discounted {short}s in your area today.", reply: "No, thank you.", c: '"I won\'t take much of your time" is what every salesman says. Her guard was up before you finished.' },
            { v: 'ok', g: 4, t: "Sorry to bother you! Have you got a minute?", reply: "Not really.", c: 'An apology and a yes or no question. You gave her the easy way out.' }
          ] },
        { stage: 'pain', them: "What is it you're doing?",
          choices: [
            { v: 'best', g: -10, t: "I'll show you // you want to take two steps? {show}", reply: "(She takes one step out.) I have a housekeeper for that.", c: 'She only came one step. That still gets her hand off the door.' },
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
            { v: 'best', g: -10, t: "Hello, hello. How's your day been? // I'm {me}, from Stride. Do you know {neighbour}?", reply: "Yeah, we know them. Why's that?", c: 'One name, then a pause. They asked why. Drew said the whole pitch in one breath here.' },
            { v: 'ok', g: 2, t: "Hi! We're doing {neighbour} and taking ${saving} off for neighbours. I can count it up and give you that rate.", reply: "Where are you from?", c: 'All correct, and all at once. They had to ask who you even are.' },
            { v: 'miss', g: 14, t: "Hi folks, quick one. We've done most of the street already.", reply: "Have you? Who?", c: 'If it is not true, do not say it. One real name beats ten vague ones, and they will check.' }
          ] },
        { stage: 'pain', them: "And what are you doing for them?",
          choices: [
            { v: 'best', g: -12, t: "I'll show you on yours // {show} Same thing at theirs on {runDay}. I'll {count} and give you the neighbour price.", reply: "You do all of it? …Yeah, go on.", c: 'Shown on their own house, then the assumptive price.' },
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
    { t: 'Nothing about you for seven seconds.', d: 'Be a person first. Then who you are, as a question.' },
    { t: 'A conversation has gaps.', d: 'Short lines. Pauses. Your voice going up and down. A filler word or two so you sound human.' },
    { t: 'Get them off the door.', d: 'Two steps to the dirt. It becomes you and them against the problem.' },
    { t: 'Front half: go for the price, not the sale.', d: 'You cannot sell until there is a number. Every front-half move is about getting to the count.' },
    { t: 'Before the price, go past the objection.', d: 'It is a smokescreen. Disarm, one small reason, shrink the ask, move. Never argue it.' },
    { t: 'Break the job into its parts.', d: 'Name every part and the price looks small beside the work.' },
    { t: 'Every discount needs a reason.', d: 'On the street already, last spot on the run, a review. No reason looks desperate.' },
    { t: 'After the price, guide them to a decision.', d: '"I don\'t know" is a no. Stay in it, find the real hesitation, give a reason, make one move, ask.' },
    { t: 'Do the job, not the outcome.', d: 'Take each person as far as they will comfortably go, leave with a name, carry the mood to the next door.' }
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
      ['Say who you are', 'Give your name, the business and why you are there before you talk price. The app does it in beat two, after one human hello.'],
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
  window.DC.content = { services: services, strategies: strategies, beats: beats, process: process, objections: objections,
    scenarios: scenarios, film: film, rules: rules, cues: cues, qld: qld };
})();
