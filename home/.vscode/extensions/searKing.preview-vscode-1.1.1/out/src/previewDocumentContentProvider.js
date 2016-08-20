"use strict";
var vscode_1 = require("vscode");
var path = require("path");
var htmlDocumentContentManager = require("./htmlDocumentContentManager");
var markdownDocumentContentManager = require("./markdownDocumentContentManager");
var imageDocumentContentManager = require("./imageDocumentContentManager");
var cssDocumentContentManager = require("./cssDocumentContentManager");
var mermaidDocumentContentManager = require("./mermaidDocumentContentManager");
var reStructuredTextDocumentContentManager = require("./reStructuredTextDocumentContentManager");
var noneDocumentContentManager = require("./noneDocumentContentManager");
var vscodeUtil_1 = require("./utils/vscodeUtil");
var TextDocumentType;
(function (TextDocumentType) {
    TextDocumentType[TextDocumentType["HTML"] = 0] = "HTML";
    TextDocumentType[TextDocumentType["MARKDOWN"] = 1] = "MARKDOWN";
})(TextDocumentType || (TextDocumentType = {}));
var PreviewDocumentContentProvider = (function () {
    function PreviewDocumentContentProvider() {
        // 观察者模式，生成一个事件发生器
        this._onDidChange = new vscode_1.EventEmitter();
        this._documentContentManager = null;
    }
    Object.defineProperty(PreviewDocumentContentProvider, "previewScheme", {
        get: function () {
            return PreviewDocumentContentProvider.PREVIEW_SCHEME;
        },
        enumerable: true,
        configurable: true
    });
    PreviewDocumentContentProvider.prototype.refreshCurrentDocumentContentProvide = function () {
        var editor = vscode_1.window.activeTextEditor;
        var thiz = this;
        //防止在一次预览命令下重复弹出选择预览类型的对话框
        return vscodeUtil_1.VscodeUtil.getPreviewType(editor, !!thiz._documentContentManager).then(function (previewType) {
            switch (previewType) {
                case "html":
                case "jade":
                    thiz._documentContentManager = htmlDocumentContentManager.getInstance();
                    break;
                case "markdown":
                    thiz._documentContentManager = markdownDocumentContentManager.getInstance();
                    break;
                case "css":
                    thiz._documentContentManager = cssDocumentContentManager.getInstance();
                    break;
                case "mermaid":
                    thiz._documentContentManager = mermaidDocumentContentManager.getInstance();
                    break;
                case "rst":
                    thiz._documentContentManager = reStructuredTextDocumentContentManager.getInstance();
                    break;
                case "image":
                    thiz._documentContentManager = imageDocumentContentManager.getInstance();
                    break;
                default:
                    if (!thiz._documentContentManager) {
                        thiz._documentContentManager = noneDocumentContentManager.getInstance();
                    }
                    break;
            }
            return Promise.resolve();
        });
    };
    // @Override 生成当前html规范化的代码文本，编辑器会自动根据该函数的返回值创建一个只读文档
    // uri是scheme
    PreviewDocumentContentProvider.prototype.provideTextDocumentContent = function (uri) {
        var thiz = this;
        return this.refreshCurrentDocumentContentProvide().then(function () {
            return thiz._documentContentManager.createContentSnippet();
        });
    };
    Object.defineProperty(PreviewDocumentContentProvider.prototype, "onDidChange", {
        // @Override 获取文档变化这个监听事件，给vscode调用
        // 该事件用来向外公开观察者模式，外部监听者通过该接口注册监听，获知文档的变动情况
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    // 通知监听者发生待预览HTML文本变化事件
    PreviewDocumentContentProvider.prototype.update = function () {
        var previewUri = PreviewDocumentContentProvider.getPreviewUri();
        this._onDidChange.fire(previewUri);
    };
    PreviewDocumentContentProvider.prototype.sendPreviewCommand = function (displayColumn) {
        var thiz = this;
        return this.refreshCurrentDocumentContentProvide().then(function () {
            // 生成预览临时文件的URI
            var previewUri = PreviewDocumentContentProvider.getPreviewUri();
            return thiz._documentContentManager.sendPreviewCommand(previewUri, displayColumn)
                .then(function () {
                //主动触发文本更新，因为当预览命令发生变化的时候
                //对于不能判断文本类型的，会弹出文本选择对话框，但是由于文本没有发生变化
                //所以监听者被通知内容更新，还会显示之前缓存下来的内容
                //故而，主动触发通知监听者强制刷新缓存
                return thiz.update();
            });
        });
    };
    PreviewDocumentContentProvider.getPreviewTitle = function () {
        return "Preview: '" + path.basename(vscode_1.window.activeTextEditor.document.fileName) + "'";
    };
    PreviewDocumentContentProvider.getPreviewUri = function () {
        // 预览窗口标题
        var previewTitle = this.getPreviewTitle();
        return vscode_1.Uri.parse(PreviewDocumentContentProvider.previewScheme + "://preview/" + previewTitle);
    };
    PreviewDocumentContentProvider.PREVIEW_SCHEME = "vscode-preview";
    return PreviewDocumentContentProvider;
}());
exports.PreviewDocumentContentProvider = PreviewDocumentContentProvider;
//# sourceMappingURL=previewDocumentContentProvider.js.map