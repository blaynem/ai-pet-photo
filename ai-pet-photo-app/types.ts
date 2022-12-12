export type RootStackParamList = {
  Root: undefined;
  Generate: undefined;
  Settings: undefined;
  Profile: undefined;
  Projects: undefined;
  Photos: undefined;
  NotFound: undefined;
  Landing: undefined;
  Home: undefined;
};

export type Model = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  name: string;
  images: string[];
};
