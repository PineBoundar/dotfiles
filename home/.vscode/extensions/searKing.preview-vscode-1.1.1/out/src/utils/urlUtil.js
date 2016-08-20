'use strict';
var path = require('path');
var UrlUtil = (function () {
    function UrlUtil() {
    }
    UrlUtil.fileUriEncode = function (str, options) {
        if (typeof str !== 'string') {
            throw new Error('Expected a string');
        }
        options = options || {};
        var pathName = str;
        if (options.resolve !== false) {
            pathName = path.resolve(str);
        }
        pathName = pathName.replace(/\\/g, '/');
        // Windows drive letter must be prefixed with a slash
        if (pathName[0] !== '/') {
            pathName = '/' + pathName;
        }
        return encodeURI('file://' + pathName);
    };
    ;
    UrlUtil.fileUriDecode = function (str, options) {
        if (typeof str !== 'string') {
            throw new Error('Expected a string');
        }
        options = options || {};
        var pathName = str;
        if (options.resolve !== false) {
            pathName = path.resolve(str);
        }
        pathName = pathName.replace(/\\/g, '/');
        // Windows drive letter must be prefixed with a slash
        if (pathName[0] !== '/') {
            pathName = '/' + pathName;
        }
        var sa = decodeURI(pathName);
        return decodeURI(pathName);
    };
    ;
    return UrlUtil;
}());
exports.UrlUtil = UrlUtil;
//# sourceMappingURL=urlUtil.js.map