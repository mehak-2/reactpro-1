import { create } from 'zustand';
import { applyEdgeChanges, applyNodeChanges } from "reactflow";
import { nanoid } from 'nanoid';

const sourceValues = [10, 20, 30];

const subscription = {
  renderFunctions: [
    {
      functionBody: (nodes) => {
        const operand1Value = nodes.find((node) => node.id === 'operand1')?.data.value || 0;
        const operand2Value = nodes.find((node) => node.id === 'operand2')?.data.value || 0;
        const operand3Value = nodes.find((node) => node.id === 'operand3')?.data.value || 0;
        return operand1Value - operand2Value - operand3Value;
      },
      id: 'OPPONENTSCORE',
      position: { x: 200, y: 200 },
    },
    {
      functionBody: (nodes) => {
        const operand1Value = nodes.find((node) => node.id === 'operand1')?.data.value || 0;
        const operand2Value = nodes.find((node) => node.id === 'operand2')?.data.value || 0;
        const operand3Value = nodes.find((node) => node.id === 'operand3')?.data.value || 0;
        return operand1Value + operand2Value - operand3Value;
      },
      id: 'OPPONENTSCORE1',
      position: { x: 50, y: 200 },
    },
    {
      functionBody: (nodes) => {
        const operand1Value = nodes.find((node) => node.id === 'operand1')?.data.value || 0;
        const operand2Value = nodes.find((node) => node.id === 'operand2')?.data.value || 0;
        const operand3Value = nodes.find((node) => node.id === 'operand3')?.data.value || 0;
        return operand1Value - operand2Value + operand3Value;
      },
      id: 'OPPONENTSCORE2',
      position: { x: 300, y: 300 },
    },
  ],
  sources: [
    {
      id: 'OPERANDS',
      subscribeTo: ['operand1', 'operand2', 'operand3'],
    },
  ],
};

export const useStore = create((set, get) => {
  let nodes = [
    {
      id: 'operand1',
      type: 'operand1',
      data: { value: sourceValues.length > 0 ? sourceValues[0] : 0 },
      position: { x: 50, y: 50 },
      edges: [],
    },
    {
      id: 'operand2',
      type: 'operand2',
      data: { value: sourceValues.length > 1 ? sourceValues[1] : 0 },
      position: { x: 200, y: 50 },
      edges: [],
    },
    {
      id: 'operand3',
      type: 'operand3',
      data: { value: sourceValues.length > 2 ? sourceValues[2] : 0 },
      position: { x: 320, y: 50 },
      edges: [],
    },
    {
      id: 'OPPONENTSCORE',
      type: 'operator',
      data: { value: 0 },
      position: { x: 200, y: 200 },
      edges: [],
    },
    {
      id: 'OPPONENTSCORE1',
      type: 'operator',
      data: { value: 0 },
      position: { x: 50, y: 200 },
      edges: [],
    },
    {
      id: 'OPPONENTSCORE2',
      type: 'operator',
      data: { value: 0 },
      position: { x: 300, y: 300 },
      edges: [],
    },
  ];
  let edges = [];

  const updateNodes = () => {
    // Update nodes
  };

  updateNodes();

  const removeEdge = (sourceId, targetId) => {
    set({
      edges: get().edges.filter(
        (edge) => !(edge.source === sourceId && edge.target === targetId)
      ),
    });
  
    // Recalculate values for all render functions connected to the target node of the removed edge
    const targetNode = get().nodes.find((node) => node.id === targetId);
    if (targetNode) {
      const connectedEdges = get().edges.filter(
        (edge) => edge.source === targetId || edge.target === targetId
      );
  
      if (connectedEdges.length === 0) {
        // If no more edges are connected to the target node, set its value to 0
        const updatedNodes = get().nodes.map((node) =>
          node.id === targetId ? { ...node, data: { value: 0 } } : node
        );
        set({ nodes: updatedNodes });
      } else {
        // Recalculate value for render functions connected to the target node
        subscription.renderFunctions
          .filter(
            (renderFunction) =>
              renderFunction.subscribeTo && renderFunction.subscribeTo.includes(targetId)
          )
          .forEach((renderFunction) => {
            const newValue = renderFunction.functionBody(get().nodes);
            const targetNodeIndex = get().nodes.findIndex((node) => node.id === renderFunction.id);
            if (targetNodeIndex !== -1) {
              const updatedNodes = [...get().nodes];
              updatedNodes[targetNodeIndex].data.value = newValue;
              set({ nodes: updatedNodes });
            }
          });
      }
    }
  };
  
  const removeNode = (id) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
    });
    // Recalculate values for all render functions and update corresponding nodes
    subscription.renderFunctions.forEach((renderFunction) => {
      const newValue = renderFunction.functionBody(get().nodes);
      const targetNodeIndex = get().nodes.findIndex((node) => node.id === renderFunction.id);
      if (targetNodeIndex !== -1) {
        const updatedNodes = [...get().nodes];
        updatedNodes[targetNodeIndex].data.value = newValue;
        set({ nodes: updatedNodes });
      }
    });
  };
  const updateNodePosition = (id, newPosition) => {
    const updatedNodes = get().nodes.map((node) =>
      node.id === id ? { ...node, position: newPosition } : node
    );
    set({ nodes: updatedNodes });
  };


  return {
    nodes,
    edges,
    subscription,
    updateNodePosition,
    updateNodes,
    removeNode,
    removeEdge,
    addEdge: (data) => {
      const id = nanoid(6);
      const newEdge = { id, ...data };
      set({ edges: [...get().edges, newEdge] });
      subscription.renderFunctions.forEach((renderFunction) => {
        if (renderFunction.id === data.target) {
          const newValue = renderFunction.functionBody(get().nodes);
          const targetNodeIndex = get().nodes.findIndex((node) => node.id === data.target);
          if (targetNodeIndex !== -1) {
            const updatedNodes = [...get().nodes];
            updatedNodes[targetNodeIndex].data.value = newValue;
            set({ nodes: updatedNodes });
          }
        }
      });
    },
  };
});