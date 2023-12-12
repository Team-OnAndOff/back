import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';

const { PORT } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', (req: Request, res: Response) => {
  res.json({ test: 'test' });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
