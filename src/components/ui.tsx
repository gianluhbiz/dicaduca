import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { getStatus, useRomeNow } from "../lib/hours";
import { EASE_OUT } from "../lib/hooks";

type ImgProps = {
  name: string;
  alt: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
};

/** Foto in /public/img, con versione piccola per i telefoni. */
export function Img({ name, alt, className, sizes = "(min-width: 768px) 50vw, 100vw", eager }: ImgProps) {
  return (
    <img
      src={`/img/${name}.webp`}
      srcSet={`/img/${name}-sm.webp 640w, /img/${name}.webp 1600w`}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={className}
    />
  );
}

/** Il marchio a triangolo, colorabile con il colore del testo. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return <span aria-hidden className={`mask-logo block shrink-0 bg-current ${className}`} />;
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-end gap-1 font-display font-extrabold uppercase tracking-[0.08em] ${className}`}>
      <span className="border-b-2 border-current pb-px leading-none">Dicaduca</span>
      <svg viewBox="0 0 10 10" className="mb-[3px] size-[0.6em]" aria-hidden>
        <path d="M10 0V10H0Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function StatusChip({ className = "" }: { className?: string }) {
  const status = getStatus(useRomeNow());
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium ring-1 ring-current/20 ${className}`}
    >
      <span className="relative flex size-2">
        {status.open && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-oliva opacity-60 motion-reduce:animate-none" />
        )}
        <span className={`relative inline-flex size-2 rounded-full ${status.open ? "bg-[#9db35a]" : "bg-rosso"}`} />
      </span>
      <span>
        {status.short} <span className="opacity-60">· {status.detail}</span>
      </span>
    </span>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 0,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Riga di testo che sale da una maschera. */
export function MaskLine({
  children,
  delay = 0,
  className = "",
  inView = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  inView?: boolean;
}) {
  // Allo scroll il titolo resta fermo: si anima solo al caricamento della pagina.
  if (inView) return <span className={`block ${className}`}>{children}</span>;
  return (
    <span className={`block overflow-hidden pb-[0.06em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] ${className}`}>
      <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden>
        <path d="M10 0V10H0Z" fill="currentColor" />
      </svg>
      {children}
    </p>
  );
}

export const btnPrimary =
  "group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-senape px-6 font-semibold text-ink transition-[transform,background-color] duration-150 ease-out-strong hover:bg-[#edc25a] active:scale-[0.97] cursor-pointer";
export const btnGhost =
  "group inline-flex h-13 items-center justify-center gap-2 rounded-full px-6 font-semibold ring-1 ring-current/25 transition-[transform,background-color] duration-150 ease-out-strong hover:bg-current/10 active:scale-[0.97] cursor-pointer";
