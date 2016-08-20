"use strict";
var path = require("path");
var fileUrl = require("file-url");
var shellUtil_1 = require("./shellUtil");
var DoctuilsUtil = (function () {
    function DoctuilsUtil() {
    }
    DoctuilsUtil.doctuils = function (command, fileName) {
        return shellUtil_1.ShellUtil.execPromisLike([
            command,
            fileName
        ].join(" "));
    };
    DoctuilsUtil.doctuilsFromSouceCode = function (command, fileName) {
        // __dirname 是package.json中"main"字段对应的绝对目录
        // 生成本地文件绝对路径URI
        var source_path = path.join(__dirname, "..", "..", "..", "libs", "docutils", "tools", command);
        return shellUtil_1.ShellUtil.execPromisLike([
            "python",
            source_path,
            fileName
        ].join(" "));
    };
    DoctuilsUtil.buildhtml = function (fileName) {
        return this.doctuils("buildhtml.py", fileName);
    };
    DoctuilsUtil.rst2html = function (fileName) {
        return this.doctuils("rst2html.py", fileName);
    };
    DoctuilsUtil.rst2html5 = function (fileName) {
        return this.doctuils("rst2html5.py", fileName);
    };
    DoctuilsUtil.rst2latex = function (fileName) {
        return this.doctuils("rst2latex.py", fileName);
    };
    DoctuilsUtil.rst2man = function (fileName) {
        return this.doctuils("rst2man.py", fileName);
    };
    DoctuilsUtil.rst2odt = function (fileName) {
        return this.doctuils("rst2odt.py", fileName);
    };
    DoctuilsUtil.rst2odt_prepstyles = function (fileName) {
        return this.doctuils("rst2odt_prepstyles.py", fileName);
    };
    DoctuilsUtil.rst2pseudoxml = function (fileName) {
        return this.doctuils("rst2pseudoxml.py", fileName);
    };
    DoctuilsUtil.rst2s5 = function (fileName) {
        return this.doctuils("rst2s5.py", fileName);
    };
    DoctuilsUtil.rst2xetex = function (fileName) {
        return this.doctuils("rst2xetex.py", fileName);
    };
    DoctuilsUtil.rst2xml = function (fileName) {
        return this.doctuils("rst2xml.py", fileName);
    };
    DoctuilsUtil.rstpep2html = function (fileName) {
        return this.doctuils("rstpep2html.py", fileName);
    };
    return DoctuilsUtil;
}());
exports.DoctuilsUtil = DoctuilsUtil;
//# sourceMappingURL=doctuilsUtil.js.map