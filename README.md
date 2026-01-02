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

If you're looking for a "gentle" productivity app or some "mindful" meditation bullshit, **FUCK OFF.**

NoMoreBS is for people who are tired of being lazy pieces of shit. We don't do "positive reinforcement." We do "brutal honesty." If you can't handle being yelled at by a script, go back to your coloring books.

### What's inside (if you care):
*   **The Timer:** It insults you. If you stop, it insults you more.
*   **The Task List:** A graveyard for all the things you'll never actually finish.
*   **Truth-Check:** Don't try to lie about finishing a task. The app will call you out on your bullshit.
*   **Parental Shame:** There's a 10% chance you'll get a "disappointed email from parents" if you reset the timer. Just like real life.
*   **Snowflake Mode:** For the fragile ones. It turns the app pink and uses Comic Sans before it eventually crashes because it can't stand your cowardice.
*   **PWA:** You can install this on your phone. Now you can be a failure anywhere.

### Setup for Morons

If you clone this and the screen turns red calling you an idiot, it's because you didn't set up your Supabase keys. 

1. Go to [Supabase](https://supabase.com). Get your keys.
2. Put them in `env-config.js`. 
3. **DON'T COMMIT YOUR KEYS.** I added it to `.gitignore` because I know you're incompetent, but try to pay attention.

### Deployment (The "Pro" Way)

If you're using Vercel/Netlify, don't edit the file like a caveman. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to your env vars and set your build command to:

`printf "window.ENV = { SUPABASE_URL: '%%s', SUPABASE_ANON_KEY: '%%s' };" "$SUPABASE_URL" "$SUPABASE_ANON_KEY" > env-config.js`

---

## Contributing (Don't be useless)

Think you're funny? Prove it. 

*   **More Insults:** The current ones are too nice. We need stuff that makes people want to delete their accounts.
*   **Hostile Features:** Anything that makes the user experience more miserable and productive.
*   **Bug Fixes:** If you find a bug, fix it. Don't open an issue like a little bitch.

Fork it, add your verbal abuse, and open a PR. If your insults are weak, I'll block you.

Now go do something useful for once.
