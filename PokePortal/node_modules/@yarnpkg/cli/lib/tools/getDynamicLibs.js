"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamicLibs = void 0;
const tslib_1 = require("tslib");
const cli = tslib_1.__importStar(require("@yarnpkg/cli"));
const core = tslib_1.__importStar(require("@yarnpkg/core"));
const fslib = tslib_1.__importStar(require("@yarnpkg/fslib"));
const libzip = tslib_1.__importStar(require("@yarnpkg/libzip"));
const parsers = tslib_1.__importStar(require("@yarnpkg/parsers"));
const shell = tslib_1.__importStar(require("@yarnpkg/shell"));
const clipanion = tslib_1.__importStar(require("clipanion"));
const semver = tslib_1.__importStar(require("semver"));
const typanion = tslib_1.__importStar(require("typanion"));
const getDynamicLibs = () => new Map([
    [`@yarnpkg/cli`, cli],
    [`@yarnpkg/core`, core],
    [`@yarnpkg/fslib`, fslib],
    [`@yarnpkg/libzip`, libzip],
    [`@yarnpkg/parsers`, parsers],
    [`@yarnpkg/shell`, shell],
    // Those ones are always useful
    [`clipanion`, clipanion],
    [`semver`, semver],
    [`typanion`, typanion],
]);
exports.getDynamicLibs = getDynamicLibs;
