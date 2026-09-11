import React, { useState } from 'react';

function MenuList({ onAddToCart }) {
  const [items] = useState([
  {
    id: 1,
    name: 'Burger',
    description: 'Test burger',
    price: 7.5,
  },
]);

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