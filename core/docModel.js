var inherit = require('inherit');
var nodeExtend = require('node.extend');
module.exports = inherit({
    
    __constructor: function () {
        Object.defineProperty(this, "id", {
            get: function() {
                var data = this.data;
                return this.data.groupId + '_' + this.data.module + '_' + JSON.stringify(data.parentDoc) + '_' + data.ngdoc + '_' + data.id;
            }
        });
        Object.defineProperty(this, "module", {
            get: function () {
                return this.data.module;
            },
            set: function (value) {
                this.data.module = value;
            }
        });
        Object.defineProperty(this, "type", {
            get: function () {
                return this.data.ngdoc;
            }
        });
        Object.defineProperty(this, "groupId", {
            get: function () {
                return this.data.groupId;
            },
            set: function (value) {
                this.data.groupId = value;
            }
        });
        Object.defineProperty(this, "parentDoc", {
            get: function () {
                return this.data.parentDoc;
            }
        });
        Object.defineProperty(this, "name", {
            get: function () {
                return this.data.name;
            }
        });
    },
    
    getDocType: function () {
        return this.data.ngdoc;
    },
    
    addSubdoc: function (doc) {
        if(!this.data.subdocs) {
            this.data.subdocs = [];
        }
        this.data.subdocs.push(doc);
    },
    canHaveChildren: function () {
        return [
            'service',
            'object',
            'type',
            'module',
            'provider',
            'overview',
            'directive'
        ].indexOf(this.data.ngdoc) !== -1;
    },
    
    hasParent: function () {
        if(this.parentDoc && (this.parentDoc.name || this.parentDoc.module)) {
            return true;
        }
        return false;
    },
    
    getParentQuery: function () {
        return this.parentDoc;
    },
    
    toJSON: function () {
        var data = nodeExtend({}, this.data);
        delete data.example;
        return data;
    },
    
    setPath: function (path) {
        this.data.path = path;
    },
    
    setData: function (data) {
        this.data = data;
        if(!data.id) {
            data.id = data.name;
        }
        
    }
});