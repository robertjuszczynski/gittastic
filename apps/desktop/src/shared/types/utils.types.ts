export type TOptionalArgs<T> = T extends void ? [] : [args: T]
