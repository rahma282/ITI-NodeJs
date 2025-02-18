import http from "http";
import fs from "fs";
import { addEmployee, getEmployees } from "./crud.js";
import { validation } from "./vaildation.js";

const serverFile = (res, filePath, contentType) => {
  res.writeHead(200, { "Content-Type": contentType });
  const data = fs.createReadStream(filePath);

  data.pipe(res); //automatically ends the response when the stream finishes.

  data.on("error", (err) => {
    console.error("File read error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error 500 (Internal Server Error)");
  });

  res.on("error", (err) => {
    console.error("Response error:", err);
  });
};
const server = http.createServer((req, res) => {
  const { url, method } = req;
  console.log({ url, method });
  // res.write("test\n");
  if (url === "/json") {
    serverFile(res, "./employees.json", "text/json");
  } else if (method === "GET" && url === "/") {
    serverFile(res, "./file.htm", "text/html");
  } else if (method === "GET" && url === "/astronomyLink") {
    serverFile(res, "./assets/img1.png", "image/png");
  } else if (method === "GET" && url === "/astronomy") {
    serverFile(res, "./htmlPages&css/astronomy.htm", "text/html");
  } else if (method === "GET" && url === "/serbalLink") {
    serverFile(res, "./assets/serbal.png", "image/png");
  } else if (method === "GET" && url === "/serbal") {
    serverFile(res, "./htmlPages&css/serbal.htm", "text/html");
  } else if (method === "GET" && url === "/style.css") {
    serverFile(res, "./htmlPages&css/style.css", "text/css");
  } else if (method === "POST" && url === "/employees") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const newEmployee = JSON.parse(body);
      const employees = getEmployees();

      const newId = employees.length > 0 ? employees[employees.length - 1].ID + 1 : 1;
      const formattedEmployee = { ID: newId, ...newEmployee };

      if (validation(formattedEmployee) !== -1) {
        employees.push(formattedEmployee);
        addEmployee(employees);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Employee added successfully",
            employee: formattedEmployee,
          })
        );
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("Error 404: Not Found");
  }
});
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is runnig on port ${PORT} at http://localhost:3000`);
});
