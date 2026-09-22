import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomerHistory({ onAddToCart, setShowCheckout }) {

  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getHistory = () => {

    if (!phone) {
      alert("Please enter phone number");
      return;
    }

    setLoading(true);

    fetch(`/api/orders/history/${phone}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch history");
        }

        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
const handleReorder = (orderId) => {

  fetch(`/api/orders/${orderId}/reorder`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to reorder");
      }

      return res.json();
    })
    .then((data) => {

      data.items.forEach((item) => {

        onAddToCart({
          id: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        });

      });

      setShowCheckout(true);
      navigate("/restaurant/1");    })
    .catch((err) => {
      console.error(err);
      alert("Failed to reorder");
    });
};

  return (
    <div>
      <h1>Customer Order History</h1>

      <input
        type="text"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={getHistory}>
        View History
      </button>
     {orders.length > 0 && (
    <div>
      <h2>
        Customer: {orders[0].customerName}
      </h2>

    <p>
      Phone: {orders[0].customerPhone}
    </p>
    </div>
    )}


      {loading && <p>Loading...</p>}


      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>

            <h3>Order #{order.id}</h3>

            <p>
              Status: {order.status}
            </p>

            <p>
              Type: {order.orderType}
            </p>

            <p>
               Total: {(order.totalAmount || 0).toLocaleString()} L.L.
            </p>

            <p>
              Date: {order.createdAt}
            </p>
            <button
                onClick={() => handleReorder(order.id)}
            >
              Reorder
            </button>
            <hr />

          </div>
        ))
      )}

    </div>
  );
}

export default CustomerHistory;