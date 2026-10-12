import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    fetch('/api/restaurants/1/menu')
      .then((res) => res.json())
      .then((data) => {
        setAllItems(data);
        setItems(data);
      })
      .catch((error) => console.error('Error fetching menu items:', error));
  }, []);

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
      console.log('Added to cart:', item);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333', fontSize: '2rem', marginBottom: '20px' }}>Our Menu</h2>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedCategory === cat ? '#d63384' : '#f8f9fa',
              color: selectedCategory === cat ? '#fff' : '#495057',
              border: selectedCategory === cat ? 'none' : '1px solid #dee2e6',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              fontSize: '1rem',
              boxShadow: selectedCategory === cat ? '0 4px 6px rgba(214, 51, 132, 0.3)' : 'none'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {items.length === 0 ? (
          <p style={{ textAlign: 'center', width: '100%', color: '#6c757d' }}>No items available in this category.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} style={{ 
              backgroundColor: '#fff', 
              border: '1px solid #eaeaea', 
              borderRadius: '12px', 
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s',
              opacity: item.available ? 1 : 0.6 
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#212529', fontSize: '1.25rem' }}>{item.name}</h3>
                  {!item.available && (
                    <span style={{ backgroundColor: '#ffe5e5', color: '#dc3545', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      Not Available
                    </span>
                  )}
                </div>
                <p style={{ margin: '0 0 15px 0', color: '#6c757d', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {item.description}
                </p>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#198754', fontSize: '1.1rem' }}>
                  {item.price.toLocaleString()} L.L.
                </span>

                <button 
                  onClick={() => addToCart(item)}
                  disabled={!item.available}
                  style={{ 
                    backgroundColor: item.available ? '#198754' : '#e9ecef', 
                    color: item.available ? '#fff' : '#6c757d', 
                    padding: '8px 16px', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: item.available ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                    boxShadow: item.available ? '0 2px 4px rgba(25, 135, 84, 0.2)' : 'none'
                  }}
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