import React, { useContext } from "react";
import { BillContext } from "../Context/BillContext";

const Gst = () => {
  const { gst, setGst } = useContext(BillContext);
  const handleGstIsChecked = () => {
    setGst(!gst);
  };
  return (
    <div className="inline-block">
      <label className="flex items-center mb-5 cursor-pointer gap-2">
        <input
          type="checkbox"
          checked={gst}
          onChange={handleGstIsChecked}
          className="sr-only peer"
        />
        <span className="ms-3 text-sm font-medium text-gray-900">GST Toggle : </span>
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:peer-checked:bg-blue-600"></div>
      </label>

    </div>
  );
};

export default Gst;