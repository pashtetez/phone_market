(function () {
    'use strict';

    angular
        .module('app')
        .controller('sepModem',['$scope', 'dataService','$http',
		function ($scope, dataService, $http){
            $scope.bands_names = ['GSM 900','GSM 1800', 'UMTS B1 2100', 'UMTS B3 1800', 'UMTS B5 850', 'UMTS B8 900', 'LTE B1 2100 (FDD)', 'LTE B3 1800 (FDD)', 'LTE B7 2600 (FDD)', 'LTE B8 900 (FDD)', 'LTE B20 800 (FDD)', 'LTE B38 2600 (TDD)', 'LTE B40 2300 (TDD)'];
            $scope.standards_names = ['GSM', 'WCDMA', 'LTE'];

            dataService.subscribe($scope, function somethingChanged() {
                for (modem in dataService.messages.modems){
                    if (modem.id == $scope.global.currentModem.id){
                        $scope.global.currentModem.task = modem.task;
                    }
                }
                if(!$scope.$$phase) {
                    $scope.$apply()
                }
            },'modems');

            $scope.close = function($event) {
			    $("#modem-view")[0].style.display = "none";
			};

            $scope.showScanDetail = function($event) {
                $scope.global.currentModemID = $scope.global.currentModem.id;
                $('#detail-choose-view')[0].style.display = 'block';
            };
			$scope.reqStatus = function($event) {
                $http.post('/', JSON.stringify({"type" : "status", "modem_id" : $scope.global.currentModem.id}));
            };
            $scope.reqScan = function($event) {
                $http.post('/', JSON.stringify({"type" : "scan", "modem_id" : $scope.global.currentModem.id}));
            };
            $scope.reqLock = function($event) {
                var bands = [];
                if ($scope.global.currentModem.lock_type == 'bands'){
                    for (var a in $scope.bands_names) {
                        if($scope.global.currentModem[a])
                            bands.push($scope.bands_names[a]);
                    }
                }else{
                    for (var a in $scope.standards_names) {
                        if($scope.global.currentModem[a])
                            bands.push($scope.standards_names[a]);
                    }
                }
                $http.post('/', JSON.stringify({"type" : "lock", "lock_type": $scope.global.currentModem.lock_type, 'lock_data': bands, "modem_id" : $scope.global.currentModem.id}));
            };
		}]);
})();
