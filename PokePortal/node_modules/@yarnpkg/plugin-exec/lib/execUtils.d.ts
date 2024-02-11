import { FetchOptions, Ident, Locator } from '@yarnpkg/core';
import { PortablePath } from '@yarnpkg/fslib';
export declare function parseSpec(spec: string): {
    parentLocator: Locator | null;
    path: PortablePath;
};
export declare function makeSpec({ parentLocator, path, generatorHash, protocol }: {
    parentLocator: Locator | null;
    path: string;
    generatorHash?: string;
    protocol: string;
}): string;
export declare function makeLocator(ident: Ident, { parentLocator, path, generatorHash, protocol }: Parameters<typeof makeSpec>[number]): Locator;
export declare function loadGeneratorFile(range: string, protocol: string, opts: FetchOptions): Promise<string>;
