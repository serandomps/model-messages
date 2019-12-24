var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');
var Message = require('../service');

dust.loadSource(dust.compile(require('./template'), 'model-messages-remove'));

module.exports = function (ctx, container, options, done) {
    var sandbox = container.sandbox;
    Message.findOne({id: options.id}, function (err, message) {
        if (err) return done(err);
        dust.render('model-messages-remove', serand.pack(message, container), function (err, out) {
            if (err) {
                return done(err);
            }
            var el = sandbox.append(out);
            $('.remove', el).on('click', function () {
                Message.remove(message, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    serand.redirect('/messages');
                });
            });
            done(null, function () {
                $('.model-messages-remove', sandbox).remove();
            });
        });
    });
};
