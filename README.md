<div align="center">

<img width="385" height="206" alt="LOGO" src="https://github.com/user-attachments/assets/a2de034c-6080-471f-83c6-e7d17dba3ecc" />


<br>
<br>
<br>
<br>

<a href="https://nomorebs.vercel.app/">GET BACK TO FUCKING WORK!</a>

<br>
<br>

</div>


# Why are you even reading this?

Are you looking for a "gentle" productivity app? A "mindful" meditation tool? A "supportive" community? 

**FUCK OFF.**

NoMoreBS is for people who are tired of being lazy pieces of shit. We don't do "positive reinforcement." We do "brutal honesty."

### Features:
- **Focus Timer:** A timer that insults you if you stop.
- **Task List:** A list of things you'll probably fail to do.
- **Satire Levels:** From "Mild Disappointment" to "Total Emotional Destruction."
- **Zero Support:** If you have a problem, it's probably your fault.

### How to use:
1. Stop being a loser.
2. Open the app.
3. Do your fucking work.

### Installation:
If you're too stupid to figure out how to run a basic web app, you're exactly why this app exists.

1. **Clone the repo** (if you can figure out how to use git).
2. **Create a Supabase project** at [supabase.com](https://supabase.com).
3. **Set up your keys:** Open `env-config.js` and paste your URL and Anon Key. If you commit these keys to a public repo, you deserve to have your database deleted.
4. **Enable Auth:** Enable Email/Password auth in Supabase.
5. **Create the Table:** Run this SQL in your Supabase SQL Editor:
   ```sql
   create table todos (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references auth.users not null,
     title text not null,
     completed boolean default false,
     deadline timestamp with time zone,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   alter table todos enable row level security;
   create policy "Users can manage their own todos" on todos for all using (auth.uid() = user_id);
   ```
6. **Open index.html** and stop being a loser.

---

*Disclaimer: If you're offended, good. That's the point. Now go do something useful for once.*

## Contributing (If you're not useless)

Think you're funny? Think you can hurt feelings better than I can? Prove it.

We're looking for:
- **More Insults:** The current ones are getting too "nice." We need stuff that actually makes people want to delete their accounts.
- **Hostile Features:** Anything that makes the user experience more miserable and productive.
- **Bug Fixes:** If you find a bug, fix it yourself. Don't open an issue like a little bitch.

**How to contribute:**
1. Fork this repo (if you even know how).
2. Add your creative verbal abuse.
3. Open a Pull Request.
4. If your insults are weak, I'll close it and block you.

Now go away.
