import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  
  // DT-31: Filter State
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Delivery Area Selection State
  const [selectedArea, setSelectedArea] = useState("ALL");

  // DT-32: Expanded Order IDs for Item Details
  const [expandedOrders, setExpandedOrders] = useState({});
  const [orderDetails, setOrderDetails] = useState({});

  // Delivery Areas List
  const deliveryAreas = [
    { id: "ALL", name: "All Areas" },
    { id: "BEIRUT", name: "Beirut Central" },
    { id: "HAZMIEH", name: "Hazmieh & Surroundings" },
    { id: "JABAL", name: "Metn / Mount Lebanon" },
  ];

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
        const errorData = await response.json();
        throw new Error(errorData.message);
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
  const toggleOrderDetails = async (orderId) => {
    if (!expandedOrders[orderId]) {
      try {
        const response = await fetch(`/api/orders/${orderId}/details`);

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();

        setOrderDetails((prev) => ({
          ...prev,
          [orderId]: data,
        }));
      } catch (err) {
        alert(err.message);
        return;
      }
    }

    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Combined Filter logic (Status & Delivery Area)
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const matchesArea = selectedArea === "ALL" || order.deliveryArea === selectedArea;
    return matchesStatus && matchesArea;
  });

  if (loading) return <div style={{ padding: "20px" }}>Loading orders...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Orders Dashboard</h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <Link
          to="/customer-history"
          style={{
            display: "inline-block",
            textDecoration: "none",
            padding: "8px 14px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            color: "#333",
            backgroundColor: "#f9f9f9",
          }}
        >
          View Customer History
        </Link>

        {/* Filter Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* Delivery Area Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label htmlFor="areaFilter" style={{ fontWeight: "bold" }}>
              Delivery Area:
            </label>
            <select
              id="areaFilter"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: "4px", fontSize: "14px" }}
            >
              {deliveryAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          {/* DT-31: Filter Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label htmlFor="statusFilter" style={{ fontWeight: "bold" }}>
              Filter by Status:
            </label>
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
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found matching the selected filters.</p>
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
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Area</th>
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
                    {order.customerPhone || order.phone || order.customer?.phone || "-"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {order.deliveryArea || "Default"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {order.address || "-"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {order.notes || "-"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {(order.totalAmount || order.totalPrice || 0).toLocaleString()} L.L.
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
                    <td colSpan="10" style={{ backgroundColor: "#f9f9f9", padding: "15px", border: "1px solid #ddd" }}>
                      <strong>Order Items:</strong>
                      {orderDetails[order.id]?.items &&
                      orderDetails[order.id].items.length > 0 ? (
                        <ul style={{ marginTop: "8px", marginBottom: "0" }}>
                          {orderDetails[order.id].items.map((item, idx) => (
                            <li key={idx}>
                              {item.name} x {item.quantity} - {item.price.toLocaleString()} L.L.
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