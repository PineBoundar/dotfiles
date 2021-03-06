// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
"use strict";
var commandExecutor_1 = require("./commandExecutor");
var ReactNative = (function () {
    function ReactNative() {
    }
    ReactNative.prototype.runAndroid = function (projectRoot) {
        var cexec = new commandExecutor_1.CommandExecutor(projectRoot);
        return cexec.spawnReactCommand("run-android");
    };
    ReactNative.prototype.createProject = function (projectRoot, projectName) {
        throw new Error("Not yet implemented: ReactNative.createProject");
    };
    return ReactNative;
}());
exports.ReactNative = ReactNative;

//# sourceMappingURL=reactNative.js.map
