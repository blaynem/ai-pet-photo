import { useReducer } from "react";
import { ProjectReducer } from "../reducers/ProjectReducer";
import { DefaultProjectState } from "./ProjectContext";
import { ProjectContext } from "./ProjectContext";

interface ProjectContextProviderProps {
  children: React.ReactNode;
}

export const ProjectContextProvider = ({
  children,
}: ProjectContextProviderProps) => {
  const [state, dispatch] = useReducer(ProjectReducer, DefaultProjectState);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};
