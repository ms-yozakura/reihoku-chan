import { setReadableText } from './readable-text.js';
import { profiles } from '../data/profiles.js';
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
