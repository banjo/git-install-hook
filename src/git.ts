import { default as createDebugger } from "debug";
import { command } from "./utils";

const debug = createDebugger("git");

export const hasChanged = async (lockFile: string) => {
    const diffCommand = await command(`git diff --name-only HEAD@{1} HEAD`);

    if (!diffCommand) throw new Error("Could not get diff");

    const diff = diffCommand.stdout;
    if (!diff.includes(lockFile)) {
        debug(`No changes to ${lockFile} found, exiting`);
        return false;
    }

    return true;
};
