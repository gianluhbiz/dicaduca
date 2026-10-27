import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Img, Kicker, MaskLine } from "../components/ui";
import { REVIEWS, REVIEW_TAGS, SITE, type ReviewTag } from "../data/site";
import { EASE_OUT } from "../lib/hooks";

const TAG_IMG: Record<ReviewTag, { name: string; alt: string }> = {
  olive: { name: "olive-secchiello", alt: "Secchiello di olive all'ascolana" },
  fritti: { name: "fritto-misto", alt: "Fritto misto ascolano" },
  piazza: { name: "piazza-sera", alt: "Piazza del Popolo di sera" },
  servizio: { name: "staff", alt: "Lo staff con i clienti" },
  feste: { name: "tavolata-gruppo", alt: "Una grande tavolata di gruppo" },
  veg: { name: "grigliata-verdure", alt: "Verdure grigliate" },
};

export function Voci() {
  const [tag, setTag] = useState<ReviewTag | "all">("all");
  const [i, setI] = useState(0);
  const list = useMemo(() => (tag === "all" ? REVIEWS : REVIEWS.filter((r) => r.tags.includes(tag))), [tag]);
  const review = list[i % list.length];
  const img = TAG_IMG[review.tags[0]];
  const go = (d: number) => setI((v) => (v + d + list.length) % list.length);

  const chip = (active: boolean) =>
    `h-10 shrink-0 cursor-pointer rounded-full px-4 text-sm font-semibold transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${
      active ? "bg-ink text-cream" : "bg-ink/6 text-ink hover:bg-ink/12"
    }`;

  return (
    <section id="voci" className="relative overflow-hidden bg-cream py-24 text-ink md:py-32">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-20">
        <div className="min-w-0">
          <Kicker className="text-oliva">Recensioni</Kicker>
          <h2 className="mt-3 font-display text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.86] font-black uppercase">
            <MaskLine inView>1.351 recensioni.</MaskLine>
            <MaskLine inView delay={0.08} className="text-ink/35">
              Leggine dieci.
            </MaskLine>
          </h2>

          <div role="tablist" aria-label="Filtra per argomento" className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
            <button role="tab" aria-selected={tag === "all"} className={chip(tag === "all")} onClick={() => { setTag("all"); setI(0); }}>
              Tutte
            </button>
            {REVIEW_TAGS.map((t) => (
              <button
                role="tab"
                key={t.id}
                aria-selected={tag === t.id}
                className={chip(tag === t.id)}
                onClick={() => {
                  setTag(t.id);
                  setI(0);
                }}
              >
                {t.label}
                {t.count && <span className="ml-1.5 opacity-50">{t.count}</span>}
              </button>
            ))}
          </div>

          <div className="relative mt-10 min-h-[17rem] md:min-h-[19rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={`${tag}-${review.author}-${review.text.slice(0, 12)}`}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)", transition: { duration: 0.18 } }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  if (info.offset.x > 60) go(-1);
                }}
                className="touch-pan-y"
              >
                <blockquote className="max-w-4xl font-serif text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.12]">
                  “{review.text}”
                </blockquote>
                <figcaption className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="font-semibold">{review.author}</span>
                  <span className="inline-flex items-center gap-1.5 text-ink/55">
                    <i className={review.source === "Google" ? "ri-google-fill" : "ri-star-smile-line"} />
                    {review.source}
                    {review.when && ` · ${review.when}`}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Recensione precedente"
              className="grid size-13 cursor-pointer place-items-center rounded-full ring-1 ring-ink/20 transition-[background-color,transform] duration-150 hover:bg-ink hover:text-cream active:scale-95"
            >
              <i className="ri-arrow-left-line text-xl" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Recensione successiva"
              className="grid size-13 cursor-pointer place-items-center rounded-full bg-ink text-cream transition-transform duration-150 active:scale-95"
            >
              <i className="ri-arrow-right-line text-xl" />
            </button>
            <p className="font-display text-xl font-bold tabular-nums text-ink/50">
              {String((i % list.length) + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
            </p>
            <a
              href={SITE.tripadvisor}
              target="_blank"
              rel="noreferrer"
              className="ml-auto hidden text-sm font-semibold underline underline-offset-4 sm:block"
            >
              Tutte su Tripadvisor
            </a>
          </div>
        </div>

        <div className="relative hidden aspect-[3/4] overflow-hidden rounded-[2rem] bg-stone lg:block">
          <AnimatePresence initial={false}>
            <motion.div
              key={img.name}
              className="absolute inset-0"
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.5 } }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              <Img name={img.name} alt={img.alt} sizes="420px" className="size-full object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
