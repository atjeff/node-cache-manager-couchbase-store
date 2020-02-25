export type Promisify<Library, ReturnType> = {
  [Method in keyof Library]: Library[Method] extends (
    ...args: infer U
  ) => infer ReturnValue
    ? (...args: Partial<U>) => Promise<ReturnType>
    : never;
};
