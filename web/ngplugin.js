angular.module('docular.plugin.ngdoc', [])
    .controller('docular.plugin.ngdoc.documentationController', ['$scope', 'ngmarkdown', '$sce', '$filter', function ($scope, markdownService, $sce, $filter) {
        console.log($scope);
        var doc = $scope.documentationItem;
        $scope.docDescription = $sce.trustAsHtml(markdownService($scope.documentationItem.description.join('\n')))
        $scope.directiveNameIsParam = false;
        
        var dashFilter = $filter('dashCase');
        $scope.elUsage = [];
        $scope.attrUsage = [];
        $scope.classUsage = [];
        
        if(doc.restrict === undefined) {
            doc.restrict = 'A'; //This is the angular default
        }
        
        
        $scope.elUsage.push('<' + dashFilter(doc.name));
        $scope.attrUsage.push('<' + (doc.element || 'ANY'));
        $scope.classUsage.push('<' + (doc.element || 'ANY') + ' class="');
        
        var addedDirective = false;
        for(var i = 0, l = doc.params.length; i < l; i++) {
            var param = doc.params[i];
            console.log(param)
            if(param.varName === doc.name) {
                addedDirective = true;
            }
            
            var attrString = dashFilter(param.varName)+'='+'""';
            var elString = dashFilter(param.altName || param.varName)+'='+'""';
            if(param.optional) {
                attrString = '[' + attrString + ']';
                elString =  '[' + elString + ']';
            }
            var classString = dashFilter(param.varName)+': ;';
            if(param.optional) {
                classString = '[' + classString + ']';
            }
            if(i == l - 1 ) {
                attrString = attrString + '>'
                elString = elString + '>'
            }
            attrString = '\t' + attrString;
            elString = '\t' + elString;
            $scope.elUsage.push(elString)
            $scope.attrUsage.push(attrString)
            $scope.classUsage.push(classString)
            
            param.descriptionRendered = $sce.trustAsHtml(markdownService(param.description));
        }
        if(!addedDirective) {
            $scope.attrUsage.splice(1, 0, '\t' + dashFilter(doc.name));
            $scope.classUsage.splice(1, 0, dashFilter(doc.name) + ';');
        }
        if(doc.params.length === 0) {
            $scope.elUsage[$scope.elUsage.length - 1] += (doc.params.length === 0 ? '>' : '');
            $scope.attrUsage[$scope.attrUsage.length - 1] += (doc.params.length === 0 ? '>' : '');
        }
        
        $scope.elUsage.push('...\n</' + dashFilter(doc.name) + '>');
        $scope.attrUsage.push('...\n</' + (doc.element || 'ANY') + '>');
        $scope.classUsage.push('"> ... </' + (doc.element || 'ANY') + '>');
        
        $scope.elUsage = $scope.elUsage.join('\n');
        $scope.attrUsage = $scope.attrUsage.join('\n');
        $scope.classUsage = $scope.classUsage.join('');
    }])
    .directive('usageLine', function () {
        return {
            restrict: 'E',
            templateUrl: 'resources/plugins/ngdoc/templates/usageLine.html'
        }
    })
    .service('ngmarkdown', ['markdown', 'documentation', 'dataFilter', function (markdownService, docService, dataFilter) {
        return function (content) {
            var availableDocs = docService.getAllDocuments();
            
            content = content.replace(/{(@link ([^}]+)\s+([^}]+))}/g, function (matchStr, innerMatch, linkTo, linkName) {
                console.log(arguments)
                var href = linkTo;
                
                if(linkTo.indexOf('#') !== -1) {
                    linkTo = linkTo.split('#')[0];
                }
                
                if(linkTo.indexOf('://') === -1) {
                    var result = dataFilter(availableDocs, {
                        name: linkTo
                    });
                    if(!result.length) {
                        result = dataFilter(availableDocs, {
                            search: {op: 'like', val: linkTo}
                        });
                    }
                    console.log(result, result.length)
                    if(result.length) {
                        href = '#/documentation/' + result[0].path + '/docApi/' + result[0].name;
                    } else {
                        href = '#/search/?query=' + linkTo;
                    }
                }
                return "<a href='" + href + "'>" + linkName + '</a>';
            });
            
            var rendered = markdownService(content);
            
            
            
            return rendered;
        }
    }])
    .filter('dashCase', function () {
        return function (string) {
            return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        }
    })