import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/booking.routes.js';
import maintenanceRoutes from './routes/maintenance.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import assetsRoutes from './routes/assets.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { notFound, errorHandler } from './middleware/index.js';

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
const allowedOrigin = process.env.CORS_ORIGIN;
app.use(
  cors(
    allowedOrigin
      ? { origin: allowedOrigin }
      : undefined
  )
);
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'assetflow-backend',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/maintenances', maintenanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
