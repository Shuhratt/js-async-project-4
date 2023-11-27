import express from 'express';
import path from 'path';

const app = express();
const port = 3001;
let server;

app.use('/assets/professions', express.static('./server/static'));

app.get('/courses', (req, res) => {
  res.sendFile(path.resolve('./__fixtures__/page-base-link.html'));
});

server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/)`);
});

export default server;
