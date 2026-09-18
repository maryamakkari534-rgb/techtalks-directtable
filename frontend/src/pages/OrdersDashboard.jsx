import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders list");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status via API
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ status: newStatus }),
});
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      // Update state locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Error updating status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading orders...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Orders Dashboard</h2>
      <Link
  to="/customer-history"
  style={{
    display: "inline-block",
    marginBottom: "20px",
    textDecoration: "none",
    padding: "8px 14px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  }}
>
  View Customer History
</Link>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Order ID</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Customer</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Phone</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Address</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Notes</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Current Status</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Action Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>#{order.id}</td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {order.customerName || order.customer?.name || "N/A"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {order.customerPhone || order.phone || order.customer?.phone || "-"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {order.address || "-"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {order.notes || "-"}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {(order.totalAmount || 0).toLocaleString()} L.L.
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd", fontWeight: "bold" }}>
                  {order.status}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <option value="NEW">NEW</option>
                    <option value="PREPARING">PREPARING</option>
                    <option value="READY">READY</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrdersDashboard;