# ALPFA Board Office Hours

Static site where Notre Dame students book 30 minutes with an ALPFA board
member. React + Vite, deployed to GitHub Pages.

## Running it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the built site
```

## Updating the site

Almost everything lives in **`src/data/members.js`** — names, roles, emails,
LinkedIn URLs, bios, and weekly office-hours windows. The file header explains
every field. Add headshots to `public/photos/`.

## Layout

```
src/
  constants.js          days, timezone, grid bounds, Drive link
  data/members.js       board roster — the file you edit most
  lib/
    time.js             hour formatting, upcoming dates, calendar stamps
    slots.js            flattening, lane packing, photo + initials helpers
    calendar.js         Google Calendar URL and .ics builders
  components/           one .jsx + matching .css per component
  styles/
    tokens.css          colours, fonts, radii — theme the site from here
    base.css            resets and shared elements
  App.jsx               tab state, booking state, layout
```

## How booking actually works

The site has no backend and sends no email. "Add to Google Calendar" opens a
prefilled event in the student's own calendar with the board member as a guest
— the student still has to press **Save** and then **Send invitations** for the
board member to hear about it. The `.ics` download creates a personal calendar
entry and notifies nobody.

Because nothing is recorded, two students can book the same time. Within
`nd.edu`, a student can see the board member's free/busy under "Find a Time"
on the Google event page, but nothing forces them to look.
