import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BillContext } from "../Context/BillContext";

const Bills = () => {
  const { allBills, listOfSellers } = useContext(BillContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [selectedBillTypes, setSelectedBillTypes] = useState([]);
  const [sortOption, setSortOption] = useState("date");

  const sellerNames = useMemo(() => {
    return [
      ...new Set((listOfSellers || []).map((seller) => seller.name).filter(Boolean)),
    ];
  }, [listOfSellers]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSellerFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSellers((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  const handleBillTypeFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedBillTypes((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    if (Number.isNaN(dateObj.getTime())) return dateStr;
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const downloadBillCSV = (bill) => {
    const rows = [];

    if (bill.seller) {
      rows.push(["Seller Details"]);
      rows.push(["Name", bill.seller.name || ""]);
      rows.push(["Address", bill.seller.address || ""]);
      rows.push(["Phone", bill.seller.phone || ""]);
      rows.push(["Email", bill.seller.email || ""]);
      if (bill.seller.gstin) rows.push(["GSTIN", bill.seller.gstin]);
      rows.push([]);
    }

    rows.push(["Buyer Details"]);
    rows.push(["Name", bill.buyer?.name || ""]);
    rows.push(["Address", bill.buyer?.address || ""]);
    rows.push(["Phone", bill.buyer?.phone || ""]);
    rows.push(["Email", bill.buyer?.email || ""]);
    if (bill.buyer?.gstin) rows.push(["GSTIN", bill.buyer.gstin]);
    rows.push([]);

    rows.push(["Consignee Details"]);
    rows.push(["Name", bill.consignee?.name || ""]);
    rows.push(["Address", bill.consignee?.address || ""]);
    rows.push(["Phone", bill.consignee?.phone || ""]);
    rows.push(["Email", bill.consignee?.email || ""]);
    if (bill.consignee?.gstin) rows.push(["GSTIN", bill.consignee.gstin]);
    rows.push([]);

    rows.push(["Invoice Details"]);
    rows.push(["Invoice Number", bill.invoiceNumber || ""]);
    rows.push(["Date", formatDate(bill.date) || ""]);
    rows.push(["HSN/SAC", bill.hsnSAC || ""]);
    rows.push([]);

    rows.push([
      "Sl.No",
      "Description of Goods",
      "HSN/SAC",
      "Quantity",
      "Rate",
      "Amount",
    ]);

    bill.items?.forEach((item, index) => {
      rows.push([
        index + 1,
        item.descriptionOfGoods || "",
        bill.hsnSAC || "",
        item.quantity || "",
        item.rate || "",
        item.amount || "",
      ]);
    });

    rows.push([]);

    rows.push([
      "Sub Total",
      "",
      "",
      "",
      "",
      Number(bill.subTotal || 0).toFixed(2),
    ]);

    if (bill.gst && bill.gstPercentage) {
      rows.push([
        `CGST (${(Number(bill.gstPercentage) / 2).toFixed(2)}%)`,
        "",
        "",
        "",
        "",
        Number(bill.cGst || 0).toFixed(2),
      ]);

      rows.push([
        `SGST (${(Number(bill.gstPercentage) / 2).toFixed(2)}%)`,
        "",
        "",
        "",
        "",
        Number(bill.sGst || 0).toFixed(2),
      ]);
    }

    rows.push([
      "Round Off",
      "",
      "",
      "",
      "",
      Number(bill.roundOff || 0).toFixed(2),
    ]);

    rows.push([
      "Grand Total",
      "",
      "",
      "",
      "",
      Number(bill.grandTotal || 0).toFixed(2),
    ]);

    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${bill.invoiceNumber || "untitled"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredBills = useMemo(() => {
    let filtered = [...allBills];

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((bill) =>
        bill.invoiceNumber?.toLowerCase().includes(query) ||
        bill.seller?.name?.toLowerCase().includes(query) ||
        bill.buyer?.name?.toLowerCase().includes(query) ||
        bill.consignee?.name?.toLowerCase().includes(query) ||
        bill.items?.some((item) =>
          item.descriptionOfGoods?.toLowerCase().includes(query)
        )
      );
    }

    if (selectedSellers.length > 0) {
      filtered = filtered.filter((bill) =>
        selectedSellers.includes(bill.seller?.name)
      );
    }

    if (selectedBillTypes.length > 0) {
      filtered = filtered.filter((bill) =>
        selectedBillTypes.includes(bill.gst ? "Gst" : "Non-Gst")
      );
    }

    if (sortOption === "date") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "invoicenumber") {
      filtered.sort((a, b) =>
        String(a.invoiceNumber).localeCompare(String(b.invoiceNumber))
      );
    }

    return filtered;
  }, [allBills, searchQuery, selectedSellers, selectedBillTypes, sortOption]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 sm:p-6">
      <div className="w-full lg:w-72">
        <p className="my-2 text-xl font-medium">Filters</p>

        <div className="border border-gray-300 rounded pl-5 py-3 mt-4">
          <p className="mb-3 text-sm font-medium">Seller Name</p>
          <div className="flex flex-col gap-2 text-sm font-light max-h-40 overflow-y-auto pr-3">
            {sellerNames.map((seller) => (
              <label key={seller} className="flex gap-2 items-center">
                <input
                  className="w-3"
                  type="checkbox"
                  value={seller}
                  checked={selectedSellers.includes(seller)}
                  onChange={handleSellerFilterChange}
                />
                {seller}
              </label>
            ))}
          </div>
        </div>

        <div className="border border-gray-300 rounded pl-5 py-3 mt-6">
          <p className="mb-3 text-sm font-medium">Bill Type</p>
          <div className="flex flex-col gap-2 text-sm font-light">
            <label className="flex gap-2 items-center">
              <input
                className="w-3"
                type="checkbox"
                value="Gst"
                checked={selectedBillTypes.includes("Gst")}
                onChange={handleBillTypeFilterChange}
              />
              Gst
            </label>
            <label className="flex gap-2 items-center">
              <input
                className="w-3"
                type="checkbox"
                value="Non-Gst"
                checked={selectedBillTypes.includes("Non-Gst")}
                onChange={handleBillTypeFilterChange}
              />
              Non-Gst
            </label>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h1 className="text-2xl font-medium">
            All Bills ({filteredBills.length})
          </h1>

          <select
            className="border-2 border-gray-300 text-sm px-3 py-2 rounded"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date">Sort by: Date</option>
            <option value="invoicenumber">Sort by: Invoice Number</option>
          </select>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by invoice number, seller, buyer, consignee, items..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          {filteredBills.length === 0 ? (
            <p className="text-gray-500 mt-5 text-center">
              {searchQuery
                ? `No bills found for "${searchQuery}"`
                : "No bills found."}
            </p>
          ) : (
            filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">
                      Invoice: {bill.invoiceNumber || "-"}
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      Date: {formatDate(bill.date) || "-"} |{" "}
                      {bill.gst ? "GST" : "Non-GST"}
                    </div>

                    <div className="text-sm mt-2">
                      <span className="font-medium">Seller:</span>{" "}
                      {bill.seller?.name || "-"}
                    </div>

                    <div className="text-sm">
                      <span className="font-medium">Buyer:</span>{" "}
                      {bill.buyer?.name || "-"}
                    </div>

                    <div className="text-sm">
                      <span className="font-medium">Amount:</span> ₹
                      {Number(bill.grandTotal || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/bill/${bill.id}`)}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
                    >
                      Preview
                    </button>

                    <button
                      onClick={() => navigate(`/bill/${bill.id}/edit`)}
                      className="bg-yellow-600 text-white px-3 py-1.5 rounded text-sm hover:bg-yellow-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => downloadBillCSV(bill)}
                      className="bg-gray-700 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-800"
                    >
                      Download
                    </button>
                  </div>
                </div>

                {bill.items && bill.items.length > 0 && (
                  <div className="text-xs mt-3 text-gray-700">
                    <span className="font-medium">Items:</span>{" "}
                    {bill.items
                      .map((item) => item.descriptionOfGoods)
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Bills;