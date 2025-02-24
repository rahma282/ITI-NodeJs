import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import router from './routers/index.js';
import process from 'process'

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/EmployeesSystem')
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(router);

app.use((err, req, res,next) => {
  res.status(err.status || 500).json({message: err.message});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
