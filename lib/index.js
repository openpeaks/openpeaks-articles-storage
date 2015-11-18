'use strict';

var AccessService = require('./access_service');
var CacheAccessService = require('./cache_access_service');
var ControlService = require('./control_service');
var db = require('./db');
var mongoose = require('mongoose');

module.exports = {
  AccessService: AccessService,
  ControlService: ControlService,
  CacheAccessService: CacheAccessService,
  db: db,
  connect: function(connectionString, options, cb) {
    return mongoose.createConnection(connectionString, options, cb);
  },
  mongoose: mongoose,
  formatter: require('./formatter')
};
