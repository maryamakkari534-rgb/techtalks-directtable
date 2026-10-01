import React, { useState, useEffect } from 'react';

// نقل الكلمات المفتاحية للخارج لمنع إعادة إنشائها مع كل رندر وتصفير أي تحذيرات
const categoryKeywords = {
  'All': [],
  'Pasta': ['pasta', 'باستا'],
  'Crepe': ['crepe', 'كريب'],
  'Desserts': ['dessert', 'sweet', 'cake', 'waffle', 'chocolate', 'حلويات', 'كيك', 'وافل', 'شوكولا'],
  'Drinks': ['drink', 'beverage', 'juice', 'coffee', 'tea', 'water', 'مشروبات', 'عصير', 'قهوة', 'شاي', 'ماء']
};

export default function MenuList() {
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

  // فلترة الأصناف محلياً (DT-35)
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
    console.log('Added to cart:', item);
  };

  return (
    <div className="menu-container" style={{ padding: '20px' }}>
      <h2>Menu</h2>
      
      {/* أزرار التصنيفات (DT-35) */}
      <div className="category-tabs" style={{ marginBottom: '20px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              marginRight: '10px',
              padding: '8px 16px',
              backgroundColor: selectedCategory === cat ? '#007bff' : '#f0f0f0',
              color: selectedCategory === cat ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* بطاقات القائمة وعرض السعر والتوفر (DT-34) */}
      <div className="menu-grid" style={{ display: 'grid', gap: '15px' }}>
        {items.length === 0 ? (
          <p>No items available in this category.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="menu-card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="price" style={{ fontWeight: 'bold' }}>{item.price} L.L.</p>

              {item.available ? (
                <button 
                  onClick={() => addToCart(item)}
                  style={{ backgroundColor: '#28a745', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Add to Cart
                </button>
              ) : (
                <p className="unavailable-text" style={{ color: 'red', fontWeight: 'bold' }}>Unavailable</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}