define([
	'angular',
	'ui.router',
	'../../config'
], function (angular) {
	'use strict';

	return angular.module('app.index', [
		'app.constants',
		'ui.router'
	]).config(function ($stateProvider) {
		var homeState = {
			name: 'index',
			url: '/',
			views:{
				'body':{
					templateUrl: '/js/controllers/index/index.html',
					controller: 'HomeController'
				},
				'lookup':{
					templateUrl: '/js/controllers/lookup/index.html',
					controller: 'LookupController'
				}
			}
		};
		$stateProvider.state(homeState);
	});

});