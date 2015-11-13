'use strict';

var assert = require('assert');
var slug = require('slug');
var atonic = require('atonic');
var utils = require('./utils');
var _ = utils._;

function createArticleSlug(title) {
	assert.ok(title);
	title = title.trim().toLowerCase();
	title = atonic.lowerCase(title);
	return slug(title);
}

function createArticleTextHash(text) {
	assert.ok(text);
	return utils.sha1(text.trim().toLowerCase());
}

function createArticleId(article) {
	assert.ok(article);
	assert.ok(article.lang);
	article.lang = article.lang.trim().toLowerCase();
	assert.equals(2, article.lang.length);
	article.slug = article.slug || createArticleSlug(article.title);

	var id = [article.lang, article.slug].join('#');

	return utils.md5(id);
}

function normalizeArticle(article) {
	article = _.clone(article);

	article.lang = article.lang.trim().toLowerCase();
	article.slug = article.slug || createArticleSlug(article.title);
	article._id = createArticleId(article);

	return article;
}

function normalizeArticleText() {

}

exports.createArticleTextHash = createArticleTextHash;
exports.createArticleId = createArticleId;
exports.createArticleSlug = createArticleSlug;
exports.normalizeArticle = normalizeArticle;
exports.normalizeArticleText = normalizeArticleText;
