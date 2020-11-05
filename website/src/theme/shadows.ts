import BezierEasing from "bezier-easing";

const fixed = (num: number, precision = 1) =>
  parseFloat(num.toFixed(precision)).toString();

const rgba = (r: number, g: number, b: number, a: number) =>
  `rgba(${r}, ${g}, ${b}, ${fixed(a, 3)})`;
const shadow = (
  left: number,
  top: number,
  blur: number,
  spread: number,
  color: string
) =>
  `${fixed(left)}px ${fixed(top)}px ${fixed(blur)}px ${fixed(
    spread
  )}px ${color}`;

const makeShadow = (config: typeof baseConfig) => {
  const alphaEasing = BezierEasing(...config.alphaEasingValue);
  const offsetEasing = BezierEasing(...config.offsetEasingValue);
  const blurEasing = BezierEasing(...config.blurEasingValue);

  const easedAlphaValues = [];
  const easedOffsetValues = [];
  const easedBlurValues = [];

  for (let i = 1; i <= config.shadowLayers; i++) {
    const fraction = i / config.shadowLayers;

    if (config.invertAlpha) {
      easedAlphaValues.unshift(alphaEasing(fraction));
    } else {
      easedAlphaValues.push(alphaEasing(fraction));
    }

    easedOffsetValues.push(offsetEasing(fraction));
    easedBlurValues.push(blurEasing(fraction));
  }

  const boxShadowValues = [];

  for (let i = 0; i < config.shadowLayers; i++) {
    boxShadowValues.push([
      0,
      easedOffsetValues[i] * config.offset,
      easedBlurValues[i] * config.blur,
      config.spread,
      easedAlphaValues[i] * config.alpha,
    ]);
  }

  const boxShadow = boxShadowValues
    .map(([leftOffset, topOffset, blur, spread, alpha]) =>
      shadow(leftOffset, topOffset, blur, spread, rgba(0, 0, 0, alpha))
    )
    .join(",");

  // console.log(config, { boxShadow })

  return boxShadow;
};

const baseConfig = {
  shadowLayers: 6,
  alpha: 0.07,
  offset: 100,
  blur: 80,
  spread: 0,
  invertAlpha: false,

  alphaEasingValue: [0.1, 0.5, 0.9, 0.5] as [number, number, number, number],
  offsetEasingValue: [0.7, 0.1, 0.9, 0.3] as [number, number, number, number],
  blurEasingValue: [0.7, 0.1, 0.9, 0.3] as [number, number, number, number],
};

export const spec = Array.from({ length: 24 }).map((_, i) => {
  const ambientShadow = makeShadow({
    ...baseConfig,
    shadowLayers: 2,
    offset: 0,
    blur: 4 + BezierEasing(0.2, 0.2, 0.8, 0.8)((i + 1) / 24) * (40 - 4),
    alpha: 0.1 + BezierEasing(0.5, 0.2, 0.8, 0.5)((i + 1) / 24) * (0.2 - 0.1),
  });

  const keyShadow = makeShadow({
    ...baseConfig,
    shadowLayers: 4,
    offset: 4 + BezierEasing(0.2, 0.2, 0.8, 0.8)((i + 1) / 24) * (40 - 4),
    blur: 5 + BezierEasing(0.2, 0.2, 0.8, 0.8)((i + 1) / 24) * (60 - 5),
    alpha:
      0.02 + BezierEasing(0.5, 0.2, 0.8, 0.5)((i + 1) / 24) * (0.21 - 0.02),
    spread: 0 + BezierEasing(0.2, 0.2, 0.8, 0.8)((i + 1) / 24) * (-8 - 0),
  });

  return { ambientShadow, keyShadow };
});

export default spec.map(
  ({ ambientShadow, keyShadow }) => keyShadow + "," + ambientShadow
);
