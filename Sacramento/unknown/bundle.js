const fontUrl = new URL("./unknown.ttf", import.meta.url).href;
const glyphDataResponse = await fetch(new URL("./glyphData.json", import.meta.url).href);
const glyphData = await glyphDataResponse.json();

const glyphDataByIdResponse = await fetch(new URL("./glyphDataById.json", import.meta.url).href);
const glyphDataById = await glyphDataByIdResponse.json();

const bundle = {
  version: 0,
  family: 'Unknown',
  lineCap: 'butt',
  fontUrl,
  fontFaceCSS: `@font-face { font-family: 'Unknown'; src: url('${fontUrl}'); }`,
  unitsPerEm: 2048,
  ascender: 1905,
  descender: -1084,
  glyphData,
  glyphDataById,
  features: ["frac","liga"],
};

export default bundle;
