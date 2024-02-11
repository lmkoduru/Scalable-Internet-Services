"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGeneratorFile = exports.makeLocator = exports.makeSpec = exports.parseSpec = void 0;
const core_1 = require("@yarnpkg/core");
const fslib_1 = require("@yarnpkg/fslib");
function parseSpec(spec) {
    const { params, selector } = core_1.structUtils.parseRange(spec);
    const path = fslib_1.npath.toPortablePath(selector);
    const parentLocator = params && typeof params.locator === `string`
        ? core_1.structUtils.parseLocator(params.locator)
        : null;
    return { parentLocator, path };
}
exports.parseSpec = parseSpec;
function makeSpec({ parentLocator, path, generatorHash, protocol }) {
    const parentLocatorSpread = parentLocator !== null
        ? { locator: core_1.structUtils.stringifyLocator(parentLocator) }
        : {};
    const generatorHashSpread = typeof generatorHash !== `undefined`
        ? { hash: generatorHash }
        : {};
    return core_1.structUtils.makeRange({
        protocol,
        source: path,
        selector: path,
        params: {
            ...generatorHashSpread,
            ...parentLocatorSpread,
        },
    });
}
exports.makeSpec = makeSpec;
function makeLocator(ident, { parentLocator, path, generatorHash, protocol }) {
    return core_1.structUtils.makeLocator(ident, makeSpec({ parentLocator, path, generatorHash, protocol }));
}
exports.makeLocator = makeLocator;
async function loadGeneratorFile(range, protocol, opts) {
    const { parentLocator, path } = core_1.structUtils.parseFileStyleRange(range, { protocol });
    // If the file target is an absolute path we can directly access it via its
    // location on the disk. Otherwise we must go through the package fs.
    const parentFetch = fslib_1.ppath.isAbsolute(path)
        ? { packageFs: new fslib_1.CwdFS(fslib_1.PortablePath.root), prefixPath: fslib_1.PortablePath.dot, localPath: fslib_1.PortablePath.root }
        : await opts.fetcher.fetch(parentLocator, opts);
    // If the package fs publicized its "original location" (for example like
    // in the case of "file:" packages), we use it to derive the real location.
    const effectiveParentFetch = parentFetch.localPath
        ? { packageFs: new fslib_1.CwdFS(fslib_1.PortablePath.root), prefixPath: fslib_1.ppath.relative(fslib_1.PortablePath.root, parentFetch.localPath) }
        : parentFetch;
    // Discard the parent fs unless we really need it to access the files
    if (parentFetch !== effectiveParentFetch && parentFetch.releaseFs)
        parentFetch.releaseFs();
    const generatorFs = effectiveParentFetch.packageFs;
    const generatorPath = fslib_1.ppath.join(effectiveParentFetch.prefixPath, path);
    return await generatorFs.readFilePromise(generatorPath, `utf8`);
}
exports.loadGeneratorFile = loadGeneratorFile;
