import { cli } from "cleye";
import { version } from "../package.json";

export const argv = cli({
    name: "git-install-hook",
    version,
    help: {
        description: `Install (or prompt for installation) when a lock file changes. 
Automatically detects the package manager to use.`,
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
        installation: {
            type: String,
            description: "Installation output (show, spinner, hide)",
            alias: "i",
            default: "show",
        },
        noText: {
            type: Boolean,
            description: "Disable text informational output",
            alias: "t",
            default: false,
        },
    },
});

export type CliType = typeof argv;
