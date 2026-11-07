/* ============================================================
   Stellenwerttafel – Bündeln & Entbündeln
   Vanilla JavaScript, keine Abhängigkeiten.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Stellen (von rechts nach links) ----------
     Jede Stelle hat einen hellen Kartenton (card), einen satten
     Punktton (dot) und eine dunklere Schriftfarbe (head). */
  const PLACES = [
    { abbr: "E",   name: "Einer",                    card: "#ffe5df", dot: "#ff7a68", head: "#c8493a" }, // Koralle
    { abbr: "Z",   name: "Zehner",                   card: "#fff1c9", dot: "#f5b523", head: "#a8740a" }, // Sonnengelb
    { abbr: "H",   name: "Hunderter",                card: "#d9f5ea", dot: "#2fbf94", head: "#16805f" }, // Mint
    { abbr: "T",   name: "Tausender",                card: "#dcedfd", dot: "#3d9ff0", head: "#1f6bb0" }, // Himmelblau
    { abbr: "ZT",  name: "Zehn­tausender",      card: "#ebe4fd", dot: "#9478e6", head: "#5f45b0" }, // Lavendel
    { abbr: "HT",  name: "Hundert­tausender",   card: "#fde1ec", dot: "#ec6aa0", head: "#b03a6c" }, // Rosa
    { abbr: "M",   name: "Millionen",                card: "#ffe9d3", dot: "#fb9338", head: "#b25d12" }, // Orange
    { abbr: "ZM",  name: "Zehn­millionen",      card: "#e8f4d6", dot: "#82bc3c", head: "#4f7d17" }, // Grün
    { abbr: "HM",  name: "Hundert­millionen",   card: "#e1e7ff", dot: "#5f7bf2", head: "#3348ad" }, // Indigo
    { abbr: "Mrd", name: "Milliarden",               card: "#d8f2f5", dot: "#25aebf", head: "#127482" }  // Petrol
  ];

  /* Stellenklassen für die Beschriftung über den Spalten */
  const CLASSES = ["", "Tausender", "Millionen", "Milliarden"];

  const MIN_PLACES = 2;
  const MAX_PLACES = PLACES.length;
  const DEFAULT_PLACES = 6;        // E bis HT
  const MAX_DOTS = 40;             // höchstens 4 Zehnerfelder pro Spalte

  /* ---------- Zustand ---------- */
  const state = {
    visible: DEFAULT_PLACES,
    counts: new Array(MAX_PLACES).fill(0)
  };
  let busy = false;   // true, während eine Bündel-/Entbündel-Animation läuft

  /* ---------- DOM ---------- */
  const $ = (sel) => document.querySelector(sel);
  const board = $("#board");
  const placeCountEl = $("#place-count");
  const fewerBtn = $("#fewer-places");
  const moreBtn = $("#more-places");

  /* ---------- Farbhilfen ---------- */
  function mix(hex, other, amount) {
    const a = parseInt(hex.slice(1), 16), b = parseInt(other.slice(1), 16);
    const ch = (v, s) => (v >> s) & 255;
    const m = (s) => Math.round(ch(a, s) + (ch(b, s) - ch(a, s)) * amount);
    return "#" + ((1 << 24) | (m(16) << 16) | (m(8) << 8) | m(0)).toString(16).slice(1);
  }
  function rgba(hex, alpha) {
    const v = parseInt(hex.slice(1), 16);
    return `rgba(${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255}, ${alpha})`;
  }
  function applyColors(el, place) {
    const p = PLACES[place];
    el.style.setProperty("--card", p.card);
    el.style.setProperty("--head", p.head);
    el.style.setProperty("--dot-color", p.dot);
    el.style.setProperty("--dot-light", mix(p.dot, "#ffffff", 0.35));
    el.style.setProperty("--dot-dark", mix(p.dot, "#000000", 0.18));
    el.style.setProperty("--dot-shadow", rgba(mix(p.dot, "#000000", 0.3), 0.35));
  }

  /* ---------- Aufbau der Tafel ----------
     Das Raster bekommt zwischen den Stellenklassen eine schmale
     Zusatzspur, damit man die Dreiergruppen (wie bei den
     Tausenderpunkten) sofort sieht. */
  let columnEls = [];   // Index = Stelle (0 = Einer)

  function buildBoard() {
    board.innerHTML = "";
    columnEls = [];

    const tracks = [];
    let gridCol = 1;
    const placeToGridCol = {};

    // von links (höchste Stelle) nach rechts (Einer)
    for (let place = state.visible - 1; place >= 0; place--) {
      tracks.push("minmax(0, 1fr)");
      placeToGridCol[place] = gridCol++;
      if (place > 0 && place % 3 === 0) {           // Klassengrenze
        tracks.push("0px");
        gridCol++;
      }
    }
    board.style.gridTemplateColumns = tracks.join(" ");

    // Klassenbeschriftungen
    for (let cls = Math.floor((state.visible - 1) / 3); cls >= 0; cls--) {
      const lowest = cls * 3;
      const highest = Math.min(lowest + 2, state.visible - 1);
      const label = document.createElement("div");
      label.className = "class-label";
      label.textContent = CLASSES[cls];
      label.style.gridColumn = `${placeToGridCol[highest]} / ${placeToGridCol[lowest] + 1}`;
      board.appendChild(label);
    }

    // Spalten
    for (let place = state.visible - 1; place >= 0; place--) {
      const p = PLACES[place];
      const col = document.createElement("section");
      col.className = "column";
      col.dataset.place = place;
      col.style.gridColumn = placeToGridCol[place];
      col.setAttribute("aria-label", p.name.replace(/­/g, ""));
      applyColors(col, place);
      col.innerHTML = `
        <div class="column-head">
          <span class="abbr">${p.abbr}</span>
          <span class="name">${p.name}</span>
        </div>
        <div class="dots"></div>
        <div class="column-controls">
          <button class="round-btn minus" type="button" data-action="remove" aria-label="Punkt bei ${p.abbr} entfernen">−</button>
          <button class="round-btn plus" type="button" data-action="add" aria-label="Punkt bei ${p.abbr} hinzufügen">+</button>
        </div>`;
      board.appendChild(col);
      columnEls[place] = col;
    }

    placeCountEl.textContent = state.visible;
    fewerBtn.disabled = state.visible <= MIN_PLACES;
    moreBtn.disabled = state.visible >= MAX_PLACES;

    renderAll();
  }

  /* ---------- Punkte zeichnen ----------
     Punkte liegen in Zehnerfeldern (2 Reihen à 5).
     opts.pop:    Anzahl der neuesten Punkte, die aufploppen sollen
     opts.hidden: Anzahl der neuesten Punkte, die (noch) unsichtbar sind */
  function renderColumn(place, opts = {}) {
    const col = columnEls[place];
    if (!col) return;
    const dotsEl = col.querySelector(".dots");
    const count = state.counts[place];
    const frames = Math.max(1, Math.ceil(count / 10));
    const pop = opts.pop || 0;
    const hidden = opts.hidden || 0;

    dotsEl.innerHTML = "";
    for (let f = 0; f < frames; f++) {
      const frame = document.createElement("div");
      frame.className = "frame";
      for (let s = 0; s < 10; s++) {
        const i = f * 10 + s;
        const cell = document.createElement("div");
        if (i < count) {
          cell.className = "dot";
          cell.dataset.index = i;
          if (i >= count - hidden) cell.classList.add("is-hidden");
          else if (i >= count - pop) cell.classList.add("pop");
        } else {
          cell.className = "slot";
        }
        frame.appendChild(cell);
      }
      dotsEl.appendChild(frame);
    }
  }

  function renderAll() {
    for (let place = 0; place < state.visible; place++) renderColumn(place);
    fitDots();
  }

  /* ---------- Punktgröße an den Platz anpassen ---------- */
  function fitDots() {
    const sample = columnEls[0] && columnEls[0].querySelector(".dots");
    if (!sample) return;
    const style = getComputedStyle(sample);
    const w = sample.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const h = sample.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);

    let frames = 1;
    for (let place = 0; place < state.visible; place++) {
      frames = Math.max(frames, Math.ceil(state.counts[place] / 10));
    }
    // Breite: 5 Punkte + 4 Lücken (0,16) + 2 Ränder (0,16)  = 5,96 · d
    const byWidth = w / 5.96;
    // Höhe: pro Feld 2 Punkte + Lücke + 2 Ränder = 2,48 · d, dazwischen 0,3 · d
    const byHeight = h / (frames * 2.48 + (frames - 1) * 0.3);
    const d = Math.max(14, Math.min(64, byWidth, byHeight));
    document.documentElement.style.setProperty("--dot", d.toFixed(1) + "px");
  }

  /* ---------- Zahl unter der Tafel ---------- */
  const numberEl = $("#number");
  const toggleBtn = $("#toggle-number");
  let numberShown = true;

  function currentValue() {
    // BigInt, damit auch viele Punkte in hohen Stellen exakt bleiben
    let value = 0n;
    for (let place = MAX_PLACES - 1; place >= 0; place--) {
      value = value * 10n + BigInt(state.counts[place]);
    }
    return value;
  }

  function formatNumber(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function updateNumber() {
    if (numberShown) {
      numberEl.textContent = formatNumber(currentValue());
      numberEl.classList.remove("is-hidden");
    } else {
      numberEl.textContent = "?";
      numberEl.classList.add("is-hidden");
    }
  }

  toggleBtn.addEventListener("click", () => {
    numberShown = !numberShown;
    toggleBtn.textContent = numberShown ? "Zahl verbergen" : "Zahl zeigen";
    toggleBtn.setAttribute("aria-pressed", String(numberShown));
    updateNumber();
  });

  /* ---------- Sprechblase ---------- */
  const bubble = $("#bubble");
  let bubbleTimer = 0;

  function say(text, x, y) {
    clearTimeout(bubbleTimer);
    bubble.textContent = text;
    bubble.hidden = false;
    // innerhalb des Bildschirms halten
    const half = Math.min(170, window.innerWidth / 2 - 12);
    bubble.style.left = Math.max(half + 12, Math.min(window.innerWidth - half - 12, x)) + "px";
    bubble.style.top = Math.max(140, y - 24) + "px";
    bubble.classList.remove("hide", "show");
    void bubble.offsetWidth;            // Animation neu starten
    bubble.classList.add("show");
    bubbleTimer = setTimeout(() => {
      bubble.classList.replace("show", "hide");
      bubbleTimer = setTimeout(() => { bubble.hidden = true; }, 300);
    }, 2600);
  }

  function sayAbove(el, text) {
    const r = el.getBoundingClientRect();
    say(text, r.left + r.width / 2, r.top);
  }

  /* ---------- Punkte hinzufügen / entfernen ---------- */
  function addDot(place) {
    const col = columnEls[place];
    if (state.counts[place] >= MAX_DOTS) {
      sayAbove(col.querySelector(".dots"), "Hier ist kein Platz mehr. Bündle doch mal!");
      return;
    }
    state.counts[place]++;
    renderColumn(place, { pop: 1 });
    fitDots();
    updateNumber();
  }

  function removeDot(place) {
    if (state.counts[place] === 0) return;
    const dots = columnEls[place].querySelectorAll(".dot:not(.vanish)");
    const last = dots[dots.length - 1];
    if (!last) return;
    state.counts[place]--;              // Zustand sofort, Bild nach der Animation
    updateNumber();
    last.classList.remove("pop");
    last.classList.add("vanish");
    // Zeitgeber statt animationend: funktioniert auch, wenn der Browser
    // Animationen auslässt (z. B. „Bewegung reduzieren“)
    setTimeout(() => {
      if (!busy) { renderColumn(place); fitDots(); }
    }, 300);
  }

  board.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const place = Number(btn.closest(".column").dataset.place);
    if (btn.dataset.action === "add") addDot(place);
    else removeDot(place);
  });

  /* ---------- Alles löschen ---------- */
  $("#clear").addEventListener("click", () => {
    state.counts.fill(0);
    updateNumber();
    const dots = board.querySelectorAll(".dot");
    if (!dots.length) return;
    dots.forEach((d) => { d.classList.remove("pop"); d.classList.add("vanish"); });
    setTimeout(renderAll, 320);
  });

  /* ---------- Anzahl der Stellen ---------- */
  function setVisible(n) {
    n = Math.max(MIN_PLACES, Math.min(MAX_PLACES, n));
    if (n === state.visible) return;
    if (n < state.visible) {
      const top = state.visible - 1;   // die Spalte, die verschwinden würde
      if (state.counts[top] > 0) {
        sayAbove(columnEls[top], `Die ${PLACES[top].abbr}-Spalte ist noch nicht leer.`);
        return;
      }
    }
    state.visible = n;
    buildBoard();
  }

  fewerBtn.addEventListener("click", () => setVisible(state.visible - 1));
  moreBtn.addEventListener("click", () => setVisible(state.visible + 1));

  new ResizeObserver(fitDots).observe(board);

  buildBoard();
  updateNumber();
})();
