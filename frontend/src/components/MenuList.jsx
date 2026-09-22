import React, { useState, useEffect } from 'react';

function MenuList({ onAddToCart, restaurantId }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // جلب القائمة ديناميكياً من الـ Backend باستخدام الـ ID الحقيقي
    fetch(`/api/restaurants/${restaurantId}/menu`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('فشل في جلب قائمة الطعام من الخادم');
        }
        return response.json();
      })
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [restaurantId]);

  if (loading) return <div>جاري تحميل القائمة...</div>;
  if (error) return <div style={{ color: 'red' }}>خطأ: {error}</div>;

  return (
    <div className="menu-list">
      <h2>قائمة الطعام</h2>
      {menuItems.map((item) => (
        <div key={item.id} className="menu-item" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{item.name}</h3>
          <p>السعر: {item.price} ليرة</p>
          <button 
            disabled={!item.available}
            onClick={() => onAddToCart(item)}
          >
            {item.available ? 'إضافة للسلة' : 'غير متوفر'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default MenuList;