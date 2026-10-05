import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerHistory.css";

function CustomerHistory({ onAddToCart, setShowCheckout }) {

  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState({});
  const [reorderMessage, setReorderMessage] = useState("");
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

        <label>Phone Number</label>

        <div className="history-search-row">

          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            className="history-search-btn"
            onClick={getHistory}
          >
            View History
          </button>

        </div>

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
          <p>Enter your phone number to view your previous orders.</p>
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