'use strict';
var vscode = require('vscode');
var path = require("path");
var open = require('open');
function activate(context) {
    var disposable = vscode.commands.registerCommand('extension.viewInBrowser', function () {
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('no active text editor!');
            return;
        }
        var file = editor.document.fileName;
        var ext = path.extname(file);
        if (/^\.(html|htm|shtml|xhtml)$/.test(ext)) {
            open("file:///" + file);
        }
        else {
            vscode.window.showInformationMessage('support html file only!');
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map