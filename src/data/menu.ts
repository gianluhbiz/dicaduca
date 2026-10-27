// Piatti ricavati da recensioni e foto pubbliche (Google, Tripadvisor, Facebook).
// TODO: sostituire piatti e prezzi con il menu ufficiale del cliente prima della pubblicazione.

export type Dish = {
  name: string;
  desc: string;
  price: string;
  veg?: boolean;
  star?: boolean;
  img?: string;
};

export type Category = {
  id: string;
  title: string;
  kicker: string;
  img: string;
  dishes: Dish[];
};

export const MENU: Category[] = [
  {
    id: "fritti",
    title: "Olive & Fritti",
    kicker: "Il motivo per cui sei qui",
    img: "olive-cono",
    dishes: [
      {
        name: "Olive all'ascolana",
        desc: "Ripiene a mano di carni miste, impanate e fritte quando le ordini. Dieci pezzi nel cono.",
        price: "8",
        star: true,
        img: "olive-cono",
      },
      {
        name: "Fritto misto ascolano",
        desc: "Olive, cremini, pecorino, mozzarelline, anelli di cipolla e zucchine.",
        price: "14",
        star: true,
        img: "fritto-misto",
      },
      { name: "Cremini fritti", desc: "La crema fritta delle feste ascolane, morbida dentro.", price: "6", veg: true },
      { name: "Pecorino fritto", desc: "Pecorino dei Sibillini in panatura croccante.", price: "6", veg: true },
      { name: "Mozzarelline fritte", desc: "Fior di latte in pastella leggera.", price: "6", veg: true },
      { name: "Olive nel secchiello", desc: "Il formato da condividere: venti olive per il tavolo.", price: "15", img: "olive-secchiello" },
    ],
  },
  {
    id: "taglieri",
    title: "Taglieri",
    kicker: "Da dividere, o forse no",
    img: "tagliere-salumi",
    dishes: [
      {
        name: "Tagliere del Duca",
        desc: "Ciauscolo, lonza, prosciutto, pecorino e ricotta fresca con pane caldo.",
        price: "16",
        star: true,
        img: "tagliere-salumi",
      },
      {
        name: "Aperitivo in piazza",
        desc: "Dalle 18 alle 20: calice o spritz, piccolo tagliere e olive.",
        price: "12",
        img: "tagliere-spritz",
      },
      { name: "Formaggi del Piceno", desc: "Selezione di pecorini con miele e vino cotto.", price: "14", veg: true },
    ],
  },
  {
    id: "primi",
    title: "Primi",
    kicker: "Pasta tirata, sughi lenti",
    img: "spaghetti-sugo",
    dishes: [
      {
        name: "Spaghetti all'ascolana",
        desc: "Pomodoro, olive tenere ascolane e un fondo di carne.",
        price: "12",
        star: true,
        img: "spaghetti-sugo",
      },
      { name: "Vincisgrassi", desc: "La lasagna marchigiana, al forno, con ragù di carni miste.", price: "13", img: "vincisgrassi" },
      {
        name: "Tagliolini piselli, carciofi e porri",
        desc: "Crema di piselli, carciofi saltati, porro croccante.",
        price: "12",
        veg: true,
      },
      { name: "Tagliatelle ai funghi", desc: "Funghi di stagione, aglio, prezzemolo.", price: "13", veg: true, img: "tagliolini-funghi" },
      { name: "Chitarrina pomodoro e ricotta", desc: "Pomodoro fresco, ricotta e peperoncino.", price: "11", veg: true, img: "spaghetti-ricotta" },
      { name: "Trofie al pomodoro", desc: "Semplici, per i più piccoli e per chi le ama così.", price: "9", veg: true },
    ],
  },
  {
    id: "secondi",
    title: "Secondi",
    kicker: "Brace e padella",
    img: "tagliata-grana",
    dishes: [
      {
        name: "Tagliata di manzo",
        desc: "Rucola, scaglie di grana e pomodorini.",
        price: "18",
        star: true,
        img: "tagliata-grana",
      },
      { name: "Tonno scottato", desc: "Crosta di sesamo, insalatina e pomodoro.", price: "17", img: "tonno-scottato" },
      { name: "Pollo coi peperoni", desc: "Cotto lento, come la domenica.", price: "13", img: "pollo-peperoni" },
      { name: "Pollo alla griglia", desc: "Petto alla brace con insalata di stagione.", price: "12", img: "pollo-insalata" },
      { name: "Grigliata di verdure", desc: "Zucchine, melanzane, peperoni, olio nuovo.", price: "10", veg: true, img: "grigliata-verdure" },
    ],
  },
  {
    id: "burger",
    title: "Burger",
    kicker: "Vino, birra e cucina",
    img: "burger",
    dishes: [
      {
        name: "Il Duca",
        desc: "Manzo 200 g, bacon croccante, formaggio fuso, cipolla. Con patate.",
        price: "14",
        star: true,
        img: "burger",
      },
      { name: "L'Ascolano", desc: "Manzo, pecorino, crema di olive. Con patate.", price: "15" },
      { name: "Verde", desc: "Burger vegetale, verdure grigliate, salsa allo yogurt.", price: "13", veg: true },
    ],
  },
  {
    id: "dolci",
    title: "Dolci",
    kicker: "Per chiudere in piazza",
    img: "tavolo-apparecchiato",
    dishes: [
      { name: "Cantucci e vino cotto", desc: "Come è scritto sulla nostra lavagna.", price: "6", veg: true, star: true },
      { name: "Tiramisù della casa", desc: "Savoiardi, caffè, mascarpone.", price: "6", veg: true },
      { name: "Torta della nonna", desc: "Pasta frolla, crema e pinoli.", price: "6", veg: true },
    ],
  },
  {
    id: "bere",
    title: "Da bere",
    kicker: "Il Piceno nel bicchiere",
    img: "vino-piazza",
    dishes: [
      { name: "Rosso Piceno Superiore", desc: "Calice / bottiglia.", price: "6 / 24", img: "vino-piazza" },
      { name: "Offida Pecorino DOCG", desc: "Calice / bottiglia.", price: "6 / 24" },
      { name: "Passerina", desc: "Calice / bottiglia.", price: "5 / 20" },
      { name: "Spritz", desc: "Aperol o Campari, con le olive.", price: "7", img: "tagliere-spritz" },
      { name: "Birra artigianale marchigiana", desc: "Chiedi le spine del momento.", price: "6" },
      { name: "Anisetta", desc: "Il digestivo di Ascoli, liscia o con la mosca.", price: "4" },
    ],
  },
];
