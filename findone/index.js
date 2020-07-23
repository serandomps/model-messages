var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');

dust.loadSource(dust.compile(require('./template.html'), 'model-messages-findone'));

var findOne = function (id, done) {
    $.ajax({
        method: 'GET',
        url: utils.resolve('apis:///v/messages/' + id),
        dataType: 'json',
        success: function (data) {
            done(null, data);
        },
        error: function (xhr, status, err) {
            done(err || status || xhr);
        }
    });
};

var aboutUrl = function (data) {
    if (data.model === 'vehicles') {
        return utils.resolve('autos:///vehicles/' + data.about);
    }
    if (data.model === 'realestates') {
        return utils.resolve('realestates:///realestates/' + data.about);
    }
    return null;
};

module.exports = function (ctx, container, options, done) {
    findOne(options.id, function (err, data) {
        if (err) {
            return done(err);
        }
        var sandbox = container.sandbox;
        data.url = aboutUrl(data);
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
