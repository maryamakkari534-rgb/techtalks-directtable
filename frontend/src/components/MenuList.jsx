import React, { useState } from 'react';

const menuData = [
  {
    category: "Pasta",
    type: "sized",
    sizes: { small: 250000, medium: 350000, large: 450000 },
    items: [
      "باستا فاهيتا", "باستا سبيسيال", "باستا مكسيكانا", "باستا فور تشيز",
      "باستا كاري", "باستا باربيكيو", "باستا تورنيدو", "باستا تاكيز",
      "باستا نودلز", "بيستو", "بومي", "سجق", "بابريكا", "ريدز", "فوتوتشيني"
    ]
  },
  {
    category: "Crepe & Waffle",
    type: "mixed",
    items: [
      { name: "كريب شوكولا / وايت كريب", price: 200000 },
      { name: "وافل وايت / دارك / شوكولا", price: 250000 },
      { name: "كريب كيتكات / وافل كندر", price: 300000 },
      { name: "نوتيلا كريب", price: 330000 },
      { name: "كريب بانكيك / وافل لوتس / وافل أربع أنواع شوكولا", price: 350000 },
      { name: "وافل بيستاشيو", price: 400000 },
      { name: "كريب فواكه", price: 450000 },
      { name: "وافل دبي / كريب دبي", price: 500000 },
      { name: "كريب لوتس", price: 350000 },
      { name: "كريب كندر", price: 350000 },
      { name: "كريب ميتو", price: 350000 },
      { 
        name: "كريب سادة", 
        type: "sized", 
        sizes: { small: 250000, medium: 350000, large: 450000 } 
      }
    ]
  },
  {
    category: "Crepe Add-ons",
    type: "addons",
    items: [
      { name: "شوكولا", price: 30000 },
      { name: "موز", price: 40000 },
      { name: "فستق حلبي", price: 50000 },
      { name: "أوريو", price: 50000 },
      { name: "براوني", price: 50000 },
      { name: "نوتيلا", price: 50000 },
      { name: "لوتس بسكويت", price: 60000 },
      { name: "فريز", price: 100000 },
      { name: "أناناس", price: 100000 },
      { name: "كندر", price: 100000 },
      { name: "كيتكات", price: 100000 },
      { name: "تويكس", price: 100000 },
      { name: "كريمه", price: 100000 }
    ]
  },
  {
    category: "Corn",
    type: "sized",
    sizes: { small: 250000, medium: 350000, large: 450000 },
    items: [
      "ذرة مكسيكانا", "ذرة فور تشيز", "ذرة باربيكيو",
      "ذرة نودلز", "ذرة و فطر", "ذرة كاري", "ذرة تاكيس"
    ]
  },
  {
    category: "Cake & Desserts",
    type: "fixed",
    items: [
      { name: "جلو", price: 50000 },
      { name: "رز بحليب / كاستر", price: 100000 },
      { name: "تشيز كيك أوريو / كريم باتيسير فواكه", price: 150000 },
      { name: "تشيز كيك / بسكويت تشيز / تيراميسو", price: 200000 },
      { name: "سان سيباستيان", price: 300000 },
      { name: "قالب كيك", price: 1800000 }
    ]
  },
  {
    category: "Beverages",
    type: "fixed",
    items: [
      { name: "ماء صغير", price: 30000 },
      { name: "بيبسي تنك / عصير زويا", price: 70000 },
      { name: "عصير ليو / عصير فريز", price: 100000 },
      { name: "عصير سموذي", price: 140000 }
    ]
  }
];

export default function MenuList({ onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState("Pasta");

  return (
    <div className="menu-container">
      {/* الأقسام التفاعلية */}
      <div className="category-tabs">
        {menuData.map((cat) => (
          <button
            key={cat.category}
            className={`tab-btn ${selectedCategory === cat.category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.category)}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* عرض أصناف القسم المختار */}
      <div className="menu-grid">
        {menuData
          .filter((c) => c.category === selectedCategory)
          .map((catGroup) => (
            <div key={catGroup.category} className="category-section">
              <h2>{catGroup.category}</h2>

              {/* في حال الأطعمة ذات الأحجام مثل الباستا والذرة */}
              {catGroup.type === "sized" && (
                <div className="items-list">
                  {catGroup.items.map((itemName) => (
                    <div key={itemName} className="menu-card">
                      <h3>{itemName}</h3>
                      <div className="size-options">
                        <button onClick={() => onAddToCart({ name: `${itemName} (Small)`, price: catGroup.sizes.small })}>
                          صغير: {catGroup.sizes.small.toLocaleString()} L.L
                        </button>
                        <button onClick={() => onAddToCart({ name: `${itemName} (Medium)`, price: catGroup.sizes.medium })}>
                          وسط: {catGroup.sizes.medium.toLocaleString()} L.L
                        </button>
                        <button onClick={() => onAddToCart({ name: `${itemName} (Large)`, price: catGroup.sizes.large })}>
                          كبير: {catGroup.sizes.large.toLocaleString()} L.L
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* الأصناف العادية أو المختلطة */}
              {(catGroup.type === "fixed" || catGroup.type === "mixed" || catGroup.type === "addons") && (
                <div className="items-list">
                  {catGroup.items.map((item, idx) => (
                    <div key={idx} className="menu-card">
                      <h3>{item.name}</h3>
                      {item.price && (
                        <p className="price">{item.price.toLocaleString()} L.L</p>
                      )}
                      {item.type === "sized" ? (
                        <div className="size-options">
                          <button onClick={() => onAddToCart({ name: `${item.name} (Small)`, price: item.sizes.small })}>
                            صغير: {item.sizes.small.toLocaleString()} L.L
                          </button>
                          <button onClick={() => onAddToCart({ name: `${item.name} (Medium)`, price: item.sizes.medium })}>
                            وسط: {item.sizes.medium.toLocaleString()} L.L
                          </button>
                          <button onClick={() => onAddToCart({ name: `${item.name} (Large)`, price: item.sizes.large })}>
                            كبير: {item.sizes.large.toLocaleString()} L.L
                          </button>
                        </div>
                      ) : (
                        <button className="add-btn" onClick={() => onAddToCart(item)}>إضافة للسلة</button>
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