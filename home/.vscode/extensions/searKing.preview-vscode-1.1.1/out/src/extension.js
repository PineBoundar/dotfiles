"use strict";
var vscode_1 = require("vscode");
var previewDocumentContentProvider_1 = require("./previewDocumentContentProvider");
// 主函数
function activate(context) {
    // 文本内容提供者
    var provider;
    var registration;
    // 向vscode注册当前文件发生变化时的回调函数
    vscode_1.workspace.onDidChangeTextDocument(function (e) {
        if (e.document === vscode_1.window.activeTextEditor.document) {
            // 由于文档变动必然在插件启动之后，而插件启动时就已经创建了provider
            // 因此不存在该变量未定义的问题
            provider.update();
        }
    });
    vscode_1.window.onDidChangeTextEditorSelection(function (e) {
        if (e.textEditor === vscode_1.window.activeTextEditor) {
            provider.update();
        }
    });
    function registerPreviewDocumentContentProvider() {
        provider = new previewDocumentContentProvider_1.PreviewDocumentContentProvider();
        // 向vscode为文本内容数据库注册一个URI的协议scheme，以后均可通过该协议与文本内容数据库进行交互
        // html-preview 通过这个scheme访问的内容，都是通过该provider获得的
        registration = vscode_1.workspace.registerTextDocumentContentProvider(previewDocumentContentProvider_1.PreviewDocumentContentProvider.previewScheme, provider);
    }
    // 调用vscode系统命令预览当前HTML页面
    function sendPreviewCommand(displayColumn) {
        registerPreviewDocumentContentProvider();
        // 给vscode发送预览该临时HTML文件的命令
        provider.sendPreviewCommand(displayColumn).catch(function (error) {
            console.error("we got an error: " + error);
        });
        return;
    }
    // 调用vscode系统命令预览当前之前的页面
    function sendBackviewCommand() {
        // 给vscode发送返回预览之前页面的位置
        return vscode_1.commands.executeCommand("workbench.action.navigateBack").then(function (success) {
        }, function (reason) {
            console.warn(reason);
            vscode_1.window.showErrorMessage(reason);
        });
    }
    // 调用vscode系统命令预览当前之前的页面
    function sendCloseviewCommand() {
        // 给vscode发送返回预览之前页面的位置
        return vscode_1.commands.executeCommand("workbench.action.closeActiveEditor").then(function (success) {
        }, function (reason) {
            console.warn(reason);
            vscode_1.window.showErrorMessage(reason);
        });
    }
    function getSpiltColumn() {
        var displayColumn;
        // 在拆分窗口右侧显示预览界面，若当前待预览HTML文件在最右侧，则覆盖显示
        switch (vscode_1.window.activeTextEditor.viewColumn) {
            case vscode_1.ViewColumn.One:
                displayColumn = vscode_1.ViewColumn.Two;
                break;
            case vscode_1.ViewColumn.Two:
            case vscode_1.ViewColumn.Three:
                displayColumn = vscode_1.ViewColumn.Three;
                break;
            default:
                displayColumn = vscode_1.window.activeTextEditor.viewColumn;
                break;
        }
        return displayColumn;
    }
    // 命令回调函数，该命令在package.json中与快捷方式、菜单选项等关联
    // 侧边栏打开预览界面
    var previewToSide = vscode_1.commands.registerCommand("extension.previewToSide", function () {
        if (vscode_1.window.activeTextEditor == undefined) {
            return sendCloseviewCommand();
        }
        var displayColumn = getSpiltColumn();
        return sendPreviewCommand(displayColumn);
    });
    // 覆盖显示预览界面
    var preview = vscode_1.commands.registerCommand("extension.preview", function () {
        if (vscode_1.window.activeTextEditor == undefined) {
            return sendBackviewCommand();
        }
        return sendPreviewCommand(vscode_1.window.activeTextEditor.viewColumn);
    });
    // 注册当前插件由激活变为非激活状态后，自动销毁这些回调函数和资源
    context.subscriptions.push(preview, previewToSide, registration);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    console.log("Preview Extension Shutdown");
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map