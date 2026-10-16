import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cartItems = [], onUpdateQuantity, onRemoveItem, onClearCart }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    address: "",
    deliveryArea: "BEIRUT",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // حساب المجموع الكلي
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 1),
      0
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.address.trim()) {
      setErrorMessage("Please fill in all required fields (Name, Phone, Address).");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const orderPayload = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      address: formData.address,
      deliveryArea: formData.deliveryArea,
      notes: formData.notes,
      totalAmount: calculateTotal(),
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to place order. Please try again.");
      }

      alert("Order placed successfully!");
      if (onClearCart) onClearCart();
      navigate("/");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2>Cart & Checkout</h2>
        <p style={{ color: "#666", fontSize: "16px" }}>Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>Cart & Checkout Management</h2>

      {/* Cart Items List with Quantity Controls */}
      <div style={{ marginBottom: "25px", border: "1px solid #ddd", borderRadius: "8px", padding: "15px", backgroundColor: "#fafafa" }}>
        <h3 style={{ marginTop: "0" }}>Your Selected Items</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
              <th style={{ padding: "8px" }}>Item</th>
              <th style={{ padding: "8px" }}>Price</th>
              <th style={{ padding: "8px", textAlign: "center" }}>Qty</th>
              <th style={{ padding: "8px" }}>Subtotal</th>
              <th style={{ padding: "8px", textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px", fontWeight: "bold" }}>{item.name}</td>
                <td style={{ padding: "8px" }}>{(item.price || 0).toLocaleString()} L.L.</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.quantity - 1)}
                    style={{ padding: "2px 6px", cursor: "pointer", marginRight: "5px" }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.quantity + 1)}
                    style={{ padding: "2px 6px", cursor: "pointer", marginLeft: "5px" }}
                  >
                    +
                  </button>
                </td>
                <td style={{ padding: "8px" }}>{((item.price || 0) * item.quantity).toLocaleString()} L.L.</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <button
                    type="button"
                    onClick={() => onRemoveItem && onRemoveItem(item.id)}
                    style={{ backgroundColor: "#dc3545", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "15px", textAlign: "right", fontWeight: "bold", fontSize: "18px" }}>
          Total: <span style={{ color: "#28a745" }}>{calculateTotal().toLocaleString()} L.L.</span>
        </div>
      </div>

      {/* Checkout Form */}
      {errorMessage && (
        <div style={{ padding: "10px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "4px", marginBottom: "15px" }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3>Delivery Details</h3>
        
        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Full Name *</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Phone Number *</label>
          <input
            type="text"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Delivery Area *</label>
          <select
            name="deliveryArea"
            value={formData.deliveryArea}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="BEIRUT">Beirut Central</option>
            <option value="HAZMIEH">Hazmieh & Surroundings</option>
            <option value="JABAL">Metn / Mount Lebanon</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Address *</label>
          <textarea
            name="address"
            rows="2"
            value={formData.address}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: "10px",
            backgroundColor: submitting ? "#6c757d" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          {submitting ? "Placing Order..." : "Confirm & Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;