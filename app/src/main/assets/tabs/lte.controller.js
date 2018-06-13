(function () {
    'use strict';

    angular
        .module('app')
        .controller('LteController', LteController);

    LteController.$inject = ['$scope','$http' , '$rootScope','dataService'];
    function LteController($scope,$http, $rootScope,dataService) {
            dataService.subscribe($scope, function somethingChanged() {
                $scope.lte_table =  dataService.messages.lte;
                $scope.lte_view = dataService.messages.columnsview.lte;
                if(!$scope.$$phase) {
                    $scope.$apply()
                }
            });
            $scope.lte_table =  dataService.messages.lte;
            $scope.lte_view = dataService.messages.columnsview.lte;

            $scope.reorder = function(col_name){
                if($scope.lte_view.sortorder == col_name)
                    $scope.lte_view.sortorder = '-'+ col_name;
                else
                    $scope.lte_view.sortorder = col_name;
            };
            $scope.process = function(column,item){
                if (column == 'time')return moment(new Date(item[column]*1000)).format("DD.MM.YYYY HH:mm:ss");
                if (dataService.messages.settings.is_hex){
                    if (column == 'tac')return "0x"+parseInt(item[column]).toString(16);
                    if (column == 'pcid')return "0x"+parseInt(item[column]).toString(16);
                    if (column == 'cid')return "0x"+parseInt(item[column]).toString(16);
                    }
                return item[column]
            };
    }
})();