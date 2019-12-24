var dust = require('dust')();
var form = require('form');
var utils = require('utils');
var serand = require('serand');
var Message = require('../service');

dust.loadSource(dust.compile(require('./template.html'), 'model-messages-create'));

var configs = function (options) {
    return {
        to: {
            find: function (context, source, done) {
                done(null, context.to);
            },
            render: function (ctx, vform, data, value, done) {
                done(null, data);
            },
        },
        type: {
            find: function (context, source, done) {
                serand.blocks('select', 'find', source, done);
            },
            validate: function (context, data, value, done) {
                if (!value) {
                    return done(null, 'Please select the type of information to be sent.');
                }
                done(null, null, value);
            },
            update: function (context, source, error, value, done) {
                done();
            },
            render: function (ctx, vform, data, value, done) {
                var el = $('.type', vform.elem);
                serand.blocks('select', 'create', el, {
                    value: value
                }, done);
            }
        },
        model: {
            find: function (context, source, done) {
                done(null, context.model);
            },
            render: function (ctx, vform, data, value, done) {
                done(null, data);
            },
        },
        about: {
            find: function (context, source, done) {
                done(null, context.about);
            },
            render: function (ctx, vform, data, value, done) {
                done(null, data);
            },
        },
        body: {
            find: function (context, source, done) {
                done(null, $('textarea', source).val());
            },
            validate: function (context, data, value, done) {
                if (!value) {
                    return done(null, 'Please specify the details to be sent.');
                }
                done(null, null, value);
            },
            update: function (context, source, error, value, done) {
                done();
            },
            render: function (ctx, vform, data, value, done) {
                var el = $('.body', vform.elem);
                serand.blocks('textarea', 'create', el, {
                    value: value
                }, done);
            }
        }
    };
};

var create = function (messagesForm, message, done) {
    messagesForm.find(function (err, data) {
        if (err) {
            return done(err);
        }
        messagesForm.validate(data, function (err, errors, data) {
            if (err) {
                return done(err);
            }
            messagesForm.update(errors, data, function (err) {
                if (err) {
                    return done(err);
                }
                if (errors) {
                    return done(null, errors);
                }
                var o = {};
                if (message) {
                    o.id = message.id;
                }
                Object.keys(data).forEach(function (key) {
                    var value = data[key];
                    if (Array.isArray(value)) {
                        if (!value.length) {
                            return;
                        }
                        o[key] = data[key];
                        return;
                    }
                    if (value) {
                        o[key] = value;
                    }
                });
                Message.create(o, function (err) {
                    done(err);
                });
            });
        });
    });
};

var render = function (ctx, container, options, data, done) {
    utils.users(null, function (err, users) {
        if (err) {
            return done(err);
        }
        var sandbox = container.sandbox;
        var from = '/' + options.model + '/' + options.about;
        data._ = data._ || {};
        data._ = {
            parent: container.parent
        };
        data.to = users.talk;
        data.model = options.model;
        data.about = options.about;
        data._.types = [
            {label: 'Bug', value: 'bug'},
            {label: 'Enhancement', value: 'enhancement'},
            {label: 'Invalid', value: 'invalid'},
            {label: 'Violation', value: 'violation'},
            {label: 'Other', value: 'other'}
        ];
        dust.render('model-messages-create', serand.pack(data, container), function (err, out) {
            if (err) {
                return done(err);
            }
            var elem = sandbox.append(out);
            var messagesForm = form.create(container.id, elem, configs(options));
            ctx.form = messagesForm;
            messagesForm.render(ctx, data, function (err) {
                if (err) {
                    return done(err);
                }
                if (container.parent) {
                    done(null, {
                        create: function (created) {
                            create(messagesForm, data, function (err, data) {
                                if (err) {
                                    return created(err);
                                }
                                created(null, null, data);
                            });
                        },
                        form: messagesForm,
                        clean: function () {
                            $('.model-messages-create', sandbox).remove();
                        }
                    });
                    return;
                }
                sandbox.on('click', '.create', function (e) {
                    create(messagesForm, null, function (err, errors) {
                        if (err) {
                            return console.error(err);
                        }
                        if (errors) {
                            return;
                        }
                        serand.redirect(options.location || from);
                    });
                });
                sandbox.on('click', '.cancel', function (e) {
                    serand.redirect(options.location || from);
                });
                done(null, {
                    form: messagesForm,
                    clean: function () {
                        $('.model-messages-create', sandbox).remove();
                    }
                });
            });
        });
    });
};

module.exports = function (ctx, container, options, done) {
    options = options || {};
    var id = options.id;
    if (!id) {
        return render(ctx, container, options, {}, done);
    }
    Message.findOne(options, function (err, message) {
        if (err) {
            return done(err);
        }
        render(ctx, container, options, message, done);
    });
};



