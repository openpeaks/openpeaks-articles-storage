'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('util');


/**
 * Base schema
 */
function BaseSchema() {
	Schema.apply(this, arguments);

	if (!this.paths.createdAt) {
		this.add({
			createdAt: {
				type: Date,
				default: Date.now
			}
		});
	}
	if (!this.paths.updatedAt) {
		this.add({
			updatedAt: {
				type: Date
			}
		});
	}

	this.pre('save', function(next) {
		this.updatedAt = Date.now();
		next();
	});
}

util.inherits(BaseSchema, Schema);

/**
 * Article schema
 */
var Article = exports.Article = new BaseSchema({
	_id: String,
	title: {
		type: String,
		required: true,
		maxlength: 200,
		minlength: 6
	},
	slug: {
		type: String,
		required: true,
		lowercase: true,
		maxlength: 100,
		minlength: 6
	},
	lang: {
		type: String,
		index: true,
		lowercase: true,
		required: true,
		maxlength: 2,
		minlength: 2
	},
	summary: {
		type: String,
		required: true,
		minlength: 100,
		maxlength: 400
	},
	textHash: {
		type: String,
		required: true,
		minlength: 40,
		maxlength: 40
	},
	imageId: {
		type: String,
		minlength: 1,
		maxlength: 40
	},
	categories: {
		type: [String],
		index: true
	},
	topics: {
		type: [String],
		index: true
	},
	countViews: {
		type: Number,
		default: 0
	}
});

/**
 * ArticleText schema
 */
var ArticleText = exports.ArticleText = new BaseSchema({
	_id: String,
	text: {
		type: String,
		required: true
	}
});


Article.set('toObject', {
	getters: true
});
ArticleText.set('toObject', {
	getters: true
});
