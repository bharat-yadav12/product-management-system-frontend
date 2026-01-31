export const isAuthenticated = () => {
  return !!localStorage.getItem("lp");
};
