import React, { useEffect, useState } from "react";

function OrdersDashboard() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log(err));
  }, []);


  return (
    <div>
      <h1>Orders Dashboard</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <h3>Order #{order.id}</h3>
            <p>Status: {order.status}</p>
            <p>Type: {order.orderType}</p>
            <p>Total: {order.totalAmount}</p>
          </div>
        ))
      )}

    </div>
  );
}

export default OrdersDashboard;
