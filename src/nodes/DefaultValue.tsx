import React, { useCallback } from "react";
import { Handle } from "reactflow";
import { useStore } from "../store";
import { tw } from "twind";
import { shallow } from "zustand/shallow";

interface DefaultValueProps {
  id: string;
  data: { value: number };
}

const DefaultValue: React.FC<DefaultValueProps> = () => {
  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
    <p
      className={tw("rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm")}
    >
    Default Value
    </p>

      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-xs font-bold mb-2")}>Default Value</p>
        <p className={tw("text-right text-xs")}>{2}</p>
      </label>

      <Handle className={tw("w-2 h-2")} type="source" position="bottom" />
    </div>
  );
};

export default DefaultValue;
