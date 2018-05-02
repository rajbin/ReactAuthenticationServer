const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const keys = require('./config/keys');

const app = express();
require('./models/User');

// Mongo DB Setup
mongoose.connect(keys.mongoURI);

// App Setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));

require('./routes/authRoutes')(app);

// Error handler middleware
// The default behavior is to throw an error when the token is invalid,
// so you can add your custom logic to manage unauthorized access as follows:
app.use((err, req, res, next) => {
    return res.status(500).json({ status: 'error', code: 'unauthorized' });
});

// Server Setup
const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port);
