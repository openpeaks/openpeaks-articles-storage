'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var crypto = require('crypto');

function clearObject(target){
	for(var prop in target){
		if(~[null, undefined, ''].indexOf(target[prop])){
			delete target[prop];
		}
	}
	return target;
}

function isNull(target) {
	return [undefined, null].indexOf(target) > -1;
}

function isNotNull(target) {
	return !isNull(target);
}

function mongoGetItem(data, nofields) {

	function mapItem(item) {
		return mongoGetItem(item, nofields);
	}

	var _id = data._id;

	data = isNotNull(data.toObject) ? data.toObject() : data;
	for (var prop in data) {
		if (prop === 'id' && _.isNumber(_id)) {
			data[prop] = parseInt(data[prop]);
		} else if (data[prop] === null || nofields.indexOf(prop) > -1) {
			delete data[prop];
		} else if (Array.isArray(data[prop])) {
			data[prop] = data[prop].map(mapItem);
		}
	}
	return data;
}

function mongoGet(data, nofields) {
	nofields = nofields || ['_id', '__v'];
	if (!Array.isArray(nofields)) {
		nofields = [nofields];
	}

	if (data && data.toObject) {
		return mongoGetItem(data, nofields);
	}
	if (data && Array.isArray(data)) {
		return data.map(function(item) {
			return mongoGetItem(item, nofields);
		});
	}
	return data;
}

function hash(value, h, encoding) {
	return crypto.createHash(h).update(value).digest(encoding);
}

function sha1(value, encoding) {
	return hash(value, 'sha1', encoding || 'hex');
}

function md5(value, encoding) {
	return hash(value, 'md5', encoding || 'hex');
}

exports.MODELS = ['Article', 'ArticleText'];
exports.mongoGet = mongoGet;
exports._ = _;
exports.Promise = Promise;
exports.md5 = md5;
exports.sha1 = sha1;
exports.clearObject = clearObject;
