/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------*/
"use strict";
var assert = require('assert');
var fs = require('fs-extra');
var path = require('path');
var vscode = require('vscode');
var goExtraInfo_1 = require('../src/goExtraInfo');
var goSuggest_1 = require('../src/goSuggest');
var goSignature_1 = require('../src/goSignature');
var goCheck_1 = require('../src/goCheck');
suite('Go Extension Tests', function () {
    var gopath = process.env['GOPATH'];
    var repoPath = path.join(gopath, 'src', '___testrepo');
    var fixturePath = path.join(repoPath, 'test', 'testfixture');
    var fixtureSourcePath = path.join(__dirname, '..', '..', 'test', 'fixtures');
    suiteSetup(function () {
        assert.ok(gopath !== null, 'GOPATH is not defined');
        fs.removeSync(repoPath);
        fs.mkdirsSync(fixturePath);
        fs.copySync(path.join(fixtureSourcePath, 'test.go'), path.join(fixturePath, 'test.go'));
        fs.copySync(path.join(fixtureSourcePath, 'errors.go'), path.join(fixturePath, 'errors.go'));
    });
    suiteTeardown(function () {
        fs.removeSync(repoPath);
    });
    test('Test Hover Provider', function (done) {
        var provider = new goExtraInfo_1.GoHoverProvider();
        var printlnDoc = "Println formats using the default formats for its operands and writes to\nstandard output. Spaces are always added between operands and a newline\nis appended. It returns the number of bytes written and any write error\nencountered.\n";
        var testCases = [
            // [new vscode.Position(3,3), '/usr/local/go/src/fmt'],
            [new vscode.Position(9, 6), 'main func()', null],
            [new vscode.Position(7, 2), 'import (fmt "fmt")', null],
            [new vscode.Position(7, 6), 'Println func(a ...interface{}) (n int, err error)', printlnDoc],
            [new vscode.Position(10, 3), 'print func(txt string)', null]
        ];
        var uri = vscode.Uri.file(path.join(fixturePath, 'test.go'));
        vscode.workspace.openTextDocument(uri).then(function (textDocument) {
            var promises = testCases.map(function (_a) {
                var position = _a[0], expectedSignature = _a[1], expectedDocumentation = _a[2];
                return provider.provideHover(textDocument, position, null).then(function (res) {
                    if (expectedDocumentation === null) {
                        assert.equal(res.contents.length, 1);
                    }
                    else {
                        assert.equal(res.contents.length, 2);
                        assert.equal(expectedDocumentation, (res.contents[0]));
                    }
                    assert.equal(expectedSignature, res.contents[res.contents.length - 1].value);
                });
            });
            return Promise.all(promises);
        }, function (err) {
            assert.ok(false, "error in OpenTextDocument " + err);
        }).then(function () { return done(); }, done);
    });
    test('Test Completion', function (done) {
        var provider = new goSuggest_1.GoCompletionItemProvider();
        var testCases = [
            [new vscode.Position(1, 0), []],
            [new vscode.Position(4, 1), ['main', 'print', 'fmt']],
            [new vscode.Position(7, 4), ['fmt']],
            [new vscode.Position(8, 0), ['main', 'print', 'fmt', 'txt']]
        ];
        var uri = vscode.Uri.file(path.join(fixturePath, 'test.go'));
        vscode.workspace.openTextDocument(uri).then(function (textDocument) {
            var promises = testCases.map(function (_a) {
                var position = _a[0], expected = _a[1];
                return provider.provideCompletionItems(textDocument, position, null).then(function (items) {
                    var labels = items.map(function (x) { return x.label; });
                    for (var _i = 0, expected_1 = expected; _i < expected_1.length; _i++) {
                        var entry = expected_1[_i];
                        if (labels.indexOf(entry) < 0) {
                            assert.fail('', entry, 'missing expected item in competion list');
                        }
                    }
                });
            });
            return Promise.all(promises);
        }, function (err) {
            assert.ok(false, "error in OpenTextDocument " + err);
        }).then(function () { return done(); }, done);
    });
    test('Test Signature Help', function (done) {
        var provider = new goSignature_1.GoSignatureHelpProvider();
        var testCases = [
            [new vscode.Position(7, 13), 'Println(a ...interface{}) (n int, err error)'],
            [new vscode.Position(10, 7), 'print(txt string)']
        ];
        var uri = vscode.Uri.file(path.join(fixturePath, 'test.go'));
        vscode.workspace.openTextDocument(uri).then(function (textDocument) {
            var promises = testCases.map(function (_a) {
                var position = _a[0], expected = _a[1];
                return provider.provideSignatureHelp(textDocument, position, null).then(function (sigHelp) {
                    assert.equal(sigHelp.signatures.length, 1, 'unexpected number of overloads');
                    assert.equal(sigHelp.signatures[0].label, expected);
                });
            });
            return Promise.all(promises);
        }, function (err) {
            assert.ok(false, "error in OpenTextDocument " + err);
        }).then(function () { return done(); }, done);
    });
    test('Error checking', function (done) {
        var config = vscode.workspace.getConfiguration('go');
        var expected = [
            { line: 7, severity: 'warning', msg: 'exported function Print2 should have comment or be unexported' },
            // { line: 7, severity: 'warning', msg: 'no formatting directive in Printf call' },
            { line: 11, severity: 'error', msg: 'undefined: prin' },
        ];
        goCheck_1.check(path.join(fixturePath, 'errors.go'), config).then(function (diagnostics) {
            var sortedDiagnostics = diagnostics.sort(function (a, b) { return a.line - b.line; });
            for (var i in expected) {
                assert.equal(sortedDiagnostics[i].line, expected[i].line);
                assert.equal(sortedDiagnostics[i].severity, expected[i].severity);
                assert.equal(sortedDiagnostics[i].msg, expected[i].msg);
            }
            assert.equal(sortedDiagnostics.length, expected.length, "too many errors " + JSON.stringify(sortedDiagnostics));
        }).then(function () { return done(); }, done);
    });
    test('Gometalinter error checking', function (done) {
        var config = vscode.workspace.getConfiguration('go');
        config['lintTool'] = 'gometalinter';
        var expected = [
            { line: 7, severity: 'warning', msg: 'Print2 is unused (deadcode)' },
            { line: 11, severity: 'warning', msg: 'error return value not checked (undeclared name: prin) (errcheck)' },
            { line: 7, severity: 'warning', msg: 'exported function Print2 should have comment or be unexported (golint)' },
            { line: 10, severity: 'warning', msg: 'main2 is unused (deadcode)' },
            { line: 11, severity: 'warning', msg: 'undeclared name: prin (aligncheck)' },
            { line: 11, severity: 'warning', msg: 'undeclared name: prin (gotype)' },
            { line: 11, severity: 'warning', msg: 'undeclared name: prin (interfacer)' },
            { line: 11, severity: 'warning', msg: 'undeclared name: prin (unconvert)' },
            { line: 11, severity: 'error', msg: 'undefined: prin' },
            { line: 11, severity: 'warning', msg: 'unused global variable undeclared name: prin (varcheck)' },
            { line: 11, severity: 'warning', msg: 'unused struct field undeclared name: prin (structcheck)' },
        ];
        goCheck_1.check(path.join(fixturePath, 'errors.go'), config).then(function (diagnostics) {
            var sortedDiagnostics = diagnostics.sort(function (a, b) {
                if (a.msg < b.msg)
                    return -1;
                if (a.msg > b.msg)
                    return 1;
                return 0;
            });
            for (var i in expected) {
                assert.equal(sortedDiagnostics[i].line, expected[i].line, "Failed to match expected error #" + i + ": " + JSON.stringify(sortedDiagnostics));
                assert.equal(sortedDiagnostics[i].severity, expected[i].severity, "Failed to match expected error #" + i + ": " + JSON.stringify(sortedDiagnostics));
                assert.equal(sortedDiagnostics[i].msg, expected[i].msg, "Failed to match expected error #" + i + ": " + JSON.stringify(sortedDiagnostics));
            }
            assert.equal(sortedDiagnostics.length, expected.length, "too many errors " + JSON.stringify(sortedDiagnostics));
        }).then(function () { return done(); }, done);
    });
});
//# sourceMappingURL=go.test.js.map