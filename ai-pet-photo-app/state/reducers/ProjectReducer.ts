import { ProjectsAction } from "../actions/ProjectActions";
import { ProjectState } from "../context/ProjectContext";

export const ProjectReducer = (state: ProjectState, action: ProjectsAction) => {
  switch (action.type) {
    case "SET_PROJECT":
      return {
        ...state,
        project: action.payload,
      };
    default:
      return state;
  }
};
