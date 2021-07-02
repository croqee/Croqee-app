const IMG_RATIO = 800 / 800;
const TABLET_SCREEN_SIZE = 900;

export function calcCanvasAndModelDim(cb) {
  const screenSize =
    document.documentElement.clientWidth ||
    document.body.clientWidth ||
    window.innerWidth;
  let canvasWidth;
  let canvasHeight;
  if (screenSize <= TABLET_SCREEN_SIZE) {
    canvasWidth = screenSize;
    canvasHeight = window.innerHeight / 2;
  } else {
    canvasWidth = Math.floor(screenSize / 2);
    canvasHeight = window.innerHeight;
    cb();
  }
  let innerModelWidth;
  let innerModelHeight;
  if (canvasWidth / canvasHeight <= IMG_RATIO) {
    innerModelWidth = canvasWidth;
    innerModelHeight = innerModelWidth / IMG_RATIO;
  } else {
    innerModelHeight = canvasHeight;
    innerModelWidth = innerModelWidth * IMG_RATIO;
  }
  return { canvasWidth, canvasHeight, innerModelWidth, innerModelHeight };
}