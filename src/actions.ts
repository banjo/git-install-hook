import { default as createDebugger } from "debug";
import ora from "ora";
import pc from "picocolors";
import prompts from "prompts";
import ttys from "ttys";
import { installCommandMap, PackageManager } from "./maps";
import { command } from "./utils";

const debug = createDebugger("actions");

export const installDependencies = async (packageManager: PackageManager, installation: string) => {
    const installCommand = installCommandMap[packageManager];

    if (!installCommand) {
        debug(
            `Could not find install command for package manager ${packageManager}, throwing error`
        );
        throw new Error(`Could not find install command for package manager ${packageManager}`);
    }

    const spinner = ora(pc.yellow("Installing dependencies..."));
    if (installation === "spinner") {
        debug(`Showing spinner during installation`);
        spinner.start();
    }

    debug(`Running install command: ${installCommand}`);
    const installResponse = await command(installCommand, {
        stdio: installation === "show" ? "inherit" : "ignore",
    });

    if (installation === "spinner") {
        debug(`Stopping spinner`);
        spinner.stop();
    }

    if (!installResponse) {
        debug(`Install command failed, throwing error`);
        throw new Error(`Could not install dependencies`);
    }
};

export const promptForInstall = async () => {
    debug("Prompting user for install");

    const prompt = await prompts({
        type: "toggle",
        name: "value",
        message: pc.yellow("Dependencies have been updated, do you want to install?"),
        active: "yes",
        inactive: "no",
        initial: true,
        stdin: ttys.stdin,
    });

    if (!prompt.value) {
        debug("User declined to install, exiting");
        return false;
    }

    return true;
};
