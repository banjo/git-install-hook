#!/usr/bin/env node

import { cli } from "cleye";
import { default as createDebugger } from "debug";
import { globby } from "globby";
import { version } from "../package.json";
import { command } from "./command";

console.log(); // Add a newline

const argv = cli({
    name: "git-install-hook",
    version,
    help: {
        description: "Install (or prompt for installation) when a lock file changes",
    },
    flags: {
        debug: {
            type: Boolean,
            description: "Enable debug mode",
            alias: "d",
            default: false,
        },
        prompt: {
            type: Boolean,
            description: "Prompt for installation on lock file change",
            alias: "p",
            default: false,
        },
    },
});

type CliType = typeof argv;

const main = async (args: CliType) => {
    const debug = createDebugger("git-install-hook");
    if (args.flags.debug) createDebugger.enable("*");

    const defaultPackageManager = "npm";
    const lockFileMap = {
        npm: "package-lock.json",
        yarn: "yarn.lock",
        pnpm: "pnpm-lock.yaml",
    };

    const lockFiles = await globby(Object.values(lockFileMap), {
        ignore: ["node_modules"],
        gitignore: true,
    });

    debug(`Found lock files: ${lockFiles}`);

    let selectedLockFile;

    if (lockFiles.length === 0 || lockFiles.length > 1) {
        debug(`No (or multiple) lock file(s) found, using ${defaultPackageManager} as default`);
        selectedLockFile = lockFileMap[defaultPackageManager];
    }

    if (lockFiles.length === 1) {
        selectedLockFile = lockFiles[0];
        debug(`Using single lock file: ${selectedLockFile}`);
    }

    const res = await command(`git diff --name-only HEAD@{1} HEAD | grep ${selectedLockFile}`);

    if (!res) {
        console.log("Could not execute git command, exiting");
        process.exit(1);
    }
};

main(argv);
