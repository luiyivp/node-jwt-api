import express, { Application, json } from 'express';
import morgan from 'morgan';

import authRoutes from './routes/auth';

const app: Application = express();

// settings
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(morgan('dev'));
app.use(json());

// routes
app.use('/api/auth', authRoutes);

export default app;
