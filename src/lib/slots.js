/* Turning board data into things the schedule views can render. */

import { MEETING_HOURS } from "../constants.js";

/**
 * All office-hours windows across every member, each tagged with its member.
 * @returns {{day:number,start:number,end:number,where:string,member:object,memberIndex:number}[]}
 */
export const flattenSlots = (members) =>
  members.flatMap((member, memberIndex) =>
    member.slots.map((slot) => ({ ...slot, member, memberIndex })),
  );

/** Visual category of a window, used for colour coding. */
export function slotKind(slot) {
  if (slot.member?.zoom || /zoom|virtual/i.test(slot.where)) return "zoom";
  return slot.where ? "inPerson" : "tbd";
}

export const whereText = (where) => where || "Location to be confirmed";

/**
 * Pack same-day windows into side-by-side lanes so overlaps stay readable.
 *
 * Slots are first grouped into clusters of transitively-overlapping windows,
 * and lanes are counted per cluster. A window that overlaps nothing therefore
 * spans the full column width instead of being narrowed by an unrelated
 * collision elsewhere in the day.
 *
 * @returns {object[]} each slot gains `lane` and `laneCount`
 */
export function assignLanes(slots) {
  const ordered = [...slots].sort(
    (a, b) => a.start - b.start || a.end - b.end,
  );

  const clusters = [];
  let cluster = [];
  let clusterEnd = -Infinity;

  for (const slot of ordered) {
    // A gap with no overlap closes the cluster.
    if (cluster.length && slot.start >= clusterEnd) {
      clusters.push(cluster);
      cluster = [];
      clusterEnd = -Infinity;
    }
    cluster.push(slot);
    clusterEnd = Math.max(clusterEnd, slot.end);
  }
  if (cluster.length) clusters.push(cluster);

  return clusters.flatMap((group) => {
    const laneEnds = [];
    const placed = group.map((slot) => {
      let lane = laneEnds.findIndex((end) => end <= slot.start);
      if (lane < 0) {
        lane = laneEnds.length;
        laneEnds.push(0);
      }
      laneEnds[lane] = slot.end;
      return { ...slot, lane };
    });
    // Width is decided by the widest point of the cluster.
    return placed.map((slot) => ({ ...slot, laneCount: laneEnds.length }));
  });
}

/** Every bookable start time inside a window. */
export function meetingStarts(slot) {
  const starts = [];
  for (let h = slot.start; h + MEETING_HOURS <= slot.end; h += MEETING_HOURS) {
    starts.push(h);
  }
  return starts;
}

export const slotsForDay = (slots, day) => slots.filter((s) => s.day === day);

/** Two-letter fallback when a member has no headshot. */
export const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

/** public/photos/<file> resolved against the deployed base path. */
export const photoUrl = (file) =>
  file ? `${import.meta.env.BASE_URL}photos/${file}` : "";
