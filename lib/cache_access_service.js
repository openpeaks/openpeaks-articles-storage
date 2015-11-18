'use strict';

var AccessService = require('./access_service');
var MemoryCache = require('./memory_cache');
var util = require('util');
var utils = require('./utils');
var Promise = utils.Promise;
var objectHash = require('object-hash');

function formatCacheKey(name, data) {
	return [name, objectHash(data)].join(':');
}

/**
 * Gets data from cache or storage & then puts into cache.
 * @private
 */
function getData(self, method, time, data, options) {
	options = options || {};
	if (!options.noCache) {
		time = options.cacheTime || time;
		var key = formatCacheKey(method, data);
		var value = self.cache.get(key);
		if (value !== null) {
			// console.log('got value from cache:', key);
			return Promise.resolve(value);
		}
	}
	return AccessService.prototype[method].call(self, data, options)
		.then(function(result) {
			if (!options.noCache && [null, undefined].indexOf(result) === -1) {
				self.cache.put(key, result, time);
			}
			return result;
		});
}

/**
 * CacheAccessService class.
 * @augments AccessService
 * @class
 */
function CacheAccessService(db, cache) {
	AccessService.call(this, db);
	this.cache = cache || new MemoryCache();
}

module.exports = CacheAccessService;

util.inherits(CacheAccessService, AccessService);

CacheAccessService.prototype.articles = function(params, options) {
	return getData(this, 'articles', 30, params, options);
};

CacheAccessService.prototype.countArticles = function(params, options) {
	return getData(this, 'countArticles', 120, params, options);
};
