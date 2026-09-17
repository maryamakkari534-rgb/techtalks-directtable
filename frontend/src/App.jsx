<<<<<<< HEAD
import React, { useState } from 'react';
import MenuList from './components/MenuList';
import Checkout from './components/Checkout';
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RestaurantPage from "./pages/RestaurantPage";
import OrdersDashboard from "./pages/OrdersDashboard";
import MenuList from "./components/MenuList";
import Checkout from "./components/Checkout";
import { useState } from "react";
import CustomerHistory from "./pages/CustomerHistory";

>>>>>>> origin/develop

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  // إضافة صنف للسلة
  const handleAddToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>La Rose Sucrée Menu</h1>
        <button 
          onClick={() => setShowCheckout(!showCheckout)}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {showCheckout ? 'العودة للقائمة' : `السلة (${cartItems.length})`}
        </button>
      </header>

<<<<<<< HEAD
      {showCheckout ? (
        <Checkout cartItems={cartItems} />
      ) : (
        <MenuList onAddToCart={handleAddToCart} />
      )}
    </div>
=======
      <Routes>

        <Route 
          path="/" 
          element={<RestaurantPage />} 
        />

        <Route 
          path="/restaurant/:id"
          element={
            <>
              <MenuList onAddToCart={handleAddToCart} />
              <Checkout
                cartItems={cartItems}
                onOrderSuccess={handleOrderSuccess}
              />
            </>
          }
        />

        <Route 
          path="/dashboard/orders"
          element={<OrdersDashboard />}
        />
        <Route
          path="/customer-history"
          element={<CustomerHistory />}
        />

      </Routes>

    </BrowserRouter>
>>>>>>> origin/develop
  );
}

export default App;