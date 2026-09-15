import React, { useState } from 'react';
import MenuList from './components/MenuList';
import Checkout from './components/Checkout';

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

      {showCheckout ? (
        <Checkout cartItems={cartItems} />
      ) : (
        <MenuList onAddToCart={handleAddToCart} />
      )}
    </div>
  );
}

export default App;