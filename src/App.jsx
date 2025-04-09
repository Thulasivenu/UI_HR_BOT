import { BrowserRouter, Route, Routes } from "react-router-dom"
import Pdf_Extract from "./components/Pdf_Extract/Pdf_Extract"
import Page_Not_Found from "./components/PagenotFound/Page_Not_Found"
import Login from "./components/Login/Login"
import Forgotpassword from "./components/ForgotPassword/Forgotpassword"
import Signup from "./components/Signup/Signup"
import Logout from "./components/Logout/Logout"
import Settings from "./components/Settings/Settings"
import ChatHistory from "./components/ChatHistory/ChatHistory"
import { useState } from "react"
import ResetPassword from "./components/ResetPassword/ResetPassword"
import ChatInterface from "./components/ChatInterface/ChatInterface"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<ChatInterface />}></Route>
          <Route path="/forgotPassword" element={<Forgotpassword />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
          <Route path="/settings" element={<Settings />}></Route>
          {/* <Route path="/chatHistory" element={<ChatHistory />}></Route> */}
          <Route path="/resetPassword/:token" element={<ResetPassword />}></Route>
          <Route path="/resetPassword" element={<ResetPassword />}></Route>
          <Route path="*" element={<Page_Not_Found />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
