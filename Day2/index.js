import http from "http";
import url from "url";
import { genericserverFile, handlePostRequest } from "./generics.js";

const server = http.createServer((req, res) => {
  //const { url, req.method } = req;
  console.log(req.url, req.method );
  const { pathname, query } = url.parse(req.url, true);
  
  if (req.method === "GET"){
  if (pathname === "/json") {
        const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex +limit;

    genericserverFile(res, "./employees.json", "application/json",(data)=>{
        return{
            employees: data.slice(startIndex,endIndex),
            total: data.length,
            page,
            limit,
            totalPages: Math.ceil(data.length / limit),
        }
    });
  } else if (pathname === "/") {
    genericserverFile(res, "./pages/table.htm", "text/html");
  } else if (pathname === "/astronomyLink") {
    genericserverFile(res, "./assets/img1.png", "image/png");
  } else if (pathname === "/astronomy") {
    genericserverFile(res, "./pages/astronomy.htm", "text/html");
  } else if (pathname === "/serbalLink") {
    genericserverFile(res, "./assets/serbal.png", "image/png");
  } else if (pathname === "/serbal") {
    genericserverFile(res, "./pages/serbal.htm", "text/html");
  } else if (pathname === "/style.css") {
    genericserverFile(res, "./assets/style.css", "text/css");
  } 
}else if (req.method === "POST" && pathname === "/employees") {
    handlePostRequest(req, res);
  } else {
    genericserverFile(res, "./pages/not-found.htm", "text/html");
  }
});
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} at http://localhost:3000`);
});
