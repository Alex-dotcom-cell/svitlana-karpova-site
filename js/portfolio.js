(function () {
  "use strict";

  const root = document.querySelector("[data-portfolio]");
  if (!root) return;

  const filtersEl = root.querySelector(".portfolio-filters");
  const gridEl = root.querySelector(".portfolio-grid");
  const statusEl = root.querySelector(".portfolio-status");

  let data = null;
  let activeCategory = "all";

  function setStatus(message) {
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.hidden = false;
    }
  }

  function hideStatus() {
    if (statusEl) statusEl.hidden = true;
  }

  function hideFilters() {
    if (filtersEl) {
      filtersEl.hidden = true;
      filtersEl.innerHTML = "";
    }
  }

  function showFilters() {
    if (filtersEl) filtersEl.hidden = false;
  }

  function validate(input) {
    if (!input || typeof input !== "object") return false;
    if (!Array.isArray(input.categories)) return false;
    if (!Array.isArray(input.items)) return false;
    return true;
  }

  function renderFilters() {
    if (!filtersEl) return;
    filtersEl.innerHTML = "";

    const usedCategories = {};
    data.items.forEach(function (item) {
      if (item && item.category) usedCategories[item.category] = true;
    });

    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.textContent = "Alle";
    allBtn.setAttribute("aria-pressed", activeCategory === "all" ? "true" : "false");
    allBtn.addEventListener("click", function () {
      activeCategory = "all";
      updatePressed();
      renderItems();
    });
    filtersEl.appendChild(allBtn);

    data.categories.forEach(function (cat) {
      if (!cat || !cat.id) return;
      if (!usedCategories[cat.id]) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = cat.title || cat.id;
      btn.dataset.category = cat.id;
      btn.setAttribute("aria-pressed", activeCategory === cat.id ? "true" : "false");
      btn.addEventListener("click", function () {
        activeCategory = cat.id;
        updatePressed();
        renderItems();
      });
      filtersEl.appendChild(btn);
    });
  }

  function updatePressed() {
    if (!filtersEl) return;
    filtersEl.querySelectorAll("button").forEach(function (btn) {
      const isActive =
        (btn.dataset.category || "all") === activeCategory ||
        (activeCategory === "all" && !btn.dataset.category);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function createMedia(item) {
    if (item.type === "video") {
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "metadata";
      if (item.poster) video.poster = item.poster;
      video.setAttribute("aria-label", item.alt || item.caption || "Video");

      const source = document.createElement("source");
      source.src = item.src;
      source.type = item.mimeType || "video/mp4";
      video.appendChild(source);

      const fallback = document.createElement("p");
      fallback.textContent = "Ihr Browser unterstützt dieses Video nicht.";
      video.appendChild(fallback);
      return video;
    }

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || item.caption || "";
    img.loading = "lazy";
    img.decoding = "async";
    return img;
  }

  function renderItems() {
    if (!gridEl) return;
    gridEl.innerHTML = "";

    const items = data.items.filter(function (item) {
      return activeCategory === "all" || item.category === activeCategory;
    });

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "portfolio-status";
      empty.textContent =
        "Das Portfolio befindet sich derzeit im Aufbau. Arbeiten und Projekte werden hier zu einem späteren Zeitpunkt veröffentlicht.";
      gridEl.appendChild(empty);
      return;
    }

    items.forEach(function (item) {
      if (!item || !item.src) return;

      const article = document.createElement("article");
      article.className = "portfolio-item";
      article.dataset.category = item.category || "";

      const figure = document.createElement("figure");

      const media = createMedia(item);
      figure.appendChild(media);

      const caption = document.createElement("figcaption");
      if (item.caption) {
        const capSpan = document.createElement("span");
        capSpan.textContent = item.caption;
        caption.appendChild(capSpan);
      }

      if (item.link) {
        const link = document.createElement("a");
        link.className = "portfolio-link";
        link.href = item.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = item.linkText || "Mehr erfahren";
        caption.appendChild(document.createElement("br"));
        caption.appendChild(link);
      }

      figure.appendChild(caption);
      article.appendChild(figure);
      gridEl.appendChild(article);
    });
  }

  async function init() {
    try {
      const response = await fetch("data/portfolio.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      const json = await response.json();
      if (!validate(json)) {
        throw new Error("Ungültiges Portfolio-Format");
      }
      data = json;
      hideStatus();

      if (data.items.length === 0) {
        hideFilters();
        hideStatus();
        if (gridEl) {
          gridEl.innerHTML = "";
          const empty = document.createElement("p");
          empty.className = "portfolio-status";
          empty.textContent =
            "Das Portfolio befindet sich derzeit im Aufbau. Arbeiten und Projekte werden hier zu einem späteren Zeitpunkt veröffentlicht.";
          gridEl.appendChild(empty);
        }
        return;
      }

      showFilters();
      renderFilters();
      renderItems();
    } catch (error) {
      setStatus(
        "Das Portfolio konnte derzeit nicht geladen werden. Bitte versuchen Sie es später erneut."
      );
    }
  }

  init();
})();
