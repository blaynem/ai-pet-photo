import { Project } from "../../../types";

export const SET_PROJECT = "SET_PROJECT";
export const setProjectAction = (project: Project) => ({
  type: SET_PROJECT,
  project: project,
});
