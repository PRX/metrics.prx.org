'use strict';
const newrelic = require('newrelic');
const express  = require('express');
const proxy    = require('express-http-proxy');
const gzip     = require('connect-gzip-static');
const morgan   = require('morgan');
const util     = require('./util');

// dev/dist mode
if (process.argv.length !== 3 || ['dev', 'dist'].indexOf(process.argv[2]) < 0) {
  console.log('Usage: node server.js [dev|dist]');
  process.exit(1);
}
let isDist = process.argv[2] === 'dist';

let app = express();
let env = util.readEnv(true);
let port = parseInt(process.env.PORT || 4202);
app.use(morgan('combined', { skip: req => !util.isIndex(req.path) }));
app.use('/pub', proxy(env.CMS_HOST, {proxyReqPathResolver: (req) => `/pub${req.url}`}));

// index.html
util.buildIndex(isDist); // throw compilation errors right away
app.use(function sendIndex(req, res, next) {
  if (util.isIndex(req.path)) {
    if (req.headers['x-forwarded-proto'] === 'http' && !req.headers['host'].match(/\.docker/)) {
      res.redirect(`https://${req.headers.host}${req.url}`);
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.send(util.buildIndex(isDist));
    }
  } else {
    next();
  }
});

// asset serving (static or ng serve'd)
if (isDist) {
  let serveStatic = gzip('dist');
  app.use(function serveAssets(req, res, next) {
    serveStatic(req, res, next);
  });
  app.use(function fileNotFound(req, res, next) {
    res.status(404).send('Not found');
  });
} else {
  util.ngServe(port + 1);
  app.use(proxy(`127.0.0.1:${port + 1}`, {proxyReqPathResolver: req => req.url}));
}

// actual listening port
app.listen(port);
console.log('+---------------------------+');
console.log(`| express listening on ${port} |`);
console.log('+---------------------------+\n');
