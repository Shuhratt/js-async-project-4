import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3001;
let server;

app.use('/assets/professions', express.static('./server/static'));
app.use(cors());

app.get('/courses', (req, res) => {
  res.sendFile(path.resolve('./__fixtures__/page-base-link.html'));
});

server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/)`);
});

export default server;
