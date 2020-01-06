import { Graph, GraphElementId } from "../index";

const lookup = (obj: object, key: string): any => {
  if (!obj[key]) throw new Error(`Key "${key}" does not exist`);
  return obj[key];
};

export const findAdjacentVertices = (
  graph: Graph,
  vertexId
): GraphElementId[] => lookup(graph.edges, vertexId);
