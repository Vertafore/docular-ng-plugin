angular.module('docular.plugin.ngdoc', [])
    .controller('docular.plugin.ngdoc.documentationController', ['$scope', 'markdown', '$sce', function ($scope, markdownService, $sce) {
        console.log($scope);
        $scope.docDescription = $sce.trustAsHtml(markdownService($scope.documentationItem.description.join('\n')))
    }]);