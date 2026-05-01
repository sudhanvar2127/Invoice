import React, { forwardRef } from "react";
import { useContext } from "react";
import { BillContext } from "../Context/BillContext";
import NumbertoWords from "./NumberToWords";

const PrintBill = forwardRef(({ copyName = "Original" }, ref) => {
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
    descriptionOfGoods,
    hsnSAC,
    quantity,
    rate,
    amount,
    roundOff,
    gstPercentage,
    subTotal,
    gstAmount,
    grandTotal,
    cGst,
    sGst,
    getNextInvoiceNumber,
    setInvoiceNumber,
    setBillData,
    allBills,
    setAllBills,
    nonGstSellerDetails,
    kindAttn,
    setKindAttn,
    vehicleNo,
  } = useContext(BillContext);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const safeSellerDetails = nonGstSellerDetails || {
    name: "",
    address: "",
    phone: "",
    email: "",
    bankname: "",
    accno: "",
    branchifs: "",
  };
  return (
    <div>
      <div ref={ref} className="a4">
        <div className="flex justify-center">
          <div className="flex flex-col">
            <h1 className="text-3xl text-center font-medium py-2">
              Tax Invoice
            </h1>
            <p className="text-sm text-center py-0.5 font-medium">
              Subject to Davanagere Jurisdction
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <h1>({copyName})</h1>
          </div>
        </div>

        <table className="border border-b-0 font-medium w-full">
          <tbody>
            <tr>
              <td rowSpan="2" className="border-b">
                <section className="px-2">
                  {gst ? (
                    listOfSellers.map(
                      (item, index) =>
                        selectSeller === index && (
                          <div key={index} className="leading-4">
                            <p className="text-xl">{item.name}</p>
                            <p>{item.address}</p>
                            <p className="space-x-4">
                              <span>Phone: {item.phone}</span>
                              <span>Email: {item.email}</span>
                            </p>
                            <p>GSTIN/UIN: {item.gstin}</p>
                          </div>
                        ),
                    )
                  ) : (
                    <div className="leading-4">
                      <p className="text-xl">{safeSellerDetails.name || ""}</p>
                      <p>{safeSellerDetails.address || ""}</p>
                      <p>
                        <span>Phone: {safeSellerDetails.phone || ""}</span>
                        <span>Email: {safeSellerDetails.email || ""}</span>
                      </p>
                    </div>
                  )}
                </section>
              </td>
              <td className="border px-1">
                <p>Invoice Number:</p> {invoiceNumber}
              </td>
              <td className="border p-1">
                <p>Date:</p> {formatDate(date)}
              </td>
            </tr>
            <tr className="font-medium">
              <td className="px-1 border">
                <p>Delivery Note:</p> {deliveryNote}
              </td>
              <td className="px-1 border">
                <p>Mode / Terms of Payment:</p> {modeAndTermsOfPayment}
              </td>
            </tr>
            <tr>
              <td rowSpan="2" className="border-b">
                <section className="px-2 leading-4">
                  <p className="text-xl">{buyer.name}</p>
                  <p>{buyer.address}</p>
                  <p className="space-x-3">
                    <span>Phone: {buyer.phone}</span>
                    <span>Email: {buyer.email}</span>
                  </p>
                  {gst && (
                    <p>
                      <span>GSTIN/UIN: {buyer.gstin}</span>
                    </p>
                  )}
                </section>
              </td>
              <td className="border px-1">
                <p>Purchase No.:</p> {referenceNumber}
              </td>
              <td className="border px-1">
                <p>Vehical No.:</p> {vehicleNo}
              </td>
            </tr>
            <tr>
              <td className="border px-1">
                <p>e-way Bill No.:</p> {ewayNumber}
              </td>
              <td className="border px-1">
                <p>Kind Attn.:</p> {kindAttn}
              </td>
            </tr>
            <tr>
              <td>
                <section className="px-2 leading-4">
                  <p className="text-xl">{consignee.name}</p>
                  <p>{consignee.address}</p>
                  <p className="space-x-3">
                    <span>Phone: {consignee.phone}</span>
                    <span>Email: {consignee.email}</span>
                  </p>
                  {gst && (
                    <p>
                      <span>GSTIN/UIN: {consignee.gstin}</span>
                    </p>
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
            </tr>
          </thead>

          <tbody>
            {addItems.map((item, index) => (
              <tr
                key={index}
                className="text-center text-sm font-medium leading-3.5"
              >
                <td className="border-r p-2">{index + 1}</td>
                <td className="text-start border-r p-2">
                  {item.descriptionOfGoods}
                </td>
                <td className="border-r p-2">{hsnSAC}</td>
                <td className="border-r p-2 text-end">{item.quantity}</td>
                <td className="border-r p-2 text-end">{item.rate}</td>
                <td className="border-r p-2 text-end">
                  {item.amount.toFixed(2)}
                </td>
              </tr>
            ))}

            {[...Array(Math.max(13 - addItems.length, 0))].map((_, i) => (
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
              </tr>
            ))}
          </tbody>

          <tfoot className="font-medium leading-3.5">
            {gst && (
              <>
                <tr>
                  <td colSpan={5} className="border-t border-r p-2 text-end">
                    Sub Total
                  </td>
                  <td className="border-t p-2 text-end">
                    ₹ {subTotal.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="border-r p-2 text-end">
                    CGST ({(gstPercentage / 2).toFixed(2)}%)
                  </td>
                  <td className="p-2 text-end">{(cGst ?? 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={5} className="border-r p-2 text-end">
                    SGST ({(gstPercentage / 2).toFixed(2)}%)
                  </td>
                  <td className="p-2 text-end">{(sGst ?? 0).toFixed(2)}</td>
                </tr>
              </>
            )}
            <tr>
              <td colSpan={5} className="border-r p-2 text-end">
                Round Off
              </td>
              <td className="p-2 text-end">{roundOff.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={5} className="border-b border-r p-2 text-end">
                Grand Total
              </td>
              <td className="border-b p-2 text-end">
                ₹ {grandTotal.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="border border-t-0 p-2 font-medium">
          <p>Amounts Chargeable (in words) INR</p>
          <NumbertoWords number={grandTotal} />
        </div>

        {gst && (
          <div className="">
            <table className="border border-t-0 w-full">
              <thead className="text-center text-sm font-medium border border-t-0">
                <tr>
                  <td rowSpan={2} className="p-2 border-r">
                    HSN/SAC
                  </td>
                  <td rowSpan={2} className="p-2 border-r">
                    Taxable Value
                  </td>
                  <td colSpan={2} className="p-2 border-r">
                    CGST
                  </td>
                  <td colSpan={2} className="p-2 border-r">
                    SGST/UTGST
                  </td>
                  <td rowSpan={2} className="p-2 border-r">
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
                  <td className="border p-2">{hsnSAC}</td>
                  <td className="border p-2">{subTotal.toFixed(2)}</td>
                  <td className="border p-2">
                    {(gstPercentage / 2).toFixed(2)}%
                  </td>
                  <td className="border p-2">{(cGst ?? 0).toFixed(2)}</td>
                  <td className="border p-2">
                    {(gstPercentage / 2).toFixed(2)}%
                  </td>
                  <td className="border p-2">{(sGst ?? 0).toFixed(2)}</td>
                  <td className="border p-2">{gstAmount.toFixed(2)}</td>
                </tr>
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan={7} className="font-medium p-2">
                    <p>Tax Amount (in words)</p>
                    <NumbertoWords number={gstAmount} />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="w-full flex px-2 leading-4 border border-t-0">
          {gst && (
            <>
              <section className="w-1/2 border-r py-1">
                <p className="underline">Declaration</p>
                <p>
                  We declare that this invoice shows the actual price of the
                  goods describe and all particulars are true and correct.// OD
                  interest @ {gstPercentage}% p.a. chargeable for payments after
                  due date.//GOODs once sold will not be taken back.//
                </p>
              </section>
            </>
          )}

          {gst
            ? // GST Mode - Show bank details from selected seller
              listOfSellers.map(
                (item, index) =>
                  selectSeller === index && (
                    <div key={index} className="px-2 w-1/2 py-1">
                      <p>Company's Bank Details</p>
                      <p>
                        Bank Name: <strong>{item.bankname}</strong>
                      </p>
                      <p>
                        A/c No.: <strong>{item.accno}</strong>
                      </p>
                      <p>
                        Branch & IFS Code: <strong>{item.branchifs}</strong>
                      </p>
                    </div>
                  ),
              )
            : safeSellerDetails.bankname && (
                <div className="px-2 w-1/2 py-1">
                  <p>Company's Bank Details</p>
                  <p>
                    Bank Name: <strong>{safeSellerDetails.bankname}</strong>
                  </p>
                  <p>
                    A/c No.: <strong>{safeSellerDetails.accno}</strong>
                  </p>
                  <p>
                    Branch & IFS Code:{" "}
                    <strong>{safeSellerDetails.branchifs}</strong>
                  </p>
                </div>
              )}
        </div>

        <section className="flex flex-col justify-between items-end seller border border-t-0 w-full p-2 h-20">
          {gst ? (
            listOfSellers.map(
              (item, index) =>
                selectSeller === index && <p key={index}>for {item.name}</p>,
            )
          ) : (
            <p>for {safeSellerDetails.name}</p>
          )}
          <p>Authorised Signatory</p>
        </section>
      </div>
    </div>
  );
});

export default PrintBill;