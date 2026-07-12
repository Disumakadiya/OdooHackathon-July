const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const routes = require('./routes');
const bookingRoutes = require('./routes/booking.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const notificationRoutes = require('./routes/notification.routes');
const { notFound, errorHandler } = require('./middleware');

const app = express();

app.use(helmet());
const allowedOrigin = process.env.CORS_ORIGIN;
app.use(
  cors(
    allowedOrigin
      ? { origin: allowedOrigin }
      : undefined // keep current permissive behavior if env not set
  )
);

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'assetflow-backend',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', routes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/maintenances', maintenanceRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
