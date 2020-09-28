export const mainHost = () => {
  switch (process.env.NODE_ENV) {
    case 'prod':
      return 'http://192.168.101.68:8888';
    default:
      return 'http://localhost:8000';
  }
};
