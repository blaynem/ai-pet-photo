import { Theme } from "../../../styles";

export const TOGGLE_DARK_MODE = "TOGGLE_DARK_MODE";
export const toggleDarkModeAction = (darkMode: boolean) =>
  ({
    type: TOGGLE_DARK_MODE,
    darkMode,
  } as const);
