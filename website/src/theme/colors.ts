export const palette = {
  monochrome: {
    50: "#FFFFFF",
    100: "#F9F9F9",
    200: "#F2F2F2",
    300: "#EBEBEB",
    400: "#DDDDDD",
    500: "#BBBBBB",
    600: "#999999",
    700: "#666666",
    800: "#333333",
    900: "#000000",
  },
  blue: {
    50: "#E3F1FC",
    100: "#C2D8EA",
    200: "#A1C0D8",
    300: "#80A8C6",
    400: "#5F8FB4",
    500: "#3F7397",
    600: "#205779",
    700: "#003B5C",
    800: "#00304D",
    900: "#00263E",
  },
  yellow: {
    50: "#FFF6DD",
    100: "#FFEFAA",
    200: "#FFE677",
    300: "#FFE055",
    400: "#FFD82A",
    500: "#FFCC00",
    600: "#FFB400",
    700: "#FF9900",
    800: "#D46D00",
    900: "#AA4000",
  },
  red: {
    50: "#FFEBEB",
    100: "#FFC2C2",
    200: "#FF9999",
    300: "#FF7777",
    400: "#FF5555",
    500: "#EE4040",
    600: "#DF2D2D",
    700: "#BF2626",
    800: "#9F2020",
    900: "#801A1A",
  },
  green: {
    50: "#EAFAEA",
    100: "#BBEBC8",
    200: "#8CDCA6",
    300: "#5ECE84",
    400: "#2FBF62",
    500: "#00B040",
    600: "#009A38",
    700: "#008030",
    800: "#007028",
    900: "#006020",
  },
};

export interface ColorSchemePalette {
  label: string;
  value: string;
  colors: ReadonlyArray<string>;
}

export const colorSchemePalettes: Array<ColorSchemePalette> = [
  {
    label: "Yellow",
    value: "yellow",
    colors: Object.entries(palette.yellow)
      .sort(([a], [b]) => +a - +b)
      .filter((_, i) => i % 2)
      .map(([, v]) => v)
      .reverse(),
  },
  {
    label: "Red",
    value: "red",
    colors: Object.entries(palette.red)
      .sort(([a], [b]) => +a - +b)
      .filter((_, i) => i % 2)
      .map(([, v]) => v)
      .reverse(),
  },
  {
    label: "Blue",
    value: "blue",
    colors: Object.entries(palette.blue)
      .sort(([a], [b]) => +a - +b)
      .filter((_, i) => i % 2)
      .map(([, v]) => v)
      .reverse(),
  },
  {
    label: "Green",
    value: "green",
    colors: Object.entries(palette.green)
      .sort(([a], [b]) => +a - +b)
      .filter((_, i) => i % 2)
      .map(([, v]) => v)
      .reverse(),
  },
];

export function colorSchemePalette(colorScheme: string) {
  for (const p of colorSchemePalettes) {
    if (p.value === colorScheme) {
      return p;
    }
  }
}

export function colorSchemePaletteColors(colorScheme: string) {
  for (const p of colorSchemePalettes) {
    if (p.value === colorScheme) {
      return p.colors;
    }
  }

  return [];
}
