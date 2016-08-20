'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var appInsightsClient_1 = require('./appInsightsClient');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "terminal" is now active!');
    var terminal = new Terminal();
    var run = vscode.commands.registerCommand('terminal.run', function () {
        terminal.run();
    });
    var stop = vscode.commands.registerCommand('terminal.stop', function () {
        terminal.stop();
    });
    context.subscriptions.push(run);
    context.subscriptions.push(stop);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
/**
 * Terminal
 */
var Terminal = (function () {
    function Terminal() {
        this._outputChannel = vscode.window.createOutputChannel('Terminal');
        this._outputChannel.appendLine('[Notice] This extension will have limited updates in the future, try Code Runner: https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner with more functions and supports!');
        this._outputChannel.appendLine('');
        this._appInsightsClient = new appInsightsClient_1.AppInsightsClient();
    }
    Terminal.prototype.run = function () {
        this._appInsightsClient.sendEvent("run");
        if (this._isRunning) {
            vscode.window.showInformationMessage('Command(s) are already running!');
            return;
        }
        var commands = this.getCommands();
        if (commands.length == 0) {
            vscode.window.showInformationMessage('No commands found or selected.');
            return;
        }
        this._isRunning = true;
        this.ExecuteCommands(commands);
    };
    Terminal.prototype.stop = function () {
        this._appInsightsClient.sendEvent("stop");
        if (this._isRunning) {
            this._isRunning = false;
            var kill = require('tree-kill');
            kill(this._process.pid);
            this._outputChannel.appendLine('');
            this._outputChannel.appendLine('Command(s) stopped.');
        }
    };
    Terminal.prototype.getCommands = function () {
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return [];
        }
        var selection = editor.selection;
        var text = selection.isEmpty ? editor.document.getText() : editor.document.getText(selection);
        var commands = text.trim().split(/\s*[\r\n]+\s*/g).filter(this.filterEmptyString);
        return commands;
    };
    Terminal.prototype.filterEmptyString = function (value) {
        return value.length > 0;
    };
    Terminal.prototype.ExecuteCommands = function (commands) {
        this._outputChannel.show(true);
        this.ExecuteCommand(commands, 0);
    };
    Terminal.prototype.ExecuteCommand = function (commands, index) {
        var _this = this;
        if (index >= commands.length) {
            this._isRunning = false;
            return;
        }
        if (this._isRunning) {
            var exec = require('child_process').exec;
            this._outputChannel.appendLine('>> ' + commands[index]);
            this._process = exec(commands[index]);
            this._process.stdout.on('data', function (data) {
                _this._outputChannel.append(data);
            });
            this._process.stderr.on('data', function (data) {
                _this._outputChannel.append(data);
            });
            this._process.on('close', function (code) {
                _this._outputChannel.appendLine('');
                _this.ExecuteCommand(commands, index + 1);
            });
        }
    };
    return Terminal;
}());
//# sourceMappingURL=extension.js.map