import fs from 'node:fs';
import {addEmployee, getEmployees} from './crud.js';
import {validation} from './vaildation.js';

export const genericserverFile = (res, filePath, contentType, processData = null) => {
  res.writeHead(200, {'Content-Type': contentType});

  if (processData) {
    // if i use pagnation to list employees data
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('File read error:', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Error 500 (Internal Server Error)');
        return;
      }
      try {
        let jsonData = JSON.parse(data);
        jsonData = processData(jsonData); // apply pagination
        res.end(JSON.stringify(jsonData));
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Error 500 (Internal Server Error)');
      }
    });
  } else {
    // normal file streaming for other file types
    const data = fs.createReadStream(filePath);

    data.pipe(res); // automatically ends the response when the stream finishes.

    data.on('error', (err) => {
      console.error('File read error:', err);
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Error 500 (Internal Server Error)');
    });

    res.on('error', (err) => {
      console.error('Response error:', err);
    });
  }
};

export const handlePostRequest = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString(); // convert buffer to string
  });

  // 'end' Fires when all chunks have been received.
  req.on('end', () => {
    let newEmployee;

    try {
      if (req.headers['content-type'].includes('application/json')) {
        newEmployee = JSON.parse(body); // parse JSON data
      } else {
        newEmployee = Object.fromEntries(new URLSearchParams(body)); // parse form data cause form return x-www-form-urlencoded data
      }
    } catch (error) {
      console.error('Invalid JSON format:', error);
      res.writeHead(400, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: 'Invalid data format'}));
      return;
    }

    const employees = getEmployees();

    const id = employees.length > 0 ? employees[employees.length - 1].ID + 1 : 1;
    const formattedEmployee = {ID: id, ...newEmployee};
    // see if it from postman or from browser
    if (validation(formattedEmployee) !== -1) {
      employees.push(formattedEmployee);
      addEmployee(employees);
      if (req.headers['content-type'] === 'application/json') {
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(
          JSON.stringify({
            message: 'Employee added successfully',
            employee: formattedEmployee
          })
        );
      } else {
        // update end point return html page instead of json
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`<div style="text-align: center; margin-top: 20%; color: green; font-size: 24px; text-shadow: 1px 1px 2px black;">
                <h1>Employee added successfully!</h1>
                <a href='http://127.0.0.1:5500/pages/addEmployee.html' style="color: black; background: white; border: 5px solid #ddd; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go back</a></div>`);
      }
    } else {
      res.writeHead(201, {'Content-Type': 'application/json'});
      res.end(
        JSON.stringify({
          message: 'Invaild Employee Data,The name ,email, salary is requied!!'
        })
      );
    }
  });
};
