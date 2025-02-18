import validator from "validator";
export function validation(data) {
  if (!data.name || !data.email || !data.salary) {
    console.log("Error: name, email, salary are required!");
    return -1;
  }
  if (
    validator.isEmpty(data.name) ||
    !validator.isAlpha(data.name, "en-US", { ignore: " " })
  ) {
    console.log("Error: Name must contain only letters and spaces");
    return -1;
  }
  if (!validator.isEmail(data.email)) {
    console.log("Error: Invalid email, add like(user@example.com)");
    return -1;
  }

  const salary = parseFloat(data.salary);
  if (!validator.isFloat(data.salary.toString(), { min: 7000 })) {
    console.log("Error: Salary must be at least 7000)");
    return -1;
  }
  data.salary = salary;

  if (data.yearsOfExperience) {
    data.yearsOfExperience = Number(data.yearsOfExperience);
    if (isNaN(data.yearsOfExperience)) {
      console.log("Error: yearsOfExperience must be a number.");
      return -1;
    }
    data.yearsOfExperience = Math.max(0, data.yearsOfExperience);
  } else {
    data.yearsOfExperience = 0;
  }

  const validLevels = ["Jr", "Mid-Level", "Sr", "Lead"];
  if (!data.level) {
    data.level = "Jr";
  }
  if (!validLevels.includes(data.level)) {
    console.log("Error: Level must be one of Jr, Mid-Level, Sr, or Lead");
    return -1;
  }
  return 0;
}
