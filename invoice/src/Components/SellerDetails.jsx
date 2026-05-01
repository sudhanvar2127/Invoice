import React from "react";
import { useContext } from "react";
import { BillContext } from "../Context/BillContext";

const SellerDetails = () => {
  const {
    listOfSellers,
    selectSeller,
    setSelectSeller,
    gst,
    nonGstSellerDetails,
    setNonGstSellerDetails,
  } = useContext(BillContext);

  const handleSellerChange = (index) => {
    setSelectSeller(index);
  };

  const handleNonGstSellerDetails = (event) => {
    const { name, value } = event.target;
    setNonGstSellerDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col space-y-4 w-full p-4 bg-white mb-4">
      {gst ? (
        <>
          {listOfSellers.map((item, index) => (
            <div
              key={index}
              className={`border rounded p-4 cursor-pointer transition-shadow ${
                selectSeller === index ? " border-black" : "border-gray-300"
              }`}
            >
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectSeller === index}
                  onChange={() => handleSellerChange(index)}
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                />
                <span className="font-semibold text-gray-800">{item.name}</span>
              </label>

              {selectSeller === index && (
                <div className="mt-3 space-y-1 text-gray-700 text-sm">
                  <p>
                    <span className="font-medium">Name:</span> {item.name}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span> {item.address}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {item.phone}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {item.email}
                  </p>
                  <p>
                    <span className="font-medium">GSTIN:</span> {item.gstin}
                  </p>
                </div>
              )}
            </div>
          ))}
        </>
      ) : (
        <>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Seller Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={nonGstSellerDetails.name || ""}
              onChange={handleNonGstSellerDetails}
              placeholder="Enter seller name"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={nonGstSellerDetails.address || ""}
              onChange={handleNonGstSellerDetails}
              placeholder="Enter seller address"
              rows="3"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={nonGstSellerDetails.phone || ""}
              onChange={handleNonGstSellerDetails}
              placeholder="Enter phone number"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={nonGstSellerDetails.email || ""}
              onChange={handleNonGstSellerDetails}
              placeholder="Enter email address"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SellerDetails;
