import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import OrderPage from "./pages/order/OrderPage"
import Header from "./components/common/Header"
import Footer from "./components/common/Footer"
import MainPage from "./pages/main/MainPage"
import MyPage from "./pages/member/MyPage"
import CartPage from "./pages/cart/CartPage"
import ProductDetailPage from "./pages/product/ProductDetailPage"
import ProductListPage from "./pages/product/ProductListPage"
import ReviewWritePage from "./pages/review/ReviewWritePage"
import CustomerPage from "./pages/customer/CustomerPage"
import LoginPage from "./pages/member/LoginPage"
import SignupPage from "./pages/member/SignupPage"
import SignupSelectPage from "./pages/member/SignupSelectPage"
import VerifyEmailPage from "./pages/member/VerifyEmailPage"
import InterestsPage from "./pages/member/InterestsPage"
import TermsPage from "./pages/member/TermsPage"
import SignupCompletePage from "./pages/member/SignupCompletePage"
import FindEmailPage from "./pages/member/FindEmailPage"
import FindPasswordPage from "./pages/member/FindPasswordPage"
import ResetPasswordPage from "./pages/member/ResetPasswordPage"
import SellerApplyPage from "./pages/member/SellerApplyPage"
import SellerApplyCompletePage from "./pages/member/SellerApplyCompletePage"
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import AdminLoginPage from "./pages/admin/AdminLoginPage"
import AdminMemberPage from "./pages/admin/AdminMemberPage"
import AdminProductsPage from "./pages/admin/AdminProductsPage"
import AdminOrdersPage from "./pages/admin/AdminOrdersPage"
import AdminCategoryPage from "./pages/admin/AdminCategoryPage"
import AdminRefundPage from "./pages/admin/AdminRefundPage"
import AdminNoticePage from "./pages/admin/AdminNoticePage"
import AdminFAQPage from "./pages/admin/AdminFAQPage"
import AdminInquiryPage from "./pages/admin/AdminInquiryPage"
import AdminAccountPage from "./pages/admin/AdminAccountPage"
import SellerDashboardPage from "./pages/seller/SellerDashboardPage"
import SellerProductsPage from "./pages/seller/SellerProductsPage"
import SellerOrdersPage from "./pages/seller/SellerOrdersPage"
import SellerRefundPage from "./pages/seller/SellerRefundPage"
import SellerInquiryPage from "./pages/seller/SellerInquiryPage"
import OrderSuccessPage from "./pages/order/OrderSuccessPage"
import OrderFailPage from "./pages/order/OrderFailPage"
import useAuthStore from "./store/authStore"
import "./index.css"

const PrivateRoute = ({ children }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const adminToken = useAuthStore((state) => state.adminToken)
  return adminToken ? children : <Navigate to="/admin/login" replace />
}

const SellerRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuthStore()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!user?.isSeller) return <Navigate to="/" replace />
  return children
}

function AppContent() {
  const location = useLocation()
  const hideHeader = location.pathname.startsWith("/seller") || location.pathname.startsWith("/admin")

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!hideHeader && <Header />}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/order/success" element={<OrderSuccessPage />} />
          <Route path="/order/fail" element={<OrderFailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id/review/write" element={<ReviewWritePage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupSelectPage />} />
          <Route path="/signup/user" element={<SignupPage />} />
          <Route path="/signup/seller" element={<SignupPage isSeller={true} />} />
          <Route path="/signup/verify-email" element={<VerifyEmailPage />} />
          <Route path="/signup/interests" element={<InterestsPage />} />
          <Route path="/signup/terms" element={<TermsPage />} />
          <Route path="/signup/complete" element={<SignupCompletePage />} />
          <Route path="/find-email" element={<FindEmailPage />} />
          <Route path="/find-password" element={<FindPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/seller-apply" element={<SellerApplyPage />} />
          <Route path="/seller-apply/complete" element={<SellerApplyCompletePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/members" element={<AdminRoute><AdminMemberPage /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminCategoryPage /></AdminRoute>} />
          <Route path="/admin/refunds" element={<AdminRoute><AdminRefundPage /></AdminRoute>} />
          <Route path="/admin/notices" element={<AdminRoute><AdminNoticePage /></AdminRoute>} />
          <Route path="/admin/faqs" element={<AdminRoute><AdminFAQPage /></AdminRoute>} />
          <Route path="/admin/inquiries" element={<AdminRoute><AdminInquiryPage /></AdminRoute>} />
          <Route path="/admin/accounts" element={<AdminRoute><AdminAccountPage /></AdminRoute>} />
          <Route path="/seller" element={<SellerRoute><SellerDashboardPage /></SellerRoute>} />
          <Route path="/seller/products" element={<SellerRoute><SellerProductsPage /></SellerRoute>} />
          <Route path="/seller/orders" element={<SellerRoute><SellerOrdersPage /></SellerRoute>} />
          <Route path="/seller/refunds" element={<SellerRoute><SellerRefundPage /></SellerRoute>} />
          <Route path="/seller/inquiries" element={<SellerRoute><SellerInquiryPage /></SellerRoute>} />
        </Routes>
      </div>
      {!hideHeader && <Footer />}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
export default App
