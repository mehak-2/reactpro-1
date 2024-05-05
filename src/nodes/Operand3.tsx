import React from "react";
import { Handle } from "reactflow";
import { useStore } from "../store";
import { tw } from "twind";

interface Operand3Props {
  id: string;
  data: { value: number };
}

const Operand3: React.FC<Operand3Props> = ({ id, data }) => {
  const { setValue } = useStore();

  return (
    <div className={tw("rounded-md bg-white shadow-xl")}>
      <p
        className={tw("rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm")}
      >
        Source 3 Value
      </p>
      <label className={tw("flex flex-col px-2 py-1")}>
        <p className={tw("text-right text-xs")}>{data.value}</p>
      </label>
      <Handle className={tw("w-2 h-2")} type="source" position="bottom" />
    </div>
  );
};

const selector = (id: string) => ({
  setValue: (e: React.ChangeEvent<HTMLInputElement>) =>
    useStore.getState().updateNode(id, { value: +e.target.value }),
});

export default Operand3;
