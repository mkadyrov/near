angular.module('app').factory('AppConfig', function () {

  var AppConfig = Parse.Object.extend('AppConfig', {
    initialize: function () {
      this.email = {};
      this.about = {};
    }
  }, {

    loadOne: function () {
      var query = new Parse.Query('AppConfig');
      return query.first();
    }
  });

  Object.defineProperty(AppConfig.prototype, 'email', {
    get: function () {
      return this.get('email');
    },
    set: function (val) {
      this.set('email', val);
    }
  });

  Object.defineProperty(AppConfig.prototype, 'about', {
    get: function () {
      return this.get('about');
    },
    set: function (val) {
      this.set('about', val);
    }
  });

  return AppConfig;

});