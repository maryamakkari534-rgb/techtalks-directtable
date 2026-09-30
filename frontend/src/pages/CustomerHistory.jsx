import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
            <button
               onClick={() => handleViewDetails(order.id)}
            >
               View Details
            </button>

            <button
                onClick={() => handleReorder(order.id)}
            >
                Reorder
            </button>
            {reorderMessage && (
  <p style={{ color: "green", marginTop: "10px" }}>
    {reorderMessage}
  </p>
)}
            {selectedOrderDetails[order.id] && (
  <div>

    <h4>Order Items:</h4>

    <ul>
      {selectedOrderDetails[order.id].items.map((item, index) => (
        <li key={index}>
          {item.name} x {item.quantity}
          {" - "}
          {item.price.toLocaleString()} L.L.
        </li>
        ))}
        </ul>

        <p>
            Notes: {selectedOrderDetails[order.id].notes || "-"}
        </p>

        </div>
        )}
            <hr />

          </div>
        ))
      )}

    </div>
  );
}

export default CustomerHistory;