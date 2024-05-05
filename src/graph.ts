// graph.ts
import React from "react";

interface NodeInfo {
  type: string;
  value: number;
  sources: string[];
  targets: string[];
}

class Graph {
  nodes: {
    [id: string]: NodeInfo;
  } = {};

  constructor() {
    this.nodes = {
      operand1: {
        type: "operand1",
        value: 14,
        sources: [],
        targets: ["operator"],
      },
      operand2: {
        type: "operand2",
        value: 14,
        sources: [],
        targets: ["operator"],
      },
      operator: {
        type: "operator",
        value: 0,
        sources: ["operand1", "operand2"],
        targets: [],
      },
    };
  }

  addNode(id: string, nodeInfo: NodeInfo) {
    if (!this.nodes[id]) {
      this.nodes[id] = {
        type: nodeInfo.type,
        value: nodeInfo.value,
        sources: [],
        targets: [],
      };
    } else {
      console.log("Node with ID " + id + " already exists.");
    }
  }

  updateNode(id: string, nodeInfo: NodeInfo) {
    if (this.nodes[id]) {
      let oldValue = this.nodes[id].value;
      this.nodes[id].type = nodeInfo.type;
      this.nodes[id].value = nodeInfo.value;
      console.log(
        "Updated node " +
          id +
          " with type: " +
          nodeInfo.type +
          " and value: " +
          nodeInfo.value +
          "."
      );
      if (oldValue !== nodeInfo.value) {
        for (let targetId of this.nodes[id].targets) {
          this.updateNode(targetId, this.nodes[targetId]);
        }
      }
    } else {
      console.log("Node with ID " + id + " does not exist.");
    }
  }
  
  connect(sourceId: string, targetId: string) {
    if (this.nodes[sourceId] && this.nodes[targetId]) {
      this.nodes[targetId].sources.push(sourceId);
      this.nodes[sourceId].targets.push(targetId);
      console.log("Connected node " + sourceId + " to node " + targetId + ".");
      this.updateNode(targetId);
    } else {
      console.log("One or both of the nodes do not exist.");
    }
  }
  }
const graph = new Graph();

export function getValue(id: string) {
  return graph.nodes[id] ? graph.nodes[id].value : null;
}

export function createNode(id: string, type: string, data: { value: number }) {
  const dataInfo: NodeInfo = { type, value: data.value, sources: [], targets: [] };
  graph.addNode(id, dataInfo);
}

export function updateNode(id: string, data: { value: number }) {
  const oldData: NodeInfo = { type: graph.nodes[id].type, value: graph.nodes[id].value, sources: graph.nodes[id].sources, targets: graph.nodes[id].targets };
  const dataInfo: NodeInfo = { ...oldData, value: data.value };
  graph.updateNode(id, dataInfo);
}

export function removeNode(id: string) {
  graph.nodes[id] && graph.nodes[id].targets.forEach(targetId => {
    const index = graph.nodes[targetId].sources.indexOf(id);
    index !== -1 && graph.nodes[targetId].sources.splice(index, 1);
  });
  delete graph.nodes[id];
}

export function connectNodes(sourceId: string, targetId: string) {
  graph.connect(sourceId, targetId);
}

export function disconnectNodes(sourceId: string, targetId: string) {
  graph.nodes[sourceId] && graph.nodes[sourceId].targets.includes(targetId) && graph.nodes[sourceId].targets.splice(graph.nodes[sourceId].targets.indexOf(targetId), 1);
  graph.nodes[targetId] && graph.nodes[targetId].sources.includes(sourceId) && graph.nodes[targetId].sources.splice(graph.nodes[targetId].sources.indexOf(sourceId), 1);
}

export function getGraph() {
  return graph;
}
