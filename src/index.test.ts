import { Graph, degree, addEdge } from "./index";
import * as E from "fp-ts/lib/Either";

test("Running degree() for an existing vertex", () => {
  const graph = new Graph({ a: {} }, { a: [] });
  expect(degree(graph, "a")).toEqual(E.right(0));
});

test("Running degree() for a non-existing vertex", () => {
  const graph = new Graph({ a: {} }, { a: [] });
  expect(degree(graph, "c")).toEqual(
    E.left('Vertex with id "c" doesn\'t exist')
  );
});

test("Running addEdge() for two existing non-adjacent vertices", () => {
  const graph = new Graph({ a: {}, b: {} }, { a: [], b: [] });
  const expectedValue = E.right(
    new Graph({ a: {}, b: {} }, { a: ["b"], b: ["a"] })
  );
  expect(addEdge(graph, "b", "a")).toEqual(expectedValue);
});

test("Running addEdge() for two existing already-adjacent vertices", () => {
  const graph = new Graph({ a: {}, b: {} }, { a: ["b"], b: ["a"] });
  const expectedValue = E.left(
    'Vertices with id "b" and "a" are already adjacent'
  );
  expect(addEdge(graph, "b", "a")).toEqual(expectedValue);
});
