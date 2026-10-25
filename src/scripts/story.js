import { storyScenes } from '../data/story.js';
(() => {
  const root = document.querySelector(".kamishibai");
  const host = document.getElementById("story-scenes");
  const progress = root.querySelector(".story-progress");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.querySelector(".header");
  let active = -1;
  let enhancedMode = null;
  let queued = false;
  function text(tag, className, copy) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = copy;
    return element;
  }
  const panels = [...host.querySelectorAll('.story-scene')];
  panels.forEach((panel, index) => {
    const picture = panel.querySelector('.story-photo');
    picture.querySelector('img').addEventListener('error', () => {
      picture.hidden = true;
      panel.classList.add('photo-unavailable');
      const credit = panel.querySelector('.story-credit');
      credit.textContent = '背景写真を準備中';
      credit.hidden = false;
    });
    const link = progress.children[index];
    link.addEventListener('click', (event) => {
      if (root.classList.contains('is-mobile-story')) {
        event.preventDefault();
        goToScene(index);
      } else if (root.classList.contains('is-scroll-story')) {
        event.preventDefault();
        const distance = root.offsetHeight - root.querySelector('.story-stage').offsetHeight;
        const top = scrollY + root.getBoundingClientRect().top - header.offsetHeight;
        scrollTo({ top: top + distance * (index / storyScenes.length + 0.08), behavior: 'instant' });
      }
    });
  });
  const links = [...progress.children];
  const status = text("p", "story-carousel-status", "");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  root.querySelector(".story-bottom").append(status);
  let carouselIndex = 0;
  let carouselWidth = 0;
  function goToScene(index, instant = false) {
    const bounded = Math.max(0, Math.min(storyScenes.length - 1, index));
    host.scrollTo({ left: bounded * host.clientWidth, behavior: instant || motion.matches ? "instant" : "smooth" });
  }
  host.addEventListener("scroll", schedule, { passive: true });
  host.addEventListener("keydown", (event) => {
    if (!root.classList.contains("is-mobile-story")) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      goToScene(carouselIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  function update() {
    queued = false;
    if (root.classList.contains("is-mobile-story")) {
      carouselIndex = Math.max(0, Math.min(storyScenes.length - 1,
        Math.round(host.scrollLeft / Math.max(1, host.clientWidth))));
      root.dataset.carouselIndex = String(carouselIndex);
      links.forEach((link, index) => {
        if (index === carouselIndex) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
      panels.forEach((panel, index) => {
        panel.inert = index !== carouselIndex;
        panel.setAttribute("aria-hidden", String(index !== carouselIndex));
      });
      const announcement = `${carouselIndex + 1} / ${storyScenes.length}：${storyScenes[carouselIndex].title.replaceAll("\n", "")}`;
      if (status.textContent !== announcement) status.textContent = announcement;
      return;
    }
    if (!root.classList.contains("is-scroll-story")) return;
    const distance = root.offsetHeight - root.querySelector(".story-stage").offsetHeight;
    const offset = header.offsetHeight - root.getBoundingClientRect().top;
    const position = offset / distance;
    const next = Math.min(3, Math.max(0, Math.floor(position * 4)));
    if (next === active) return;
    active = next;
    root.dataset.active = storyScenes[next].theme;
    panels.forEach((panel, index) => {
      panel.classList.toggle("is-active", index === next);
      panel.inert = index !== next;
      panel.setAttribute("aria-hidden", String(index !== next));
      if (index === next) links[index].setAttribute("aria-current", "step");
      else links[index].removeAttribute("aria-current");
    });
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }
  function layout() {
    root.style.setProperty("--header-height", `${header.offsetHeight}px`);
    // Phones read the four scenes in normal flow; desktop retains sticky mode.
    const mobile = matchMedia("(max-width: 760px), (hover: none) and (pointer: coarse) and (max-width: 960px)").matches;
    root.classList.toggle("is-mobile-story", mobile);
    if (mobile) {
      host.setAttribute("tabindex", "0");
      host.setAttribute("role", "region");
      host.setAttribute("aria-label", "れいほくちゃんの4つのおはなし");
      host.setAttribute("aria-roledescription", "カルーセル");
      if (carouselWidth !== host.clientWidth) {
        carouselWidth = host.clientWidth;
        goToScene(carouselIndex, true);
      }
    } else {
      ["tabindex", "role", "aria-label", "aria-roledescription"].forEach((attribute) => host.removeAttribute(attribute));
      carouselWidth = 0;
    }
    const enhanced = !mobile && CSS.supports("position", "sticky") &&
      innerHeight - header.offsetHeight >= 540;
    if (enhancedMode === enhanced) {
      update();
      return;
    }
    enhancedMode = enhanced;
    root.classList.toggle("is-scroll-story", enhanced);
    active = -1;
    delete root.dataset.active;
    panels.forEach((panel) => {
      panel.inert = false;
      panel.removeAttribute("aria-hidden");
      panel.classList.remove("is-active");
    });
    links.forEach((link) => link.removeAttribute("aria-current"));
    update();
  }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", layout);
  motion.addEventListener("change", layout);
  layout();
})();
