import React from "react";
import { useStore } from "./store";
import { Handle, Position } from "reactflow";
import { tw } from 'twind';
const Operator = ({ id }) => {
  const { nodes, edges, subscription } = useStore();

  const renderFunction = subscription.renderFunctions.find((rf) => rf.id === id);

  if (!renderFunction) return null;

  const node = nodes.find((n) => n.id === renderFunction.id);
  const isConnected = edges.some((edge) => edge.target === renderFunction.id);

  // Render the value only if there is a connection
  const value = isConnected ? (node ? node.data.value : 0) : 0;

  return (
    <div key={renderFunction.id} className="rounded-md bg-white shadow-xl">
      <Handle className={tw("w-2 h-2")} type="target" position="top" />
      <p className="rounded-t-md px-2 py-1 bg-blue-500 text-black text-sm">Output</p>
      <hr className="border-gray-200 mx-2" />
      {value !== null && (
        <>
          <p className="flex flex-col px-2 py-1 text-right text-xl">{value}</p>
          <hr className="border-gray-200 mx-2" />
        </>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        // You might want to define handleConnect function or remove this prop
        // onConnect={(params) => handleConnect(params.source, params.target)}
        style={{
          background: "#555",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
    </div>
  );
};

export default Operator;