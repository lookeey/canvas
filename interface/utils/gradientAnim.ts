const GRADIENT_STOPS = [
  [
    [0, 255, 0], [255, 0, 255]
    ],
  [
    [0, 124, 255], [255, 0, 0]
  ],
  [
    [0, 255, 255], [255, 0, 255]
  ],
  [
    [0, 255, 0], [255, 255, 0]
  ],
  ]

const DURATION = 3000;

const getGradientForFrame = (frame: number) => {
  frame = frame % DURATION;
  let idx = Math.floor(frame / (DURATION / GRADIENT_STOPS.length));
  let start = GRADIENT_STOPS[idx];
  let end = GRADIENT_STOPS[(idx + 1) % GRADIENT_STOPS.length];
  let ratio = (frame % (DURATION / GRADIENT_STOPS.length)) / (DURATION / GRADIENT_STOPS.length);
  let gradient = start.map((color, i) => {
    let startColor = color;
    let endColor = end[i];
    let diff = endColor.map((c, i) => c - startColor[i]);
    return startColor.map((c, i) => Math.floor(c + diff[i] * ratio));
  })
  return gradient;
}

export default getGradientForFrame;