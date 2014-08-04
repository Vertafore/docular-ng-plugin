var nodeExtend = require('node.extend');
var Q = require('q');
var util = require('util');
var Parser = require('./core/parser');
var DocModel = require('./core/docModel');

var Plugin = function () {
    
};

Plugin.prototype = nodeExtend(Plugin.prototype, {
    register: function (generator) {
        this._generator = generator;
        generator.on('FileParse', this.parseFile.bind(this));
        generator.on('CreateDocs', this.createDocs.bind(this));
        generator.on('FileParseBackfill', this.backfillData.bind(this));
    },
    
    createDocs: function (fileData, promises) {
        if(fileData.docType === 'ngdoc') {
            promises.push(function (currentModel) {
                var docModel = new DocModel();
                if(!currentModel) {
                    docModel.setData(fileData);
                } else {
                    docModel.setData(currentModel.toJSON());
                }
                return Q(docModel);
            });
        }
    },
    
    backfillData: function (fileData, allFiles) {
        var parser = new Parser();
        parser.backfill(fileData, allFiles);
    },
    
    parseFile: function (fileData, allFiles, promises) {
        var deferred = Q.defer(), parser = new Parser();
        promises.push(deferred.promise);
        
        var results = parser.parse(fileData, allFiles);
        if(!results) {
            deferred.resolve();
            return;
        }
        
        for(var i = 0, l = results.length; i < l; i++) {
            if(results[i]) {
               fileData.docs.push(results[i]); 
            }
        }
        
        deferred.resolve();
    }
});

module.exports = Plugin;