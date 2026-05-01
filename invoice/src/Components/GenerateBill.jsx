import React, { useContext } from "react";
import { toast } from "react-toastify";
import { BillContext } from "../Context/BillContext";

const GenerateBill = () => {
  const {
    listOfSellers,
    selectSeller,
    gst,
    buyer,
    consignee,
    date,
    invoiceNumber,
    deliveryNote,
    modeAndTermsOfPayment,
    referenceNumber,
    ewayNumber,
    addItems,
    hsnSAC,
    roundOff,
    gstPercentage,
    subTotal,
    gstAmount,
    grandTotal,
    cGst,
    sGst,
    getNextInvoiceNumber,
    setInvoiceNumber,
    saveBillToDB,
    setBillData,
    allBills,
    setAllBills,
    nonGstSellerDetails,
    kindAttn,
    vehicleNo,
  } = useContext(BillContext);

  const validateBill = () => {
    const selectedSeller = gst
      ? listOfSellers?.[selectSeller]
      : nonGstSellerDetails;

    if (
      !selectedSeller?.name ||
      !selectedSeller?.address ||
      !selectedSeller?.phone
    ) {
      toast.error("Please fill seller details");
      return false;
    }

    if (gst && !selectedSeller?.gstin) {
      toast.error("Please enter seller GSTIN");
      return false;
    }

    if (
      !buyer?.name ||
      !buyer?.address ||
      !buyer?.phone ||
      !buyer?.email ||
      !buyer?.gstin
    ) {
      toast.error("Please fill buyer details");
      return false;
    }

    if (
      !consignee?.name ||
      !consignee?.address ||
      !consignee?.phone ||
      !consignee?.email ||
      !consignee?.gstin
    ) {
      toast.error("Please fill consignee details");
      return false;
    }

    if (!invoiceNumber) {
      toast.error("Please enter invoice number");
      return false;
    }

    if (!date) {
      toast.error("Please select invoice date");
      return false;
    }

    if (!addItems?.length) {
      toast.error("Please add at least one item");
      return false;
    }

    const invalidItem = addItems.find(
      (item) =>
        !item.descriptionOfGoods ||
        !item.quantity ||
        Number(item.quantity) <= 0 ||
        !item.rate ||
        Number(item.rate) <= 0 ||
        Number(item.amount) < 0,
    );

    if (invalidItem) {
      toast.error("Please fill all item details correctly");
      return false;
    }

    if (gst && !gstPercentage) {
      toast.error("Please enter GST Percentage");
      return false;
    }

    if (gst && !hsnSAC) {
      toast.error("Please enter HSN/SAC");
      return false;
    }

    if (gst && !ewayNumber) {
      toast.error("Please enter E-way bill Number");
      return false;
    }

    if (gst && !vehicleNo) {
      toast.error("Please enter Vehicle Number");
      return false;
    }

    if (Number(grandTotal) <= 0) {
      toast.error("Grand total must be greater than 0");
      return false;
    }

    return true;
  };

  const buildBillData = (existingId = null) => {
    const selectedSeller = gst
      ? listOfSellers?.[selectSeller]
      : nonGstSellerDetails;

    return {
      id: existingId || crypto.randomUUID(),
      invoiceNumber,
      date: new Date(date).toISOString(),
      deliveryNote,
      modeAndTermsOfPayment,
      referenceNumber,
      ewayNumber,
      vehicleNo,
      kindAttn,
      gst,
      gstPercentage,
      hsnSAC,
      roundOff: Number(roundOff || 0),
      subTotal: Number(subTotal || 0),
      cGst: Number(cGst || 0),
      sGst: Number(sGst || 0),
      gstAmount: Number(gstAmount || 0),
      grandTotal: Number(grandTotal || 0),
      seller: { ...(selectedSeller || {}) },
      buyer: { ...buyer },
      consignee: { ...consignee },
      items: addItems.map((item, index) => ({
        slNo: index + 1,
        descriptionOfGoods: item.descriptionOfGoods || "",
        quantity: Number(item.quantity || 0),
        rate: Number(item.rate || 0),
        amount: Number(item.amount || 0),
        hsnSAC: item.hsnSAC || hsnSAC || "",
      })),
      selectSeller,
      createdAt: existingId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const downloadBillCSV = (billData) => {
    const rows = [];

    rows.push(["Field", "Value"]);
    rows.push(["Invoice Number", billData.invoiceNumber]);
    rows.push(["Date", billData.date]);
    rows.push(["Delivery Note", billData.deliveryNote]);
    rows.push(["Mode / Terms of Payment", billData.modeAndTermsOfPayment]);
    rows.push(["Reference Number", billData.referenceNumber]);
    rows.push(["E-way Number", billData.ewayNumber]);
    rows.push(["Vehicle Number", billData.vehicleNo]);
    rows.push(["Kind Attention", billData.kindAttn]);
    rows.push(["GST Enabled", billData.gst ? "Yes" : "No"]);
    rows.push(["GST Percentage", billData.gstPercentage]);
    rows.push(["HSN/SAC", billData.hsnSAC]);
    rows.push(["Round Off", billData.roundOff]);
    rows.push(["Sub Total", billData.subTotal]);
    rows.push(["CGST", billData.cGst]);
    rows.push(["SGST", billData.sGst]);
    rows.push(["GST Amount", billData.gstAmount]);
    rows.push(["Grand Total", billData.grandTotal]);

    rows.push([]);
    rows.push(["Seller Details"]);
    rows.push(["Seller Name", billData.seller.name]);
    rows.push(["Seller Address", billData.seller.address]);
    rows.push(["Seller Phone", billData.seller.phone]);
    rows.push(["Seller Email", billData.seller.email]);
    rows.push(["Seller GSTIN", billData.seller.gstin]);
    rows.push(["Bank Name", billData.seller.bankname]);
    rows.push(["Account Number", billData.seller.accno]);
    rows.push(["Branch / IFS", billData.seller.branchifs]);

    rows.push([]);
    rows.push(["Buyer Details"]);
    rows.push(["Buyer Name", billData.buyer.name]);
    rows.push(["Buyer Address", billData.buyer.address]);
    rows.push(["Buyer Phone", billData.buyer.phone]);
    rows.push(["Buyer Email", billData.buyer.email]);
    rows.push(["Buyer GSTIN", billData.buyer.gstin]);

    rows.push([]);
    rows.push(["Consignee Details"]);
    rows.push(["Consignee Name", billData.consignee.name]);
    rows.push(["Consignee Address", billData.consignee.address]);
    rows.push(["Consignee Phone", billData.consignee.phone]);
    rows.push(["Consignee Email", billData.consignee.email]);
    rows.push(["Consignee GSTIN", billData.consignee.gstin]);

    rows.push([]);
    rows.push(["Items"]);
    rows.push(["Sl.No", "Description of Goods", "Quantity", "Rate", "Amount"]);

    billData.items.forEach((item) => {
      rows.push([
        item.slNo,
        item.descriptionOfGoods,
        item.quantity,
        item.rate,
        item.amount,
      ]);
    });

    const csvContent = rows
      .map((row) => row.map((cell) => escapeCSV(cell)).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Invoice_${billData.invoiceNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleGenerateBill = async (e) => {
    e.preventDefault();

    if (!validateBill()) return;

    const billData = buildBillData();

    try {
      await saveBillToDB(billData);

      downloadBillCSV(billData);
      window.print();
      const nextInvoice = getNextInvoiceNumber();
      setInvoiceNumber(nextInvoice);

      toast.success(
        "Invoice generated, saved to database, and CSV downloaded successfully!",
      );
    } catch (error) {
      console.error("Failed to save bill:", error);
      toast.error("Failed to save bill to database");
    }
  };

  return (
    <div>
      <button
        onClick={handleGenerateBill}
        className="bg-blue-700 p-2 text-white font-medium text-sm rounded hover:bg-blue-950 cursor-pointer transition-all duration-200 px-4"
      >
        Print
      </button>
    </div>
  );
};

export default GenerateBill;
