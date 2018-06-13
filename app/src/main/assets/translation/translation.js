(function () {
    'use strict';

    angular
        .module('app')
        .service('translationService', function($resource) {  
            this.getTranslation = function($scope, language) {
                var languageFilePath = 'translation/translation_' + language + '.json';
                $resource(languageFilePath).get(function (data) {
                    $scope.tr = data;
                });
            };
        })
        .controller('myController',['$scope', 'translationService','dataService',
		function ($scope, translationService, dataService){

		    dataService.subscribe($scope, function somethingChanged() {
                if(dataService.messages.settings.lang == "en"){
                    translationService.getTranslation($scope, 'en');
                } else {
                    translationService.getTranslation($scope, 'ru');
                }
                if(!$scope.$$phase) {
                    $scope.$apply()
                }
            },'settings');

		    $scope.trEN = function(){
                translationService.getTranslation($scope, 'en');
            };
            $scope.trRU = function(){
                translationService.getTranslation($scope, 'ru');
            };
            $scope.trEN();

            $scope.global = {}

            $scope.global.getTime = function(timestamp){
                return moment(new Date(timestamp*1000)).format("DD.MM.YYYY HH:mm:ss");
            };

		}]);

   

})();
