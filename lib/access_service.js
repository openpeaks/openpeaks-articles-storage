'use strict';

var assert = require('assert');
var utils = require('./utils');
var get = utils.mongoGet;
var Promise = utils.Promise;
var _ = utils._;
var models = utils.MODELS;

var Service = module.exports = function Service(db) {
	this.db = db;
};

function checkModel(model) {
	if (models.indexOf(model) < 0) {
		throw new Error('Invalid model: ' + model);
	}
}

Service.prototype.one = function(model, params) {
	checkModel(model);
	assert.ok(params);

	return this.db[model].findOneAsync(params.where, params.select).then(get);
};

Service.prototype.count = function(model, params) {
	checkModel(model);
	params = params || {};

	return this.db[model].countAsync(params.where);
};

Service.prototype.list = function(model, params) {
	checkModel(model);
	assert.ok(params);

	var self = this,
		limit = 10;
	params = _.pick(params, 'where', 'limit', 'order', 'select');
	if (params.limit && (params.limit < 1 || params.limit > 200)) {
		delete params.limit;
	}

	var sort = [];
	if (_.isString(params.order)) {
		params.order.split(/[ ,;]+/g).forEach(function(name) {
			if (name.length < 2) {
				return;
			}
			if (name[0] === '-') {
				sort.push([name.substr(1), -1]);
			} else {
				sort.push([name, 1]);
			}
		});
	}

	return new Promise(function(resolve, reject) {
		self.db[model]
			.find(params.where)
			.select(params.select)
			.sort(sort)
			.skip(params.offset || 0)
			.limit(params.limit || limit)
			.exec(function(error, list) {
				if (error) {
					return reject(error);
				}
				list = get(list);
				resolve(list);
			});
	});
};


/**
 * Builds API
 */
models.forEach(function(model) {
	var lowerStartModel = model.substr(0, 1).toLowerCase() + model.substr(1);
	// one model: .topic()
	Service.prototype[lowerStartModel] = function(params, options) {
		return this.one(model, params, options);
	};
	// list model: .topics()
	Service.prototype[lowerStartModel + 's'] = function(params, options) {
		return this.list(model, params, options);
	};
	// count model: .countTopics()
	Service.prototype['count' + model + 's'] = function(params, options) {
		return this.count(model, params, options);
	};
});
