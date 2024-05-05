import { create } from 'zustand';
import { nanoid } from 'nanoid';

const sourceValues = [10, 20, 30];
const subscription = {
  renderFunctions: [
    {
      functionBody: (nodes) => nodes.reduce((acc, node) => acc * (node.id.startsWith('operand') ? node.data.value : 1), 1),
      id: 'OPPONENTSCORE',
    },
    {
      functionBody: (nodes) => nodes.reduce((acc, node) => acc + (node.id.startsWith('operand') ? node.data.value : 0), 0),
      id: 'OPPONENTSCORE1',
    },
    {
      functionBody: (nodes) => nodes.reduce((acc, node) => acc / (node.id.startsWith('operand') ? node.data.value : 1), 1),
      id: 'OPPONENTSCORE2',
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
      data: { value: sourceValues[0] || 0 },
      position: { x: 50, y: 50 },
    },
    {
      id: 'operand2',
      type: 'operand2',
      data: { value: sourceValues[1] || 0 },
      position: { x: 200, y: 50 },
    },
    {
      id: 'operand3',
      type: 'operand3',
      data: { value: sourceValues[2] || 0 },
      position: { x: 320, y: 50 },
    },
    {
      id: 'OPPONENTSCORE',
      type: 'operator',
      data: { value: 0 },
      position: { x: 200, y: 200 },
    },
    {
      id: 'OPPONENTSCORE1',
      type: 'operator',
      data: { value: 0 },
      position: { x: 50, y: 200 },
    },
    {
      id: 'OPPONENTSCORE2',
      type: 'operator',
      data: { value: 0 },
      position: { x: 300, y: 200 },
    },
  ];

  let edges = [];

  const updateNodes = () => {
    // Update nodes
  };

  updateNodes();

  const removeEdge = (sourceId, targetId) => {
    set({
      edges: get().edges.filter((edge) => !(edge.source === sourceId && edge.target === targetId)),
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
          .filter((renderFunction) => renderFunction.subscribeTo && renderFunction.subscribeTo.includes(targetId))
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

      const connectedRenderFunction = subscription.renderFunctions.find((rf) => rf.id === data.target);
      if (connectedRenderFunction) {
        const newValue = connectedRenderFunction.functionBody(get().nodes);
        const targetNodeIndex = get().nodes.findIndex((node) => node.id === connectedRenderFunction.id);
        if (targetNodeIndex !== -1) {
          const updatedNodes = [...get().nodes];
          updatedNodes[targetNodeIndex].data.value = newValue;
          set({ nodes: updatedNodes });
        }
      }
    },
  };
});

