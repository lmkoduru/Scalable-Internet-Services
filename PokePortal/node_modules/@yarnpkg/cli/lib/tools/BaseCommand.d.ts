import { CommandContext } from '@yarnpkg/core';
import { Command } from 'clipanion';
export declare abstract class BaseCommand extends Command<CommandContext> {
    cwd: string | undefined;
    abstract execute(): Promise<number | void>;
    validateAndExecute(): Promise<number>;
}
