import { BookingForm } from "../components/Booking";
import { Kicker, MaskLine, Reveal } from "../components/ui";
import { SITE } from "../data/site";
import { DAY_NAMES, HOURS, fmt, useRomeNow } from "../lib/hours";

const ORDER = [1, 2, 3, 4, 5, 6, 0];

export function Visita() {
  const now = useRomeNow();
  return (
    <section id="visita" className="relative bg-ink-2 py-24 text-cream md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Kicker className="text-senape">Prenota</Kicker>
        <h2 className="mt-3 font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.85] font-black uppercase">
          <MaskLine inView>Ti teniamo</MaskLine>
          <MaskLine inView delay={0.08}>
            un tavolo<span className="text-senape">.</span>
          </MaskLine>
        </h2>

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          <Reveal className="min-w-0 rounded-[2rem] bg-ink p-6 ring-1 ring-cream/10 md:p-10">
            <p className="font-serif text-2xl italic md:text-3xl">Scegli giorno e ora.</p>
            <p className="mt-1 mb-8 text-sm text-cream/60">
              La richiesta parte su WhatsApp con tutti i dettagli. Ti rispondiamo noi per confermare.
            </p>
            <BookingForm />
          </Reveal>

          <Reveal delay={0.1} className="flex min-w-0 flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-cream/45 uppercase">Dove</p>
                <p className="mt-3 text-xl leading-snug">
                  {SITE.street}
                  <br />
                  {SITE.city}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={SITE.directions}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-cream px-5 text-sm font-semibold text-ink transition-transform duration-150 active:scale-[0.97]"
                  >
                    <i className="ri-navigation-line" /> Indicazioni
                  </a>
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold ring-1 ring-cream/20 transition-[transform,background-color] duration-150 hover:bg-cream/5 active:scale-[0.97]"
                  >
                    <i className="ri-phone-line" /> {SITE.phone}
                  </a>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-cream/45 uppercase">Orari</p>
                <ul className="mt-3 space-y-1">
                  {ORDER.map((d) => {
                    const today = d === now.day;
                    return (
                      <li
                        key={d}
                        className={`-mx-3 flex justify-between gap-4 rounded-lg px-3 py-1 text-[15px] ${
                          today ? "bg-senape font-semibold text-ink" : "text-cream/75"
                        }`}
                      >
                        <span>{DAY_NAMES[d]}</span>
                        <span className="tabular-nums">{HOURS[d].map(([a, b]) => `${fmt(a)}–${fmt(b)}`).join(" · ")}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-[2rem] ring-1 ring-cream/10">
              <iframe
                title="Mappa: Dicaduca in Piazza del Popolo, Ascoli Piceno"
                src={SITE.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0 grayscale-[0.85] contrast-[1.05] invert-[0.88] hue-rotate-180"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
