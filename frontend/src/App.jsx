import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RestaurantPage from "./pages/RestaurantPage";
import OrdersDashboard from "./pages/OrdersDashboard";
import CustomerHistory from "./pages/CustomerHistory";
import MenuList from "./components/MenuList";
import Checkout from "./components/Checkout";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  // إضافة صنف للسلة
  const handleAddToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
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
          <h1>La Rose Sucrée Menu</h1>
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
                <MenuList onAddToCart={handleAddToCart} />
              )
            }
          />

          <Route path="/dashboard/orders" element={<OrdersDashboard />} />
          <Route path="/customer-history" element={<CustomerHistory />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;