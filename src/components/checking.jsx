import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const UserProfile = () => {
  const location = useLocation();
  const userEmail = location.state?.userEmail;
  const userName = location.state?.userName;
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();
  let hideTimeout;
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const updateSidebarColor = (dark) => {
    const sidebars = document.getElementsByClassName("sideBar");
    const chatInterface = document.getElementsByClassName("chatInterface");
    const changeText = document.getElementsByClassName("changeText");
    const inputText = document.getElementsByClassName("inputText");
    const queryBox = document.getElementsByClassName("queryBox");
    const userBar = document.getElementsByClassName("userBar");
    const querySet = document.getElementsByClassName("querySet");
    const headingOne = document.getElementsByClassName("headingOne");
    const subHeading = document.getElementsByClassName("subHeading");
    const imageChange = document.getElementsByClassName("imageChange");
    const textColor = document.getElementsByClassName("textColor");
    const historySection = document.getElementsByClassName("historySection");
    const chatSkeleton = document.getElementsByClassName("chatSkeleton");

    for (let sidebar of sidebars) {
      sidebar.style.backgroundColor = dark ? "#1a1a1a" : "#ffffff";
      sidebar.style.boxShadow = dark
        ? "0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.2)"
        : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";

      for (let change_Text of changeText) {
        change_Text.style.color = dark ? "white" : "black";
      }
      for (let input_Text of inputText) {
        input_Text.style.color = "black";
      }
      for (let query_Box of queryBox) {
        query_Box.style.backgroundColor = dark ? "#1a1a1a" : "white";
      }
      for (let history_Section of historySection) {
        history_Section.style.color = dark ? "#ffffff" : "#283E46";
      }
    }

    for (let chat_skeleton of chatSkeleton) {
      chat_skeleton.style.setProperty("--base-color", dark ? "#2d3748" : "#e0e0e0");
      chat_skeleton.style.setProperty("--highlight-color", dark ? "#4b5563" : "#f5f5f5");
    }

    for (let user_Bar of userBar) {
      user_Bar.style.backgroundColor = "#4b5563";
      user_Bar.style.color = dark ? "#ffffff" : "#000000";
    }

    for (let query_Set of querySet) {
      query_Set.style.backgroundColor = dark ? "#9ca3af38" : "#f9fafb";
      query_Set.style.color = "gray";
    }

    for (let chatInter of chatInterface) {
      chatInter.style.backgroundColor = dark ? "#1a1a1a" : "#ffffff";
    }

    for (let heading_one of headingOne) {
      heading_one.style.color = dark ? "#ffb300" : "#2f4e59";
    }

    for (let sub_Heading of subHeading) {
      sub_Heading.style.backgroundImage = dark
        ? "linear-gradient(to right, #ffb300, #ffc300, #ffcf4d, #ffd966)"
        : "linear-gradient(to right, #283e46 0%, #76b7b7 80%)";
      sub_Heading.style.webkitBackgroundClip = "text";
      sub_Heading.style.webkitTextFillColor = "transparent";
    }

    for (let image_Change of imageChange) {
      image_Change.src = dark
        ? "./src/assets/images/chatHistory_light.svg"
        : "./src/assets/images/chatHistory.svg";
    }

    for (let text_color of textColor) {
      text_color.style.color = dark ? "#ffffff" : "black";
    }
  };

  const toggleTheme = (forceTheme = null) => {
    setIsDark((prev) => {
      const newTheme = forceTheme !== null ? forceTheme : !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newTheme);
      updateSidebarColor(newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") === "dark";
    setIsDark(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme);
    updateSidebarColor(storedTheme);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        navigate("/login");
      } else {
        console.log("Error: ", response.status);
      }
    } catch (err) {
      console.log("Request failed: ", err);
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    hideTimeout = setTimeout(() => {
      setShowDropdown(false);
    }, 100);
  };

  return (
    <div className="relative flex items-center justify-center gap-1.5 p-2 font-display-main">
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <img
          src={"./src/assets/images/sideBarUser.svg"}
          width={32}
          alt="User Icon"
          className="cursor-pointer"
        />

        {showDropdown && (
          <div
            ref={popupRef}
            className={`absolute bottom-[100%] left-[30px] mt-1 shadow rounded text-sm w-[250px] text-center p-[15px] transition-opacity duration-300 
            ${isDark ? "bg-gray-700 text-white" : "bg-[#f5f5f5] text-black"}`}
          >
            <div
              className={`flex flex-col p-[10px] rounded-lg mb-[10px] ${isDark ? "bg-gray-600" : "bg-gray-200"
                }`}
            >
              <div className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-1">
                  <img src="./src/assets/images/profile.svg" width={20} />
                  <p className={`font-semibold py-3 ${isDark ? "text-white" : "text-[#283E46]"}`}>
                    {userName}
                  </p>
                </div>
              </div>

              <div className="flex">
                <button
                  className={`w-[48%] p-[5px] border rounded text-center mr-[15px] flex items-center gap-2 justify-center ${isDark ? "bg-gray-800 text-white border-gray-600" : ""
                    }`}
                  onClick={() => toggleTheme(true)}
                >
                  {isDark ? (
                    <img src="./src/assets/images/dark_mode_in_light.svg" className="w-[20px]" alt="Light Mode Icon" />
                  ) : (
                    <img src="./src/assets/images/dark_theme.svg" className="w-[20px]" alt="Dark Mode Icon" />
                  )}
                  Dark
                </button>

                <button
                  className={`w-[48%] border rounded text-center mr-[15px] flex items-center gap-2 justify-center ${!isDark ? "bg-gray-200 text-black border-gray-400" : ""
                    }`}
                  onClick={() => toggleTheme(false)}
                >
                  {isDark ? (
                    <img src="./src/assets/images/light_theme.svg" className="w-[20px]" alt="" />
                  ) : (
                    <img src="./src/assets/images/light_theme_inLight.svg" className="w-[20px]" alt="" />
                  )}
                  Light
                </button>
              </div>
            </div>

            <button
              onClick={handleLogout}
              onMouseEnter={() => setIsLogoutHovered(true)}
              onMouseLeave={() => setIsLogoutHovered(false)}
              className="z-50 w-full flex items-center justify-center gap-2 font-semibold bg-red-600 text-white rounded-[25px] px-4 py-2 cursor-pointer border border-transparent hover:bg-white hover:text-red-600 hover:border-red-600 shadow-md transition duration-300"
            >
              Logout
              <img
                src={
                  isLogoutHovered
                    ? "./src/assets/images/logoutHoverRed.svg"
                    : "./src/assets/images/logout.svg"
                }
                width={20}
                height={20}
                className="inline-block"
                alt="Logout Icon"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
