module.exports = (err, req, res, next) => {
  // Log server error
  console.error(err && err.stack ? err.stack : err);

  const status = err.status || 500;
  const payload = {
    error: {
      message: err.message || 'Internal Server Error',
      // expose stack only in development
      ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    }
  };

  res.status(status).json(payload);
};
