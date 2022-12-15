import { Theme } from "../../../styles";

export const SET_THEME = "SET_THEME";
export const setThemeAction = (theme: Theme) =>
  ({
    type: SET_THEME,
    theme,
  } as const);
