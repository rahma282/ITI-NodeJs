import http from "http";
import url from "url";
import {
  genericserverFile,
  handlePostRequest,
  paginateData,
} from "./generics.js";

const server = http.createServer((req, res) => {
  //const { url, req.method } = req;
  console.log(req.url, req.method);
  const { pathname, query } = url.parse(req.url, true);

  if (req.method === "GET") {
    if (pathname === "/json") {
      return genericserverFile(
        res,
        "./employees.json",
        "application/json",
        (data) => paginateData(query, data)
      );
    } else if (pathname === "/") {
      return genericserverFile(res, "./pages/table.htm", "text/html");
    } else if (pathname === "/astronomyLink") {
      return genericserverFile(res, "./assets/img1.png", "image/png");
    } else if (pathname === "/astronomy") {
      return genericserverFile(res, "./pages/astronomy.htm", "text/html");
    } else if (pathname === "/serbalLink") {
      return genericserverFile(res, "./assets/serbal.png", "image/png");
    } else if (pathname === "/serbal") {
      return genericserverFile(res, "./pages/serbal.htm", "text/html");
    } else if (pathname === "/style.css") {
      return genericserverFile(res, "./assets/style.css", "text/css");
    } else {
      return genericserverFile(res, "./pages/not-found.htm", "text/html");
    }
  }
  if (req.method === "POST" && pathname === "/employees") {
    return handlePostRequest(req, res);
  }
});
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} at http://localhost:3000`);
});
