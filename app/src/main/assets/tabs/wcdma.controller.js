(function () {
    'use strict';

    angular
        .module('app')
        .controller('WcdmaController', WcdmaController);

    WcdmaController.$inject = ['$scope','$http' , '$rootScope','dataService'];
    function WcdmaController($scope,$http, $rootScope,dataService) {
            dataService.subscribe($scope, function somethingChanged() {
                $scope.wcdma_table =  dataService.messages.wcdma;
                $scope.wcdma_view = dataService.messages.columnsview.wcdma;
                if(!$scope.$$phase) {
                    $scope.$apply()
                }
            });
            $scope.wcdma_table =  dataService.messages.wcdma;
            $scope.wcdma_view = dataService.messages.columnsview.wcdma;

            $scope.reorder = function(col_name){
                if($scope.wcdma_view.sortorder == col_name)
                    $scope.wcdma_view.sortorder = '-'+ col_name;
                else
                    $scope.wcdma_view.sortorder = col_name;
            };
            $scope.process = function(column,item){
                if (column == 'time')return moment(new Date(item[column]*1000)).format("DD.MM.YYYY HH:mm:ss");
                return item[column]
            };
    }
})();