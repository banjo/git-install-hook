#!/usr/bin/env node

import { default as createDebugger } from "debug";
import { installDependencies, promptForInstall } from "./actions";
import { argv, CliType } from "./cli";
import { hasChanged } from "./git";
import { getPackageManager } from "./package-manager";

const main = async (args: CliType) => {
    if (args.flags.debug) createDebugger.enable("*");
    const { lockFile, packageManager } = await getPackageManager();

    if (!(await hasChanged(lockFile))) {
        console.log("📦 No changes to lock file");
        process.exit(0);
    }

    if (args.flags.prompt) {
        const shouldInstall = await promptForInstall();
        if (!shouldInstall) process.exit(0);
    }

    console.log(`${args.flags.prompt ? "" : "📦 "}Installing updated dependencies`);
    await installDependencies(packageManager);
    console.log("✅ Installed updated dependencies");
};

main(argv);
