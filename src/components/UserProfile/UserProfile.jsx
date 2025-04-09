import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const UserProfile = () => {
  const location = useLocation();
  const userEmail = location.state?.userEmail;
  const userName = location.state?.userName;
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [borderTheme, setBorderTheme]  = useState(false);
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();
  let hideTimeout;
  // console.log(isDark, 'theme')
  const [isLogoutHovered, setIsLogoutHovered] = useState(false); // <-- State for hover image
  const popupRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      console.log(event);
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  // Function to update sidebar color
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
    const imageChange = document.getElementsByClassName("imageChange"); //For Chat History
    const textColor = document.getElementsByClassName("textColor"); // For input field
    const historySection = document.getElementsByClassName("historySection"); // Fir input field
    const botQuestionTheme =
      document.getElementsByClassName("botQuestionTheme"); // Fir input field
    //  This color used to text in dark theme #E5E6E4 instead of white

    // console.log("QueryBox elements found:", queryBox.length);
    // if (queryBox.length === 0) {
    //   console.warn("QueryBox not found! Retrying in 100ms...");
    //   // setTimeout(() => updateSidebarColor(dark), 100);
    //   return;
    // }

    // for (let query_Box of queryBox) {
    //   query_Box.style.backgroundColor = dark ? "#1a1a1a" : "#ffffff";
    // }
    // console.log("theme==>", dark);
    for (let sidebar of sidebars) {
      sidebar.style.backgroundColor = dark ? "#1a1a1a" : "#ffffff";
      // sidebar.style.boxShadow = dark ? "0px 0px 3px red ":"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);";
      sidebar.style.boxShadow = dark
        ? "0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.2)"
        : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
      for (let change_Text of changeText) {
        // console.log("changeText",change_Text);
        change_Text.style.color = dark ? "#E5E6E4" : "black";
      }
      for (let input_Text of inputText) {
        input_Text.style.color = dark ? "#E5E6E4" : "black";
        input_Text.style.backgroundColor = dark ? "#9ca3af38" : "#F9FAFB";
      }
      for (let query_Box of queryBox) {
        // console.log("THEME ==>", queryBox)
        // console.log("QUERYBOX....")
        query_Box.style.backgroundColor = dark ? "#1a1a1a" : "white";
      }
      for (let history_Section of historySection) {
        history_Section.style.color = dark ? "#ffffff " : "#283E46";
      }
    }

    // for(let heading_One of headingOne ){
    //   console.log(heading_one)
    //   heading_One.color = dark ? "#ffc300" : "#2f4e59";
    // }
    for (let user_Bar of userBar) {
      // console.log("USERBAR...");
      user_Bar.style.backgroundColor = dark ? "#4b5563" : "#4b5563";
      user_Bar.style.color = dark ? "#ffffff" : "#000000";
    }
    for (let query_Set of querySet) {
      // query_Set.style.backgroundColor = dark ? " #9ca3af38" : " #f9fafb";
      // console.log(" QUERYSET...")
      query_Set.style.backgroundColor = dark ? "#9ca3af38" : "#f9fafb";
      query_Set.style.color = dark ? "#ffffff" : "gray";
    }
    for (let chatInter of chatInterface) {
      // console.log("CHATINTER...");
      chatInter.style.backgroundColor = dark ? "#1a1a1a" : "#ffffff";
      // chatInter.style.color = dark ? "#ffffff" : "#000000";
    }

    for (let bot_Question_Theme of botQuestionTheme) {
      // console.log(botQuestionTheme);
      bot_Question_Theme.style.backgroundColor = dark ? "#9ca3af38" : "#f9fafb";
      bot_Question_Theme.style.color = dark ? "#E5E6E4" : "black";
    }
    for (let heading_one of headingOne) {
      heading_one.style.color = dark ? "#ffc300" : "#2f4e59"; // White in dark mode, teal in light mode
    }
    for (let sub_Heading of subHeading) {
      if (dark) {
        sub_Heading.style.backgroundImage =
          "linear-gradient(to right, #ffb300, #ffc300, #ffcf4d, #ffd966)";
        sub_Heading.style.webkitBackgroundClip = "text"; // Apply background only to text
        sub_Heading.style.webkitTextFillColor = "transparent"; // Hide the actual text color
      } else {
        sub_Heading.style.backgroundImage =
          " linear-gradient(to right, #283e46 0%, #76b7b7 80%)";
        sub_Heading.style.webkitBackgroundClip = "text"; // Apply background only to text
        sub_Heading.style.webkitTextFillColor = "transparent"; // Hide the actual text color
      }
    }

    for (let image_Change of imageChange) {
      // console.log(imageChange);
      image_Change.src = dark
        ? "./src/assets/images/chatHistory_light.svg"
        : "./src/assets/images/chatHistory.svg";
    }

    for (let text_color of textColor) {
      text_color.style.color = dark ? "#ffffff" : "black";
    }
  };

  const toggleTheme = (darkMode) => {
    setIsDark(darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
    updateSidebarColor(darkMode);
  };

  // Ensure the theme persists on refresh
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") === "dark";
    setIsDark(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme);
    updateSidebarColor(storedTheme);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        // console.log(result);
        navigate("/login");
      } else {
        // console.log("Error: ", response.status);
      }
    } catch (err) {
      console.log("Request failed: ", err);
    }
  };

  // Logout button hover effects
  const OnMouseOverLogout = (e) => {
    e.target.children[0].src = "./src/assets/images/logoutHoverRed.svg";
  };
  const LogoutHoverBefore = (e) => {
    e.target.children[0].src = "./src/assets/images/logout.svg";
  };

  // Show dropdown on hover
  // const handleMouseEnter = () => {
  //   clearTimeout(hideTimeout);
  //   setShowDropdown(true);
  // };
  const displayProfile = () => {
    // clearTimeout(hideTimeout);
    // setShowDropdown(true);
    setShowDropdown((prevState) => !prevState);

  };

  // // Hide dropdown after 5 seconds
  // const handleMouseLeave = () => {
  //   hideTimeout = setTimeout(() => {
  //     setShowDropdown(false);
  //   }, 100);
  // };

  // Toggle dark/light theme
  // const toggleTheme = () => {
  //   setIsDark(!isDark);
  // };

  return (
    <div className="relative flex items-center justify-center gap-1.5 p-2 font-display-main">
      <div
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        onClick={displayProfile}
      >
        <div >
        {/* <div className="rounded-full bg-red-500 w-10 border-2 p-2"> */}
        <img
          // src={"./src/assets/images/sideBarUser.svg"}
          src="https://api.dicebear.com/9.x/thumbs/svg?seed=Easton&eyes=variant2W12,variant2W14,variant2W16,variant3W10,variant3W12,variant3W14,variant3W16,variant4W10,variant4W12,variant4W14,variant4W16,variant5W10,variant5W12,variant5W14,variant5W16,variant6W10,variant6W12,variant6W14,variant6W16,variant7W10,variant7W12,variant7W14,variant7W16,variant8W10,variant8W12,variant8W16,variant9W10,variant9W12,variant9W14,variant9W16,variant8W14,variant1W12,variant1W10"
          alt="avatar"         
             // src="https://api.dicebear.com/7.x/initials/svg?seed=Thulasi"
          width={60}
          // alt="User Icon"
          className="cursor-pointer rounded-full"
        />
        </div>
        
        {/* <p className="text-red-500">{userName}</p> */}
        {showDropdown && (
          <div
            ref={popupRef}
            className={` absolute bottom-[100%]  left-[48%] mb-1 shadow text-sm w-[250px]  rounded-sm text-center p-[15px] transition-opacity duration-300 
      ${isDark ? "bg-gray-700 text-white" : "bg-[#f5f5f5] text-black"}`}
          >
            {/* Talk Bubble Tail (pointing down toward the trigger) */}
            {/* Talk Bubble Tail */}
            {/* <div
              className={`absolute rotate-378 top-full left-[10px] -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] 
  ${isDark ? "border-t-gray-700" : "border-t-[#f5f5f5]"}`}
            /> */}

            <div
              className={`flex flex-col p-[10px] rounded-lg mb-[10px] ${
                isDark ? "bg-gray-600" : "bg-gray-200 "
              }`}
            >
              <div className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-1">
                  <img src="./src/assets/images/profile.svg" width={20} />
                  <p
                    className={`font-semibold py-3 ${
                      isDark ? "text-white" : "text-[#283E46]"
                    }`}
                  >
                    {userName}
                  </p>
                </div>
              </div>

              <div className="flex">
                <button
                  className={`rounded-full cursor-pointer w-[48%] p-[5px] text-center mr-[15px] flex items-center gap-2 justify-center ${
                    isDark ? "bg-gray-800 border-r-3 border-[#ffc300] text-white" : "black bg-[#f5f5f5]"
                  }`}
                  onClick={() => toggleTheme(true)}
                >
                  {isDark ? (
                    <img
                      src="./src/assets/images/dark_mode_in_light.svg"
                      className="w-[20px]"
                      alt="Light Mode Icon"
                    />
                  ) : (
                    <img
                      src="./src/assets/images/dark_theme.svg"
                      className="w-[20px]"
                      alt="Dark Mode Icon"
                    />
                  )}
                  Dark
                </button>

                <button
                  className={`cursor-pointer w-[48%]  rounded-full text-center mr-[15px] flex items-center gap-2 justify-center ${
                    !isDark ? "bg-[#f5f5f5] border-r-3 border-[#ffc300] text-black " : " border border-gray-400"
                  }`}
                  onClick={() => toggleTheme(false)}
                >
                  {isDark ? (
                    <img
                      src="./src/assets/images/light_theme.svg"
                      className="w-[20px]"
                      alt=""
                    />
                  ) : (
                    <img
                      src="./src/assets/images/light_theme_inLight.svg"
                      className="w-[20px]"
                      alt=""
                    />
                  )}
                  Light
                </button>
              </div>
            </div>

            {/* Logout Button */}
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
