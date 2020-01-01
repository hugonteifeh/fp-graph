import { Option, fromNullable } from "fp-ts/lib/Option";

export const last = <A>(arr: A[]): Option<A> =>
  fromNullable(arr[arr.length - 1]);

export const init = <A>(arr: A[]): A[] =>
  arr.length - 1 < 0 ? [] : arr.slice(0, arr.length - 1);
export const lastUnsafe = <A>(arr: A[]): A => arr[arr.length - 1];
export const isEmpty = <A>(arr: A[]): boolean => arr.length === 0;

export const firstUnsafe = <A, B>(arr: [A, B]): A => arr[0];
