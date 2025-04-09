import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TimeDisplay from "../UIComponents/TimeDisplay";
import SideBar from "../SideBar/SideBar";
import CookiesPopUp from "../Cookies/CookiesPopUp";
// import Toaster, { showToast } from "../Toaster/Toaster";

const BotUI = () => {
  useEffect(() => {
    document.title = "HR Bot | Q-BOT";
  }, []);
  const [question, setQuestion] = useState(" ");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [displayQuestion, setDisplayQuestion] = useState("");
  const displayTextFunc = () => {
    setDisplayQuestion(question);
  };
  const myBotAnswer = useRef(null);
  // let passTheQuestion;

  function formatText(text) {
    console.log("Text  ==>", text);
    const lines = text.split("\n").filter((line) => line.trim() !== ""); // Remove empty lines
    const elements = [];
    let currentList = null;
    let keyCounter = 0; // Unique key tracker

    // Helper function to make text inside ** bold
    const processBoldText = (text) => {
      return text
        .split("**")
        .map((part, index) =>
          index % 2 === 1 ? <strong key={index}>{part}</strong> : part
        );
    };

    lines.forEach((line) => {
      let formattedLine = line.trim();

      if (formattedLine.startsWith("### ")) {
        // Convert headings (###) to bold text
        if (currentList) {
          elements.push(
            <ul className="list-disc" key={keyCounter++}>
              {currentList}
            </ul>
          );
          currentList = null;
        }
        elements.push(
          <p key={keyCounter++}>
            <strong>{processBoldText(formattedLine.substring(4))}</strong>
          </p>
        );
      } else if (formattedLine.startsWith("- **")) {
        // Convert "- **Text**" into bold bullet points correctly
        if (!currentList) currentList = [];
        const boldEndIndex = formattedLine.indexOf("**", 4);
        const boldText = formattedLine.substring(4, boldEndIndex).trim(); // Extract bold text
        let remainingText = formattedLine.substring(boldEndIndex + 2).trim(); // Extract remaining text

        // Remove colon at the start of remainingText if it exists
        if (remainingText.startsWith(":")) {
          remainingText = remainingText.substring(1).trim();
        }

        currentList.push(
          <li key={keyCounter++}>
            <strong>{boldText}</strong>
            {remainingText ? `${processBoldText(remainingText)}` : ""}
          </li>
        );
      } else if (formattedLine.startsWith("- ")) {
        // Convert "-" into bullet points and process **bold** text inside
        if (!currentList) currentList = [];
        currentList.push(
          <li key={keyCounter++}>
            {processBoldText(formattedLine.substring(2))}
          </li>
        );
      } else {
        // Normal paragraphs, also process **bold** text
        if (currentList) {
          elements.push(
            <ul key={keyCounter++} className="list-disc">
              {currentList}
            </ul>
          );
          currentList = null;
        }
        elements.push(
          <p key={keyCounter++}>{processBoldText(formattedLine)}</p>
        );
      }
    });

    // Close any open list
    if (currentList) {
      elements.push(
        <ul key={keyCounter++} className="list-disc">
          {currentList}
        </ul>
      );
    }

    return elements;
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/users/", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        console.log("Auth Response:", data); // Debugging line

        if (response.ok) {
          setAuthenticated(true);
          // console.log(authenticated);
          setName(data.name);
        } else {
          setAuthenticated(false);
          navigate("/login");
        }
      } catch (error) {
        console.log("Error checking authentication:", error);
        setAuthenticated(false);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // const formatedText = () => {};
  const askQuestion = async () => {
    // console.log(question);
    // setDisplayQuestion(question);
    console.log("Display text  =>", question);
    // chatHistory.question = "jhelli"
    // console.log(chatHistory);
    // if (!question.trim()) return showToast("Kindly enter a question!", "error");
    const initialDisplay = { question, answer: "Thinking...." };
    setChatHistory((prev) => [initialDisplay, ...prev]);
    setLoading(true); //for button
    try {
      // const response = await fetch("http://localhost:8000/ask", {
      const response = await fetch("http://localhost:3000/api/v1/users/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include",
        body: JSON.stringify({ question }),
      });
      // console.log("question form response", allow);
      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }
      const data = await response.json();
      const checking = data.answer;
      // console.log(checking);
      const textCheck = formatText(checking);
      // setChatHistory([{ question, answer: textCheck }, ...chatHistory]);

      setChatHistory((prev) => {
        console.log(prev);
        const updatedResponse = [...prev]; //holds previous response
        updatedResponse[0] = { ...updatedResponse[0], answer: textCheck }; //
        return updatedResponse;
      });
      // console.log(setChatHistory(chatHistory));
      setQuestion("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
    // setChatHistory([{ question, answer: "Thinking" }, ...chatHistory]);
  };

  const CopyBotAnswer = (e) => {
    // console.log(e);
    console.log(myBotAnswer.current.innerText);
  };

  // let arrowHover = {}

  return (
    <>
      <div className="h-screen flex">
        {authenticated ? (
          <div>
            {/* <Toaster/> */}
            <SideBar userName={name} setAuthenticated={setAuthenticated} />
            <div className=" flex items-center flex-col absolute top-0 left-64 right-0">
              <div className="w-[1000px] rounded-lg flex flex-col">
                <form className="mt-10">
                  <div className=" fixed top-0 flex justify-center py-4 z-10 backdrop-blur-md bg-white ">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Type your question..."
                      className=" w-[850px] pt-2 pb-3 px-3 outline-none border-1 border-[#283E46]  bg-[#fbfbfb] rounded-full"
                    />
                    <button
                      onClick={askQuestion}
                      className="bg-[#283E46] w-[120px] ml-1  text-[1.1em] rounded-full text-[#ffc300] font-semibold hover:bg-white hover:border-1 hover:border-[#283E46] hover:text-[#283E46] cursor-pointer shadow-md transition duration-300"
                      disabled={loading}
                    >
                      {loading ? "Thinking..." : "Submit"}
                    </button>
                    {/* <p>{displayQuestion}</p> */}
                  </div>
                  <div className="mt-4">
                    <p>{question}</p>
                    {chatHistory.map((chat, index) => (
                      <div
                        key={index}
                        className="flex-1 pt-7 overflow-y-auto flex flex-col"
                      >
                        {/* Question section starts here */}
                        <div className="flex flex-col gap-1.5 w-fit">
                          {/* User Info */}
                          <div className="flex items-center">
                            <img
                              src={"/assets/images/user.svg"}
                              alt="User"
                              width="16px"
                            />
                            <p className="bg-[#fbfbfb] text-[0.65em] text-[#aaaaaa] rounded-[25px] inline-block">
                              My Query
                            </p>
                          </div>

                          {/* Question Box with Timestamp Inside */}
                          <div className=" flex flex-col py-2 px-4 rounded-[25px]  bg-[#e5e7eb]  w-fit break-words ">
                            {/* Question Text */}
                            <p>{chat.question}</p>
                            {/* <p>heu</p> */}
                          </div>
                          {/* Timestamp - Right-Aligned */}
                          <div className=" text-gray-500 self-end mt-1">
                            <TimeDisplay />
                          </div>
                        </div>

                        {/* Question section ends here */}

                        {/* chatbot answering section starts here */}

                        <div className="self-end  text-black px-4 py-2 rounded-[25px]  inline-block max-w-[75%] break-words">
                          <div className="flex justify-end">
                            <div className="gap-1.5 flex w-fit  align-centre bg-[#fbfbfb] rounded-[25px]">
                              <img
                                src={"/assets/images/botImage.svg"}
                                alt="Bot Response"
                                width="20px"
                              />
                              <p className="text-[0.65em] text-[#aaaaaa] pt-0.5">
                                Bot Response
                              </p>
                            </div>
                          </div>

                          <div ref={myBotAnswer}>{chat.answer} </div>
                          <div className="flex mt-1 gap-1">
                            <img
                              src="/assets/images/goodResponse.svg"
                              width="20px"
                              alt=""
                              className="cursor-pointer"
                              // className="hover:bg-[#283E46] rounded-[25px]"
                              // title="Helpfull Response"
                              onMouseOver={(e) => {}}
                            />
                            <img
                              src="/assets/images/badResponse.svg"
                              width="20px"
                              alt=""
                              className="cursor-pointer"
                              // className="hover:bg-[#283E46] rounded-[25px]"
                              // title=" Unhelpful Answer"
                            />
                            <img
                              src="/assets/images/copy.svg"
                              width="22px"
                              alt=""
                              className="cursor-pointer"
                              // onClick={CopyBotAnswer}
                              // className="hover:bg-[#283E46] rounded-[25px]"
                              title="Copy"
                            />
                          </div>
                        </div>
                      </div>

                      // chatbot answering section ends here
                    ))}
                    {/* <div id="content"></div> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div>Redirecting...</div> // Show a message before redirection
        )}
        <CookiesPopUp />
        {/* {showCookiesPopup && <CookiesPopUp />} */}
      </div>
    </>
  );
};

export default BotUI;
