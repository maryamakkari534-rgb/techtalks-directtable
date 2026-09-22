import React, { useState, useEffect } from "react";

function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  
  // DT-31: Filter State
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // DT-32: Expanded Order IDs for Item Details
  const [expandedOrders, setExpandedOrders] = useState({});

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/orders");
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
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

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

  // DT-32: Toggle Expand/Collapse for order items
  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // DT-31: Filter logic
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "ALL") return true;
    return order.status === statusFilter;
  });

  if (loading) return <div style={{ padding: "20px" }}>Loading orders...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Orders Dashboard</h2>

      {/* DT-31: Filter Controls */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <label htmlFor="statusFilter" style={{ fontWeight: "bold" }}>Filter by Status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "6px 12px", borderRadius: "4px", fontSize: "14px" }}
        >
          <option value="ALL">All Orders</option>
          <option value="NEW">NEW</option>
          <option value="PREPARING">PREPARING</option>
          <option value="READY">READY</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found for this status.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
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
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>#{order.id}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {order.customerName || order.customer?.name || "N/A"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {order.phone || order.customer?.phone || "-"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {order.address || "-"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {order.notes || "-"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    ${order.totalPrice || order.total || 0}
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
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      style={{
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fafafa"
                      }}
                    >
                      {expandedOrders[order.id] ? "Hide Items" : "View Items"}
                    </button>
                  </td>
                </tr>

                {/* DT-32: Expandable Details Row */}
                {expandedOrders[order.id] && (
                  <tr>
                    <td colSpan="9" style={{ backgroundColor: "#f9f9f9", padding: "15px", border: "1px solid #ddd" }}>
                      <strong>Order Items:</strong>
                      {order.items && order.items.length > 0 ? (
                        <ul style={{ marginTop: "8px", marginBottom: "0" }}>
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.menuItem?.name || item.name || "Item"} x {item.quantity || 1} - ${item.price || item.menuItem?.price || 0}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ margin: "5px 0 0 0", color: "#666" }}>No item details available for this order.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrdersDashboard;