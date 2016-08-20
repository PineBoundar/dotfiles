"use strict";
var vscode_1 = require("vscode");
var fileUrl = require("file-url");
var MermaidUtil = (function () {
    function MermaidUtil() {
    }
    // @Override
    MermaidUtil.sendPreviewCommand = function (previewUri, command) {
        if (command != this.COMMAND_BUTT) {
            return vscode_1.commands.executeCommand(command).then(function (success) {
            }, function (reason) {
                console.warn(reason);
                vscode_1.window.showErrorMessage(reason);
            });
        }
    };
    MermaidUtil.isMermaidFile = function (editor) {
        if (editor.document.fileName.toLowerCase().endsWith(".mermaid")) {
            return true;
        }
        return false;
    };
    MermaidUtil.COMMAND = "vscode.previewHtml";
    MermaidUtil.COMMAND_BUTT = "";
    return MermaidUtil;
}());
exports.MermaidUtil = MermaidUtil;
//# sourceMappingURL=mermaidUtil.js.map