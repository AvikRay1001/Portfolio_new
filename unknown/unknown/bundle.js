const fontUrl = new URL("./unknown.ttf", import.meta.url).href;
const glyphDataResponse = await fetch(new URL("./glyphData.json", import.meta.url).href);
const glyphData = await glyphDataResponse.json();

const bundle = {
  version: 0,
  family: 'Unknown',
  lineCap: 'round',
  fontUrl,
  fontFaceCSS: `@font-face { font-family: 'Unknown'; src: url('${fontUrl}'); }`,
  unitsPerEm: 1024,
  ascender: 957,
  descender: -501,
  glyphData,
};

export default bundle;
