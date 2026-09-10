/* Site-wide constants. Values that are not board data live here. */

export const DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

/** IANA timezone used for every generated calendar event. */
export const TZ = "America/Indiana/Indianapolis";

/** Vertical bounds of the week grid, in 24h decimal hours. */
export const DAY_START = 10;
export const DAY_END = 21;

/** Pixel height of one hour in the week grid. */
export const HOUR_PX = 72;

/** Every office-hours booking is this long, in hours. */
export const MEETING_HOURS = 0.5;

/** How many upcoming occurrences of a weekday the date picker offers. */
export const DATE_OPTIONS = 8;

/** Below this width the week grid is replaced by the stacked agenda list. */
export const MOBILE_BREAKPOINT = 820;

export const DRIVE_URL =
  "https://drive.google.com/drive/folders/0AAES8M6u7VtnUk9PVA";

export const TABS = [
  { id: "schedule", label: "Schedule" },
  { id: "board", label: "Meet the board" },
];
