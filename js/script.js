const comments = [
  "こんにちは！苓北から来たばい！",
  "苓北町は、海も山もあって自然がいっぱい！",
  "頭のは海藻じゃないけん！ 苓北のレタスたい！",
  "新鮮な海の幸に、レタスやみかんも大好き！",
  "ぜひ苓北に遊びに来てみらんね！",
];
let commentIndex = 0;
const comment = document.getElementById("rei-comment");
document.querySelector(".character-button").addEventListener("click", () => {
  commentIndex = (commentIndex + 1) % comments.length;
  comment.textContent = comments[commentIndex];
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
  skill: ["特技", "泳ぐこと！漁師さんのお船と競争するんだ！⛴️"],
  like: [
    "好きなこと",
    "地元を回って面白い場所を探すこと、\nおいしいものを探すこと！",
  ],
  personality: [
    "性格",
    "地元の人たちの温かさや、\n苓北のおいしいものを伝えるのが大好き！",
  ],
  food: [
    "好きな食べ物",
    "苓北の新鮮なお魚が大好き！🐟\nあとはレタスにみかんに……\nおいしいものならなんでも好きなんだっ。えへへ。",
  ],
  dream: [
    "将来の夢",
    "全国に、じまんの苓北を広めること！\n虹色の貝殻を見つけること！🌈",
  ],
  comment: [
    "ひとこと",
    "苓北町には魅力がたくさんあるばい！\nボクといっしょに、見つけにいこう！",
  ],
};
const dialog = document.getElementById("profile-dialog");
let opener;
document.querySelectorAll("[data-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const [title, copy] = profiles[button.dataset.target];
    opener = button;
    document.getElementById("dialog-title").textContent = title;
    document.getElementById("dialog-copy").textContent = copy;
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
    ".hero-copy, .hero-character, .about-copy, .about-character, .section-heading, .charm, .profile-buttons button, .split > *, .story-cards article",
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
