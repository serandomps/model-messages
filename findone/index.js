var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');

dust.loadSource(dust.compile(require('./template.html'), 'model-messages-findone'));

var findOne = function (id, done) {
    $.ajax({
        method: 'GET',
        url: utils.resolve('www:///apis/v/messages/' + id),
        dataType: 'json',
        success: function (data) {
            done(null, data);
        },
        error: function (xhr, status, err) {
            done(err || status || xhr);
        }
    });
};

module.exports = function (ctx, container, options, done) {
    findOne(options.id, function (err, data) {
        if (err) {
            return done(err);
        }
        var sandbox = container.sandbox;
        dust.render('model-messages-findone', serand.pack(data, container), function (err, out) {
            if (err) {
                return done(err);
            }
            sandbox.append(out);
            done(null, function () {
                $('.model-messages-findone', sandbox).remove();
            });
        });
    });
};