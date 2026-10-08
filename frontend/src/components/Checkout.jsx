import React, { useState } from "react";
import { useParams } from "react-router-dom";

function Checkout({ cartItems, onOrderSuccess }) {
  const { id } = useParams();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState("PICKUP");

  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");

  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delivery areas
  const deliveryAreas = {
    Tripoli: [
      "Mina",
      "Qobbeh",
      "Abi Samra",
      "Zahriyeh",
      "Tebbaneh",
    ],
    "Al-Mina": [
      "Main Mina",
      "Corniche",
      "Port Area",
    ],
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handleOrderTypeChange = (e) => {
    const type = e.target.value;

    setOrderType(type);

    // Clear delivery information when Pickup is selected
    if (type === "PICKUP") {
      setCity("");
      setArea("");
      setAddress("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your order list is empty!");
      return;
    }

    // Delivery validation
    if (orderType === "DELIVERY") {
      if (!city) {
        alert("Please select a city.");
        return;
      }

      if (!area) {
        alert("Please select a delivery area.");
        return;
      }

      if (!address.trim()) {
        alert("Please enter your additional address.");
        return;
      }
    }

    setSubmitting(true);

    // Combine delivery information into the existing address field
    const fullAddress =
      orderType === "DELIVERY"
        ? `${city} - ${area} - ${address}`
        : "";

    const orderData = {
      restaurantId: Number(id),
      customerName,
      customerPhone,
      orderType,
      address: fullAddress,
      notes,

      items: cartItems.map((item) => ({
        menuItemId: item.id || item.menuItemId,
        quantity: item.quantity || 1,
      })),
    };

    fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((message) => {
            throw new Error(message || "Failed to place order");
          });
        }

        return res.text();
      })
      .then(() => {
        alert("Order placed successfully!");
        setSubmitting(false);

        if (onOrderSuccess) {
          onOrderSuccess();
        }
      })
      .catch((err) => {
        console.error("Error placing order:", err);
        alert("Error placing order: " + err.message);
        setSubmitting(false);
      });
  };

  return (
    <div
      className="checkout-page"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <div
        className="checkout-card"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          Checkout
        </h2>

        {/* Order Summary */}
        <div style={{ marginBottom: "25px" }}>
          <h3>Your Order</h3>

          {cartItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                marginBottom: "8px",
                backgroundColor: "#f7f7f7",
                borderRadius: "10px",
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  Quantity: {item.quantity || 1}
                </div>
              </div>

              <strong>
                {(
                  item.price * (item.quantity || 1)
                ).toLocaleString()}{" "}
                L.L.
              </strong>
            </div>
          ))}

          <div
            style={{
              textAlign: "right",
              fontSize: "18px",
              fontWeight: "bold",
              marginTop: "15px",
            }}
          >
            Total: {totalAmount.toLocaleString()} L.L.
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Customer Information */}
          <div style={{ marginBottom: "20px" }}>
            <h3>Your Information</h3>

            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Order Type */}
          <div style={{ marginBottom: "20px" }}>
            <h3>Order Type</h3>

            <select
              value={orderType}
              onChange={handleOrderTypeChange}
              style={inputStyle}
            >
              <option value="PICKUP">Pickup</option>
              <option value="DELIVERY">Delivery</option>
            </select>
          </div>

          {/* Delivery Information */}
          {orderType === "DELIVERY" && (
            <div
              style={{
                marginBottom: "20px",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
              }}
            >
              <h3>Delivery Information</h3>

              <label style={labelStyle}>City</label>

              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setArea("");
                }}
                required
                style={inputStyle}
              >
                <option value="">Select City</option>

                {Object.keys(deliveryAreas).map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>

              <label style={labelStyle}>Area</label>

              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                disabled={!city}
                style={inputStyle}
              >
                <option value="">
                  {city ? "Select Area" : "Select City First"}
                </option>

                {city &&
                  deliveryAreas[city].map((areaName) => (
                    <option key={areaName} value={areaName}>
                      {areaName}
                    </option>
                  ))}
              </select>

              <label style={labelStyle}>
                Additional Address
              </label>

              <input
                type="text"
                placeholder="Building, street, landmark..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          )}

          {/* Notes */}
          <textarea
            placeholder="Notes / Special Instructions"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              ...inputStyle,
              minHeight: "100px",
              resize: "vertical",
            }}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "15px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "#111827",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Submitting..." : "Place Order"}
          </button>

        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontWeight: "bold",
  fontSize: "14px",
};

export default Checkout;