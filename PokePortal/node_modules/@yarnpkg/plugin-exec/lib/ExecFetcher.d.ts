import { Locator } from '@yarnpkg/core';
import { Fetcher, FetchOptions, MinimalFetchOptions } from '@yarnpkg/core';
import { PortablePath, NativePath } from '@yarnpkg/fslib';
/**
 * Contains various useful details about the execution context.
 */
export interface ExecEnv {
    /**
     * The absolute path of the empty temporary directory. It is created before the script is invoked.
     */
    tempDir: NativePath;
    /**
     * The absolute path of the empty build directory that will be compressed into an archive and stored within the cache. It is created before the script is invoked.
     */
    buildDir: NativePath;
    /**
     * The stringified Locator identifying the generator package.
     */
    locator: string;
}
export declare class ExecFetcher implements Fetcher {
    supports(locator: Locator, opts: MinimalFetchOptions): boolean;
    getLocalPath(locator: Locator, opts: FetchOptions): PortablePath | null;
    fetch(locator: Locator, opts: FetchOptions): Promise<{
        packageFs: import("@yarnpkg/fslib").FakeFS<PortablePath>;
        releaseFs: () => void;
        prefixPath: PortablePath;
        localPath: PortablePath | null;
        checksum: string | null;
    }>;
    private fetchFromDisk;
    private generatePackage;
}
