// create a new context to manage the state of project

import React, { createContext } from "react";
import { Project } from "../../types";

export interface ProjectState {
  readonly project: Project | null;
}

export const DefaultProjectState: ProjectState = {
  project: null,
};

export const ProjectContext = createContext<{
  state: ProjectState;
  dispatch: React.Dispatch<any>;
}>({ state: DefaultProjectState, dispatch: () => null });

export const useProjectContext = () => React.useContext(ProjectContext);
