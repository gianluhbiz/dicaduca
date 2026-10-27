import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useBooking } from "../components/Booking";
import { Footer, PAGE_DELAY } from "../components/Chrome";
import { Img, Kicker, MaskLine, btnPrimary } from "../components/ui";
import { MENU, type Category, type Dish } from "../data/menu";
import { EASE_OUT } from "../lib/hooks";

const FAN = [
  { name: "olive-cono", r: -8, x: "-38%" },
  { name: "spaghetti-sugo", r: 2, x: "0%" },
  { name: "tagliata-grana", r: 10, x: "38%" },
];

function Hero() {
  const d = PAGE_DELAY();
  return (
    <header className="relative overflow-hidden bg-cream px-5 pt-[calc(env(safe-area-inset-top)+7rem)] pb-14 text-ink md:px-10 md:pt-40 md:pb-20">
      <div className="mx-auto grid max-w-[1600px] items-end gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: d }}
          >
            <Link to="/" className="group inline-flex items-center gap-2 text-sm font-semibold text-ink/60 hover:text-ink">
              <i className="ri-arrow-left-line transition-transform duration-200 group-hover:-translate-x-0.5" /> Torna in piazza
            </Link>
          </motion.div>
          <h1 className="mt-6 font-display text-[clamp(5rem,15vw,13rem)] leading-[0.8] font-black whitespace-nowrap uppercase">
            <MaskLine delay={d + 0.05}>Il menu</MaskLine>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: d + 0.25 }}
            className="mt-6 max-w-lg font-serif text-xl leading-snug text-ink/75 italic md:text-2xl"
          >
            Cucina tipica ascolana. Le olive le facciamo a mano ogni giorno, il resto lo decide la stagione.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: d + 0.4 }}
            className="mt-4 flex items-center gap-2 text-sm text-ink/60"
          >
            <i className="ri-leaf-line text-oliva" /> = vegetariano · Opzioni vegane e senza glutine su richiesta
          </motion.p>
        </div>

        <div className="relative mx-auto h-[220px] w-full max-w-[420px] md:h-[340px]">
          {FAN.map((f, i) => (
            <motion.div
              key={f.name}
              className="absolute bottom-0 left-1/2 aspect-[3/4] w-[44%] origin-bottom overflow-hidden rounded-2xl bg-stone shadow-[0_30px_60px_-25px_rgb(40_30_10/0.6)] ring-4 ring-cream"
              initial={{ opacity: 0, x: "-50%", y: 60, rotate: 0 }}
              animate={{ opacity: 1, x: `calc(-50% + ${f.x})`, y: i === 1 ? -16 : 0, rotate: f.r }}
              transition={{ type: "spring", duration: 0.9, bounce: 0.2, delay: d + 0.15 + i * 0.07 }}
              style={{ zIndex: i === 1 ? 2 : 1 }}
            >
              <Img name={f.name} alt="" eager sizes="200px" className="size-full object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </header>
  );
}

function DishRow({ dish, onPreview }: { dish: Dish; onPreview: (d: Dish | null) => void }) {
  return (
    <li
      onMouseEnter={() => onPreview(dish)}
      onMouseLeave={() => onPreview(null)}
      className="group -mx-3 flex gap-4 rounded-2xl px-3 py-4 transition-colors duration-200 hover:bg-ink/[0.04]"
    >
      {dish.img && (
        <span className="size-16 shrink-0 overflow-hidden rounded-xl md:hidden">
          <Img name={dish.img} alt="" sizes="64px" className="size-full object-cover" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <h3 className="font-display text-[1.55rem] leading-tight font-extrabold uppercase md:text-3xl">
            {dish.name}
            {dish.veg && <i className="ri-leaf-line ml-2 align-middle text-lg text-oliva" aria-label="vegetariano" />}
          </h3>
          <span aria-hidden className="mb-1.5 hidden min-w-6 flex-1 border-b-2 border-dotted border-ink/20 sm:block" />
          <span className="ml-auto shrink-0 font-display text-2xl font-bold tabular-nums md:text-3xl">€ {dish.price}</span>
        </div>
        <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-ink/65">{dish.desc}</p>
        {dish.star && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-senape/60 px-2.5 py-0.5 text-xs font-semibold">
            <i className="ri-fire-line" /> Il più ordinato
          </span>
        )}
      </div>
    </li>
  );
}

export default function Menu() {
  const { hash } = useLocation();
  const { open } = useBooking();
  const [active, setActive] = useState(MENU[0].id);
  const [query, setQuery] = useState("");
  const [veg, setVeg] = useState(false);
  const [preview, setPreview] = useState<Dish | null>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const filtered: Category[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU.map((c) => ({
      ...c,
      dishes: c.dishes.filter(
        (d) => (!veg || d.veg) && (!q || `${d.name} ${d.desc}`.toLowerCase().includes(q)),
      ),
    })).filter((c) => c.dishes.length);
  }, [query, veg]);

  // scroll-spy
  useEffect(() => {
    const els = filtered.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtered]);

  // porta in vista la chip attiva
  useEffect(() => {
    const bar = chipsRef.current;
    const chip = bar?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (bar && chip) bar.scrollTo({ left: chip.offsetLeft - bar.offsetWidth / 2 + chip.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    if (!hash) return;
    const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 950);
    return () => window.clearTimeout(t);
  }, [hash]);

  const activeCat = filtered.find((c) => c.id === active) ?? filtered[0];
  const shown = preview?.img ? { name: preview.img, label: preview.name } : activeCat ? { name: activeCat.img, label: activeCat.kicker } : null;

  return (
    <>
      <main className="bg-cream text-ink">
        <Hero />

        <div className="sticky top-[calc(env(safe-area-inset-top)+4.75rem)] z-30 px-3 md:px-5">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 bottom-1/2 bg-gradient-to-b from-cream via-cream to-cream/0" />
          <div className="relative mx-auto flex max-w-[1600px] flex-col gap-2 rounded-[1.75rem] bg-cream/85 p-2 shadow-[0_12px_40px_-18px_rgb(40_30_10/0.35)] ring-1 ring-ink/10 backdrop-blur-md md:flex-row md:items-center md:rounded-full">
            <LayoutGroup>
              <div ref={chipsRef} className="no-scrollbar relative flex flex-1 gap-1 overflow-x-auto" role="navigation" aria-label="Categorie del menu">
                {filtered.map((c) => (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    data-id={c.id}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="relative shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap"
                  >
                    {active === c.id && (
                      <motion.span
                        layoutId="menu-chip"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
                      />
                    )}
                    <span className={`relative transition-colors duration-200 ${active === c.id ? "text-cream" : "text-ink/70"}`}>
                      {c.title}
                    </span>
                  </a>
                ))}
              </div>
            </LayoutGroup>
            <div className="flex gap-2">
              <label className="relative flex-1 md:w-56 md:flex-none">
                <span className="sr-only">Cerca un piatto</span>
                <i className="ri-search-line pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink/45" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cerca un piatto"
                  enterKeyHint="search"
                  className="h-11 w-full rounded-full bg-ink/6 pr-4 pl-10 outline-none placeholder:text-ink/40 focus:ring-2 focus:ring-ink"
                />
              </label>
              <button
                onClick={() => setVeg((v) => !v)}
                aria-pressed={veg}
                className={`inline-flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${
                  veg ? "bg-oliva text-cream" : "bg-ink/6 text-ink hover:bg-ink/10"
                }`}
              >
                <i className="ri-leaf-line" /> Veg
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1600px] gap-10 px-5 pt-10 pb-24 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14 md:px-10">
          {/* foto che segue la categoria o il piatto sotto il mouse */}
          <aside className="relative hidden md:block">
            <div className="sticky top-44 aspect-[4/5] max-h-[calc(100svh-13rem)] w-full overflow-hidden rounded-[2rem] bg-stone">
              <AnimatePresence initial={false}>
                {shown && (
                  <motion.div
                    key={shown.name}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, transition: { duration: 0.35 } }}
                    transition={{ duration: 0.55, ease: EASE_OUT }}
                  >
                    <Img name={shown.name} alt={shown.label} sizes="40vw" className="size-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent to-45%" />
                    <p className="absolute right-7 bottom-6 left-7 font-serif text-3xl text-cream italic">{shown.label}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>

          <div>
            {filtered.length === 0 && (
              <div className="rounded-[2rem] bg-ink/[0.04] p-10 text-center">
                <p className="font-serif text-3xl italic">Nessun piatto per “{query}”.</p>
                <p className="mt-2 text-ink/60">Chiedi in sala i fuori menu del giorno: spesso sono la scelta giusta.</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setVeg(false);
                  }}
                  className="mt-6 h-11 cursor-pointer rounded-full bg-ink px-6 text-sm font-semibold text-cream active:scale-[0.97]"
                >
                  Mostra tutto
                </button>
              </div>
            )}
            {filtered.map((c) => (
              <section key={c.id} id={c.id} className="scroll-mt-48 pb-16 last:pb-0 md:scroll-mt-44">
                <div className="relative mb-4 h-40 overflow-hidden rounded-[1.5rem] md:hidden">
                  <Img name={c.img} alt="" sizes="100vw" className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                  <p className="absolute bottom-3 left-4 font-serif text-xl text-cream italic">{c.kicker}</p>
                </div>
                <Kicker className="text-oliva">{c.kicker}</Kicker>
                <h2 className="mt-2 border-b-2 border-ink pb-3 font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.85] font-black uppercase">
                  {c.title}
                </h2>
                <ul className="mt-2">
                  {c.dishes.map((d) => (
                    <DishRow key={d.name} dish={d} onPreview={setPreview} />
                  ))}
                </ul>
              </section>
            ))}

            <p className="mt-14 text-sm leading-relaxed text-ink/55">
              Allergeni e intolleranze: chiedi al personale, ti indichiamo cosa contiene ogni piatto. Prezzi in euro, IVA inclusa.
            </p>
          </div>
        </div>

        <section className="bg-senape px-5 py-16 text-ink md:px-10 md:py-24">
          <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.85] font-black uppercase">
              Hai già scelto?
              <br />
              <span className="font-serif font-normal normal-case italic">Prenota il tavolo.</span>
            </h2>
            <button onClick={() => open()} className={`${btnPrimary} bg-ink! text-cream hover:bg-ink-2!`}>
              Prenota adesso <i className="ri-arrow-right-line" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
