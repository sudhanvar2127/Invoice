import React from "react";
import { useContext, useEffect } from "react";
import { BillContext } from "../Context/BillContext";

const OtherDetails = () => {
  const {
    gst,
    date,
    setDate,
    invoiceNumber,
    setInvoiceNumber,
    deliveryNote,
    setDeliveryNote,
    modeAndTermsOfPayment,
    setModeAndTremsOfPayment,
    referenceNumber,
    setReferenceNumber,
    ewayNumber,
    setEwayNumber,
    hsnSAC,
    setHSNSAC,
    getNextInvoiceNumber,
    kindAttn,
    setKindAttn,
    vehicleNo,
    setVehicleNo,
  } = useContext(BillContext);

  useEffect(() => {
    if (invoiceNumber) {
      localStorage.setItem("currentInvoiceNumber", invoiceNumber);
    }
  }, [invoiceNumber]);

  return (
    <div className="flex flex-col gap-1">
        <label className="font-medium text-gray-900">Invoice Number:</label>
        {gst ? (
          <input
            type="text"
            value={invoiceNumber}
            readOnly
            className="rounded p-1 bg-gray-200 border"
          />
        ) : (
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="rounded p-1 border"
          />
        )}
        <label className="font-medium text-gray-900">Invoice Date:</label>
        <input
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded p-1 border"
        />
        <label className="font-medium text-gray-900">Delivery Note:</label>
        <input
          type="text"
          name="deliveryNote"
          value={deliveryNote}
          onChange={(e) => setDeliveryNote(e.target.value)}
          className="border rounded p-1"
        />
        <label className="font-medium text-gray-900">
          Purchase No. & Date:
        </label>
        <input
          type="text"
          name="referenceNumber"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          className="border rounded p-1"
        />
        <label className="font-medium text-gray-900">HSN/SAC:</label>
        <input
          type="number"
          name="hsnSAC"
          value={hsnSAC}
          onChange={(e) => setHSNSAC(e.target.value)}
          className="border rounded p-1"
        />
        <label className="font-medium text-gray-900">
          Mode/Terms of Payment:
        </label>
        <input
          type="text"
          name="modeAndTermsOfPayment"
          value={modeAndTermsOfPayment}
          onChange={(e) => setModeAndTremsOfPayment(e.target.value)}
          className="border rounded p-1"
        />
        <label className="font-medium text-gray-900">e-way Bill Number:</label>
        <input
          type="number"
          name="ewayNumber"
          value={ewayNumber}
          onChange={(e) => setEwayNumber(e.target.value)}
          className="border rounded p-1"
        />
        <label className="font-medium text-gray-900">Vehical Number:</label>
        <input
          type="text"
          name="vehicleNo"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value)}
          className="border rounded p-1"
        />
        <label className="font-medium text-gray-900">Kind Attn.:</label>
        <input
          type="text"
          name="kindAttn"
          value={kindAttn}
          onChange={(e) => setKindAttn(e.target.value)}
          className="border rounded p-1"
        />
    </div>
  );
};

export default OtherDetails;
