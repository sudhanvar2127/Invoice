import React, { useContext, useState, useEffect } from "react";
import { BillContext } from "../Context/BillContext";

const BuyerAndConsigneeDetails = () => {
  const { buyer, setBuyer, consignee, setConsignee, gst } =
    useContext(BillContext);
  const [sameAsBuyer, setSameAsBuyer] = useState(true);

  const handleBuyerDetails = (event) => {
    const { name, value } = event.target;
    setBuyer((prev) => ({ ...prev, [name]: value }));
  };

  const handleConsigneeDetails = (event) => {
    const { name, value } = event.target;
    setConsignee((prev) => ({ ...prev, [name]: value }));
  };

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (sameAsBuyer) {
      setConsignee({ ...buyer });
      setDisabled(true);
    }
  }, [buyer, sameAsBuyer, setConsignee]);
  return (
    <div className="flex flex-col my-2">
      <div className="mb-4 flex items-center text-sm">
        <input
          type="checkbox"
          checked={sameAsBuyer}
          onChange={() => setSameAsBuyer((v) => !v)}
          id="same-as-buyer"
          className="mr-2"
        />
        <label htmlFor="same-as-buyer" className="font-medium text-base">
          Consignee Same as Buyer
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col font-medium gap-1">
          <h2 className="text-base">Buyer (Bill to)</h2>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={buyer.name}
            onChange={handleBuyerDetails}
            className="p-2 border rounded"
          />
          <label htmlFor="address">Address</label>
          <textarea
            type="text"
            name="address"
            value={buyer.address}
            onChange={handleBuyerDetails}
            className="p-2 border rounded"
          />
          <label htmlFor="phone">Phone</label>
          <input
            type="number"
            name="phone"
            value={buyer.phone}
            onChange={handleBuyerDetails}
            className="p-2 border rounded"
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={buyer.email}
            onChange={handleBuyerDetails}
            className="p-2 border rounded"
          />
          {gst && (
            <div className="flex flex-col gap-2 font-medium text-sm">
              <label htmlFor="gstin">GSTIN</label>
              <input
                type="text"
                name="gstin"
                value={buyer.gstin}
                onChange={handleBuyerDetails}
                className="p-2 border rounded"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col font-medium gap-1 my-2">
          <h2 className="text-base">Consignee (Ship to)</h2>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={consignee.name}
            onChange={handleConsigneeDetails}
            className={`w-full border rounded p-2 ${
              disabled ? "bg-gray-100" : "bg-white"
            }`}
            disabled={sameAsBuyer}
          />
          <label htmlFor="address">Address</label>
          <textarea
            type="text"
            name="address"
            value={consignee.address}
            onChange={handleConsigneeDetails}
            className={`w-full border rounded p-2 ${
              disabled ? "bg-gray-100" : "bg-white"
            }`}
            disabled={sameAsBuyer}
          />
          <label htmlFor="phone">Phone</label>
          <input
            type="number"
            name="phone"
            value={consignee.phone}
            onChange={handleConsigneeDetails}
            className={`w-full border rounded p-2 ${
              disabled ? "bg-gray-100" : "bg-white"
            }`}
            disabled={sameAsBuyer}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={consignee.email}
            onChange={handleConsigneeDetails}
            className={`w-full border rounded p-2 ${
              disabled ? "bg-gray-100" : "bg-white"
            }`}
            disabled={sameAsBuyer}
          />
          {gst && (
            <div className="flex flex-col gap-2 font-medium text-sm">
              <label htmlFor="gstin">GSTIN</label>
              <input
                type="text"
                name="gstin"
                value={consignee.gstin}
                onChange={handleConsigneeDetails}
                className={`w-full border rounded p-2 ${
                  disabled ? "bg-gray-100" : "bg-white"
                }`}
                disabled={sameAsBuyer}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerAndConsigneeDetails;
