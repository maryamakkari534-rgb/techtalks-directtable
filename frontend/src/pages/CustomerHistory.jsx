import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./CustomerHistory.css";

function CustomerHistory({ onAddToCart, setShowCheckout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const adminRoute = location.pathname.startsWith("/dashboard/");

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState({});
  const [reorderMessage, setReorderMessage] = useState("");

  const isAdmin = role === "ADMIN";

  // The server session is the source of identity; phone input alone is not.
  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      setCheckingLogin(true);
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include"
        });
        if (!active) return;
        if (!response.ok) {
          setRole(null);
          return;
        }

        const data = await response.json();
        if (!active) return;

        if (data.email === "admin@directtable.test") {
          setRole("ADMIN");
          setPhone("");
        } else if (typeof data.email === "string" && data.email.startsWith("customer:")) {
          setRole("CUSTOMER");
          setPhone(data.email.slice("customer:".length));
        } else {
          setRole(null);
        }
      } catch (error) {
        if (active) {
          console.error("Could not check session:", error);
          setRole(null);
        }
      } finally {
        if (active) setCheckingLogin(false);
      }
    };

    checkSession();
    return () => { active = false; };
  }, []);

  const loadHistory = useCallback(async (targetPhone) => {
    setLoading(true);
    setHistoryError("");
    setHasSearched(true);
    setOrders([]);
    setSelectedOrderDetails({});

    try {
      const response = await fetch(
        `/api/orders/history/${encodeURIComponent(targetPhone)}`,
        { credentials: "include" }
      );

      if (response.status === 401) {
        setRole(null);
        throw new Error("Session expired. Please login again.");
      }
      if (response.status === 403) {
        throw new Error("You do not have permission to view this history.");
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch history (HTTP ${response.status}).`);
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setHistoryError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Customer history loads automatically; admin searches manually.
  useEffect(() => {
    if (role === "CUSTOMER" && !adminRoute && phone) {
      loadHistory(phone);
    }
  }, [role, adminRoute, phone, loadHistory]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");

    const enteredPhone = phone.trim();
    if (!/^[0-9]{8}$/.test(enteredPhone)) {
      setLoginError("Phone number must contain 8 digits.");
      return;
    }

    try {
      const csrfResponse = await fetch("/api/auth/csrf", {
        credentials: "include"
      });
      if (!csrfResponse.ok) throw new Error("Failed to get CSRF token.");
      const csrfData = await csrfResponse.json();

      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-XSRF-TOKEN": csrfData.token
        },
        body: new URLSearchParams({
          email: `customer:${enteredPhone}`,
          password
        })
      });
      if (!response.ok) throw new Error("Invalid phone number or password.");

      const meResponse = await fetch("/api/auth/me", {
        credentials: "include"
      });
      if (!meResponse.ok) throw new Error("Could not verify the login session.");
      const me = await meResponse.json();
      if (me.email !== `customer:${enteredPhone}`) {
        throw new Error("Logged-in customer does not match this phone number.");
      }

      setPhone(enteredPhone);
      setPassword("");
      setRole("CUSTOMER");
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const targetPhone = phone.trim();
    if (!/^[0-9]{8}$/.test(targetPhone)) {
      setHistoryError("Phone number must contain 8 digits.");
      return;
    }
    loadHistory(targetPhone);
  };

  const handleReorder = async (orderId) => {
    setReorderMessage("");
    if (role !== "CUSTOMER") return;

    try {
      const response = await fetch(`/api/orders/${orderId}/reorder`, {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to reorder.");
      const data = await response.json();

      const unavailableItems = [];
      let availableCount = 0;

      (data.items || []).forEach((item) => {
        if (item.available) {
          onAddToCart?.({
            id: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            restaurantId: data.restaurantId
          });
          availableCount += 1;
        } else {
          unavailableItems.push(item.name);
        }
      });

      if (unavailableItems.length) {
        setReorderMessage(`Some items are unavailable: ${unavailableItems.join(", ")}`);
      } else {
        setReorderMessage("Your previous order has been added to the cart.");
      }

      if (availableCount) {
        setShowCheckout?.(true);
        navigate(`/restaurant/${data.restaurantId || 1}`);
      }
    } catch (error) {
      console.error(error);
      setReorderMessage(error.message);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/details`, {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to fetch order details.");
      const data = await response.json();
      setSelectedOrderDetails((prev) => ({ ...prev, [orderId]: data }));
    } catch (error) {
      console.error(error);
      setHistoryError(error.message);
    }
  };

  if (checkingLogin) {
    return (
      <div className="history-page">
        <div className="history-container"><p>Checking login...</p></div>
      </div>
    );
  }

  // Visiting an admin URL with a CUSTOMER session must not grant admin access.
  if (adminRoute && role !== "ADMIN") {
    return (
      <div className="history-page">
        <div className="history-container">
          <div className="history-search-card">
            <h2>Admin Login Required</h2>
            <p>Please sign in with an admin account to search customer history.</p>
            <Link to="/admin/login">Go to Admin Login</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!adminRoute && !role) {
    return (
      <div className="history-page">
        <div className="history-container">
          <div className="history-header">
            <div>
              <h1>My Orders</h1>
              <p>Login to view your order history.</p>
            </div>
          </div>
          <div className="history-search-card">
            <h3>Customer Login</h3>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label htmlFor="history-phone">Phone Number</label>
              <input
                id="history-phone"
                type="tel"
                placeholder="8-digit phone number"
                value={phone}
                maxLength={8}
                onChange={(event) => setPhone(event.target.value)}
                required
              />
              <label htmlFor="history-password">Password</label>
              <input
                id="history-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {loginError && <p style={{ color: "#b42332" }}>{loginError}</p>}
              <button type="submit" className="history-search-btn">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div>
            <h1>{isAdmin ? "Customer History" : "My Orders"}</h1>
            <p>{isAdmin
              ? "Search a customer's previous orders using their phone number."
              : "View your previous orders and reorder your favorite meals."}</p>
          </div>
        </div>

        <div className="history-search-card">
          {isAdmin ? (
            <form className="history-search-row" onSubmit={handleSearch}>
              <label htmlFor="search-customer-phone">Customer Phone Number</label>
              <input
                id="search-customer-phone"
                type="tel"
                placeholder="Enter 8-digit phone number"
                value={phone}
                maxLength={8}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setOrders([]);
                  setHasSearched(false);
                  setHistoryError("");
                  setSelectedOrderDetails({});
                }}
              />
              <button type="submit" className="history-search-btn">View History</button>
            </form>
          ) : (
            <>
              <label>Logged in as</label>
              <p>{phone}</p>
            </>
          )}
        </div>

        {loading && <div className="history-message">Loading orders...</div>}
        {historyError && <div className="history-message" style={{ color: "#b42332" }}>{historyError}</div>}
        {reorderMessage && <div className="history-message">{reorderMessage}</div>}

        {orders.length > 0 && (
          <div className="customer-info-card">
            <div>
              <span className="info-label">Customer</span>
              <strong>{orders[0].customerName}</strong>
            </div>
            <div>
              <span className="info-label">Phone</span>
              <strong>{orders[0].customerPhone}</strong>
            </div>
          </div>
        )}

        {!loading && !historyError && hasSearched && orders.length === 0 && (
          <div className="history-empty">
            <h3>No orders found</h3>
            <p>{isAdmin
              ? "No orders were found for this phone number."
              : "You haven't placed any orders yet."}</p>
          </div>
        )}

        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <span className="order-label">Order</span>
                  <h2>#{order.id}</h2>
                </div>
                <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-info-grid">
                <div>
                  <span className="info-label">Order Type</span>
                  <strong>{order.orderType}</strong>
                </div>
                <div>
                  <span className="info-label">Total</span>
                  <strong>{Number(order.totalAmount || 0).toLocaleString()} L.L.</strong>
                </div>
                <div>
                  <span className="info-label">Date</span>
                  <strong>{order.createdAt}</strong>
                </div>
              </div>

              <div className="order-actions">
                <button
                  type="button"
                  className="details-btn"
                  onClick={() => handleViewDetails(order.id)}
                >
                  View Details
                </button>
                {!isAdmin && (
                  <button
                    type="button"
                    className="reorder-btn"
                    onClick={() => handleReorder(order.id)}
                  >
                    Reorder
                  </button>
                )}
              </div>

              {selectedOrderDetails[order.id] && (
                <div className="order-details">
                  <h3>Order Details</h3>
                  <div className="details-items">
                    {(selectedOrderDetails[order.id].items || []).map((item, index) => (
                      <div className="detail-item" key={index}>
                        <div>
                          <strong>{item.name}</strong>
                          <span>Quantity: {item.quantity}</span>
                        </div>
                        <strong>{Number(item.price || 0).toLocaleString()} L.L.</strong>
                      </div>
                    ))}
                  </div>
                  <div className="details-notes">
                    <span>Notes</span>
                    <p>{selectedOrderDetails[order.id].notes || "-"}</p>
                  </div>
                  <div className="details-total">
                    <span>Total</span>
                    <strong>{Number(selectedOrderDetails[order.id].totalAmount || 0).toLocaleString()} L.L.</strong>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerHistory;
