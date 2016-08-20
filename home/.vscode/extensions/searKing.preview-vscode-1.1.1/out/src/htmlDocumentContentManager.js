"use strict";
var vscode_1 = require("vscode");
var htmlUtil_1 = require("./utils/htmlUtil");
var fileUrl = require("file-url");
var _instance = null;
function getInstance() {
    if (!_instance) {
        _instance = new HtmlDocumentContentManager();
    }
    return _instance;
}
exports.getInstance = getInstance;
var HtmlDocumentContentManager = (function () {
    function HtmlDocumentContentManager() {
    }
    // 生成当前编辑页面的HTML代码片段
    // @Override
    HtmlDocumentContentManager.prototype.createContentSnippet = function () {
        var editor = vscode_1.window.activeTextEditor;
        if (editor.document.languageId !== "html" && editor.document.languageId !== "jade") {
            return htmlUtil_1.HtmlUtil.errorSnippet("Active editor doesn't show a HTML or Jade document - no properties to preview.");
        }
        return this.generatePreviewSnippet(editor);
    };
    // @Override
    HtmlDocumentContentManager.prototype.sendPreviewCommand = function (previewUri, displayColumn) {
        return htmlUtil_1.HtmlUtil.sendPreviewCommand(previewUri, displayColumn);
    };
    // 生成预览编辑页面
    // @Override
    HtmlDocumentContentManager.prototype.generatePreviewSnippet = function (editor) {
        // 获取当前编辑页面对应的文档
        var doc = editor.document;
        return htmlUtil_1.HtmlUtil.createLocalSource(htmlUtil_1.SourceType.STYLE, "header_fix.css")
            + htmlUtil_1.HtmlUtil.createRemoteSource(htmlUtil_1.SourceType.BR)
            + htmlUtil_1.HtmlUtil.fixNoneNetLinks(doc.getText(), doc.fileName);
    };
    return HtmlDocumentContentManager;
}());
//# sourceMappingURL=htmlDocumentContentManager.js.map