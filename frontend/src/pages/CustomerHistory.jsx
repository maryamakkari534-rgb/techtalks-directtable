import React, { useState } from "react";

function CustomerHistory() {

  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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

            <hr />

          </div>
        ))
      )}

    </div>
  );
}

export default CustomerHistory;