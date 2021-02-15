const IMG_RATIO = 800 / 800;

export function calcCanvasAndModelDim(cb) {
    const screenSize =
      document.documentElement.clientWidth ||
      document.body.clientWidth ||
      window.innerWidth;
    let width;
    let height;
    if (screenSize <= 900) {
      width = screenSize;
      height = window.innerHeight / 2;
    } else {
      width = Math.floor(screenSize / 2);
      height = window.innerHeight;
      cb();
    }
    let imgWidth;
    let imgHeight;
    if (width / height <= IMG_RATIO) {
      imgWidth = width;
      imgHeight = imgWidth / IMG_RATIO;
    } else {
      imgHeight = height;
      imgWidth = imgHeight * IMG_RATIO;
    }
    return {width, height, imgWidth,imgHeight};
  }