
import React, { useState, useEffect } from "react";
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
  const [customerLoggedIn, setCustomerLoggedIn] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const checkCustomerLogin = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include"
        });

        if (!response.ok) return;
        const data = await response.json();

        if (!cancelled && data.email?.startsWith("customer:")) {
          const phone = data.email.substring("customer:".length);
          setCustomerLoggedIn(true);
          setFormData((prev) => ({ ...prev, customerPhone: phone }));
        }
      } catch (error) {
        if (!cancelled) setAuthError("Could not check login. Please try again.");
      } finally {
        if (!cancelled) setCheckingLogin(false);
      }
    };

    checkCustomerLogin();
    return () => { cancelled = true; };
  }, []);

  const getCsrfToken = async () => {
    const response = await fetch("/api/auth/csrf", {
      credentials: "include",
      cache: "no-store"
    });
    if (!response.ok) throw new Error("Could not prepare secure request.");
    const data = await response.json();
    if (!data.token) throw new Error("CSRF token was not provided.");
    return data.token;
  };

  const loginCustomer = async (phone, password) => {
    const csrfToken = await getCsrfToken();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-XSRF-TOKEN": csrfToken
      },
      body: new URLSearchParams({
        email: `customer:${phone}`,
        password
      })
    });

    if (!response.ok) {
      throw new Error("Invalid phone number or password.");
    }

    const meResponse = await fetch("/api/auth/me", { credentials: "include" });
    if (!meResponse.ok) throw new Error("Could not confirm customer login.");
    const me = await meResponse.json();
    if (me.email !== `customer:${phone}`) {
      throw new Error("Unexpected account. Please sign in again.");
    }

    setCustomerLoggedIn(true);
    setFormData((prev) => ({
      ...prev,
      customerPhone: phone,
      customerName: authMode === "signup" ? authName.trim() : prev.customerName
    }));
    setAuthPassword("");
    setConfirmPassword("");
    setAuthError("");
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    setAuthError("");

    const phone = authPhone.trim();
    if (!/^[0-9]{8}$/.test(phone)) {
      setAuthError("Phone number must contain 8 digits.");
      return;
    }
    if (authPassword.length < 8) {
      setAuthError("Password must contain at least 8 characters.");
      return;
    }
    if (authMode === "signup") {
      if (!authName.trim()) {
        setAuthError("Please enter your full name.");
        return;
      }
      if (authPassword !== confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }
    }

    setAuthenticating(true);
    try {
      if (authMode === "signup") {
        const csrfToken = await getCsrfToken();
        const signupResponse = await fetch("/api/customer/auth/signup", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken
          },
          body: JSON.stringify({
            name: authName.trim(),
            phone,
            password: authPassword
          })
        });

        if (signupResponse.status === 409) {
          throw new Error("Phone number is already registered. Please sign in.");
        }
        if (!signupResponse.ok) {
          throw new Error("Signup failed. Please check your information.");
        }
      }

      // After signup, sign in automatically using the new account.
      await loginCustomer(phone, authPassword);
    } catch (error) {
      setAuthError(error.message || "Authentication failed.");
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    setAuthError("");
    setAuthenticating(true);
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { "X-XSRF-TOKEN": csrfToken }
      });
      if (!response.ok) throw new Error("Logout failed.");

      setCustomerLoggedIn(false);
      setAuthPhone("");
      setAuthPassword("");
      setConfirmPassword("");
      setFormData((prev) => ({
        ...prev,
        customerName: "",
        customerPhone: ""
      }));
    } catch (error) {
      setAuthError(error.message || "Logout failed.");
    } finally {
      setAuthenticating(false);
    }
  };

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

    if (!customerLoggedIn) {
      setErrorMessage("Please sign in before placing an order.");
      return;
    }

    setSubmitting(true);
    try {
      // Request a new token after login because Spring Security may rotate it.
      const csrfToken = await getCsrfToken();
      const response = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken
        },
        body: JSON.stringify(orderPayload)
      });

      if (response.status === 401) {
        setCustomerLoggedIn(false);
        throw new Error("Session expired. Please log in again.");
      }
      if (!response.ok) {
        throw new Error("Failed to place order. Please check your details.");
      }

      alert("Order placed successfully!");
      onClearCart?.();
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Failed to place order.");
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

      {/* Customer authentication - the cart is visible even before login. */}
      {checkingLogin ? (
        <div style={{ background: "#FFFFFF", padding: "25px", borderRadius: "14px", border: "1px solid #BDE7FA" }}>
          Checking customer login...
        </div>
      ) : !customerLoggedIn ? (
        <div style={{ background: "#FFFFFF", padding: "25px", borderRadius: "14px", border: "1px solid #BDE7FA" }}>
          <h3>{authMode === "signup" ? "Create Customer Account" : "Customer Login"}</h3>
          <p style={{ fontSize: "14px" }}>
            {authMode === "signup"
              ? "First order? Create an account to track your orders."
              : "Log in to place your order and view your history."}
          </p>

          {authError && <p role="alert" style={{ color: "#b42332" }}>{authError}</p>}

          <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {authMode === "signup" && (
              <div>
                <label htmlFor="signup-name">Full Name *</label>
                <input
                  id="signup-name"
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  autoComplete="name"
                  required
                  style={inputStyle}
                />
              </div>
            )}
            <div>
              <label htmlFor="auth-phone">Phone Number *</label>
              <input
                id="auth-phone"
                type="tel"
                value={authPhone}
                onChange={(e) => setAuthPhone(e.target.value)}
                maxLength={8}
                inputMode="numeric"
                pattern="[0-9]{8}"
                autoComplete="tel"
                placeholder="8 digits"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="auth-password">Password *</label>
              <input
                id="auth-password"
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                minLength={8}
                autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                required
                style={inputStyle}
              />
            </div>
            {authMode === "signup" && (
              <div>
                <label htmlFor="confirm-password">Confirm Password *</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                  style={inputStyle}
                />
              </div>
            )}
            <button
              type="submit"
              disabled={authenticating}
              style={{ background: "#397D9F", color: "white", border: "none", padding: "14px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}
            >
              {authenticating ? "Please wait..." : authMode === "signup" ? "Sign Up & Continue" : "Login & Continue"}
            </button>
          </form>

          <p style={{ marginTop: "16px" }}>
            {authMode === "signup" ? "Already registered? " : "New customer? "}
            <button
              type="button"
              disabled={authenticating}
              onClick={() => {
                setAuthError("");
                setAuthPassword("");
                setConfirmPassword("");
                setAuthMode(authMode === "signup" ? "login" : "signup");
              }}
              style={{ background: "transparent", border: "none", color: "#245B78", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}
            >
              {authMode === "signup" ? "Login" : "Create an account"}
            </button>
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", gap: "12px" }}>
            <span>Logged in as: <strong>{formData.customerPhone}</strong></span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={authenticating || submitting}
              style={{ background: "transparent", border: "1px solid #BDE7FA", padding: "8px 14px", borderRadius: "8px", color: "#245B78", cursor: "pointer" }}
            >
              Logout
            </button>
          </div>
          {authError && <p role="alert" style={{ color: "#b42332" }}>{authError}</p>}

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
              readOnly
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
        </>
      )}
    </div>
  );
}

export default Checkout;
