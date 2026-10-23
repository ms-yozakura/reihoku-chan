// Edit photos, mobile crops, poses and copy here. Paths are relative to index.html.
// Unlicensed reference-site photos are NOT bundled; see STORY-ASSETS.md.
const storyScenes = [
  {
    id: "tomioka", title: "海と、おいしいと、\nれいほくちゃん。", eyebrow: "熊本・天草の苓北町から、こんにちは。", location: "富岡巴崎と町並み", theme: "day", side: "right",
    image: "img/town-from-castle.jpg", imageMobile: null,
    imagePosition: "center 65%", imagePositionMobile: "40% center",
    imageAlt: "富岡城から見渡す巴崎と海、向こう岸の町と山並み",
    placeholder: false, character: "img/reihoku-chan.png?v=fd42ce058e",
    speech: "ボクのまち、\nいっしょに歩こう！",
    narration: "海にかこまれた、やさしいまち。\nボクのふるさとを、あんないするね。",
    emphasis: ["おいしい", "ふるさと"],
  },
  {
    id: "citrus", title: "おいしいみかん、みつけた！", location: "みかん畑と海", theme: "citrus", side: "right",
    image: "img/bankan.jpg", imageMobile: null,
    imagePosition: "center", imagePositionMobile: "60% center",
    imageAlt: "青い海を背景に実る晩柑", placeholder: false,
    character: "img/reihoku-chan.png?v=fd42ce058e",
    speech: "みかん、だいすき！",
    narration: "あたたかな日ざしと\n海からのかぜで、\nおいしいみかんが\nそだっているよ！",
    emphasis: ["おいしいみかん"],
  },
  {
    id: "castle", title: "海も、山も、まちも", location: "富岡城跡", theme: "nature", side: "left",
    image: "img/tomioka-castle-ruins.jpg", imageMobile: null,
    imagePosition: "center 65%", imagePositionMobile: "45% center",
    imageAlt: "空の下に広がる富岡城跡の石垣と白壁、周囲のみどり",
    placeholder: false, character: "img/reihoku-chan.png?v=fd42ce058e",
    speech: "わぁ！\nいいながめ！",
    narration: "海を見わたせる、高いところ。\n海も、山も、みどりも、まちも、\nぜんぶつながって\nとってもきれいなんだ！",
    emphasis: ["海も、山も"],
  },
  {
    id: "sunset", title: "このまちを、もっと知ってほしいな", location: "海辺の夕景", theme: "sunset", side: "left",
    image: "img/maybe-sunset.jpg", imageMobile: null,
    imagePosition: "center", imagePositionMobile: "60% center",
    imageAlt: "海辺の草木の向こうに広がる、淡いオレンジ色の夕空と海",
    placeholder: false, character: "img/reihoku-chan.png?v=fd42ce058e",
    speech: "きらきらしてるね！",
    narration: "夕方になると、\n海も空もオレンジ色に。\nこんなすてきなけしきも、\nボクのまちのたからもの。",
    emphasis: ["オレンジ色", "たからもの"],
  },
];

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
  const panels = storyScenes.map((scene, index) => {
    const panel = document.createElement("article");
    panel.id = `story-${scene.id}`;
    panel.className = `story-scene story-${scene.theme} character-${scene.side}`;
    panel.setAttribute("aria-labelledby", `${panel.id}-title`);
    panel.style.setProperty("--photo-position", scene.imagePosition);
    panel.style.setProperty("--photo-position-mobile", scene.imagePositionMobile);
    const picture = document.createElement("picture");
    picture.className = "story-photo";
    if (scene.imageMobile) {
      const source = document.createElement("source");
      source.media = "(max-width: 640px)";
      source.srcset = scene.imageMobile;
      picture.append(source);
    }
    const image = new Image();
    image.alt = scene.imageAlt;
    image.loading = "eager";
    image.decoding = "async";
    image.fetchPriority = index === 0 ? "high" : "low";
    image.addEventListener("error", () => {
      picture.hidden = true;
      panel.classList.add("photo-unavailable");
      const credit = panel.querySelector(".story-credit");
      credit.textContent = "背景写真を準備中";
      credit.hidden = false;
    });
    image.src = scene.image;
    picture.append(image);
    const overlay = document.createElement("div");
    overlay.className = "story-overlay";
    overlay.setAttribute("aria-hidden", "true");
    const copy = document.createElement("div");
    copy.className = "story-copy";

    const title = text("h2", "story-scene-title", "");
    title.id = `${panel.id}-title`;
    const narration = text("p", "story-narration", "");
    // Keep authored lines intact, including emphasis, and size them to their container.
    function appendLines(element, value, emphasis = []) {
      const lines = value.split("\n");
      element.style.setProperty("--line-units", Math.max(...lines.map((line) => [...line].length)) * 1.12);
      const pattern = emphasis.length ? new RegExp(`(${emphasis.map((phrase) =>
        phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g") : null;
      lines.forEach((line) => {
        const row = text("span", "story-line", "");
        (pattern ? line.split(pattern) : [line]).forEach((part) => {
          row.append(emphasis.includes(part)
            ? text("span", "story-emphasis", part) : document.createTextNode(part));
        });
        element.append(row);
      });
    }
    appendLines(narration, scene.narration, scene.emphasis);
    appendLines(title, scene.title, scene.emphasis);

    if (scene.eyebrow) copy.append(text("p", "story-cover-eyebrow", scene.eyebrow));
    copy.append(title, narration);
    const character = document.createElement("div");
    character.className = "story-character";
    const speech = text("p", "story-speech", "");
    appendLines(speech, scene.speech);
    character.append(speech);
    const pose = new Image();
    pose.src = scene.character;
    pose.alt = "レタスと緋扇貝を頭にのせた、みかんほっぺのれいほくちゃん";
    pose.width = 1024; pose.height = 1024;
    pose.addEventListener("error", () => { pose.hidden = true; });
    character.append(pose);
    const credit = text("p", "story-credit", scene.credit || "");
    credit.hidden = !scene.credit;
    const number = text("span", "story-number", `0${index + 1} / 04`);
    number.setAttribute("aria-hidden", "true");
    panel.append(picture, overlay, copy, character, credit, number);
    host.append(panel);
    const link = document.createElement("a");
    link.href = `#${panel.id}`;
    link.textContent = `0${index + 1}`;
    link.setAttribute("aria-label", `${index + 1}：${scene.title}`);
    link.addEventListener("click", (event) => {
      if (!root.classList.contains("is-scroll-story")) return;
      event.preventDefault();
      const distance = root.offsetHeight - root.querySelector(".story-stage").offsetHeight;
      const top = scrollY + root.getBoundingClientRect().top - header.offsetHeight;
      scrollTo({ top: top + distance * (index / storyScenes.length + 0.08), behavior: "instant" });
    });
    progress.append(link);
    return panel;
  });
  const links = [...progress.children];
  function update() {
    queued = false;
    if (root.classList.contains("is-mobile-story")) {
      const bounds = root.getBoundingClientRect();
      const top = header.offsetHeight;
      root.dataset.mobileProgress = bounds.top <= top + 1 && bounds.bottom > top + 80 ? "visible" : "hidden";
      const readingLine = top + (innerHeight - top) * 0.4;
      const current = panels.findIndex((panel) => {
        const rect = panel.getBoundingClientRect();
        return rect.top <= readingLine && rect.bottom > readingLine;
      });
      links.forEach((link, index) => {
        if (index === current) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
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
