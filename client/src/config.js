const environment = 'production'
export const backendEndpoint = `${
  environment === 'production'
    ? 'https://ppt-create-server.onrender.com'
    : 'http://localhost:7777'
}`;
