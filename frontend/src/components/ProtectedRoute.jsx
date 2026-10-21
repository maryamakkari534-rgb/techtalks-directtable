import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // 1. طلب التأكد من الجلسة مع إرسال الكوكيز (credentials: "include")
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 200) {
          const data = await response.json();

          // 2. فحص الحساب للتأكد أنه Admin وليس Customer (بفحص الـ Role والإيميل)
          const isRoleAdmin = data.role === 'ROLE_ADMIN' || data.role === 'ADMIN';
          const isAdminEmail = data.email && (data.email === 'admin@directtable.test' || data.email.includes('admin'));

          if (isRoleAdmin || isAdminEmail) {
            setIsAuthorizedAdmin(true);
          } else {
            setIsAuthorizedAdmin(false);
          }
        } else {
          // إذا رجع 401 أو أي رمز آخر يتم الرفض
          setIsAuthorizedAdmin(false);
        }
      } catch (error) {
        console.error('Error verifying admin authentication:', error);
        setIsAuthorizedAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
        <h3>Checking authentication...</h3>
      </div>
    );
  }

  // إذا رجع 401 أو لم يكن الحساب Admin -> التوجيه فوراً لصفحة Admin Login
  if (!isAuthorizedAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}