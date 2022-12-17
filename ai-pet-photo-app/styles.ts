const palette = {
  purple: "#5A31F4",
  lightBlue: "#B2DBFA",
  blue: "#374785",
  darkBlue: "#24305E",
  yellow: "#F8E9A1",
  redOrange: "#F76C6C",
  green: "#0ECD9D",
  red: "#CD0E61",
  black: "#0B0B0B",
  white: "#F0F2F3",
};

export const theme: Theme = {
  colors: {
    background: palette.lightBlue,
    foreground: palette.darkBlue,
    primary: palette.yellow,
    success: palette.green,
    danger: palette.redOrange,
    failure: palette.red,
    secondary: palette.blue,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontFamily: "Raleway",
      fontSize: 36,
      fontWeight: "bold",
    },
    body: {
      fontFamily: "Merriweather",
      fontSize: 16,
    },
  },
};

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: palette.darkBlue,
    foreground: palette.white,
  },
};

export interface Theme {
  colors: Colors;
  spacing: Spacing;
  textVariants: TextVariants;
}

export interface Colors {
  background: string;
  foreground: string;
  primary: string;
  success: string;
  danger: string;
  failure: string;
  secondary: string;
}

export interface Spacing {
  s: number;
  m: number;
  l: number;
  xl: number;
}

export interface TextVariants {
  header: Header;
  body: Body;
}

export interface Body {
  fontFamily: string;
  fontSize: number;
}

export interface Header {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
}
