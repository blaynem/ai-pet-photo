import { SET_PROJECT } from "./../actions/Projects/setProjectAction";
import { ProjectState } from "../context/ProjectContext";
import { ProjectsAction } from "../actions/ProjectActions";

export const ProjectReducer = (state: ProjectState, action: ProjectsAction) => {
  switch (action.type) {
    case SET_PROJECT: {
      const { project } = action;
      return {
        ...state,
        project: project,
      };
    }

    default:
      return state;
  }
};