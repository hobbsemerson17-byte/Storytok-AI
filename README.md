# StoryTok AI

**Create viral story content in seconds.**

StoryTok AI is a mobile-first web app for TikTok, Instagram Reels, and YouTube Shorts creators. Generate complete content packages — story scripts, voiceover text, subtitles, captions, and hashtags — in under 60 seconds.

---

## How to Run on Windows 11 (Step by Step)

### Step 1: Install Node.js

1. Go to https://nodejs.org
2. Download the **LTS** version (the big green button)
3. Run the installer — click Next on everything, keep all defaults
4. When it finishes, **restart your computer**

### Step 2: Verify Node.js is installed

1. Press the **Windows key** on your keyboard
2. Type **PowerShell** and open **Windows PowerShell**
3. Type this command and press Enter:

```
node --version
```

You should see something like `v20.11.0` or similar. If you see an error like "node is not recognized", restart your computer and try again.

4. Also check npm:

```
npm --version
```

You should see a version number like `10.2.4`.

### Step 3: Open the project folder

1. Extract the ZIP file to a folder on your computer (for example, your Desktop)
2. In PowerShell, navigate to the project folder. For example, if you extracted it to your Desktop:

```
cd "$HOME\Desktop\storytok-ai"
```

### Step 4: Install dependencies

Run this command (it may take 1-2 minutes):

```
npm install
```

You should see output ending with something like:
```
added 160 packages in 5s
```

### Step 5: Start the backend server

Run:

```
npm run server
```

You should see:
```
  Database initialized successfully

  ========================================
  StoryTok AI Server is running!
  http://localhost:3001
  ========================================
```

**Keep this PowerShell window open.** Do not close it.

### Step 6: Start the frontend (in a NEW PowerShell window)

1. Press the Windows key again
2. Open a **second** PowerShell window
3. Navigate to the same project folder:

```
cd "$HOME\Desktop\storytok-ai"
```

4. Run:

```
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

### Step 7: Open the app

Open your web browser (Chrome, Edge, Firefox) and go to:

```
http://localhost:5173
```

You should see the StoryTok AI landing page.

### Step 8: Try the demo

You can log in with the demo account:
- **Email:** demo@storytok.ai
- **Password:** demo123

Or create your own account with any email and password.

---

## Project Folder Structure

```
storytok-ai/
├── index.html              ← Main HTML file
├── package.json            ← Dependencies and scripts
├── vite.config.js          ← Vite configuration
├── .env.example            ← Example environment variables
├── README.md               ← This file
├── public/
│   └── favicon.svg         ← App icon
├── server/
│   ├── index.js            ← Express server entry point
│   ├── database.js         ← JSON file database
│   ├── middleware.js        ← Auth middleware
│   └── routes/
│       ├── auth.js         ← Login / Signup
│       ├── users.js        ← User profile & preferences
│       ├── generate.js     ← Story generation engine
│       ├── projects.js     ← CRUD for saved projects
│       └── templates.js    ← Story templates
└── src/
    ├── main.jsx            ← React entry point
    ├── App.jsx             ← App routes
    ├── index.css           ← Global styles
    ├── components/
    │   └── Layout.jsx      ← Bottom navigation layout
    ├── contexts/
    │   └── AuthContext.jsx  ← Auth state management
    ├── pages/
    │   ├── Landing.jsx     ← Landing / marketing page
    │   ├── Login.jsx       ← Login screen
    │   ├── Signup.jsx      ← Signup screen
    │   ├── Onboarding.jsx  ← First-time user setup
    │   ├── Dashboard.jsx   ← Home screen
    │   ├── CreateStory.jsx ← Story creation form
    │   ├── StoryResult.jsx ← Generated content display
    │   ├── Projects.jsx    ← Saved projects list
    │   ├── ProjectDetail.jsx ← Project detail view
    │   ├── Templates.jsx   ← Template library
    │   ├── Upgrade.jsx     ← Subscription page
    │   └── Settings.jsx    ← Settings page
    └── utils/
        ├── api.js          ← API client
        └── constants.js    ← Shared constants
```

---

## Troubleshooting

### "node is not recognized" or "npm is not recognized"

- Make sure you installed Node.js from https://nodejs.org
- Restart your computer after installing
- If it still doesn't work, you may need to add Node.js to your PATH:
  1. Search for "Environment Variables" in the Windows search bar
  2. Click "Edit the system environment variables"
  3. Click "Environment Variables" button
  4. Under "System variables", find "Path" and click "Edit"
  5. Add: `C:\Program Files\nodejs\`
  6. Click OK on everything and restart PowerShell

### "Port 5173 is already in use"

Another app is using that port. You can:
- Close the other app
- Or change the port in `vite.config.js` — find `port: 5173` and change it to `5174` or another number

### "Port 3001 is already in use"

Close the other PowerShell window running the server and try again, or change the port in `server/index.js`.

### "localhost doesn't open" or blank page

- Make sure both the server (Step 5) AND the dev server (Step 6) are running
- Make sure you're going to `http://localhost:5173` (not https)
- Try a different browser
- Check that no firewall is blocking localhost

### "npm install fails" or "dependency error"

Try:
```
npm cache clean --force
npm install
```

If that doesn't work, delete the `node_modules` folder and `package-lock.json`, then run `npm install` again.

### The app shows "Loading..." forever

Make sure the backend server is running (Step 5). Check the PowerShell window — if it shows errors, try stopping it (Ctrl+C) and running `npm run server` again.

---

## Features

- User authentication (signup, login, demo account)
- Onboarding flow for content preferences
- Story generator with multiple categories, tones, and lengths
- "Surprise Me" random idea generator
- Voiceover script, subtitle captions, hashtags, and post captions
- 7 ready-made templates
- Project save, search, filter, duplicate, delete
- Copy and download export options
- Freemium model with daily usage limits
- Upgrade page with pricing
- Settings with profile and preference editing
- Landing page with features, pricing, and CTA
- Dark mode, mobile-first, modern creator-style design

---

## Tech Stack

- **Frontend:** React 18, React Router, Lucide Icons, Vite
- **Backend:** Express.js, JSON file database
- **Auth:** JWT tokens, bcryptjs password hashing
- **Styling:** Custom CSS (no frameworks needed)

---

## Demo Account

- **Email:** demo@storytok.ai
- **Password:** demo123

This account comes preloaded with 3 sample projects.

---

## Connecting a Real AI API (Optional / Future)

The story generation currently uses a built-in story bank with mock content. To connect a real AI API:

1. Open `server/routes/generate.js`
2. Find the `generateStoryContent()` function
3. Replace it with API calls to OpenAI, Anthropic Claude, or any other AI service
4. Add your API key to a `.env` file (copy `.env.example` first)

The app is structured so this swap is straightforward.

---

Built with StoryTok AI.
