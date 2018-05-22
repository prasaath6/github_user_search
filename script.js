var app = angular.module("myapp", [])
var baseurl = "https://api.github.com";
app.constant('config', {
    "baseURL": baseurl,
    "search": baseurl + "/search/users",
});
app.controller('github_app', function ($scope, $rootScope, config, gitService) {
    $scope.userData = [];
    $scope.query = "";
    $scope.page = 1;
    $scope.nextcall = 1;
    $scope.helptext = "Search for the github users!!!"
    $scope.getlist = function () {
        if (!$scope.query) {
            alert("Query Should Not Empty!!");
        } else {
            let lastquery = localStorage.getItem('last_query')
            if (lastquery != $scope.query) {
                $scope.userData = [];
                $scope.page = 1;
                localStorage.setItem("last_query", $scope.query)
            } else {
                console.log("kjh");
            }
            gitService.getlist($scope.query, $scope.page)
                .then(function (response) {
                    let listdata = response.items;
                    if (listdata != "") {
                        angular.forEach(listdata, function (value, key) {
                            $scope.userData.push(value);
                        });
                        $scope.nextcall = 1;
                        $scope.page++;
                    } else {
                        $scope.nextcall = 0;
                    }

                }).catch(function (response) {
                    console.log(response.status);
                });

        };
    }
    $(window).scroll(function () {
        var bodypos = $("body")[0].scrollHeight;
        var windowh = $(window).height();
        bodypos = bodypos - windowh;
        var windowpos = $(window).scrollTop();
        var persentage = Math.round(((windowpos / bodypos) * 100));
        if (Math.round(persentage) > 80 && $scope.nextcall == 1) {
            $scope.nextcall = 0;
            $scope.getlist();
        }
    });
});
app.factory('gitService', function ($http, $q, config) {
    return {
        getlist: function (query, page) {
            var def = $q.defer();

            $http.get(config.search + "?q=" + query + "&page=" + page)
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