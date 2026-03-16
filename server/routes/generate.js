import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware.js';

const router = Router();

// Mock AI story generation engine
// Replace these functions with real AI API calls (OpenAI, Claude, etc.)
function generateStoryContent(params) {
  const { topic, category, tone, videoLength, platform, hookStyle, keywords, cta } = params;

  const lengthMap = { '15': 50, '30': 100, '60': 200, '90': 300 };
  const targetWords = lengthMap[videoLength] || 200;

  const stories = getStoryBank(category, tone);
  const selected = stories[Math.floor(Math.random() * stories.length)];

  const topicNote = topic ? ` about "${topic}"` : '';
  const keywordNote = keywords ? ` (featuring: ${keywords})` : '';

  let hook = selected.hook;
  let story = selected.story;
  let voiceover = selected.voiceover;
  let captions = selected.captions;

  // Customize if topic provided
  if (topic && topic.length > 3) {
    hook = customizeHook(hook, topic, hookStyle);
  }

  const postCaption = generatePostCaption(category, tone, topic);
  const hashtags = generateHashtags(category, platform, keywords);
  const videoTitles = generateVideoTitles(hook, category);

  return {
    hook,
    story,
    voiceover,
    captions,
    post_caption: postCaption,
    hashtags,
    video_titles: videoTitles
  };
}

function customizeHook(hook, topic, style) {
  const hookStyles = {
    question: `What would you do if ${topic}?`,
    shock: `I still can't believe what happened when ${topic}...`,
    challenge: `Nobody believed me when I said ${topic}...`,
    confession: `I need to tell someone about ${topic}. I've been keeping this secret...`,
    cliffhanger: `${topic}... and what happened next changed everything.`
  };
  return hookStyles[style] || hook;
}

function generatePostCaption(category, tone, topic) {
  const captions = {
    'crazy-true-story': [
      `This actually happened and I still can't process it... Would you have reacted differently?`,
      `I've been holding onto this story for way too long. Had to share it.`,
      `Tell me this isn't the craziest thing you've heard today...`
    ],
    'scary-story': [
      `I still get chills every time I think about this... Has anything like this happened to you?`,
      `Don't watch this alone at night. You've been warned.`,
      `The scariest part? This could happen to anyone...`
    ],
    'relationship-drama': [
      `Would you have stayed or left? Be honest...`,
      `Red flags were there the whole time. I just didn't want to see them.`,
      `This is why trust issues exist...`
    ],
    'rich-luxury': [
      `Money really does change people... What would you have done?`,
      `Some people live in a completely different world...`,
      `This level of rich is actually insane...`
    ],
    'crime-mystery': [
      `The truth is darker than you think...`,
      `Some secrets should stay buried. This one didn't.`,
      `I'm still not sure I did the right thing...`
    ],
    'reddit-confession': [
      `AITA? I genuinely need to know if I'm the problem here...`,
      `Throwaway account for obvious reasons. I need honest opinions.`,
      `I can't tell anyone I know about this. So I'm telling the internet.`
    ],
    'motivational': [
      `This changed my perspective on everything.`,
      `Sometimes the hardest moments lead to the biggest breakthroughs.`,
      `If you're going through something right now, watch this.`
    ]
  };

  const options = captions[category] || captions['crazy-true-story'];
  return options[Math.floor(Math.random() * options.length)];
}

