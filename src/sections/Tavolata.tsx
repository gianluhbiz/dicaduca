import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Img, Kicker, MaskLine } from "../components/ui";
import { EASE_OUT } from "../lib/hooks";

type Shot = { name: string; alt: string; x: number; y: number; r: number; size: "p" | "l" | "s" };

// Posizioni in % della tela: tre "file" sfalsate, come foto lasciate sul tavolo.
const SHOTS: Shot[] = [
  { name: "lavagne", alt: "Le lavagne in sala: Solo cose buone, 100% genuino, Le serate del Duca", x: 1, y: 6, r: -3, size: "l" },
  { name: "fritto-misto", alt: "Cono di fritto misto ascolano", x: 3, y: 50, r: 4, size: "p" },
  { name: "piazza-tramonto", alt: "Piazza del Popolo al tramonto", x: 15, y: 30, r: -2, size: "p" },
  { name: "tagliata-grana", alt: "Tagliata con rucola e grana", x: 27, y: 4, r: 3, size: "p" },
  { name: "staff", alt: "Lo staff di Dicaduca con un gruppo di clienti sorridenti", x: 25, y: 60, r: -4, size: "l" },
  { name: "vincisgrassi", alt: "Vincisgrassi al forno", x: 39, y: 36, r: 2, size: "p" },
  { name: "sala-tavoli", alt: "La sala interna con lampade industriali e piante", x: 51, y: 5, r: -3, size: "p" },
  { name: "tonno-scottato", alt: "Tonno scottato su ardesia", x: 50, y: 58, r: 3, size: "s" },
  { name: "piazza-giorno", alt: "Ciclisti in Piazza del Popolo di giorno", x: 62, y: 30, r: -2, size: "l" },
  { name: "tagliere-salumi", alt: "Tagliere di salumi, pecorino e ricotta", x: 75, y: 2, r: 4, size: "s" },
  { name: "spaghetti-ricotta", alt: "Chitarrina al pomodoro e ricotta", x: 74, y: 58, r: -3, size: "s" },
  { name: "ingresso", alt: "L'ingresso di Dicaduca con l'insegna", x: 86, y: 24, r: 2, size: "p" },
  { name: "tonno-piazza", alt: "Piatto di tonno con la piazza sullo sfondo", x: 97, y: 4, r: -4, size: "p" },
  { name: "tavolata-gruppo", alt: "Un grande gruppo in posa davanti al locale", x: 98, y: 58, r: 3, size: "l" },
  { name: "grigliata-verdure", alt: "Piatto di verdure grigliate", x: 111, y: 28, r: -2, size: "p" },
  { name: "bancone", alt: "Il bancone del bar con le bottiglie", x: 120, y: 4, r: 2, size: "l" },
];

const SIZE: Record<Shot["size"], string> = {
  p: "w-[42vw] md:w-[17vw] aspect-[3/4]",
  l: "w-[58vw] md:w-[24vw] aspect-[4/3]",
  s: "w-[38vw] md:w-[15vw] aspect-square",
};

function Lightbox({ index, onClose, onMove }: { index: number; onClose: () => void; onMove: (d: number) => void }) {
  const shot = SHOTS[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [onClose, onMove]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={shot.alt}
      className="fixed inset-0 z-[85] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-sm md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      onClick={onClose}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.figure
          key={shot.name}
          initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)", transition: { duration: 0.15 } }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="flex max-h-full flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Img name={shot.name} alt={shot.alt} sizes="90vw" className="max-h-[78svh] w-auto rounded-2xl object-contain" />
          <figcaption className="mt-4 max-w-xl text-center text-sm text-cream/75">{shot.alt}</figcaption>
        </motion.figure>
      </AnimatePresence>
      <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] flex justify-center gap-2" onClick={(e) => e.stopPropagation()}>
        {[
          { d: -1, icon: "ri-arrow-left-line", label: "Foto precedente" },
          { d: 1, icon: "ri-arrow-right-line", label: "Foto successiva" },
        ].map((b) => (
          <button
            key={b.d}
            onClick={() => onMove(b.d)}
            aria-label={b.label}
            className="grid size-12 cursor-pointer place-items-center rounded-full bg-cream/10 text-xl text-cream transition-transform duration-150 hover:bg-cream/20 active:scale-95"
          >
            <i className={b.icon} />
          </button>
        ))}
      </div>
      <button
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute top-[calc(env(safe-area-inset-top)+1rem)] right-4 grid size-12 cursor-pointer place-items-center rounded-full bg-cream/10 text-xl text-cream active:scale-95"
      >
        <i className="ri-close-line" />
      </button>
    </motion.div>
  );
}

