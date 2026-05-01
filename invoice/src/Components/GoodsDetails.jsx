import React from "react";
import { useContext, useEffect } from "react";
import { BillContext } from "../Context/BillContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const GoodsDetails = () => {
  const {
    gst,
    addItems,
    setAddItems,
    descriptionOfGoods,
    setDescriptionOfGoods,
    hsnSAC,
    quantity,
    setQuantity,
    rate,
    setRate,
    amount,
    setAmount,
    gstPercentage,
    setGstPrecentage,
    subTotal,
    setSubTotal,
    gstAmount,
    setGstAmount,
    roundOff,
    setRoundOff,
    grandTotal,
    setGrandTotal,
    cGst,
    setCGST,
    sGst,
    setSGST,
  } = useContext(BillContext);

  const handleAddItem = () => {
    if (!descriptionOfGoods.trim() || !quantity || !rate) {
      toast.error("Please Enter all fields properly");
      return;
    }

    const qty = Number(quantity);
    const rt = parseFloat(rate);

    const amt = qty * rt;
    const newItem = {
      descriptionOfGoods,
      quantity: qty,
      rate: rt,
      amount: amt,
    };

    setAddItems([...addItems, newItem]);

    setDescriptionOfGoods("");
    setQuantity("");
    setRate("");
    setAmount("");
  };

  const handleRemoveItem = (indexToRemove) => {
    const updatedItems = addItems.filter((_, index) => index !== indexToRemove);
    setAddItems(updatedItems);
  };

  useEffect(() => {
    const subtotalCalc = addItems.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    setSubTotal(subtotalCalc);

    let gstAmtCalc = 0;
    if (gst && gstPercentage) {
      gstAmtCalc = subtotalCalc * (Number(gstPercentage) / 100);
      setGstAmount(gstAmtCalc);

      // Split GST equally into CGST and SGST
      const cgstVal = gstAmtCalc / 2;
      const sgstVal = gstAmtCalc / 2;

      setCGST(cgstVal);
      setSGST(sgstVal);
    } else {
      setGstAmount(0);
      setCGST(0);
      setSGST(0);
    }

    const rawTotal = subtotalCalc + gstAmtCalc;
    let roundedTotal;

    const decimalPart = rawTotal - Math.floor(rawTotal);
    if (decimalPart <= 0.5) {
      roundedTotal = Math.floor(rawTotal);
    } else {
      roundedTotal = Math.ceil(rawTotal);
    }

    const roundOffValue = roundedTotal - rawTotal;

    setRoundOff(roundOffValue);
    setGrandTotal(roundedTotal);
  }, [
    addItems,
    gstPercentage,
    gst,
    setSubTotal,
    setGstAmount,
    setRoundOff,
    setGrandTotal,
    setCGST,
    setSGST,
  ]);

  return (
    <div className="flex flex-col w-full">
      <h2 className="font-bold text-4xl">Add Items</h2>
      <div className="py-6 flex gap-4">
        <section className="flex flex-col text-sm font-medium gap-2 w-[35%]">
          <label>Description of Goods:</label>
          <textarea
            name="descriptionOfGoods"
            value={descriptionOfGoods}
            onChange={(e) => setDescriptionOfGoods(e.target.value)}
            className="border rounded p-3 "
          />
        </section>
        <section className="flex flex-col text-sm font-medium gap-2 w-[15%]">
          <label>Quantity:</label>
          <input
            name="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border rounded p-2"
          />
        </section>
        <section className="flex flex-col text-sm font-medium gap-2 w-[15%]">
          <label>Rate:</label>
          <input
            name="rate"
            type="number"
            step="any"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="border rounded p-2"
          />
        </section>
        <section className="flex flex-col text-sm font-medium gap-2 w-[15%]">
          <label>&nbsp;</label>
          <button
            onClick={handleAddItem}
            className="bg-gray-700 rounded p-2 text-white hover:bg-black cursor-pointer"
          >
            Add Item
          </button>
        </section>
      </div>
      <div>
        <table className="border w-full">
          <thead>
            <tr className="text-sm font-medium border text-center">
              <td className="border p-2">Sl.No</td>
              <td className="border p-2">Description of Goods</td>
              <td className="border p-2">HSN/SAC</td>
              <td className="border p-2">Quantity</td>
              <td className="border p-2">Rate</td>
              <td className="border p-2">Amount</td>
            </tr>
          </thead>

          <tbody>
            {addItems.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{item.descriptionOfGoods}</td>
                <td className="border p-2">{hsnSAC}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">{item.rate}</td>
                <td className="border p-2">{item.amount.toFixed(2)}</td>
                <td>
                  <button
                    className="bg-red-700 text-white py-1 rounded text-sm px-2 cursor-pointer"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="my-2">
        {gst && (
          <section className="flex flex-col text-sm font-medium gap-2 w-1/2">
            <label>GST percentage:</label>
            <input
              type="number"
              name="gstPrecentage"
              value={gstPercentage}
              onChange={(e) => setGstPrecentage(e.target.value)}
              className="border rounded p-2"
            />
          </section>
        )}
        <div className="flex flex-col items-end my-1 text-sm font-medium">
          <p>Subtotal: {subTotal.toFixed(2)}</p>
          {gst && (
            <>
              <p>
                CGST ({(gstPercentage / 2).toFixed(2)}%):{" "}
                {(cGst ?? 0).toFixed(2)}
              </p>
              <p>
                SGST ({(gstPercentage / 2).toFixed(2)}%):{" "}
                {(sGst ?? 0).toFixed(2)}
              </p>
            </>
          )}
          <p>Round Off: {roundOff.toFixed(2)}</p>
          <p>Total Amount: {grandTotal.toFixed(2)}</p>
        </div>
      </div>
      <Link to="/bill/preview">
        <div className="w-full flex justify-end">
          <button className="bg-blue-800 text-white rounded p-2 hover:bg-blue-950 cursor-pointer">
            Preview
          </button>
        </div>
      </Link>
    </div>
  );
};

export default GoodsDetails;