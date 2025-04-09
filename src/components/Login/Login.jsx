import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "../../commonFolder/Footer/Footer";
import CookiesPopup from "../CookiesPopup/CookiesPopup";
import Cookies from "js-cookie";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasAcceptedCookies, setHasAcceptedCookies] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false)


  //   const [successMessage, setSuccessMessage] = useState("");
  // console.log(emailError)

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // console.log(emailRegex)
    return emailRegex.test(email);
  };

  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const getUser = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    // setSuccessMessage("");
    setFadeOut(false); // Reset fade-out effect

    // if (!validateEmail(email)) {
    //     setEmailError("Please enter a valid email address.");
    //     // setFormValid(false);
    //     // console.log(setEmailError)

    //     return;
    // }
    const data = { email, password };
    try {
      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        if (result) {
          const { userEmail, userName, Authentication } = result;
          navigate("/", {
            state: { userEmail: result.userEmail, userName: result.userName, Authentication: result.Authentication },
          });
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 7); // expires in 7 days
          const userDetails = {
            userEmail,
            userName,
            expiryDate: expiryDate.toISOString(),
          };
          // console.log(userDetails)
          Cookies.set("cookiesAccepted", "true", { expires: expiryDate });
          Cookies.set("cookieExpiryDate", expiryDate.toISOString(), { expires: expiryDate });
          // Cookies.set("userEmail", result.userEmail, { expires: expiryDate });
          // Cookies.set("userName", result.userName, { expires: expiryDate });
          Cookies.set("Authentication", result.Authentication, { expires: expiryDate });
          Cookies.set("userDetails", JSON.stringify(userDetails), { expires: 1 });
          console.log("Cookies have been set");
        
          if (result.Authentication) {
            localStorage.removeItem("cookiesAccepted");
          }

        }
        // console.log(result);
        setPasswordError(result.message);
      } else {
        const result = await response.json();
        const resMessage = result.message;
        setErrorMessage(resMessage);
        // console.log("Error: ", response.status);
      }
    } catch (err) {
      console.log("Request failed: ", err);
    }
  };

  // useEffect(() => {
  //   const cookieExpiryDate = Cookies.get("cookieExpiryDate");  // Retrieve expiry date
  //   const currentDate = new Date();

  //   // If the cookie doesn't exist or if the expiry date has passed, show the popup
  //   if (!cookieExpiryDate || new Date(cookieExpiryDate) < currentDate) {
  //     setHasAcceptedCookies(false);  // Show the popup
  //   } else {
  //     setHasAcceptedCookies(true);  // Hide the popup if cookies are valid
  //   }
  // }, []);

  useEffect(() => {
    setHasAcceptedCookies(false); // Always show popup
  }, []);


  const passwordVisible = () => {
    setVisible((prev) => !prev);
  };
  const loginButtonAfterHover = (e) => {
    const img = e.target.querySelector("img");
    if (img) {
      img.src = "./src/assets/images/loginAfterHover.svg";
    }
  };
  const loginButtonBeforeHover = (e) => {
    const img = e.target.querySelector("img");
    if (img) {
      img.src = "./src/assets/images/login.svg";
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-between w-screen font-display-main">
        {/* Wrapper to center form */}
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="w-[400px]">
            <form onSubmit={getUser} className="px-8 rounded-2xl">
              <div className="text-center flex flex-col items-center">
                <img
                  src="./src/assets/images/qlogo.svg"
                  className="w-[80px] mb-2"
                  alt="Logo"
                />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block py-0.5">
                  Email:
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value && password) setErrorMessage(""); // Clear error if both fields are filled
                  }}
                  className="w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46] h-[25px]"
                />
                <div className="flex items-center gap-2 h-[20px] text-red-600 text-sm mt-1">
                  {email && !validateEmail(email) && (
                    <>
                      <img
                        src="./src/assets/images/error.svg"
                        width={20}
                        alt="Error"
                      />
                      <p>Please enter a valid email address.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Password Input with Toggle */}
              <div className="relative">
                <label htmlFor="pwd" className="block py-0.5 ">
                  Password:
                  {/* Password<sup className="text-[#d90429] text-[0.7em] pl-1">*</sup> */}
                </label>
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  id="pwd"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (email && e.target.value) setErrorMessage("");
                  }}
                  className="w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46] h-[25px]"
                />
                {/* Password Visibility Icon */}
                <img
                  className="absolute top-[27px] right-0 cursor-pointer"
                  src={
                    visible
                      ? "./src/assets/images/pwdOpenIcon.svg"
                      : "./src/assets/images/pwdCloseIcon.svg"
                  }
                  onClick={passwordVisible}
                  width="22"
                  alt="Toggle Password"
                />
              </div>

              {/* Display Error Message */}
              <div className="mt-3 h-[10px] flex items-center">
                {/* {successMessage && (
                  <div
                    className={`flex items-center gap-2 p-2  text-green-700 rounded-md w-full 
                    transition-opacity duration-1000 ease-in-out ${
                      successMessage ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src="./src/assets/images/success.svg"
                      width={20}
                      alt="Success"
                    />
                    <p className="text-sm">{successMessage}</p>
                  </div>
                )}{" "} */}
                {errorMessage && (
                  <div className="flex items-center gap-2  rounded-md w-full">
                    <img
                      src="./src/assets/images/error.svg"
                      width={20}
                      alt="Error"
                    />
                    <p className="text-[#d90429] text-sm">{errorMessage}</p>
                  </div>
                )}
              </div>

              {/* Login Button */}
              <div>
                <button
                  onMouseOver={loginButtonAfterHover}
                  onMouseOut={loginButtonBeforeHover}
                  className="flex items-center justify-center gap-0.5 pb-1.5 pt-1 mt-3 bg-[#283E46] text-[1.3em] border border-[#283E46] cursor-pointer text-[#ffc300] w-full hover:text-[#283E46] hover:bg-white rounded-[25px] shadow-md transition duration-300"
                >
                  Login
                  <img
                    src="./src/assets/images/login.svg"
                    width={29}
                    height={29}
                    className="inline-block"
                    alt="Login Icon"
                  />
                </button>

                {/* Forgot Password & Sign Up Links */}
                <div className="mt-4 flex items-center flex-col gap-0.5">
                  <Link
                    to="/forgotPassword"
                    className="underline text-[#283E46] font-semibold"
                  >
                    Forgot Password?
                  </Link>
                  <p className="mt-1">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="underline text-[#283E46] font-semibold"
                    >
                      Sign up!
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* {!hasAcceptedCookies && <CookiesPopup isAuthenticated={isAuthenticated} setHasAcceptedCookies={setHasAcceptedCookies}  />} */}
        <CookiesPopup setHasAcceptedCookies={setHasAcceptedCookies} />
        {/* Footer at the bottom */}
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Login;
