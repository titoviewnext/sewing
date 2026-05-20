import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import InventoryPage from './pages/InventoryPage';
import AppointmentsPage from './pages/AppointmentsPage';
import InvoicesPage from './pages/InvoicesPage';

const navStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  padding: '1rem 2rem',
  background: '#1e293b',
  alignItems: 'center',
};

const linkStyle: React.CSSProperties = {
  color: '#94a3b8',
  textDecoration: 'none',
  padding: '0.4rem 0.8rem',
  borderRadius: '0.375rem',
  fontSize: '0.9rem',
};

const activeLinkStyle: React.CSSProperties = {
  ...linkStyle,
  color: '#f8fafc',
  background: '#334155',
};

const brandStyle: React.CSSProperties = {
  color: '#f8fafc',
  fontWeight: 700,
  fontSize: '1.2rem',
  marginRight: '1rem',
};

export default function App() {
  return (
    <BrowserRouter>
      <nav style={navStyle}>
        <span style={brandStyle}>✂️ Sewing</span>
        {[
          { to: '/customers', label: 'Customers' },
          { to: '/orders', label: 'Orders' },
          { to: '/inventory', label: 'Inventory' },
          { to: '/appointments', label: 'Appointments' },
          { to: '/invoices', label: 'Invoices' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => (isActive ? activeLinkStyle : linkStyle)}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<CustomersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
