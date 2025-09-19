module.exports = (req, res, next) => {
  // basic request-level logging hook - extendable for instrumentation
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    // This uses console by default; replace with your structured logger
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });
  next();
};
