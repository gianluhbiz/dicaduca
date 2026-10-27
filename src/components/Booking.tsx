import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { SITE } from "../data/site";
import { DAY_NAMES, DAY_SHORT, HOURS, fmt, romeNow } from "../lib/hours";
import { EASE_OUT, useMediaQuery } from "../lib/hooks";
import { btnPrimary } from "./ui";

type Ctx = { open: (note?: string) => void; close: () => void; isOpen: boolean };
const BookingCtx = createContext<Ctx>({ open: () => {}, close: () => {}, isOpen: false });

// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => useContext(BookingCtx);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; note?: string }>({ open: false });
  const open = useCallback((note?: string) => setState({ open: true, note }), []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const value = useMemo(() => ({ open, close, isOpen: state.open }), [open, close, state.open]);
  return (
    <BookingCtx.Provider value={value}>
      {children}
      <BookingSheet open={state.open} note={state.note} onClose={close} />
    </BookingCtx.Provider>
  );
}

function BookingSheet({ open, note, onClose }: { open: boolean; note?: string; onClose: () => void }) {
  const desktop = useMediaQuery("(min-width: 768px)");
  const controls = useDragControls();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("button, input")?.focus(), 350);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  const hidden = desktop ? { x: "100%" } : { y: "100%" };
  const shown = desktop ? { x: "0%" } : { y: "0%" };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Prenota un tavolo">
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            initial={hidden}
            animate={shown}
            exit={{ ...hidden, transition: { duration: 0.25, ease: EASE_OUT } }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.12 }}
            drag={desktop ? false : "y"}
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-[2rem] bg-ink-2 text-cream ring-1 ring-cream/10 md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[460px] md:rounded-none md:rounded-l-[2rem]"
          >
            <div
              onPointerDown={(e) => controls.start(e)}
              className="flex shrink-0 touch-none items-center justify-between px-6 pt-3 pb-2 md:pt-6"
            >
              <span className="mx-auto h-1.5 w-10 rounded-full bg-cream/25 md:hidden" />
            </div>
            <div className="flex items-start justify-between px-6">
              <div>
                <p className="font-display text-4xl font-extrabold uppercase leading-none">Prenota</p>
                <p className="mt-1 text-sm text-cream/60">Ti confermiamo il tavolo su WhatsApp.</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Chiudi"
                className="grid size-11 cursor-pointer place-items-center rounded-full bg-cream/10 text-xl transition-transform duration-150 active:scale-95"
              >
                <i className="ri-close-line" />
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain px-6 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              <BookingForm initialNote={note} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function buildSlots(day: number) {
  const [lunch, dinner] = HOURS[day];
  const out = { pranzo: [] as number[], sera: [] as number[] };
  for (let m = lunch[0]; m <= lunch[1] - 30; m += 30) out.pranzo.push(m);
  for (let m = dinner[0]; m <= dinner[1] - 30; m += 30) out.sera.push(m);
  return out;
}

