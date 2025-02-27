import process from 'node:process';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import router from './routers/index.js';

const app = express();
app.use(express.json());
dotenv.config();
mongoose.connect(process.env.DBURL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(router);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({message: err.message});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
