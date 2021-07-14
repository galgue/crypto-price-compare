import 'reflect-metadata';

import express from 'express';
import cors from 'cors';

import { cryptoChangesRoute } from './routes';

const port = 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use(cryptoChangesRoute());

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
