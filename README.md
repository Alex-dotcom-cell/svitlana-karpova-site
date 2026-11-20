# Persönliche Website – Svitlana Karpova

Statische, barrierefreie Website (Deutsch) für Bewerbungen in Deutschland.
Technologie: reines HTML5, CSS3 und Vanilla JavaScript – kein Build-Schritt, keine Abhängigkeiten.

## Lokal starten

ES-Module/Fetch benötigen einen HTTP-Server (nicht `file://`).

```bash
# Im Stammverzeichnis des Repositorys ausführen
python3 -m http.server 8000
```

Dann im Browser öffnen: http://localhost:8000

Alternativ (ohne Installation):

```bash
npx serve .
```

## Struktur

- `index.html` – Startseite
- `ueber-mich.html` – Über mich + Portfolio
- `kontakt.html` – Kontakt
- `css/styles.css` – gemeinsames Styling
- `js/main.js` – Navigation, Jahreszahl
- `js/portfolio.js` – datengetriebenes Portfolio
- `data/portfolio.json` – Kategorien und Medien-Einträge
- `assets/img/` – Bilder
- `assets/video/` – Videos

## Inhalte pflegen

- Platzhalter (gelb markiert, in eckigen Klammern) durch echte Angaben ersetzen.
- Keine erfundenen Daten, Lebensläufe, Formulare oder Rechtstexte hinzufügen.
- Impressum und Datenschutzerklärung müssen mit echten Angaben ergänzt werden.

## Portfolio-Medien hinzufügen

1. Bild/Video in `assets/img/` bzw. `assets/video/` ablegen.
2. Eintrag in `data/portfolio.json` unter `items` hinzufügen:

```json
{
  "id": "eindeutige-id",
  "category": "kangoo-jumps",
  "type": "image",
  "src": "assets/img/beispiel.jpg",
  "alt": "Beschreibung für Barrierefreiheit",
  "caption": "Kurze Bildunterschrift",
  "link": null
}
```

Für Videos `"type": "video"` und optional `"poster": "assets/img/poster.jpg"`, `"mimeType": "video/mp4"`.

Neue Kategorie = neuer Eintrag in `categories`. Die Filter-Buttons werden automatisch erzeugt.

## Veröffentlichung (später)

Statisches Hosting, z. B. GitHub Pages, Netlify, Vercel oder Cloudflare Pages.
Vor Veröffentlichung: echte Inhalte, Medien, Impressum/Datenschutz und (falls gewünscht) CV-PDF einfügen; Platzhalter entfernen.
