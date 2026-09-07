import React, { useState } from 'react';
import MenuList from './components/MenuList';
import Checkout from './components/Checkout';
import './App.css';
function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  return (
    <div className="container">
      <h1>DirectTable</h1>
      <MenuList onAddToCart={handleAddToCart} />
      <Checkout cartItems={cartItems} onOrderSuccess={handleOrderSuccess} />
    </div>
  );
}

export default App;