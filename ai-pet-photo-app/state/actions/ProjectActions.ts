import { Project } from "../../types";
import { setProjectAction } from "./Projects/setProjectAction";

export type ProjectsAction = ReturnType<typeof setProjectAction>;
