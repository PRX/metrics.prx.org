'use strict';
const fs = require('fs');
const dotenv = require('dotenv');

/**
 * Read a config either from process.env or dotenv
 */
let dots = {};
try { dots = dotenv.parse(fs.readFileSync(`${__dirname}/.env`)); } catch (err) {}
const getConfig = (key) => process.env[key] || dots[key] || undefined;

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  agent_enabled: (getConfig('NEW_RELIC_APP_NAME') && getConfig('NEW_RELIC_LICENSE_KEY')) ? true : false,
  app_name: [getConfig('NEW_RELIC_APP_NAME')],
  license_key: getConfig('NEW_RELIC_LICENSE_KEY'),
  logging: {
    level: 'info'
  },
  capture_params: true,
  browser_monitoring : {
    enable : true
  }
};
