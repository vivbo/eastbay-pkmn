# East Bay Pokémon TCG Events

A single-page website showing Pokémon TCG events within ~25 miles of Oakland:
a month **calendar**, a **This Week's Events** feed, and an **Upcoming Cups &
Challenges** feed.

Events come from two places:

1. **pokedata.ovh** — official sanctioned events (Cups, Challenges, prereleases)
2. **Your hand-kept list** — weekly friendlies at favorite shops that pokedata
   doesn't track (Victory Point, Games of Berkeley, The Experience Share)

---

## 📂 What each file is

| File | What it's for | Do you edit it? |
|------|---------------|-----------------|
| `index.html` | The page itself | Rarely |
| `styles.css` | Colors and layout | Only to restyle |
| `app.js` | The logic (calendar + feeds) | No |
| `recurring.js` | **Your weekly friendlies** | **Yes — by hand** |
| `shops.js` | **Where each shop's events link to** | **Yes — to add/fix links** |
| `data.js` | Auto-made from the pokedata CSV | No (it's generated) |
| `build-data.js` | Converts the CSV into `data.js` | No |
| `export_events.csv` | The file you download from pokedata | Replace it |
| `server.js` | Local preview helper only | No |

---

## 🔄 To update the official events (the pokedata side)

1. Go to <https://pokedata.ovh/events/>, set the location filter around Oakland
   and a ~25 mile radius, then click **Export as CSV**.
2. Save that file into this folder, replacing `export_events.csv`.
3. Open Terminal in this folder and run:

   ```bash
   node build-data.js
   ```

   You'll see something like `✓ Converted 23 events…`.
4. Refresh the website. Done.

> 💡 If a Terminal command feels fiddly, just send me the new CSV and I'll
> regenerate it for you.

## ✋ To add or change a weekly friendly

Open `recurring.js` and follow the comments — copy a block, change the shop,
weekday, time, and link. No command needed; just refresh the page.

---

## 🔗 To change where a shop's events link

pokedata doesn't give us per-event sign-up links, so each event opens that
shop's own event/calendar page instead. Those links live in `shops.js` —
open it and follow the comments to add or fix one. Any shop not listed there
falls back to a Google Map of its address.

---

## 👀 To preview it on your own computer

Easiest: **double-click `index.html`** — it opens right in your browser.

(Optional, if you ever want it at a real web address locally: run
`node server.js` and visit <http://localhost:8127>.)

---

## 🌐 To publish it as a free public link (GitHub Pages)

1. Create a new repository on GitHub (e.g. `east-bay-pokemon-events`).
2. Upload everything in this folder to it.
3. In the repo: **Settings → Pages → Build and deployment**, set
   **Source = Deploy from a branch**, branch **main**, folder **/ (root)**.
4. Wait ~1 minute. Your site will be live at
   `https://vivbo.github.io/east-bay-pokemon-events/`.

> ⚠️ Note: GitHub Pages shows whatever you uploaded. To update the live site
> after refreshing events, re-upload the changed files (`data.js`, and
> `recurring.js` if you edited it).

---

## A note on accuracy

pokedata caches event data and notes that some details change afterward, and
weekly friendly times are best guesses. Every event links out to the shop's
page or a map so visitors can confirm before showing up.
