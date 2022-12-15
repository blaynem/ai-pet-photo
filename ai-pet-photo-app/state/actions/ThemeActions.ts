import { setThemeAction } from "./Theme/setThemeAction";
import { toggleDarkModeAction } from "./Theme/toggleDarkModeAction";

export type ThemeAction =
  | ReturnType<typeof setThemeAction>
  | ReturnType<typeof toggleDarkModeAction>;
