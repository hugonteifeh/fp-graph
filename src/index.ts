import { Either, right, left, map, fold } from "fp-ts/lib/Either";
import * as Op from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";

import * as Arr from "./lib/array-funcs";
import * as St from "./lib/stack";

export class Graph {
  vertices: Vertices;
  edges: Edges;
  constructor(vertices: Vertices, edges: Edges) {
    if (!Object.keys(vertices).length)
      throw new Error("Empty vertex-set === no muscles");
    this.vertices = vertices;
    this.edges = edges;
  }
}

export type GraphElementId = string;

type ErrorMessage = string;
type Vertices = {
  [key: string]: object;
};

type Edges = {
  [key: string]: GraphElementId[];
};

const getAdjacentVerticesUnsafe = (graph: Graph, vertexId) =>
  graph.edges[vertexId];

export const areAdjacent = (
  graph: Graph,
  vertex1: GraphElementId,
  vertex2: GraphElementId
) => graph.edges[vertex1].includes(vertex2);

export const degree = (
  graph: Graph,
  vertexId: GraphElementId
): Either<string, number> => {
  const neighbours = getAdjacentVerticesUnsafe(graph, vertexId);
  return map((value: GraphElementId[]) => value.length)(neighbours);
};

export const addVertex = (
  graph: Graph,
  vertexId: GraphElementId,
  vertexData: any
): Either<string, Graph> =>
  graph[vertexId]
    ? left(`Vertex with id "${vertexId}" already exists`)
    : (() => {
        const newVerticesObject = Object.assign({}, graph.vertices, {
          [vertexId]: vertexData
        });
        const newEdgesObject = Object.assign({}, graph.vertices, {
          [vertexId]: []
        });
        return right(new Graph(newVerticesObject, newEdgesObject));
      })();

const lookup = (x: object, key: string): Op.Option<any> =>
  Op.fromNullable(x[key]);

export const addEdgeUnsafe = (
  graph: Graph,
  vertex1Id: GraphElementId,
  vertex2Id: GraphElementId
): Graph => {
  const newEdges = Object.assign({}, graph.edges, {
    [vertex1Id]: graph.edges[vertex1Id].concat([vertex2Id]),
    [vertex2Id]: graph.edges[vertex2Id].concat([vertex1Id])
  });
  return new Graph(graph.vertices, newEdges);
};

export const addEdge = (
  graph: Graph,
  vertex1Id: GraphElementId,
  vertex2Id: GraphElementId
): Either<string, Graph> => {
  const vertex1 = lookup(graph.vertices, vertex1Id);
  const vertex2 = lookup(graph.vertices, vertex1Id);
  if (Op.isNone(vertex1))
    return left(`Vertex with id "${vertex1Id}" doesn't exist`);
  if (Op.isNone(vertex2))
    return left(`Vertex with id "${vertex2Id}" doesn't exist`);
  if (areAdjacent(graph, vertex1Id, vertex2Id))
    return left(
      `Vertices with id "${vertex1Id}" and "${vertex2Id}" are already adjacent`
    );
  return right(addEdgeUnsafe(graph, vertex1Id, vertex2Id));
};

const getUninspectedNeighbours = (
  context: { graph: Graph; inspectedVertices: GraphElementId[] },
  vertexId: GraphElementId
) =>
  getAdjacentVerticesUnsafe(context.graph, vertexId).filter(
    vertexId => !context.inspectedVertices.includes(vertexId)
  );

type pathExistContext = {
  graph: Graph;
  verticesToInspect: St.Stack;
  inspectedVertices: GraphElementId[];
};
const pathExistsRecursive = (
  context: pathExistContext,
  targetVertexId: GraphElementId
): boolean => {
  const { graph, verticesToInspect, inspectedVertices } = context;
  return St.isEmpty(verticesToInspect)
    ? false
    : (() => {
        const [currentVertexId, newVerticesToInspect] = St.popUnsafe(
          verticesToInspect
        );
        const uninspectedNeighbours = getUninspectedNeighbours(
          { graph, inspectedVertices },
          currentVertexId
        );
        return (
          currentVertexId === targetVertexId ||
          (() => {
            const newContext = {
              graph,
              inspectedVertices: inspectedVertices.concat([currentVertexId]),
              verticesToInspect: St.concat(
                newVerticesToInspect,
                new St.Stack(
                  uninspectedNeighbours.filter(
                    item => !St.has(verticesToInspect, item)
                  )
                )
              )
            };
            return pathExistsRecursive(newContext, targetVertexId);
          })()
        );
      })();
};

const optionToBoolean = <A>(x: Op.Option<A>) => (Op.isSome(x) ? true : false);

const vertexExists = (graph: Graph, vertexId: GraphElementId) =>
  optionToBoolean(lookup(graph, vertexId));

export const pathExists = (
  graph: Graph,
  vertex1Id: GraphElementId,
  vertex2Id: GraphElementId
): Either<ErrorMessage, boolean> => {
  if (!vertexExists(graph, vertex1Id))
    left(`Vertex with id ${vertex1Id} does not exist`);
  if (!vertexExists(graph, vertex2Id))
    left(`Vertex with id ${vertex2Id} does not exist`);
  const initalContext: pathExistContext = {
    graph,
    verticesToInspect: new St.Stack([vertex1Id]),
    inspectedVertices: []
  };
  return right(pathExistsRecursive(initalContext, vertex2Id));
};
