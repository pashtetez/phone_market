(function () {

    'use strict';

    angular
        .module('app')
        .controller('otherSettingsController',['$scope', 'dataService','$http','$window',
		function ($scope, dataService, $http, $window){

            dataService.subscribe($scope, function somethingChanged() {
                $scope.checkboxModel =  dataService.messages.settings;
                if(!$scope.$$phase) {
                    $scope.$apply()
                }
            });

			$scope.close = function($event) {
			    //modal.style.display = "none";
			    $("#other-settings-view")[0].style.display = "none";
			};

			$scope.change_setting = function(set) {
			    var res = {}
			    res[set] = $scope.checkboxModel[set]
			    $http.post('/', JSON.stringify({"type" : "settings","data" : res}));
			};

            $scope.reset_db = function() {
			    $http.post('/', JSON.stringify({"type" : "reset_db","data" : ""}));
                $window.location.reload();
   			};


			$scope.checkboxModel = dataService.messages.settings;

		}]);

   

})();




