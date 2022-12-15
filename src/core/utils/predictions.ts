export const getRefinedInstanceClass = (instanceClass: string) => {
  return instanceClass === "man" || instanceClass === "woman"
    ? "person"
    : instanceClass;
};

// Setting max count to 45.
export const getTrainCoefficient = (count: number) => {
  if (count > 45) {
    return 45;
  }

  if (count < 10) {
    return 10;
  }

  return count;
};