export function BookingForm({ initialNote = "" }: { initialNote?: string }) {
  const uid = useId();
  const [now] = useState(romeNow);
  const [people, setPeople] = useState(2);
  const [offset, setOffset] = useState(0);
  const [slot, setSlot] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState(initialNote);
  const [errors, setErrors] = useState<{ slot?: string; name?: string }>({});
  const [sent, setSent] = useState(false);

  const days = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const d = new Date(now.date.getTime() + i * 86_400_000);
        const wd = (now.day + i) % 7;
        return {
          i,
          wd,
          label: i === 0 ? "Oggi" : i === 1 ? "Domani" : DAY_SHORT[wd],
          num: d.getDate(),
          full: `${DAY_NAMES[wd].toLowerCase()} ${d.getDate()} ${d.toLocaleDateString("it-IT", { month: "long" })}`,
        };
      }),
    [now],
  );
  const day = days[offset];
  const slots = buildSlots(day.wd);
  const isPast = (m: number) => offset === 0 && m <= now.minutes + 30;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (slot === null) errs.slot = "Scegli un orario.";
    if (!name.trim()) errs.name = "Scrivi il nome per la prenotazione.";
    setErrors(errs);
    if (Object.keys(errs).length || slot === null) return;
    const msg = [
      "Ciao Dicaduca! Vorrei prenotare un tavolo:",
      `• ${people} ${people === 1 ? "persona" : "persone"}`,
      `• ${day.full}, ore ${fmt(slot)}`,
      `• Nome: ${name.trim()}`,
      note.trim() ? `• Note: ${note.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="rounded-3xl bg-oliva-deep/60 p-6 ring-1 ring-cream/10"
      >
        <i className="ri-checkbox-circle-fill text-4xl text-senape" />
        <p className="mt-3 font-display text-3xl font-extrabold uppercase">Richiesta pronta</p>
        <p className="mt-2 text-cream/75">
          Invia il messaggio su WhatsApp: ti rispondiamo con la conferma. Se la chat non si è aperta, chiamaci al{" "}
          <a href={SITE.phoneHref} className="font-semibold text-senape underline">
            {SITE.phone}
          </a>
          .
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-5 cursor-pointer text-sm font-semibold underline underline-offset-4"
        >
          Modifica la richiesta
        </button>
      </motion.div>
    );
  }

  const chip = (active: boolean, disabled = false) =>
    `h-11 min-w-11 shrink-0 rounded-full px-4 text-[15px] font-medium transition-[background-color,color,transform] duration-150 ease-out-strong active:scale-[0.96] ${
      disabled
        ? "cursor-not-allowed text-cream/25 line-through"
        : active
          ? "cursor-pointer bg-senape text-ink"
          : "cursor-pointer bg-cream/8 text-cream hover:bg-cream/15"
    }`;

  return (
    <form onSubmit={submit} noValidate className="min-w-0 space-y-6 [&_fieldset]:min-w-0">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-cream/70">Quante persone?</legend>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Una persona in meno"
            onClick={() => setPeople((p) => Math.max(1, p - 1))}
            className="grid size-12 cursor-pointer place-items-center rounded-full bg-cream/10 text-xl transition-transform duration-150 active:scale-95"
          >
            <i className="ri-subtract-line" />
          </button>
          <output aria-live="polite" className="w-16 text-center font-display text-5xl font-extrabold tabular-nums">
            {people}
          </output>
          <button
            type="button"
            aria-label="Una persona in più"
            onClick={() => setPeople((p) => Math.min(40, p + 1))}
            className="grid size-12 cursor-pointer place-items-center rounded-full bg-cream/10 text-xl transition-transform duration-150 active:scale-95"
          >
            <i className="ri-add-line" />
          </button>
          {people >= 12 && <span className="text-sm text-senape">Tavolata! Ti richiamiamo noi.</span>}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-cream/70">Quando?</legend>
        <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6">
          {days.map((d) => (
            <button
              type="button"
              key={d.i}
              onClick={() => {
                setOffset(d.i);
                setSlot(null);
              }}
              aria-pressed={offset === d.i}
              className={`${chip(offset === d.i)} flex flex-col items-center justify-center h-16! px-3! leading-tight`}
            >
              <span className="text-xs uppercase opacity-70">{d.label}</span>
              <span className="font-display text-xl font-bold">{d.num}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset aria-describedby={errors.slot ? `${uid}-slot` : undefined}>
        <legend className="mb-2 text-sm font-semibold text-cream/70">A che ora?</legend>
        {(["pranzo", "sera"] as const).map((k) => (
          <div key={k} className="mb-3">
            <p className="mb-1.5 text-xs uppercase tracking-[0.18em] text-cream/45">
              {k === "pranzo" ? "Pranzo" : "Aperitivo e cena"}
            </p>
            <div className="flex flex-wrap gap-2">
              {slots[k].map((m) => (
                <button
                  type="button"
                  key={m}
                  disabled={isPast(m)}
                  aria-pressed={slot === m}
                  onClick={() => {
                    setSlot(m);
                    setErrors((er) => ({ ...er, slot: undefined }));
                  }}
                  className={chip(slot === m, isPast(m))}
                >
                  {fmt(m)}
                </button>
              ))}
            </div>
          </div>
        ))}
        {errors.slot && (
          <p id={`${uid}-slot`} className="text-sm text-[#f08a7e]">
            {errors.slot}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor={`${uid}-name`} className="mb-2 block text-sm font-semibold text-cream/70">
          Nome
        </label>
        <input
          id={`${uid}-name`}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) setErrors((er) => ({ ...er, name: undefined }));
          }}
          autoComplete="name"
          enterKeyHint="next"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${uid}-name-err` : undefined}
          className="h-13 w-full rounded-2xl bg-cream/8 px-4 text-cream ring-1 ring-cream/10 outline-none transition-shadow placeholder:text-cream/35 focus:ring-2 focus:ring-senape"
          placeholder="Es. Rossi"
        />
        {errors.name && (
          <p id={`${uid}-name-err`} className="mt-1.5 text-sm text-[#f08a7e]">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${uid}-note`} className="mb-2 block text-sm font-semibold text-cream/70">
          Note <span className="font-normal text-cream/40">(facoltativo)</span>
        </label>
        <textarea
          id={`${uid}-note`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-2xl bg-cream/8 px-4 py-3 text-cream ring-1 ring-cream/10 outline-none transition-shadow placeholder:text-cream/35 focus:ring-2 focus:ring-senape"
          placeholder="Tavolo in piazza, seggiolone, intolleranze…"
        />
      </div>

      <div className="space-y-3">
        <button type="submit" className={`${btnPrimary} w-full`}>
          <i className="ri-whatsapp-line text-xl" />
          Invia la richiesta
        </button>
        <a
          href={SITE.phoneHref}
          className="flex h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold text-cream/80 ring-1 ring-cream/15 transition-colors hover:bg-cream/5"
        >
          <i className="ri-phone-line" /> Preferisci chiamare? {SITE.phone}
        </a>
      </div>
    </form>
  );
}
