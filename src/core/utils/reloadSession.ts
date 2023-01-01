export const reloadSession = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};

export const reloadSessionLater = (timeout: number) =>
  setTimeout(() => {
    reloadSession();
  }, timeout);
