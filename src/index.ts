import { Either, right, left, map } from "fp-ts/lib/Either";
import * as Op from "fp-ts/lib/Option";

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

type GraphEntityId = string;

type Vertices = {
  [key: string]: object;
};

type Edges = {
  [key: string]: GraphEntityId[];
};

const findAdjacentVertices = (
  graph: Graph,
  vertexId
): Either<string, GraphEntityId[]> =>
  graph.edges.hasOwnProperty(vertexId)
    ? Array.isArray(graph.edges[vertexId])
      ? right(graph.edges[vertexId])
      : left(
          `The adjacency list for the vertex with id "${vertexId}" vertex is not an array`
        )
    : left(`Vertex with id "${vertexId}" doesn't exist`);

export const areAdjacent = (
  graph: Graph,
  vertex1: GraphEntityId,
  vertex2: GraphEntityId
) => graph.edges[vertex1].includes(vertex2);

export const degree = (
  graph: Graph,
  vertexId: GraphEntityId
): Either<string, number> => {
  const neighbours = findAdjacentVertices(graph, vertexId);
  return map((value: GraphEntityId[]) => value.length)(neighbours);
};

const addVertex = (
  graph: Graph,
  vertexId: GraphEntityId,
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
  vertex1Id: GraphEntityId,
  vertex2Id: GraphEntityId
): Graph => {
  const newEdges = Object.assign({}, graph.edges, {
    [vertex1Id]: graph.edges[vertex1Id].concat([vertex2Id]),
    [vertex2Id]: graph.edges[vertex2Id].concat([vertex1Id])
  });
  return new Graph(graph.vertices, newEdges);
};

export const addEdge = (
  graph: Graph,
  vertex1Id: GraphEntityId,
  vertex2Id: GraphEntityId
): Either<string, Graph> => {
  const vertex1 = lookup(graph.vertices, vertex1Id);
  const vertex2 = lookup(graph.vertices, vertex1Id);
  if (Op.isNone(vertex1))
    return left(`Vertex with id "${vertex1Id}" doesn't exist`);
  if (Op.isNone(vertex2))
    return left(`Vertex with id "${vertex2Id}" doesn't exist`);
  return right(addEdgeUnsafe(graph, vertex1Id, vertex2Id));
};
