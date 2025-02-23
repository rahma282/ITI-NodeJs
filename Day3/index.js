import express from 'express';
import {Router} from './routers/employees.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(Router);
app.set('view engine', 'pug');
app.set('views', './views');
app.listen(3000, () => {
  console.log('server is running on http://localhost:3000');
});
