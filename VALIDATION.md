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
