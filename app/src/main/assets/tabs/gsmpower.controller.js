(function () {
    'use strict';

    angular
        .module('app')
        .controller('GsmPowerController', GsmPowerController);

    GsmPowerController.$inject = ['$scope','$http' , '$rootScope','dataService'];
    function GsmPowerController($scope,$http, $rootScope,dataService) {
            console.log("asdasd    ");
            dataService.subscribe($scope, function somethingChanged() {

                var mytable = [];
                mytable = dataService.messages.gsmpower;

                mytable.sort(function(a, b){
                    return a.arfcn - b.arfcn;
                });
                mytable = mytable.filter(function(number) {
                    return number.arfcn < 125;
                });
                mytable = mytable.filter(function(number) {
                    return number.scan_id ==16;
                });
                $scope.labels = [];
                $scope.data = [];
                $scope.chartcolors = [];
                $scope.mytable = mytable;
                mytable.forEach(function(item, i, mytable) {
                    if(item['rssi'] > -85)
                        $scope.chartcolors.push("#"+"FF"+"00"+"00");
                    else
                        $scope.chartcolors.push("#"+"00"+"00"+"FF");
                    $scope.labels.push(item['arfcn']);
                    $scope.data.push(-110-item['rssi']);
                });
                if(!$scope.$$phase) {
                    $scope.$apply()
                }
            });

            var mytable = []
            mytable = dataService.messages.gsmpower;

            $scope.onHover = function (points) {
              if (points.length > 0) {
                  console.log('Point', points);
                  $scope.chart=points[0]._chart;
                  points[0]._chart.update();
                  var a = Object.keys(points[0]._chart.controller.config.data.datasets[0]._meta);
                  console.log(a);
                  points[0]._chart.controller.config.data.datasets[0]._meta[a].data[points[0]._index+1]._model.backgroundColor = "rgb(160,160,160)";
                  points[0]._chart.controller.config.data.datasets[0]._meta[a].data[points[0]._index-1]._model.backgroundColor = "rgb(160,160,160)";
                  points[0]._chart.controller.config.data.datasets[0]._meta[a].data[points[0]._index]._model.backgroundColor = "rgb(160,160,160)";
              } else {
              $scope.chart.update();
                console.log('No point');
              }
            };


            $scope.chartoptions = {
                    scales: {
                        yAxes: [{

                            ticks: {
                                max: 0,
                                min: -35,
                                stepSize: 5,
                                reverse: true,
                                callback: function(value, index, values) {
                                    return -110 - value;
                                }
                            }
                        }],
                        xAxes: [{
                            categoryPercentage: 1.0,
                            barPercentage: 1.2
                        }]
                    },
                    tooltips: {
                        callbacks: {
                            labelColor: function(tooltipItem, chart) {
                                return {
                                    borderColor: 'rgb(255, 0, 0)',
                                    backgroundColor: 'rgb(255, 0, 0)'
                                }
                            },
                            label:function(tooltipItem, data){
                                return (-110 - tooltipItem.yLabel).toString()+'dBm';
                            },
                            title:function(tooltipItem, data){
                                return "ARFCN: "+ tooltipItem[0].xLabel;
                            }
                        }
                    }

                };
            if(mytable){
                mytable.sort(function(a, b){
                    return a.arfcn - b.arfcn;
                });
                mytable = mytable.filter(function(number) {
                    return number.arfcn < 125;
                });
                mytable = mytable.filter(function(number) {
                    return number.scan_id ==16;
                });
                $scope.labels = [];
                $scope.data = [];
                $scope.chartcolors = [];
                mytable.forEach(function(item, i, mytable) {
                    if(item['rssi'] > -85)
                        $scope.chartcolors.push("#"+"FF"+"00"+"00");
                    else
                        $scope.chartcolors.push("#"+"00"+"00"+"FF");
                    $scope.labels.push(item['arfcn']);
                    $scope.data.push(-110-item['rssi']);
                });
            }

    }

})();