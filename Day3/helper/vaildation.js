import validator from 'validator';

export function validation(req, res, next) {
  const data = req.body;

  if (!data.name || !data.email || !data.salary) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'name, email, and salary are required!'
    });
  }

  if (
    validator.isEmpty(data.name)
    || !validator.isAlpha(data.name, 'en-US', {ignore: ' '})
  ) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Name must contain only letters and spaces.'
    });
  }

  if (!validator.isEmail(data.email)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Invalid email format. Use (user@example.com).'
    });
  }

  const salary = Number.parseFloat(data.salary);
  if (!validator.isFloat(data.salary.toString(), {min: 7000})) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Salary must be at least 7000.'
    });
  }
  data.salary = salary;

  if (data.yearsOfExperience) {
    data.yearsOfExperience = Number(data.yearsOfExperience);
    if (Number.isNaN(data.yearsOfExperience)) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'yearsOfExperience must be a number.'
      });
    }
    data.yearsOfExperience = Math.max(0, data.yearsOfExperience);
  } else {
    data.yearsOfExperience = 0;
  }

  const validLevels = ['Jr', 'Mid-Level', 'Sr', 'Lead'];
  if (!data.level) {
    data.level = 'Jr';
  }
  if (!validLevels.includes(data.level)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Level must be one of Jr, Mid-Level, Sr, or Lead.'
    });
  }

  next();
}
