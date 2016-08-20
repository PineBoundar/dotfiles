"use strict";
var vscode_1 = require("vscode");
var htmlUtil_1 = require("./utils/htmlUtil");
var _instance = null;
function getInstance() {
    if (!_instance) {
        _instance = new MermaidDocumentContentManager();
    }
    return _instance;
}
exports.getInstance = getInstance;
var MermaidDocumentContentManager = (function () {
    function MermaidDocumentContentManager() {
        this.COMMAND = "vscode.previewHtml";
    }
    // 生成当前编辑页面的可预览代码片段
    // @Override
    MermaidDocumentContentManager.prototype.createContentSnippet = function () {
        var editor = vscode_1.window.activeTextEditor;
        if (editor.document.languageId !== "mermaid") {
            return htmlUtil_1.HtmlUtil.errorSnippet(this.getErrorMessage());
        }
        var previewSnippet = this.generatePreviewSnippet(editor);
        if (!previewSnippet || previewSnippet.length <= 0) {
            return htmlUtil_1.HtmlUtil.errorSnippet(this.getErrorMessage());
        }
        console.info("previewSnippet = " + previewSnippet);
        return previewSnippet;
    };
    // @Override
    MermaidDocumentContentManager.prototype.sendPreviewCommand = function (previewUri, displayColumn) {
        return htmlUtil_1.HtmlUtil.sendPreviewCommand(previewUri, displayColumn);
    };
    MermaidDocumentContentManager.prototype.getErrorMessage = function () {
        return "Active editor doesn't show a Mermaid document - no properties to preview.";
    };
    MermaidDocumentContentManager.prototype.MermaidSampleFullSnippet = function (properties) {
        return htmlUtil_1.HtmlUtil.createRemoteSource(htmlUtil_1.SourceType.CUSTOM_MERMAID_SAMPLE, properties);
    };
    MermaidDocumentContentManager.prototype.getSelectedCSSProperity = function (editor) {
        return editor.document.getText();
    };
    // 生成预览编辑页面
    MermaidDocumentContentManager.prototype.generatePreviewSnippet = function (editor) {
        var cssProperty = this.getSelectedCSSProperity(editor);
        if (!cssProperty || cssProperty.length <= 0) {
            return undefined;
        }
        return this.MermaidSampleFullSnippet(cssProperty);
    };
    return MermaidDocumentContentManager;
}());
//# sourceMappingURL=mermaidDocumentContentManager.js.map