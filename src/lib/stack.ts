import { Option, some, none, fromNullable } from "fp-ts/lib/Option";
import { GraphElementId } from "..";

export class Stack<A> {
  __arr: A[];
  constructor(arr) {
    this.__arr = Object.freeze(arr);
  }
}

const data = <A>(x: Stack<A>): A[] => x.__arr;

const size = <A>(x: Stack<A>): number => data(x).length;

const lastUnsafe = <A>(x: Stack<A>): A => data(x)[data(x).length - 1];

export const isEmpty = <A>(x: Stack<A>): boolean => size(x) === 0;

export const last = <A>(x: Stack<A>): Option<A> =>
  fromNullable(data(x)[data(x).length - 1]);

export const add = <A>(stack: Stack<A>, newEl: A) =>
  data(stack).concat([newEl]);

export const concat = <A>(x1: Stack<A>, x2: Stack<A>): Stack<A> =>
  new Stack(data(x1).concat(data(x2).filter(item => !data(x1).includes(item))));

export const has = <A>(stack: Stack<A>, element: A): boolean =>
  data(stack).includes(element);

export const pop = <A>(stack: Stack<A>): Option<[A, Stack<A>]> =>
  isEmpty(stack)
    ? none
    : some([
        lastUnsafe(stack),
        new Stack(data(stack).slice(0, size(stack) - 1))
      ]);

export const popUnsafe = <A>(stack: Stack<A>): [A, Stack<A>] => [
  lastUnsafe(stack),
  new Stack(data(stack).slice(0, size(stack) - 1))
];
