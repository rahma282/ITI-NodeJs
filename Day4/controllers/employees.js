import process from 'node:process';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import mongoose from 'mongoose';
import Employees from '../models/employees.js';
import CustomError from '../utils/customError.js';

const create = async (data) => {
  const employees = await Employees.create(data);
  return employees;
};
const getAll = async () => {
  const employees = await Employees.find({}, {_id: 1, firstName: 1, dob: 1})
    .lean()
    .exec();
  return employees.map((emp) => ({
    _id: emp._id,
    firstName: emp.firstName,
    age: emp.dob ? moment().diff(moment(emp.dob), 'years') : null
  }));
};

const deleteEmp = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid Employee ID');
    error.status = 400;
    throw error;
  }
  const employee = await Employees.findByIdAndDelete(id);
  if (!employee) {
    const error = new Error('Employee not found');
    error.status = 404;
    throw error;
  }
  return employee;
};

const updateEmp = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid Employee ID');
    error.status = 400;
    throw error;
  }
  const employee = await Employees.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});
  if (!employee) {
    const error = new Error('Employee not found');
    error.status = 404;
    throw error;
  }
  return employee;
};

const login = async (data) => {
  const employee = await Employees.findOne({username: data.username}).exec();
  if (!employee) {
    throw new CustomError('User name or password is not correct', 401);
  }
  const isValidPassword = employee.comparePasswords(data.password);
  if (!isValidPassword) {
    throw new CustomError('User name or password is not correct', 401);
  }
  const token = jwt.sign({id: employee._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
  return token;
};
export default {create, getAll, deleteEmp, updateEmp, login};
