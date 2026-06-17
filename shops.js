/*
 * shops.js
 * -----------------------------------------------------------------------------
 * Where each shop's events should link to.
 *
 * The pokedata data doesn't include per-event registration links, so instead we
 * send people to each shop's own event/calendar page (the best place to confirm
 * details and sign up). This file is the lookup table for that.
 *
 * HOW IT WORKS:
 *   The key on the left is the shop's name EXACTLY as it appears in the data
 *   (pokedata writes them in CAPITAL LETTERS). The value on the right is the
 *   page to open when someone clicks one of that shop's events.
 *
 *   Any shop NOT listed here automatically falls back to a Google Maps link,
 *   so nothing ever breaks — you just won't get the nicer calendar page.
 *
 * TO ADD / FIX A LINK:
 *   Find the shop's name in the calendar, copy it exactly (capitals and all),
 *   and add a line like:   "SHOP NAME": "https://their-events-page",
 * -----------------------------------------------------------------------------
 */

window.SHOP_LINKS = {
  "VERSUS GAMES": "https://www.versusgamessf.com/events/",
  "GAMESCAPE NORTH": "https://www.gamescape-north.com/service/events/",
  "THE GAME PARLOUR": "https://thegameparloursf.square.site/shop/23",
  "GAME POST OF SAN FRANCISCO": "https://sfgamepost.com/",
  // Golden Gate Games has no web calendar — Facebook is their event hub.
  "GOLDEN GATE GAMES": "https://www.facebook.com/p/Golden-Gate-Games-61578583076737/",
  // Gamers Guild of Pleasant Hill is a new shop with no public calendar page
  // yet, so it falls back to a Google Map. Add a link here once they have one.
};
