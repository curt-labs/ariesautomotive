'use strict';

angular.module('ariesautomotive').controller('NewsController', ['$scope', 'NewsService', '$rootScope', '$state', function ($scope, NewsService, $rootScope, $state) {
    
    $scope.news = [];
    $scope.count = 8; //headlines per page
    $scope.index = 0;

    if (!$state.params.id) {
      NewsService.getAll().then(function (resp) {
        for (var i = 0; i < resp.length; i++) {
          if (new Date(resp[i].publishEnd) > new Date() || !(resp[i].publishEnd > 0)) {
            $scope.news.push(resp[i]);
          }
        }
        $scope.pages = new Array(Math.ceil($scope.news.length / $scope.count));
      });
    }

    $scope.goto = function (page) {
      $scope.index = page * $scope.count;
    };

    if ($state.params.id) {
      NewsService.get($state.params.id).then(function (resp) {
        $scope.newsitem = resp;
      });
    }

}]);