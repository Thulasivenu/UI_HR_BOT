import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
     {/* <div className="flex justify-center   item-center bg-[#e5e5e5] py-2"> */}
     <div className="flex justify-between items-center bg-[#e5e5e5] px-6 py-2 ">
        {/* Left side */}
        <p className="text-gray-700 text-[0.8em]">Copyright 2025 Qualesce</p>

        {/* Center */}
        <a
          href="https://qualesce.com/"
          target="_blank"
          className="flex justify-center items-center"
        >
          <img
            src="./src/assets/images/poweredby_center.svg"
            alt="Powered by Qualesce"
            className="w-auto h-auto"
          />
        </a>

        {/* Right side */}
        <p className="text-gray-700 text-[0.8em] cursor-pointer">
          Terms Policies | Privacy Policies
        </p>
      </div>
    </>
  );
};

export default Footer;
