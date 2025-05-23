export default (secs: number) => {
  return new Promise((resolve) => setTimeout(resolve, secs * 1000));
};
