export type RootStackParamList = {
  Root: undefined;
  Generate: undefined;
  Settings: undefined;
  Profile: undefined;
  Projects: undefined;
  NewProject: undefined;
  Photos: undefined;
  NotFound: undefined;
  Landing: undefined;
  Home: undefined;
};

export type Project = {
  id: string;
  name: string;
  images: string[];
  type: string;
};

export type Shot = {
  id: string;
  name: string;
  image: string;
  projectId: string;
  projectName: string;
};