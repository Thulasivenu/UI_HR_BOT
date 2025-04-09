import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";

export default function CookiePopup() {
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const consentGiven = getCookieConsentValue("CookieConsent");
    console.log("consentive",consentGiven);
    if (consentGiven === null || consentGiven === "false") {
      setShowPopup(true);
    }
    
    if(!consentGiven){
      setShowPopup(true);
    }
  },[])

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center  flex-col z-50">
          <CookieConsent
            // debug={true}
            buttonText="Accept"
            declineButtonText="Deny"
            flipButtons={true}
            style={{
              background: "white",
              width: "90%", // Use a percentage instead of fixed width
              maxWidth: "350px", // Restrict max width
              minHeight: "auto", // Allow height to adjust based on content
              color: "black",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              borderRadius: "10px",
              padding: "20px",
              textAlign: "center",
              whiteSpace: "normal",
              wordWrap: "break-word",
              justifyContent: "center",
            }}
            buttonStyle={{
              color: "white",
              background: "#283E46",
              // margin: "15px",
              // padding: "10px 5px",
              padding: "10px 20px 10px 5px",
              width: "100px",
              // borderRadius:"25px",
              // borderTopRightRadius: "25px",
              // borderBottomRightRadius: "25px",
              backgroundImage: "url('/assets/images/accept.svg')", // Replace with your image URL
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right",
              backgroundSize: "26px",
              backgroundPositionX: "70px",
              paddingRight: "10px",
              borderRadius: "25px"
            }}
            declineButtonStyle={{
              color: "white",
              background: "#283E46",
              padding: "10px 20px 10px 5px",
              borderRadius: "25px",
              // borderTopRightRadius: "25px",
              // borderBottomRightRadius: "25px", // Change to your desired color
              // margin: "15px",
              width: "100px",
              border: "none",
              cursor: "pointer",
              backgroundImage: "url('/assets/images/deny.svg')", // Replace with your image URL
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right",
              backgroundSize: "20px",
              backgroundPositionX: "70px",
              // paddingRight: "10px"
            }}
            expires={150}
            enableDeclineButton
            onAccept={() => {
              console.log("User accepted cookies");
              // localStorage.setItem("cookieAccepted", "true")
              setShowPopup(false);

            }}
            onDecline={() => {
              console.log("User declined cookies");
              setShowPopup(false);
            }}
          >
            {/* <div> */}
              <h2 className="font-semibold">We value your privacy!</h2>
              <p>
                We use cookies to improve functionality and provide a
                personalized experience. Manage your preferences or accept
                cookies to continue.
              </p>
            {/* </div> */}
          </CookieConsent>
              <Link to="/privacyPolicy">Privacy Policy</Link>
        </div>
      )}
    </>
  );
}
