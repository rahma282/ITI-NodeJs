import express from 'express';
import employeesRouter from './employees.js';
import leavesRouter from "./leaves.js";

const router = express.Router();

router.use('/employees', employeesRouter);
router.use('/leave', leavesRouter);

export default router;
