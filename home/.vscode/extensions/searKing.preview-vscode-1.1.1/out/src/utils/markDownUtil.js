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
    MarkDownUtil.sendPreviewCommand = function (previewUri, displayColumn) {
        var command = MarkDownUtil.getPreviewCommandTag(displayColumn);
        if (command != this.COMMAND_BUTT) {
            return vscode_1.commands.executeCommand(command).then(function (success) {
            }, function (reason) {
                console.warn(reason);
                vscode_1.window.showErrorMessage(reason);
            });
        }
    };
    MarkDownUtil.getPreviewCommandTag = function (displayColumn) {
        if (displayColumn == vscode_1.window.activeTextEditor.viewColumn) {
            return MarkDownUtil.getCommandTogglePreview();
        }
        return MarkDownUtil.getCommandOpenPreviewSideBySide();
    };
    MarkDownUtil.getCommandTogglePreview = function () {
        if (vscode_1.version >= "1.3.0") {
            return MarkDownUtil.COMMAND_TOGGLE_PREVIEW_1_3_0;
        }
        return MarkDownUtil.COMMAND_TOGGLE_PREVIEW;
    };
    MarkDownUtil.getCommandOpenPreviewSideBySide = function () {
        if (vscode_1.version >= "1.3.0") {
            return MarkDownUtil.COMMAND_OPEN_PREVIEW_SIDE_BY_SIDE_1_3_0;
        }
        return MarkDownUtil.COMMAND_OPEN_PREVIEW_SIDE_BY_SIDE;
    };
    MarkDownUtil.COMMAND_TOGGLE_PREVIEW = "workbench.action.markdown.togglePreview";
    MarkDownUtil.COMMAND_OPEN_PREVIEW_SIDE_BY_SIDE = "workbench.action.markdown.openPreviewSideBySide";
    MarkDownUtil.COMMAND_TOGGLE_PREVIEW_1_3_0 = "markdown.showPreview";
    MarkDownUtil.COMMAND_OPEN_PREVIEW_SIDE_BY_SIDE_1_3_0 = "markdown.showPreviewToSide";
    MarkDownUtil.COMMAND_BUTT = "";
    return MarkDownUtil;
}());
exports.MarkDownUtil = MarkDownUtil;
//# sourceMappingURL=markDownUtil.js.map