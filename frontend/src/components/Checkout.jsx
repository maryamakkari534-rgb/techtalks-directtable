import React, { useState } from 'react';

function Checkout({ cartItems, onOrderSuccess }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState('PICKUP');
  const [submitting, setSubmitting] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert('Your order list is empty!');

    setSubmitting(true);

    const orderData = {
      restaurantId: 1,
      customerName: customerName,
      customerPhone: customerPhone,
      orderType: orderType,
      items: cartItems.map((item) => ({
        menuItemId: item.id || item.menuItemId,
        quantity: item.quantity || 1,
      })),
    };

    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to place order');
        return res.json();
      })
      .then((data) => {
        alert('Order placed successfully!');
        setSubmitting(false);
        if (onOrderSuccess) onOrderSuccess();
      })
      .catch((err) => {
        console.error('Error placing order:', err);
        alert('Error placing order');
        setSubmitting(false);
      });
  };

  return (
    <div className="checkout-section">
      <h2>Checkout</h2>
      {cartItems.length === 0 ? (
        <p>Your order list is empty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price}
              </li>
            ))}
          </ul>
          <p><strong>Total (Estimated): ${totalAmount}</strong></p>
          <form onSubmit={handleSubmit} className="order-form">
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
            >
              <option value="PICKUP">Pickup</option>
              <option value="DELIVERY">Delivery</option>
            </select>
            <button type="submit" disabled={submitting} className="place-order-btn">
              {submitting ? 'Submitting...' : 'Place Order'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Checkout;