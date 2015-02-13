/**
 * Vehicle controller definition
 */
define(['./module'], function (module) {
	'use strict';

	module.controller('VehicleController',  ['$scope', 'LookupService','PartService',  '$location','$anchorScroll', function($scope, LookupService, PartService, $location, $anchorScroll){
		$scope.vehicle = LookupService.get();
		
		$scope.parts = LookupService.query($scope.vehicle)
			.then(function(data){
				$scope.parts = data.parts;
			},function(err){
				$scope.err = err;
			});

		$scope.scrollTo = function(elementId){
			$location.hash(elementId);
			$anchorScroll();
		};



		$scope.clear = function(){
			$scope.vehicle = {};
			$scope.vehicle.base = {};
			$scope.vehicle.base.year = 0;
			$scope.parts = null;
		};


		$scope.$on('vehicleChange',function(event,x){
			$scope.vehicle = x;
			$scope.getParts();
		});

		$scope.getParts = function(){
			LookupService.query($scope.vehicle)
				.then(function(data){
					$scope.parts = data.parts;
				},function(err){
					$scope.err = err;
				});
		}
		
	}]);
});