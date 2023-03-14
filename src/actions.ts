import { default as createDebugger } from "debug";
import prompts from "prompts";
import { installCommandMap, PackageManager } from "./maps";
import { command } from "./utils";

const debug = createDebugger("actions");

export const installDependencies = async (packageManager: PackageManager) => {
    const installCommand = installCommandMap[packageManager];

    if (!installCommand) {
        debug(
            `Could not find install command for package manager ${packageManager}, throwing error`
        );
        throw new Error(`Could not find install command for package manager ${packageManager}`);
    }

    debug(`Running install command: ${installCommand}`);
    const installResponse = await command(installCommand, { stdio: "inherit" });

    if (!installResponse) {
        debug(`Install command failed, throwing error`);
        throw new Error(`Could not install dependencies`);
    }
};

export const promptForInstall = async () => {
    const answer = await prompts({
        type: "confirm",
        name: "value",
        message: "Do you want to install now?",
        initial: true,
    });

    if (!answer.value) {
        debug("User declined to install, exiting");
        return false;
    }

    return true;
};
