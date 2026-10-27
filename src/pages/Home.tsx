import { useEffect } from "react";
import { useLocation } from "react-router";
import { Footer } from "../components/Chrome";
import { Day } from "../sections/Day";
import { Hero } from "../sections/Hero";
import { MenuTeaser } from "../sections/MenuTeaser";
import { Olive } from "../sections/Olive";
import { Proof } from "../sections/Proof";
import { Tavolata } from "../sections/Tavolata";
import { Visita } from "../sections/Visita";
import { Voci } from "../sections/Voci";

export default function Home() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 900);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <>
      <main>
        <Hero />
        <Proof />
        <Olive />
        <Day />
        <Tavolata />
        <Voci />
        <MenuTeaser />
        <Visita />
      </main>
      <Footer />
    </>
  );
}