function generateHashtags(category, platform, keywords) {
  const base = ['#storytime', '#viral', '#fyp'];

  const categoryTags = {
    'crazy-true-story': ['#crazy', '#truestory', '#unbelievable', '#drama', '#storytime'],
    'scary-story': ['#scary', '#horror', '#creepy', '#scarystory', '#3am', '#paranormal'],
    'relationship-drama': ['#relationship', '#drama', '#cheating', '#love', '#heartbreak', '#toxic'],
    'rich-luxury': ['#rich', '#luxury', '#money', '#wealthy', '#lifestyle', '#millionaire'],
    'crime-mystery': ['#crime', '#mystery', '#truecrime', '#confession', '#dark', '#secret'],
    'reddit-confession': ['#reddit', '#aita', '#confession', '#advice', '#opinions', '#storytime'],
    'motivational': ['#motivation', '#inspiration', '#mindset', '#growth', '#success', '#life']
  };

  const platformTags = {
    'tiktok': ['#tiktok', '#foryou', '#foryoupage'],
    'reels': ['#reels', '#instagram', '#instareels'],
    'shorts': ['#shorts', '#youtube', '#youtubeshorts']
  };

  const tags = [
    ...base,
    ...(categoryTags[category] || []),
    ...(platformTags[platform] || platformTags['tiktok'])
  ];

  if (keywords) {
    keywords.split(',').forEach(k => {
      const tag = '#' + k.trim().toLowerCase().replace(/\s+/g, '');
      if (tag.length > 1) tags.push(tag);
    });
  }

  return [...new Set(tags)].slice(0, 15).join(' ');
}

function generateVideoTitles(hook, category) {
  const titles = [
    hook.replace('...', '').trim(),
    `You Won't Believe What Happened Next`,
    `This Story Will Leave You Speechless`,
    `I Can't Stop Thinking About This`,
    `Wait For The Plot Twist...`
  ];
  return titles.slice(0, 3).join(' | ');
}

