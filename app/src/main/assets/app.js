(function() {
    'use strict';

    var app = angular
        .module('app', ['ngRoute','ui.grid'])
        .config(config)
        .controller('MainCTRL', MainCTRL);

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
        $scope.favorites = JSON.parse(localStorage.getItem("favorites"));
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
        $scope.map_data = map_data;


        $scope.sc = {search:''};
        ///////////////////////
        /////////MENU//////////
        ///////////////////////
        $scope.menuroute = function(href) {
            $scope.closeNav();
            $location.path(href);
        };
        $scope.menuopened = false;
        $scope.openNav = function() {
            $scope.menuopened = true;
            document.getElementById("mySidenav").style.left = "0px";
            document.getElementById("hider").style.width = "100%";
            document.getElementById("hider").style.left = "210px";
        };
        $scope.closeNav = function() {
            $scope.menuopened = false;
            document.getElementById("mySidenav").style.left = "-210px";
            document.getElementById("hider").style.width = "0";
            document.getElementById("hider").style.left = "0px";
        };
        $scope.hideIt = function($event) {
            $event.stopPropagation();
            document.getElementById('actuality').style.display = 'none';
        };
        $scope.showIt = function($event) {
            document.getElementById('actuality').style.display = '';
        };
        $scope.triggerMenu = function() {
            if ($scope.menuopened)
                $scope.closeNav();
            else
                $scope.openNav();
        };
        $scope.route_main = function() {
            $scope.sc.search = '';
            $location.path('/shop');
        };

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
        };

        ///////////////////////
        // DATE POPUP FOOTER //
        ///////////////////////
        $scope.datenow = data['date'];
        $scope.dateget = function() {
            return 'В наличии на ' + $scope.datenow.replace(/;.*$/g,"")+ ' по складу '+$scope.storage_filename[$scope.storage]["name"];
        };

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
                        //alert(JSON.stringify($scope.itemlist[i]));
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
        };
        $scope.call_settings = function() {
            if ($scope.is_page_settings()){
                $window.history.back();
            }else{
                $location.path('/settings');
            }
        };
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
            $scope.favorites = data;
        };
        $scope.is_page_favorites = function() {
            return $location.path() == '/favorite';
        };
        $scope.toggle_favorites = function() {
            if ($scope.is_page_favorites()){
                $window.history.back();
            }else{
                $location.path('/favorite');
            }
        };
        /////////////////////
        // ROUTE FUNCTIONS //
        /////////////////////
        $scope.$on('$routeChangeSuccess', function($event, next, current) {
            $timeout(function() { $scope.refresh();}, 30);
        });
        $scope.routePartOne = function(x) {
            if (!((x.hasOwnProperty('subtiteles') && x['subtiteles'].length) || (x.hasOwnProperty('subitems') && x['subitems'].length))){
                $location.path('/item/'+x["\u041a\u043e\u0434"]);
            }else{
                var index = $scope.grid_options.data.indexOf(x);
                if($routeParams.page){
                     $location.path('/shop/'+$routeParams.page+'-'+index);
                }else{
                    $location.path('/shop/'+index);
                }
            }

        }
        $scope.backButtonPressed = function() {
            if ($scope.menuopened) {
                $scope.closeNav();
                return;
            }
            if ($scope.is_page_favorites() || ($location.path().indexOf('item')==-1) ) {
                $scope.sc.search = '';
            }
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
                return (x["\u0424\u043e\u0442\u043e"] != 'http://www.melt.com.ru/images/noimage.jpg') &&  (x["\u0424\u043e\u0442\u043e"] != null) ;
        };
        $scope.f_has_kod_propetry = function(x) {
            return x.hasOwnProperty("\u041a\u043e\u0434");
        };
        $scope.f_get_image_or_photo = function(x) {
            if (x.hasOwnProperty('image'))
                return x.image
            else if (x.hasOwnProperty("\u0424\u043e\u0442\u043e") && x["\u0424\u043e\u0442\u043e"])
                return x["\u0424\u043e\u0442\u043e"]
            else
                return "noimage";
        };
        $scope.f_show_title_or_nazvanie = function(x) {
            if (x.hasOwnProperty('title'))
                return x.title
            else
                return x["\u041d\u0430\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u0438\u0435"]
        };
        $scope.f_fillcolor = function(x) {
            if ($scope.favorites.indexOf(x["\u041a\u043e\u0434"]) == -1)
                return 'none';
            else
                return 'orange';
        };
        $scope.f_get_code = function(x) {
            if (x.hasOwnProperty("count"))
                return 'Код товара:'+x['\u041a\u043e\u0434'];
            else
                return ''
        };
        $scope.f_get_count = function(x) {
            if (x.hasOwnProperty("count"))
                return x['count'] + x['count_unit'];
            else
                return ''
        };
        $scope.f_get_price_and_count = function(x, n) {
            var cats = [1, 25000, 80000];
            if (x.hasOwnProperty("\u041a\u043e\u0434") && (x['price' + n] != 0))
                return "от\xa0" + Math.ceil(cats[n - 1] / x['price' + n]) + "шт-" + x['price' + n].split(".")[0] + 'р.';
            else
                return ''
        };

        ///////////////////////
        // TABLE DESCRIPTION //
        ///////////////////////
        $scope.sc.search = "";
        $scope.grid_options = {enableSorting: true, enableHorizontalScrollbar : 0, enableVerticalScrollbar: 2,
                enableFiltering: true,
                enableColumnMenus: false,
                showHeader: false,
                rowHeight:80,
                //rowTemplate: '<div ng-right-click="grid.appScope.fn_lists.right_click_network($event,row)" ng-click="row.isSelected=!row.isSelected;grid.appScope.fn_lists.on_row_select(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell data-target="myMenu" ></div>',
                columnDefs: [
                    { field: 'title',name: 'Значение',cellTemplate : "pages/shop_cell.html",filters:[
                        {
                            rawTerm: true,
                            term: '',
                            condition:function(searchTerm, cellValue, row){
                                if ($scope.favorites.indexOf(row.entity["\u041a\u043e\u0434"]) == -1) return false;
                                if ($scope.sc.search == '') return true;
                                if ((row.entity["\u041a\u043e\u0434"].indexOf($scope.sc.search) != -1) || (row.entity["\u041d\u0430\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u0438\u0435"].toLowerCase().indexOf($scope.sc.search.toLowerCase()) != -1)) {
                                    return true;
                                }
                                return false;
                            }
                        },{
                            rawTerm: true,
                            term: $scope.sc.search,
                            condition:function(searchTerm, cellValue, row){
                                if (!searchTerm) return true;
                                if ((row.entity["\u041a\u043e\u0434"].indexOf(searchTerm) != -1) || (row.entity["\u041d\u0430\u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u0438\u0435"].toLowerCase().indexOf(searchTerm.toLowerCase()) != -1)) {
                                    return true;
                                }
                                return false;
                            }
                        }]
                    }
                ],onRegisterApi : function (gridApi) {
                    $scope.gridApi = gridApi;
                }
            };
        $scope.refresh = function(){
            if (!$scope.is_page_favorites()) {
                var x = const_data;
                if ($scope.sc.search == '') {
                    if ($routeParams.page) {
                        var route = $routeParams.page.split('-');
                        for (var i in route) {
                            if (x[parseInt(route[i])].hasOwnProperty('subtiteles') && x[parseInt(route[i])]['subtiteles'].length)
                                x = x[parseInt(route[i])]['subtiteles'];
                            else if (x[parseInt(route[i])].hasOwnProperty('subitems') && x[parseInt(route[i])]['subitems'].length)
                                x = x[parseInt(route[i])]['subitems'];
                        }
                    }
                }
                $scope.grid_options.data = x;
            }else
                $scope.grid_options.data = $scope.itemlist;
            $scope.gridApi.core.refresh();
            $scope.gridApi.grid.columns[0].filters[1].term = $scope.sc.search;
            $scope.gridApi.grid.columns[0].filters[0].term = $scope.is_page_favorites()?"FAV":"";
            if ($location.path().indexOf('-')!=-1) {
                $scope.grid_options.rowHeight = 80;
            }else{
                if ($scope.sc.search != "") {
                    $scope.grid_options.rowHeight = 80;
                }else{
                    if ($scope.is_page_favorites()) {
                        $scope.grid_options.rowHeight = 80;
                    }else
                        $scope.grid_options.rowHeight = 65;
                }
            }

        };
        // $scope.refresh();
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
                templateUrl: 'pages/shop.html',
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