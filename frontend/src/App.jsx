import { BrowserRouter, Routes, Route } from "react-router-dom";
import RestaurantPage from "./pages/RestaurantPage";
import OrdersDashboard from "./pages/OrdersDashboard";
import MenuList from "./components/MenuList";
import Checkout from "./components/Checkout";
import { useState } from "react";
import CustomerHistory from "./pages/CustomerHistory";


function App() {

  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };


  return (
    <BrowserRouter>

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
  );
}

export default App;