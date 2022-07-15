import express from 'express';
import dotenv from 'dotenv';

// Enable dotenv in order to read environment variables from .env* files. 
dotenv.config();

// Define an instance of the express server.
const app = express();

// Express Middleware configuration.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
