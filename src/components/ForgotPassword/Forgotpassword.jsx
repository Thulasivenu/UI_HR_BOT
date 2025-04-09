import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../../commonFolder/Footer/Footer";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const sendMail = async (e) => {
    e.preventDefault();

    // if (!validateEmail(email)) {
    //   setErrorMessage("Please enter a valid email address.");
    //   return;
    // }

    const data = { email };
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/forgotPassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(result.message);
        setTimeout(() => navigate("/login"), 2500); // Smooth transition after success
      } else {
        const result = await response.json();
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
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
      <div className="flex flex-col min-h-screen items-center justify-center  w-screen font-display-main">
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="w-[400px]">
            <form onSubmit={sendMail} className="px-8 rounded-2xl">
              <div className="text-center flex flex-col items-center">
                <img
                  src="./src/assets/images/qlogo.svg"
                  className="w-[80px]"
                  alt="Logo"
                />
                {successMessage && (
                  <div className="flex items-center justify-center gap-2 p-2 text-green-700 rounded-md w-full transition-opacity duration-1000 ease-in-out opacity-100">
                    <img
                      src="./src/assets/images/success.svg"
                      width={20}
                      alt="Success"
                    />
                    <p className="text-sm">{successMessage}</p>
                  </div>
                )}
              </div>

              {/* <div className="text-center bg-[#d4d8da] rounded-[10px] my-5">
                <h1 className="p-1 text-[#283e46] text-[0.9em]">
                  Enter your registered email ID to receive a password reset
                  link
                </h1>
              </div> */}

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
                    if (e.target.value) setErrorMessage("");
                  }}
                  onFocus={() => setErrorMessage("")}
                  className="w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46]"
                />

                {/* Error Message (Inline Validation + Backend Error) */}
                <div className="flex items-center gap-1.5 h-[30px] text-red-600 py-1  mt-1">
                  {email && !validateEmail(email) && !errorMessage && (
                    <>
                      <img
                        src="./src/assets/images/error.svg"
                        className="w-[1em] h-[1em]"
                        alt="Error"
                      />
                      <p className="text-[0.79em]">
                        Please enter a valid email address.
                      </p>
                    </>
                  )}

                  {errorMessage && (
                    <>
                      <img
                        src="./src/assets/images/error.svg"
                        className="w-[1em] h-[1em]"
                        alt="Error"
                      />
                      <p className="text-[0.79em]">{errorMessage}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Success Message */}

              {/* Submit Button */}
              <button
                onMouseOver={loginButtonAfterHover}
                onMouseOut={loginButtonBeforeHover}
                className="flex items-center justify-center gap-0.5 pb-1.5 pt-1 mt-1 bg-[#283E46] text-[1.3em] border border-[#283E46] cursor-pointer text-[#ffc300] w-full hover:text-[#283E46] hover:bg-white rounded-[25px] shadow-md transition duration-300"
              >
                Send Mail
                <img
                 onMouseOver={loginButtonAfterHover}
                 onMouseOut={loginButtonBeforeHover}
                  src="./src/assets/images/login.svg"
                  width={29}
                  height={29}
                  className="inline-block"
                  alt="Send Mail"
                />
              </button>

              {/* Back to Login */}
              <div className="mt-4 flex items-center flex-col gap-0.5">
                <p>
                  Remember your credentials?{" "}
                  <Link
                    to="/login"
                    className="underline text-[#283E46] font-semibold"
                  >
                    Sign in{" "}
                  </Link>
                </p>
              </div>
              <div className="rounded-[10px] text-center my-1 ">
                <h1 className="p-1  text-gray-400 text-[0.75em]">
                <sup className="text-red-700 px-1">*</sup>
                Enter your registered email ID to receive a password
                  reset link!
                </h1>
              </div>
            </form>
          </div>
        </div>

        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Forgotpassword;