function getStoryBank(category, tone) {
  const bank = {
    'crazy-true-story': [
      {
        hook: "My neighbor knocked on my door at 2AM with a suitcase full of cash and said 'Don't ask questions'...",
        story: "My neighbor knocked on my door at 2AM. He was shaking, holding a suitcase. \"I need you to hold this. Don't open it. Don't ask questions.\" Before I could respond, he shoved it into my hands and ran to his car. I stood there in my doorway, holding this heavy suitcase, watching his taillights disappear. I opened it. Cash. Stacks of it. I'm talking easily six figures. I didn't sleep that night. The next morning, two men in suits knocked on my door asking about my neighbor. I said I hadn't seen him. They left a card. My neighbor came back three days later, took the suitcase, and handed me an envelope with $5,000. He moved out the following week. I never saw him again. To this day, I have no idea what that was about.",
        voiceover: "My neighbor knocked on my door at 2AM. He was shaking... holding a suitcase. \"I need you to hold this. Don't open it. Don't ask questions.\" He shoved it into my hands and ran to his car. I watched his taillights disappear. I opened it. Cash. Stacks of it. Easily six figures. I didn't sleep that night. The next morning... two men in suits knocked on MY door. Asking about my neighbor. I said I hadn't seen him. They left a card. My neighbor came back three days later. Took the suitcase. And handed me an envelope with five thousand dollars cash. He moved out the following week. I never saw him again. To this day... I have no idea what that was about.",
        captions: "My neighbor knocked on my door\nat 2AM.\nHe was shaking.\nHolding a suitcase.\n\"Hold this.\nDon't open it.\nDon't ask questions.\"\nHe ran to his car\nand disappeared.\nI opened it.\nCASH.\nStacks of it.\nEasily six figures.\nThe next morning,\ntwo men in suits\nknocked on MY door.\n\"Have you seen your neighbor?\"\nI said no.\nThree days later,\nhe came back.\nTook the suitcase.\nHanded me $5,000.\nMoved out that week.\nI never saw him again."
      }
    ],
    'scary-story': [
      {
        hook: "I installed a security camera in my hallway. What it recorded at 3AM made me move out that week...",
        story: "After hearing weird noises every night, I installed a camera in my hallway. The first two nights, nothing. Just my cat walking around. Night three, I checked the footage and my stomach dropped. At exactly 3:12 AM, my front door handle slowly turned. Then stopped. Then turned again. This went on for two minutes straight. Nobody was outside — I checked the exterior camera. The handle was moving on its own. But that's not the worst part. At 3:14 AM, the camera caught something in the corner of the hallway. A shadow. Not moving shadow — a standing shadow. Shaped like a person. It stayed there for thirty seconds, then it was gone. I showed my landlord. He turned pale and asked if the previous tenant had contacted me. She hadn't. Because she'd been dead for six months.",
        voiceover: "I installed a security camera in my hallway. The first two nights... nothing. Just my cat. Night three... I checked the footage. My stomach dropped. At exactly 3:12 AM, my front door handle... slowly turned. Then stopped. Then turned again. For two full minutes. I checked the exterior camera. Nobody was outside. The handle was moving... on its own. But that's not the worst part. At 3:14 AM... the camera caught something in the corner. A shadow. Not a moving shadow. A STANDING shadow. Shaped like a person. It stayed there for thirty seconds... then vanished. I showed my landlord. He turned pale. He asked if the previous tenant had contacted me. She hadn't. Because she'd been dead... for six months.",
        captions: "I installed a camera\nin my hallway.\nNight three...\nI checked the footage.\nMy stomach dropped.\n3:12 AM.\nMy front door handle\nslowly turned.\nThen stopped.\nThen turned again.\nFor TWO MINUTES.\nI checked the outside camera.\nNobody was there.\nThe handle moved ON ITS OWN.\nBut that's not the worst part.\n3:14 AM.\nA shadow in the corner.\nNot moving.\nSTANDING.\nShaped like a person.\nThirty seconds... then gone.\nMy landlord turned pale.\n\"Has the previous tenant\ncontacted you?\"\nShe hadn't.\nShe'd been dead\nfor six months."
      }
    ],
    'relationship-drama': [
      {
        hook: "I found my girlfriend's second phone. What I saw on it ended our 4-year relationship in 10 minutes...",
        story: "My girlfriend of four years always had two phones. She said one was for work. I never questioned it until her 'work phone' buzzed at midnight on a Saturday. She was in the shower. I glanced at the screen. A message from someone named 'Gym Trainer' with a heart emoji: 'Can't wait for Tuesday. Wear that dress I like.' My heart stopped. I scrolled up. Months of messages. Dates. Photos. Plans for a trip together. Four years of trust, shattered in ten minutes of scrolling. When she came out of the shower, I was sitting on the bed holding both phones. She didn't even try to explain. She just said, 'How long have you known?' Like I was the one keeping secrets. I walked out that night with one bag. Never looked back.",
        voiceover: "I found my girlfriend's second phone. She always had two phones. One for work, she said. I never questioned it... until her 'work phone' buzzed at midnight. On a Saturday. She was in the shower. I glanced at the screen. A message from 'Gym Trainer' with a heart emoji. 'Can't wait for Tuesday. Wear that dress I like.' My heart stopped. I scrolled up. Months of messages. Dates. Photos. Plans for a trip. Four years of trust... shattered in ten minutes of scrolling. When she came out of the shower... I was sitting on the bed. Holding both phones. She didn't try to explain. She just said... 'How long have you known?' Like I was the one keeping secrets. I walked out that night. One bag. Never looked back.",
        captions: "I found my girlfriend's\nsecond phone.\nShe always said\nit was for work.\nHer 'work phone' buzzed\nat midnight on a Saturday.\nShe was in the shower.\nI glanced at the screen.\n'Gym Trainer' with a heart emoji:\n\"Can't wait for Tuesday.\nWear that dress I like.\"\nMy heart STOPPED.\nI scrolled up.\nMonths of messages.\nDates. Photos.\nPlans for a trip TOGETHER.\nFour years of trust.\nShattered in ten minutes.\nShe came out of the shower.\nI was holding both phones.\nShe didn't explain.\nShe just said:\n\"How long have you known?\"\nLike I was the one\nkeeping secrets.\nI walked out that night."
      }
    ],
    'rich-luxury': [
      {
        hook: "My college roommate's dad sent a helicopter to pick us up from a party. That's when I realized I was poor...",
        story: "Freshman year, my roommate Alex seemed normal. Regular clothes, ate dining hall food, complained about homework like everyone else. Then one Friday night we were at a party thirty minutes from campus. It was 1AM and we couldn't get an Uber. Alex made a phone call. Twenty minutes later, I heard it. A helicopter. Landing in the parking lot of a strip mall next to the party. Alex just said, 'Our ride's here.' I thought it was a joke until he started walking toward it. The pilot knew his name. The interior had leather seats and a mini fridge. We flew back to campus in eight minutes. When we landed, Alex just said, 'My dad worries about drunk driving.' I Googled his dad the next day. Billionaire. Actual billionaire. Alex never mentioned it once in four years.",
        voiceover: "My college roommate's dad sent a helicopter to pick us up from a party. Freshman year, my roommate Alex seemed completely normal. Regular clothes. Dining hall food. Complained about homework like everyone else. One Friday night, we were at a party thirty minutes from campus. 1 AM. No Ubers. Alex made a phone call. Twenty minutes later... I heard it. A helicopter. Landing in a strip mall parking lot. Alex said, 'Our ride's here.' I thought he was joking. The pilot knew his name. Leather seats. Mini fridge. We flew back to campus in eight minutes. Alex just said, 'My dad worries about drunk driving.' I Googled his dad the next day. Billionaire. Actual billionaire. Alex never mentioned it once... in four years.",
        captions: "My roommate's dad\nsent a HELICOPTER\nto pick us up from a party.\nFreshman year.\nAlex seemed normal.\nRegular clothes.\nDining hall food.\nOne Friday night,\nno Ubers at 1AM.\nAlex made one phone call.\nTwenty minutes later...\nA HELICOPTER.\nLanding in a parking lot.\n\"Our ride's here.\"\nThe pilot knew his name.\nLeather seats. Mini fridge.\nEight minutes back to campus.\n\"My dad worries about\ndrunk driving.\"\nI Googled his dad.\nBILLIONAIRE.\nActual billionaire.\nAlex never mentioned it\nin four years."
      }
    ],
    'crime-mystery': [
      {
        hook: "My Uber driver took a wrong turn on purpose. When I asked where we were going, he locked the doors...",
        story: "I ordered an Uber home from downtown at 11PM. Normal night, normal ride. Until the driver missed my exit on purpose. I said, 'Hey, you missed the turn.' No response. I said it again. Nothing. Then he took another wrong turn. Into an industrial area. Empty warehouses. No streetlights. I reached for the door handle. Click. Child lock. The doors were locked. My heart was racing. I texted my location to my sister. Then I did something desperate — I faked a phone call. 'Hey babe, yeah I'm almost there, the driver is taking a weird route through the warehouse district off Miller Road.' I said it loud and clear. The driver's eyes went to the rearview mirror. Without a word, he made a U-turn. Drove me home in complete silence. I reported him immediately. His account was deleted within an hour. Uber never told me what they found.",
        voiceover: "My Uber driver took a wrong turn on purpose. And when I asked where we were going... he locked the doors. I ordered an Uber home from downtown at 11PM. Normal night. Normal ride. Until the driver missed my exit. On purpose. I said, 'Hey, you missed the turn.' No response. He took another wrong turn. Into an industrial area. Empty warehouses. No streetlights. I reached for the door. Click. Child lock. I texted my location to my sister. Then I faked a phone call. 'Hey babe, yeah I'm almost there. The driver is taking a weird route through the warehouse district off Miller Road.' Loud and clear. The driver's eyes hit the rearview mirror. Without a word... he made a U-turn. Drove me home in silence. I reported him. Account deleted within an hour. Uber never told me what they found.",
        captions: "My Uber driver\ntook a wrong turn\nON PURPOSE.\n\"Hey, you missed the turn.\"\nNo response.\nAnother wrong turn.\nIndustrial area.\nEmpty warehouses.\nNo streetlights.\nI reached for the door.\nClick.\nChild lock.\nDoors LOCKED.\nI texted my sister\nmy location.\nThen I faked a phone call.\n\"Hey babe, I'm almost there.\nThe driver is taking a weird route\nthrough the warehouse district.\"\nLOUD and CLEAR.\nHis eyes hit the mirror.\nWithout a word...\nhe made a U-turn.\nDrove me home in silence.\nAccount deleted\nwithin an hour.\nUber never told me\nwhat they found."
      }
    ],
    'reddit-confession': [
      {
        hook: "AITA for exposing my sister's secret at Thanksgiving dinner? Our family hasn't spoken since...",
        story: "My sister has been the golden child my entire life. Perfect grades, perfect job, perfect husband. And she never let me forget it. At every family dinner, she'd make subtle jabs about my life choices. Last Thanksgiving, she started again. 'When are you going to get a real job?' In front of everyone. Something snapped. I said, 'I don't know, Sarah. When are you going to tell Mom and Dad that your perfect husband is actually your second marriage? That your first marriage in Vegas lasted 72 hours?' Dead. Silence. My parents had no idea. My sister turned white. Her husband just stared at his plate. She ran out crying. My mom looked at me like I'd committed a crime. But honestly? I don't feel bad. She's spent twenty years making me feel small. Am I wrong for finally fighting back? Our family group chat has been silent for three months.",
        voiceover: "AITA for exposing my sister's secret at Thanksgiving dinner? My sister has been the golden child my entire life. Perfect grades. Perfect job. Perfect husband. And she never let me forget it. Every family dinner... subtle jabs about my life. Last Thanksgiving, she started again. 'When are you going to get a REAL job?' In front of everyone. Something snapped. I said... 'I don't know, Sarah. When are you going to tell Mom and Dad that your perfect husband is actually your SECOND marriage? That your first marriage in Vegas lasted 72 hours?' Dead. Silence. My parents had no idea. My sister turned white. Her husband stared at his plate. She ran out crying. My mom looked at me like I'd committed a crime. But I don't feel bad. She spent twenty years making me feel small. The family group chat has been silent for three months.",
        captions: "AITA for exposing my sister\nat Thanksgiving?\nShe's always been\nthe golden child.\nPerfect grades.\nPerfect job.\nPerfect husband.\nEvery dinner,\nshe'd make jabs at my life.\nLast Thanksgiving:\n\"When are you getting\na REAL job?\"\nSomething snapped.\n\"I don't know, Sarah.\nWhen are you telling Mom and Dad\nyour husband is actually\nyour SECOND marriage?\"\nDead. Silence.\nMy parents had NO idea.\nShe turned white.\nRan out crying.\nMom looked at me\nlike I committed a crime.\nBut honestly?\nI don't feel bad.\nTwenty years of being\nmade to feel small.\nFamily group chat:\nsilent for 3 months."
      }
    ],
    'motivational': [
      {
        hook: "A stranger's words at a gas station changed my entire life trajectory...",
        story: "I was at my lowest. Lost my job, girlfriend left, sitting in my car at a gas station at 2AM wondering what the point of everything was. An old man knocked on my window. I almost drove off, but something made me roll it down. He said, 'Son, you look like I did thirty years ago. Sitting in a parking lot, thinking it's over.' He pulled out his wallet and showed me a photo. A run-down apartment. 'That's where I lived when I had nothing. No job, no family, no hope.' Then he pointed at the Mercedes he was driving. 'That's where I am now. The parking lot isn't the end of the story. It's just the intermission.' He patted my shoulder and left. I never got his name. But I went home that night and applied to seventeen jobs. Got three callbacks. Within a year, my life was unrecognizable. Sometimes the messenger is more important than the message.",
        voiceover: "A stranger's words at a gas station changed my entire life. I was at my absolute lowest. Lost my job. Girlfriend left. Sitting in my car at a gas station at 2AM... wondering what the point of everything was. An old man knocked on my window. He said, 'Son, you look like I did thirty years ago. Sitting in a parking lot, thinking it's over.' He showed me a photo. A run-down apartment. 'That's where I lived when I had nothing.' Then he pointed at his Mercedes. 'That's where I am now. The parking lot isn't the end of the story. It's just the intermission.' He patted my shoulder and left. I never got his name. But I went home and applied to seventeen jobs. Got three callbacks. Within a year... my life was unrecognizable. Sometimes the messenger is more important than the message.",
        captions: "A stranger at a gas station\nchanged my life.\nI was at my lowest.\nLost my job.\nGirlfriend left.\n2AM. Sitting in my car.\nWondering what the point was.\nAn old man knocked\non my window.\n\"You look like I did\nthirty years ago.\"\nHe showed me a photo.\nA run-down apartment.\n\"That's where I was\nwhen I had nothing.\"\nHe pointed at his Mercedes.\n\"The parking lot isn't\nthe end of the story.\nIt's just the intermission.\"\nI went home that night.\nApplied to 17 jobs.\nGot 3 callbacks.\nWithin a year...\nmy life was unrecognizable."
      }
    ]
  };

  return bank[category] || bank['crazy-true-story'];
}

router.post('/', authenticateToken, (req, res) => {
  const { topic, category, tone, videoLength, platform, hookStyle, keywords, cta } = req.body;

  // Check usage limits for free users (3 per week)
  const user = req.db.findUserById(req.userId);
  const today = new Date().toISOString().split('T')[0];
  const weeklyCount = req.db.getWeeklyUsage(req.userId);

  if (user.plan === 'free' && weeklyCount >= 3) {
    return res.status(429).json({
      error: 'Weekly limit reached',
      message: 'Free plan allows 3 stories per week. Upgrade to Pro for unlimited generations.',
      usage: weeklyCount,
      limit: 3
    });
  }

  // Generate content
  const content = generateStoryContent({
    topic: topic || '',
    category: category || 'crazy-true-story',
    tone: tone || 'dramatic',
    videoLength: videoLength || '60',
    platform: platform || 'tiktok',
    hookStyle: hookStyle || 'shock',
    keywords: keywords || '',
    cta: cta || ''
  });

  // Save as project
  const projectId = uuidv4();
  const title = topic || content.hook.substring(0, 50) + '...';
  const now = new Date().toISOString();

  req.db.createProject({
    id: projectId,
    user_id: req.userId,
    title,
    category: category || 'crazy-true-story',
    platform: platform || 'tiktok',
    tone: tone || 'dramatic',
    video_length: videoLength || '60',
    hook: content.hook,
    story: content.story,
    voiceover: content.voiceover,
    captions: content.captions,
    post_caption: content.post_caption,
    hashtags: content.hashtags,
    video_titles: content.video_titles,
    status: 'completed',
    created_at: now,
    updated_at: now
  });

  // Update usage count (still tracked by day for granularity)
  req.db.incrementUsage(req.userId, today);

  res.json({
    projectId,
    ...content,
    usage: weeklyCount + 1,
    limit: user.plan === 'free' ? 3 : 'unlimited'
  });
});

