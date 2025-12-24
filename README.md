# NoMoreBS 🎯

A mobile-first, satirical todo list and Pomodoro timer app that calls out your procrastination (gently or aggressively, your choice).

Built with vanilla HTML, CSS, JavaScript, Tailwind CSS, and Supabase.

## ✨ Features

- 🔐 **Email Magic Link Authentication** via Supabase
- ✅ **Todo Management** with real-time sync
- ⏱️ **Pomodoro Timer** (25-minute sessions)
- 😈 **Adjustable Satire Engine** (0-3 levels)
- 🔞 **Optional Strong Language** (requires explicit opt-in)
- 📱 **Mobile-First Design**
- 🌙 **Dark Mode UI**
- 🔒 **Row-Level Security** for user data

## 🚀 Quick Start

### Prerequisites

- A [Supabase](https://supabase.com) account and project
- A web server (local dev server, Vercel, Netlify, etc.)

### 1. Clone or Download

```bash
git clone <your-repo-url>
cd NoMoreBS
```

### 2. Set Up Supabase

#### Create Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Todos Table
CREATE TABLE todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own todos"
    ON todos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos"
    ON todos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
    ON todos FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
    ON todos FOR DELETE
    USING (auth.uid() = user_id);
```

#### Configure Authentication

1. Go to **Authentication > Providers** in Supabase
2. Enable **Email** provider
3. Configure email templates (optional)
4. Set **Site URL** to your deployment URL (e.g., `https://your-app.vercel.app`)
5. Add **Redirect URLs**: `https://your-app.vercel.app/dashboard.html`

### 3. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Environment Variables

#### Option A: Local Development (Recommended for Testing)

Edit the `env-config.js` file with your credentials:

```javascript
// env-config.js (already created - just edit it!)
window.ENV = {
    SUPABASE_URL: 'https://xxxxxxxxxxxxx.supabase.co',  // Your Project URL
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'  // Your anon key
};
```

**Note**: This file is already linked in all HTML files and is gitignored for safety.

#### Option B: Vercel Deployment

1. Go to your Vercel project settings
2. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Create `vercel.json`:

```json
{
  "build": {
    "env": {
      "SUPABASE_URL": "@supabase_url",
      "SUPABASE_ANON_KEY": "@supabase_anon_key"
    }
  }
}
```

4. Create an inject script or use Vercel's environment variable injection

#### Option C: Netlify Deployment

1. Go to Site settings > Build & deploy > Environment
2. Add variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Create `netlify.toml`:

```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

4. Add env injection to your build process

### 5. Run Locally

Use any static file server:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve

# VS Code Live Server extension
# Right-click index.html > Open with Live Server
```

Navigate to `http://localhost:8000`

## 📁 Project Structure

```
NoMoreBS/
├── index.html              # Landing/redirect page
├── login.html              # Authentication page
├── dashboard.html          # Main app (protected)
├── js/
│   ├── supabase.js        # Supabase client initialization
│   ├── auth.js            # Authentication logic
│   ├── todos.js           # Todo CRUD operations
│   ├── timer.js           # Pomodoro timer
│   └── satire.js          # Satirical message generator
├── .env.example           # Environment variable template
└── README.md              # This file
```

## 🎭 Satire Levels

The app includes an adjustable "attitude" system:

| Level | Description | Language |
|-------|-------------|----------|
| **0** | Polite | "Good job! You completed a focused work session." |
| **1** | Mildly Disappointed | "Oh, you actually finished? Color me impressed." |
| **2** | Sarcastic | "Breaking: Local procrastinator completes one (1) task." |
| **3** | Aggressive | Requires profanity toggle to be ON |

**Strong Language Toggle:**
- OFF by default
- Only unlocks harsh language at Level 3
- Shows disclaimer when enabled

## 🔒 Security Notes

- ✅ Supabase credentials use environment variables
- ✅ Row-Level Security enabled on database
- ✅ No hardcoded secrets in repository
- ✅ Email magic links (no password storage)
- ⚠️ Ensure `.env` is in `.gitignore` (if using local .env files)

## 🛠️ Customization

### Change Timer Duration

Edit `timer.js`:

```javascript
let timeRemaining = 25 * 60; // Change 25 to your preferred minutes
```

### Add More Satirical Messages

Edit `satire.js` and add to the `messages` object.

### Modify Styling

The app uses Tailwind CSS via CDN. Customize classes directly in HTML files or add custom CSS.

## 📱 Mobile Support

The app is fully responsive and touch-optimized:
- Large tap targets (48px minimum)
- Single-column layout
- No hover-dependent features
- Works on iOS Safari, Chrome Mobile, etc.

## 🐛 Troubleshooting

### "Error loading tasks"

- Check Supabase credentials
- Verify RLS policies are set correctly
- Check browser console for errors

### Magic link not received

- Check spam folder
- Verify email provider settings in Supabase
- Check Supabase logs

### "Session expired" errors

- Supabase sessions last 1 hour by default
- Users will need to re-authenticate
- Adjust in Supabase dashboard if needed

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

This is an open-source project. Contributions welcome!

1. Fork the repo
2. Create a feature branch
3. Submit a pull request

---

**Built with frustration and Tailwind CSS** 💜
