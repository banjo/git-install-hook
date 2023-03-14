export const packageManagers = ["npm", "yarn", "pnpm"] as const;
export type PackageManager = (typeof packageManagers)[number];

export const DEFAULT_PACKAGE_MANAGER: PackageManager = "npm";

export const lockFileMap: Record<PackageManager, string> = {
    npm: "package-lock.json",
    yarn: "yarn.lock",
    pnpm: "pnpm-lock.yaml",
};

export const installCommandMap: Record<PackageManager, string> = {
    npm: "npm ci",
    yarn: "yarn install --pure-lockfile",
    pnpm: "pnpm install --frozen-lockfile",
};
