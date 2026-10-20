import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerHistory.css";

function CustomerHistory({ onAddToCart, setShowCheckout }) {

  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState({});
  const [reorderMessage, setReorderMessage] = useState("");
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
const [checkingLogin, setCheckingLogin] = useState(true);
const [password, setPassword] = useState("");
const [loginError, setLoginError] = useState("");

useEffect(() => {
  fetch("/api/auth/me", {
    credentials: "include"
  })
    .then(async (res) => {
      if (!res.ok) return null;
      return res.json();
    })
    .then((data) => {
      if (data?.email?.startsWith("customer:")) {
        setLoggedIn(true);
        setPhone(data.email.substring("customer:".length));
      }
    })
    .catch(console.error)
    .finally(() => setCheckingLogin(false));
}, []);

  const getHistory = () => {

    if (!phone) {
      alert("Please enter phone number");
      return;
    }

    setLoading(true);

    fetch(`/api/orders/history/${phone}`)
      .then((res) => {
  if (res.status === 401) {
    setLoggedIn(false);
    setOrders([]);
    setLoginError("Session expired. Please login again.");
    throw new Error("Session expired");
  }

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
  useEffect(() => {
  if (loggedIn && phone) {
    getHistory();
  }
}, [loggedIn, phone]);

const handleLogin = async (e) => {
  e.preventDefault();
  setLoginError("");

  if (!/^[0-9]{8}$/.test(phone.trim())) {
    setLoginError("Phone number must contain 8 digits.");
    return;
  }

  try {
    const csrfResponse = await fetch("/api/auth/csrf", {
      credentials: "include"
    });

    if (!csrfResponse.ok) {
      throw new Error("Failed to get CSRF token");
    }

    const csrfData = await csrfResponse.json();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-XSRF-TOKEN": csrfData.token
      },
      body: new URLSearchParams({
        email: `customer:${phone.trim()}`,
        password: password
      })
    });

    if (!response.ok) {
      throw new Error("Invalid phone number or password");
    }

    setLoggedIn(true);
    setPassword("");

  } catch (error) {
    setLoginError(error.message);
  }
};

const handleReorder = (orderId) => {

  setReorderMessage("");

  fetch(`/api/orders/${orderId}/reorder`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to reorder");
      }

      return res.json();
    })
    .then((data) => {

      let unavailableItems = [];

      data.items.forEach((item) => {

        if (item.available) {

          onAddToCart({
            id: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          });

        } else {

          unavailableItems.push(item.name);

        }

      });


      if (unavailableItems.length > 0) {

        setReorderMessage(
          `Some items are unavailable: ${unavailableItems.join(", ")}`
        );

      } else {

        setReorderMessage(
          "Your previous order has been added to your cart successfully."
        );
        alert("Your previous order has been added to your cart successfully.");

      }


      setShowCheckout(true);
      navigate("/restaurant/1");

    })
    .catch((err) => {

      console.error(err);
      setReorderMessage("Failed to reorder");

    });
};
const handleViewDetails = (orderId) => {

  fetch(`/api/orders/${orderId}/details`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch order details");
      }

      return res.json();
    })
    .then((data) => {

      setSelectedOrderDetails((prev) => ({
        ...prev,
        [orderId]: data,
      }));

    })
    .catch((err) => {
      console.error(err);
      alert("Failed to load order details");
    });
};

if (checkingLogin) {
  return (
    <div className="history-page">
      <div className="history-container">
        <p>Checking login...</p>
      </div>
    </div>
  );
}

if (!loggedIn) {
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

          <form onSubmit={handleLogin}>

            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="8-digit phone number"
              value={phone}
              maxLength={8}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {loginError && (
              <p style={{ color: "red" }}>
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="history-search-btn"
            >
              Login
            </button>

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
          <h1>My Orders</h1>
          <p>View your previous orders and reorder your favorite meals.</p>
        </div>
      </div>

      <div className="history-search-card">
  <label>Logged in as</label>
  <p>{phone}</p>
</div>

      {loading && (
        <div className="history-message">
          Loading orders...
        </div>
      )}

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

      {!loading && orders.length === 0 && (
  <div className="history-empty">
    <h3>No orders found</h3>
    <p>You haven't placed any orders yet.</p>
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

              <span
                className={`status-badge status-${order.status?.toLowerCase()}`}
              >
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
                <strong>
                  {(order.totalAmount || 0).toLocaleString()} L.L.
                </strong>
              </div>

              <div>
                <span className="info-label">Date</span>
                <strong>
                  {order.createdAt}
                </strong>
              </div>

            </div>

            <div className="order-actions">

              <button
                className="details-btn"
                onClick={() => handleViewDetails(order.id)}
              >
                View Details
              </button>

              <button
                className="reorder-btn"
                onClick={() => handleReorder(order.id)}
              >
                Reorder
              </button>

            </div>

            {selectedOrderDetails[order.id] && (

              <div className="order-details">

                <h3>Order Details</h3>

                <div className="details-items">

                  {selectedOrderDetails[order.id].items.map(
                    (item, index) => (

                      <div className="detail-item" key={index}>

                        <div>
                          <strong>{item.name}</strong>

                          <span>
                            Quantity: {item.quantity}
                          </span>
                        </div>

                        <strong>
                          {item.price.toLocaleString()} L.L.
                        </strong>

                      </div>

                    )
                  )}

                </div>

                <div className="details-notes">

                  <span>Notes</span>

                  <p>
                    {selectedOrderDetails[order.id].notes || "-"}
                  </p>

                </div>

                <div className="details-total">

                  <span>Total</span>

                  <strong>
                    {(selectedOrderDetails[order.id].totalAmount || 0)
                      .toLocaleString()}{" "}
                    L.L.
                  </strong>

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