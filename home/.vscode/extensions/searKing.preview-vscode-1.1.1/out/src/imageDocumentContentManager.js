"use strict";
var vscode_1 = require("vscode");
var htmlUtil_1 = require("./utils/htmlUtil");
var textUtil_1 = require("./utils/textUtil");
var fileUrl = require("file-url");
var _instance = null;
function getInstance() {
    if (!_instance) {
        _instance = new ImageDocumentContentManager();
    }
    return _instance;
}
exports.getInstance = getInstance;
var ImageDocumentContentManager = (function () {
    function ImageDocumentContentManager() {
        this.COMMAND = "vscode.previewHtml";
        this.IMAGE_TYPE_REGREX_PREFFIX = /http[s]{0,1}:\/\/|file:\/\/|\s[\.]{0,2}\//;
        this.IMAGE_TYPE_REGREX_SUFFIX = /png|jpg|jpeg|gif|bmp/;
        this.IMAGE_TYPE_REGREX_SPLIT = /\s/;
    }
    // 生成当前编辑页面的可预览代码片段
    // @Override
    ImageDocumentContentManager.prototype.createContentSnippet = function () {
        var editor = vscode_1.window.activeTextEditor;
        var previewSnippet = this.generatePreviewSnippet(editor);
        if (!previewSnippet || previewSnippet.length <= 0) {
            return htmlUtil_1.HtmlUtil.errorSnippet(this.getErrorMessage());
        }
        console.info("previewSnippet = " + previewSnippet);
        return previewSnippet;
    };
    // @Override
    ImageDocumentContentManager.prototype.sendPreviewCommand = function (previewUri, displayColumn) {
        return htmlUtil_1.HtmlUtil.sendPreviewCommand(previewUri, displayColumn);
    };
    ImageDocumentContentManager.prototype.getErrorMessage = function () {
        return "Active editor doesn't show any  " + this.IMAGE_TYPE_REGREX_SUFFIX + " - no properties to preview.";
    };
    ImageDocumentContentManager.prototype.imageSrcSnippet = function (imageUri) {
        return htmlUtil_1.HtmlUtil.createRemoteSource(htmlUtil_1.SourceType.IMAGE, imageUri);
    };
    // 获取指定位置开始后的第一个分隔符的位置
    ImageDocumentContentManager.prototype.indexOfSplit = function (editor, startPos) {
        return textUtil_1.TextUtil.regexIndexOf(editor, startPos, this.IMAGE_TYPE_REGREX_SPLIT);
    };
    // 获取指定位置开始后的第一个后缀的位置
    ImageDocumentContentManager.prototype.indexOfSuffix = function (editor, startPos) {
        return textUtil_1.TextUtil.regexIndexOf(editor, startPos, this.IMAGE_TYPE_REGREX_SUFFIX);
    };
    // 获取指定位置开始前的第一个资源前缀的位置
    ImageDocumentContentManager.prototype.lastIndexOfPrefix = function (editor, startPos) {
        return textUtil_1.TextUtil.regexLastIndexOf(editor, startPos, this.IMAGE_TYPE_REGREX_PREFFIX);
    };
    // 获取指定位置开始前的第一个资源前缀的位置
    ImageDocumentContentManager.prototype.lastIndexOfSuffix = function (editor, startPos) {
        return textUtil_1.TextUtil.regexLastIndexOf(editor, startPos, this.IMAGE_TYPE_REGREX_SUFFIX);
    };
    // 获取指定位置开始后的第一个分隔符前的最后一个后缀的位置
    ImageDocumentContentManager.prototype.getEndOfImageUrl = function (editor, startPosOfImageUrl, startPosOfSplit) {
        var startIndexOfSuffix = this.lastIndexOfSuffix(editor, startPosOfSplit);
        var startPosOfSuffix = startIndexOfSuffix.pos;
        var selectedSuffix = startIndexOfSuffix.mark;
        if (startPosOfSuffix < 0) {
            return startPosOfSplit;
        }
        else {
            if (startPosOfSuffix < startPosOfImageUrl) {
                return -1;
            }
            return startPosOfSuffix + selectedSuffix.length;
        }
    };
    ImageDocumentContentManager.prototype.getSplitOfImageUrl = function (editor, startIndexOfImageUrl) {
        var startPosOfSplit = this.indexOfSplit(editor, startIndexOfImageUrl.pos + startIndexOfImageUrl.mark.length).pos;
        if (startPosOfSplit < 0) {
            startPosOfSplit = editor.document.getText().length;
        }
        return startPosOfSplit;
    };
    ImageDocumentContentManager.prototype.getFirstSelectedImageUri = function (editor) {
        // 获取当前鼠标选中段落的起始位置        
        var startPosOfSelectionText = editor.document.offsetAt(editor.selection.anchor);
        var startIndexOfImageUrl = this.lastIndexOfPrefix(editor, startPosOfSelectionText);
        var startPosOfImageUrl = startIndexOfImageUrl.pos;
        var selectPrefix = startIndexOfImageUrl.mark;
        if (startPosOfImageUrl < 0) {
            return undefined;
        }
        var startPosOfSplit = this.getSplitOfImageUrl(editor, startIndexOfImageUrl);
        var endNextPosOfImageUrl = this.getEndOfImageUrl(editor, startPosOfImageUrl, startPosOfSplit);
        if (endNextPosOfImageUrl < 0) {
            return undefined;
        }
        var imgSrcUri = editor.document.getText().slice(startPosOfImageUrl, endNextPosOfImageUrl);
        return imgSrcUri;
    };
    // 生成预览编辑页面
    ImageDocumentContentManager.prototype.generatePreviewSnippet = function (editor) {
        var imageUri = this.getFirstSelectedImageUri(editor);
        if (!imageUri || imageUri.length <= 0) {
            return undefined;
        }
        var head = htmlUtil_1.HtmlUtil.createLocalSource(htmlUtil_1.SourceType.LINK, "header_fix.css");
        var body = htmlUtil_1.HtmlUtil.createRemoteSource(htmlUtil_1.SourceType.DIVISION, imageUri)
            + htmlUtil_1.HtmlUtil.createRemoteSourceAtNewline(htmlUtil_1.SourceType.HR)
            + htmlUtil_1.HtmlUtil.createRemoteSource(htmlUtil_1.SourceType.CUSTOM_NEWLINE)
            + htmlUtil_1.HtmlUtil.fixImageSrcLinks(this.imageSrcSnippet(imageUri));
        return htmlUtil_1.HtmlUtil.createFullHtmlSnippetFrom(head, body);
    };
    return ImageDocumentContentManager;
}());
//# sourceMappingURL=imageDocumentContentManager.js.map