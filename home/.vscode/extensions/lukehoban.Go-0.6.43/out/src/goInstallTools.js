/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------*/
'use strict';
var vscode = require('vscode');
var fs = require('fs');
var cp = require('child_process');
var goStatus_1 = require('./goStatus');
var goPath_1 = require('./goPath');
var goStatus_2 = require('./goStatus');
var tools = {
    'gocode': 'github.com/nsf/gocode',
    'goreturns': 'sourcegraph.com/sqs/goreturns',
    'gopkgs': 'github.com/tpng/gopkgs',
    'godef': 'github.com/rogpeppe/godef',
    'golint': 'github.com/golang/lint/golint',
    'go-outline': 'github.com/lukehoban/go-outline',
    'go-symbols': 'github.com/newhook/go-symbols',
    'guru': 'golang.org/x/tools/cmd/guru',
    'gorename': 'golang.org/x/tools/cmd/gorename'
};
function installAllTools() {
    installTools(Object.keys(tools));
}
exports.installAllTools = installAllTools;
function promptForMissingTool(tool) {
    vscode.window.showInformationMessage("The \"" + tool + "\" command is not available.  Use \"go get -v " + tools[tool] + "\" to install.", 'Install All', 'Install').then(function (selected) {
        if (selected === 'Install') {
            installTools([tool]);
        }
        else if (selected === 'Install All') {
            getMissingTools().then(installTools);
            goStatus_1.hideGoStatus();
        }
    });
}
exports.promptForMissingTool = promptForMissingTool;
function installTools(missing) {
    goStatus_2.outputChannel.show();
    goStatus_2.outputChannel.clear();
    goStatus_2.outputChannel.appendLine('Installing ' + missing.length + ' tools');
    missing.forEach(function (missingTool, index, missing) {
        goStatus_2.outputChannel.appendLine('  ' + missingTool);
    });
    goStatus_2.outputChannel.appendLine(''); // Blank line for spacing.
    missing.reduce(function (res, tool) {
        return res.then(function (sofar) { return new Promise(function (resolve, reject) {
            cp.exec('go get -u -v ' + tools[tool], { env: process.env }, function (err, stdout, stderr) {
                if (err) {
                    goStatus_2.outputChannel.appendLine('Installing ' + tool + ' FAILED');
                    var failureReason = tool + ';;' + err + stdout.toString() + stderr.toString();
                    resolve(sofar.concat([failureReason]));
                }
                else {
                    goStatus_2.outputChannel.appendLine('Installing ' + tool + ' SUCCEEDED');
                    resolve(sofar.concat([null]));
                }
            });
        }); });
    }, Promise.resolve([])).then(function (res) {
        goStatus_2.outputChannel.appendLine(''); // Blank line for spacing
        var failures = res.filter(function (x) { return x != null; });
        if (failures.length === 0) {
            goStatus_2.outputChannel.appendLine('All tools successfully installed. You\'re ready to Go :).');
            return;
        }
        goStatus_2.outputChannel.appendLine(failures.length + ' tools failed to install.\n');
        failures.forEach(function (failure, index, failures) {
            var reason = failure.split(';;');
            goStatus_2.outputChannel.appendLine(reason[0] + ':');
            goStatus_2.outputChannel.appendLine(reason[1]);
        });
    });
}
exports.installTools = installTools;
function setupGoPathAndOfferToInstallTools() {
    var goroot = vscode.workspace.getConfiguration('go')['goroot'];
    if (goroot) {
        process.env['GOROOT'] = goroot;
    }
    var gopath = vscode.workspace.getConfiguration('go')['gopath'];
    if (gopath) {
        process.env['GOPATH'] = gopath.replace(/\${workspaceRoot}/g, vscode.workspace.rootPath);
    }
    if (!process.env['GOPATH']) {
        var info_1 = 'GOPATH is not set as an environment variable or via `go.gopath` setting in Code';
        goStatus_1.showGoStatus('GOPATH not set', 'go.gopathinfo', info_1);
        vscode.commands.registerCommand('go.gopathinfo', function () {
            vscode.window.showInformationMessage(info_1);
            goStatus_1.hideGoStatus();
        });
        return;
    }
    getMissingTools().then(function (missing) {
        if (missing.length > 0) {
            goStatus_1.showGoStatus('Analysis Tools Missing', 'go.promptforinstall', 'Not all Go tools are available on the GOPATH');
            vscode.commands.registerCommand('go.promptforinstall', function () {
                promptForInstall(missing);
                goStatus_1.hideGoStatus();
            });
        }
    });
    function promptForInstall(missing) {
        var item = {
            title: 'Install',
            command: function () {
                installTools(missing);
            }
        };
        vscode.window.showInformationMessage('Some Go analysis tools are missing from your GOPATH.  Would you like to install them?', item).then(function (selection) {
            if (selection) {
                selection.command();
            }
        });
    }
}
exports.setupGoPathAndOfferToInstallTools = setupGoPathAndOfferToInstallTools;
function getMissingTools() {
    var keys = Object.keys(tools);
    return Promise.all(keys.map(function (tool) { return new Promise(function (resolve, reject) {
        var toolPath = goPath_1.getBinPath(tool);
        fs.exists(toolPath, function (exists) {
            resolve(exists ? null : tool);
        });
    }); })).then(function (res) {
        var missing = res.filter(function (x) { return x != null; });
        return missing;
    });
}
//# sourceMappingURL=goInstallTools.js.map