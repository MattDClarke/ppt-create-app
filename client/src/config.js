export const backendEndpoint = `${
  process.env.NODE_ENV === 'production'
    ? process.env.BACKEND_URL
    : 'http://localhost:7777'
}`;
