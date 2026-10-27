import { RATINGS } from "../data/site";

export function Proof() {
  return (
    <section aria-label="Cosa dicono di noi in numeri" className="relative z-10 bg-senape text-ink">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 lg:grid-cols-4">
        {RATINGS.map((r, i) => (
          <div
            key={r.label}
            className={`border-ink/15 px-5 py-10 md:px-10 md:py-14 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} ${i === 1 ? "lg:border-r" : ""}`}
          >
            <p className="font-display text-[clamp(3.6rem,10vw,7.5rem)] leading-[0.85] font-black tabular-nums">
              {r.value.toFixed(r.decimals).replace(".", ",") + r.suffix}
            </p>
            <p className="mt-3 text-base font-semibold md:text-lg">{r.label}</p>
            <p className="text-sm text-ink/65">{r.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
