import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const CookiesPopup = ({ setHasAcceptedCookies }) => {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const cookiesAccepted = Cookies.get("cookiesAccepted") === "true";

        if (cookiesAccepted) {
            setHasAcceptedCookies(true);
            return;
        }

        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, [setHasAcceptedCookies]);

    const handleAccept = () => {
        Cookies.set("cookiesAccepted", "true", { expires: 1 });
        localStorage.setItem("cookiesAccepted", "true");

        setHasAcceptedCookies(true);
        setShowPopup(false);
    };

    const handleDeny = () => {
        Cookies.set("cookiesAccepted", "true", { expires: 1 });
        localStorage.setItem("cookiesAccepted", "true");

        setHasAcceptedCookies(true);
        setShowPopup(false);
    };

    return (
        showPopup && (
            <>
                <div className="fixed inset-0 opacity-50 z-40"></div>
                <div className="fixed bottom-13 left-5 bg-white p-4  z-50 w-[30%] rounded-[15px] border border-[#80808030] shadow-[0px_2px_8px_0px_#e5e5e5] text-[13px]">
                {/* <div className="fixed bottom-13 left-5 bg-white p-4  z-50 w-[30%] rounded-[15px] border border-[#80808030] shadow-[0px_0px_4px_gray] text-[13px]"> */}
                    <p>
                        We use cookies to improve your experience and analyze traffic.
                    </p>
                    <div className="flex justify-end mt-[10px]">
                        <button
                            onClick={handleAccept}
                            className=" text-[13px] border border-[#283E46] w-[20%] cursor-pointer text-orange-500 font-semibold px-3 py-1 mr-[10px] rounded-full mt-2 "
                        >
                            Accept
                        </button>
                        {/* <button
                            onClick={handleAccept}
                            className="bg-[#283E46] text-[13px] border border-[#283E46] cursor-pointer text-[#ffc300] px-3 py-1 rounded mt-2 hover:text-[#283E46] hover:bg-white"
                        >
                            Accept
                        </button> */}
                        <button
                            onClick={handleDeny}
                            className="text-[13px] border border-[#283E46] cursor-pointer  w-[20%] text-orange-500 font-semibold px-3 py-1 rounded-full mt-2 "
                        >
                            Deny
                        </button>
                    </div>
                </div>
            </>
        )
    );
};

export default CookiesPopup;
