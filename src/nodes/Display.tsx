import React from "react";
import { Handle } from "reactflow";
import { useStore } from "../store";
import { tw } from "twind";

interface DisplayProps {
  id: string;
  data: { value: number };
}

const Display: React.FC<DisplayProps> = ({ id, data }) => {
  const { updateNode } = useStore();

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      updateNode(id, { value });
    }
  };

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
    <p
      className={tw("rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm")}
    >
    Input Value
    </p>
      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Value</p>
        <input
          className="nodrag"
          type="number"
          value={data.value}
          onChange={handleValueChange}
        />
      </label>

      <Handle className={tw("w-2 h-2")} type="source" position="bottom" />
    </div>
  );
};

export default Display;
