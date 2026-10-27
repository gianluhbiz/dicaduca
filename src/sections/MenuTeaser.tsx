import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router";
import { Img, Kicker, MaskLine } from "../components/ui";
import { MENU } from "../data/menu";
import { EASE_OUT } from "../lib/hooks";

export function MenuTeaser() {
  const [hover, setHover] = useState(0);
  const cat = MENU[hover];
  return (
    <section aria-label="Anteprima del menu" className="relative bg-ink py-24 text-cream md:py-32">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-16">
        <div className="min-w-0">
          <Kicker className="text-senape">Il menu</Kicker>
          <h2 className="mt-3 font-display text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.86] font-black uppercase">
            <MaskLine inView>Dalle olive</MaskLine>
            <MaskLine inView delay={0.08}>
              all'<span className="font-serif font-normal normal-case italic text-senape">anisetta</span>.
            </MaskLine>
          </h2>

          <ul className="mt-12 border-t border-cream/10">
            {MENU.map((c, i) => (
              <li key={c.id} className="border-b border-cream/10">
                <Link
                  to={`/menu#${c.id}`}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  className="group flex items-center gap-4 py-4 md:py-5"
                >
                  <span className="size-14 shrink-0 overflow-hidden rounded-xl lg:hidden">
                    <Img name={c.img} alt="" sizes="56px" className="size-full object-cover" />
                  </span>
                  <span className="font-display text-xs font-bold tabular-nums text-cream/35">0{i + 1}</span>
                  <span
                    className={`font-display text-[clamp(1.9rem,4.6vw,4rem)] leading-none font-extrabold uppercase transition-[color,transform] duration-300 ease-out-strong lg:group-hover:translate-x-2 ${
                      hover === i ? "lg:text-senape" : ""
                    }`}
                  >
                    {c.title}
                  </span>
                  <span className="ml-auto hidden text-sm text-cream/50 sm:block">{c.dishes.length} piatti</span>
                  <i className="ri-arrow-right-up-line text-xl text-cream/40 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-senape" />
                </Link>
              </li>
            ))}
          </ul>

          <Link
            to="/menu"
            className="group mt-10 inline-flex h-16 items-center gap-3 rounded-full bg-senape pr-3 pl-8 text-lg font-semibold text-ink transition-[transform,background-color] duration-150 hover:bg-[#edc25a] active:scale-[0.97]"
          >
            Apri il menu completo
            <span className="grid size-11 place-items-center rounded-full bg-ink text-cream transition-transform duration-300 ease-out-strong group-hover:rotate-45">
              <i className="ri-arrow-right-up-line" />
            </span>
          </Link>
        </div>

        <div className="relative hidden lg:block">
          <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink-2">
            <AnimatePresence initial={false}>
              <motion.div
                key={cat.id}
                className="absolute inset-0"
                initial={{ clipPath: "inset(0% 0% 100% 0%)", scale: 1.08 }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.35 } }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
              >
                <Img name={cat.img} alt={cat.title} sizes="40vw" className="size-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent to-50%" />
                <p className="absolute bottom-6 left-7 font-serif text-3xl italic">{cat.kicker}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
