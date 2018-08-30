(function () {
	function joinTables(left, right, leftKey, rightKey) {

	    rightKey = rightKey || leftKey;

	    var lookupTable = {};
	    var resultTable = [];
	    var forEachLeftRecord = function (currentRecord) {
	        lookupTable[currentRecord[leftKey]] = currentRecord;
	    };

	    var forEachRightRecord = function (currentRecord) {
	        var joinedRecord = _.clone(lookupTable[currentRecord[rightKey]]); // using lodash clone
	        _.extend(joinedRecord, currentRecord); // using lodash extend
	        resultTable.push(joinedRecord);
	    };

	    left.forEach(forEachLeftRecord);
	    right.forEach(forEachRightRecord);

	    return resultTable;
	}

	function joinTablesLeft(left, right, leftKey, rightKey, newfield) {

	    var lookupTable = {};
	    var resultTable = [];
	    var forEachRightRecord = function (currentRecord) {
	        lookupTable[currentRecord[rightKey]] = currentRecord;
	    };
	    var forEachLeftRecord = function (currentRecord) {
	    	var joinedRecord = _.clone(currentRecord);
	    	joinedRecord[newfield] = lookupTable[currentRecord[leftKey]];
	        resultTable.push(joinedRecord);
	    };

	    right.forEach(forEachRightRecord);
	    left.forEach(forEachLeftRecord);

	    return resultTable;
	}
	function joinTablesManyToMany(left, right, leftKey, rightKey, newfield) {

	    var lookupTable = {};
	    var resultTable = [];
	    var forEachRightRecord = function (currentRecord) {
	    	currentRecord[rightKey].forEach(function (some_id) {
	    		if(typeof lookupTable[some_id] === 'undefined') {
	    			lookupTable[some_id] = [];
	    		}
	    		lookupTable[some_id].push(currentRecord);
	    	});
	    };
	    var forEachLeftRecord = function (currentRecord) {
	    	var joinedRecord = _.clone(currentRecord);
	    	joinedRecord[newfield] = lookupTable[currentRecord[leftKey]];
	        resultTable.push(joinedRecord);
	    };

	    right.forEach(forEachRightRecord);
	    left.forEach(forEachLeftRecord);

	    return resultTable;
	}

	function addUplinkDownlink(cellList) {

	    var forEach = function (currentRecord) {
	    	if (typeof currentRecord['cell_profile'] !== 'undefined') {
		        var arfc = currentRecord['cell_profile']['arfcn'];
		        var standard = currentRecord['cell_profile']['standard'];
		        var uplink = "";
		        var downlink = "";
		        if (standard === "850"){
		            uplink = (arfc-128)*0.2+824.2;
		            downlink = (arfc-128)*0.2+824.2+45;
		        }else if (standard === "900"){
		            if (arfc<500){
		                uplink = arfc*0.2+890;
		                downlink = arfc*0.2+890+45;
		            }else{
		                uplink = (arfc-1024)*0.2+890;
		                downlink = (arfc-1024)*0.2+890+45;
		            }
		        }else if (standard === "1800"){
		            uplink = (arfc-512)*0.2+1710.2;
		            downlink = (arfc-512)*0.2+1710.2+95;
		        }else if (standard === "1900"){
		            uplink = (arfc-512)*0.2+1850.2;
		            downlink = (arfc-512)*0.2+1850.2+80;
		        }   
		        currentRecord['uplink'] = uplink;
		        currentRecord['downlink'] = downlink;
		    }
	    };

	    cellList.forEach(forEach);
	}


    'use strict';

    angular
		.module('app')
		.factory('dataService', dataService);

		dataService.$inject = ['$http','$websocket','$rootScope'];

		function dataService($http,$websocket,$rootScope) {
				var messages = {};
				messages.columnsview = {};
//				req_list = ['cell','cell_profile','cell_tag','subscriber','sms','call_data_record','system_event','scan_task','subscriber_event','scanned_arfcn',
//						'person_group','person','subscriber_rule','tac','gateway']; //'transaction_state'     ; 'global/settings' , global_settings_changed
//
//				req_list.forEach(function (type){
//					$http.get('/api/gui/'+type).success(function (data, status, headers, config)  {
//		            	messages[type] = data;
//		            	if((typeof messages.cell !== 'undefined') && (typeof messages.cell_profile !== 'undefined') && (typeof messages.cell_tag !== 'undefined')) {
//				            messages.final_cell = joinTablesLeft(messages.cell, messages.cell_profile, 'cell_profile_id', 'id', 'cell_profile');
//				            messages.final_cell = joinTablesManyToMany(messages.final_cell, messages.cell_tag, 'id', 'cell_id_list', 'cell_tag');
//				            addUplinkDownlink(messages.final_cell);
//				        }
//		            	$rootScope.$emit('notifying-service-event');
//		        	});
//				});
//				messages.notification = [];
				var ws = $websocket.$new({
					url: 'ws://'+window.location.host+'/ws'
				});


				ws.$on('$message', function (response) {
				    if(!response['type'])return;

                    messages[response['type']] = response['data'];

//					if(response['type'] == 'columnsview'){
//                        console.log("orig");
//						console.log(response);
//						$rootScope.$emit('columnsview');
//					}
                    $rootScope.$emit(response['type']);
					$rootScope.$emit('notifying-service-event');
				});

				$http.get('/columnsview').success(function (data, status, headers, config)  {
                        messages['columnsview'] = data;
    		            messages.columnsview = data;
		            	$rootScope.$emit('columnsview');
		            	$rootScope.$emit('notifying-service-event');
		        	});
		        $http.get('/csvview').success(function (data, status, headers, config)  {
                        messages['csvview'] = data;
    		            messages.csvview = data;
		            	$rootScope.$emit('csvview');
		            	$rootScope.$emit('notifying-service-event');
		        	});

		        $http.get('/gps').success(function (data, status, headers, config)  {
		            	messages['gps'] = data;
    		            messages.gps = data;
		            	$rootScope.$emit('notifying-service-event');
		        	});

                $http.get('/modems').success(function (data, status, headers, config)  {
		            	messages['modems'] = data;
    		            messages.modems = data;
		            	$rootScope.$emit('notifying-service-event');
		        	});
		        $http.get('/settings').success(function (data, status, headers, config)  {
    		            messages['settings'] = data;
    		            $rootScope.$emit('settings');
		            	$rootScope.$emit('notifying-service-event');
		        	});
		        $http.get('/gsm').success(function (data, status, headers, config)  {
		            	messages['gsm'] = data;
    		            messages.gsm = data;
		            	$rootScope.$emit('notifying-service-event');
		        	});
		        $http.get('/wcdma').success(function (data, status, headers, config)  {
		            	messages['wcdma'] = data;
    		            messages.wcdma = data;
		            	$rootScope.$emit('notifying-service-event');
		        	});
		        $http.get('/lte').success(function (data, status, headers, config)  {
		            	messages['lte'] = data;
    		            messages.lte = data;
		            	$rootScope.$emit('notifying-service-event');
		        	});
		        $http.get('/power').success(function (data, status, headers, config)  {
		            	messages['gsmpower'] = data;
    		            messages.gsmpower = data;
		            	$rootScope.$emit('notifying-service-event');
		        	});
				return { messages,
					subscribe: function(scope, callback, event_name = 'notifying-service-event') {
			            var handler = $rootScope.$on(event_name, callback);
			            scope.$on('$destroy', handler);
			        }
				};
			};

})();