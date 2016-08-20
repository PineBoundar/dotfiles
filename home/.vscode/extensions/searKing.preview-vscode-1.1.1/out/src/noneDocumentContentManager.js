"use strict";
var vscode_1 = require("vscode");
var _instance = null;
function getInstance() {
    if (!_instance) {
        _instance = new NoneDocumentContentManager();
    }
    return _instance;
}
exports.getInstance = getInstance;
var NoneDocumentContentManager = (function () {
    function NoneDocumentContentManager() {
    }
    // 生成当前编辑页面的可预览代码片段
    // @Override
    NoneDocumentContentManager.prototype.createContentSnippet = function () {
        return this.getErrorMessage();
    };
    // @Override
    NoneDocumentContentManager.prototype.sendPreviewCommand = function (previewUri, displayColumn) {
        vscode_1.window.showWarningMessage(this.getErrorMessage());
        return;
    };
    NoneDocumentContentManager.prototype.getErrorMessage = function () {
        return "Couldn't determine type to preivew, please choose.";
    };
    return NoneDocumentContentManager;
}());
//# sourceMappingURL=noneDocumentContentManager.js.map