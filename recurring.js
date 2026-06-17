/*
 * recurring.js
 * -----------------------------------------------------------------------------
 * YOUR FAVORITE WEEKLY FRIENDLIES — edit this file by hand whenever you like.
 *
 * These are the recurring league nights that DON'T show up on pokedata
 * (they aren't registered as official sanctioned events). We list each one
 * once here, and the website automatically projects it onto every upcoming
 * week of the calendar for you.
 *
 * TO ADD A NEW SHOP: copy one block below, paste it, and fill in the details.
 *   - weekday:  0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday,
 *               4=Thursday, 5=Friday, 6=Saturday
 *   - time:     start time in 24-hour "HH:MM" format (e.g. "18:00" = 6 PM)
 *   - link:     the shop's events page (where people RSVP / get details)
 * -----------------------------------------------------------------------------
 */

window.RECURRING_EVENTS = [
  {
    // Confirmed: their TCG page says "7pm every Monday", $12 entry, 3-round Swiss.
    name: "Monday Pokémon League",
    shop: "Victory Point Cafe",
    city: "Berkeley",
    weekday: 1, // Monday
    time: "19:00", // 7:00 PM
    link: "https://www.victorypointcafe.com/pages/trading-card-games",
  },
  {
    // Confirmed: Thursday league night at 6 PM.
    name: "Thursday Pokémon League",
    shop: "Games of Berkeley",
    city: "Berkeley",
    weekday: 4, // Thursday
    time: "18:00", // 6:00 PM
    link: "https://gamesofberkeley.com/products/calendar-and-event-info",
  },
  {
    // Confirmed from their Google Calendar: Pokémon League every Friday,
    // 6:30–9:30 PM. (Check-in opens 30 min before, at 6:00 PM.)
    name: "Friday Pokémon League",
    shop: "The Experience Share",
    city: "Alameda",
    weekday: 5, // Friday
    time: "18:30", // 6:30 PM
    link: "https://expsharegames.com/events/",
  },
];
