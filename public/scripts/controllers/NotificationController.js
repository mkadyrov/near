angular.module('app').controller('NotificationCtrl',
  function ($scope, $translate, Auth, Notification, Toast, NgMap, GeoCoder) {

    $scope.notification = new Notification;
    $scope.notification.radius = 10;
    $scope.notification.latitude = 0;
    $scope.notification.longitude = 0;
    $scope.notification.address = '';

    $scope.notifications = [];

    $scope.place = null;
    $scope.autocompleteOptions = {};
    $scope.circles = {};

    $scope.coords = [0, 0];

    var circle, map;

    Auth.ensureLoggedIn().then(function () {
      Notification.all().then(function (notifications) {
        $scope.notifications = notifications;
        $scope.$apply();
      });
    });

    $scope.$watch(function (scope) {
      return scope.place;
    }, function (value) {

      if (value) {

        var location = value.geometry.location;
        location = new google.maps.LatLng(location.lat(), location.lng());

        map.setCenter(location);
        map.setZoom(11);

        $scope.notification.latitude = location.lat();
        $scope.notification.longitude = location.lng();
        $scope.notification.radius = 10;
        $scope.notification.address = value.formatted_address;

        $scope.coords = [
          $scope.notification.latitude,
          $scope.notification.longitude
        ];
      }
    });

    $scope.canShowCircle = function () {
      return $scope.notification.radius > 0 &&
        $scope.notification.latitude > 0 &&
        $scope.notification.longitude > 0;
    };

    $scope.onChangeType = function () {

      if ($scope.notification.type === 'All') {

        $scope.place = null;

        $scope.notification.latitude = 0;
        $scope.notification.longitude = 0;
        $scope.notification.radius = 10;
        $scope.notification.address = '';

        $scope.coords = [0, 0];

        map.setCenter({
          lat: 0, lng: 0
        });

        map.setZoom(2);
      }
    };

    NgMap.getMap().then(function (objMap) {
      map = objMap;
      circle = objMap.shapes.circle;
    });

    $scope.onShapeDragEnd = function (ev) {

      var lat = ev.latLng.lat();
      var lng = ev.latLng.lng();

      $scope.notification.latitude = lat;
      $scope.notification.longitude = lng;
    };

    $scope.onShapeCenterChanged = function () {
      if (!circle) return;
      var lat = circle.center.lat();
      var lng = circle.center.lng();

      $scope.notification.latitude = lat;
      $scope.notification.longitude = lng;
    };

    $scope.onShapeRadiusChanged = function () {
      if (!circle) return;
      var radius = circle.radius;
      $scope.notification.radius = (radius / 1000);
    };

    $scope.onInputLocationChanged = function () {

      if ($scope.notification.latitude && $scope.notification.longitude && map) {

        map.setCenter(new google.maps.LatLng(
          $scope.notification.latitude,
          $scope.notification.longitude
        ));

        map.setZoom(11);

        $scope.coords = [$scope.notification.latitude, $scope.notification.longitude];
      }
    }

    $scope.onSubmit = function () {

      $scope.isSending = true;

      if ($scope.notification.type === 'Geo') {
        $scope.notification.bounds = circle.getBounds().toJSON();
      }

      Notification.save($scope.notification).then(function () {

        $translate('SENT').then(function (str) {
          Toast.show(str);
        });

        $scope.notifications.unshift($scope.notification);
        
        $scope.notification = new Notification;
        $scope.notification.radius = 10;
        $scope.notification.latitude = 0;
        $scope.notification.longitude = 0;
        $scope.notification.address = '';

        $scope.isSending = false;
        $scope.form.$setUntouched();
        $scope.form.$setPristine();
        $scope.$apply();
      }, function (error) {
        Toast.show(error.message);
        $scope.isSending = false;
        $scope.$apply();
      });
    }

  });