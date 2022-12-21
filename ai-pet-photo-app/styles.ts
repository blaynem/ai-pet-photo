const palette = {
  purple: "#5A31F4",
  lightBlue: "#B2DBFA",
  blue: "#374785",
  darkBlue: "#24305E",
  yellow: "#F8E9A1",
  redOrange: "#F76C6C",
  green: "#0ECD9D",
  red: "#CD0E61",
  black: "#161616",
  white: "#FBFBFB",
  discordGray: "#36393F",
  lightGray: "#EFEFEF",
  pastelBlue: "#A7C7E7",
};

export const theme: Theme = {
  colors: {
    background: palette.lightGray,
    foreground: palette.white,
    text: palette.black,
    primary: palette.pastelBlue,
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
      fontFamily: "System",
      fontSize: 36,
      fontWeight: "bold",
    },
    body: {
      fontFamily: "System",
      fontSize: 16,
    },
  },
};

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: palette.discordGray,
    foreground: palette.black,
    text: palette.white,
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
  text: string;
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
