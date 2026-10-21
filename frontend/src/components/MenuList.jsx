import React, { useState, useEffect } from 'react';
import "./MenuList.css";
// نقل الكلمات المفتاحية للخارج لمنع إعادة إنشائها مع كل رندر وتصفير أي تحذيرات
const categoryKeywords = {
  'All': [],
  'Pasta': ['pasta', 'باستا'],
  'Crepe': ['crepe', 'كريب'],
  'Desserts': ['dessert', 'sweet', 'cake', 'waffle', 'chocolate', 'حلويات', 'كيك', 'وافل', 'شوكولا'],
  'Drinks': ['drink', 'beverage', 'juice', 'coffee', 'tea', 'water', 'مشروبات', 'عصير', 'قهوة', 'شاي', 'ماء']
};

// لاحظي هنا: أعدنا onAddToCart لكي لا نخرب وظيفة السلة في المشروع
export default function MenuList({ onAddToCart }) {
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Pasta', 'Crepe', 'Desserts', 'Drinks'];

  // جلب أصناف القائمة من الباك إند
  useEffect(() => {
    fetch('/api/restaurants/1/menu')
      .then((res) => res.json())
      .then((data) => {
        setAllItems(data);
        setItems(data);
      })
      .catch((error) => console.error('Error fetching menu items:', error));
  }, []);

  // فلترة الأصناف محلياً
  useEffect(() => {
    if (selectedCategory === 'All') {
      setItems(allItems);
    } else {
      const keywords = categoryKeywords[selectedCategory] || [selectedCategory.toLowerCase()];
      const filtered = allItems.filter((item) => {
        const itemText = JSON.stringify(item).toLowerCase();
        return keywords.some((keyword) => itemText.includes(keyword));
      });
      setItems(filtered);
    }
  }, [selectedCategory, allItems]);

  const addToCart = (item) => {
    if (item.available) {
      // هنا استعدنا الكود الخاص بزميلك لربط السلة، مع الاحتفاظ بشرط توفر الصنف الخاص بكِ
      onAddToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      });
    }
  };

  return (
    <div className="dt-customer-menu">

      <div className="dt-menu-intro">
        <h2>Our Menu</h2>
      </div>

      {/* Categories */}
      <div className="dt-category-list">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`dt-category-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="dt-customer-grid">
        {items.length === 0 ? (
          <p className="dt-menu-feedback">
            No items available in this category.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="dt-customer-card">

              <div className="dt-card-top">
                <h3>{item.name}</h3>
                <p>{item.description}</p>

                {!item.available && (
                  <span className="dt-unavailable">
                    Not Available
                  </span>
                )}
              </div>

              <div className="dt-card-bottom">
                <span className="dt-customer-price">
                  {Number(item.price).toLocaleString()} L.L.
                </span>

                <button
                  type="button"
                  className="dt-add-cart-btn"
                  onClick={() => addToCart(item)}
                  disabled={!item.available}
                >
                  Add to Cart
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
