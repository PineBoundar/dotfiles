// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
"use strict";
var iOSPlatform_1 = require("./ios/iOSPlatform");
var androidPlatform_1 = require("../common/android/androidPlatform");
var PlatformResolver = (function () {
    function PlatformResolver() {
    }
    /**
     * Resolves the mobile application target platform.
     */
    PlatformResolver.prototype.resolveMobilePlatform = function (mobilePlatformString, runOptions) {
        switch (mobilePlatformString) {
            // We lazyly load the strategies, because some components might be
            // missing on some platforms (like XCode in Windows)
            case "ios":
                return new iOSPlatform_1.IOSPlatform(runOptions);
            case "android":
                return new androidPlatform_1.AndroidPlatform(runOptions);
            default:
                return null;
        }
    };
    return PlatformResolver;
}());
exports.PlatformResolver = PlatformResolver;

//# sourceMappingURL=platformResolver.js.map
