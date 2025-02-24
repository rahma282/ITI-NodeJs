import mongoose from 'mongoose';
import Leaves from '../models/leaves.js';

const submit = async (leave) => {
  const leaves = await Leaves.create(leave);
  return leaves;
};

const editLeave = async (id, updateLeave) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid leave ID');
    error.status = 400;
    throw error;
  }
  const leaves = await Leaves.findByIdAndUpdate(id, updateLeave, {new: true, runValidators: true});
  if (!leaves) {
    const error = new Error('leaves not found');
    error.status = 404;
    throw error;
  }
  return leaves;
};

const getLeaves = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid Employee ID');
    error.status = 400;
    throw error;
  }
  const empLeaves = await Leaves.find({empId: id}).populate('empId', 'firstName').exec();
  if (!empLeaves || empLeaves.length === 0) {
    const error = new Error('No leaves found for this employee');
    error.status = 404;
    throw error;
  }
  return empLeaves;
};

const getAll = async (filter, skip, limit) => {
  const leaves = await Leaves.find(filter).populate('empId', 'firstName').skip(skip).limit(limit).exec();
  if (!leaves || leaves.length === 0) {
    const error = new Error('No leaves found for this employee');
    error.status = 404;
    throw error;
  }
  return leaves;
};

export default {submit, editLeave, getLeaves, getAll};
