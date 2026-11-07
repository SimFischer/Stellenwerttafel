# Stellenwerttafel – Bündeln & Entbündeln

Interaktive Stellenwerttafel für den Mathematikunterricht in Klasse 5,
gemacht für die digitale Tafel. Läuft komplett offline im Browser –
ohne Installation, ohne Frameworks, ohne Build-Schritt.

## Bedienung

| Was | Wie |
| --- | --- |
| Punkt hinzufügen / entfernen | runde **+** / **–** Buttons unter jeder Spalte |
| **Bündeln** | einen Punkt eine Spalte nach **links** ziehen – 10 Punkte werden zu 1 |
| **Entbündeln** | einen Punkt eine Spalte nach **rechts** ziehen – er zerfällt in 10 |
| Anzahl der Stellen | oben rechts mit – / + (2 bis 10 Stellen, E bis Mrd) |
| Zahl verbergen / zeigen | Button unten links – damit die Klasse die Zahl erst selbst bestimmt |
| Alles löschen | Button unten rechts |

Hat eine Spalte weniger als 10 Punkte, federt der gezogene Punkt zurück
und eine Sprechblase erklärt, warum. Pro Spalte passen höchstens
40 Punkte (4 Zehnerfelder).

## Starten

- **Online:** über GitHub Pages (Einstellungen → Pages → Branch `main`, Ordner `/ (root)`).
- **Offline:** den Ordner herunterladen und `index.html` im Browser öffnen.

## Aufbau

```
index.html        Seitenstruktur
css/style.css     Gestaltung, Farben, Animationen
js/app.js         Logik (Zustand, Zeichnen, Ziehen, Bündeln)
fonts/            Schrift „Nunito“ (SIL Open Font License, siehe fonts/OFL.txt)
```
