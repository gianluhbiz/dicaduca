import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { SITE } from "../data/site";
import { EASE_IN_OUT, EASE_OUT } from "../lib/hooks";
import { useBooking } from "./Booking";
import { LogoMark, StatusChip, Wordmark } from "./ui";

const SECTIONS = [
  { id: "oliva", label: "L'oliva" },
  { id: "giornata", label: "La giornata" },
  { id: "voci", label: "Recensioni" },
  { id: "visita", label: "Dove siamo" },
];

// eslint-disable-next-line react-refresh/only-export-components
export function useGoToSection() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (id: string) => {
    if (pathname === "/") document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else navigate(`/#${id}`);
  };
}

export function Nav() {
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  const [solid, setSolid] = useState(false);
  const { open } = useBooking();
  const go = useGoToSection();
  const light = pathname === "/menu" && !solid;

  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 px-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:px-5"
    >
      <nav
        aria-label="Principale"
        className={`mx-auto flex h-14 max-w-[1600px] items-center justify-between rounded-full pr-2 pl-4 transition-[background-color,box-shadow,color] duration-300 ${
          light ? "text-ink" : "text-cream"
        } ${
          solid ? "bg-ink/80 shadow-[0_10px_40px_-10px_rgb(0_0_0/0.5)] ring-1 ring-cream/10 backdrop-blur-md" : ""
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5" aria-label="Dicaduca, torna alla home">
          <LogoMark className={`size-7 ${light ? "text-ink" : "text-senape"}`} />
          <Wordmark className="text-xl" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => go(s.id)}
                className="cursor-pointer rounded-full px-4 py-2 text-[15px] font-medium opacity-75 transition-opacity duration-200 hover:opacity-100"
              >
                {s.label}
              </button>
            </li>
          ))}
          <li>
            <Link
              to={pathname === "/menu" ? "/" : "/menu"}
              className={`rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${light ? "text-oliva-deep" : "text-senape hover:text-[#f0c862]"}`}
            >
              {pathname === "/menu" ? "La piazza" : "Il menu"}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden xl:block">
            <StatusChip />
          </span>
          <Link
            to={pathname === "/menu" ? "/" : "/menu"}
            className="hidden h-10 items-center rounded-full px-4 text-sm font-semibold ring-1 ring-current/20 md:inline-flex lg:hidden"
          >
            {pathname === "/menu" ? "Home" : "Menu"}
          </Link>
          <button
            onClick={() => open()}
            className="h-10 cursor-pointer rounded-full bg-senape px-5 text-sm font-semibold text-ink transition-[transform,background-color] duration-150 hover:bg-[#edc25a] active:scale-[0.97]"
          >
            Prenota
          </button>
        </div>
      </nav>
    </header>
  );
}

export function MobileBar() {
  const { pathname } = useLocation();
  const { open, isOpen } = useBooking();
  const visible = !isOpen;
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "140%" }}
          animate={{ y: "0%" }}
          exit={{ y: "140%" }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden"
        >
          <div className="flex items-center gap-1.5 rounded-full bg-ink/90 p-1.5 text-cream shadow-[0_10px_40px_-8px_rgb(0_0_0/0.6)] ring-1 ring-cream/10 backdrop-blur-md">
            <a
              href={SITE.phoneHref}
              aria-label={`Chiama ${SITE.phone}`}
              className="grid size-12 place-items-center rounded-full bg-cream/10 text-xl active:scale-95"
            >
              <i className="ri-phone-line" />
            </a>
            <Link
              to={pathname === "/menu" ? "/" : "/menu"}
              className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-cream/10 text-[15px] font-semibold active:scale-[0.97]"
            >
              <i className={pathname === "/menu" ? "ri-home-5-line" : "ri-restaurant-line"} />
              {pathname === "/menu" ? "Home" : "Menu"}
            </Link>
            <button
              onClick={() => open()}
              className="flex h-12 flex-[1.4] cursor-pointer items-center justify-center gap-1.5 rounded-full bg-senape text-[15px] font-semibold text-ink active:scale-[0.97]"
            >
              <i className="ri-calendar-check-line" /> Prenota
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const LABELS: Record<string, string> = { "/": "La piazza", "/menu": "Il menu" };

/** Percorso reale: <Routes location> congela la location della pagina in uscita, questo no. */
// eslint-disable-next-line react-refresh/only-export-components
export const LivePathContext = createContext("/");
let firstLoad = true;

function CurtainContent({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center" style={{ transform: "skewX(10deg)" }}>
      <div className="flex flex-col items-center gap-5">
        <LogoMark className="size-16 text-senape md:size-20" />
        <p className="font-display text-6xl font-black uppercase text-cream md:text-8xl">{label}</p>
      </div>
    </div>
  );
}

/** Ogni pagina porta con sé la sua tenda: entra in diagonale come il logo, poi si apre. */
export function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const [isFirst] = useState(() => firstLoad);
  useEffect(() => {
    firstLoad = false;
  }, []);
  const livePath = useContext(LivePathContext);
  const exitLabel = LABELS[livePath] ?? "Dicaduca";
  const enterLabel = isFirst ? "Dicaduca" : (LABELS[pathname] ?? "Dicaduca");
  const panel = "absolute inset-y-0 -inset-x-1/2 will-change-transform";

  if (reduce) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <>
      {children}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[95] overflow-hidden">
      {/* copertura in uscita */}
      <motion.div
        aria-hidden
        className={`${panel} z-0 bg-senape`}
        style={{ skewX: -10 }}
        initial={{ x: "130%" }}
        animate={{ x: "130%" }}
        exit={{ x: "0%" }}
        transition={{ duration: 0.6, ease: EASE_IN_OUT }}
      />
      <motion.div
        aria-hidden
        className={`${panel} z-10 bg-ink`}
        style={{ skewX: -10 }}
        initial={{ x: "130%" }}
        animate={{ x: "130%" }}
        exit={{ x: "0%" }}
        transition={{ duration: 0.6, ease: EASE_IN_OUT, delay: 0.08 }}
      >
        <CurtainContent label={exitLabel} />
      </motion.div>
      {/* apertura in entrata */}
      <motion.div
        aria-hidden
        className={`${panel} z-10 bg-ink`}
        style={{ skewX: -10 }}
        initial={{ x: "0%" }}
        animate={{ x: "-130%" }}
        transition={{ duration: 0.8, ease: EASE_IN_OUT, delay: isFirst ? 0.5 : 0.15 }}
      >
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: isFirst ? 0.45 : 0.1 }}
          className="h-full"
        >
          <CurtainContent label={enterLabel} />
        </motion.div>
      </motion.div>
      <motion.div
        aria-hidden
        className={`${panel} z-0 bg-senape`}
        style={{ skewX: -10 }}
        initial={{ x: "0%" }}
        animate={{ x: "-130%" }}
        transition={{ duration: 0.8, ease: EASE_IN_OUT, delay: isFirst ? 0.6 : 0.24 }}
      />
      </div>
    </>
  );
}

 
export const PAGE_DELAY = () => (firstLoad ? 1.0 : 0.6);

export function Footer() {
  const go = useGoToSection();
  return (
    <footer className="relative overflow-hidden bg-ink pt-24 pb-32 text-cream md:pb-10">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="max-w-3xl font-serif text-3xl leading-tight italic md:text-5xl">“{SITE.claim}”</p>
        <div className="mt-16 grid gap-10 border-t border-cream/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/45">Dove</p>
            <a href={SITE.maps} target="_blank" rel="noreferrer" className="mt-3 block text-lg leading-snug hover:text-senape">
              {SITE.street}
              <br />
              {SITE.city}
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/45">Contatti</p>
            <a href={SITE.phoneHref} className="mt-3 block text-lg hover:text-senape">
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="mt-1 block break-all text-cream/70 hover:text-senape">
              {SITE.email}
            </a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/45">Orari</p>
            <p className="mt-3 text-lg leading-snug">
              Tutti i giorni
              <br />
              12:00–14:30 · 18:00–22:30
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/45">Seguici</p>
            <div className="mt-3 flex gap-2">
              {[
                { href: SITE.instagram, icon: "ri-instagram-line", label: "Instagram" },
                { href: SITE.facebook, icon: "ri-facebook-circle-line", label: "Facebook" },
                { href: SITE.tripadvisor, icon: "ri-star-smile-line", label: "Tripadvisor" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-12 place-items-center rounded-full bg-cream/8 text-xl transition-[background-color,transform] duration-150 hover:bg-senape hover:text-ink active:scale-95"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-cream/60">
              <Link to="/menu" className="hover:text-cream">
                Menu
              </Link>
              <button onClick={() => go("visita")} className="cursor-pointer hover:text-cream">
                Prenota
              </button>
            </div>
          </div>
        </div>
      </div>

      <p
        aria-hidden
        className="mt-16 text-center font-display text-[24.5vw] leading-[0.78] font-black tracking-[-0.02em] text-cream/[0.07] uppercase select-none"
      >
        Dicaduca
      </p>

      <div className="mx-auto mt-8 flex max-w-[1600px] flex-col gap-2 px-5 text-sm text-cream/50 md:flex-row md:items-center md:justify-between md:px-10">
        <p>© {new Date().getFullYear()} Dicaduca · Vino Birra Cucina · Ascoli Piceno</p>
        <p>
          Developed and Designed by{" "}
          <a href="https://gianluh.dev" target="_blank" rel="noreferrer" className="font-bold underline">
            Gianluca De Maio<i className="ri-external-link-line" />
          </a>
        </p>
      </div>
    </footer>
  );
}
