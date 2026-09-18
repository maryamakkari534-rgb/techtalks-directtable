import React, { useState } from "react";

const menuData = [
  {
    category: "Pasta",
    type: "sized",
    items: [
      {
        name: "باستا فاهيتا",
        sizes: {
          small: { id: 1, price: 250000 },
          medium: { id: 2, price: 350000 },
          large: { id: 3, price: 450000 },
        },
      },
      {
        name: "باستا سبيسيال",
        sizes: {
          small: { id: 4, price: 250000 },
          medium: { id: 5, price: 350000 },
          large: { id: 6, price: 450000 },
        },
      },
      {
        name: "باستا مكسيكانا",
        sizes: {
          small: { id: 7, price: 250000 },
          medium: { id: 8, price: 350000 },
          large: { id: 9, price: 450000 },
        },
      },
      {
        name: "باستا فور تشيز",
        sizes: {
          small: { id: 10, price: 250000 },
          medium: { id: 11, price: 350000 },
          large: { id: 12, price: 450000 },
        },
      },
      {
        name: "باستا كاري",
        sizes: {
          small: { id: 41, price: 250000 },
          medium: { id: 42, price: 350000 },
          large: { id: 43, price: 450000 },
        },
      },
      {
        name: "باستا باربيكيو",
        sizes: {
          small: { id: 44, price: 250000 },
          medium: { id: 45, price: 350000 },
          large: { id: 46, price: 450000 },
        },
      },
      {
        name: "باستا تورنيدو",
        sizes: {
          small: { id: 47, price: 250000 },
          medium: { id: 48, price: 350000 },
          large: { id: 49, price: 450000 },
        },
      },
      {
        name: "باستا تاكيز",
        sizes: {
          small: { id: 50, price: 250000 },
          medium: { id: 51, price: 350000 },
          large: { id: 52, price: 450000 },
        },
      },
      {
        name: "باستا نودلز",
        sizes: {
          small: { id: 53, price: 250000 },
          medium: { id: 54, price: 350000 },
          large: { id: 55, price: 450000 },
        },
      },
      {
        name: "باستا بيستو",
        sizes: {
          small: { id: 56, price: 250000 },
          medium: { id: 57, price: 350000 },
          large: { id: 58, price: 450000 },
        },
      },
    ],
  },

  {
    category: "Crepe & Waffle",
    type: "mixed",
    items: [
      {
        id: 13,
        name: "كريب شوكولا / وايت كريب",
        price: 200000,
      },
      {
        id: 14,
        name: "وافل وايت / دارك / شوكولا",
        price: 250000,
      },
      {
        id: 15,
        name: "كريب كيتكات / وافل كندر",
        price: 300000,
      },
      {
        id: 16,
        name: "نوتيلا كريب",
        price: 330000,
      },
      {
        id: 17,
        name: "كريب بانكيك / وافل لوتس",
        price: 350000,
      },
      {
        id: 18,
        name: "وافل بيستاشيو",
        price: 400000,
      },
      {
        id: 19,
        name: "كريب فواكه",
        price: 450000,
      },
      {
        id: 20,
        name: "وافل دبي / كريب دبي",
        price: 500000,
      },
      {
        id: 59,
        name: "كريب لوتس",
        price: 350000,
      },
      {
        id: 60,
        name: "كريب كندر",
        price: 350000,
      },
      {
        id: 61,
        name: "كريب ميتو",
        price: 350000,
      },
      {
        name: "كريب سادة",
        type: "sized",
        sizes: {
          small: { id: 62, price: 250000 },
          medium: { id: 63, price: 350000 },
          large: { id: 64, price: 450000 },
        },
      },
    ],
  },

  {
    category: "Crepe Add-ons",
    type: "addons",
    items: [
      { id: 21, name: "شوكولا", price: 30000 },
      { id: 22, name: "موز", price: 40000 },
      { id: 23, name: "فستق حلبي", price: 50000 },
      { id: 24, name: "أوريو", price: 50000 },
      { id: 25, name: "براوني", price: 50000 },
      { id: 65, name: "لوتس بسكويت", price: 60000 },
      { id: 66, name: "فريز", price: 100000 },
      { id: 67, name: "أناناس", price: 100000 },
      { id: 68, name: "كندر", price: 100000 },
      { id: 69, name: "كيتكات", price: 100000 },
      { id: 70, name: "تويكس", price: 100000 },
      { id: 71, name: "كريمه", price: 100000 },
    ],
  },

  {
    category: "Corn",
    type: "sized",
    items: [
      {
        name: "ذرة مكسيكانا",
        sizes: {
          small: { id: 26, price: 250000 },
          medium: { id: 27, price: 350000 },
          large: { id: 28, price: 450000 },
        },
      },
      {
        name: "ذرة فور تشيز",
        sizes: {
          small: { id: 72, price: 250000 },
          medium: { id: 73, price: 350000 },
          large: { id: 74, price: 450000 },
        },
      },
      {
        name: "ذرة باربيكيو",
        sizes: {
          small: { id: 75, price: 250000 },
          medium: { id: 76, price: 350000 },
          large: { id: 77, price: 450000 },
        },
      },
    ],
  },

  {
    category: "Cake & Desserts",
    type: "fixed",
    items: [
      { id: 29, name: "جلو", price: 50000 },
      { id: 30, name: "رز بحليب / كاستر", price: 100000 },
      { id: 31, name: "تشيز كيك أوريو", price: 150000 },
      { id: 32, name: "تشيز كيك / تيراميسو", price: 200000 },
      { id: 33, name: "سان سيباستيان", price: 300000 },
      { id: 87, name: "قالب كيك", price: 1800000 },
    ],
  },

  {
    category: "Beverages",
    type: "fixed",
    items: [
      { id: 34, name: "ماء صغير", price: 30000 },
      {
        id: 35,
        name: "بيبسي تنك / عصير زويا",
        price: 70000,
      },
      {
        id: 36,
        name: "عصير ليو / عصير فريز",
        price: 100000,
      },
      {
        id: 37,
        name: "عصير سموذي",
        price: 140000,
      },
    ],
  },
];

