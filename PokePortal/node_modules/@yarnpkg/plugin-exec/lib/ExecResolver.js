"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecResolver = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@yarnpkg/core");
const core_2 = require("@yarnpkg/core");
const core_3 = require("@yarnpkg/core");
const constants_1 = require("./constants");
const execUtils = tslib_1.__importStar(require("./execUtils"));
// We use this for the generators to be regenerated without bumping the whole cache
const CACHE_VERSION = 2;
class ExecResolver {
    supportsDescriptor(descriptor, opts) {
        if (!descriptor.range.startsWith(constants_1.PROTOCOL))
            return false;
        return true;
    }
    supportsLocator(locator, opts) {
        if (!locator.reference.startsWith(constants_1.PROTOCOL))
            return false;
        return true;
    }
    shouldPersistResolution(locator, opts) {
        return false;
    }
    bindDescriptor(descriptor, fromLocator, opts) {
        return core_3.structUtils.bindDescriptor(descriptor, {
            locator: core_3.structUtils.stringifyLocator(fromLocator),
        });
    }
    getResolutionDependencies(descriptor, opts) {
        return {};
    }
    async getCandidates(descriptor, dependencies, opts) {
        if (!opts.fetchOptions)
            throw new Error(`Assertion failed: This resolver cannot be used unless a fetcher is configured`);
        const { path, parentLocator } = execUtils.parseSpec(descriptor.range);
        if (parentLocator === null)
            throw new Error(`Assertion failed: The descriptor should have been bound`);
        const generatorFile = await execUtils.loadGeneratorFile(core_3.structUtils.makeRange({
            protocol: constants_1.PROTOCOL,
            source: path,
            selector: path,
            params: {
                locator: core_3.structUtils.stringifyLocator(parentLocator),
            },
        }), constants_1.PROTOCOL, opts.fetchOptions);
        const generatorHash = core_3.hashUtils.makeHash(`${CACHE_VERSION}`, generatorFile).slice(0, 6);
        return [execUtils.makeLocator(descriptor, { parentLocator, path, generatorHash, protocol: constants_1.PROTOCOL })];
    }
    async getSatisfying(descriptor, dependencies, locators, opts) {
        const [locator] = await this.getCandidates(descriptor, dependencies, opts);
        return {
            locators: locators.filter(candidate => candidate.locatorHash === locator.locatorHash),
            sorted: false,
        };
    }
    async resolve(locator, opts) {
        if (!opts.fetchOptions)
            throw new Error(`Assertion failed: This resolver cannot be used unless a fetcher is configured`);
        const packageFetch = await opts.fetchOptions.fetcher.fetch(locator, opts.fetchOptions);
        const manifest = await core_3.miscUtils.releaseAfterUseAsync(async () => {
            return await core_1.Manifest.find(packageFetch.prefixPath, { baseFs: packageFetch.packageFs });
        }, packageFetch.releaseFs);
        return {
            ...locator,
            version: manifest.version || `0.0.0`,
            languageName: manifest.languageName || opts.project.configuration.get(`defaultLanguageName`),
            linkType: core_2.LinkType.HARD,
            conditions: manifest.getConditions(),
            dependencies: opts.project.configuration.normalizeDependencyMap(manifest.dependencies),
            peerDependencies: manifest.peerDependencies,
            dependenciesMeta: manifest.dependenciesMeta,
            peerDependenciesMeta: manifest.peerDependenciesMeta,
            bin: manifest.bin,
        };
    }
}
exports.ExecResolver = ExecResolver;
