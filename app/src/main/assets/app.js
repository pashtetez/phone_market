//$('.radio').click(function(){
//    $(this).parent().find('.radio').removeClass('selected');
//    $(this).addClass('selected');
//});
//
//window.onclick = function(e) {
//    if($(e.target).hasClass('modal-all')){
//        $(e.target)[0].style.display = "none";
//    }
//};
(function() {
    'use strict';

    var app = angular
        .module('app', ['ngRoute', 'ngAnimate'])
        .config(config)
        .controller('MainCTRL', MainCTRL);

    //'ngRoute', 'ngCookies','ngResource','ngWebsocket','ngMaterial','scrollable-table','chart.js','dndLists', 'ngAnimate', 'ngSanitize', 'ngToast'])
    app.controller('mainController', function($scope) {
        $scope.pageClass = 'page-home';
    });

    app.controller('aboutController', function($scope) {
        $scope.pageClass = 'page-about';
    });

    app.controller('contactController', function($scope) {
        $scope.pageClass = 'page-contact';
    });

    function searchTree(element) {
        var r = [];
        r = r.concat(element['subitems']);
        console.log(element)
        if (element['subtiteles'].length) {
            for (var i = 0; i < element['subtiteles'].length; i++) {
                r = r.concat(searchTree(element['subtiteles'][i]));
            }
        }
        return r;
    }


    MainCTRL.$inject = ['$scope', '$http', '$rootScope', '$window', '$location', '$timeout', '$q', '$route','$routeParams'];

    function MainCTRL($scope, $http, $rootScope, $window, $location, $timeout, $q, $route, $routeParams) {
        if (!localStorage.getItem("favorites")) localStorage.setItem("favorites", JSON.stringify([]));
        $scope.favorites = false;
        $scope.pageClass = 'page-contact';
        $scope.results = [];
        $scope.item = const_data;
        $scope.itemlist = searchTree({
            'subitems': [],
            'subtiteles': $scope.item
        });
        $scope.limit = 50;
        $scope.inclimit = function(x) {
            $scope.limit = $scope.limit + 50;
        }
        $scope.map_data = map_data;
        $scope.menuroute = function(href) {
            $scope.closeNav();
            $location.path(href);
        }
        $scope.menuopened = false;
        $scope.openNav = function() {
            $scope.menuopened = true;
            document.getElementById("mySidenav").style.left = "0px";
            document.getElementById("hider").style.width = "100%";
            document.getElementById("hider").style.left = "210px";
        }
        $scope.closeNav = function() {
            $scope.menuopened = false;
            document.getElementById("mySidenav").style.left = "-210px";
            document.getElementById("hider").style.width = "0";
            document.getElementById("hider").style.left = "0px";
        }

        var fileName = "http://www.melt.com.ru/pdf/swap1.txt";
        $scope.records = [
            "Alfreds Futterkiste",
            "Berglunds snabbköp",
            "Centro comercial Moctezuma",
            "Ernst Handel",
        ]



        $scope.records[0] = window.location.href;
        $scope.datenow = data['date'];
        $scope.upd = function() {
            var docHeadObj = document.getElementsByTagName("head")[0];
            var dynamicScript = document.createElement("script");
            dynamicScript.type = "text/javascript";
            dynamicScript.id = "datascript"
            if (window.location.href.indexOf('android_asset') == -1)
                dynamicScript.src = "my_live_loading_script.js";
            else
                dynamicScript.src = "data.js?t=" + new Date().getTime() + "data";
            $scope.datenow = data['date'];
            dynamicScript.onload = function() {
                for (var i = 0; i < $scope.itemlist.length; i++) {
                    $scope.itemlist[i]['price1'] = data['items'][$scope.itemlist[i][
                        ["\u041a\u043e\u0434"]
                    ]]['price1'];
                    $scope.itemlist[i]['price2'] = data['items'][$scope.itemlist[i][
                        ["\u041a\u043e\u0434"]
                    ]]['price2'];
                    $scope.itemlist[i]['price3'] = data['items'][$scope.itemlist[i][
                        ["\u041a\u043e\u0434"]
                    ]]['price3'];
                    $scope.itemlist[i]['count'] = data['items'][$scope.itemlist[i][
                        ["\u041a\u043e\u0434"]
                    ]]['count'];
                    $scope.itemlist[i]['count_unit'] = data['items'][$scope.itemlist[i][
                        ["\u041a\u043e\u0434"]
                    ]]['count_unit'];
                    $scope.itemlist[i]['currency_name'] = data['items'][$scope.itemlist[i][
                        ["\u041a\u043e\u0434"]
                    ]]['currency_name'];
                }
                //                           $scope.search = data['categories'][0]['group_code'];
                console.log(data['items']);
                $scope.map_data = map_data;
                console.log($scope.map_data);
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            };
            document.getElementById('datascript').remove();
            docHeadObj.appendChild(dynamicScript);
        };
        $scope.upd();






        $scope.items = function() {
            if ($scope.search == '' && $scope.itemone == null && !$scope.favorites)
            return $scope.item;
            else{
                console.log('qwdasdadwaAAAAAAAAAAAAA');
                return $scope.itemlist;
            }
        }
        $scope.addfav = function($event, x) {
            $event.stopPropagation();
            //    $event.preventDefault();
            data = JSON.parse(localStorage.getItem("favorites"));
            if (data.indexOf(x["\u041a\u043e\u0434"]) != -1)
                data.splice(data.indexOf(x["\u041a\u043e\u0434"]), 1);
            else
                data.push(x["\u041a\u043e\u0434"]);
            localStorage.setItem("favorites", JSON.stringify(data));
        }
        $scope.parent = [];
        $scope.ready = true;
        $scope.$on('$routeChangeSuccess', function($event, next, current) {
            $timeout(function() {
                $scope.pageClass = 'page-contact';
                $scope.ready = true;
            }, 300);
        });

        $scope.triggerMenu = function() {
            if ($scope.menuopened)
                $scope.closeNav();
            else
                $scope.openNav();
        }

        $scope.help = function(x) {
            $scope.pageClass = 'page-about';
            $scope.limit = 50;
            $scope.xx = x;
            console.log($scope.xx);
            $timeout(function() {
                document.getElementById("changeitem").click();
            }, 10);
        }



        $scope.changeitem = function() {

            if ($scope.ready) {
                var x = $scope.xx;
                $scope.parent.push($scope.item);
                if (x.hasOwnProperty('subtiteles') && x['subtiteles'].length)
                    $scope.item = x['subtiteles']
                else if (x.hasOwnProperty('subitems') && x['subitems'].length)
                    $scope.item = x['subitems']
                else
                    $scope.itemone = x
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
                $scope.ready = false;
                $location.path('/shop/'+($routeParams.page+1));
                $route.reload();
                console.log($routeParams.page);
              //  $scope.search = $routeParams.page;
            }
        }
        $scope.javaScriptCallAngular = function() {
            if ($scope.menuopened) {
                $scope.closeNav();
                return;
            }

            if ($scope.parent.length != 0) {
                $scope.item = $scope.parent.pop();
                if ($scope.itemone == null)
                    $scope.search = '';
                $scope.itemone = null;
                $scope.limit = 50;
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
                $location.path('/shop/1');
               // $scope.search = $routeParams.page;
            }
        };
        $scope.itemone = null;
        $scope.itemonelist = function(itemone) {
            console.log(itemone);
            if ($scope.itemone == null) return [];
            //                        for(var i=0; i < itemone.keys; i++){
            //                           console.log(itemone.children[i]);
            //                        }
            var keys = Object.keys(itemone);
            keys.splice(keys.indexOf("$$hashKey"), 1);
            keys.splice(keys.indexOf("empty_header"), 1);
            keys.splice(keys.indexOf("\u0426\u0435\u043d\u04303"), 1);
            keys.splice(keys.indexOf("\u0421\u043a\u043b\u0430\u0434"), 1);
            return keys;
        }

        $scope.search = '';
        $scope.searchfunc = function(item) {
            if ($scope.search == '' && $scope.itemone == null && !$scope.favorites) return true;
            if ((item["\u041a\u043e\u0434"].indexOf($scope.search) != -1) || (item["\u041d\u0430\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u0438\u0435"].toLowerCase().indexOf($scope.search.toLowerCase()) != -1)) {
                if ($scope.favorites && (JSON.parse(localStorage.getItem("favorites")).indexOf(item["\u041a\u043e\u0434"]) == -1)) return false;
                return true;
            }
            return false;
        };


        $scope.dateget = function() {
            return 'В наличии на ' + $scope.datenow.replace(/;.*$/g,"")+ ' по складу Москва';
        }
        $scope.hideIt = function($event) {
            $event.stopPropagation();
            document.getElementById('actuality').style.display = 'none'
        }

        ////////////////////
        // ITEM FUNCTIONS //
        ////////////////////
        $scope.f_not_empty_image = function(x) {
            if (x.hasOwnProperty('image'))
                return x.image != '';
            else
                return x["\u0424\u043e\u0442\u043e"] != 'http://www.melt.com.ru/images/noimage.jpg';
        }
        $scope.f_has_kod_propetry = function(x) {
            return x.hasOwnProperty("\u041a\u043e\u0434");
        }
        $scope.f_get_image_or_photo = function(x) {
            if (x.hasOwnProperty('image'))
                return x.image
            else
                return x["\u0424\u043e\u0442\u043e"]
        }
        $scope.f_show_title_or_nazvanie = function(x) {
            if (x.hasOwnProperty('title'))
                return x.title
            else
                return x["\u041d\u0430\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u0438\u0435"]
        }
        $scope.f_fillcolor = function(x) {
            if (JSON.parse(localStorage.getItem("favorites")).indexOf(x["\u041a\u043e\u0434"]) == -1)
                return 'none';
            else
                return 'orange';
        }
        $scope.f_get_code = function(x) {
            if (x.hasOwnProperty("count"))
                return 'Код товара:'+x['\u041a\u043e\u0434'];
            else
                return ''
        }
        $scope.f_get_count = function(x) {
            if (x.hasOwnProperty("count"))
                return x['count'] + x['count_unit'];
            else
                return ''
        }
        $scope.f_get_price = function(x, n) {
            if (x.hasOwnProperty("\u041a\u043e\u0434"))
                return x['price' + n] + ' руб.'
            else
                return ''
        }
        $scope.f_get_price_count = function(x, n) {
            var cats = [1, 25000, 80000];
            if (x.hasOwnProperty("\u041a\u043e\u0434") && (x['price' + n] != 0))
                return "(от\xa0" + Math.ceil(cats[n - 1] / x['price' + n]) + "шт)";
            else
                return ''
        }
    }

    config.$inject = ['$routeProvider', '$locationProvider'];

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/shop/:page', {
                templateUrl: 'index1.html',
                controllerAs: 'vm'
            })
            .when('/favorite', {
                templateUrl: 'index1.html',
                controllerAs: 'vm'
            })
            .when('/item/:code', {
                templateUrl: 'index1.html',
                controllerAs: 'vm'
            })
            .when('/', {
                templateUrl: 'index1.html',
                controllerAs: 'vm'
            })
            .when('/q', {
                templateUrl: 'index2.html',
                controllerAs: 'vm'
            })
            .when('/:name*', {
                templateUrl: function(urlattr) {
                    return '/sitemap/' + urlattr.name;
                },
                controllerAs: 'vm'
            });
    }
})();