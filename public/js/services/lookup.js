define(['angular'], function(angular){
	'use strict';

	angular.module('app.services.lookup',[])
		.factory('LookupService', ['$http', '$q','AppConfig','$rootScope', 'localStorageService', function($http, $q, AppConfig,$rootScope, localStorageService){
		return {
			set : function(vehicle){
				console.log(vehicle);
				localStorageService.set('vehicle',vehicle);
				$rootScope.$broadcast('vehicleChange',vehicle);
			},
			get : function(){
				return localStorageService.get('vehicle');
			},
			delete: function(){
				return localStorageService.remove('vehicle');
			},
			query : function(vehicle, page, count){
				if(page === undefined || page === null || page === 0){
					page = 1
				}
				if(count === undefined || count === null || count === 0){
					count = 12;
				}
				var def = $q.defer();
				var params = vehicle;
				$http({
					method:'post',
					url:AppConfig.APIURL + '/vehicle',
					data:params,
					headers:{
						'Content-Type': 'application/json; charset=UTF-8'
					},
					responseType: 'jsonp',
					params: {
						'key': AppConfig.APIKEY,
						'page':page,
						'count':count
					}
				}).success(def.resolve).error(def.reject);

				return def.promise;
			}
		};
	}]);

});