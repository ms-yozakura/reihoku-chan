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

