"use strict";
var vscode_1 = require("vscode");
var htmlUtil_1 = require("./utils/htmlUtil");
var docutilsUtil_1 = require("./utils/docutilsUtil");
var rst2mdown = require("rst2mdown");
var markdown = require("markdown").markdown;
var _instance = null;
function getInstance() {
    if (!_instance) {
        _instance = new ReStructuredTextDocumentContentManager();
    }
    return _instance;
}
exports.getInstance = getInstance;
var ReStructuredTextDocumentContentManager = (function () {
    function ReStructuredTextDocumentContentManager() {
    }
    // 生成当前编辑页面的可预览代码片段
    // @Override
    ReStructuredTextDocumentContentManager.prototype.createContentSnippet = function () {
        var editor = vscode_1.window.activeTextEditor;
        if (editor.document.languageId !== "rst") {
            return htmlUtil_1.HtmlUtil.errorSnippet(this.getErrorMessage());
        }
        return this.generatePreviewSnippet(editor);
    };
    // @Override
    ReStructuredTextDocumentContentManager.prototype.sendPreviewCommand = function (previewUri, displayColumn) {
        return htmlUtil_1.HtmlUtil.sendPreviewCommand(previewUri, displayColumn);
    };
    ReStructuredTextDocumentContentManager.prototype.getErrorMessage = function () {
        return "Active editor doesn't show a ReStructured Text document (.rst|.rest|.hrst)- no properties to preview.";
    };
    ReStructuredTextDocumentContentManager.prototype.rstSrcSnippetWithNodeModules = function (rstContent) {
        return markdown.toHTML(rst2mdown(rstContent));
    };
    ReStructuredTextDocumentContentManager.prototype.rstSrcSnippetWithDocutils = function (editor) {
        // 获取当前编辑页面对应的文档
        var doc = editor.document;
        return docutilsUtil_1.DocutilsUtil.rst2html(doc.fileName);
    };
    ReStructuredTextDocumentContentManager.prototype.rstSrcSnippet = function (editor) {
        var thiz = this;
        return this.rstSrcSnippetWithDocutils(editor).catch(function (error) {
            console.error("we got an error: " + error);
            vscode_1.window.showWarningMessage("try rst2html of doctutils failed, please check python and doctuils environment, we use a simple preview instead ^-)");
            return thiz.rstSrcSnippetWithNodeModules(editor.document.getText());
        });
    };
    // 生成预览编辑页面
    ReStructuredTextDocumentContentManager.prototype.generatePreviewSnippet = function (editor) {
        // 获取当前编辑页面对应的文档
        var doc = editor.document;
        return this.rstSrcSnippet(editor).then(function (rstSrc) {
            return htmlUtil_1.HtmlUtil.fixNoneNetLinks(rstSrc, doc.fileName);
        });
    };
    return ReStructuredTextDocumentContentManager;
}());
//# sourceMappingURL=reStructuredTextDocumentContentManager.js.map