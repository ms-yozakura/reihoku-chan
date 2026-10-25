// Build ruby with DOM nodes: dynamic speech and dialogs use the same readings.
const readings = {
  苓北町: "れいほくまち",
  苓北: "れいほく",
  海: "うみ",
  貝: "かい",
  山: "やま",
  緋扇貝: "ひおうぎがい",
};
export function setReadableText(element, text) {
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
