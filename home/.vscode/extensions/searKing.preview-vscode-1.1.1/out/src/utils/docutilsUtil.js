"use strict";
var path = require("path");
var fileUrl = require("file-url");
var shellUtil_1 = require("./shellUtil");
var DocutilsUtil = (function () {
    function DocutilsUtil() {
    }
    DocutilsUtil.docutils = function (command, fileName) {
        return shellUtil_1.ShellUtil.execPromisLike([
            command,
            fileName
        ].join(" "));
    };
    DocutilsUtil.docutilsFromSouceCode = function (command, fileName) {
        // __dirname 是package.json中"main"字段对应的绝对目录
        // 生成本地文件绝对路径URI
        var source_path = path.join(__dirname, "..", "..", "..", "libs", "docutils", "tools", command);
        return shellUtil_1.ShellUtil.execPromisLike([
            "python",
            source_path,
            fileName
        ].join(" "));
    };
    DocutilsUtil.buildhtml = function (fileName) {
        return this.docutils("buildhtml.py", fileName);
    };
    DocutilsUtil.rst2html = function (fileName) {
        return this.docutils("rst2html.py", fileName);
    };
    DocutilsUtil.rst2html5 = function (fileName) {
        return this.docutils("rst2html5.py", fileName);
    };
    DocutilsUtil.rst2latex = function (fileName) {
        return this.docutils("rst2latex.py", fileName);
    };
    DocutilsUtil.rst2man = function (fileName) {
        return this.docutils("rst2man.py", fileName);
    };
    DocutilsUtil.rst2odt = function (fileName) {
        return this.docutils("rst2odt.py", fileName);
    };
    DocutilsUtil.rst2odt_prepstyles = function (fileName) {
        return this.docutils("rst2odt_prepstyles.py", fileName);
    };
    DocutilsUtil.rst2pseudoxml = function (fileName) {
        return this.docutils("rst2pseudoxml.py", fileName);
    };
    DocutilsUtil.rst2s5 = function (fileName) {
        return this.docutils("rst2s5.py", fileName);
    };
    DocutilsUtil.rst2xetex = function (fileName) {
        return this.docutils("rst2xetex.py", fileName);
    };
    DocutilsUtil.rst2xml = function (fileName) {
        return this.docutils("rst2xml.py", fileName);
    };
    DocutilsUtil.rstpep2html = function (fileName) {
        return this.docutils("rstpep2html.py", fileName);
    };
    return DocutilsUtil;
}());
exports.DocutilsUtil = DocutilsUtil;
//# sourceMappingURL=docutilsUtil.js.map