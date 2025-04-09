import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Footer from "../../commonFolder/Footer/Footer";
import { Link, useNavigate, useParams, useSearchParams  } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; //npm install jwt-decode

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);
  const [visible, setVisible] = useState(false); // for new password
  const [pwdVisible, setPwdVisible] = useState(false); // for confirm password
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [validationText, setValitationText] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [resetError, setResetError] = useState("");
  const { token } = useParams(); // To get token from url
  const navigate = useNavigate();
  // console.log("frontend token", token)
  const [searchParams] = useSearchParams(); // Get URL parameters
  const expires = searchParams.get("expires"); // Get expiration timestamp from URL
  console.log(expires);
  let decodeEmail = "";
  try {
    const decode = jwtDecode(token);
    // console.log(decode);
    decodeEmail = decode.email;
  } catch (error) {
    console.log("Invalid token", error);
  }

  const validatePassword = (newPassword) => {
    const minLength = 8;
    const upperCase = /[A-Z]/.test(newPassword);
    const lowerCase = /[a-z]/.test(newPassword);
    const digits = /\d/.test(newPassword);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (newPassword.length < minLength) {
      return "Password must be atleast 8 Characters long";
    }
    if (!upperCase) {
      return "Password must contain atleast one uppercase character";
    }
    if (!lowerCase) {
      return "Password must contain atleast one lowercase character";
    }
    if (!digits) {
      return "Password must contain atleast one number";
    }
    if (!specialChar) {
      return "Password must contain atleast one special character";
    }
    return null;
  };

  const updatePassword = async (e) => {
    // console.log("here")
    e.preventDefault();
 
    if (!newPassword || !confirmPassword) {
      setResetError("Password is required!");
      return;
    }

    if (newPassword === confirmPassword) {
      const validationMessage = validatePassword(newPassword);
      setValitationText(validationMessage);
      console.log(validationMessage);

      if (validationMessage) {
        setFormValid(false);
        return;
      }
      setFormValid(true);
      const data = { email, newPassword };
      console.log("DATA", data);

      // Add API call or any further actions here
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/users/resetPassword/${token}`,
          {
            // const response = await fetch(`http://localhost:3000/api/v1/users/resetPassword`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
          }
        );
        console.log(response);
        // console.log('token',token)
        if (response.ok) {
          const result = await response.json();
          setSuccessMessage(result.message);
          // setResetError(response.message);
          console.log(result.message);
          setTimeout(() => navigate("/login"), 2500); // Smooth transition after success
        } else {
          setResetError(response.message || "Reset link expired");
          console.log("Error: ", response.status);
        }
      } catch (error) {
        setResetError("Something went wrong. Please try again.");
        console.error(error);
      }
    } else {
      console.log("Passwords do not match.");
    }
  };

  useEffect(() => {
    if (!confirmPassword) {
      setPasswordError(""); // Clear error if confirmPassword is empty
    } else if (newPassword === confirmPassword) {
      setPasswordError(""); // No error if they match
    } else {
      setPasswordError("Passwords don’t match");
    }
  }, [newPassword, confirmPassword]);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setResetError("");
    const validationMessage = validatePassword(e.target.value);
    setValitationText(validationMessage);
  };
  const passwordVisible = () => {
    setVisible((prev) => !prev);
  };
  const confirmPwdVisible = () => {
    setPwdVisible((prev) => !prev);
  };

  const loginButtonAfterHover = (e) => {
    const img = e.target.querySelector("img");
    if (img) {
      img.src = "/src/assets/images/loginAfterHover.svg";
    }
  };

  const loginButtonBeforeHover = (e) => {
    const img = e.target.querySelector("img");
    if (img) {
      img.src = "/src/assets/images/login.svg";
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-center  bg-[283E46] w-screen font-display-main">
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="w-[400px]">
            <form
              action="#"
              className="px-8 rounded-2xl"
              onSubmit={updatePassword}
            >
              <div className="text-center flex flex-col items-center">
                <div>
                  <img
                    src="/src/assets/images/qlogo.svg"
                    className="w-[80px] mb-2 "
                  />
                  <div>
                    {successMessage && (
                      <div className="flex items-center justify-center text-center gap-2 p-2 text-green-700 rounded-md w-full transition-opacity duration-1000 ease-in-out opacity-100">
                        <img
                          src="/src/assets/images/success.svg"
                          width={20}
                          alt="Success"
                        />
                        <p className="text-sm">{successMessage}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* <div className='text-center'>
                                {resetError && <p style={{ color: 'red' }}>{resetError}</p>}
                            </div> */}

              {/* <div> */}
              <div>
                <label htmlFor="email" className="block py-0.5">
                  Email:
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  readOnly
                  value={decodeEmail}
                  // onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46] h-[25px]  cursor-no-drop pointer-events-none"
                />
              </div>
              <div className="relative">
                <label htmlFor="pwd" className="block py-0.5 mt-4">
                  New Password:
                </label>
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  // onChange={(e) => setNewPassword(e.target.value)}
                  id="pwd"
                  className="w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46] h-[25px]"
                />
                {/* Password Visibility Icon */}
                <img
                  className="absolute top-[24px] right-0 cursor-pointer"
                  src={
                    visible
                      ? "/src/assets/images/pwdOpenIcon.svg"
                      : "/src/assets/images/pwdCloseIcon.svg"
                  }
                  onClick={passwordVisible}
                  width="22"
                  alt="Toggle Password"
                />
                <div
                  className="flex items-center gap-2 h-[30px]  my-0.5"
                  style={{
                    visibility: validationText ? "visible" : "hidden",
                    minHeight: "16px",
                  }}
                >
                  <img
                    src="/src/assets/images/error.svg"
                    className="w-[1em] h-[1em]"
                    alt="Error"
                  />
                  <p className=" text-red-600 text-[0.79em]">{validationText || "\u00A0"}</p>
                </div>
              </div>

              <div className="relative">
                <label htmlFor="cpwd" className="block">
                  Confirm Password:
                </label>
                <input
                  type={pwdVisible ? "text" : "password"}
                  name="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id="cpwd"
                  className="w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46] h-[25px]"
                />
                {/* Password Visibility Icon */}
                <img
                  className="absolute top-[24px] right-0 cursor-pointer"
                  src={
                    pwdVisible
                      ? "/src/assets/images/pwdOpenIcon.svg"
                      : "/src/assets/images/pwdCloseIcon.svg"
                  }
                  onClick={confirmPwdVisible}
                  width="22"
                  alt="Toggle Password"
                />
                <div
                  className={`flex items-center gap-2 h-[30px] py-1 mt-1 ${
                    passwordError || resetError ? "text-red-600" : "invisible"
                  }`}
                >
                  <img
                    src="/src/assets/images/error.svg"
                    className="w-[1em] h-[1em]"
                    alt="Error"
                  />
                  <p className="text-[0.79em]">{passwordError || resetError}</p>
                </div>
              </div>

              <div>
                {/* {resetError && (
                  <div className="flex items-center gap-2 h-[30px] py-1 text-sm mt-1">
                    <img
                      src="/src/assets/images/error.svg"
                      width={18}
                      alt="Error"
                    />
                    <p style={{ color: "red" }}>{resetError}</p>
                  </div>
                )} */}

                <button
                  onMouseOver={loginButtonAfterHover}
                  onMouseOut={loginButtonBeforeHover}
                  className="flex items-center justify-center gap-0.5 pb-1.5 pt-1 bg-[#283E46] text-[1.3em] border border-[#283E46] cursor-pointer text-[#ffc300] w-full hover:text-[#283E46] hover:bg-white rounded-[25px] shadow-md transition duration-30"
                >
                  Update Password
                  <img
                    src="/src/assets/images/login.svg"
                    width={29}
                    height={29}
                    className="inline-block"
                    onMouseOver={(e) =>
                      (e.currentTarget.src =
                        "/src/assets/images/loginAfterHover.svg")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.src = "/src/assets/images/login.svg")
                    }
                  />
                </button>
                {/* </div> */}

                <div className="mt-4 flex items-center flex-col gap-0.5 ">
                  <p>
                    Remember your credentials!{" "}
                    <Link
                      to="/login"
                      className="underline text-[#283E46] font-semibold"
                    >
                      Sign in{" "}
                    </Link>
                  </p>
                </div>
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

export default ResetPassword;
