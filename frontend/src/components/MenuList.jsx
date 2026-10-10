
import React, { useState, useEffect } from "react";
import "./MenuList.css";

const categoryKeywords = {
  All: [],
  Pasta: ["pasta", "باستا"],
  Crepe: ["crepe", "كريب"],
  Desserts: [
    "dessert", "sweet", "cake",
    "waffle", "chocolate",
    "حلويات", "كيك", "وافل", "شوكولا"
  ],
  Drinks: [
    "drink", "beverage", "juice",
    "coffee", "tea", "water",
    "مشروبات", "عصير", "قهوة",
    "شاي", "ماء"
  ]
};

const categories = [
  "All", "Pasta", "Crepe", "Desserts", "Drinks"
];

export default function MenuList({
  onAddToCart,
  restaurantId = 1
}) {
  const [allItems, setAllItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    fetch(`/api/restaurants/${restaurantId}/menu`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load menu");
        }
        return response.json();
      })
      .then((data) => {
        if (active) setAllItems(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [restaurantId]);

  const items = allItems.filter((item) => {
    if (selectedCategory === "All") return true;

    const keywords = categoryKeywords[selectedCategory] || [];

    const itemText = [
      item.name,
      item.description,
      item.category
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return keywords.some((keyword) =>
      itemText.includes(keyword)
    );
  });

  const addToCart = (item) => {
    if (!item.available) return;

    onAddToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
  };

  return (
    <main className="dt-customer-menu">

      <section className="dt-menu-intro">
        <span className="dt-menu-eyebrow">
          MADE WITH LOVE
        </span>

        <h2>Explore Our Menu</h2>

        <p>
          Discover your favorites, made just for you.
        </p>
      </section>

      <nav
        className="dt-category-list"
        aria-label="Menu categories"
      >
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={
              selectedCategory === category
                ? "dt-category-btn active"
                : "dt-category-btn"
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      {loading && (
        <p className="dt-menu-feedback">
          Loading menu...
        </p>
      )}

      {error && (
        <p className="dt-menu-feedback">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="dt-menu-feedback">
          No items available in this category.
        </p>
      )}

      {!loading && !error && (
        <div className="dt-customer-grid">
          {items.map((item) => (
            <article
              key={item.id}
              className="dt-customer-card"
            >
              <div className="dt-card-top">
                <h3>{item.name}</h3>

                <p>
                  {item.description || "Freshly prepared"}
                </p>
              </div>

              <div className="dt-card-bottom">
                <span className="dt-customer-price">
                  {Number(item.price).toLocaleString()} L.L.
                </span>

                {item.available ? (
                  <button
                    type="button"
                    className="dt-add-cart-btn"
                    onClick={() => addToCart(item)}
                  >
                    + Add to Cart
                  </button>
                ) : (
                  <span className="dt-unavailable">
                    Not Available
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

    </main>
  );
}
