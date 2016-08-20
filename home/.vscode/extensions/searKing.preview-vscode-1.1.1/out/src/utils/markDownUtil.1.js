"use strict";
var vscode_1 = require("vscode");
var fileUrl = require("file-url");
var PreviewWindowType;
(function (PreviewWindowType) {
    PreviewWindowType[PreviewWindowType["OVERRIDE"] = 0] = "OVERRIDE";
    PreviewWindowType[PreviewWindowType["SIDE_BY_SIDE"] = 1] = "SIDE_BY_SIDE";
})(PreviewWindowType || (PreviewWindowType = {}));
var MarkDownUtil = (function () {
    function MarkDownUtil() {
    }
    // @Override
    MarkDownUtil.sendPreviewCommand = function (previewUri, command) {
        if (command != this.COMMAND_BUTT) {
            return vscode_1.commands.executeCommand(command).then(function (success) {
            }, function (reason) {
                console.warn(reason);
                vscode_1.window.showErrorMessage(reason);
            });
        }
    };
    MarkDownUtil.COMMAND_TOGGLE_PREVIEW = "workbench.action.markdown.togglePreview";
    MarkDownUtil.COMMAND_OPEN_PREVIEW_SIDE_BY_SIDE = "workbench.action.markdown.openPreviewSideBySide";
    MarkDownUtil.COMMAND_BUTT = "";
    return MarkDownUtil;
}());
exports.MarkDownUtil = MarkDownUtil;
//# sourceMappingURL=markDownUtil.1.js.map