import { objectKeys } from "@banjoanton/utils";
import { default as createDebugger } from "debug";
import { globby } from "globby";
import { DEFAULT_PACKAGE_MANAGER, lockFileMap } from "./maps";

const debug = createDebugger("package-manager");

export const getPackageManager = async () => {
    const lockFiles = await globby(Object.values(lockFileMap), {
        ignore: ["node_modules"],
        gitignore: false,
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

    return {
        lockFile: selectedLockFile,
        packageManager: selectedPackageManager,
    };
};
