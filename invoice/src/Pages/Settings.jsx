import React, { useContext, useMemo, useState } from "react";
import { BillContext } from "../Context/BillContext";
import { toast, ToastContainer } from "react-toastify";
import { Trash2, RotateCcw, FileText, Hash } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const { allBills, clearAllBills, resetInvoiceNumber, invoiceNumber } =
    useContext(BillContext);

  const [loadingClear, setLoadingClear] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const { gstCount, nonGstCount } = useMemo(() => {
    let gstCount = 0;
    let nonGstCount = 0;

    allBills.forEach((bill) => {
      if (bill.gst) gstCount++;
      else nonGstCount++;
    });

    return { gstCount, nonGstCount };
  }, [allBills]);

  const handleClear = async () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all bills?"
    );

    if (!confirmClear) return;

    try {
      setLoadingClear(true);
      await clearAllBills();
      toast.success("All bills cleared successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear bills.");
    } finally {
      setLoadingClear(false);
    }
  };

  const handleResetInvoice = async () => {
    const confirmReset = window.confirm(
      "Reset invoice number for the current financial year?"
    );

    if (!confirmReset) return;

    try {
      setLoadingReset(true);
      await resetInvoiceNumber();
      toast.info("Invoice number reset successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset invoice number.");
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h1 className="text-3xl font-bold text-center">Settings</h1>

      <div className="bg-white shadow rounded-2xl p-6 flex items-center space-x-4">
        <Hash className="text-black" size={32} />
        <div>
          <p className="text-gray-600 text-sm">Current Invoice Number</p>
          <p className="text-xl font-semibold text-black">
            {invoiceNumber || "Not Generated"}
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 space-y-3">
        <div className="flex items-center space-x-3">
          <FileText className="text-blue-500" size={28} />
          <h2 className="text-xl font-semibold">Bill Statistics</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-700">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-blue-600">{gstCount}</p>
            <p className="text-sm">GST Bills</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-green-600">{nonGstCount}</p>
            <p className="text-sm">Non-GST Bills</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2 text-center">
            <p className="text-lg font-bold text-gray-800">{allBills.length}</p>
            <p className="text-sm">Total Bills</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <button
          onClick={handleClear}
          disabled={loadingClear}
          className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition text-white ${
            loadingClear
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          <Trash2 size={20} />
          <span>{loadingClear ? "Clearing..." : "Clear All Bills"}</span>
        </button>

        <button
          onClick={handleResetInvoice}
          disabled={loadingReset}
          className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition text-white ${
            loadingReset
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <RotateCcw size={20} />
          <span>{loadingReset ? "Resetting..." : "Reset Invoice Number"}</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;