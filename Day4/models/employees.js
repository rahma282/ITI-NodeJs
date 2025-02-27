import bcrypt from 'bcrypt';
import moment from 'moment';
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
    trim: true,
    match: [/^\S+$/, 'Username cannot contain spaces.']
  },
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 15,
    trim: true,
    set: (value) =>
      value ? value.charAt(0).toUpperCase() + value.slice(1) : value
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 15,
    trim: true,
    set: (value) =>
      value ? value.charAt(0).toUpperCase() + value.slice(1) : value
  },
  dob: {
    type: Date,
    required: true,
    validate: {
      validator(v) {
        return v instanceof Date && v < new Date();
      },
      message: 'Date of birth must be in the past.'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  profile: {
    type: {
      title: {
        type: String,
        required() {
          return this.profile != null;
        }
      },
      description: {
        type: String,
        required() {
          return this.profile != null;
        }
      },
      yearOfExperience: {
        type: Number,
        default: 0
      },
      department: {
        type: String,
        required() {
          return this.profile != null;
        }
      },
      phone: {
        type: String,
        required() {
          return this.profile != null;
        },
        trim: true,
        match: [/^\d{10,12}$/, 'Phone number must be between 10 and 12 digits']
      },
      email: {
        type: String,
        trim: true,
        unique: false,
        lowercase: true,
        validate: {
          validator(value) {
            return !value || /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(value);
          },
          message: 'Invalid email format.'
        }
      }
    },
    required: false
  }
}, {timestamps: true});

employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

employeeSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
    this.setUpdate(update);
  }

  next();
});
employeeSchema.virtual('age').get(function () {
  return this.dob ? moment().diff(moment(this.dob), 'years') : null;
});
employeeSchema.set('toJSON', {
  transform: (doc, {__v, password, ...rest}, options) => rest
});

employeeSchema.methods.comparePasswords = function (password) {
  return bcrypt.compareSync(password, this.password);
};
const Employees = mongoose.model('Employees', employeeSchema);
export default Employees;
