import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavigationBar = () => {
  return (
    <div className="flex items-center justify-around py-5 font-medium navbar no-print">
      <Link to="/">
        <h1 className="w- cursor-pointer">Sri Kalpavrusha Printers</h1>
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/listofbills" className="flex flex-col items-center gap-1">
          <p>ALL BILLS</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/settings" className="flex flex-col items-center gap-1">
          <p>SETTINGS</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>
    </div>
  );
};

export default NavigationBar;
