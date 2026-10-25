// Alternate single and double blinks every 3–5 seconds while visible.
(() => {
  const character = document.querySelector("#profile .about-character");
  if (!character) return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = !("IntersectionObserver" in window);
  let ready = false;
  let timer;
  const singleBlink = [["half", 70], ["closed", 100], ["half", 70]];
  let frames = singleBlink;
  let doubleNext = false;
  const canAnimate = () => ready && visible && !document.hidden && !motion.matches;
  function stop() {
    clearTimeout(timer);
    timer = undefined;
    delete character.dataset.eyes;
    character.classList.remove("is-awake");
  }
  function scheduleBlink() {
    timer = setTimeout(() => {
      frames = doubleNext ? [...singleBlink, ["open", 100], ...singleBlink] : singleBlink;
      blink(0);
    }, 1000 + Math.random() * 2000);
  }
  function blink(index) {
    if (!canAnimate()) { stop(); return; }
    if (index === frames.length) {
      delete character.dataset.eyes;
      doubleNext = !doubleNext;
      scheduleBlink();
      return;
    }
    const [eyes, duration] = frames[index];
    character.dataset.eyes = eyes;
    timer = setTimeout(() => blink(index + 1), duration);
  }
  function sync() {
    stop();
    if (!canAnimate()) return;
    character.classList.add("is-awake");
    scheduleBlink();
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.1 }).observe(character);
  }
  // Decode all expressions before swapping; a failed asset leaves the open eyes.
  Promise.all([...character.querySelectorAll("img")].map((img) => img.decode()))
    .then(() => { ready = true; sync(); })
    .catch(() => { stop(); });
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", sync);
})();
