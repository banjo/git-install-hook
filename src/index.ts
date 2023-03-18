#!/usr/bin/env node

import { default as createDebugger } from "debug";
import pc from "picocolors";
import { installDependencies, promptForInstall } from "./actions";
import { argv, CliType } from "./cli";
import { hasChanged } from "./git";
import { getPackageManager } from "./package-manager";

const main = async (args: CliType) => {
    if (args.flags.debug) createDebugger.enable("*");

    const { noText, installation } = args.flags;
    const showText = !noText;

    const { lockFile, packageManager } = await getPackageManager();

    if (!(await hasChanged(lockFile))) {
        if (showText) console.log(pc.green("📦 No changes to lock file"));
        process.exit(0);
    }

    if (args.flags.prompt) {
        const shouldInstall = await promptForInstall();
        if (!shouldInstall) process.exit(0);
    } else if (showText) {
        console.log(pc.yellow(`📦 Changes detected to ${lockFile}`));
    }

    await installDependencies(packageManager, installation);
    if (showText) console.log(pc.green("✅ Installation done!"));
};

main(argv);
