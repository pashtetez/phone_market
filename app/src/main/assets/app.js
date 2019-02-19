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
        if (!localStorage.getItem("storage")) localStorage.setItem("storage", JSON.stringify("moscow"));
        $scope.storage = JSON.parse(localStorage.getItem("storage"));
        $scope.storage_filename = {"moscow":{"filename":"moscow_live_data.js","name":"Москва"},"piter":{"filename":"piter_live_data.js","name":"Санкт-Петербург"}};
        $scope.pageClass = 'page-contact';
        $scope.results = [];
        $scope.item = const_data;
        $scope.itemlist = searchTree({
            'subitems': [],
            'subtiteles': const_data
        });
        $scope.limit = 50;
        $scope.inclimit = function(x) {
            $scope.limit = $scope.limit + 50;
        }
        $scope.map_data = map_data;

        ///////////////////////
        /////////MENU//////////
        ///////////////////////
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
        $scope.hideIt = function($event) {
            $event.stopPropagation();
            document.getElementById('actuality').style.display = 'none';
        }
        $scope.showIt = function($event) {
            document.getElementById('actuality').style.display = '';
        }
        $scope.triggerMenu = function() {
            if ($scope.menuopened)
                $scope.closeNav();
            else
                $scope.openNav();
        }
        $scope.route_main = function() {
            $scope.search = '';
            $location.path('/shop');
        }

        ////////////////////
        // STORAGE SELECT //
        ////////////////////
        $scope.change_store = function(){
            if($scope.storage == "moscow"){
                $scope.storage = "piter";
            }else{
                $scope.storage = "moscow";
            }
            localStorage.setItem("storage", JSON.stringify($scope.storage));
            $scope.upd();
            $scope.itemlist = searchTree({
                'subitems': [],
                'subtiteles': const_data
            });
        }

        ///////////////////////
        // DATE POPUP FOOTER //
        ///////////////////////
        $scope.datenow = data['date'];
        $scope.dateget = function() {
            return 'В наличии на ' + $scope.datenow.replace(/;.*$/g,"")+ ' по складу '+$scope.storage_filename[$scope.storage]["name"];
        }

        /////////////////////////
        // SCOPE INIT FUNCTION //
        /////////////////////////
        $scope.upd = function() {
            var docHeadObj = document.getElementsByTagName("head")[0];
            var dynamicScript = document.createElement("script");
            dynamicScript.type = "text/javascript";
            dynamicScript.id = "datascript"
            if (window.location.href.indexOf('android_asset') == -1)
                dynamicScript.src = $scope.storage_filename[$scope.storage]["filename"];
            else
                dynamicScript.src = "data.js?t=" + new Date().getTime() + "data";
            $scope.datenow = data['date'];
            dynamicScript.onload = function() {
                for (var i = 0; i < $scope.itemlist.length; i++) {
                    try{
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
                    }catch(e){
                        alert(JSON.stringify($scope.itemlist[i]));
                    }
                }
                $scope.map_data = map_data;
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
            };
            document.getElementById('datascript').remove();
            docHeadObj.appendChild(dynamicScript);
            $scope.showIt();
        };
        $scope.upd();

        //////////////
        // SETTINGS //
        //////////////
        $scope.is_page_settings = function() {
            return $location.path() == '/settings';
        }
        $scope.call_settings = function() {
            if ($scope.is_page_settings()){
                $window.history.back();
            }else{
                $location.path('/settings');
            }
        }

        //////////////
        // FAVORITE //
        //////////////
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
        $scope.favoritelist = function() {
            return $scope.itemlist;
        }
        $scope.is_page_favorites = function() {
            return $location.path() == '/favorite';
        }
        $scope.toggle_favorites = function() {
            if ($scope.is_page_favorites()){
                $window.history.back();
            }else{
                $location.path('/favorite');
            }
        }
        $scope.searchfuncfav = function(item) {
            if (JSON.parse(localStorage.getItem("favorites")).indexOf(item["\u041a\u043e\u0434"]) == -1) return false;
            if ($scope.search == '') return true;
            if ((item["\u041a\u043e\u0434"].indexOf($scope.search) != -1) || (item["\u041d\u0430\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u0438\u0435"].toLowerCase().indexOf($scope.search.toLowerCase()) != -1)) {
                return true;
            }
            return false;
        };

        /////////////////
        // SEACRH LOGIC//
        /////////////////
        $scope.search = '';
        $scope.searchfuncshop = function(item) {
            if ($scope.search == '') return true;
            if ((item["\u041a\u043e\u0434"].indexOf($scope.search) != -1) || (item["\u041d\u0430\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u0438\u0435"].toLowerCase().indexOf($scope.search.toLowerCase()) != -1)) {
                return true;
            }
            return false;
        };

        /////////////////////////
        // SHOP DATA FUNCTIONS //
        /////////////////////////
        $scope.shopitems = function() {
            var x = const_data;
            if ($scope.search == ''){
                if ($routeParams.page){
                    var route = $routeParams.page.split('-');
                    for (var i in route){
                        if (x[parseInt(route[i])].hasOwnProperty('subtiteles') && x[parseInt(route[i])]['subtiteles'].length)
                            x = x[parseInt(route[i])]['subtiteles'];
                        else if (x[parseInt(route[i])].hasOwnProperty('subitems') && x[parseInt(route[i])]['subitems'].length)
                            x = x[parseInt(route[i])]['subitems'];
                    }
                }
            }else return $scope.itemlist;
            return x;
        }

        /////////////////////
        // ROUTE FUNCTIONS //
        /////////////////////
        $scope.ready = true;
        $scope.$on('$routeChangeSuccess', function($event, next, current) {
            $timeout(function() {
                $scope.pageClass = 'page-contact';
                $scope.ready = true;
            }, 300);
        });
        $scope.routePartOne = function(x) {
            $scope.pageClass = 'page-about';
            $scope.limit = 50;
            $scope.routetmp = x;
            $timeout(function() {
                document.getElementById("routePartTwo").click();
            }, 10);
        }
        $scope.routePartTwo = function() {
            if ($scope.ready) {
                var x = $scope.routetmp;
                if (!((x.hasOwnProperty('subtiteles') && x['subtiteles'].length) || (x.hasOwnProperty('subitems') && x['subitems'].length))){
                    $location.path('/item/'+x["\u041a\u043e\u0434"]);
                }else{
                    if($routeParams.page){
                         $location.path('/shop/'+$routeParams.page+'-'+$scope.shopitems().indexOf(x));
                    }else{
                        $location.path('/shop/'+$scope.shopitems().indexOf(x));
                    }
                }
                if (!$scope.$$phase) {
                    $scope.$apply()
                }
                $scope.ready = false;
                $route.reload();
            }
        }
        $scope.backButtonPressed = function() {
            if ($scope.menuopened) {
                $scope.closeNav();
                return;
            }
            $scope.limit = 50;
            //if ($scope.itemone == null)
            //    $scope.search = '';
            $window.history.back();
            if(!$scope.$$phase)$scope.$apply();
        };

        ////////////////////////
        // ONE ITEM FUNCTIONS //
        ////////////////////////
        $scope.currentItem = null;
        $scope.getCurrentItemsKeys = function() {
            if($routeParams.code){
                 for (var i = 0; i < $scope.itemlist.length; i++) {
                    if($scope.itemlist[i]["\u041a\u043e\u0434"] ==  $routeParams.code){
                        $scope.currentItem = $scope.itemlist[i];
                        continue;
                    }
                 }
            }
            var keys = Object.keys($scope.currentItem);
            keys.splice(keys.indexOf("$$hashKey"), 1);
            keys.splice(keys.indexOf("empty_header"), 1);
            keys.splice(keys.indexOf("\u0426\u0435\u043d\u04303"), 1);
            keys.splice(keys.indexOf("\u0421\u043a\u043b\u0430\u0434"), 1);
            return keys;
        }

        ////////////////////
        // SHOP FUNCTIONS //
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
            if (x.hasOwnProperty("\u041a\u043e\u0434")&& (x['price' + n] != 0))
                return x['price' + n].split(".")[0] + 'р.'
            else
                return ''
        }
        $scope.f_get_price_count = function(x, n) {
            var cats = [1, 25000, 80000];
            if (x.hasOwnProperty("\u041a\u043e\u0434") && (x['price' + n] != 0))
                return "от\xa0" + Math.ceil(cats[n - 1] / x['price' + n]) + "шт-";
            else
                return ''
        }
    }

    config.$inject = ['$routeProvider', '$locationProvider'];

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/shop/:page', {
                templateUrl: 'pages/shop.html',
                controllerAs: 'vm'
            })
            .when('/shop/', {
                templateUrl: 'pages/shop.html',
                controllerAs: 'vm'
            })
            .when('/favorite', {
                templateUrl: 'pages/favorite.html',
                controllerAs: 'vm'
            })
            .when('/item/:code', {
                templateUrl: 'pages/item.html',
                controllerAs: 'vm'
            })
            .when('/settings', {
                templateUrl: 'pages/settings.html',
                controllerAs: 'vm'
            })
            .when('/', {
                templateUrl: 'pages/shop.html',
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