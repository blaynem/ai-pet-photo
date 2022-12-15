// create a new context to manage the state of Theme

import React, { createContext } from "react";
import { useReducer } from "react";
import { ThemeReducer } from "../reducers/ThemeReducer";
import { theme } from "../../styles";

interface ThemeContextProviderProps {
  children: React.ReactNode;
}

export interface ThemeState {
  readonly theme: typeof theme;
}

export const DefaultThemeState: ThemeState = {
  theme: theme,
};

export const ThemeContext = createContext<{
  state: ThemeState;
  dispatch: React.Dispatch<any>;
}>({ state: DefaultThemeState, dispatch: () => null });

export const useThemeContext = () => React.useContext(ThemeContext);

export const ThemeContextProvider = ({
  children,
}: ThemeContextProviderProps) => {
  const [state, dispatch] = useReducer(ThemeReducer, DefaultThemeState);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};
