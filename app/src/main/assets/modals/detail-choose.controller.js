(function () {
    'use strict';

    angular
        .module('app')
        .controller("detailChooseController", function($scope,$http) {
            $scope.import = function($event) {
                    $http.get('/scanresarfcns').success(function (data, status, headers, config)  {

		            	data.forEach(function(name) {
                        if ($scope.arfcn.arfcns.indexOf(name) == -1 )
                            $scope.arfcn.arfcns.push(name);
                        });
                        $scope.arfcn.arfcns = $scope.arfcn.arfcns.sort(function(a, b) {return a - b;});
		        	});

            };

            $scope.close = function($event) {
			    //modal.style.display = "none";
			    $("#detail-choose-view")[0].style.display = "none";
			};
			$scope.arfcn = {}
            $scope.arfcn.arfcn = ""
			$scope.arfcn.arfcns = []

			$scope.addArfcn = function() {
			    $scope.arfcn.arfcn = $scope.arfcn.arfcn.replace(/ /g,"")
			    if ($scope.arfcn.arfcn.indexOf(",")!=-1){
                    var arr = $scope.arfcn.arfcn.split(",");
                    arr.forEach(function(name) {
                        if ($scope.arfcn.arfcns.indexOf(name) == -1 )
                            $scope.arfcn.arfcns.push(parseInt(name,10));
                    });
			    }else{
                    if ($scope.arfcn.arfcns.indexOf($scope.arfcn.arfcn) == -1 )
                        $scope.arfcn.arfcns.push(parseInt($scope.arfcn.arfcn,10));
                }

			    $scope.arfcn.arfcn = "";
			    $scope.arfcn.arfcns = $scope.arfcn.arfcns.sort(function(a, b) {return a - b;});
			};

			$scope.removeArfcn = function(item) {
			    $scope.arfcn.arfcns.splice($scope.arfcn.arfcns.indexOf(item),1);
			};

			$scope.scan_detail = function() {
			    if($scope.global.currentModemID)
                    $http.post('/', JSON.stringify({"type" : "scan_detail", "arfcns": $scope.arfcn.arfcns, "modem_id" : $scope.global.currentModemID }));
                else
                    $http.post('/', JSON.stringify({"type" : "scan_detail", "arfcns": $scope.arfcn.arfcns}));
            };
        });
})();
