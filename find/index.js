var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');
var Message = require('../service');

dust.loadSource(dust.compile(require('./template.html'), 'model-messages-find'));

module.exports = function (ctx, container, options, done) {
    Message.find({}, function (err, data) {
        if (err) {
            return done(err);
        }
        var sandbox = container.sandbox;
        dust.render('model-messages-find', serand.pack({
            title: options.title,
            size: 6,
            messages: data
        }, container), function (err, out) {
            if (err) {
                return done(err);
            }
            sandbox.append(out);
            done(null, function () {
                $('.model-messages-find', sandbox).remove();
            });
        });
    });
};
