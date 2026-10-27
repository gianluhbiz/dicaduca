import { motion } from "framer-motion";
import { Link } from "react-router";
import { useBooking } from "../components/Booking";
import { PAGE_DELAY } from "../components/Chrome";
import { Img, LogoMark, MaskLine, StatusChip, btnGhost, btnPrimary } from "../components/ui";
import { EASE_OUT, useMediaQuery } from "../lib/hooks";

const STAMP = "PASSIONE · TRADIZIONE · ASCOLI PICENO · ";

export function Hero() {
  const mobile = useMediaQuery("(max-width: 767px)");
  const { open } = useBooking();
  const d = PAGE_DELAY();

  // Il triangolo del logo incornicia la piazza. Si apre una volta sola, al caricamento.
  const from = mobile ? "polygon(100% 82%, 100% 100%, 64% 100%)" : "polygon(100% 50%, 100% 100%, 70% 100%)";
  const to = mobile ? "polygon(100% 58%, 100% 100%, -6% 100%)" : "polygon(100% -2%, 100% 100%, 26% 100%)";

  return (
    <section className="relative min-h-svh overflow-hidden bg-ink" aria-label="Benvenuti da Dicaduca">
      <motion.div
        key={mobile ? "m" : "d"}
        className="absolute inset-0"
        initial={{ clipPath: from }}
        animate={{ clipPath: to }}
        transition={{ duration: 1.1, ease: EASE_OUT, delay: d + 0.1 }}
      >
        <Img
          eager
          name="piazza-notte-tavolo"
          sizes="100vw"
          alt="Un tavolo di Dicaduca in Piazza del Popolo di sera, con calici di vino, olive fritte e il Palazzo dei Capitani illuminato"
          className="size-full object-cover object-[62%_30%]"
        />
      </motion.div>

      <div className="absolute top-[24%] right-[4%] hidden size-40 xl:block 2xl:size-44">
        <svg viewBox="0 0 200 200" className="size-full text-cream">
          <defs>
            <path id="stamp-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
          </defs>
          <text className="fill-current font-display text-[19px] font-bold tracking-[0.2em]">
            <textPath href="#stamp-circle">{STAMP}</textPath>
          </text>
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid size-16 place-items-center rounded-full bg-senape 2xl:size-20">
            <LogoMark className="size-8 text-ink 2xl:size-10" />
          </span>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh max-w-[1600px] flex-col px-5 pt-[calc(env(safe-area-inset-top)+6.5rem)] pb-16 md:px-10 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: d }}
          className="flex flex-wrap items-center gap-3 text-cream"
        >
          <span className="text-xs font-semibold tracking-[0.24em] text-senape uppercase">Vino · Birra · Cucina</span>
          <StatusChip className="bg-ink/40 backdrop-blur-sm" />
        </motion.div>

        <h1 className="mt-5 font-display text-[clamp(4.6rem,19vw,15.5rem)] leading-[0.8] font-black tracking-[-0.01em] text-cream uppercase">
          <MaskLine delay={d + 0.05}>Solo cose</MaskLine>
          <MaskLine delay={d + 0.14}>
            buone<span className="text-senape">.</span>
          </MaskLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: d + 0.3 }}
          className="mt-6 max-w-[30ch] font-serif text-xl leading-snug text-cream/85 italic md:max-w-md md:text-2xl"
        >
          Olive all'ascolana fatte a mano, un calice di Rosso Piceno e il tuo tavolo davanti a Palazzo dei Capitani.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: d + 0.4 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <button onClick={() => open()} className={btnPrimary}>
            Prenota un tavolo
            <i className="ri-arrow-right-line transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5" />
          </button>
          <Link to="/menu" className={`${btnGhost} bg-ink/40 text-cream backdrop-blur-sm`}>
            Sfoglia il menu
            <i className="ri-arrow-right-up-line transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
