var utils = require('utils');

exports.findOne = function (options, done) {
    $.ajax({
        method: 'GET',
        url: utils.resolve('apis:///v/messages/' + options.id),
        dataType: 'json',
        success: function (data) {
            done(null, data);
        },
        error: function (xhr, status, err) {
            done(err || status || xhr);
        }
    });
};

exports.find = function (options, done) {
    $.ajax({
        method: 'GET',
        url: utils.resolve('apis:///v/messages' + utils.toData(options)),
        dataType: 'json',
        success: function (data) {
            done(null, data);
        },
        error: function (xhr, status, err) {
            done(err || status || xhr);
        }
    });
};

exports.remove = function (options, done) {
    $.ajax({
        method: 'DELETE',
        url: utils.resolve('apis:///v/messages/' + options.id),
        dataType: 'json',
        success: function (data) {
            done(null, data);
        },
        error: function (xhr, status, err) {
            done(err || status || xhr);
        }
    });
};

exports.create = function (options, done) {
    $.ajax({
        url: utils.resolve('apis:///v/messages' + (options.id ? '/' + options.id : '')),
        type: options.id ? 'PUT' : 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(options),
        success: function (data) {
            done(null, data);
        },
        error: function (xhr, status, err) {
            done(err || status || xhr);
        }
    });
};
