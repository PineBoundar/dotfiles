"use strict";
var child_process_1 = require("child_process");
var fileUrl = require("file-url");
var ShellUtil = (function () {
    function ShellUtil() {
    }
    ShellUtil.execPromisLike = function (cmd) {
        return new Promise(function (resolve, reject) {
            child_process_1.exec(cmd, function (error, stdout, stderr) {
                if (error) {
                    var errorMessage = [
                        error.name,
                        error.message,
                        error.stack,
                        "",
                        stderr.toString()
                    ].join("\n");
                    reject(errorMessage);
                }
                resolve(stdout.toString());
            });
        });
    };
    return ShellUtil;
}());
exports.ShellUtil = ShellUtil;
//# sourceMappingURL=shellUtil.js.map