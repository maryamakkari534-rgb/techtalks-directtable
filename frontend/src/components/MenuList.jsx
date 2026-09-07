import React, { useEffect, useState } from 'react';

function MenuList({ onAddToCart }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => console.log('Waiting for backend connection:', err));
  }, []);

  return (
    <div>
      <h2>Menu</h2>
      {items.length === 0 ? (
        <p>No items available or backend not connected yet.</p>
      ) : (
        <div className="menu-list">
          {items.map((item) => (
            <div key={item.id} className="menu-item">
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="price">${item.price}</span>
              </div>
              {onAddToCart && (
                <button onClick={() => onAddToCart(item)}>Add to Order</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuList;