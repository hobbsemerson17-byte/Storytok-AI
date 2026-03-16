import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data.json');

function loadData() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
  } catch (e) {}
  return null;
}

function saveData(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

class JsonDatabase {
  constructor(data) {
    this.data = data;
  }

  save() {
    saveData(this.data);
  }

  // Users
  findUserByEmail(email) {
    return this.data.users.find(u => u.email === email) || null;
  }

  findUserById(id) {
    return this.data.users.find(u => u.id === id) || null;
  }

  createUser(user) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  // Preferences
  findPreferences(userId) {
    return this.data.preferences.find(p => p.user_id === userId) || null;
  }

  createPreferences(prefs) {
    this.data.preferences.push(prefs);
    this.save();
    return prefs;
  }

  updatePreferences(userId, updates) {
    const idx = this.data.preferences.findIndex(p => p.user_id === userId);
    if (idx === -1) return null;
    for (const key of Object.keys(updates)) {
      if (updates[key] !== null && updates[key] !== undefined) {
        this.data.preferences[idx][key] = updates[key];
      }
    }
    this.save();
    return this.data.preferences[idx];
  }

  // Projects
  findProjects(userId, filters = {}) {
    let results = this.data.projects.filter(p => p.user_id === userId);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      results = results.filter(p => p.title.toLowerCase().includes(s) || (p.hook && p.hook.toLowerCase().includes(s)));
    }
    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }
    if (filters.status) {
      results = results.filter(p => p.status === filters.status);
    }
    return results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  findProjectById(id, userId) {
    return this.data.projects.find(p => p.id === id && p.user_id === userId) || null;
  }

  createProject(project) {
    this.data.projects.push(project);
    this.save();
    return project;
  }

  updateProject(id, userId, updates) {
    const idx = this.data.projects.findIndex(p => p.id === id && p.user_id === userId);
    if (idx === -1) return null;
    for (const key of Object.keys(updates)) {
      if (updates[key] !== null && updates[key] !== undefined) {
        this.data.projects[idx][key] = updates[key];
      }
    }
    this.data.projects[idx].updated_at = new Date().toISOString();
    this.save();
    return this.data.projects[idx];
  }

  deleteProject(id, userId) {
    const idx = this.data.projects.findIndex(p => p.id === id && p.user_id === userId);
    if (idx === -1) return false;
    this.data.projects.splice(idx, 1);
    this.save();
    return true;
  }

  // Templates
  getTemplates() {
    return this.data.templates.sort((a, b) => a.is_premium - b.is_premium);
  }

  findTemplateById(id) {
    return this.data.templates.find(t => t.id === id) || null;
  }

  // Usage
  getUsage(userId, date) {
    return this.data.usage.find(u => u.user_id === userId && u.date === date) || null;
  }

  getWeeklyUsage(userId) {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    return this.data.usage
      .filter(u => u.user_id === userId && u.date >= weekAgoStr)
      .reduce((sum, u) => sum + u.generation_count, 0);
  }

  incrementUsage(userId, date) {
    let usage = this.getUsage(userId, date);
    if (!usage) {
      usage = { id: uuidv4(), user_id: userId, date, generation_count: 0 };
      this.data.usage.push(usage);
    }
    const idx = this.data.usage.findIndex(u => u.user_id === userId && u.date === date);
    this.data.usage[idx].generation_count += 1;
    this.save();
    return this.data.usage[idx];
  }

  // Narrations
  createNarration(narration) {
    if (!this.data.narrations) this.data.narrations = [];
    this.data.narrations.push(narration);
    this.save();
    return narration;
  }

  findNarrationById(id) {
    if (!this.data.narrations) return null;
    return this.data.narrations.find(n => n.id === id) || null;
  }

  findNarrationsByProject(projectId, userId) {
    if (!this.data.narrations) return [];
    return this.data.narrations.filter(n => n.project_id === projectId && n.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

export function initDatabase() {
  let data = loadData();

  if (!data) {
    data = {
      users: [],
      preferences: [],
      projects: [],
      templates: [],
      usage: []
    };

    // Seed templates
    data.templates = [
      {
        id: uuidv4(),
        name: 'Crazy Roommate Story',
        description: 'Generate a wild, unbelievable roommate horror story that keeps viewers hooked.',
        category: 'crazy-true-story',
        tone: 'dramatic',
        hook_example: "My roommate did something so unhinged, I still can't believe it happened...",
        story_prompt: 'Generate a crazy roommate story that sounds real but is completely made up. Include shocking twists, escalating drama, and an unexpected ending.',
        icon: 'home',
        is_premium: 0
      },
      {
        id: uuidv4(),
        name: 'Scary Late-Night Story',
        description: 'A creepy story perfect for those late-night scrolling sessions.',
        category: 'scary-story',
        tone: 'creepy',
        hook_example: 'I woke up at 3AM to a sound that made my blood run cold...',
        story_prompt: 'Generate a scary short story set at night. Build tension slowly, use sensory details, and end with a chilling twist.',
        icon: 'moon',
        is_premium: 0
      },
      {
        id: uuidv4(),
        name: 'Cheating Drama Story',
        description: 'A jaw-dropping relationship drama that will have viewers sharing instantly.',
        category: 'relationship-drama',
        tone: 'dramatic',
        hook_example: "I found something on my partner's phone that changed everything...",
        story_prompt: 'Generate a relationship drama story about discovering infidelity. Make it emotionally gripping with a satisfying or shocking conclusion.',
        icon: 'heart-crack',
        is_premium: 0
      },
      {
        id: uuidv4(),
        name: 'Rich Kid Flex Story',
        description: "An over-the-top luxury lifestyle story that's pure entertainment.",
        category: 'rich-luxury',
        tone: 'dramatic',
        hook_example: "My friend's dad is so rich, what happened next blew my mind...",
        story_prompt: 'Generate an outrageous rich/luxury story about extreme wealth, expensive things, and jaw-dropping moments.',
        icon: 'gem',
        is_premium: 0
      },
      {
        id: uuidv4(),
        name: 'Mystery Confession',
        description: 'A dark confession-style story that keeps the audience guessing.',
        category: 'crime-mystery',
        tone: 'serious',
        hook_example: "I need to tell someone what happened that night. I've kept this secret for years...",
        story_prompt: 'Generate a mystery/confession story where the narrator reveals a dark secret. Build suspense and deliver a twist ending.',
        icon: 'search',
        is_premium: 0
      },
      {
        id: uuidv4(),
        name: 'Fake Reddit Story',
        description: 'A believable Reddit-style confession that feels 100% real.',
        category: 'reddit-confession',
        tone: 'serious',
        hook_example: 'AITA for what I did to my best friend? I need honest opinions...',
        story_prompt: 'Generate a Reddit-style AITA or confession post. Make it sound authentic, relatable, and divisive enough to spark debate.',
        icon: 'message-circle',
        is_premium: 0
      },
      {
        id: uuidv4(),
        name: 'Insane Plot Twist Story',
        description: 'A story with a twist so wild, viewers will replay it three times.',
        category: 'crazy-true-story',
        tone: 'dramatic',
        hook_example: 'Everything was normal until I realized the truth about my neighbor...',
        story_prompt: 'Generate a story that seems normal at first but has an insane plot twist at the end.',
        icon: 'zap',
        is_premium: 1
      }
    ];

    // Seed demo user
    const demoId = uuidv4();
    const hashedPassword = bcrypt.hashSync('demo123', 10);
    data.users.push({
      id: demoId,
      email: 'demo@storytok.ai',
      password: hashedPassword,
      name: 'Demo Creator',
      avatar: '',
      plan: 'free',
      created_at: new Date().toISOString(),
      onboarded: 1
    });

    data.preferences.push({
      user_id: demoId,
      platform: 'tiktok',
      content_style: 'crazy-true-story',
      tone: 'dramatic',
      story_length: '60',
      theme: 'dark'
    });

    // Seed sample projects
    const sampleProjects = [
      {
        title: 'The Roommate Who Stole Everything',
        category: 'crazy-true-story',
        platform: 'tiktok',
        tone: 'dramatic',
        video_length: '60',
        hook: 'My roommate seemed perfect until I found what was hidden under her bed...',
        story: 'I moved in with Sarah last September. She was quiet, clean, always paid rent on time. Perfect roommate, right? Wrong. Three months in, I noticed small things disappearing. A charger here, a hoodie there. I thought I was losing my mind. Then one day she left for work and forgot to lock her bedroom door. I wasn\'t snooping — I was looking for my missing AirPods. What I found under her bed changed everything. A box. Inside it: my AirPods, my favorite necklace, my old phone, gift cards from my drawer, and — this is the part that still makes me sick — printed copies of my bank statements. She\'d been opening my mail. I confronted her that night. She didn\'t even deny it. She smiled and said, "I was just borrowing." I moved out the next morning.',
        voiceover: 'My roommate seemed perfect... until I found what was hidden under her bed. I moved in with Sarah last September. Quiet. Clean. Always paid rent on time. The perfect roommate... right? Wrong. Three months in, small things started disappearing. A charger. A hoodie. I thought I was going crazy. Then one day, she forgot to lock her bedroom door. I wasn\'t snooping. I was just looking for my missing AirPods. But what I found under her bed... changed everything. A box. Inside it? My AirPods. My favorite necklace. My old phone. Gift cards from my drawer. And the part that still makes me sick... printed copies of my bank statements. She\'d been opening my mail. I confronted her that night. She didn\'t even deny it. She just smiled and said... "I was just borrowing." I moved out the next morning.',
        captions: 'My roommate seemed perfect...\nuntil I found what was hidden\nunder her bed.\nI moved in with Sarah last September.\nQuiet. Clean. Always paid rent.\nPerfect roommate, right?\nWRONG.\nThree months in,\nsmall things started disappearing.\nA charger. A hoodie.\nI thought I was losing my mind.\nThen one day...\nshe forgot to lock her door.\nWhat I found under her bed\nchanged EVERYTHING.\nA box. Inside it:\nmy AirPods, my necklace,\nmy old phone, gift cards...\nand printed copies\nof my BANK STATEMENTS.\nShe\'d been opening my mail.\nI confronted her.\nShe smiled and said:\n"I was just borrowing."\nI moved out the next morning.',
        post_caption: 'Would you have called the police? My roommate was literally stealing my identity piece by piece...',
        hashtags: '#roommate #storytime #roommatehorror #viral #fyp #drama #crazy #storytok #reddit #truestory',
        video_titles: 'My Roommate Was Secretly Stealing My Identity | The Perfect Roommate Was a Thief | What I Found Under Her Bed Changed Everything',
        status: 'completed'
      },
      {
        title: '3AM Knocking',
        category: 'scary-story',
        platform: 'tiktok',
        tone: 'creepy',
        video_length: '60',
        hook: 'The knocking started at exactly 3:07 AM. Every. Single. Night.',
        story: 'It started on a Tuesday. 3:07 AM. Three slow knocks on my apartment door. I checked the peephole — nobody there. Went back to bed. Wednesday, same thing. 3:07 AM. Three knocks. Nobody at the door. By Thursday, I set up my phone to record the hallway. At 3:07 AM, the knocks came again. I grabbed my phone and checked the footage. My blood went cold. The hallway was empty the entire time. But the knocking... the knocking was coming from INSIDE the wall. I called my landlord the next morning. He went pale. He said the previous tenant had reported the same thing before she disappeared. Nobody ever found her. I broke my lease that day.',
        voiceover: 'The knocking started at exactly 3:07 AM. Every. Single. Night. It started on a Tuesday. Three slow knocks on my apartment door. I checked the peephole... nobody there. Went back to bed. Wednesday... same thing. 3:07 AM. Three knocks. Nobody at the door. By Thursday, I set up my phone to record the hallway. At 3:07 AM, the knocks came again. I grabbed my phone. Checked the footage. My blood went cold. The hallway was empty. The entire time. But the knocking... the knocking was coming from INSIDE the wall. I called my landlord the next morning. He went pale. He said the previous tenant reported the same thing... before she disappeared. Nobody ever found her. I broke my lease that day.',
        captions: 'The knocking started\nat exactly 3:07 AM.\nEvery. Single. Night.\nIt started on a Tuesday.\nThree slow knocks\non my apartment door.\nI checked the peephole.\nNobody there.\nWednesday, same thing.\n3:07 AM. Three knocks.\nNobody at the door.\nBy Thursday, I set up\nmy phone to record.\nAt 3:07 AM,\nthe knocks came again.\nI checked the footage.\nMy blood went cold.\nThe hallway was EMPTY\nthe entire time.\nBut the knocking...\nwas coming from\nINSIDE THE WALL.\nI called my landlord.\nHe went pale.\nThe previous tenant\nreported the same thing...\nbefore she DISAPPEARED.\nI broke my lease that day.',
        post_caption: 'I still get chills thinking about this... has anyone else experienced something like this?',
        hashtags: '#scary #horror #3am #creepy #storytime #paranormal #ghost #fyp #viral #scarystory',
        video_titles: '3AM Knocking That Still Haunts Me | The Sound Inside My Wall | Why I Broke My Lease at 3AM',
        status: 'completed'
      },
      {
        title: 'The $50K Venmo Mistake',
        category: 'rich-luxury',
        platform: 'reels',
        tone: 'dramatic',
        video_length: '30',
        hook: "My friend accidentally Venmo'd me $50,000 and what happened next was insane...",
        story: "So my buddy Jake — his dad owns like three car dealerships — accidentally sent me $50K on Venmo instead of his business partner. Instead of just requesting it back, he texted me: \"Keep it. Consider it a birthday gift. Just don't tell my dad.\" I thought he was joking. He wasn't. I bought a used BMW the next day. Then Jake's dad found out. He didn't come after me — he came after Jake. Cut him off completely. Jake went from penthouse to couch-surfing in 48 hours. And the craziest part? He never once asked for the money back. He just said, \"At least someone got to enjoy it.\"",
        voiceover: "My friend accidentally Venmo'd me fifty thousand dollars. And what happened next... was insane. My buddy Jake, his dad owns three car dealerships, accidentally sent ME fifty K instead of his business partner. Instead of requesting it back, he texted me: \"Keep it. Consider it a birthday gift. Don't tell my dad.\" I bought a used BMW the next day. Then Jake's dad found out. He didn't come after me. He came after Jake. Cut him off completely. Jake went from penthouse to couch-surfing in forty-eight hours. He never asked for the money back. He just said... \"At least someone got to enjoy it.\"",
        captions: "My friend accidentally Venmo'd me\n$50,000...\nHis dad owns three car dealerships.\nHe texted me:\n\"Keep it.\nConsider it a birthday gift.\"\nI bought a BMW the next day.\nThen his dad found out.\nCut Jake off completely.\nPenthouse to couch-surfing\nin 48 hours.\nHe never asked for it back.\n\"At least someone\ngot to enjoy it.\"",
        post_caption: 'Would you have kept the money or sent it back? Be honest...',
        hashtags: '#rich #money #venmo #luxury #storytime #viral #fyp #drama #cars #wealthy',
        video_titles: "The $50K Venmo That Changed Everything | My Rich Friend's Biggest Mistake | What Would You Do With $50K?",
        status: 'completed'
      }
    ];

    sampleProjects.forEach((p, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      data.projects.push({
        id: uuidv4(),
        user_id: demoId,
        ...p,
        created_at: d.toISOString(),
        updated_at: d.toISOString()
      });
    });

    saveData(data);
  }

  console.log('  Database initialized successfully');
  return new JsonDatabase(data);
}
