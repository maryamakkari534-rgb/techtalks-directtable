import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1. جلب CSRF Token من /api/auth/csrf
      const csrfResponse = await fetch('/api/auth/csrf', {
        method: 'GET',
        credentials: 'include',
      });

      let token = '';
      let headerName = 'X-CSRF-TOKEN';

      if (csrfResponse.ok) {
        const csrfData = await csrfResponse.json();
        token = csrfData.token || csrfData.value || '';
        if (csrfData.headerName) {
          headerName = csrfData.headerName;
        }
      }

      // 2. إرسال POST /api/auth/logout مع الـ Token و credentials: "include"
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers[headerName] = token;
        headers['X-CSRF-TOKEN'] = token;
      }

      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: headers,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // 3. توجيه المستخدم لصفحة Admin Login بعد الخروج
      navigate('/admin/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      Logout
    </button>
  );
}