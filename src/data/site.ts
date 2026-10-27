export const SITE = {
  name: "Dicaduca",
  claim: "Si cucina sempre pensando a qualcuno, altrimenti stai solo facendo da mangiare.",
  street: "Piazza del Popolo · Via Cino del Duca 10",
  city: "63100 Ascoli Piceno (AP)",
  phone: "0736 250890",
  phoneHref: "tel:+390736250890",
  // Numero cellulare pubblicato su Tripadvisor: verificare col cliente che sia attivo su WhatsApp.
  whatsapp: "393357065966",
  email: "dicaduca.ascolipiceno@gmail.com",
  instagram: "https://www.instagram.com/dicaduca_ap/",
  facebook: "https://www.facebook.com/dicaduca.ascolipiceno/",
  tripadvisor:
    "https://www.tripadvisor.it/Restaurant_Review-g194676-d10637057-Reviews-Dicaduca-Ascoli_Piceno_Province_of_Ascoli_Piceno_Marche.html",
  maps: "https://www.google.com/maps/place/Dicaduca/@42.8543209,13.5757822,17z/data=!4m6!3m5!1s0x1331fd104e35174f:0xa282218c64432b1!8m2!3d42.8543209!4d13.5757822",
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=Dicaduca%2C%20Piazza%20del%20Popolo%2C%20Ascoli%20Piceno",
  mapEmbed: "https://www.google.com/maps?q=Dicaduca,+Piazza+del+Popolo,+Ascoli+Piceno&z=17&output=embed",
};

export const RATINGS = [
  { value: 4.3, decimals: 1, suffix: "", label: "su Google", detail: "722 recensioni" },
  { value: 4.2, decimals: 1, suffix: "", label: "su Tripadvisor", detail: "Travellers' Choice 2026" },
  { value: 98, decimals: 0, suffix: "%", label: "ti consiglia", detail: "252 recensioni Facebook" },
  { value: 16, decimals: 0, suffix: "°", label: "su 243 ristoranti", detail: "ad Ascoli Piceno" },
];

export type ReviewTag = "olive" | "fritti" | "piazza" | "servizio" | "feste" | "veg";

export const REVIEW_TAGS: { id: ReviewTag; label: string; count?: number }[] = [
  { id: "olive", label: "Olive ascolane", count: 61 },
  { id: "fritti", label: "Fritti", count: 72 },
  { id: "piazza", label: "Piazza", count: 43 },
  { id: "servizio", label: "Servizio" },
  { id: "feste", label: "Feste" },
  { id: "veg", label: "Vegetariano" },
];

export const REVIEWS: {
  text: string;
  author: string;
  source: "Google" | "Tripadvisor";
  when?: string;
  tags: ReviewTag[];
}[] = [
  {
    text: "Senza dubbio le migliori olive ascolane di Ascoli Piceno! Cibo genuino, di ottima qualità e fuori menù davvero eccezionali.",
    author: "Degustibusnon77",
    source: "Tripadvisor",
    when: "ottobre 2026",
    tags: ["olive"],
  },
  {
    text: "Mangiato bene a cena, con la musica di sottofondo del bar Meletti e la veduta di Palazzo dei Capitani come sfondo.",
    author: "Massimo Viola",
    source: "Google",
    tags: ["piazza"],
  },
  {
    text: "Vedere la preparazione delle olive dinanzi ai miei occhi, da parte di Simonetta… un'aria di casa.",
    author: "Matteo Orlando",
    source: "Google",
    tags: ["olive", "servizio"],
  },
  {
    text: "Il mix dei fritti molto buono e molto delicata la crema fritta.",
    author: "Recensione Google",
    source: "Google",
    tags: ["fritti"],
  },
  {
    text: "Cibo di qualità a un ottimo prezzo. Fatevi consigliare dal maestro di cerimonia Berardo e non verrete delusi.",
    author: "Catia S",
    source: "Tripadvisor",
    when: "dicembre 2025",
    tags: ["servizio"],
  },
  {
    text: "Ottime olive, cipolle, mozzarelle e pecorino fritto. Davvero da non perdere.",
    author: "Recensione Google",
    source: "Google",
    tags: ["fritti", "olive"],
  },
  {
    text: "Servizio all'altezza della splendida piazza in cui si trova il locale. Qualità del cibo buona e prezzi giusti.",
    author: "GianniPZ",
    source: "Tripadvisor",
    when: "agosto 2026",
    tags: ["piazza", "servizio"],
  },
  {
    text: "Sono stato in questo posto per festeggiare la laurea di mia nipote. Tutto ottimo e abbondante.",
    author: "Francesco L",
    source: "Tripadvisor",
    when: "ottobre 2026",
    tags: ["feste"],
  },
  {
    text: "Varietà di cibo vegetariano, riconoscibile dal menù con una fogliolina.",
    author: "Gianluigi Bergamo",
    source: "Google",
    tags: ["veg"],
  },
  {
    text: "Prezzi onesti, piatti squisiti e porzioni abbondanti. Bravissimi tutti.",
    author: "Recensione Google",
    source: "Google",
    tags: ["servizio", "feste"],
  },
];
