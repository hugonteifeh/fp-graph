import { Option, some, none, fromNullable } from "fp-ts/lib/Option";

export class Stack<A> {
  __arr: A[];
  constructor(arr) {
    this.__arr = Object.freeze(arr);
  }
}

const data = <A>(x: Stack<A>): A[] => x.__arr;

export const size = <A>(x: Stack<A>): number => data(x).length;

export const isEmpty = <A>(x: Stack<A>): boolean => size(x) === 0;

export const topUnsafe = <A>(x: Stack<A>): A => data(x)[data(x).length - 1];
export const top = <A>(x: Stack<A>): Option<A> =>
  fromNullable(data(x)[data(x).length - 1]);
export const topThrowable = <A>(x: Stack<A>): A => {
  const value = data(x)[data(x).length - 1];
  if (value === undefined)
    throw new Error("Sorry, but the stack is empty, come back tomorrow");
  return value;
};

export const push = <A>(stack: Stack<A>, newEl: A) =>
  data(stack).concat([newEl]);

/** Concatenates two stacks */
export const concat = <A>(x1: Stack<A>, x2: Stack<A>): Stack<A> =>
  new Stack(data(x1).concat(data(x2).filter(item => !data(x1).includes(item))));

/** Checks if an element already exists in a stack */
export const has = <A>(stack: Stack<A>, element: A): boolean =>
  data(stack).includes(element);

/** Returns a pair (a tuple with two elements) of which the first value
 * is the last element(top) of the stack and the second element
 * is the new stack with that element
 * being removed.
 */
export const popUnsafe = <A>(stack: Stack<A>): [A, Stack<A>] => [
  topUnsafe(stack),
  new Stack(data(stack).slice(0, size(stack) - 1))
];

export const pop = <A>(stack: Stack<A>): Option<[A, Stack<A>]> =>
  isEmpty(stack)
    ? none
    : some([
        topUnsafe(stack),
        new Stack(data(stack).slice(0, size(stack) - 1))
      ]);

export const popThrowable = <A>(stack: Stack<A>): [A, Stack<A>] => {
  if (isEmpty(stack))
    throw new Error("You can\"t chop it when it doesn't have a head");
  return [topUnsafe(stack), new Stack(data(stack).slice(0, size(stack) - 1))];
};
