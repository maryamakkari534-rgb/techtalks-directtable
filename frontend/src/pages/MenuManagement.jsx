
import React, { useState, useEffect } from "react";
import "./MenuManagement.css";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  available: true,
};

function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyItemId, setBusyItemId] = useState(null);

  const restaurantId = 1;
  const apiUrl = `/api/restaurants/${restaurantId}/menu`;

  // Load menu items
  const fetchMenuItems = async () => {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to load menu items");
    }

    const data = await response.json();
    setMenuItems(data);
  };

  useEffect(() => {
    fetchMenuItems()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Read backend errors
  const getErrorMessage = async (response) => {
    const data = await response.json().catch(() => null);

    return (
      data?.message ||
      data?.detail ||
      data?.error ||
      `Request failed (${response.status})`
    );
  };

  // Search
  const filteredItems = menuItems.filter((item) => {
    const query = searchQuery.toLowerCase().trim();

    return (
      (item.name || "").toLowerCase().includes(query) ||
      (item.description || "").toLowerCase().includes(query) ||
      (item.category || "").toLowerCase().includes(query)
    );
  });

  // Open Add Form
  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setError("");
    setMessage("");
    setShowForm(true);
  };

  // Open Edit Form
  const handleEditClick = (item) => {
    setEditingId(item.id);

    setFormData({
      name: item.name || "",
      description: item.description || "",
      price: item.price ?? "",
      category: item.category || "",
      available: item.available === true,
    });

    setError("");
    setMessage("");
    setShowForm(true);
  };

  // Close Form
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...emptyForm });
    setError("");
  };

  // Update Form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add or Edit Menu Item
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category.trim(),
        available: formData.available,
      };

      if (
        !payload.name ||
        !payload.category ||
        !Number.isFinite(payload.price) ||
        payload.price <= 0
      ) {
        throw new Error("Please enter valid item information.");
      }

      const isEditing = editingId !== null;

      const url = isEditing
        ? `${apiUrl}/${editingId}`
        : apiUrl;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await fetchMenuItems();

      setShowForm(false);
      setEditingId(null);
      setFormData({ ...emptyForm });

      setMessage(
        isEditing
          ? "Menu item updated successfully!"
          : "Menu item added successfully!"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Change Availability
  const handleAvailabilityChange = async (item) => {
    setBusyItemId(item.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${apiUrl}/${item.id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            available: !item.available,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await fetchMenuItems();

      setMessage("Item availability updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyItemId(null);
    }
  };

  // Soft Delete
  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${item.name}" from the menu?`
    );

    if (!confirmed) return;

    setBusyItemId(item.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${apiUrl}/${item.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      await fetchMenuItems();

      setMessage("Menu item removed successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyItemId(null);
    }
  };

  return (
    <main className="menu-management">

      {/* Header */}
      <header className="menu-header">
        <h1>Restaurant Menu Management</h1>
        <p>
          Manage your restaurant menu items,
          prices, and availability.
        </p>
      </header>

      <section className="menu-content">

        <h2>Menu Items</h2>

        {/* Search and Add */}
        <div className="menu-toolbar">

          <input
            type="search"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="menu-search-input"
          />

          <button
            type="button"
            className="menu-add-button"
            onClick={handleAddClick}
          >
            + Add New Item
          </button>

        </div>

        {/* Messages */}
        {message && (
          <p className="menu-success" role="status">
            {message}
          </p>
        )}

        {error && (
          <p className="menu-error" role="alert">
            {error}
          </p>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <form
            className="menu-form"
            onSubmit={handleSubmit}
          >
            <h3>
              {editingId !== null
                ? "Edit Menu Item"
                : "Add New Menu Item"}
            </h3>

            <div className="menu-form-grid">

              <label className="menu-field">
                Item Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                  required
                />
              </label>

              <label className="menu-field">
                Price (L.L.)
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  placeholder="Enter price"
                  required
                />
              </label>

              <label className="menu-field">
                Category
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Example: Desserts"
                  required
                />
              </label>

              <label className="menu-field">
                Description
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  rows="3"
                />
              </label>

            </div>

            <label className="menu-checkbox">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleInputChange}
              />
              Available
            </label>

            <div className="menu-form-actions">

              <button
                type="submit"
                className="menu-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Save Changes"
                  : "Add Item"}
              </button>

              <button
                type="button"
                className="menu-cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

            </div>

          </form>
        )}

        {/* Loading */}
        {loading && (
          <p className="menu-message">
            Loading menu items...
          </p>
        )}

        {/* Empty State */}
        {!loading && !error && menuItems.length === 0 && (
          <p className="menu-message">
            No menu items found.
          </p>
        )}

        {!loading &&
          menuItems.length > 0 &&
          filteredItems.length === 0 && (
            <p className="menu-message">
              No items match your search.
            </p>
          )}

        {/* Menu Cards */}
        {!loading && (
          <div className="menu-items-list">

            {filteredItems.map((item) => (
              <article
                className="menu-item-card"
                key={item.id}
              >

                <h3>{item.name}</h3>

                <p className="menu-item-description">
                  {item.description || "No description"}
                </p>

                <p className="menu-item-price">
                  {Number(item.price).toLocaleString()} L.L.
                </p>

                <p className="menu-item-category">
                  Category: {item.category || "Uncategorized"}
                </p>

                <span
                  className={
                    item.available
                      ? "menu-status available"
                      : "menu-status unavailable"
                  }
                >
                  {item.available
                    ? "Available"
                    : "Not Available"}
                </span>

                {/* Actions */}
                <div className="menu-card-actions">

                  <button
                    type="button"
                    className="menu-edit-button"
                    disabled={busyItemId === item.id}
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="menu-delete-button"
                    disabled={busyItemId === item.id}
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>

                </div>

                <button
                  type="button"
                  className="menu-availability-button"
                  disabled={busyItemId === item.id}
                  onClick={() => handleAvailabilityChange(item)}
                >
                  {busyItemId === item.id
                    ? "Updating..."
                    : item.available
                    ? "Mark as Not Available"
                    : "Mark as Available"}
                </button>

              </article>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}

export default MenuManagement;
