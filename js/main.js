(function () {
  "use strict";

  // Mobile navigation toggle
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.getElementById("primary-nav");

  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      const isOpen = navList.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
    });

    // Close menu when a link is clicked (mobile)
    navList.addEventListener("click", function (event) {
      if (event.target && event.target.tagName === "A" && navList.classList.contains("is-open")) {
        navList.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Menü öffnen");
      }
    });
  }

  // Tätigkeitsschwerpunkte: je eine Schaltfläche öffnet die zugehörige Beschreibung
  const focusToggles = document.querySelectorAll(".focus-toggle");
  const focusBackButton = document.querySelector(".focus-back-btn");

  if (focusToggles.length) {
    let lastFocusToggle = null;
    let lastScrollY = 0;

    const closeAllFocusPanels = function () {
      focusToggles.forEach(function (item) {
        item.setAttribute("aria-expanded", "false");

        const itemPanel = document.getElementById(item.getAttribute("aria-controls"));
        if (itemPanel) {
          itemPanel.classList.remove("is-open");
        }
      });
    };

    const enterFocusView = function (toggle) {
      lastFocusToggle = toggle;
      lastScrollY = window.scrollY;
      document.body.classList.add("focus-mode");
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      if (focusBackButton) {
        focusBackButton.focus({ preventScroll: true });
      }
    };

    const exitFocusView = function () {
      closeAllFocusPanels();
      document.body.classList.remove("focus-mode");

      // Layout neu berechnen, damit die volle Seitenhöhe vor dem Scrollen gilt
      void document.documentElement.offsetHeight;

      window.scrollTo({ top: lastScrollY, left: 0, behavior: "instant" });

      if (lastFocusToggle) {
        lastFocusToggle.focus({ preventScroll: true });
      }
    };

    focusToggles.forEach(function (toggle) {
      const panel = document.getElementById(toggle.getAttribute("aria-controls"));

      if (!panel) {
        return;
      }

      toggle.addEventListener("click", function () {
        const willOpen = toggle.getAttribute("aria-expanded") !== "true";

        // Nur eine Beschreibung gleichzeitig geöffnet halten
        closeAllFocusPanels();

        if (willOpen && focusBackButton) {
          enterFocusView(toggle);
        }

        toggle.setAttribute("aria-expanded", String(willOpen));
        panel.classList.toggle("is-open", willOpen);

        if (!willOpen && document.body.classList.contains("focus-mode")) {
          exitFocusView();
        }
      });
    });

    if (focusBackButton) {
      focusBackButton.addEventListener("click", exitFocusView);
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("focus-mode")) {
        exitFocusView();
      }
    });
  }

  // Highlight current page in navigation (fallback if aria-current not set)
  const current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-list a").forEach(function (link) {
    const href = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href && href === current) {
      link.setAttribute("aria-current", "page");
    }
  });

  // Current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
