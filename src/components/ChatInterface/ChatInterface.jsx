import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import TimeDisplay from "../UIComponents/TimeDisplay";
import SideBar from "../SideBar/SideBar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; //for css imp
import DateTimeDisplay from "../DateTimeDisplay/DateTimeDisplay";
// import CookiesPopup from "../CookiesPopup/CookiesPopup";
import Cookies from "js-cookie";

const ChatInterface = () => {
  // console.log("isDark---",isDarks)

  useEffect(() => {
    document.title = "HR Bot | Q-BOT";
  }, []);

  const location = useLocation();
  const authentication = location.state?.Authentication;
  const userEmail = location.state?.userEmail;
  const userName = location.state?.userName;
  const userDetails = { userEmail, userName };
  const [hasAcceptedCookies, setHasAcceptedCookies] = useState(false);
  // console.log(userDetails,'user details')
  // console.log(authentication, "auth");
  useEffect(() => {
    document.title = "HR Bot | Q-BOT";
  }, []);

  const [question, setQuestion] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [isDarks, setIsDark] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState("false");
  const [questionErrorMessage, setQuestionErrorMessage] = useState("");
  const chatContainerRef = useRef([]); // Use array instead of object
  const chatWrapperRef = useRef(null); // for the scrollable container
  const [isLoading, setIsLoading] = useState(false); //for placeholder
  const [activeIndex, setActiveIndex] = useState(false);
  const [goodResponse, setGoodResponse] = useState(false);
  const [badResponse, setBadResponse] = useState(false);
  const [removeResponse, setRemoveResponse] = useState(false);
  const [feedback, setFeedback] = useState([]); // to track feedback per message

  // const chatContainerRef = useRef(null);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [shouldForceScrollTop, setShouldForceScrollTop] = useState(false);

  // When user submits a new question:
  const handleSubmit = () => {
    // ... your current submit logic
    setShouldForceScrollTop(true); // Trigger scroll-to-top effect
  };

  const goodResponseFunc = () => {
    setGoodResponse(true);
    setRemoveResponse(true);
  };

  const badResponseFunc = () => {
    setBadResponse(true);
    setRemoveResponse(true);
  };
  const handleFeedback = (index, value) => {
    setFeedback((prevFeedback) => {
      const newFeedback = [...prevFeedback];
      const current = newFeedback[index];

      if (current === value) {
        newFeedback[index] = null; // Toggle off
      } else {
        newFeedback[index] = value;

        // Trigger your side-effects
        if (value === "good") {
          setGoodResponse(true);
          setRemoveResponse(true);
        } else if (value === "bad") {
          setBadResponse(true);
          setRemoveResponse(true);
        }
      }

      return newFeedback;
    });
  };

  useEffect(() => {
    setAuthenticated(authentication);
  }, [authentication]);
  // Detect Theme from Local Storage or Context
  useEffect(() => {
    const theme = localStorage.getItem("theme") === "dark";
    console.log("From localstorage =>", theme);
    setIsDark(theme);
  }, []);

  const isDark = localStorage.getItem("theme") === "dark";
  const handleSelect = (index) => {
    console.log("index", index);
    setQuestionIndex(index);
    setActiveIndex(index);
  };

  // this useEffect is to scroll to specific chat item based on the index
  useEffect(() => {
    if (questionIndex !== null && chatContainerRef.current[questionIndex]) {
      console.log("questionIndex", questionIndex);
      chatContainerRef.current[questionIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // setQuestionIndex(u);
      console.log("Question is Highlighted");
      // Remove highlight after 3 seconds
      setTimeout(() => {
        setQuestionIndex(null);
      }, 3000);
    }
  }, [questionIndex]);

  // Runs after chat is updated
  useEffect(() => {
    if (chatWrapperRef.current) {
      chatWrapperRef.current.scrollTop = 0;
    }
  }, [chatHistory]);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "GET",
        credentials: "include",
      });

      if (response.status !== 200) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  let clearQuestion = () => {
    console.log("yes");
    setQuestion("");
  };

  //This function used to format the bot response
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
          index % 2 === 1 ? <strong key={index}>{part} </strong> : part
        );
    };

    lines.forEach((line) => {
      let formattedLine = line.trim();

      if (formattedLine.startsWith("### ")) {
        // Convert headings (###) to bold text
        if (currentList) {
          elements.push(
            <ul className="list-disc   pl-5" key={keyCounter++}>
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
      } else if (formattedLine.startsWith("#### ")) {
        // Convert headings (###) to bold text
        if (currentList) {
          elements.push(
            <ul className="list-disc   pl-5" key={keyCounter++}>
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
            <ul key={keyCounter++} className="list-disc pl-5">
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
        <ul key={keyCounter++} className="list-disc  pl-5">
          {currentList}
        </ul>
      );
    }

    return elements;
  }

  //This function is used for when users clicks on Submit
  //  const submitForm = (e) => {
  //   e.preventDefault();

  //   console.log(question);
  //   return question;
  // }
  const askQuestion = async (e) => {
    e.preventDefault(); // Used to Prevent the form from refreshing the page

    console.log(question);

    if (!question.trim()) {
      setQuestionErrorMessage("Kindly enter the question!");
      return;
    }
    setQuestionErrorMessage("");
    const activeTheIndex = chatHistory.length;
    setActiveIndex(activeTheIndex);
    setShouldForceScrollTop(true);
    setQuestion("");
    setIsClicked(true);
    setIsLoading(true);
    const newChat = { question, answer: "Thinking..." };
    setChatHistory([newChat, ...chatHistory]);
    setFeedback((prev) => [null, ...prev]); // Add corresponding feedback slot
    setActiveIndex(0); // always highlight the latest (which is at index 0)
    // setQuestionIndex(chatHistory.length); // Set to the last question index
    // console.log("chathistory length", length);
    document.activeElement.blur();

    try {
      const response = await fetch("http://localhost:3000/api/v1/users/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          answer: formatText(data.answer),
        };
        return updated;
      });

      setQuestion("");
      setIsLoading(false);
      // setActiveIndex(null); //remove highlight when done
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const cookieExpiryDate = Cookies.get("cookieExpiryDate"); // Retrieve expiry date
    const currentDate = new Date();

    // If the cookie doesn't exist or if the expiry date has passed, show the popup
    if (!cookieExpiryDate || new Date(cookieExpiryDate) < currentDate) {
      setHasAcceptedCookies(false); // Show the popup
    } else {
      setHasAcceptedCookies(true); // Hide the popup if cookies are valid
    }
  }, []);
  const extractText = (children) => {
    if (!children) return "";

    if (Array.isArray(children)) {
      return children.map(extractText).join(" "); // Recursively extract text
    }

    if (typeof children === "object" && children.props) {
      return extractText(children.props.children); // Dive into nested elements
    }

    return typeof children === "string" ? children : ""; // Return if it's a string
  };

  const CopyBotAnswer = (answerArray, index) => {
    // console.log(copied)
    // console.log(answerArray)
    const textToCopy = answerArray
      .map((item) => (item.props ? extractText(item.props.children) : ""))
      .join("\n"); // Join with newlines for better readability

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true); // Change to tick icon
        setCopiedIndex(index);
        setTimeout(() => setCopied(false), 2000);
        setTimeout(() => setCopiedIndex(null), 2000);
        // console.log('copied',textToCopy)
      })
      .catch((err) => {
        // alert ("Failed to copy:", err)
        console.error("Failed to copy:", err);
      });
  };

  const cancelAlert = () => {
    setQuestionErrorMessage("");
  };

  useEffect(() => {
    if (questionErrorMessage) {
      const alertTimer = setTimeout(() => {
        setQuestionErrorMessage("");
      }, 2500);
      return () => clearTimeout(alertTimer);
    }
  }, [questionErrorMessage]);

  return (
    <>
      {/* <div className="chatInterface"> */}
      <div className="chatInterface">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="sideBar w-64 bg-[#fbfbfb] text-white shadow-lg">
            <SideBar
              chatHistory={chatHistory}
              onSelect={handleSelect}
              isDark={isDark}
              activeIndex={activeIndex}
            />
          </div>

          {/* Main Content */}
          <div className="flex flex-col flex-1 items-center mx-auto w-full max-w-[1000px]">
            {/* Will display the error when question is not entered */}
            {questionErrorMessage && (
              <div className="fixed top-2 z-50 flex items-center gap-2 px-4 py-4 pr-7 w-auto max-w-[300px] rounded-lg shadow-lg bg-red-50 text-red-700">
                <img
                  src="./src/assets/images/error.svg"
                  className="w-5 h-5"
                  alt="Error"
                />
                <p className="text-[1em]">{questionErrorMessage}</p>
                <img
                  src={"./src/assets/images/cancelAlert.svg"}
                  className="w-[1em] h-[1em] cursor-pointer absolute top-1 right-1"
                  onClick={cancelAlert}
                />
                <div className="toast-border-progress"></div>
              </div>
            )}

            <form
              className={`w-[800px] transition-all duration-300 
            ${
              isClicked
                ? `fixed top-0 backdrop-blur-md ${
                    isDark ? "bg-[#1a1a1a]" : "bg-white"
                  } w-[1000px] p-5 z-10 queryBox `
                : "flex items-center h-screen"
            }`}
            >
              <div className="w-full max-w-[1000px] mx-auto">
                {!isClicked && (
                  <div className="flex justify-center flex-col items-center text-left  mb-4">
                    <h1 className="headingOne text-6xl font-semibold font-display text-[#2f4e59]">
                      HR Bot
                    </h1>
                    {/* <h1 className={`text-3xl font-semibold font-display mb-2  subHeading ${isDark ? "dark-theme-text-gradient" :"text-gradient"}`}> */}
                    {/* <h1 className={`text-3xl font-semibold font-display mb-2  subHeading text-gradient`}> */}
                    <h1 className="subHeading text-3xl font-semibold font-display mb-2">
                      Your Virtual HR Assistant
                    </h1>
                  </div>
                )}
                <div className=" flex relative font-display-main items-center">
                  {/* <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question..."
                    className="inputText flex-1 pt-2 pb-2 px-3 outline-none mr-1 rounded-full border-2 border-[#283E46] bg-[#fbfbfb]  focus:border-[#283E46] transition duration-300 "
                  /> */}
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isLoading}
                    placeholder={
                      isLoading
                        ? "Our assistant is working on your request..."
                        : "Type your question..."
                    }
                    className={`inputText w-full px-4 py-2 border-2 mr-1 border-gray-300 rounded-full outline-none
  focus:ring-2 focus:ring-[#ffc300] focus:border-transparent font-display-main
  transition-colors duration-300 ease-in-out  ${
    isLoading && "cursor-not-allowed"
  }
  ${isDark ? "bg-[#9ca3af38] text-white" : "bg-gray-50 text-black"}`}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />

                  {isFocused && (
                    <img
                      src={"./src/assets/images/cancel.svg"}
                      className="cancelImageChange absolute right-[150px] top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
                      alt="cancel"
                      width="20px"
                      // onClick={() => console.log ("clicked!")}
                      onMouseDown={clearQuestion}
                    />
                  )}
                  <button
                    onClick={askQuestion}
                    // disabled={loading}
                    className="bg-[#283E46] relative left-[25px] pt-2 pb-2 w-[150px] text-[1.1em]  rounded-full border-2 border-[#283E46]  text-[#ffc300] font-semibold hover:bg-white hover:border-[#283E46] hover:text-[#283E46] cursor-pointer shadow-md transition duration-300 px-5 "
                  >
                    {isLoading ? "Thinking..." : "Submit"}
                  </button>
                </div>
              </div>
            </form>

            {/* Chat History (Fixed with Auto-Scroll) */}
            <div
              ref={chatWrapperRef}
              // className=" w-full  max-w-[1000px] flex-1 mt-20 p-4 max-h-screen overflow-y-auto scrollbar-hidden"
              className="w-full max-w-[1000px] flex-1 mt-20 p-4 max-h-screen overflow-y-auto scrollbar-hidden font-display-main"

              // className=" w-full  max-w-[1000px] flex-1 mt-20 p-4 bg-[#f9f9f9] rounded-lg shadow-inner"
              // style={{ maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}
            >
              {(chatContainerRef.current = [])}{" "}
              {chatHistory.map((chat, index) => (
                // const isActive = index === Number(questionIndex);

                <div
                  key={index}
                  ref={(el) => (chatContainerRef.current[index] = el)}
                  className="flex flex-col gap-4"
                >
                  {/* User Query */}
                  <div className=" flex flex-col gap-1.5 w-fit">
                    <div
                      className={` querySet ${
                        isDark ? "bg-[#9ca3af38]" : "bg-gray-50"
                      } flex items-center w-fit rounded-[25px] mb-2 p-[7px]`}
                    >
                      <img
                        src={"./src/assets/images/user.svg"}
                        className="relative left-[1px] bottom-[2px]"
                        alt="User"
                        width="16px"
                      />
                      <p className="text-[0.65em] text-[gray] relative left-[4px] top-[0px]">
                        My Query
                      </p>
                    </div>
                    <div
                      key={index}
                      className={`botQuestionTheme 
    ${isDark ? "bg-[#9ca3af38] text-[#E5E6E4]" : "bg-[#e5e7eb] text-black"} 
    py-2 px-4 rounded-[25px] w-fit break-words 
    ${
      index === questionIndex
        ? "border-[#ffc300] border-2 shadow-md"
        : "border-transparent border-2"
    } 
    transition-all duration-300`}
                    >
                      <p>{chat.question}</p>
                    </div>

                    <div
                      className={`querySet ${
                        isDark ? "bg-[#9ca3af38]" : "bg-gray-50"
                      }   self-end mt-1 rounded-[25px]`}
                    >
                      <DateTimeDisplay />
                    </div>
                  </div>

                  {/* Bot Response */}
                  {/* <div className="self-end  px-4 py-2 w-[75%]"> */}

                  <div
                    className={`self-end  px-4 py-2 ${
                      chat.answer === "Thinking..."
                        ? "w-[75%]"
                        : "w-auto max-w-[75%]"
                    } inline-block break-words`}
                  >
                    <div className=" flex justify-end">
                      <div
                        className={`querySet ${
                          isDark ? "bg-[#9ca3af38]" : "bg-gray-50"
                        } gap-1.5 flex w-fit  rounded-[25px] mb-2 p-[5px]`}
                      >
                        <img
                          src={"./src/assets/images/botImage.svg"}
                          className="relative left-[1px] bottom-[2px]"
                          alt="Bot"
                          width="20px"
                        />
                        <p className="text-[0.65em] text-[gray] relative top-[3px]">
                          Bot Response
                        </p>
                      </div>
                    </div>
                    <div>
                      {chat.answer === "Thinking..." ? (
                        <div className="w-75%">
                          <SkeletonTheme
                            baseColor={isDark ? "#4b556380" : "#e0e0e0"} // Dark mode slightly darker gray, Light mode stays the same
                            highlightColor={isDark ? "#6b7280" : "#f5f5f5"} // Dark or Light highlight color
                            // baseColor="#e0e0e0"
                            // highlightColor="#f5f5f5"
                          >
                            <Skeleton
                              height={10}
                              width="100%"
                              className="my-2 rounded-full"
                            />
                            <Skeleton
                              height={10}
                              width="70%"
                              className="my-2 rounded-full"
                            />
                            <Skeleton
                              height={10}
                              width="50%"
                              className="my-2 rounded-full"
                            />
                            {/* <Skeleton count = {3} height={10} className="my-2 rounded-full"  ></Skeleton> */}
                          </SkeletonTheme>
                        </div>
                      ) : (
                        <>
                          <div
                            key={index}
                            className={`changeText rounded-[10px] px-1.5 py-1.5 ${
                              isDark ? "text-[#E5E6E4] " : "text-black"
                            }`}
                          >
                            {chat.answer}
                          </div>
                          <div className="flex mt-1 gap-1">
                            {feedback[index] === "good" ? (
                              <img
                                src="./src/assets/images/userRespondedGoodImage.svg"
                                width="20px"
                                alt=""
                                className="cursor-pointer"
                                title="Informative"

                              />
                            ) : (
                              <img
                                src="./src/assets/images/goodResponse.svg"
                                width="20px"
                                alt="Informative"
                                title="Informative"
                                onClick={() => handleFeedback(index, "good")}
                                className={`cursor-pointer ${
                                  feedback[index] === "bad" ||
                                  feedback[index] === "good"
                                    ? "hidden"
                                    : ""
                                }`}
                                // title="Helpfull Response"
                              />
                            )}
                            {feedback[index] === "bad" ? (
                              <img
                                src="./src/assets/images/userRespondedBadImage.svg"
                                width="20px"
                                alt=""
                                title="Didn’t Help"

                                className="cursor-pointer"
                              />
                            ) : (
                              <img
                                src="./src/assets/images/badResponse.svg"
                                width="20px"
                                alt=""
                                title="Didn’t Help"
                                onClick={() => handleFeedback(index, "bad")}
                                className={`cursor-pointer ${
                                  feedback[index] === "bad" ||
                                  feedback[index] === "good"
                                    ? "hidden"
                                    : ""
                                }`}
                              />
                            )}

                            <img
                              src={
                                copiedIndex === index
                                  ? "./src/assets/images/tick-square-svgrepo-com.svg"
                                  : "./src/assets/images/copy.svg"
                              }
                              width="22px"
                              alt=""
                              className="cursor-pointer"
                              onClick={() => CopyBotAnswer(chat.answer, index)}
                              title={copiedIndex === index ? "Copied!" : "Copy"}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-[#6f6e6e]">
              Note: This website is not fully accessible to individuals with
              physical disabilities.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
