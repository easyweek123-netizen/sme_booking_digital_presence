export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'bookeasy',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  booking: {
    slotIntervalMinutes: parseInt(process.env.SLOT_INTERVAL_MINUTES || '30', 10),
  },
});

