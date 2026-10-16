
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const deliveryAreas = [
  { value: "TRIPOLI", label: "Tripoli Center" },
  { value: "MINA", label: "El Mina" },
  { value: "ABU_SAMRA", label: "Abu Samra" },
  { value: "QOBBEH", label: "Qobbeh" },
  { value: "DAM_W_FAREZ", label: "Dam w Farez" },
  { value: "TALL", label: "Al Tall" },
  { value: "ZAHRIYEH", label: "Zahriyeh" },
  { value: "BAB_EL_TABBANEH", label: "Bab El Tabbaneh" },
  { value: "BAHSAAS", label: "Bahsaas" }
];

function Checkout({
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    orderType: "DELIVERY",
    deliveryArea: "TRIPOLI",
    address: "",
    notes: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isDelivery = formData.orderType === "DELIVERY";

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.customerName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!/^[0-9]{8}$/.test(formData.customerPhone.trim())) {
      setErrorMessage("Phone number must contain 8 digits.");
      return;
    }

    if (isDelivery && !formData.address.trim()) {
      setErrorMessage("Please enter your delivery address.");
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    const selectedArea = deliveryAreas.find(
      (area) => area.value === formData.deliveryArea
    );

    // Save the selected area together with the address.
    // The current backend does not have a deliveryArea field.
    const fullAddress = isDelivery
      ? `${selectedArea?.label || "Tripoli"} - ${formData.address.trim()}`
      : "";

    const orderPayload = {
      restaurantId: Number(cartItems[0]?.restaurantId || 1),
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim(),
      orderType: formData.orderType,
      address: fullAddress,
      notes: formData.notes.trim(),
      items: cartItems.map((item) => ({
        menuItemId: item.id,
        quantity: Number(item.quantity || 1)
      }))
    };

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        throw new Error("Failed to place order. Please check your details.");
      }

      alert("Order placed successfully!");

      if (onClearCart) {
        onClearCart();
      }

      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <h2>Cart & Checkout</h2>
        <p>Your cart is currently empty.</p>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #BDE7FA",
    boxSizing: "border-box",
    fontSize: "14px"
  };

  return (
    <div
      style={{
        padding: "25px",
        maxWidth: "750px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        color: "#245B78"
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Cart & Checkout
      </h2>

      {/* Cart Items */}

      <div
        style={{
          background: "#FFFFFF",
          padding: "20px",
          border: "1px solid #BDE7FA",
          borderRadius: "14px",
          marginBottom: "25px",
          overflowX: "auto"
        }}
      >
        <h3>Your Selected Items</h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: "10px", textAlign: "left" }}>
                Item
              </th>
              <th style={{ padding: "10px" }}>Price</th>
              <th style={{ padding: "10px" }}>Qty</th>
              <th style={{ padding: "10px" }}>Subtotal</th>
              <th style={{ padding: "10px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {cartItems.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderTop: "1px solid #D4EBF7"
                }}
              >
                <td style={{ padding: "10px" }}>
                  {item.name}
                </td>

                <td style={{ padding: "10px" }}>
                  {Number(item.price || 0).toLocaleString()} L.L.
                </td>

                <td style={{ padding: "10px", whiteSpace: "nowrap" }}>
                  <button
                    type="button"
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      onUpdateQuantity?.(
                        item.id,
                        item.quantity - 1
                      )
                    }
                  >
                    −
                  </button>

                  <span style={{ margin: "0 10px" }}>
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity?.(
                        item.id,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </td>

                <td style={{ padding: "10px" }}>
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 1)
                  ).toLocaleString()} L.L.
                </td>

                <td style={{ padding: "10px" }}>
                  <button
                    type="button"
                    onClick={() => onRemoveItem?.(item.id)}
                    style={{
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{ textAlign: "right" }}>
          Total: {calculateTotal().toLocaleString()} L.L.
        </h3>
      </div>

      {/* Checkout Form */}

      <div
        style={{
          background: "#FFFFFF",
          padding: "25px",
          borderRadius: "14px",
          border: "1px solid #BDE7FA"
        }}
      >
        <h3>Order Details</h3>

        {errorMessage && (
          <p
            style={{
              color: "#b42332",
              background: "#fde8e8",
              padding: "12px",
              borderRadius: "8px"
            }}
          >
            {errorMessage}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          {/* Order Type */}

          <div>
            <label>Order Type *</label>

            <select
              name="orderType"
              value={formData.orderType}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="DELIVERY">Delivery</option>
              <option value="PICKUP">Pickup</option>
            </select>
          </div>

          {/* Customer Name */}

          <div>
            <label>Full Name *</label>

            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Phone Number */}

          <div>
            <label>Phone Number *</label>

            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              maxLength={8}
              placeholder="8 digits"
              required
              style={inputStyle}
            />
          </div>

          {/* Delivery Fields */}

          {isDelivery && (
            <>
              <div>
                <label>Delivery Area *</label>

                <select
                  name="deliveryArea"
                  value={formData.deliveryArea}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  {deliveryAreas.map((area) => (
                    <option
                      key={area.value}
                      value={area.value}
                    >
                      {area.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Address *</label>

                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, building, floor..."
                  required
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {/* Notes */}

          <div>
            <label>Notes (Optional)</label>

            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special instructions..."
              style={inputStyle}
            />
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: submitting ? "#AABBC5" : "#397D9F",
              color: "#FFFFFF",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: submitting ? "not-allowed" : "pointer"
            }}
          >
            {submitting
              ? "Placing Order..."
              : "Confirm & Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
