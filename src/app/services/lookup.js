'use strict';

angular.module('ariesautomotive').factory('LookupService', ['$http', '$q','AppConfig', 'localStorageService', function($http, $q, AppConfig, localStorageService){
	return {
		collections: function(){
			var def = $q.defer();
			$http({
				method: 'get',
				url: AppConfig.APIURL + '/vehicle/mongo/cols',
				headers:{
					'Content-Type':'application/json; charset=UTF-8'
			},
				responseType: 'jsonp',
				params: { 'key': AppConfig.APIKEY}
			}).success(def.resolve).error(def.reject);
			return def.promise;
		},
		query : function(vehicle){
			var def = $q.defer();

			$http({
				method:'post',
				url:AppConfig.APIURL + '/vehicle/mongo/allCollections',
				data:$.param(vehicle),
				headers:{
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				params: {'key': AppConfig.APIKEY}
			}).success(def.resolve).error(def.reject);

			return def.promise;
		},
		inquire : function(inquiry){
			var def = $q.defer();
			$http({
				method:'post',
				url:AppConfig.APIURL + '/vehicle/inquire',
				data:inquiry,
				headers:{
					'Content-Type': 'application/json; charset=UTF-8'
				},
				responseType: 'jsonp',
				params: {
					'key': AppConfig.APIKEY
				}
			}).success(def.resolve).error(def.reject);

			return def.promise;
		},
		validateBaseVehicle : function(v) {
			if (v === undefined || v === null) {
				return false;
			}

			var requiredProps = ['year', 'make', 'model'];
			var req;
			for (req in requiredProps) {
				if (v[req] === undefined || v[req] === null || v[req] === '') {
					return false;
				}
			}
			return true;
		},
		setVehicle : function(v) {
			return localStorageService.set('vehicle', v);
		},
		clear : function() {
			return localStorageService.remove('vehicle');
		}
	};
}]);
