"use strict";
const mode_1 = require('./mode');
const mode_2 = require('./mode');
class MultiCursorVisualMode extends mode_1.Mode {
    constructor() {
        super(mode_1.ModeName.MultiCursorVisual);
        this.isVisualMode = true;
        this.text = "Multi Cursor Visual Mode";
        this.cursorType = mode_2.VSCodeVimCursorType.Native;
    }
}
exports.MultiCursorVisualMode = MultiCursorVisualMode;
//# sourceMappingURL=modeMultiCursorVisual.js.map