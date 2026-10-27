import { useBooking } from "../components/Booking";
import { Img, Kicker, Reveal } from "../components/ui";
import { getMoment, useRomeNow, type Moment } from "../lib/hours";

type Panel = {
  time: string;
  title: string;
  moment: Moment;
  img: string;
  alt: string;
  text: string;
  cta?: { label: string; note: string };
};

const PANELS: Panel[] = [
  {
    time: "12:00",
    title: "Pranzo",
    moment: "pranzo",
    img: "tagliolini-funghi",
    alt: "Tagliolini ai funghi serviti su un piatto bianco",
    text: "Un primo sotto i portici, il sole sul travertino. In un'ora sei di nuovo in giro per Ascoli.",
  },
  {
    time: "18:00",
    title: "Aperitivo",
    moment: "aperitivo",
    img: "tagliere-spritz",
    alt: "Tagliere di salumi e formaggi con due spritz",
    text: "Spritz, un tagliere piccolo e il cono di olive. Dal bar Meletti arriva la musica.",
  },
  {
    time: "20:30",
    title: "Cena",
    moment: "cena",
    img: "piazza-sera",
    alt: "Piazza del Popolo di sera con i tavoli all'aperto",
    text: "La piazza si accende. Vincisgrassi, tagliata e una bottiglia di Rosso Piceno da finire con calma.",
  },
  {
    time: "Feste",
    title: "Le serate del Duca",
    moment: null,
    img: "cena-amici",
    alt: "Una tavolata di amici a cena da Dicaduca con la titolare",
    text: "Cene a tema con i produttori del territorio, come Pane & Olio Nuovo con Panificio Grano e Oleificio Angelini. Lauree e compleanni? Prepariamo noi la tavolata.",
    cta: { label: "Organizza una festa", note: "Vorrei organizzare una festa / tavolata." },
  },
];

function PanelCard({ panel, now, className = "" }: { panel: Panel; now: Moment; className?: string }) {
  const { open } = useBooking();
  const live = panel.moment && panel.moment === now;
  return (
    <article className={`relative overflow-hidden rounded-[2rem] bg-ink-2 ${className}`}>
      <Img name={panel.img} alt={panel.alt} sizes="(min-width: 768px) 50vw, 90vw" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/0" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 to-transparent to-40%" />
      <div className="relative flex h-full flex-col justify-between p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <p className="font-display text-[clamp(3.5rem,12vw,5rem)] xl:text-[clamp(3rem,4.6vw,5rem)] leading-[0.8] font-black text-cream tabular-nums">{panel.time}</p>
          {live && (
            <span className="inline-flex items-center gap-2 rounded-full bg-senape px-3 py-1.5 text-xs font-bold tracking-[0.16em] text-ink uppercase">
              <span className="size-1.5 animate-pulse rounded-full bg-ink motion-reduce:animate-none" /> Adesso
            </span>
          )}
        </div>
        <div className="max-w-lg">
          <h3 className="font-serif text-3xl text-cream italic md:text-4xl">{panel.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-cream/80">{panel.text}</p>
          {panel.cta && (
            <button
              onClick={() => open(panel.cta!.note)}
              className="mt-5 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-cream px-5 text-sm font-semibold text-ink transition-transform duration-150 active:scale-[0.97]"
            >
              {panel.cta.label} <i className="ri-arrow-right-line" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function Intro({ now }: { now: Moment }) {
  return (
    <div className="max-w-2xl">
      <Kicker className="text-senape">La giornata</Kicker>
      <h2 className="mt-4 font-display text-[clamp(3rem,7vw,7rem)] leading-[0.86] font-black text-cream uppercase">
        Dalle 12 alle 22:30.
      </h2>
      <p className="mt-5 font-serif text-xl leading-snug text-cream/75 italic md:text-2xl">
        Aperti tutti i giorni. La piazza cambia faccia ogni ora: scegli la tua.
      </p>
      {now && (
        <p className="mt-6 text-sm text-cream/60">
          In questo momento: <span className="font-semibold text-senape">{now}</span>.
        </p>
      )}
    </div>
  );
}

export function Day() {
  const now = getMoment(useRomeNow());
  return (
    <section id="giornata" className="relative scroll-mt-20 bg-ink pb-20 md:pb-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal className="pb-10">
          <Intro now={now} />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PANELS.map((panel) => (
            <PanelCard key={panel.title} panel={panel} now={now} className="aspect-[4/5] sm:aspect-[3/4]" />
          ))}
        </div>
      </div>
    </section>
  );
}
