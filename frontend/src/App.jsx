import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
} from "react-router-dom";

import Login from "./pages/Login";
import RestaurantPage from "./pages/RestaurantPage";
import OrdersDashboard from "./pages/OrdersDashboard";
import MenuManagement from "./pages/MenuManagement";
import MenuList from "./components/MenuList";
import Checkout from "./components/Checkout";
import CustomerHistory from "./pages/CustomerHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleAddToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
    setShowCheckout(false);
  };

  return (
    <BrowserRouter>
      <div className="dt-app">
        <header className="dt-site-header">
          <div className="dt-brand">
            <span className="dt-brand-label">RESTAURANT & SWEETS</span>
            <h1>La Rose Sucrée</h1>
            <p>Fresh flavors, sweet moments.</p>
          </div>

          {/* Only navigation is rendered inside the header. */}
          <Routes>
            <Route
              path="/dashboard/*"
              element={
                <nav className="dt-dashboard-nav">
                  <NavLink
                    to="/dashboard/orders"
                    className={({ isActive }) =>
                      `dt-dashboard-link ${isActive ? "active" : ""}`
                    }
                  >
                    Orders
                  </NavLink>

                  <NavLink
                    to="/dashboard/menu"
                    className={({ isActive }) =>
                      `dt-dashboard-link ${isActive ? "active" : ""}`
                    }
                  >
                    Menu Management
                  </NavLink>

                  <NavLink
                    to="/dashboard/customer-history"
                    className={({ isActive }) =>
                      `dt-dashboard-link ${isActive ? "active" : ""}`
                    }
                  >
                    Customer History
                  </NavLink>
                </nav>
              }
            />

            <Route path="/admin/login" element={null} />

            <Route
              path="*"
              element={
                <div className="dt-header-actions">
                  <Link to="/customer-history" className="dt-history-link">
                    سجل الطلبات
                  </Link>

                  <button
                    type="button"
                    className="dt-cart-button"
                    onClick={() => setShowCheckout((prev) => !prev)}
                  >
                    {showCheckout
                      ? "العودة للقائمة"
                      : `السلة (${cartItems.length})`}
                  </button>
                </div>
              }
            />
          </Routes>
        </header>

        {/* Page content stays outside the header. */}
        <Routes>
          <Route path="/admin/login" element={<Login />} />

          <Route path="/" element={<RestaurantPage />} />

          <Route
            path="/restaurant/:id"
            element={
              showCheckout ? (
                <Checkout
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onClearCart={handleOrderSuccess}
                />
              ) : (
                <MenuList onAddToCart={handleAddToCart} />
              )
            }
          />

          <Route
            path="/customer-history"
            element={
              <CustomerHistory
                onAddToCart={handleAddToCart}
                setShowCheckout={setShowCheckout}
              />
            }
          />

          <Route
            path="/dashboard/orders"
            element={
              <ProtectedRoute>
                <OrdersDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/menu"
            element={
              <ProtectedRoute>
                <MenuManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/customer-history"
            element={
              <ProtectedRoute>
                <CustomerHistory
                  onAddToCart={handleAddToCart}
                  setShowCheckout={setShowCheckout}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
