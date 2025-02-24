import express from 'express';
import employeesController from '../controllers/employees.js';
import {asyncWrapper} from '../utils/helper.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  const [err, data] = await asyncWrapper(employeesController.create(req.body));

  if (!err) return res.json(data);

  next({message: err.message, status: err.status || 422});
});

router.get('/', async (req, res, next) => {
  const [err, data] = await asyncWrapper(employeesController.getAll());
  if (!err) return res.json(data);
  next({message: err.message, status: err.status || 422});
});

router.delete('/:id', async (req, res, next) => {
  const {id} = req.params;
  const [err, employee] = await asyncWrapper(employeesController.deleteEmp(id));
  if (err) {
    return next({message: err.message, status: err.status || 422});
  }
  return res.status(200).json({
    status: 'success',
    code: 200,
    message: `Employee deleted successfully.`,
    data: employee
  });
});

router.patch('/:id', async (req, res, next) => {
  const {id} = req.params;
  const updateData = req.body;
  const [err, employee] = await asyncWrapper(employeesController.updateEmp(id, updateData));
  if (err) {
    return next({message: err.message, status: err.status || 422});
  }
  return res.status(200).json({
    status: 'success',
    code: 200,
    message: `the Employee After Edit`,
    data: employee
  });
});

export default router;
