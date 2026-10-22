# Kernekort — nuklidernes atlas

Et komplet statisk, dansk opslagsværk med 3.558 grundtilstande fra **AME2020 og NUBASE2020**. Kernedata medfølger lokalt, så der ikke foretages eksterne API-kald under brug. Ingen afhængigheder skal installeres.

## Kør lokalt

Installér Node.js 20 eller nyere. Åbn en terminal i denne mappe:

```sh
npm start
```

Åbn **http://127.0.0.1:4173** i din browser. Stop med Ctrl+C. Sæt miljøvariablen `PORT`, hvis en anden port ønskes. Udviklingsserveren lytter kun på egen computer.

Du skal bruge HTTP-serveren; dobbeltklik på `dist/index.html` virker ikke, fordi browseren normalt blokerer indlæsning af JSON og moduler fra `file://`.

## Funktioner og betjening

- Canvas-kernekort: N vandret og Z lodret; alle 3.558 nuklider kan vælges.
- Scroll eller +/− for zoom, træk for panorering, ↺ for hele kortet, ⌖ for valgt nuklid. Pinch-zoom på touchskærme.
- Hover viser navn og massetal. Klik viser atommasse, massedefekt, evalueret samlet bindingsenergi, energi pr. nukleon, Z, N, A, stabilitet og halveringstid.
- Når der zoomes ind, viser hver celle nuklidnotation med massetal over protonantal til venstre for grundstofsymbolet, fx ¹⁰₆C. Teksten skalerer med cellen og tilpasses bredden. Søgning og ⌖ zoomer automatisk til en størrelse, hvor notationen kan læses.
- Søg på fx `Magnesium`, `Mg`, `Mg-24`, `²⁴Mg`, `24Mg`, `Z = 12` eller `12`. Grundstofsøgning viser alle isotoper.
- Brug “Find med A og Z” til søgning ud fra massetal (A = protoner + neutroner) og protontal (Z). Fx A = 24 og Z = 12 finder Mg-24 og zoomer til cellen. Ugyldige kombinationer og nuklider, der ikke findes i datasættet, giver en tydelig besked.
- Genvejen `/` fokuserer søgningen. Pil op/ned og Enter vælger søgeresultater; Escape lukker listen. Fokuser kortet med Tab og brug piletaster til nærliggende nuklider, +/− til zoom og Home til nulstilling.
- Stabile nuklider kan fremhæves. Henfaldsfarver viser første henfaldskanal i NUBASE efter eventuel naturlig isotopforekomst (IS).
- Mørkt/lyst tema, valg af decimaler eller betydende cifre og responsivt informationspanel.
- Kopiering af værdier og læsbare formler med enheder og kilde til fx Word. Browserens udklipsholder kræver localhost eller HTTPS; en fallback er inkluderet.
- Sammenligning: fasthold en nuklid med “Sammenlign +”, vælg derefter en anden.
- Bindingsenergikurve viser evalueret MeV/nukleon mod A. Punkter kan vælges. Brug musehjul, +/− eller pinch til zoom, træk for panorering, ↺ til nulstilling og ⌖ til at centrere den valgte nuklid. Akser og punktvalg følger zoom og panorering. Kort og kurve har hver sin visning.

## Datakilder og afgrænsning

Originalfiler fra IAEA Atomic Mass Data Center:

