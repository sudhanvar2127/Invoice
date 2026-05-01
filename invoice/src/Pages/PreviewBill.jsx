import React, { useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BillContext } from "../Context/BillContext";
import PrintBill from "../Components/PrintBill";
import GenerateBill from "../Components/GenerateBill";

const PreviewBill = () => {
  const printRef = useRef(null);

  return (
    <div>
      <div ref={printRef} className="print-area">
        <div className="print-section">
          <PrintBill copyName="Original" />
        </div>
        <div className="print-section hidden">
          <PrintBill copyName="Duplicate" />
        </div>
        <div className="print-section hidden">
          <PrintBill copyName="Triplicate" />
        </div>
      </div>

      <div className="flex gap-4 my-3 no-print">
        <Link to="/">
          <button className="bg-gray-700 p-2 text-white font-medium text-sm rounded hover:bg-gray-950 cursor-pointer">
            Back
          </button>
        </Link>
        <GenerateBill />
      </div>
    </div>
  );
};

export default PreviewBill;
