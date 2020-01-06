import { Graph, addEdge } from "./index";
import { Stack, popThrowable, popUnsafe } from "./lib/stack";
import * as E from "fp-ts/lib/Either";

/*test("Running degree() for an existing vertex", () => {
  const graph = new Graph({ a: {} }, { a: [] });
  expect(degree(graph, "a")).toEqual(E.right(0));
});

test("Running degree() for a non-existing vertex", () => {
  const graph = new Graph({ a: {} }, { a: [] });
  expect(degree(graph, "c")).toEqual(
    E.left('Vertex with id "c" doesn\'t exist')
  );
});*/

test("popThrowable() on an empty stack", () => {
  const stack = new Stack([]);
  expect(() => popThrowable(stack)).toThrow();
});

test("popUnsafe() on an empty stack", () => {
  const stack = new Stack([]);
  expect(popUnsafe(stack)).toEqual([undefined, stack]);
});
