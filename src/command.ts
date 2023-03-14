import { default as createDebugger } from "debug";
import { execaCommand, Options } from "execa";

const debug = createDebugger("cli");

export const command = async (cliCommand: string, options?: Options | undefined) => {
    try {
        return await execaCommand(cliCommand, options);
    } catch (error: unknown) {
        debug(error);
        return null;
    }
};
