/*
 * app.js
 * -----------------------------------------------------------------------------
 * The logic that builds the page: it combines the two data sources, draws the
 * calendar, and fills the two feeds underneath it.
 *
 * Data comes from two files loaded before this one (see index.html):
 *   - window.SANCTIONED_EVENTS  (generated from pokedata by build-data.js)
 *   - window.RECURRING_EVENTS   (your hand-kept weekly friendlies)
 * -----------------------------------------------------------------------------
 */

// Friendly, human labels for each category (used on chips and legends).
const CATEGORY_LABELS = {
  cup: "League Cup",
  challenge: "League Challenge",
  prerelease: "Prerelease",
  friendly: "Weekly Friendly",
  other: "Event",
};

// --- Helpers --------------------------------------------------------------

// Turn "2026-06-28" + "12:00" into a real Date the browser can sort/compare.
function toDate(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr || "00:00"}:00`);
}

// Format a Date as "YYYY-MM-DD" (used as a key to group events by day).
function dayKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/*
 * Decide where clicking an event should go.
 *   - Weekly friendlies already carry the shop's own link (from recurring.js).
 *   - pokedata events look up the shop's events page in shops.js; if the shop
 *     isn't listed there, we fall back to the Google Maps link in the data.
 */
function eventLink(ev) {
  const shopName = (ev.shop || "").toUpperCase().trim();
  const lookup = window.SHOP_LINKS || {};
  return lookup[shopName] || ev.link;
}

// Pretty time like "6:00 PM" from "18:00".
function prettyTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

/*
 * Expand each recurring weekly friendly into real dated events.
 * We project them from the start of last week through ~12 weeks ahead so they
 * fill the calendar and feeds as the user clicks forward through months.
 */
function expandRecurring(list) {
  const events = [];
  const start = new Date();
  start.setDate(start.getDate() - 7); // include last week (for back-navigation)
  start.setHours(0, 0, 0, 0);

  for (let dayOffset = 0; dayOffset < 7 * 13; dayOffset++) {
    const day = new Date(start);
    day.setDate(start.getDate() + dayOffset);

    list.forEach((item) => {
      if (day.getDay() === item.weekday) {
        events.push({
          category: "friendly",
          typeLabel: "Weekly Friendly",
          name: item.name,
          shop: item.shop,
          city: item.city,
          address: "",
          date: dayKey(day),
          time: item.time,
          link: item.link,
          source: "recurring",
        });
      }
    });
  }
  return events;
}

// Build the single combined list the whole page works from.
const ALL_EVENTS = [
  ...(window.SANCTIONED_EVENTS || []),
  ...expandRecurring(window.RECURRING_EVENTS || []),
];

// Group events by day so the calendar can look up "what's on June 28?" fast.
const EVENTS_BY_DAY = {};
ALL_EVENTS.forEach((ev) => {
  if (!EVENTS_BY_DAY[ev.date]) EVENTS_BY_DAY[ev.date] = [];
  EVENTS_BY_DAY[ev.date].push(ev);
});

// --- Calendar -------------------------------------------------------------

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// We track which month is currently shown. Starts on today's month.
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth(); // 0 = January

function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  const title = document.getElementById("calendar-title");
  grid.innerHTML = ""; // clear whatever was there before

  title.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

  // Weekday header row (Sun–Sat).
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((label) => {
    const cell = document.createElement("div");
    cell.className = "weekday-label";
    cell.textContent = label;
    grid.appendChild(cell);
  });

  // Figure out where the month starts and how long it is.
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay(); // 0=Sun ... 6=Sat
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const todayKey = dayKey(new Date());

  // Empty filler cells so day 1 lands under the right weekday.
  for (let i = 0; i < startWeekday; i++) {
    const blank = document.createElement("div");
    blank.className = "day-cell empty";
    grid.appendChild(blank);
  }

  // One cell per day of the month.
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "day-cell";

    const thisKey = dayKey(new Date(viewYear, viewMonth, day));
    if (thisKey === todayKey) cell.classList.add("today");

    const number = document.createElement("div");
    number.className = "day-number";
    number.textContent = day;
    cell.appendChild(number);

    // Add a clickable chip for each event happening on this day.
    const dayEvents = (EVENTS_BY_DAY[thisKey] || []).sort((a, b) =>
      (a.time || "").localeCompare(b.time || "")
    );
    dayEvents.forEach((ev) => {
      const chip = document.createElement("a");
      chip.className = `event-chip cat-${ev.category}`;
      chip.href = eventLink(ev);
      chip.target = "_blank"; // open the shop/map in a new tab
      chip.rel = "noopener";
      chip.title = `${ev.name} · ${ev.shop} · ${prettyTime(ev.time)}`;
      chip.textContent = `${prettyTime(ev.time)} ${ev.shop}`;
      cell.appendChild(chip);
    });

    grid.appendChild(cell);
  }
}

// Month navigation buttons.
function changeMonth(delta) {
  viewMonth += delta;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear--;
  } else if (viewMonth > 11) {
    viewMonth = 0;
    viewYear++;
  }
  renderCalendar();
}

// --- Feeds ----------------------------------------------------------------

// Build one row in a feed list.
function feedItem(ev) {
  const li = document.createElement("li");
  li.className = "feed-item";

  const date = toDate(ev.date, ev.time);
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const monthDay = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  li.innerHTML = `
    <div class="feed-date">
      <span class="feed-weekday">${weekday}</span>
      <span class="feed-monthday">${monthDay}</span>
    </div>
    <div class="feed-body">
      <span class="feed-tag cat-${ev.category}">${CATEGORY_LABELS[ev.category]}</span>
      <a class="feed-name" href="${eventLink(ev)}" target="_blank" rel="noopener">${ev.name}</a>
      <div class="feed-meta">${ev.shop}${ev.city ? " · " + ev.city : ""} · ${prettyTime(ev.time)}</div>
    </div>
  `;
  return li;
}

// FEED 1: This Week's Events — from today through the end of this week (Sun).
function renderThisWeek() {
  const list = document.getElementById("this-week-list");
  const empty = document.getElementById("this-week-empty");
  list.innerHTML = "";

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  // End of the current week = upcoming Sunday at 23:59.
  const endOfWeek = new Date(startOfToday);
  const daysUntilSunday = 7 - now.getDay() === 7 ? 0 : 7 - now.getDay();
  endOfWeek.setDate(startOfToday.getDate() + daysUntilSunday);
  endOfWeek.setHours(23, 59, 59, 999);

  const events = ALL_EVENTS.filter((ev) => {
    const when = toDate(ev.date, ev.time);
    return when >= startOfToday && when <= endOfWeek;
  }).sort((a, b) => toDate(a.date, a.time) - toDate(b.date, b.time));

  events.forEach((ev) => list.appendChild(feedItem(ev)));
  empty.style.display = events.length ? "none" : "block";
}

// FEED 2: Upcoming Cups & Challenges — only those two types, future-dated.
function renderCupsAndChallenges() {
  const list = document.getElementById("cups-list");
  const empty = document.getElementById("cups-empty");
  list.innerHTML = "";

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const events = ALL_EVENTS.filter((ev) => {
    const isCupOrChallenge =
      ev.category === "cup" || ev.category === "challenge";
    return isCupOrChallenge && toDate(ev.date, ev.time) >= startOfToday;
  }).sort((a, b) => toDate(a.date, a.time) - toDate(b.date, b.time));

  events.forEach((ev) => list.appendChild(feedItem(ev)));
  empty.style.display = events.length ? "none" : "block";
}

// --- Start it all up ------------------------------------------------------
document.getElementById("prev-month").addEventListener("click", () => changeMonth(-1));
document.getElementById("next-month").addEventListener("click", () => changeMonth(1));

renderCalendar();
renderThisWeek();
renderCupsAndChallenges();