// Surprise me endpoint
router.get('/surprise', authenticateToken, (req, res) => {
  const surpriseIdeas = [
    { topic: 'My neighbor has been living a double life', category: 'crazy-true-story', tone: 'dramatic', hookStyle: 'shock' },
    { topic: 'The hotel room that nobody talks about', category: 'scary-story', tone: 'creepy', hookStyle: 'cliffhanger' },
    { topic: 'I caught my best friend in a lie that ruined everything', category: 'relationship-drama', tone: 'dramatic', hookStyle: 'confession' },
    { topic: 'My boss accidentally showed his bank account', category: 'rich-luxury', tone: 'dramatic', hookStyle: 'shock' },
    { topic: 'The voicemail that solved a 10 year mystery', category: 'crime-mystery', tone: 'serious', hookStyle: 'cliffhanger' },
    { topic: 'AITA for refusing to attend my own surprise party', category: 'reddit-confession', tone: 'funny', hookStyle: 'question' },
    { topic: 'A stranger paid for my groceries and changed my mindset', category: 'motivational', tone: 'emotional', hookStyle: 'confession' },
    { topic: 'My delivery driver left a note that gave me chills', category: 'scary-story', tone: 'creepy', hookStyle: 'shock' },
    { topic: 'I found out why my landlord never raised the rent', category: 'crime-mystery', tone: 'dramatic', hookStyle: 'cliffhanger' },
    { topic: 'My ex showed up at my wedding uninvited', category: 'relationship-drama', tone: 'dramatic', hookStyle: 'shock' }
  ];

  const idea = surpriseIdeas[Math.floor(Math.random() * surpriseIdeas.length)];
  res.json(idea);
});

export default router;
