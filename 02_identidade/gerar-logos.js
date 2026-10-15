const fs = require('fs');
const opentype = require('opentype.js');
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const font = opentype.parse((b=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength))(fs.readFileSync('fraunces-soft-600.ttf')));
const sans = opentype.parse((b=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength))(fs.readFileSync('node_modules/@fontsource/nunito-sans/files/nunito-sans-latin-600-normal.woff')));
const C = { tinta: '#1F2440', linho: '#F7F8FA', damasco: '#E8A27C' };
function textPath(f, txt, x, y, size, tracking = 0) {
  // manual tracking
  let d = ''; let cx = x;
  const glyphs = [...txt].map(ch => f.charToGlyph(ch));
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, y, size).toPathData(2);
    cx += g.advanceWidth * size / f.unitsPerEm + tracking;
    if (i < glyphs.length - 1) cx += f.getKerningValue(g, glyphs[i + 1]) * size / f.unitsPerEm;
  });
  return { d, width: cx - x - tracking };
}
const lapels = (fl, fr) => `<polygon points="24,36 37,36 50,64 44,76" fill="${fl}"/><polygon points="44,76 50,64 67,24 80,24" fill="${fr}"/>`;
const icon = (bg, fl, fr) => `<rect width="100" height="100" rx="24" fill="${bg}"/>${lapels(fl, fr)}`;
const svg = (w, h, body, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;
// Icons
fs.writeFileSync(`${out}/jalecon-icone.svg`, svg(100, 100, icon(C.tinta, C.linho, C.damasco), 'Jalecon'));
fs.writeFileSync(`${out}/jalecon-icone-claro.svg`, svg(100, 100, icon(C.linho, C.tinta, C.damasco), 'Jalecon'));
fs.writeFileSync(`${out}/jalecon-simbolo.svg`, svg(100, 100, lapels(C.tinta, C.damasco), 'Jalecon'));
fs.writeFileSync(`${out}/jalecon-simbolo-mono.svg`, svg(100, 100, lapels(C.tinta, C.tinta), 'Jalecon'));
// Horizontal lockup: icon 88 + gap 18 + wordmark size 76 baseline 74
const wm = textPath(font, 'jalecon', 0, 0, 76, -1.5);
const H = (bg, fl, fr, txt) => {
  const W = Math.ceil(106 + wm.width + 4);
  const t = textPath(font, 'jalecon', 106, 74, 76, -1.5);
  return svg(W, 104, `<g transform="translate(0,8) scale(.88)">${icon(bg, fl, fr)}</g><path d="${t.d}" fill="${txt}"/>`, 'Jalecon');
};
fs.writeFileSync(`${out}/jalecon-logo-horizontal.svg`, H(C.tinta, C.linho, C.damasco, C.tinta));
fs.writeFileSync(`${out}/jalecon-logo-horizontal-negativo.svg`, H(C.linho, C.tinta, C.damasco, C.linho));
// Stacked
const st = (bg, fl, fr, txt, sub) => {
  const w2 = textPath(font, 'jalecon', 0, 0, 52, -1).width;
  const t = textPath(font, 'jalecon', (240 - w2) / 2, 160, 52, -1);
  const tag = 'MARKETING MÉDICO COM ÉTICA';
  const tw = textPath(sans, tag, 0, 0, 11, 1.6).width;
  const tg = textPath(sans, tag, (240 - tw) / 2, 188, 11, 1.6);
  return svg(240, 200, `<g transform="translate(76,10) scale(.88)">${icon(bg, fl, fr)}</g><path d="${t.d}" fill="${txt}"/><path d="${tg.d}" fill="${sub}"/>`, 'Jalecon: marketing médico com ética');
};
fs.writeFileSync(`${out}/jalecon-logo-vertical.svg`, st(C.tinta, C.linho, C.damasco, C.tinta, '#4A4F6E'));
fs.writeFileSync(`${out}/jalecon-logo-vertical-negativo.svg`, st(C.linho, C.tinta, C.damasco, C.linho, '#C5C8D8'));
// wordmark only
const W2 = Math.ceil(wm.width + 16);
fs.writeFileSync(`${out}/jalecon-wordmark.svg`, svg(W2, 100, `<path d="${textPath(font, 'jalecon', 8, 72, 76, -1.5).d}" fill="${C.tinta}"/>`, 'Jalecon'));
console.log('ok', wm.width);
