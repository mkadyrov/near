angular.module('app').factory('Notification', function () {

    var Notification = Parse.Object.extend('Notification', {
        initialize: function () {
            this.type = 'Geo';
        }
    }, {

        all: function () {

            var query = new Parse.Query(this);
            query.descending('createdAt');

            return query.find()

        },

        save: function (obj) {
            return obj.save()
        }
    });

    Object.defineProperty(Notification.prototype, 'message', {
        get: function () {
            return this.get('message');
        },
        set: function (val) {
            this.set('message', val);
        }
    });

    Object.defineProperty(Notification.prototype, 'bounds', {
        get: function () {
            return this.get('bounds');
        },
        set: function (val) {
            this.set('bounds', val);
        }
    });

    Object.defineProperty(Notification.prototype, 'radius', {
        get: function () {
            return this.get('radius');
        },
        set: function (val) {
            this.set('radius', val);
        }
    });

    Object.defineProperty(Notification.prototype, 'address', {
        get: function () {
            return this.get('address');
        },
        set: function (val) {
            this.set('address', val);
        }
    });

    Object.defineProperty(Notification.prototype, 'latitude', {
        get: function () {
            return this.get('latitude');
        },
        set: function (val) {
            this.set('latitude', val);
        }
    });

    Object.defineProperty(Notification.prototype, 'longitude', {
        get: function () {
            return this.get('longitude');
        },
        set: function (val) {
            this.set('longitude', val);
        }
    });

    Object.defineProperty(Notification.prototype, 'type', {
        get: function () {
            return this.get('type');
        },
        set: function (val) {
            this.set('type', val);
        }
    });

    return Notification;

});