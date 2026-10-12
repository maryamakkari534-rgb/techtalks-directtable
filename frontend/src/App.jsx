
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useLocation
} from "react-router-dom";

import RestaurantPage from "./pages/RestaurantPage";
import OrdersDashboard from "./pages/OrdersDashboard";
import CustomerHistory from "./pages/CustomerHistory";
import MenuManagement from "./pages/MenuManagement";
import MenuList from "./components/MenuList";
import Checkout from "./components/Checkout";
import "./App.css";

function AppContent() {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  const handleAddToCart = (item) => {
    setCartItems((previous) => [...previous, item]);
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
    setShowCheckout(false);
  };

  return (
    <div className="dt-app">

      <header className="dt-site-header">
        <div className="dt-brand">
          <span className="dt-brand-label">
            RESTAURANT & SWEETS
          </span>

          <h1>La Rose Sucre</h1>

          <p>Fresh flavors, sweet moments.</p>
        </div>

{isDashboard && (
  <nav className="dt-dashboard-nav">

    <NavLink
      to="/dashboard/orders"
      className={({ isActive }) =>
        isActive
          ? "dt-dashboard-link active"
          : "dt-dashboard-link"
      }
    >
      Orders Management
    </NavLink>

    <NavLink
      to="/dashboard/menu"
      className={({ isActive }) =>
        isActive
          ? "dt-dashboard-link active"
          : "dt-dashboard-link"
      }
    >
      Menu Management
    </NavLink>

  </nav>
)}


        {!isDashboard && (
          <nav className="dt-header-actions">

            <Link
              to="/customer-history"
              className="dt-history-link"
            >
              سجل الطلبات
            </Link>

            <button
              type="button"
              className="dt-cart-button"
              onClick={() => {
                if (
                  !location.pathname.startsWith("/restaurant/")
                ) {
                  return;
                }

                setShowCheckout(!showCheckout);
              }}
            >
              {showCheckout
                ? "العودة للقائمة"
                : `السلة (${cartItems.length})`}
            </button>

          </nav>
        )}
      </header>

      <Routes>

        <Route
          path="/"
          element={<RestaurantPage />}
        />

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

        <Route
          path="/dashboard/orders"
          element={<OrdersDashboard />}
        />

        <Route
          path="/dashboard/menu"
          element={<MenuManagement />}
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

      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
