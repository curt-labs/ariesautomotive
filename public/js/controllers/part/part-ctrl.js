/**
 * Part controller definition
 */
define(['./module'], function (module) {
	'use strict';

	module.controller('PartController', ['$scope', 'PartService', '$stateParams', function($scope, PartService, $stateParams){
		$scope.part = {};
		$scope.latestParts = {};
		if($stateParams !== undefined && $stateParams.id !== undefined && $stateParams.id !== ''){
			PartService.GetPart($stateParams.id,function(part, err){
				if(!err){
					$scope.part = part;
				}
			});
		}

		PartService.GetLatest(function(latestParts, err){
			if(!err){
				$scope.latestParts = latestParts;
			}
		});
	}]);
});