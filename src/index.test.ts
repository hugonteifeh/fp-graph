import { Graph, degree } from "./index";
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
