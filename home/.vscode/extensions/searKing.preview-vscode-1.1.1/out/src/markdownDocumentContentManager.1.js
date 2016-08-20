"use strict";
var vscode_1 = require("vscode");
var htmlUtil_1 = require("./utils/htmlUtil");
var markDownUtil_1 = require("./utils/markDownUtil");
var _instance = null;
function getInstance() {
    if (!_instance) {
        _instance = new MarkdownDocumentContentManager();
    }
    return _instance;
}
exports.getInstance = getInstance;
var MarkdownDocumentContentManager = (function () {
    function MarkdownDocumentContentManager() {
    }
    // 生成当前编辑页面的可预览代码片段
    // @Override
    MarkdownDocumentContentManager.prototype.createContentSnippet = function () {
        var editor = vscode_1.window.activeTextEditor;
        if (editor.document.languageId !== "markdown") {
            return htmlUtil_1.HtmlUtil.errorSnippet(this.getErrorMessage());
        }
        return this.generatePreviewSnippet(editor);
    };
    // @Override
    MarkdownDocumentContentManager.prototype.sendPreviewCommand = function (previewUri, displayColumn) {
        return markDownUtil_1.MarkDownUtil.sendPreviewCommand(previewUri, displayColumn);
    };
    MarkdownDocumentContentManager.prototype.getErrorMessage = function () {
        return "Active editor doesn't show a MarkDown document - no properties to preview.";
    };
    // 生成预览编辑页面
    MarkdownDocumentContentManager.prototype.generatePreviewSnippet = function (editor) {
        // 获取当前编辑页面对应的文档
        var doc = editor.document;
        return htmlUtil_1.HtmlUtil.fixNoneNetLinks(doc.getText(), doc.fileName);
    };
    return MarkdownDocumentContentManager;
}());
//# sourceMappingURL=markdownDocumentContentManager.1.js.map