exports.health = (req, res) => {
  res.json({
    service: 'inikit-express-template',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
};
