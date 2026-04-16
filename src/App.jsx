import { BrowserRouter, Routes, Route } from "react-router-dom"
import OrderPage from "./pages/order/OrderPage"
import Header from "./components/common/Header"
import Footer from "./components/common/Footer"
import MainPage from "./pages/main/MainPage"
import CartPage from "./pages/cart/CartPage"
import ProductDetailPage from "./pages/product/ProductDetailPage"
<<<<<<< HEAD
import ReviewWritePage from "./pages/product/ReviewWritePage"
=======
import CustomerPage from "./pages/coustomer/CustomerPage"
>>>>>>> 93d6a331e20155e2f0939d0755483b27fd3a3b1d
import "./index.css"

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            {/* 추후 추가 */}
            {/* <Route path="/products" element={<ProductListPage />} /> */}
            {/* <Route path="/products/:id" element={<ProductDetailPage />} /> */}
            {/* <Route path="/login" element={<LoginPage />} /> */}
            {/* <Route path="/signup" element={<SignupPage />} /> */}
            {/* <Route path="/mypage" element={<MyPage />} /> */}
            <Route path="/order" element={<OrderPage />} />
            {/* <Route path="/admin" element={<AdminPage />} /> */}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/review/write" element={<ReviewWritePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
