import fs from 'node:fs';

export const downloadImage = (res, filePath, fileName) => {
  res.writeHead(200, {
    'content-Type': 'application/octet-stream', // force download
    'Content-Disposition': `attachment; filename="${fileName}"`
  });
  const data = fs.createReadStream(filePath);

  data.pipe(res);
  data.on('error', (err) => {
    console.error('File read error:', err);
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end('Error 500 (Internal Server Error)');
  });
};
