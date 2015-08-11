'use strict';

angular.module('ariesautomotive').factory('LandingPageService', ['$http', '$q','AppConfig', function($http, $q, AppConfig){
	return {
		GetLandingPage : function(id){
			var def = $q.defer();
			$http({
				method: 'get',
				url: AppConfig.APIURL + '/lp/'+id+'?key=' + AppConfig.APIKEY,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
				},
				responseType: 'jsonp'
			}).success(def.resolve).error(def.reject);
			return def.promise;
		}
	};
}]);
