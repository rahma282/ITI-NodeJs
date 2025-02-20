import http from "http";
import { genericserverFile, handlePostRequest } from "./generics.js";

const server = http.createServer((req, res) => {
  const { url, method } = req;
  console.log({ url, method });
  if (method === "GET"){
  if (url === "/json") {
    genericserverFile(res, "./employees.json", "text/json");
  } else if (url === "/") {
    genericserverFile(res, "./pages/file.htm", "text/html");
  } else if (url === "/astronomyLink") {
    genericserverFile(res, "./assets/img1.png", "image/png");
  } else if (url === "/astronomy") {
    genericserverFile(res, "./pages/astronomy.htm", "text/html");
  } else if (url === "/serbalLink") {
    genericserverFile(res, "./assets/serbal.png", "image/png");
  } else if (url === "/serbal") {
    genericserverFile(res, "./pages/serbal.htm", "text/html");
  } else if (url === "/style.css") {
    genericserverFile(res, "./assets/style.css", "text/css");
  } 
}else if (method === "POST" && url === "/employees") {
    handlePostRequest(req, res);
  } else {
    genericserverFile(res, "./pages/not-found.htm", "text/html");
  }
});
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is runnig on port ${PORT} at http://localhost:3000`);
});
