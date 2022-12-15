import { TOGGLE_DARK_MODE } from "./../actions/Theme/toggleDarkModeAction";
import { ThemeState } from "../context/ThemeContext";
import { ThemeAction } from "../actions/ThemeActions";
import { SET_THEME } from "../actions/Theme/setThemeAction";
import { darkTheme, theme } from "../../styles";

export const ThemeReducer = (state: ThemeState, action: ThemeAction) => {
  switch (action.type) {
    case SET_THEME: {
      const { theme } = action;
      return {
        ...state,
        theme: theme,
      };
    }
    case TOGGLE_DARK_MODE: {
      const { darkMode } = action;
      if (darkMode) {
        return {
          ...state,
          darkMode: darkMode,
          theme: darkTheme,
        };
      } else {
        return {
          ...state,
          darkMode: darkMode,
          theme: theme,
        };
      }
      return {
        ...state,
        darkMode: darkMode,
      };
    }

    default:
      return state;
  }
};
