import { DESTINATIONS, BOOKED } from "../data/trip.js";

export function daysUntil(dateStr) {
  return Math.max(0, Math.round((new Date(dateStr) - new Date()) / 86400000));
}

/**
 * Readiness is never a magic number. It is a sum of explicit, named line items,
 * each worth a fixed weight, switched on or off by the destination's rules.
 * The UI can show exactly why the score is what it is — "why 71 and not 79".
 */
export function computeReadiness(state) {
  const { trip, checklist, bookings, docs } = state;
  const rule = DESTINATIONS[trip.destinationKey];

  const doc = (t) => docs.find((d) => d.type === t);
  const passport = doc("Passport");
  const visa = doc("Visa");
  const insurance = doc("Insurance");

  // Accommodation: does every night have a bed?
  const coveredNights = Math.min(
    trip.nights,
    bookings
      .filter((b) => b.type === "Hotel" && BOOKED.includes(b.status))
      .reduce((s, b) => s + (b.nights || 0), 0)
  );
  const accomFrac = trip.nights ? coveredNights / trip.nights : 1;

  // Outbound flight (or any outbound transit) booked
  const outbound = bookings.find((b) => b.outbound);
  const flightFrac = outbound && BOOKED.includes(outbound.status) ? 1 : 0;

  // Essential pre-trip tasks
  const essTasks = checklist.filter((t) => t.essential);
  const essDone = essTasks.filter((t) => t.done).length;
  const taskFrac = essTasks.length ? essDone / essTasks.length : 1;

  // Lead time
  const days = daysUntil(trip.start);
  const bufferFrac = Math.min(1, days / trip.planningWindowDays);

  const lines = [];
  const add = (label, weight, frac, opts = {}) =>
    lines.push({ label, weight, frac: Math.max(0, Math.min(1, frac)), ...opts });

  // Lines switch on based on destination — domestic trips don't ask for a visa.
  if (rule.international)
    add("Passport valid 6+ months", 14, passport?.uploaded ? 1 : 0, {
      required: true, why: "International trip",
    });
  if (rule.visaRequired)
    add("Visa obtained", 15, visa?.uploaded ? 1 : 0, {
      required: true, why: `${rule.label} requires a visa`,
    });
  if (rule.international)
    add("Travel insurance", 11, insurance?.uploaded ? 1 : 0, {
      required: true, why: "Recommended for any international trip",
    });

  add("Outbound flight booked", 18, flightFrac, {
    detail: outbound ? outbound.title : "No outbound leg yet",
  });
  add("Every night has a bed", 18, accomFrac, {
    detail: `${coveredNights} of ${trip.nights} nights covered`,
  });
  add("Essential tasks done", 14, taskFrac, {
    detail: `${essDone} of ${essTasks.length} complete`,
  });
  add("Comfortable lead time", 10, bufferFrac, {
    detail: `${days} days out · target ${trip.planningWindowDays}`,
  });

  const totalWeight = lines.reduce((s, l) => s + l.weight, 0);
  const earned = lines.reduce((s, l) => s + l.weight * l.frac, 0);
  const score = Math.round((earned / totalWeight) * 100);

  // The single most useful unmet item — what to do next.
  const next = [...lines]
    .filter((l) => l.frac < 1)
    .sort((a, b) => b.weight * (1 - b.frac) - a.weight * (1 - a.frac))[0];

  return { score, lines, totalWeight, nextUp: next };
}
