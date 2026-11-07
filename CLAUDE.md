# Stellenwerttafel – Bündeln & Entbündeln

## Zweck
Interaktive Stellenwerttafel für den Mathematikunterricht in Klasse 5,
gedacht für die digitale Tafel (Smartboard). Sie soll das Bündeln
(10 Einer → 1 Zehner, 10 Tausender → 1 Zehntausender usw.) und das
Entbündeln anschaulich machen – auch bei großen Zahlen.

## Funktionen
- Spalten von rechts nach links: E, Z, H, T, ZT, HT, M
- Über einen Regler oder Buttons lässt sich einstellen, wie viele Spalten sichtbar sind
  (Standard: E bis HT). Später soll die Tafel bis zur Milliarde erweiterbar sein.
- Jede Spalte hat einen runden „+“- und einen „–“-Button, um Punkte hinzuzufügen oder zu entfernen.
- Bündeln: Einen Punkt eine Spalte nach links ziehen. Gibt es in der Spalte
  mindestens 10 Punkte, verschmelzen 10 davon zu 1 Punkt in der linken Spalte.
  Bei weniger als 10 Punkten federt der Punkt zurück und eine freundliche
  Sprechblase erscheint: „Zum Bündeln brauchst du 10 Punkte!“
- Entbündeln: Einen Punkt eine Spalte nach rechts ziehen. Er zerfällt dort in 10 Punkte.
- Unter der Tafel steht die dargestellte Zahl in großer Schrift mit Tausenderpunkten
  (z. B. 1.204.530). Sie lässt sich per Button ein- und ausblenden, damit die
  Klasse die Zahl erst selbst bestimmen kann.
- Ein Button „Alles löschen“

## Gestaltung (wichtig!)
- Stil: freundlich, rund und klar. Ansprechend für 10- bis 11-Jährige,
  aber nicht kleinkindhaft.
- Keine harten Ecken: Spalten als große abgerundete Karten (Radius ca. 24 px),
  Buttons komplett rund oder pillenförmig
- Punkte als runde, leicht plastische Plättchen mit sanftem Farbverlauf und weichem Schatten
- Jede Stelle hat eine eigene Farbe aus einer harmonischen, kräftigen, aber nicht
  grellen Palette. Dazu gehören ein heller Kartenhintergrund und ein satter Punkt
  (z. B. E = Koralle, Z = Sonnengelb, H = Mint, T = Himmelblau, ZT = Lavendel …).
- Ein warmer, heller Hintergrund (z. B. Cremeweiß), kein reines Weiß, kein Grau
- Eine runde, gut lesbare Schrift (z. B. „Nunito“ oder „Baloo 2“), lokal
  eingebunden, damit die App auch offline funktioniert
- Spaltenköpfe groß und fett (E, Z, H …), darunter klein der ausgeschriebene Name („Einer“)
- Punkte in Zehnerfeldern angeordnet (2 Reihen à 5), damit man sie auf einen Blick erfassen kann
- Bewegung: weiche, federnde Animationen. Ein Punkt „ploppt“ beim Hinzufügen
  auf, beim Bündeln fliegen 10 Punkte zusammen und werden zu einem, beim
  Entbündeln springt ein Punkt in 10 auseinander. Nichts ist hektisch, alles dauert ca. 0,4–0,6 s.
- Gut lesbar aus 5 m Entfernung, Bedienelemente mindestens 64 px groß

## Technik
- Nur HTML, CSS und Vanilla-JavaScript, ohne Frameworks und ohne Build-Schritt
- Pointer Events, damit Maus, Finger und Tafelstift gleichermaßen funktionieren
- Läuft offline und wird über GitHub Pages veröffentlicht

## Arbeitsweise
- Kleine Schritte: nach jedem Feature kurz erklären, was geändert wurde
- Nach jedem funktionierenden Schritt einen Git-Commit mit verständlicher deutscher Nachricht machen
