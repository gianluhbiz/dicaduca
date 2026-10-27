import { useEffect, useState } from "react";

// Orari da Google Maps (ottobre 2026). Minuti dalla mezzanotte, ora di Roma.
type Slot = [number, number];
const LUNCH: Slot = [12 * 60, 14 * 60 + 30];
const LUNCH_MON: Slot = [12 * 60 + 30, 14 * 60 + 30];
const DINNER: Slot = [18 * 60, 22 * 60 + 30];

export const HOURS: Slot[][] = [
  [LUNCH, DINNER], // domenica
  [LUNCH_MON, DINNER], // lunedì
  [LUNCH, DINNER],
  [LUNCH, DINNER],
  [LUNCH, DINNER],
  [LUNCH, DINNER],
  [LUNCH, DINNER], // sabato
];

export const DAY_NAMES = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
export const DAY_SHORT = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];

export const fmt = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export type RomeNow = { day: number; minutes: number; date: Date };

export function romeNow(): RomeNow {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")), date: new Date() };
}

export function useRomeNow() {
  const [now, setNow] = useState(romeNow);
  useEffect(() => {
    const id = window.setInterval(() => setNow(romeNow()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function getStatus({ day, minutes }: RomeNow) {
  const today = HOURS[day];
  const current = today.find(([a, b]) => minutes >= a && minutes < b);
  if (current) {
    const left = current[1] - minutes;
    return {
      open: true,
      short: "Aperto ora",
      detail: left <= 45 ? `chiude tra ${left} min` : `fino alle ${fmt(current[1])}`,
    };
  }
  const next = today.find(([a]) => a > minutes);
  if (next) return { open: false, short: "Chiuso ora", detail: `riapre alle ${fmt(next[0])}` };
  const tomorrow = HOURS[(day + 1) % 7][0];
  return { open: false, short: "Chiuso ora", detail: `apre domani alle ${fmt(tomorrow[0])}` };
}

export type Moment = "pranzo" | "aperitivo" | "cena" | null;

export function getMoment({ minutes }: RomeNow): Moment {
  if (minutes >= 12 * 60 && minutes < 14 * 60 + 30) return "pranzo";
  if (minutes >= 18 * 60 && minutes < 20 * 60) return "aperitivo";
  if (minutes >= 20 * 60 && minutes < 22 * 60 + 30) return "cena";
  return null;
}
