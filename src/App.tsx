import React from "react";
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, Edge } from "reactflow";
import { useStore } from "./store";
import "reactflow/dist/style.css";
import Operand1 from "./nodes/Operand1";
import Operand2 from "./nodes/Operand2";
import Operand3 from "./nodes/Operand3";
import Operator from "./Operator";

const nodeTypes = {
  operand1: Operand1,
  operand2: Operand2,
  operand3: Operand3,
  operator: Operator,
};

const App: React.FC = () => {
  const {
    nodes,
    edges,
    removeNode,
    removeEdge,
    addEdge,
  } = useStore((store) => ({
    nodes: store.nodes,
    edges: store.edges,
    removeNode: store.removeNode,
    removeEdge: store.removeEdge,
    addEdge: store.addEdge,
  }));

  const handleNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    removeNode(node.id);
  };

  const handleEdgeDoubleClick = (event: React.MouseEvent, edge: Edge) => {
    const { source, target } = edge;
    removeEdge(source, target);
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onConnect={addEdge}
          onElementsRemove={(elementsToRemove) => {
            elementsToRemove.forEach((element) => {
              if (element.type === "node") {
                removeNode(element.id);
              } else if (element.type === "edge") {
                removeEdge(element.source, element.target);
              }
            });
          }}
          snapToGrid={true}
          snapGrid={[10, 10]}
          elementsSelectable={true}
          elementsDraggable={true}
          paneMoveable={true}
          zoomOnScroll={true}
          zoomOnDoubleClick={true}
          minZoom={0.1}
          maxZoom={4}
          defaultZoom={1}
          onLoad={(reactFlowInstance) => reactFlowInstance.fitView()}
          onEdgeDoubleClick={handleEdgeDoubleClick}
          onNodeDoubleClick={handleNodeDoubleClick}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default App;
