import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pdf_Query from "../Pdf_Query/Pdf_Query";
// import Pdf_Body from "../Pdf_Body/Pdf_Body";
import Logout from "../Logout/Logout";
import Profile from "../Profile/Profile";
import ChatHistory from "../ChatHistory/ChatHistory";
// import CookiesPopup from "../CookiesPopup/CookiesPopup";
import ChatInterface from "../ChatInterface/ChatInterface";

const Pdf_Extract = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    // console.log(typeof (chatHistory))
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    useEffect(() => { //Fetching data from an API
        const checkAuthentication = async () => {
            const response = await fetch('http://localhost:3000/api/v1/users', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.status === 200) {
                setIsAuthenticated(true);
            } else {
                navigate('/login');
            }
        };

        checkAuthentication();
    }, [navigate]);
    // console.log(setLoading, "set loading in extract")

    return (
        <div className="">
            <div className="flex ml-5">
                <div className=" flex flex-col justify-between mb-[40px]">
                    <div>
                        <h1 className="text-base font-bold text-center m-2 text-xl"><Link to='/'>HR BOT</Link></h1>
                        <div className="max-h-[100%] max-w-[170px] p-1 shadow-md border border-white text-black p-4 overflow-y-scroll overflow-x-hidden ">
                            {/* <p className="font-bold" ><Link to='/chatHistory'>Chat History</Link></p> */}
                            <p className="font-bold" >Chat History</p>
                            <p>User</p>
                            {/* <div className="flex justify-between  p-1 ">
                            <p>Chat</p><img src="./src/assets/img/right-arrow-svgrepo-com.svg" className="w-[20px] hover:shadow-md border border-white" alt="" />
                        </div> */}
                            <div>

                                {chatHistory.map((chat, index) => (
                                    <ChatHistory key={index} chat={chat} />
                                ))}
                            </div>

                        </div>
                    </div>
                    <div >
                        <Profile />
                        <Logout />
                    </div>
                </div>
                <div className="max-w-[1400px] mx-auto my-0">
                    <div className="min-h-screen flex flex-col justify-between  p-1 shadow-md ">
                        <div className="w-[1300px] mx-auto my-0">
                            <div className="max-w-[1200px] mx-auto my-0 ">
                                <Pdf_Query chatHistory={chatHistory} setChatHistory={setChatHistory} loading={loading} setLoading={setLoading} />
                            </div>
                            {chatHistory.map((chat, index) => (
                            <ChatInterface key={index}
                            chat={chat} />
                        ))}

                        </div>

                    </div>
                    <div className="text-center">
                            Note: This website is not fully accessible to individuals with physical disabilities.
                        </div>
                </div>
            </div>
        </div>
    );
};

export default Pdf_Extract

{/* <CookiesPopup isAuthenticated={isAuthenticated} /> */ }
