import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { BillContext } from "../Context/BillContext";
import NumbertoWords from "../Components/NumbertoWords";
import { toast } from "react-toastify";

const BillViewer = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const { getBillById } = useContext(BillContext);
  const printRef = useRef(null);

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        setLoading(true);
        const foundBill = await getBillById(billId);
        setBill(foundBill || null);
      } catch (error) {
        console.error("Error loading bill:", error);
        toast.error("Failed to load bill");
      } finally {
        setLoading(false);
      }
    };

    if (billId) {
      fetchBill();
    }
  }, [billId, getBillById]);

  const formatDisplayDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-GB");
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice_${bill?.invoiceNumber || "Bill"}`,
    onAfterPrint: () => toast.success("Bill sent to print"),
  });

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

  const BillCopy = ({ copyName }) => (
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
          <div className="flex flex-col justify-center">
            <h1>({copyName})</h1>
          </div>
        </div>
      </div>

      <table className="border border-b-0 font-medium w-full">
        <tbody>
          <tr>
            <td rowSpan="2" className="border-b">
              <section className="px-2">
                <div className="leading-5">
                  <p className="text-xl">{safeSeller.name || ""}</p>
                  <p>{safeSeller.address || ""}</p>
                  <p className="space-x-4">
                    <span>Phone: {safeSeller.phone || ""}</span>
                    <span>Email: {safeSeller.email || ""}</span>
                  </p>
                  {bill.gst && <p>GSTIN/UIN: {safeSeller.gstin || ""}</p>}
                </div>
              </section>
            </td>
            <td className="border px-1">
              <p>Invoice Number:</p> {bill.invoiceNumber || ""}
            </td>
            <td className="border p-1">
              <p>Date:</p> {formatDisplayDate(bill.date)}
            </td>
          </tr>

          <tr className="font-medium">
            <td className="px-1 border">
              <p>Delivery Note:</p> {bill.deliveryNote || ""}
            </td>
            <td className="px-1 border">
              <p>Mode / Terms of Payment:</p> {bill.modeAndTermsOfPayment || ""}
            </td>
          </tr>

          <tr>
            <td rowSpan="2" className="border-b">
              <section className="px-2 leading-4.5">
                <p className="text-xl">{safeBuyer.name || ""}</p>
                <p>{safeBuyer.address || ""}</p>
                <p className="space-x-3">
                  <span>Phone: {safeBuyer.phone || ""}</span>
                  <span>Email: {safeBuyer.email || ""}</span>
                </p>
                {bill.gst && <p>GSTIN/UIN: {safeBuyer.gstin || ""}</p>}
              </section>
            </td>
            <td className="border px-1">
              <p>Purchase No.:</p> {bill.referenceNumber || ""}
            </td>
            <td className="border px-1">
              <p>Vehicle No.:</p> {bill.vehicleNo || ""}
            </td>
          </tr>

          <tr>
            <td className="border px-1">
              <p>E-way Bill No.:</p> {bill.ewayNumber || ""}
            </td>
            <td className="border px-1">
              <p>Kind Attn.:</p> {bill.kindAttn || ""}
            </td>
          </tr>

          <tr>
            <td>
              <section className="px-2 leading-5">
                <p className="text-xl">{safeConsignee.name || ""}</p>
                <p>{safeConsignee.address || ""}</p>
                <p className="space-x-3">
                  <span>Phone: {safeConsignee.phone || ""}</span>
                  <span>Email: {safeConsignee.email || ""}</span>
                </p>
                {bill.gst && <p>GSTIN/UIN: {safeConsignee.gstin || ""}</p>}
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
          {safeItems.map((item, index) => (
            <tr key={index} className="text-center text-sm font-medium leading-3.5">
              <td className="border-r p-2">{index + 1}</td>
              <td className="text-start border-r p-2">
                {item.descriptionOfGoods || ""}
              </td>
              <td className="border-r p-2">{item.hsnSAC || bill.hsnSAC || ""}</td>
              <td className="border-r p-2 text-end">{item.quantity || ""}</td>
              <td className="border-r p-2 text-end">{item.rate || ""}</td>
              <td className="border-r p-2 text-end">{item.amount || ""}</td>
            </tr>
          ))}

          {Array.from({ length: Math.max(10 - safeItems.length, 0) }, (_, i) => (
            <tr
              key={`empty-${copyName}-${i}`}
              className="text-center text-sm font-medium leading-3.5"
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
          {bill.gst && (
            <>
              <tr>
                <td colSpan={5} className="border-t border-r p-2 text-end">
                  Sub Total
                </td>
                <td className="border-t p-2 text-end">
                  ₹ {Number(bill.subTotal || 0).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan={5} className="border-r p-2 text-end">
                  CGST ({((Number(bill.gstPercentage) || 0) / 2).toFixed(2)}%)
                </td>
                <td className="p-2 text-end">
                  ₹ {Number(bill.cGst || 0).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan={5} className="border-r p-2 text-end">
                  SGST ({((Number(bill.gstPercentage) || 0) / 2).toFixed(2)}%)
                </td>
                <td className="p-2 text-end">
                  ₹ {Number(bill.sGst || 0).toFixed(2)}
                </td>
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
          </tr>
          <tr>
            <td colSpan={5} className="border-b border-r p-2 text-end">
              Grand Total
            </td>
            <td className="border-b p-2 text-end">
              ₹ {Number(bill.grandTotal || 0).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="border border-t-0 p-2 font-medium">
        <p>Amounts Chargeable (in words) INR</p>
        <NumbertoWords number={Number(bill.grandTotal) || 0} />
      </div>

      {bill.gst && (
        <div>
          <table className="border border-t-0 w-full">
            <thead className="text-center text-sm font-medium border border-t-0">
              <tr>
                <td rowSpan="2" className="p-2 border-r">HSN/SAC</td>
                <td rowSpan="2" className="p-2 border-r">Taxable Value</td>
                <td colSpan="2" className="p-2 border-r">CGST</td>
                <td colSpan="2" className="p-2 border-r">SGST/UTGST</td>
                <td rowSpan="2" className="p-2 border-r">Total Tax Amount</td>
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
                <td className="border p-2">{bill.hsnSAC || ""}</td>
                <td className="border p-2">{Number(bill.subTotal || 0).toFixed(2)}</td>
                <td className="border p-2">
                  {((Number(bill.gstPercentage) || 0) / 2).toFixed(2)}%
                </td>
                <td className="border p-2">{Number(bill.cGst || 0).toFixed(2)}</td>
                <td className="border p-2">
                  {((Number(bill.gstPercentage) || 0) / 2).toFixed(2)}%
                </td>
                <td className="border p-2">{Number(bill.sGst || 0).toFixed(2)}</td>
                <td className="border p-2">
                  {Number(bill.gstAmount || 0).toFixed(2)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={7} className="font-medium p-2">
                  <p>Tax Amount (in words)</p>
                  <NumbertoWords number={Number(bill.gstAmount) || 0} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="w-full flex px-1 leading-4 border border-t-0">
        {bill.gst && (
          <section className="w-1/2 border-r py-1">
            <p className="underline">Declaration</p>
            <p>
              We declare that this invoice shows the actual price of the goods
              described and all particulars are true and correct. // OD interest @{" "}
              {bill.gstPercentage || 0}% p.a. chargeable for payments after due
              date. // Goods once sold will not be taken back. //
            </p>
          </section>
        )}

        <div className={`px-2 py-1 ${bill.gst ? "w-1/2" : "w-full"}`}>
          <p>Company&apos;s Bank Details</p>
          <p>
            Bank Name: <strong>{safeSeller.bankname || ""}</strong>
          </p>
          <p>
            A/c No.: <strong>{safeSeller.accno || ""}</strong>
          </p>
          <p>
            Branch & IFS Code: <strong>{safeSeller.branchifs || ""}</strong>
          </p>
        </div>
      </div>

      <section className="flex flex-col justify-between items-end border border-t-0 w-full p-2 h-20">
        <p>for {safeSeller.name || ""}</p>
        <p>Authorised Signatory</p>
      </section>
    </div>
  );

  return (
    <div>
      <style>
        {`
          @media screen {
            .print-only {
              position: absolute;
              left: -99999px;
              top: 0;
            }
          }

          @media print {
            .no-print {
              display: none !important;
            }

            .bill-copy {
              page-break-after: always;
              break-after: page;
            }

            .bill-copy:last-child {
              page-break-after: auto;
              break-after: auto;
            }
          }
        `}
      </style>

      <div className="no-print">
        <BillCopy copyName="Original" />
      </div>

      <div ref={printRef} className="print-only">
        <BillCopy copyName="Original" />
        <BillCopy copyName="Duplicate" />
        <BillCopy copyName="Triplicate" />
      </div>

      <div className="flex gap-4 my-3 no-print">
        <Link to="/listofbills">
          <button className="bg-gray-700 p-2 text-white font-medium text-sm rounded hover:bg-gray-950 cursor-pointer">
            Back
          </button>
        </Link>

        <button
          onClick={() => navigate(`/bill/${billId}/edit`)}
          className="bg-yellow-600 p-2 text-white font-medium text-sm rounded hover:bg-yellow-700 cursor-pointer"
        >
          Edit
        </button>

        <button
          onClick={handlePrint}
          className="bg-blue-700 p-2 text-white font-medium text-sm rounded hover:bg-blue-950 cursor-pointer"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default BillViewer;