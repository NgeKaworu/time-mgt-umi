export const mainHost = () => {
  switch (process.env.NODE_ENV) {
    case "prod":
      return "https://api.furan.xya/time-mgt";
    default:
      return "http://localhost:8000";
  }
};
