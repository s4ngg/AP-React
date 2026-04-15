import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Header from "./components/common/Header"
import Footer from "./components/common/Footer"
import MainPage from "./pages/main/MainPage"

import SignupPage         from "./pages/member/SignupPage"
import VerifyEmailPage    from "./pages/member/VerifyEmailPage"
import InterestsPage      from "./pages/member/InterestsPage"
import TermsPage          from "./pages/member/TermsPage"
import SignupCompletePage from "./pages/member/SignupCompletePage"
import LoginPage          from "./pages/member/LoginPage"
import FindEmailPage      from "./pages/member/FindEmailPage"
import FindPasswordPage   from "./pages/member/FindPasswordPage"
import ResetPasswordPage  from "./pages/member/ResetPasswordPage"

import "./index.css"

const AUTH_PATHS = ["/login", "/signup", "/find-email", "/find-password", "/reset-password"]

function Layout({ children }) {
  const { pathname } = useLocation()
  const isAuth = AUTH_PATHS.some(p => pathname.startsWith(p))
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!isAuth && <Header />}
      <div style={{ flex: 1 }}>{children}</div>
      {!isAuth && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"                     element={<MainPage />} />
          <Route path="/signup"               element={<SignupPage />} />
          <Route path="/signup/verify-email"  element={<VerifyEmailPage />} />
          <Route path="/signup/interests"     element={<InterestsPage />} />
          <Route path="/signup/terms"         element={<TermsPage />} />
          <Route path="/signup/complete"      element={<SignupCompletePage />} />
          <Route path="/login"                element={<LoginPage />} />
          <Route path="/find-email"           element={<FindEmailPage />} />
          <Route path="/find-password"        element={<FindPasswordPage />} />
          <Route path="/reset-password"       element={<ResetPasswordPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
export default App
