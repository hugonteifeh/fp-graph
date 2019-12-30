import { Option, some, none, fromNullable } from "fp-ts/lib/Option";

class Stack {
  __arr: number[] | string[];
  constructor(arr) {
    this.__arr = Object.freeze(arr);
  }
}

type StackArray = any[];

const data = (x: Stack): StackArray => x.__arr;

const size = (x: Stack): number => data(x).length;

const lastUnsafe = (x: Stack): any => data(x)[data(x).length - 1];

export const isEmpty = (x: Stack): boolean => size(x) === 0;

export const last = (x: Stack): Option<any> =>
  fromNullable(data(x)[data(x).length - 1]);

export const add = (stack: Stack, newEl: any) => data(stack).concat([newEl]);

export const concat = (x1: Stack, x2: Stack): Stack =>
  new Stack(data(x1).concat(data(x2)));

export const pop = (stack: Stack): Option<[any, Stack]> =>
  isEmpty(stack)
    ? none
    : some([
        lastUnsafe(stack),
        new Stack(data(stack).slice(0, size(stack) - 1))
      ]);
