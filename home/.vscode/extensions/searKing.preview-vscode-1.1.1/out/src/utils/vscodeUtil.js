"use strict";
var vscode = require("vscode");
var VscodeUtil = (function () {
    function VscodeUtil() {
    }
    // token or gist input
    VscodeUtil.getInputBox = function (boxTag) {
        if (boxTag == "") {
            boxTag = "Enter Something";
        }
        var options = {
            placeHolder: boxTag,
            password: false,
            prompt: "Link is opened to get the github token."
        };
        return options;
    };
    ;
    VscodeUtil.getPreviewTypeQuickPick = function () {
        var item = [
            {
                label: "image",
                description: "Preview Image"
            }, {
                label: "css",
                description: "Preview CSS"
            }, {
                label: "mermaid",
                description: "Preview Mermaid"
            }, {
                label: "markdown",
                description: "Preview Markdown"
            }, {
                label: "rst",
                description: "Preview ReStructuredText"
            }, {
                label: "html",
                description: "Preview HTML and Jade"
            }
        ];
        //Ask what they want to do:
        return vscode.window.showQuickPick(item, {
            matchOnDescription: true,
            placeHolder: "Couldn't determine type to preivew, please choose."
        }).then(function (choice) {
            if (!choice || !choice.label) {
                throw new Error("no preview type selected");
            }
            return choice.label.toLowerCase();
        });
    };
    VscodeUtil.getPreviewType = function (editor, dontAsk) {
        if (dontAsk === void 0) { dontAsk = false; }
        if (!editor) {
            editor = vscode.window.activeTextEditor;
        }
        switch (editor.document.languageId) {
            case "html":
            case "jade":
            case "markdown":
            case "css":
            case "mermaid":
            case "rst":
                return Promise.resolve(editor.document.languageId);
            default:
                break;
        }
        if (dontAsk) {
            return Promise.resolve(editor.document.languageId);
        }
        //Ask what they want to do:
        return Promise.resolve(VscodeUtil.getPreviewTypeQuickPick());
    };
    ;
    return VscodeUtil;
}());
exports.VscodeUtil = VscodeUtil;
//# sourceMappingURL=vscodeUtil.js.map