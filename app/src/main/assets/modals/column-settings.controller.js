(function () {
    'use strict';

    angular
        .module('app')
        .controller("NestedListsDemoController", function($scope,$http,dataService) {
            $scope.real_name_gsm = "GSM_T";
            $scope.local = {};
            $scope.local.data_name = "gsm";
            $scope.local.colu = dataService.messages.columnsview;

            dataService.subscribe($scope, function somethingChanged() {
                    $scope.local.colu = dataService.messages.columnsview;
                    $scope.change($scope.real_name_gsm, $scope.local.data_name);
                    if(!$scope.$$phase) {
                        $scope.$apply()
                    }
                }, "columnsview");

            $scope.close = function($event) {
			    //modal.style.display = "none";
			    $("#column-settings-view")[0].style.display = "none";
			};

            $scope.models = {
                selected: null,
                lists: {"A": [], "B": []}
            };

            $scope.change = function(table_name, data_name){
                $scope.real_name_gsm = table_name;
                $scope.local.data_name = data_name;
                $scope.local.current_data = $scope.local.colu[data_name];
                $scope.models.lists.A = [];
                $scope.models.lists.B = [];
                for (var key in $scope.local.current_data.order){
                    if($scope.local.current_data.has[$scope.local.current_data.order[key]])
                        $scope.models.lists.A.push({label: $scope.local.current_data.order[key]});
                    else
                        $scope.models.lists.B.push({label: $scope.local.current_data.order[key]});
                }
            };

            $scope.update = function(){
                var tmp = [];
                for (var key in $scope.models.lists.A){
                    $scope.local.current_data.has[$scope.models.lists.A[key].label] = true;
                    if (tmp.indexOf($scope.models.lists.A[key].label) == -1)
                        tmp.push($scope.models.lists.A[key].label);
                }
                for (var key in $scope.models.lists.B){
                    $scope.local.current_data.has[$scope.models.lists.B[key].label] = false;
                    if (tmp.indexOf($scope.models.lists.B[key].label) == -1)
                        tmp.push($scope.models.lists.B[key].label);
                }
                $scope.local.current_data.order = tmp;
                $http.post('/', JSON.stringify({"type" : "columnsview","data" : $scope.local.colu}));
            };

            $scope.allVisible = function(){
                $scope.models.lists.A = $scope.models.lists.A.concat($scope.models.lists.B);
                $scope.models.lists.B = [];
            };
            $scope.allInvisible = function(){
                $scope.models.lists.A = $scope.models.lists.A.concat($scope.models.lists.B);
                $scope.models.lists.B = $scope.models.lists.A;
                $scope.models.lists.A = [];
            };
        });
})();
