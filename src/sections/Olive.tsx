import { Link } from "react-router";
import { Img, Kicker, Reveal } from "../components/ui";

const STEPS = [
  {
    title: "Ripiena a mano.",
    text: "Carni miste, parmigiano, noce moscata e scorza di limone dentro l'oliva tenera ascolana.",
    img: "olive-cartoccio",
  },
  {
    title: "Impanata una per una.",
    text: "Farina, uovo, pangrattato. Simonetta le prepara al banco, davanti a chi aspetta il tavolo.",
    img: "olive-secchiello",
  },
  {
    title: "Fritta quando la ordini.",
    text: "Arriva nel cono di carta ancora bollente. Aspetta dieci secondi, se ci riesci.",
    img: "fritto-misto",
  },
];

export function Olive() {
  return (
    <section id="oliva" className="relative scroll-mt-20 bg-ink py-20 text-cream md:py-28">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 md:grid-cols-2 md:gap-16 md:px-10">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] md:aspect-auto md:min-h-[640px]">
          <Img name="olive-cono" alt="Cono di olive all'ascolana appena fritte" className="absolute inset-0 size-full object-cover" />
          <span className="absolute bottom-5 left-5 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase backdrop-blur-sm">
            Oliva Ascolana del Piceno DOP
          </span>
        </Reveal>

        <div className="flex min-w-0 flex-col justify-center">
          <Kicker className="text-senape">L'oliva</Kicker>
          <h2 className="mt-3 font-display text-[clamp(2.8rem,6.5vw,6rem)] leading-[0.88] font-black uppercase">
            Diffida dalle imitazioni.
          </h2>
          <p className="mt-3 max-w-md text-cream/65">Lo abbiamo scritto sulla lavagna in sala. Ecco perché.</p>

          <ol className="mt-10 space-y-6">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-5 border-t border-cream/10 pt-6">
                <span className="size-20 shrink-0 overflow-hidden rounded-2xl md:size-24">
                  <Img name={s.img} alt="" sizes="96px" className="size-full object-cover" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold text-senape tabular-nums">0{i + 1}</p>
                  <h3 className="font-serif text-2xl italic md:text-3xl">{s.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-cream/75">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 pt-6">
            <p className="text-sm text-cream/65">
              <i className="ri-google-fill mr-1.5 text-cream" />
              <b className="text-cream">61</b> recensioni parlano delle olive, <b className="text-cream">72</b> dei fritti.
            </p>
            <Link
              to="/menu#fritti"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-senape underline-offset-4 hover:underline"
            >
              Olive e fritti nel menu
              <i className="ri-arrow-right-up-line transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
