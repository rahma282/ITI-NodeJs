import express from 'express';
import {addEmployee, getEmployees} from '../helper/crud.js';
import {validation} from '../helper/vaildation.js';

export const Router = express.Router();

Router.get('/employees', (req, res) => {
  const employees = getEmployees();
  res.render('table', {employees});
});

Router.get('/employees/:id', (req, res) => {
  const employees = getEmployees();
  const parmId = Number(req.params.id);
  // debugger;
  if (Number.isNaN(parmId)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Invalid employee ID. It must be a number.'
    });
  }
  const employee = employees.find((emp) => emp.ID === parmId);
  if (!employee) {
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Employee not found. Invaild ID.'
    });
  }
  res.status(200).json({
    status: 'success',
    code: 200,
    data: employee
  });
});

Router.post('/employees', validation, (req, res) => {
  try {
    const employees = getEmployees();
    const id = employees.length > 0 ? employees[employees.length - 1].ID + 1 : 1;
    const newEmployee = {ID: id, ...req.body};

    employees.push(newEmployee);
    addEmployee(employees);

    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Employee added successfully',
      employee: newEmployee
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'Internal server error',
      error: error.message
    });
  }
});

Router.delete('/employees/:id', (req, res) => {
  let employees = getEmployees();
  const paramId = Number(req.params.id);

  if (Number.isNaN(paramId)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Invalid employee ID. It must be a number.'
    });
  }

  const employee = employees.find((emp) => emp.ID === paramId);
  if (!employee) {
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Employee not found. Invalid ID.'
    });
  }

  employees = employees.filter((emp) => emp.ID !== paramId);

  addEmployee(employees);

  res.status(200).json({
    status: 'success',
    code: 200,
    message: `Employee with ID ${paramId} deleted successfully.`,
    data: employee
  });
});

Router.patch('/employees/:id', (req, res) => {
  const {body} = req;
  const employees = getEmployees();
  const parmId = Number(req.params.id);
  if (Number.isNaN(parmId)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Invalid employee ID. It must be a number.'
    });
  }
  const employee = employees.find((emp) => emp.ID === parmId);
  if (!employee) {
    return res.status(404).json({
      status: 'error',
      code: 404,
      message: 'Employee not found. Invaild ID.'
    });
  }
  Object.assign(employee, body); // directly modifies the found employee.
  addEmployee(employees);
  res.status(200).json({
    status: 'success',
    code: 200,
    data: employee
  });
});
