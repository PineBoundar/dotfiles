"use strict";
var fileUrl = require("file-url");
var TextUtilReturnType = (function () {
    function TextUtilReturnType(_pos, _mark) {
        this.pos = _pos;
        this.mark = _mark;
    }
    return TextUtilReturnType;
}());
exports.TextUtilReturnType = TextUtilReturnType;
var TextUtil = (function () {
    function TextUtil() {
    }
    // 获取指定位置开始后的第一个任意mark的位置
    TextUtil.indexOf = function (editor, startPos, marks) {
        // 获取当前页面文本
        var text = editor.document.getText();
        var closestPosOfMarks = -1;
        var isAnyMarkFound = false;
        var closestMarkOfMarks = undefined;
        marks.forEach(function (mark) {
            // 获取当前扩展名的起始位置
            var startPosOfMark = text.indexOf(mark, startPos);
            if (startPosOfMark < 0) {
                return;
            }
            if (!isAnyMarkFound || startPosOfMark < closestPosOfMarks) {
                isAnyMarkFound = true;
                closestPosOfMarks = startPosOfMark;
                closestMarkOfMarks = mark;
                return;
            }
        });
        return new TextUtilReturnType(closestPosOfMarks, closestMarkOfMarks);
    };
    // 获取指定位置开始后的第一个任意mark的位置
    TextUtil.lastIndexOf = function (editor, startPos, marks) {
        // 获取当前页面文本
        var text = editor.document.getText();
        var closestPosOfMarks = -1;
        var closestMarkOfMarks = undefined;
        var isAnyMarkFound = false;
        marks.forEach(function (mark) {
            // 获取当前扩展名的起始位置
            var startPosOfMark = text.lastIndexOf(mark, startPos);
            if (startPosOfMark < 0) {
                return;
            }
            if (!isAnyMarkFound || startPosOfMark > closestPosOfMarks) {
                isAnyMarkFound = true;
                closestPosOfMarks = startPosOfMark;
                closestMarkOfMarks = mark;
                return;
            }
        });
        return new TextUtilReturnType(closestPosOfMarks, closestMarkOfMarks);
    };
    TextUtil.regexIndexOf = function (editor, startPos, regex) {
        // 获取当前页面文本
        var text = editor.document.getText();
        // var indexOf = text.substring(startPos || 0).search(regex);
        // var closestPosOfMarks = (indexOf >= 0) ? (indexOf + (startPos || 0)) : indexOf;
        // return new TextUtilReturnType(closestPosOfMarks, closestMarkOfMarks);
        regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiline ? "m" : ""));
        startPos = startPos || 0;
        // [start, end)
        var stringToWorkWith = text.substring(startPos);
        var closestPosOfMarks = -1;
        var closestMarkOfMarks = undefined;
        var result = null;
        if ((result = regex.exec(stringToWorkWith)) != null) {
            closestMarkOfMarks = result[0];
            closestPosOfMarks = result.index + startPos;
        }
        return new TextUtilReturnType(closestPosOfMarks, closestMarkOfMarks);
    };
    TextUtil.regexLastIndexOf = function (editor, startPos, regex) {
        // 获取当前页面文本
        var text = editor.document.getText();
        regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiline ? "m" : ""));
        if (typeof (startPos) == "undefined") {
            startPos = text.length;
        }
        else if (startPos < 0) {
            startPos = 0;
        }
        // [start, end)
        var stringToWorkWith = text.substring(0, startPos + 1);
        var closestPosOfMarks = -1;
        var nextStop = 0;
        var result = null;
        var closestMarkOfMarks = undefined;
        while ((result = regex.exec(stringToWorkWith)) != null) {
            closestPosOfMarks = result.index;
            closestMarkOfMarks = result[0];
            regex.lastIndex = ++nextStop;
        }
        return new TextUtilReturnType(closestPosOfMarks, closestMarkOfMarks);
    };
    // 将字符串中的%1~$n 替换为输入参数列表，变长参数，因为%0是str，所以无需替换
    // 类似C/Java的format
    TextUtil.format = function (str) {
        var args = arguments;
        var pattern = new RegExp("%([1-" + arguments.length + "])", "g");
        return String(str).replace(pattern, function (match, index) {
            return args[index];
        });
    };
    ;
    return TextUtil;
}());
exports.TextUtil = TextUtil;
//# sourceMappingURL=textUtil.js.map