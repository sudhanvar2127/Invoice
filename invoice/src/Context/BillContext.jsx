import { createContext, useState, useEffect } from "react";

export const BillContext = createContext();

const DB_NAME = "BillingDB";
const DB_VERSION = 1;
const STORE_NAME = "bills";

const openBillingDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });

        store.createIndex("invoiceNumber", "invoiceNumber", { unique: true });
        store.createIndex("date", "date", { unique: false });
        store.createIndex("sellerName", "seller.name", { unique: false });
        store.createIndex("buyerName", "buyer.name", { unique: false });
        store.createIndex("consigneeName", "consignee.name", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const BillContextProvider = (props) => {
  const listOfSellers = [
    {
      id: "ShreeKalpavrushaPrinters",
      name: "Shree Kalpavrusha Printers",
      phone: 9972799992,
      email: "sri.kalpavrushaprinters@gmail.com",
      address:
        "# 495/15, Bharath Poultry Form, Nittuvalli Road, Near R.V.V.S. ITI College, Davangere - 577004",
      gstin: "29ABSPH4496G1Z0",
      bankname: "Karanataka Grameena Bank",
      accno: 10590130002112,
      branchifs: "P J Branch, PKGB0010590",
    },
    {
      id: "SriSharadaPrinters",
      name: "Sri Sharada Printers",
      phone: 7899274646,
      email: "sri.sharadaprinters@gmail.com",
      address:
        "#4382/1 Suvidya 7th B main Road Swami Vivekananda Badavane, Behind Officers club, Davangere - 577004",
      gstin: "29AJCPN3953E1Z5",
      bankname: "Karanataka Grameena Bank",
      accno: 10590110000550,
      branchifs: "P J Branch, PKGB0010590",
    },
  ];

  const [selectSeller, setSelectSeller] = useState(listOfSellers[0]);
  const [gst, setGst] = useState(true);
  const [nonGstSellerDetails, setNonGstSellerDetails] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [buyer, setBuyer] = useState({
    name: "",
    address: "",
    phone: "",
    gstin: "",
    email: "",
  });

  const [consignee, setConsignee] = useState({
    name: "",
    address: "",
    phone: "",
    gstin: "",
    email: "",
  });

  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [invoiceNumber, setInvoiceNumber] = useState(() => {
    const stored = localStorage.getItem("currentInvoiceNumber");
    if (stored) return stored;

    const fy = getFinancialYear();
    const key = `inv-serial-${fy}`;

    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "0");
    }

    const newNumber = `${fy}/001`;
    localStorage.setItem("currentInvoiceNumber", newNumber);
    return newNumber;
  });

  const [kindAttn, setKindAttn] = useState("");
  const [ewayNumber, setEwayNumber] = useState("");
  const [modeAndTermsOfPayment, setModeAndTremsOfPayment] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [addItems, setAddItems] = useState([]);
  const [descriptionOfGoods, setDescriptionOfGoods] = useState("");
  const [hsnSAC, setHSNSAC] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [amount, setAmount] = useState("");
  const [roundOff, setRoundOff] = useState(0);
  const [gstPercentage, setGstPrecentage] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [cGst, setCGST] = useState(0);
  const [sGst, setSGST] = useState(0);
  const [billData, setBillData] = useState(null);
  const [allBills, setAllBills] = useState([]);

  function getFinancialYear() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    if (month >= 4) {
      return `${year}-${(year + 1).toString().slice(-2)}`;
    } else {
      return `${year - 1}-${year.toString().slice(-2)}`;
    }
  }

  function getNextInvoiceNumber() {
    const fy = getFinancialYear();
    const key = `inv-serial-${fy}`;
    let serial = parseInt(localStorage.getItem(key) || "0", 10);

    serial += 1;
    localStorage.setItem(key, serial);

    const nextNumber = `${fy}/${serial.toString().padStart(3, "0")}`;
    localStorage.setItem("currentInvoiceNumber", nextNumber);
    setInvoiceNumber(nextNumber);

    return nextNumber;
  }

  const loadBillsFromDB = async () => {
    try {
      const db = await openBillingDB();

      const bills = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      setAllBills(bills);

      if (bills.length > 0) {
        setBillData(bills[bills.length - 1]);
      } else {
        setBillData(null);
      }

      return bills;
    } catch (error) {
      console.error("Error loading bills from IndexedDB:", error);
      return [];
    }
  };

  const saveBillToDB = async (newBillData) => {
    try {
      const db = await openBillingDB();

      const billToSave = {
        ...newBillData,
        id: newBillData.id || `BILL-${newBillData.invoiceNumber}-${Date.now()}`,
        createdAt: newBillData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.put(billToSave);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });

      await loadBillsFromDB();
      setBillData(billToSave);

      return billToSave;
    } catch (error) {
      console.error("Error saving bill to IndexedDB:", error);
      throw error;
    }
  };

  const deleteBillFromDB = async (id) => {
    try {
      const db = await openBillingDB();

      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });

      await loadBillsFromDB();
    } catch (error) {
      console.error("Error deleting bill:", error);
      throw error;
    }
  };

  const clearAllBills = async () => {
    try {
      const db = await openBillingDB();

      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });

      setAllBills([]);
      setBillData(null);
    } catch (error) {
      console.error("Error clearing bills:", error);
      throw error;
    }
  };

  const getBillById = async (id) => {
    try {
      const db = await openBillingDB();

      const bill = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });

      return bill;
    } catch (error) {
      console.error("Error fetching bill:", error);
      return null;
    }
  };

  function resetInvoiceNumber() {
    const fy = getFinancialYear();
    const key = `inv-serial-${fy}`;
    localStorage.setItem(key, "0");

    const firstNumber = `${fy}/001`;
    localStorage.setItem("currentInvoiceNumber", firstNumber);
    setInvoiceNumber(firstNumber);
  }

  useEffect(() => {
    loadBillsFromDB();
  }, []);

  const value = {
    listOfSellers,
    selectSeller,
    setSelectSeller,
    gst,
    setGst,
    buyer,
    setBuyer,
    consignee,
    setConsignee,
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
    addItems,
    setAddItems,
    descriptionOfGoods,
    setDescriptionOfGoods,
    hsnSAC,
    setHSNSAC,
    quantity,
    setQuantity,
    rate,
    setRate,
    amount,
    setAmount,
    roundOff,
    setRoundOff,
    gstPercentage,
    setGstPrecentage,
    subTotal,
    setSubTotal,
    gstAmount,
    setGstAmount,
    grandTotal,
    setGrandTotal,
    cGst,
    setCGST,
    sGst,
    setSGST,
    getNextInvoiceNumber,
    billData,
    setBillData,
    allBills,
    setAllBills,
    nonGstSellerDetails,
    setNonGstSellerDetails,
    getFinancialYear,
    resetInvoiceNumber,
    clearAllBills,
    kindAttn,
    setKindAttn,
    vehicleNo,
    setVehicleNo,
    saveBillToDB,
    loadBillsFromDB,
    deleteBillFromDB,
    getBillById,
  };

  return (
    <BillContext.Provider value={value}>
      {props.children}
    </BillContext.Provider>
  );
};

export default BillContextProvider;