# Verifikation ved levering

- 19 automatiske tests bestået med Node.js den 8. oktober 2026.
- 14 officielle kontrolnuklider: H-1, H-2, H-3, He-4, C-12, C-14, O-16, Mg-24, Fe-56, Ni-62, Co-60, Pb-208, U-235, U-238.
- Atommasse, evalueret bindingsenergi, konvertering fra micro-u og keV, massedefekt og forskellen til opgavens beregning kontrolleret mod originalfiler.
- Alle 3.558 grundtilstande i de valgte tabeller medtaget; unikke N/Z-koordinater og kildehenvisninger verificeret.
- Søgning på navn, symbol, almindelig og hævet notation samt atomnummer verificeret.
- HTTP-serveren kontrolleret med rigtige forespørgsler i testprocessen: HTML, CSS, JavaScript, JSON og begge originaltabeller returnerer HTTP 200 og korrekt MIME-type. Manglende fil og sti uden for serverroden afvises.
- JavaScript-syntakskontrol bestået.
- Visuel browserkontrol og interaktiv zoom/navigation er ikke verificeret: preview-forbindelsen var utilgængelig i sessionen. Se manuel kontrolliste i README.

Eksempel: Mg-24 har atommasse 23,985041689 u og evalueret samlet bindingsenergi 198,2570472 MeV. Evalueret bindingsenergi pr. nukleon er 8,2607103 MeV/nukleon. Værdierne vises separat.

## Opdatering 21. oktober 2026: navigation i bindingsenergikurven

Zoom med musehjul, knapper, tastatur og pinch samt panorering er aktiveret i kurven. Akser og punktvalg anvender samme koordinattransformation; nulstilling og fokus er aktiveret. Kurvens visning holdes separat fra kernekortet.

22 data- og navigationstests består, herunder tre nye tests af zoom omkring markøren, panorering, fokus, nulstilling og zoomgrænser. Syntakskontrol består. HTTP-testen kunne ikke gentages i denne session, fordi localhost-forbindelsen blev afvist med EACCES. Visuel browserkontrol er ikke udført i denne opdatering.

## Rettelse: søgning i den selvstændige HTML-version

Standalone-byggeren bevarer nu søgefunktionens alias (searchNuclides). En regressionstest eksekverer den leverede HTML-fils faktiske script med en minimal DOM og kontrollerer initialisering, navn, symbol, hævet nuklidnotation, Z, Enter-valg samt A/Z-søgning i kurvevisningen. Testen består. Dette er en automatiseret funktionstest, ikke en visuel browserkontrol.