export default function MenuList({ onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState("Pasta");

  return (
    <div className="menu-container">

      <div className="category-tabs">
        {menuData.map((cat) => (
          <button
            key={cat.category}
            className={`tab-btn ${
              selectedCategory === cat.category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat.category)}
          >
            {cat.category}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {menuData
          .filter((category) => category.category === selectedCategory)
          .map((catGroup) => (
            <div
              key={catGroup.category}
              className="category-section"
            >
              <h2>{catGroup.category}</h2>

              {catGroup.type === "sized" && (
                <div className="items-list">

                  {catGroup.items.map((item) => (
                    <div
                      key={item.name}
                      className="menu-card"
                    >

                      <h3>{item.name}</h3>

                      <div className="size-options">

                        <button
                          onClick={() =>
                            onAddToCart({
                              id: item.sizes.small.id,
                              name: `${item.name} (Small)`,
                              price: item.sizes.small.price,
                            })
                          }
                        >
                          صغير:{" "}
                          {item.sizes.small.price.toLocaleString()} L.L.
                        </button>

                        <button
                          onClick={() =>
                            onAddToCart({
                              id: item.sizes.medium.id,
                              name: `${item.name} (Medium)`,
                              price: item.sizes.medium.price,
                            })
                          }
                        >
                          وسط:{" "}
                          {item.sizes.medium.price.toLocaleString()} L.L.
                        </button>

                        <button
                          onClick={() =>
                            onAddToCart({
                              id: item.sizes.large.id,
                              name: `${item.name} (Large)`,
                              price: item.sizes.large.price,
                            })
                          }
                        >
                          كبير:{" "}
                          {item.sizes.large.price.toLocaleString()} L.L.
                        </button>

                      </div>
                    </div>
                  ))}

                </div>
              )}

              {(catGroup.type === "fixed" ||
                catGroup.type === "mixed" ||
                catGroup.type === "addons") && (

                <div className="items-list">

                  {catGroup.items.map((item, index) => (
                    <div
                      key={item.id || `${item.name}-${index}`}
                      className="menu-card"
                    >

                      <h3>{item.name}</h3>

                      {item.price && (
                        <p className="price">
                          {item.price.toLocaleString()} L.L.
                        </p>
                      )}

                      {item.type === "sized" ? (

                        <div className="size-options">

                          <button
                            onClick={() =>
                              onAddToCart({
                                id: item.sizes.small.id,
                                name: `${item.name} (Small)`,
                                price: item.sizes.small.price,
                              })
                            }
                          >
                            صغير:{" "}
                            {item.sizes.small.price.toLocaleString()} L.L.
                          </button>

                          <button
                            onClick={() =>
                              onAddToCart({
                                id: item.sizes.medium.id,
                                name: `${item.name} (Medium)`,
                                price: item.sizes.medium.price,
                              })
                            }
                          >
                            وسط:{" "}
                            {item.sizes.medium.price.toLocaleString()} L.L.
                          </button>

                          <button
                            onClick={() =>
                              onAddToCart({
                                id: item.sizes.large.id,
                                name: `${item.name} (Large)`,
                                price: item.sizes.large.price,
                              })
                            }
                          >
                            كبير:{" "}
                            {item.sizes.large.price.toLocaleString()} L.L.
                          </button>

                        </div>

                      ) : (

                        <button
                          className="add-btn"
                          onClick={() =>
                            onAddToCart({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                            })
                          }
                        >
                          إضافة للسلة
                        </button>

                      )}

                    </div>
                  ))}

                </div>
              )}

            </div>
          ))}
      </div>
    </div>
  );
}