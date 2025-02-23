import http from 'node:http';
import {downloadImage} from './helperFunc/download.js';
import {genericserverFile, handlePostRequest} from './helperFunc/generics.js';
import {paginateData} from './helperFunc/pagination.js';

const PORT = 3000;

const server = http.createServer((req, res) => {
  const myURL = new URL(req.url, 'http://localhost:3000');
  const pathname = myURL.pathname;
  const query = Object.fromEntries(myURL.searchParams);

  if (req.method === 'GET') {
    if (pathname === '/json') {
      return genericserverFile(res, './employees.json', 'application/json', (data) => paginateData(query, data));
    } else if (pathname === '/') {
      return genericserverFile(res, './pages/table.htm', 'text/html');
    } else if (pathname === '/astronomyLink') {
      return genericserverFile(res, './assets/img1.png', 'image/png');
    } else if (pathname === '/astronomy') {
      return genericserverFile(res, './pages/astronomy.htm', 'text/html');
    } else if (pathname === '/serbalLink') {
      return genericserverFile(res, './assets/serbal.png', 'image/png');
    } else if (pathname === '/serbal') {
      return genericserverFile(res, './pages/serbal.htm', 'text/html');
    } else if (pathname === '/serbalDownload') {
      return downloadImage(res, './assets/serbal.png', 'serbal.png');
    } else if (pathname === '/astronomyDownload') {
      return downloadImage(res, './assets/img1.png', 'img1.png');
    } else if (pathname === '/style.css') {
      return genericserverFile(res, './assets/style.css', 'text/css');
    } else {
      return genericserverFile(res, './pages/not-found.htm', 'text/html');
    }
  }
  if (req.method === 'POST' && pathname === '/employees') {
    return handlePostRequest(req, res);
  }
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} at http://localhost:3000`);
});
