import fs from 'fs';

export function getEmployees() {
  if (!fs.existsSync('./employees.json')) {
    return [];
  }
  return JSON.parse(fs.readFileSync('./employees.json', 'utf-8'));
}

export function addEmployee(data) {
  fs.writeFileSync('./employees.json', JSON.stringify(data, null, 2));
}
