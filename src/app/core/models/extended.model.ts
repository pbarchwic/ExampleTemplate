export type ExtendedType<T> = {
  [P in keyof T]: T[P];
};
