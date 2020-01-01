import { Graph, GraphEntityId } from "../index";

const lookup = (obj: object, key: string): any => {
  if (!obj[key]) throw new Error(`Key "${key}" does not exist`);
  return obj[key];
};

export const findAdjacentVertices = (graph: Graph, vertexId): GraphEntityId[] =>
  lookup(graph.edges, vertexId);
