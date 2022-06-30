import { lch } from "d3";

function getLCH(n = 20, l = 90, c = 50) {
  return Array(n)
    .fill("")
    .map((x, i) => lch(l, c, i + Math.random() * 360).formatHex());
}

export const COLOR_SCHEMA_TEST = getLCH();

export const COLOR_SCHEMA_ZVV = [
  "rgb(240, 141, 109)",
  "rgb(252, 219, 139)",
  "rgb(166, 204, 236)",
  "rgb(140, 197, 138)",
  "rgb(211, 236, 247)",
  "rgb(250, 250, 249)",
  "rgb(228, 200, 179)",
];

export const COLOR_SCHEMA_JUICE = ["#E39F97", "#E2AC41", "#40909D", "#D1D1D1"];

export const COLOR_SCHEMA_MAP = {
  none: undefined,
  zvv: COLOR_SCHEMA_ZVV,
  juice: COLOR_SCHEMA_JUICE,
  test: COLOR_SCHEMA_TEST,
} as const;

export type SupportedColorSchema = keyof typeof COLOR_SCHEMA_MAP;

// export const SUPPORTED_COLOR_LIST = ['none', 'zvv', 'juice', 'test'];
export const SUPPORTED_COLOR_LIST = Object.keys(COLOR_SCHEMA_MAP)