export function Tavolata() {
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const dragging = useRef(false);
  const [open, setOpen] = useState<number | null>(null);

  const pan = (dir: number) => {
    if (!frame.current || !canvas.current) return;
    const min = frame.current.offsetWidth - canvas.current.offsetWidth;
    const next = Math.min(0, Math.max(min, x.get() - dir * frame.current.offsetWidth * 0.6));
    animate(x, next, { type: "spring", duration: 0.8, bounce: 0.1 });
  };
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + SHOTS.length) % SHOTS.length)), []);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section aria-label="Foto da Dicaduca" className="relative overflow-hidden bg-senape py-20 text-ink md:py-28">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-6 px-5 md:px-10">
        <div>
          <Kicker>La tavolata</Kicker>
          <h2 className="mt-3 font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.85] font-black uppercase">
            <MaskLine inView>Prendi posto.</MaskLine>
          </h2>
          <p className="mt-3 max-w-md text-ink/70">
            Foto vere, scattate da chi è venuto prima di te. Trascina il tavolo, tocca una foto per ingrandirla.
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { d: -1, icon: "ri-arrow-left-line", label: "Scorri a sinistra" },
            { d: 1, icon: "ri-arrow-right-line", label: "Scorri a destra" },
          ].map((b) => (
            <button
              key={b.d}
              onClick={() => pan(b.d)}
              aria-label={b.label}
              className="grid size-13 cursor-pointer place-items-center rounded-full bg-ink text-xl text-cream transition-transform duration-150 active:scale-95"
            >
              <i className={b.icon} />
            </button>
          ))}
        </div>
      </div>

      <div ref={frame} className="relative mt-10 h-[min(92vw,620px)] cursor-grab active:cursor-grabbing md:h-[78svh]">
        <motion.div
          ref={canvas}
          drag="x"
          style={{ x }}
          dragConstraints={frame}
          dragElastic={0.06}
          dragTransition={{ power: 0.3, timeConstant: 280 }}
          onDragStart={() => (dragging.current = true)}
          onDragEnd={() => window.setTimeout(() => (dragging.current = false), 60)}
          className="relative h-full w-[330vw] touch-pan-y md:w-[150vw]"
        >
          {SHOTS.map((s, i) => (
            <motion.button
              key={s.name}
              onClick={() => !dragging.current && setOpen(i)}
              aria-label={`Ingrandisci: ${s.alt}`}
              className={`absolute cursor-pointer bg-cream p-2 pb-8 shadow-[0_24px_50px_-18px_rgb(60_40_0/0.55)] md:p-2.5 md:pb-10 ${SIZE[s.size]}`}
              style={{ left: `${(s.x / 148) * 100}%`, top: `${s.y}%`, rotate: s.r }}
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Img name={s.name} alt="" sizes="(min-width: 768px) 25vw, 60vw" className="pointer-events-none size-full object-cover" />
            </motion.button>
          ))}
        </motion.div>
        <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream">
          <i className="ri-drag-move-2-line" /> Trascina
        </div>
      </div>

      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onMove={move} />}</AnimatePresence>
    </section>
  );
}
