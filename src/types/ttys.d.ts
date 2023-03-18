declare module "ttys" {
    import { ReadStream, WriteStream } from "node:fs";

    export const stdin: ReadStream;
    export const stdout: WriteStream;
    export const stderr: WriteStream;
}
