"use strict";
var vscode_1 = require("vscode");
var htmlUtil_1 = require("./utils/htmlUtil");
var _instance = null;
function getInstance() {
    if (!_instance) {
        _instance = new CssDocumentContentManager();
    }
    return _instance;
}
exports.getInstance = getInstance;
var CssDocumentContentManager = (function () {
    function CssDocumentContentManager() {
        this.COMMAND = "vscode.previewHtml";
    }
    // 生成当前编辑页面的可预览代码片段
    // @Override
    CssDocumentContentManager.prototype.createContentSnippet = function () {
        var editor = vscode_1.window.activeTextEditor;
        var previewSnippet = this.generatePreviewSnippet(editor);
        if (!previewSnippet || previewSnippet.length <= 0) {
            return htmlUtil_1.HtmlUtil.errorSnippet(this.getErrorMessage());
        }
        console.info("previewSnippet = " + previewSnippet);
        return previewSnippet;
    };
    // @Override
    CssDocumentContentManager.prototype.sendPreviewCommand = function (previewUri, displayColumn) {
        return htmlUtil_1.HtmlUtil.sendPreviewCommand(previewUri, displayColumn);
    };
    CssDocumentContentManager.prototype.getErrorMessage = function () {
        return "Active editor doesn't show a CSS document - no properties to preview.";
    };
    CssDocumentContentManager.prototype.CSSSampleFullSnippet = function (properties) {
        return htmlUtil_1.HtmlUtil.createRemoteSource(htmlUtil_1.SourceType.CUSTOM_STYLE_SAMPLE, properties);
    };
    CssDocumentContentManager.prototype.getSelectedCSSProperity = function (editor) {
        // 获取当前页面文本
        var text = editor.document.getText();
        // 获取当前鼠标选中段落的起始位置        
        var startPosOfSelectionText = editor.document.offsetAt(editor.selection.anchor);
        var startPosOfCSSProperty = text.lastIndexOf('{', startPosOfSelectionText);
        var endPosOfCSSProperty = text.indexOf('}', startPosOfCSSProperty);
        if (startPosOfCSSProperty === -1 || endPosOfCSSProperty === -1) {
            return htmlUtil_1.HtmlUtil.errorSnippet("Cannot determine the rule's properties.");
        }
        var properties = text.slice(startPosOfCSSProperty + 1, endPosOfCSSProperty);
        return properties;
    };
    // 生成预览编辑页面
    CssDocumentContentManager.prototype.generatePreviewSnippet = function (editor) {
        var cssProperty = this.getSelectedCSSProperity(editor);
        if (!cssProperty || cssProperty.length <= 0) {
            return undefined;
        }
        return this.CSSSampleFullSnippet(cssProperty);
    };
    return CssDocumentContentManager;
}());
//# sourceMappingURL=cssDocumentContentManager.js.map