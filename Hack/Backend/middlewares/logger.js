const winston = require('winston');
const expressWinston = require('express-winston');
require('winston-mongodb');

const requestLog = expressWinston.logger({
  transports: [
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI || "mongodb+srv://dbAdmin:EOW2tr3cqUcPqp7k@symtrack-zokm9.gcp.mongodb.net/hackathon?retryWrites=true&w=majority", //Your Db connection
      collection: 'logs',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      capped:true,
      metaKey:'meta'
  })
  ],
  meta: true,
  baseMeta: true,
  msg: "ip: {{req.connection.remoteAddress}}",
  requestWhitelist: [
    "url",
    "method",
    "httpVersion",
    "originalUrl",
    "query"
  ],

});

exports.requestLog = requestLog;