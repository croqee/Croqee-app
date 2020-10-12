"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CompetitionController {
    constructor(socketIO, server, drawingField) {
        this.drawingField = drawingField;
        this.io = socketIO(server, {
            path: `/compete/${drawingField}`,
            cookie: false
        });
        setInterval(() => {
            this.loop(this.io);
        }, 80);
    }
    reset() { }
    loop(io) { }
    findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
}
exports.CompetitionController = CompetitionController;
//# sourceMappingURL=CompetitionController.js.map