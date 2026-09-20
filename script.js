/* ==========================================================
   PORTFOLIO SKELETON - script.js
   This file adds the left and right arrows to each gallery.
   You do not need to edit it.
   ========================================================== */

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const ICON_PREV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const ICON_NEXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  document.querySelectorAll("[data-gallery]").forEach(initGallery);

  function initGallery(root) {
    const track = root.querySelector(".gallery-track");
    if (!track) return;

    const slides = Array.from(track.children);
    if (slides.length < 2) return; // One slide: no arrows needed.

    slides.forEach((slide, i) => {
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", `${i + 1} of ${slides.length}`);
    });

    root.insertAdjacentHTML(
      "beforeend",
      `<button class="gallery-btn gallery-btn-prev" type="button" aria-label="Previous slide">${ICON_PREV}</button>
       <button class="gallery-btn gallery-btn-next" type="button" aria-label="Next slide">${ICON_NEXT}</button>
       <p class="gallery-count" aria-live="polite"></p>`
    );

    const prev = root.querySelector(".gallery-btn-prev");
    const next = root.querySelector(".gallery-btn-next");
    const count = root.querySelector(".gallery-count");
    let current = 0;

    const goTo = (index) => {
      const target = Math.max(0, Math.min(slides.length - 1, index));
      track.scrollTo({
        left: target * track.clientWidth,
        behavior: reduceMotion.matches ? "auto" : "smooth",
      });
    };

    const update = () => {
      const index = Math.round(track.scrollLeft / track.clientWidth) || 0;
      if (index !== current) {
        // Stop video in the slide that the user left.
        slides[current].querySelectorAll("video").forEach((v) => v.pause());
        current = index;
      }
      count.textContent = `${index + 1} / ${slides.length}`;
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    };

    let ticking = false;
    track.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      },
      { passive: true }
    );

    prev.addEventListener("click", () => goTo(current - 1));
    next.addEventListener("click", () => goTo(current + 1));

    // Keep the current slide in place when the window size changes.
    window.addEventListener("resize", () => {
      track.scrollTo({ left: current * track.clientWidth, behavior: "auto" });
    });

    // Arrow keys work when the gallery has focus.
    track.addEventListener("keydown", (event) => {
      if (event.target !== track) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(current - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(current + 1);
      }
    });

    update();
  }
})();
