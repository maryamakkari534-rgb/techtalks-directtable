import LogoutButton from "../components/LogoutButton";
import React, { useState, useEffect } from "react";
import "./OrdersDashboard.css";

function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [archivingId, setArchivingId] = useState(null);

  // Filter & Search States
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Expandable Order Details State
  const [expandedOrders, setExpandedOrders] = useState({});
  const [orderDetails, setOrderDetails] = useState({});

  // Delivery Areas List
  const deliveryAreas = [
    { id: "ALL", name: "All Areas" },
    { id: "TRIPOLI", name: "Tripoli Center" },
    { id: "MINA", name: "El Mina" },
    { id: "ABU_SAMRA", name: "Abu Samra" },
    { id: "QOBBEH", name: "Qobbeh" },
    { id: "DAM_W_FAREZ", name: "Dam w Farez" },
    { id: "TALL", name: "Al Tall" },
    { id: "ZAHRIYEH", name: "Zahriyeh" },
    { id: "BAB_EL_TABBANEH", name: "Bab El Tabbaneh" },
    { id: "BAHSAAS", name: "Bahsaas" }
  ];

  // Fetch orders from backend
  const fetchOrders = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setIsRefreshing(true);
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders list");
      }
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status via API
  
const handleStatusChange = async (orderId, newStatus) => {
  setUpdatingId(orderId);

  try {
    // Get CSRF token
    const csrfResponse = await fetch("/api/auth/csrf", {
      credentials: "include"
    });

    if (!csrfResponse.ok) {
      throw new Error("Failed to get CSRF token");
    }

    const csrfData = await csrfResponse.json();

    // Update order status
    const response = await fetch(
      `/api/orders/${orderId}/status`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfData.token
        },
        body: JSON.stringify({ status: newStatus })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      throw new Error(
        errorData?.message ||
        `Failed to update status (HTTP ${response.status})`
      );
    }

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );

  } catch (err) {
    alert("Error updating status: " + err.message);
  } finally {
    setUpdatingId(null);
  }
};


const handleArchiveOrder = async (orderId) => {
  if (archivingId !== null) return;
  const confirmed = window.confirm(
    "Are you sure you want to archive this order?"
  );

  if (!confirmed) return;

  setArchivingId(orderId);
  try {
    const csrfResponse = await fetch("/api/auth/csrf", {
      credentials: "include"
    });

    if (!csrfResponse.ok) {
      throw new Error("Failed to get CSRF token");
    }

    const csrfData = await csrfResponse.json();

    const response = await fetch(
      `/api/orders/${orderId}/archive`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "X-XSRF-TOKEN": csrfData.token
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      throw new Error(
        errorData?.message ||
        `Failed to archive order (HTTP ${response.status})`
      );
    }

    // Remove archived order from dashboard
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );

  } catch (error) {
    alert("Error archiving order: " + error.message);
  } finally {
    setArchivingId(null);
  }
};

  // Toggle Expand/Collapse for order items
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

  // Helper for Status Badge Styling
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "NEW":
        return { backgroundColor: "#e3f2fd", color: "#0d47a1", border: "1px solid #90caf9" };
      case "PREPARING":
        return { backgroundColor: "#fff3e0", color: "#e65100", border: "1px solid #ffcc80" };
      case "READY":
        return { backgroundColor: "#f3e5f5", color: "#4a148c", border: "1px solid #ce93d8" };
      case "COMPLETED":
        return { backgroundColor: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7" };
      default:
        return { backgroundColor: "#eee", color: "#333", border: "1px solid #ccc" };
    }
  };

  // Combined Filter & Search logic
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

    const areaName = deliveryAreas.find(
      (area) => area.id === selectedArea
    )?.name;

    const matchesArea =
      selectedArea === "ALL" ||
      order.deliveryArea === selectedArea ||
      (areaName && order.address?.startsWith(areaName));

    const name = (order.customerName || order.customer?.name || "").toLowerCase();
    const phone = (order.customerPhone || order.phone || order.customer?.phone || "").toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = query === "" || name.includes(query) || phone.includes(query);

    return matchesStatus && matchesArea && matchesSearch;
  });

  if (loading) return <div style={{ padding: "20px" }}>Loading orders...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;

  return (
    <div className="orders-dashboard">
      {/* Header with Title and Logout Button */}
      <div className="orders-dashboard-header">
        <h2>Orders & Delivery Management</h2>

        <div className="orders-header-actions">
          {/* Refresh Button */}
          <button
            className="orders-refresh-button"
            onClick={() => fetchOrders(true)}
            disabled={isRefreshing}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {isRefreshing ? "Refreshing..." : "🔄 Refresh Data"}
          </button>

          {/* Logout Button */}
          <LogoutButton />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>


        {/* Filter Controls & Search */}
        <div className="orders-filters">
          {/* Customer / Phone Search */}
          <input
            type="text"
            placeholder="Search Name or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontSize: "14px",
              width: "200px"
            }}
          />

          {/* Delivery Area Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label htmlFor="areaFilter" style={{ fontWeight: "bold" }}>Area:</label>
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

          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label htmlFor="statusFilter" style={{ fontWeight: "bold" }}>Status:</label>
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
        <p>No orders found matching the selected criteria.</p>
      ) : (
        <div className="orders-table-wrapper" role="region" aria-label="Orders table" tabIndex={0}>
        <table className="orders-table">
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Order ID</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Customer</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Phone</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Area</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Address</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Customer Notes</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Total</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Action</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Details</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Archive</th>
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
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      backgroundColor: "#f0f0f0",
                      fontWeight: "bold"
                    }}>
                      {order.orderType === "PICKUP"
                        ? "Pickup"
                        : deliveryAreas.find(
                            (area) =>
                              area.id !== "ALL" &&
                              order.address?.startsWith(area.name)
                          )?.name || order.deliveryArea || "Unknown"}
                    </span>
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {order.address || "-"}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      fontSize: "14px",
                      color: "#245B78",
                      maxWidth: "220px",
                      overflowWrap: "anywhere"
                    }}
                  >
                    {order.notes?.trim() || "No notes"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {(order.totalAmount || order.totalPrice || 0).toLocaleString()} L.L.
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      ...getStatusBadgeStyle(order.status)
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{ padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                    >
                      <option value="NEW">NEW</option>
                      <option value="PREPARING">PREPARING</option>
                      <option value="READY">READY</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button
                      type="button"
                      className="orders-details-button"
                      onClick={() => toggleOrderDetails(order.id)}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                        borderRadius: "6px"
                      }}
                    >
                      {expandedOrders[order.id] ? "Hide Items" : "View Items"}
                    </button>
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
  {order.status === "COMPLETED" && (
    <button
      type="button"
      className="orders-archive-button"
      disabled={archivingId !== null}
      onClick={() => handleArchiveOrder(order.id)}
      style={{
        backgroundColor: "#397D9F",
        color: "white",
        padding: "8px 12px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
      }}
    >
      {archivingId === order.id ? "Archiving..." : "Archive"}
    </button>
  )}
</td>
                </tr>

                {expandedOrders[order.id] && (
                  <tr>
                    <td colSpan="11" style={{ backgroundColor: "#f9f9f9", padding: "15px", border: "1px solid #ddd" }}>
                      <strong>Order Items:</strong>
                      {orderDetails[order.id]?.items && orderDetails[order.id].items.length > 0 ? (
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
        </div>
      )}
    </div>
  );
}

export default OrdersDashboard;