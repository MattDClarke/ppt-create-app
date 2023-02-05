/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * atparam tag gives the name, type and description of a function parameter
 *
 * @param text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text, font) {
  // if given, use cached canvas for better performance
  // else, create new canvas
  const canvas =
    // function property - functions are objects
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement('canvas'));
  // the created element's context is the thing onto which the drawing (text in this case) will be rendered
  const context = canvas.getContext('2d');
  context.font = font;
  // measureText() returns an object that contains info about the measured text
  const metrics = context.measureText(text);
  return metrics.width;
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// binary search to find font size required to fit a provided width

/**
 * Find the largest font size (in pixels) that allows the string to fit in the given width.
 *
 * @param {String} text - The text to be rendered.
 * @param {String} font - The css font descriptor that text is to be rendered with (e.g. "bold ?px verdana") -- note the use of ? in place of the font size.
 * @param {Number} width - The width in pixels the string must fit in
 * @param {Number} minFontPx - The smallest acceptable font size in pixels
 * @param {Number} maxFontPx - The largest acceptable font size in pixels
 * */
export function getTextSizeForWidth(text, font, width, minFontPx, maxFontPx) {
  // loops until there is a return
  for (;;) {
    let s = font.replace('?', maxFontPx);
    // get width of text using maxFontPx set
    let w = getTextWidth(text, s);
    // use maxFontPx if calculated text width, using max font size, does not exceed the max width

    if (w <= width) {
      return maxFontPx;
    }
    // middle size font allowed
    // e.g. (10 + 20) / 2  = 15
    // get middle value for binary search
    const g = (minFontPx + maxFontPx) / 2;
    // if there is not much difference between the min and max font size set, return the rounded value of the middle size font allowed
    // during the binary search, the minFont size and maxFont size converge towards the font size that fits the width. When the min and
    // max font sizes have the same rounded value, the middle size between them will be returned (the font size that fits the width)
    if (
      Math.round(g) === Math.round(minFontPx) ||
      Math.round(g) === Math.round(maxFontPx)
    ) {
      return g;
    }

    // FONT SIZE SHOULD BE SOMEWHERE BETWEEN MIN AND MAX AT THIS POINT

    // g is the middle size font allowed here (e.g. 15)
    s = font.replace('?', g);
    // get text width of middle size font allowed
    w = getTextWidth(text, s);
    // if it is >= width
    if (w >= width) {
      // set max font size to the middle size (between min and max)
      // if text width of the middle text size is too large, decrease the max font size to the middle font size
      // changing function parameter
      /* eslint-disable no-param-reassign */
      maxFontPx = g;
    } else {
      // if the width of the middle size font is less than the width, set a new minimum font size
      // if the text width is too narrow, increase the minimum font size
      // changing function parameter
      /* eslint-disable no-param-reassign */
      minFontPx = g;
    }
  }
}

// convert max width in inches for PptxGenJS slide (text container) into width in px for getTextSizeForWidth()
export function inchesToPixels(inches) {
  // ppt: 1 inch = 120px (120 DPI - dots per inch -> pixel density)- https://support.microsoft.com/en-us/office/change-the-size-of-your-slides-040a811c-be43-40b9-8d04-0de5ed79987e
  // TODO: window.devicePixelRatio works on Chrome (DPI = 2), on Firefox DPI = 1.25... and depends on Zoom. How to determine px width in ppt? This method is only approximate. Check ppt layout result of text on devices with different DPI
  // const widthPixels = inches * 120 * (1 / window.devicePixelRatio);
  const pixels = inches * 120;
  return pixels;
}
