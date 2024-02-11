"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
const clipanion_1 = require("clipanion");
class BaseCommand extends clipanion_1.Command {
    constructor() {
        super(...arguments);
        this.cwd = clipanion_1.Option.String(`--cwd`, { hidden: true });
    }
    validateAndExecute() {
        if (typeof this.cwd !== `undefined`)
            throw new clipanion_1.UsageError(`The --cwd option is ambiguous when used anywhere else than the very first parameter provided in the command line, before even the command path`);
        return super.validateAndExecute();
    }
}
exports.BaseCommand = BaseCommand;
