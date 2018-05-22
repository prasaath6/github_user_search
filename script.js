var app = angular.module("myapp", [])
var baseurl = "https://api.github.com";
app.constant('config', {
    "baseURL": baseurl,
    "search": baseurl + "/search/users",
});
app.controller('github_app', function ($scope, $rootScope, config, gitService) {
    $scope.userData = [];
    $scope.getlist = function (query) {
        gitService.getlist(query)
            .then(function (response) {
                $scope.userData = response;
                console.log(response)
            }).catch(function (response) {
                console.log(response.status);
            });
    };
});
app.factory('gitService', function ($http, $q, config) {
    return {
        getlist: function (query) {
            var def = $q.defer();

            $http.get(config.search + "?q=pra")
                .then(function (response) {
                    def.resolve(response.data);
                })
                .catch(function (response) {
                    def.reject(response);
                });
            return def.promise;
        }
    }
});