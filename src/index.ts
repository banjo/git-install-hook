#!/usr/bin/env node

import { objectKeys } from "@banjoanton/utils";
import { default as createDebugger } from "debug";
import { globby } from "globby";
import prompts from "prompts";
import { argv, CliType } from "./cli";
import { command } from "./command";
import { DEFAULT_PACKAGE_MANAGER, installCommandMap, lockFileMap } from "./maps";

const main = async (args: CliType) => {
    const debug = createDebugger("git-install-hook");
    if (args.flags.debug) createDebugger.enable("*");

    const lockFiles = await globby(Object.values(lockFileMap), {
        ignore: ["node_modules"],
        gitignore: true,
    });

    debug(`Found lock files: ${lockFiles}`);

    let selectedLockFile = lockFileMap[DEFAULT_PACKAGE_MANAGER];

    if (lockFiles.length === 0 || lockFiles.length > 1) {
        debug(`No (or multiple) lock file(s) found, using ${DEFAULT_PACKAGE_MANAGER} as default`);
    }

    if (lockFiles.length === 1) {
        selectedLockFile = lockFiles[0];
        debug(`Using single lock file: ${selectedLockFile}`);
    }

    const selectedPackageManager = objectKeys(lockFileMap).find(
        key => lockFileMap[key] === selectedLockFile
    );

    if (!selectedPackageManager) {
        debug(`Could not find package manager for lock file ${selectedLockFile}, exiting`);
        throw new Error(`Could not find package manager for lock file ${selectedLockFile}`);
    }

    const diffCommand = await command(`git diff --name-only HEAD@{1} HEAD`);

    if (!diffCommand) {
        console.log("Could not execute git command, exiting");
        process.exit(1);
    }

    const diff = diffCommand.stdout;
    if (!diff.includes(selectedLockFile)) {
        debug(`No changes to ${selectedLockFile}, exiting`);
        process.exit(0);
    }

    if (args.flags.prompt) {
        console.log(`📦 Changes detected to ${selectedLockFile}, do you want to install?`);
        const answer = await prompts({
            type: "confirm",
            name: "value",
            message: "Do you want to install now?",
            initial: true,
        });

        if (!answer.value) {
            debug("User declined to install, exiting");
            process.exit(0);
        }
    }

    const installCommand = installCommandMap[selectedPackageManager];

    if (!installCommand) {
        debug(
            `Could not find install command for package manager ${selectedPackageManager}, exiting`
        );
        throw new Error(
            `Could not find install command for package manager ${selectedPackageManager}`
        );
    }

    debug(`Running install command: ${installCommand}`);

    await command(installCommand, { stdio: "inherit" });
};

main(argv);
