import express from 'express';
import dotenv from 'dotenv';
import projectRouter from './routers/projectRouter.js';

dotenv.config({ path: '../.env' }); // Preload process.env with the defined environment variables. 
 
// Define an instance of the express server.
const app = express();

// CORS configuration.
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();

  app.options('*', (_, res) => {
    // Allowed XHR methods.
    res.header('Access-Control-Allow-Methods', 'GET');
    res.send();
  });
});

// Express Middleware configuration.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Header config.
app.disable('x-powered-by');

// HTTP API Endpoint Routes.
app.use('/api/projects', projectRouter);

// Pull the HTTP Port from the environment variables.
const PORT = process.env.PORT;

// Start the server on the specified port.
app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}.`);
});
