import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BillContext } from "../Context/BillContext";
import NumberToWords from "../Components/NumberToWords";
import { toast } from "react-toastify";

const EditBill = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const { getBillById, saveBillToDB } = useContext(BillContext);

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        setLoading(true);

        if (!billId) {
          toast.error("Invalid bill id");
          navigate("/listofbills");
          return;
        }

        const foundBill = await getBillById(billId);

        if (!foundBill) {
          toast.error("Bill not found");
          navigate("/listofbills");
          return;
        }

        setBill({
          ...foundBill,
          id: String(foundBill.id ?? billId),
          date: foundBill.date
            ? new Date(foundBill.date).toISOString().split("T")[0]
            : "",
          seller: foundBill.seller || {},
          buyer: foundBill.buyer || {},
          consignee: foundBill.consignee || {},
          items: Array.isArray(foundBill.items) ? foundBill.items : [],
          gst: Boolean(foundBill.gst),
          gstPercentage: foundBill.gstPercentage || 0,
        });
      } catch (error) {
        console.error("Error loading bill:", error);
        toast.error("Failed to load bill");
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [billId, getBillById, navigate]);

  const formatDisplayDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-GB");
  };

  const recalculateTotals = (draft) => {
    const items = Array.isArray(draft.items) ? draft.items : [];

    const normalizedItems = items.map((item, index) => {
      const quantity = Number(item.quantity || 0);
      const rate = Number(item.rate || 0);
      const amount = quantity * rate;

      return {
        ...item,
        slNo: index + 1,
        quantity: item.quantity ?? "",
        rate: item.rate ?? "",
        amount: amount ? amount.toFixed(2) : "",
      };
    });

    const subTotalValue = normalizedItems.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const gstPercentage = Number(draft.gstPercentage || 0);
    const gstAmountValue = draft.gst
      ? (subTotalValue * gstPercentage) / 100
      : 0;

    const cGstValue = gstAmountValue / 2;
    const sGstValue = gstAmountValue / 2;
    const totalBeforeRound = subTotalValue + gstAmountValue;
    const grandTotalValue = Math.round(totalBeforeRound);
    const roundOffValue = grandTotalValue - totalBeforeRound;

    return {
      ...draft,
      items: normalizedItems,
      subTotal: subTotalValue.toFixed(2),
      gstAmount: gstAmountValue.toFixed(2),
      cGst: cGstValue.toFixed(2),
      sGst: sGstValue.toFixed(2),
      grandTotal: grandTotalValue.toFixed(2),
      roundOff: roundOffValue.toFixed(2),
    };
  };

  const updateBillField = (field, value) => {
    setBill((prev) => recalculateTotals({ ...prev, [field]: value }));
  };

  const updateNestedField = (section, field, value) => {
    setBill((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value,
      },
    }));
  };

  const updateItemField = (index, field, value) => {
    setBill((prev) => {
      const updatedItems = [...(prev.items || [])];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      return recalculateTotals({
        ...prev,
        items: updatedItems,
      });
    });
  };

  const addItemRow = () => {
    setBill((prev) =>
      recalculateTotals({
        ...prev,
        items: [
          ...(prev.items || []),
          {
            slNo: (prev.items?.length || 0) + 1,
            descriptionOfGoods: "",
            hsnSAC: "",
            quantity: "",
            rate: "",
            amount: "",
          },
        ],
      })
    );
  };

  const removeItemRow = (index) => {
    setBill((prev) =>
      recalculateTotals({
        ...prev,
        items: (prev.items || []).filter((_, i) => i !== index),
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bill?.invoiceNumber?.trim()) {
      toast.error("Invoice number is required");
      return;
    }

    if (!bill?.buyer?.name?.trim()) {
      toast.error("Buyer name is required");
      return;
    }

    if (!bill?.items?.some((item) => item.descriptionOfGoods?.trim())) {
      toast.error("Add at least one item");
      return;
    }

    try {
      setSaving(true);

      const updatedBill = recalculateTotals({
        ...bill,
        id: String(billId),
        date: bill.date ? new Date(bill.date).toISOString() : "",
        updatedAt: new Date().toISOString(),
      });

      await saveBillToDB(updatedBill);
      toast.success("Bill updated successfully");
      navigate(`/bill/${billId}`);
    } catch (error) {
      console.error("Error updating bill:", error);
      toast.error("Failed to update bill");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg font-medium">Loading bill...</p>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg font-medium">Bill not found</p>
        <Link to="/listofbills">
          <button className="mt-4 bg-gray-700 p-2 text-white rounded hover:bg-gray-950">
            Back to Bills
          </button>
        </Link>
      </div>
    );
  }

  const safeSeller = bill.seller || {};
  const safeBuyer = bill.buyer || {};
  const safeConsignee = bill.consignee || {};
  const safeItems = bill.items || [];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="a4 bill-copy bg-white mb-8">
          <div className="flex justify-center">
            <div className="flex justify-center">
              <div className="flex flex-col">
                <h1 className="text-3xl text-center font-medium py-2">
                  Tax Invoice
                </h1>
                <p className="text-sm text-center py-0.5 font-medium">
                  Subject to Davanagere Jurisdction
                </p>
              </div>
              <div className="flex flex-col justify-center ml-4">
                <h1>(Edit Mode)</h1>
              </div>
            </div>
          </div>

          <table className="border border-b-0 font-medium w-full">
            <tbody>
              <tr>
                <td rowSpan="2" className="border-b align-top">
                  <section className="px-2 py-1 space-y-2">
                    <input
                      type="text"
                      value={safeSeller.name || ""}
                      onChange={(e) =>
                        updateNestedField("seller", "name", e.target.value)
                      }
                      className="w-full border px-2 py-1 text-xl"
                      placeholder="Seller name"
                    />
                    <textarea
                      value={safeSeller.address || ""}
                      onChange={(e) =>
                        updateNestedField("seller", "address", e.target.value)
                      }
                      className="w-full border px-2 py-1"
                      rows="2"
                      placeholder="Seller address"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={safeSeller.phone || ""}
                        onChange={(e) =>
                          updateNestedField("seller", "phone", e.target.value)
                        }
                        className="w-full border px-2 py-1"
                        placeholder="Phone"
                      />
                      <input
                        type="text"
                        value={safeSeller.email || ""}
                        onChange={(e) =>
                          updateNestedField("seller", "email", e.target.value)
                        }
                        className="w-full border px-2 py-1"
                        placeholder="Email"
                      />
                    </div>
                    {bill.gst && (
                      <input
                        type="text"
                        value={safeSeller.gstin || ""}
                        onChange={(e) =>
                          updateNestedField("seller", "gstin", e.target.value)
                        }
                        className="w-full border px-2 py-1"
                        placeholder="GSTIN/UIN"
                      />
                    )}
                  </section>
                </td>

                <td className="border px-1 align-top">
                  <p>Invoice Number:</p>
                  <input
                    type="text"
                    value={bill.invoiceNumber || ""}
                    onChange={(e) =>
                      updateBillField("invoiceNumber", e.target.value)
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>

                <td className="border p-1 align-top">
                  <p>Date:</p>
                  <input
                    type="date"
                    value={bill.date || ""}
                    onChange={(e) => updateBillField("date", e.target.value)}
                    className="w-full border px-2 py-1"
                  />
                </td>
              </tr>

              <tr className="font-medium">
                <td className="px-1 border align-top">
                  <p>Delivery Note:</p>
                  <input
                    type="text"
                    value={bill.deliveryNote || ""}
                    onChange={(e) =>
                      updateBillField("deliveryNote", e.target.value)
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>
                <td className="px-1 border align-top">
                  <p>Mode / Terms of Payment:</p>
                  <input
                    type="text"
                    value={bill.modeAndTermsOfPayment || ""}
                    onChange={(e) =>
                      updateBillField("modeAndTermsOfPayment", e.target.value)
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>
              </tr>

              <tr>
                <td rowSpan="2" className="border-b align-top">
                  <section className="px-2 py-1 space-y-2">
                    <input
                      type="text"
                      value={safeBuyer.name || ""}
                      onChange={(e) =>
                        updateNestedField("buyer", "name", e.target.value)
                      }
                      className="w-full border px-2 py-1 text-xl"
                      placeholder="Buyer name"
                    />
                    <textarea
                      value={safeBuyer.address || ""}
                      onChange={(e) =>
                        updateNestedField("buyer", "address", e.target.value)
                      }
                      className="w-full border px-2 py-1"
                      rows="2"
                      placeholder="Buyer address"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={safeBuyer.phone || ""}
                        onChange={(e) =>
                          updateNestedField("buyer", "phone", e.target.value)
                        }
                        className="w-full border px-2 py-1"
                        placeholder="Phone"
                      />
                      <input
                        type="text"
                        value={safeBuyer.email || ""}
                        onChange={(e) =>
                          updateNestedField("buyer", "email", e.target.value)
                        }
                        className="w-full border px-2 py-1"
                        placeholder="Email"
                      />
                    </div>
                    {bill.gst && (
                      <input
                        type="text"
                        value={safeBuyer.gstin || ""}
                        onChange={(e) =>
                          updateNestedField("buyer", "gstin", e.target.value)
                        }
                        className="w-full border px-2 py-1"
                        placeholder="GSTIN/UIN"
                      />
                    )}
                  </section>
                </td>

                <td className="border px-1 align-top">
                  <p>Purchase No.:</p>
                  <input
                    type="text"
                    value={bill.referenceNumber || ""}
                    onChange={(e) =>
                      updateBillField("referenceNumber", e.target.value)
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>

                <td className="border px-1 align-top">
                  <p>Vehicle No.:</p>
                  <input
                    type="text"
                    value={bill.vehicleNo || ""}
                    onChange={(e) =>
                      updateBillField("vehicleNo", e.target.value)
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>
              </tr>

              <tr>
                <td className="border px-1 align-top">
                  <p>E-way Bill No.:</p>
                  <input
                    type="text"
                    value={bill.ewayNumber || ""}
                    onChange={(e) =>
                      updateBillField("ewayNumber", e.target.value)
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>

                <td className="border px-1 align-top">
                  <p>Kind Attn.:</p>
                  <input
                    type="text"
                    value={bill.kindAttn || ""}
                    onChange={(e) =>
                      updateBillField("kindAttn", e.target.value)
                    }
                    className="w-full border px-2 py-1"
                  />
                </td>
              </tr>

              <tr>
                <td className="align-top">
                  <section className="px-2 py-1 space-y-2">
                    <input
                      type="text"
                      value={safeConsignee.name || ""}
                      onChange={(e) =>
                        updateNestedField("consignee", "name", e.target.value)
                      }
                      className="w-full border px-2 py-1 text-xl"
                      placeholder="Consignee name"
                    />
                    <textarea
                      value={safeConsignee.address || ""}
                      onChange={(e) =>
                        updateNestedField("consignee", "address", e.target.value)
                      }
                      className="w-full border px-2 py-1"
                      rows="2"
                      placeholder="Consignee address"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={safeConsignee.phone || ""}
                        onChange={(e) =>
                          updateNestedField("consignee", "phone", e.target.value)
                        }
                        className="w-full border px-2 py-1"
                        placeholder="Phone"
                      />
                      <input
                        type="text"
                        value={safeConsignee.email || ""}
                        onChange={(e) =>
                          updateNestedField("consignee", "email", e.target.value)
                        }
                        className="w-full border px-2 py-1"
                        placeholder="Email"
                      />
                    </div>
                    {bill.gst && (
                      <input
                        type="text"
                        value={safeConsignee.gstin || ""}
                        onChange={(e) =>
                          updateNestedField("consignee", "gstin", e.target.value)
                        }
                        className="w-full border px-2 py-1"
                        placeholder="GSTIN/UIN"
                      />
                    )}
                  </section>
                </td>
                <td className="border border-b-0"></td>
                <td className="border border-b-0"></td>
              </tr>
            </tbody>
          </table>

          <table className="border w-full">
            <thead>
              <tr className="text-sm font-medium border text-center">
                <td className="border p-2">Sl.No</td>
                <td className="border p-2 w-4/5">Description of Goods</td>
                <td className="border p-2">HSN/SAC</td>
                <td className="border p-2">Quantity</td>
                <td className="border p-2">Rate</td>
                <td className="border p-2 w-2/12">Amount</td>
                <td className="border p-2 no-print">Action</td>
              </tr>
            </thead>

            <tbody>
              {safeItems.map((item, index) => (
                <tr
                  key={index}
                  className="text-center text-sm font-medium leading-4"
                >
                  <td className="border-r p-2">{index + 1}</td>

                  <td className="text-start border-r p-2">
                    <input
                      type="text"
                      value={item.descriptionOfGoods || ""}
                      onChange={(e) =>
                        updateItemField(
                          index,
                          "descriptionOfGoods",
                          e.target.value
                        )
                      }
                      className="w-full border px-2 py-1"
                    />
                  </td>

                  <td className="border-r p-2">
                    <input
                      type="text"
                      value={item.hsnSAC || bill.hsnSAC || ""}
                      onChange={(e) =>
                        updateItemField(index, "hsnSAC", e.target.value)
                      }
                      className="w-full border px-2 py-1"
                    />
                  </td>

                  <td className="border-r p-2 text-end">
                    <input
                      type="number"
                      value={item.quantity || ""}
                      onChange={(e) =>
                        updateItemField(index, "quantity", e.target.value)
                      }
                      className="w-full border px-2 py-1 text-end"
                    />
                  </td>

                  <td className="border-r p-2 text-end">
                    <input
                      type="number"
                      value={item.rate || ""}
                      onChange={(e) =>
                        updateItemField(index, "rate", e.target.value)
                      }
                      className="w-full border px-2 py-1 text-end"
                    />
                  </td>

                  <td className="border-r p-2 text-end">
                    {Number(item.amount || 0).toFixed(2)}
                  </td>

                  <td className="border-r p-2 no-print">
                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}

              {Array.from(
                { length: Math.max(10 - safeItems.length, 0) },
                (_, i) => (
                  <tr
                    key={`empty-${i}`}
                    className="text-center text-sm font-medium"
                  >
                    <td className="border-r p-2">&nbsp;</td>
                    <td className="border-r p-2">&nbsp;</td>
                    <td className="border-r p-2">&nbsp;</td>
                    <td className="border-r p-2">&nbsp;</td>
                    <td className="border-r p-2">&nbsp;</td>
                    <td className="border-r p-2">&nbsp;</td>
                    <td className="border-r p-2 no-print">&nbsp;</td>
                  </tr>
                )
              )}
            </tbody>

            <tfoot className="font-medium leading-4">
              <tr className="no-print">
                <td colSpan={7} className="p-2 text-left">
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Add Item
                  </button>
                </td>
              </tr>

              {bill.gst && (
                <>
                  <tr>
                    <td colSpan={5} className="border-t border-r p-2 text-end">
                      Sub Total
                    </td>
                    <td className="border-t p-2 text-end">
                      ₹ {Number(bill.subTotal || 0).toFixed(2)}
                    </td>
                    <td className="no-print"></td>
                  </tr>

                  <tr>
                    <td colSpan={5} className="border-r p-2 text-end">
                      CGST (
                      {((Number(bill.gstPercentage) || 0) / 2).toFixed(2)}%)
                    </td>
                    <td className="p-2 text-end">
                      ₹ {Number(bill.cGst || 0).toFixed(2)}
                    </td>
                    <td className="no-print"></td>
                  </tr>

                  <tr>
                    <td colSpan={5} className="border-r p-2 text-end">
                      SGST (
                      {((Number(bill.gstPercentage) || 0) / 2).toFixed(2)}%)
                    </td>
                    <td className="p-2 text-end">
                      ₹ {Number(bill.sGst || 0).toFixed(2)}
                    </td>
                    <td className="no-print"></td>
                  </tr>
                </>
              )}

              <tr>
                <td colSpan={5} className="border-r p-2 text-end">
                  Round Off
                </td>
                <td className="p-2 text-end">
                  ₹ {Number(bill.roundOff || 0).toFixed(2)}
                </td>
                <td className="no-print"></td>
              </tr>

              <tr>
                <td colSpan={5} className="border-b border-r p-2 text-end">
                  Grand Total
                </td>
                <td className="border-b p-2 text-end">
                  ₹ {Number(bill.grandTotal || 0).toFixed(2)}
                </td>
                <td className="no-print"></td>
              </tr>
            </tfoot>
          </table>

          <div className="border border-t-0 p-2 font-medium">
            <p>Amounts Chargeable (in words) INR</p>
            <NumberToWords number={Number(bill.grandTotal) || 0} />
          </div>

          {bill.gst && (
            <div>
              <table className="border border-t-0 w-full">
                <thead className="text-center text-sm font-medium border border-t-0">
                  <tr>
                    <td rowSpan="2" className="p-2 border-r">
                      HSN/SAC
                    </td>
                    <td rowSpan="2" className="p-2 border-r">
                      Taxable Value
                    </td>
                    <td colSpan="2" className="p-2 border-r">
                      CGST
                    </td>
                    <td colSpan="2" className="p-2 border-r">
                      SGST/UTGST
                    </td>
                    <td rowSpan="2" className="p-2 border-r">
                      Total Tax Amount
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-1">Rate</td>
                    <td className="border p-1">Amount</td>
                    <td className="border p-1">Rate</td>
                    <td className="border p-1">Amount</td>
                  </tr>
                </thead>

                <tbody>
                  <tr className="text-center text-sm font-medium">
                    <td className="border p-2">
                      <input
                        type="text"
                        value={bill.hsnSAC || ""}
                        onChange={(e) =>
                          updateBillField("hsnSAC", e.target.value)
                        }
                        className="w-full border px-2 py-1 text-center"
                      />
                    </td>
                    <td className="border p-2">
                      {Number(bill.subTotal || 0).toFixed(2)}
                    </td>
                    <td className="border p-2">
                      {((Number(bill.gstPercentage) || 0) / 2).toFixed(2)}%
                    </td>
                    <td className="border p-2">
                      {Number(bill.cGst || 0).toFixed(2)}
                    </td>
                    <td className="border p-2">
                      {((Number(bill.gstPercentage) || 0) / 2).toFixed(2)}%
                    </td>
                    <td className="border p-2">
                      {Number(bill.sGst || 0).toFixed(2)}
                    </td>
                    <td className="border p-2">
                      {Number(bill.gstAmount || 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <td colSpan={7} className="font-medium p-2">
                      <p>Tax Amount (in words)</p>
                      <NumberToWords number={Number(bill.gstAmount) || 0} />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div className="w-full flex px-2 leading-4 border border-t-0">
            {bill.gst && (
              <section className="w-1/2 border-r py-1">
                <p className="underline">Declaration</p>
                <p>
                  We declare that this invoice shows the actual price of the
                  goods described and all particulars are true and correct. //
                  OD interest @ {bill.gstPercentage || 0}% p.a. chargeable for
                  payments after due date. // Goods once sold will not be taken
                  back. //
                </p>
              </section>
            )}

            <div className={`px-2 py-1 ${bill.gst ? "w-1/2" : "w-full"}`}>
              <p>Company&apos;s Bank Details</p>
              <p>
                Bank Name:{" "}
                <input
                  type="text"
                  value={safeSeller.bankname || ""}
                  onChange={(e) =>
                    updateNestedField("seller", "bankname", e.target.value)
                  }
                  className="border px-2 py-1 ml-1"
                />
              </p>
              <p>
                A/c No.:{" "}
                <input
                  type="text"
                  value={safeSeller.accno || ""}
                  onChange={(e) =>
                    updateNestedField("seller", "accno", e.target.value)
                  }
                  className="border px-2 py-1 ml-1"
                />
              </p>
              <p>
                Branch & IFS Code:{" "}
                <input
                  type="text"
                  value={safeSeller.branchifs || ""}
                  onChange={(e) =>
                    updateNestedField("seller", "branchifs", e.target.value)
                  }
                  className="border px-2 py-1 ml-1"
                />
              </p>
            </div>
          </div>

          <section className="flex flex-col justify-between items-end seller border border-t-0 w-full p-2 h-20">
            <p>for {safeSeller.name || ""}</p>
            <p>Authorised Signatory</p>
          </section>
        </div>

        <div className="flex gap-4 my-3 no-print">
          <Link to={`/bill/${billId}`}>
            <button
              type="button"
              className="bg-gray-700 p-2 text-white font-medium text-sm rounded hover:bg-gray-950 cursor-pointer"
            >
              Cancel
            </button>
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="bg-green-700 p-2 text-white font-medium text-sm rounded hover:bg-green-900 cursor-pointer disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Bill"}
          </button>

          <Link to="/listofbills">
            <button
              type="button"
              className="bg-blue-700 p-2 text-white font-medium text-sm rounded hover:bg-blue-950 cursor-pointer"
            >
              Back to Bills
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditBill;