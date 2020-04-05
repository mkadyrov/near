angular.module('app').controller('AppConfigCtrl',
function ($scope, Toast, $mdDialog, $translate, AppConfig, Auth) {

    Auth.ensureLoggedIn().then(function () {
        AppConfig.loadOne().then(function (appConfig) {
            $scope.obj = appConfig || new AppConfig;
            $scope.$apply();
        });
    });

    $scope.onSave = function () {

        $scope.isSaving = true;

        $scope.obj.save().then(function () {
            $translate('SAVED').then(function (str) {
                Toast.show(str);
            });
            $mdDialog.hide();
            $scope.isSaving = false;
            $scope.$apply();
        }, function (error) {
            Toast.show(error.message);
            $scope.isSaving = false;
            $scope.$apply();
        });

    };

    $scope.hide = function () {
        $mdDialog.cancel();
    };

});