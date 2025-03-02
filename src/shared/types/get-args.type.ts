export type TGetArgs<T> = T extends (args: infer U) => any ? U : never;
