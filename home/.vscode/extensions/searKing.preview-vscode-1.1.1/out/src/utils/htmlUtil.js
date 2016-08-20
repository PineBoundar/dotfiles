"use strict";
var vscode_1 = require("vscode");
var path = require("path");
var fileUrl = require("file-url");
(function (SourceType) {
    SourceType[SourceType["BODY"] = 0] = "BODY";
    SourceType[SourceType["BR"] = 1] = "BR";
    SourceType[SourceType["COMMENT"] = 2] = "COMMENT";
    SourceType[SourceType["DIVISION"] = 3] = "DIVISION";
    SourceType[SourceType["DOCTYPE"] = 4] = "DOCTYPE";
    SourceType[SourceType["HEAD"] = 5] = "HEAD";
    SourceType[SourceType["HR"] = 6] = "HR";
    SourceType[SourceType["HTML"] = 7] = "HTML";
    SourceType[SourceType["IMAGE"] = 8] = "IMAGE";
    SourceType[SourceType["LINK"] = 9] = "LINK";
    SourceType[SourceType["SCRIPT"] = 10] = "SCRIPT";
    SourceType[SourceType["STYLE"] = 11] = "STYLE";
    SourceType[SourceType["CUSTOM_MERMAID_SAMPLE"] = 12] = "CUSTOM_MERMAID_SAMPLE";
    SourceType[SourceType["CUSTOM_STYLE_SAMPLE"] = 13] = "CUSTOM_STYLE_SAMPLE";
    SourceType[SourceType["CUSTOM_NEWLINE"] = 14] = "CUSTOM_NEWLINE"; // 返回\n
})(exports.SourceType || (exports.SourceType = {}));
var SourceType = exports.SourceType;
var HtmlUtil = (function () {
    function HtmlUtil() {
    }
    // @Override
    HtmlUtil.sendPreviewCommand = function (previewUri, displayColumn) {
        return vscode_1.commands.executeCommand(this.COMMAND, previewUri, displayColumn).then(function (success) {
        }, function (reason) {
            console.warn(reason);
            vscode_1.window.showErrorMessage(reason);
        });
    };
    HtmlUtil.createFullHtmlSnippetFrom = function (headPayLoad, bodyPayLoad) {
        return this.createRemoteSource(SourceType.DOCTYPE, this.createRemoteSource(SourceType.HTML, this.createRemoteSource(SourceType.HEAD, headPayLoad)
            + this.createRemoteSource(SourceType.CUSTOM_NEWLINE, undefined)
            + this.createRemoteSource(SourceType.BODY, bodyPayLoad)));
    };
    HtmlUtil.errorSnippet = function (error) {
        return this.createFullHtmlSnippetFrom(undefined, this.createRemoteSource(SourceType.DIVISION, error));
    };
    HtmlUtil.isWithPayLoad = function (payLoad) {
        if (!!payLoad && payLoad.length > 0) {
            return true;
        }
        return false;
    };
    // 生成本地文件对应URI的html标签代码片段
    HtmlUtil.createRemoteSourceAtNewline = function (type, payLoad) {
        return HtmlUtil.createRemoteSource(SourceType.CUSTOM_NEWLINE, HtmlUtil.createRemoteSource(type, payLoad));
    };
    // 生成本地文件对应URI的html标签代码片段
    HtmlUtil.createRemoteSource = function (type, payLoad) {
        switch (type) {
            case SourceType.BODY:
                return this.createRemoteSourceOfBODY(payLoad);
            case SourceType.BR:
                return this.createRemoteSourceOfBR(payLoad);
            case SourceType.COMMENT:
                return this.createRemoteSourceOfCOMMENT(payLoad);
            case SourceType.DIVISION:
                return this.createRemoteSourceOfDIVISION(payLoad);
            case SourceType.DOCTYPE:
                return this.createRemoteSourceOfDOCTYPE(payLoad);
            case SourceType.HEAD:
                return this.createRemoteSourceOfHEAD(payLoad);
            case SourceType.HR:
                return this.createRemoteSourceOfHR(payLoad);
            case SourceType.HTML:
                return this.createRemoteSourceOfHTML(payLoad);
            case SourceType.IMAGE:
                return this.createRemoteSourceOfIMAGE(payLoad);
            case SourceType.LINK:
                return this.createRemoteSourceOfLINK(payLoad);
            case SourceType.SCRIPT:
                return this.createRemoteSourceOfSCRIPT(payLoad);
            case SourceType.STYLE:
                return this.createRemoteSourceOfSTYLE(payLoad);
            case SourceType.CUSTOM_NEWLINE:
                return this.createRemoteSourceOfCUSTOM_NEWLINE(payLoad);
            case SourceType.CUSTOM_MERMAID_SAMPLE:
                return this.createRemoteSourceOfCUSTOM_MERMAID_SAMPLE(payLoad);
            case SourceType.CUSTOM_STYLE_SAMPLE:
                return this.createRemoteSourceOfCUSTOM_STYLE_SAMPLE(payLoad);
        }
    };
    // 生成本地文件对应URI的html标签代码片段
    HtmlUtil.createLocalSource = function (type, fileName) {
        // __dirname 是package.json中"main"字段对应的绝对目录
        // 生成本地文件绝对路径URI
        var source_path = fileUrl(path.join(__dirname, "..", "..", "..", "static", fileName));
        return this.createRemoteSource(type, source_path);
    };
    // 将html中将非http或\/开头的URI增加本地待预览html所在目录的前缀
    HtmlUtil.fixNoneNetLinks = function (document, documentPath) {
        return document.replace(
        // 子表达式的序号问题
        // 简单地说：从左向右，以分组的左括号为标志，
        // 过程是要从左向右扫描两遍的：
        // 第一遍只给未命名组分配，
        // 第二遍只给命名组分配－－因此所有命名组的组号都大于未命名的组号。
        // 可以使用(?:exp)这样的语法来剥夺一个分组对组号分配的参与权．
        // http://www.cnblogs.com/dwlsxj/p/3532458.html
        new RegExp("((?:src|href)=[\'\"])((?!http|\\/).*?)([\'\"])", "gmi"), function (subString, p1, p2, p3) {
            return [
                p1.trim(),
                fileUrl(path.join(path.dirname(documentPath), p2)).trim(),
                p3.trim()
            ].join("");
        });
    };
    // 将html中将file://去掉,且恢复默认绝对路径
    HtmlUtil.fixImageSrcLinks = function (document) {
        if (!document) {
            return document;
        }
        return document.replace(
        // 子表达式的序号问题
        // 简单地说：从左向右，以分组的左括号为标志，
        // 过程是要从左向右扫描两遍的：
        // 第一遍只给未命名组分配，
        // 第二遍只给命名组分配－－因此所有命名组的组号都大于未命名的组号。
        // 可以使用(?:exp)这样的语法来剥夺一个分组对组号分配的参与权．
        new RegExp("((?:src|href)=[\'\"])(?:file://)(.*?)([\'\"])", "gmi"), function (subString, p1, p2, p3) {
            return [
                p1.trim(),
                path.resolve("/" + p2).trim(),
                p3.trim()
            ].join("");
        });
    };
    HtmlUtil.createRemoteSourceOfBODY = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "";
        }
        return "<body>\n                    " + payLoad + "\n                </body>";
    };
    HtmlUtil.createRemoteSourceOfBR = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "<br>";
        }
        return "<br>\n                " + payLoad;
    };
    HtmlUtil.createRemoteSourceOfCOMMENT = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "";
        }
        return "<!-- " + payLoad + " -->";
    };
    HtmlUtil.createRemoteSourceOfDIVISION = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "";
        }
        return "<div>" + payLoad + "</div>";
    };
    HtmlUtil.createRemoteSourceOfDOCTYPE = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "<!DOCTYPE html>";
        }
        return "<!DOCTYPE html>\n                " + payLoad;
    };
    HtmlUtil.createRemoteSourceOfHEAD = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "";
        }
        return "<head>\n                    " + payLoad + "\n                </head>";
    };
    HtmlUtil.createRemoteSourceOfHR = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "<hr>";
        }
        return "<hr>\n                " + payLoad;
    };
    HtmlUtil.createRemoteSourceOfHTML = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "";
        }
        return "<html>\n                    " + payLoad + "\n                </html>";
    };
    HtmlUtil.createRemoteSourceOfIMAGE = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "";
        }
        return "<img src=\"" + payLoad + "\"/>";
    };
    HtmlUtil.createRemoteSourceOfLINK = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "";
        }
        return "<link href=\"" + payLoad + "\" rel=\"stylesheet\" />";
    };
    HtmlUtil.createRemoteSourceOfSCRIPT = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "";
        }
        return "<script src=\"" + payLoad + "\"></script>";
    };
    HtmlUtil.createRemoteSourceOfSTYLE = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "";
        }
        return "<style type=\"text/css\">\n                    " + payLoad + "\n                </style>";
    };
    HtmlUtil.createRemoteSourceOfCUSTOM_NEWLINE = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "\n";
        }
        return "\n" + payLoad;
    };
    HtmlUtil.createRemoteSourceOfCUSTOM_MERMAID_SAMPLE = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "";
        }
        var head = "<link href=\"" + this.getExtensionPath() + "/node_modules/mermaid/dist/mermaid.forest.css\" rel=\"stylesheet\">\n                    <script src=\"" + this.getExtensionPath() + "/node_modules/mermaid/dist/mermaid.min.js\">\n                    <script type=\"text/javascript\">\n                        mermaid.initialize({startOnLoad:true});\n                    </script>";
        var body = "\n                    <hr>\n                    <div class=\"mermaid\">\n                        " + payLoad + "\n                    </div>";
        return HtmlUtil.createFullHtmlSnippetFrom(head, body);
    };
    HtmlUtil.getExtensionPath = function () {
        return path.join(__dirname, "..", "..", "..");
    };
    HtmlUtil.createRemoteSourceOfCUSTOM_STYLE_SAMPLE = function (payLoad) {
        if (!this.isWithPayLoad(payLoad)) {
            return "";
        }
        var head = HtmlUtil.createRemoteSource(SourceType.STYLE, "#css_property {\n                " + payLoad + "\n            }");
        var body = "<div>Preview of the CSS properties\n                        {\n                            " + payLoad + "\n                        }\n                    </div>\n                    <hr>\n                    <div id=\"css_property\">Hello World</div>";
        return HtmlUtil.createFullHtmlSnippetFrom(head, body);
    };
    HtmlUtil.COMMAND = "vscode.previewHtml";
    return HtmlUtil;
}());
exports.HtmlUtil = HtmlUtil;
//# sourceMappingURL=htmlUtil.js.map