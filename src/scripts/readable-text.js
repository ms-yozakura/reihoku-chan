import { readableParts } from '../data/readings.js';

export function setReadableText(element, text) {
  element.replaceChildren();
  readableParts(text).forEach(({ text: part, reading }) => {
    if (!reading) {
      element.append(document.createTextNode(part));
      return;
    }
    const ruby = document.createElement("ruby");
    ruby.append(document.createTextNode(part));
    const rt = document.createElement("rt");
    rt.textContent = reading;
    ruby.append(rt);
    element.append(ruby);
  });
}
