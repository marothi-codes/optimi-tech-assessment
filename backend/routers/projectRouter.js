import express from 'express';
import data from '../data.js';

const projectRouter = express.Router();

projectRouter.get('/', (_, res) => {
  res.send(data);
});

export default projectRouter;
