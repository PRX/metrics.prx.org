'use strict';
const dotenv   = require('dotenv');
const fs       = require('fs');
const pug      = require('pug');
const newrelic = require('newrelic');
const spawn    = require('child_process').spawn
const SERVER_ENVS = ['NEW_RELIC_APP_NAME', 'NEW_RELIC_LICENSE_KEY'];

/**
 * Read dotenv (.env + ENV)
 */
exports.readEnv = (forServer) => {
  let exampleText = fs.readFileSync(`${__dirname}/../env-example`);
  let exampleKeys = Object.keys(dotenv.parse(exampleText));

  let dots = {};
  try {
    let dottext = fs.readFileSync(`${__dirname}/../.env`);
    dots = dotenv.parse(dottext);
  } catch (err) {}

  let env = {};
  let isDefined = (k) => process.env[k] !== undefined || (dots[k] && dots[k] !== '');
  for (let key of exampleKeys) {
    if (isDefined(key) && (forServer || SERVER_ENVS.indexOf(key) < 0)) {
      let val = process.env[key] || dots[key];
      if (val === 'true') {
        env[key] = true;
      } else if (val === 'false') {
        env[key] = false;
      } else if (isNaN(val) || val == '') {
        env[key] = val;
      } else {
        env[key] = parseInt(val);
      }
    }
  }
  return env;
};

/**
 * Find the script tags to include
 */
exports.findScripts = (isDist) => {
  let names = ['inline', 'polyfills', 'vendor', 'main'];
  let scripts = [];
  if (isDist) {
    let distFiles = [];
    try { distFiles = fs.readdirSync(`${__dirname}/../dist`); } catch (e) {}
    scripts = names.map(n => {
      return distFiles.find(f => f.match(/\.bundle\.js$/) && f.split('.')[0] === n);
    }).filter(s => s);
  } else {
    names.splice(3, 0, 'styles'); // styles are js-bundled in dev
    scripts = names.map(n => `${n}.bundle.js`);
  }
  if (scripts.length !== names.length) {
    console.error('ERROR: could not find built scripts in ./dist/');
    console.error('       did you forget to run npm build?');
    process.exit(1);
  }
  return scripts;
};

/**
 * Find inline css to include (dist only)
 */
exports.findStyles = (isDist) => {
  let styles = [];
  if (isDist) {
    let distFiles = [];
    try { distFiles = fs.readdirSync(`${__dirname}/../dist`); } catch (e) {}
    styles = distFiles.filter(f => f.match(/\.bundle\.css$/));
  }
  return styles;
};

/**
 * Compile the index
 */
exports.buildIndex = (isDist) => {
  let tpl = cache('html', isDist, () => pug.compileFile(`${__dirname}/../src/index.pug`));
  let data = {
    env: cache('env', isDist, () => exports.readEnv()),
    js:  cache('js',  isDist, () => exports.findScripts(isDist)),
    css: cache('css', isDist, () => exports.findStyles(isDist))
  };

  // DON'T cache newrelic header (will be disabled if NR ENVs aren't set)
  data.newRelicHeader = newrelic.getBrowserTimingHeader();
  return tpl(data);
};

/**
 * Determine if a request looks like a path (vs a file)
 */
exports.isIndex = (path) => {
  if (path === '/' || path === '/index.html') {
    return true;
  } else {
    let lastToken = path.substr(path.lastIndexOf('/') + 1).split(/\?|;/)[0];
    return lastToken.indexOf('.') === -1;
  }
};

/**
 * Spawn a process to run ng serve
 */
exports.ngServe = (port) => {
  let ng = `${__dirname}/../node_modules/.bin/ng`;
  return spawn(ng, ['serve', '--port', port, '--host', 'metrics.prx.dev'], {stdio: 'inherit'});
};

/**
 * Cache helper
 */
 const CACHED = {};
 function cache(key, useCached, cacheFn) {
   if (useCached && CACHED[key]) {
     return CACHED[key];
   } else {
     return CACHED[key] = cacheFn();
   }
 }
