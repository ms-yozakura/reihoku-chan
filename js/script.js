// Build ruby with DOM nodes: dynamic speech and dialogs use the same readings.
const readings = {
  苓北町: "れいほくまち",
  苓北: "れいほく",
  海: "うみ",
  貝: "かい",
  山: "やま",
  緋扇貝: "ひおうぎがい",
};
function setReadableText(element, text) {
  element.replaceChildren();
  text.split(/(苓北町|緋扇貝|苓北|海|山|貝)/g).forEach((part) => {
    if (!readings[part]) {
      element.append(document.createTextNode(part));
      return;
    }
    const ruby = document.createElement("ruby");
    ruby.append(document.createTextNode(part));
    const rt = document.createElement("rt");
    rt.textContent = readings[part];
    ruby.append(rt);
    element.append(ruby);
  });
}
const comments = [
  "こんにちは！苓北からきたばい！",
  "苓北町は、海も山もあって、たのしいよ！",
  "あたまのふさふさは、おいしいレタスたい！",
  "おさかなも、レタスも、みかんも、だいすき！",
  "みんなで、苓北にあそびにきてね！",
];
let commentIndex = 0;
const comment = document.getElementById("rei-comment");
document.querySelector(".character-button").addEventListener("click", () => {
  commentIndex = (commentIndex + 1) % comments.length;
  setReadableText(comment, comments[commentIndex]);
});
const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});
nav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
const profiles = {
  skill: [
    "とくいなこと",
    "すいすい、およぐこと！\nおさかなをとる、りょうしさんのふねと、きょうそうするんだ！",
  ],
  like: [
    "すきなこと",
    "まちをあるいて、おもしろいところをみつけること。\nおいしいものをさがすのも、だいすき！",
  ],
  personality: [
    "せいかく",
    "みんなと、おはなしするのがだいすき！\n苓北のすてきなところを、いっぱいおしえたいな。",
  ],
  food: [
    "すきなたべもの",
    "苓北でとれた、おさかな！\nレタスも、みかんも、だいすき。\nおいしいものなら、なんでもすき。えへへ。",
  ],
  dream: [
    "ゆめ",
    "苓北のいいところを、たくさんのひとにおしえたいな。\nにじいろの貝がらも、みつけてみたい！",
  ],
  comment: [
    "ひとこと",
    "苓北町には、たのしいことがいっぱい！\nボクといっしょに、さがしてみよう！",
  ],
};
const dialog = document.getElementById("profile-dialog");
let opener;
document.querySelectorAll("[data-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const [title, copy] = profiles[button.dataset.target];
    opener = button;
    setReadableText(document.getElementById("dialog-title"), title);
    setReadableText(document.getElementById("dialog-copy"), copy);
    dialog.showModal();
    dialog.focus({ preventScroll: true });
    document.body.classList.add("dialog-open");
  });
});
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    dialog.close();
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  opener?.focus({ preventScroll: true });
});
const sections = [...nav.querySelectorAll("a")].map((link) =>
  document.querySelector(link.hash),
);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll("a").forEach((link) => {
          if (link.hash === `#${entry.target.id}`)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-15% 0px -55% 0px" },
  );
  sections.forEach((section) => {
    if (section) observer.observe(section);
  });
}

// Reveal once on entry, with short staggered delays for groups of cards.
if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08 },
  );
  const targets = document.querySelectorAll(
    ".hero-copy, .hero-character, .about-copy, .about-character, .section-heading, .birth-story, .charm, .profile-buttons button, .split > *, .story-cards article",
  );
  targets.forEach((element) => {
    const group = element.parentElement;
    if (group.matches(".charms, .profile-buttons, .story-cards")) {
      const index = [...group.children].indexOf(element);
      element.style.transitionDelay = `${(index % 3) * 70}ms`;
    }
    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}
