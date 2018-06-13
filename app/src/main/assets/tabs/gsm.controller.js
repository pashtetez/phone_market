(function () {
    'use strict';

    angular
        .module('app')
        .controller('GsmController', GsmController);

    GsmController.$inject = ['$scope','$http' , '$rootScope','dataService'];
    function GsmController($scope,$http, $rootScope, dataService) {
            dataService.subscribe($scope, function somethingChanged() {
                $scope.gsm_table =  dataService.messages.gsm;
                $scope.gsm_view = dataService.messages.columnsview.gsm;
                if(!$scope.$$phase) {
                    $scope.$apply()
                }
            });
            $scope.gsm_table =  dataService.messages.gsm;
            $scope.gsm_view = dataService.messages.columnsview.gsm;

            $scope.reorder = function(col_name){
                if($scope.gsm_view.sortorder == col_name)
                    $scope.gsm_view.sortorder = '-'+ col_name;
                else
                    $scope.gsm_view.sortorder = col_name;
            };
            $scope.process = function(column,item){
                if (column == 'time')return moment(new Date(item[column]*1000)).format("DD.MM.YYYY HH:mm:ss");
                if (dataService.messages.settings.is_hex){
                    if (column == 'lac')return "0x"+parseInt(item[column]).toString(16);
                    if (column == 'cid')return "0x"+parseInt(item[column]).toString(16);
                }
                return item[column]
            };
    }
})();