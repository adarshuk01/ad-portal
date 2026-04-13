const app = require('../app');
const connectDB = require('../config/db');

module.exports = async (req, res) => {
  await connectDB();   // 🔥 MUST before every request
  return app(req, res);
};