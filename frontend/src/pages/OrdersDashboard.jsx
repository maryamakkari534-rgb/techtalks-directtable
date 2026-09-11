import React, { useEffect, useState } from "react";

function OrdersDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        return res.json();
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      });
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

            <p>
              <strong>Name:</strong> {order.customerName}
            </p>

            <p>
              <strong>Phone:</strong> {order.customerPhone}
            </p>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <p>
              <strong>Type:</strong> {order.orderType}
            </p>

            {order.orderType === "DELIVERY" && (
              <p>
                <strong>Address:</strong> {order.address}
              </p>
            )}

            {order.notes && (
              <p>
                <strong>Notes:</strong> {order.notes}
              </p>
            )}

            <p>
              <strong>Total:</strong> ${order.totalAmount}
            </p>

            <p>
              <strong>Created At:</strong> {order.createdAt}
            </p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersDashboard;