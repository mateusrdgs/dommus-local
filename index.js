const express = require('express'),
      http = require('http'),
      helmet = require('helmet'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      cors = require('cors'),
      port = 4000,
      app = express(),
      server = http.Server(app),
      io = require('socket.io')(server);

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port || process.env.PORT, () => console.log(`Express listening on port ${port}`));

module.exports = io;
