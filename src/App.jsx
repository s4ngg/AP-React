import { BrowserRouter, Routes, Route } from "react-router-dom"
import OrderPage from "./pages/order/OrderPage"
import Header from "./components/common/Header"
import Footer from "./components/common/Footer"
import MainPage from "./pages/main/MainPage"
import CartPage from "./pages/cart/CartPage"
import ProductDetailPage from "./pages/product/ProductDetailPage"
import ReviewWritePage from "./pages/product/ReviewWritePage"
import CustomerPage from "./pages/coustomer/CustomerPage"
import LoginPage from "./pages/member/LoginPage"
import SignupPage from "./pages/member/SignupPage"
import VerifyEmailPage from "./pages/member/VerifyEmailPage"
import InterestsPage from "./pages/member/InterestsPage"
import TermsPage from "./pages/member/TermsPage"
import SignupCompletePage from "./pages/member/SignupCompletePage"
import FindEmailPage from "./pages/member/FindEmailPage"
import FindPasswordPage from "./pages/member/FindPasswordPage"
import ResetPasswordPage from "./pages/member/ResetPasswordPage"
import "./index.css"

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/review/write" element={<ReviewWritePage />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup/verify-email" element={<VerifyEmailPage />} />
            <Route path="/signup/interests" element={<InterestsPage />} />
            <Route path="/signup/terms" element={<TermsPage />} />
            <Route path="/signup/complete" element={<SignupCompletePage />} />
            <Route path="/find-email" element={<FindEmailPage />} />
            <Route path="/find-password" element={<FindPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
