import React from "react";
import { ToastContainer } from "react-toastify";
import NavigationBar from "./Components/NavigationBar";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Bills from "./Pages/Bills";
import PreviewBill from "./Pages/PreviewBill";
import Settings from "./Pages/Settings";
import EditBill from "./Pages/EditBill";
import BillViewer from "./Pages/BillViewer";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listofbills" element={<Bills />} />
        <Route path="/bill/preview" element={<PreviewBill />}/>
        <Route path="/settings" element={<Settings />} />
        <Route path="/bill/:billId/edit" element={<EditBill />} />
        <Route path="/bill/:billId" element={<BillViewer />} />
      </Routes>
    </div>
  );
};

export default App;