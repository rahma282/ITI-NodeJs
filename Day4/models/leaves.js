import mongoose from 'mongoose';

const leavesSchema = new mongoose.Schema(
  {
    empId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employees',
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['annual', 'casual', 'sick'],
      default: 'annual'
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'Duration must be a positive number'],
      validate: {
        validator(v) {
          return Number.isInteger(v) && v > 0;
        },
        message: 'Duration must be a positive integer'
      }
    },
    status: {
      type: String,
      enum: ['inprogress', 'cancelled', 'ended'],
      default: 'inprogress'
    }
  },
  {timestamps: true}
);
leavesSchema.pre('save', async function (next) {
  if (this.isModified('status') && this.status === 'cancelled') {
    if (!this._id) return next();
    try {
      const existingLeave = await this.constructor.findById(this._id);
      if (existingLeave && existingLeave.status === 'ended') {
        return next(new Error('Cannot cancel a leave that has already ended.'));
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});
const Leaves = mongoose.model('Leaves', leavesSchema);
export default Leaves;
