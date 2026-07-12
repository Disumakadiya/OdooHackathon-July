const app = require('./app');
const { testConnection } = require('./config/db');
require('dotenv').config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await testConnection();
    app.listen(port, () => {
      console.log(`AssetFlow backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error.message);
    process.exit(1);
  }
};

startServer();
