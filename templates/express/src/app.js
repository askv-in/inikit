require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const apiRouter = require('./routes/api');
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// => Basic security + parsing
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// => CORS - allow all origins by default, override in production via env
app.use(cors());

// => Logging - use morgan in dev or combined in production
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// => Custom logger (example)
app.use(logger);

// => Routes
app.use('/api', apiRouter);

// => health of root
app.get('/', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// => 404 + error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
