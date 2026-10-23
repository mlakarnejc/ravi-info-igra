# RAVI – info igra

Interaktivna spletna igra za informativni dan Srednje šole Ravne z RAVI-jem kot vodnikom.

## Trenutno stanje

Prvi prototip vsebuje:

- uvodni zaslon z RAVI-jem,
- prikaz 8 modulov,
- napredek skozi igro,
- zaklepanje in odklepanje modulov,
- 1. nalogo: **Strojna in programska oprema**,
- večstopenjske namige ob napačnih odgovorih,
- odzive RAVI-ja in prehod na naslednji modul.

Preostali moduli so za zdaj pripravljeni kot ogrodje.

## Zagon

Aplikacija je statična in ne potrebuje namestitve ali strežniškega backenda.

1. Prenesi oziroma kloniraj repozitorij.
2. Odpri `index.html` v sodobnem brskalniku.

## Struktura

```text
ravi-info-igra/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
│   ├── images/
│   ├── sounds/
│   └── ravi/
└── README.md
```

## Razvoj

- `main` – stabilna različica
- `dev` – razvojna različica

Končna grafika RAVI-ja bo pozneje dodana v `assets/ravi/`.

## Cilj igre

Učenec skozi kratke naloge aktivira posamezne RAVI-jeve module. Naloge predstavljajo področja računalništva na šoli. Vsak učenec lahko pride do konca; namen ni ocenjevanje, ampak predstavitev računalništva skozi kratko interaktivno izkušnjo.

Osrednje sporočilo igre: **AI je orodje, računalničar pa mora tehnologijo razumeti, preverjati in pravilno uporabiti.**
