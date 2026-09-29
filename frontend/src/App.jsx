import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RestaurantPage from "./pages/RestaurantPage";
import OrdersDashboard from "./pages/OrdersDashboard";
import CustomerHistory from "./pages/CustomerHistory";
import MenuList from "./components/MenuList";
import Checkout from "./components/Checkout";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  // إضافة صنف للسلة
  const handleAddToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  // التعامل مع نجاح الطلب
  const handleOrderSuccess = () => {
    setCartItems([]);
    setShowCheckout(false);
  };

  return (
    <BrowserRouter>
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <header
          style={{
            display: "flex",
            justify: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1>La Rose Sucre Menu</h1>
          <Link
           to="/customer-history"
           style={{
            marginRight: "15px",
            textDecoration: "none",
            padding: "10px 20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
         >
           سجل الطلبات
          </Link>

          <button
            onClick={() => setShowCheckout(!showCheckout)}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            {showCheckout ? "العودة للقائمة" : `السلة (${cartItems.length})`}
          </button>
        </header>

        <Routes>
          <Route path="/" element={<RestaurantPage />} />

          <Route
            path="/restaurant/:id"
            element={
              showCheckout ? (
                <Checkout
                  cartItems={cartItems}
                  onOrderSuccess={handleOrderSuccess}
                />
              ) : (
                <MenuList
                   onAddToCart={handleAddToCart}
                   restaurantId={1}
                />
              )
            }
          />

          <Route path="/dashboard/orders" element={<OrdersDashboard />} />
          <Route
          path="/customer-history"
          element={
            <CustomerHistory
              onAddToCart={handleAddToCart}
              setShowCheckout={setShowCheckout}
            />
      }
     />
        </Routes>
      </div>
    </BrowserRouter >
  );
}

export default App;