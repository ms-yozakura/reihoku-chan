// Longest words match first so compound place names keep their own readings.
/** @type {Record<string, string>} */
export const readings = {
  熊本県: 'くまもとけん', 熊本: 'くまもと', 天草: 'あまくさ',
  苓北町: 'れいほくまち', 苓北: 'れいほく', 緋扇貝: 'ひおうぎがい',
  知る: 'しる', 知って: 'しって', 夕方: 'ゆうがた', 歩いて: 'あるいて', 高い: 'たかい',
  海: 'うみ', 空: 'そら', 町: 'まち', 城: 'しろ', 人: 'ひと',
  色: 'いろ', 貝: 'かい', 山: 'やま',
};
const pattern = new RegExp(`(${Object.keys(readings).sort((a, b) => b.length - a.length).join('|')})`, 'g');
/** @param {string} text */
export function readableParts(text) {
  return text.split(pattern).filter(Boolean).map((text) => ({ text, reading: readings[text] }));
}
/** @param {string} text */
export function readableLineUnits(text) {
  return Math.max(...text.split('\n').map((line) => readableParts(line).reduce(
    (total, part) => total + Math.max([...part.text].length, part.reading ? [...part.reading].length * 0.5 : 0), 0,
  ))) * 1.12;
}