- [AME2020 mass_1.mas20.txt](https://www-nds.iaea.org/amdc/ame2020/mass_1.mas20.txt)
- [NUBASE2020 nubase_4.mas20.txt](https://www-nds.iaea.org/amdc/ame2020/nubase_4.mas20.txt)
- Wang et al., *Chinese Physics C* 45, 030003 (2021). [DOI](https://doi.org/10.1088/1674-1137/abddb0).
- Kondev et al., *Chinese Physics C* 45, 030001 (2021). [DOI](https://doi.org/10.1088/1674-1137/abddae).

Vi undersøgte også [IAEA LiveChart CSV API](https://iaea-nds.github.io/lc_api_notebook/), som understøtter `fields=ground_states&nuclides=all`. Versionsfastlagte AMDC-tabeller blev valgt for at give reproducerbarhed, originaltabelhenvisninger og markering af estimerede masser.

Dette er **2020-evalueringen, udgivet i 2021**, ikke et løbende LiveChart eller et løfte om alle senere opdagede nuklider. Alle grundtilstande i de valgte tabeller er medtaget, inklusive neutronen Z=0. Isomerer og exciterede tilstande er afgrænset fra; de er ikke separate celler i dette N/Z-kort. De 3.558 grundtilstande findes i begge tabeller.

Kildens `#` bevares som estimat fra systematik for masser, bindingsenergier og halveringstider. Manglende værdier bliver `null`, ikke gæt eller nul. Målte/evaluerede masser betegnes sådan, fordi AME kombinerer eksperimentelle oplysninger i en evaluering; “ikke estimeret” betyder ikke nødvendigvis en direkte måling af netop den masse. Original usikkerhed og originaltabels linjenummer følger hver post. Kilder, importdato og SHA-256 findes i JSON-metadata og på hjemmesiden.

Halveringstid, grænsetegn og usikkerhedsnotation gengives fra NUBASE. Enheder som `y`, `ky`, `My` og `Gy` betyder år, tusind, million og milliard år. Stabilitet kommer fra `stbl`; partikelustabile nuklider er mærket. Et estimat af halveringstid er markeret `(est.)`.

## Fysik og enheder

Atommasse er neutral atommasse i u. AME-feltet atomic mass består af et heltal og en micro-u-del, der konverteres til u. AME's bindingsenergi pr. nukleon konverteres fra keV/nukleon til MeV/nukleon.

```text
Δm = Z × 1.00782503223 u + N × 1.00866491595 u − m_atom
E_b(beregnet) = Δm × 931.49410242 MeV/u
E_b/A(beregnet) = E_b(beregnet) / A
```

Panelet foretrækker AME's **evaluerede E_b/A**. Samlet energi er den værdi ganget med A. Den genberegnede værdi og forskellen til den evaluerede værdi står under “Se beregning og konstanter”. AME2020 evaluerer H-1 til 1.007825031898 u og neutronen til 1.00866491590 u, som afviger lidt fra opgavens faste konstanter. Tabelpræcision kan også bidrage. Der afrundes ikke før visning; JavaScripts IEEE-754-tal bruges, så matematikken har almindelig flydende-komma-præcision.

Masseoverskud `(m_atom − A u)c²` gemmes separat i keV og bruges **aldrig** som massedefekt. Masseusikkerheden konverteres fra micro-u. Usikkerhed for samlet evalueret energi er A gange AME's usikkerhed for E_b/A. Der beregnes ikke en kunstig uafhængig massedefektusikkerhed uden kovariansdata. Meget små ikke-nul-værdier vises videnskabeligt, så en valgt visningspræcision ikke skjuler dem som nul.

## Opdatér / genskab data

Python 3.10 eller nyere, standardbibliotek alene:

```sh
python scripts/import_data.py
```

Dette genimporterer de medfølgende originalfiler. For at hente originalfilerne igen:

```sh
python scripts/import_data.py --download
npm test
npm run build
```

Importerens feltsnit følger formatbeskrivelserne øverst i originalfilerne. Ved en ny AME-version skal filnavne, feltsnit, versionsmetadata, fixtures og README opdateres; en ny version må ikke stiltiende kaldes AME2020.

## Kvalitetssikring

```sh
npm test
npm run check
```

Testene kontrollerer officielle atommasse- og bindingsenergifelter samt beregninger for H-1, H-2, H-3, He-4, C-12, C-14, O-16, Mg-24, Fe-56, Ni-62, Co-60, Pb-208, U-235 og U-238. Desuden kontrolleres komplet import, Z+N=A, kildehenvisninger, enhedskonvertering, søgesyntaks, manglende data og HTTP-serveren. Forskellen mellem genberegnet og evalueret samlet bindingsenergi kontrolleres mod en tolerance på 0.00015 MeV for kontrolnukliderne.

Ved leveringen bestod datatests og syntakskontrol. Interaktiv og visuel browser-QA kunne ikke gennemføres i Codex-sessionen: den lokale preview-forbindelse fik timeout, og en alternativ baggrundsserverstart blev afvist af sessionens godkendelsespolitik. Mobil-layout og touchbetjening er implementeret, men skal afprøves på rigtige browsere inden offentliggørelse. Browserkontrol skal især omfatte klik, zoom, panorering, nulstilling, pinch, søgning, kopiering, tema og smalle skærme.

## Deployment

```sh
npm run build
```

Build genskaber også den selvstændige `Kernekort.html`, der kan åbnes direkte uden en server.

Upload **indholdet af `dist/`** til et statisk webhotel, Netlify, Cloudflare Pages, GitHub Pages eller lignende. Build kopierer originaltabellerne til `dist/data/raw/`, så kildelinks virker på hosting. Der kræves ingen backend, databasekonto, build-afhængigheder eller API-nøgler. Brug HTTPS til udklipsholderen. Alle asset- og datastier er relative og virker i en undermappe.

Websitet er leveret lokalt og **ikke offentliggjort**. Der er ikke oprettet en hostingkonto eller en ekstern Site.

## Struktur

```text
dist/              Hjemmeside klar til hosting
  index.html        Dansk, tilgængeligt HTML-layout
  styles.css        Responsive temaer
  app.mjs           Canvas-kort, søgning, panel og betjening
  physics.mjs       Testbare formler og søgelogik
  data/             Lokal JSON og distribuerede originalfiler
data/raw/           Originale AMDC-tabeller
scripts/            Import, statisk server og build
tests/              Fysik-, data-, søge- og HTTP-tests
```

Der er valgt en afhængighedsfri ES-modul/Canvas-løsning frem for Next.js og Tailwind, som var forslag i briefen. Det gør den lokale kørsel og senere statisk hosting enkel og holder kortet hurtigt med tusindvis af celler.



## GitHub Pages

`npm run build` opdaterer både `dist/`, `Kernekort.html` og `docs/`. Mappen `docs/` indeholder den komplette hjemmeside samt `.nojekyll`, så GitHub serverer filerne direkte.

Commit og push ændringerne til GitHub. Vælg derefter **Settings → Pages → Deploy from a branch**, vælg din branch (typisk `main`) og mappen **/docs**, og klik **Save**. GitHub viser hjemmesidens adresse på samme side. Ved senere ændringer: kør build, commit og push.
