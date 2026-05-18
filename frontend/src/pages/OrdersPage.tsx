import { useQuery } from '@tanstack/react-query';
import { ordersApi, Order } from '../services/api';

const STATUS_COLORS: Record<Order['status'], string> = {
  NEW: '#3b82f6',
  IN_PROGRESS: '#f59e0b',
  COMPLETED: '#10b981',
  CANCELLED: '#ef4444',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff',
  borderRadius: '0.5rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
};

const thStyle: React.CSSProperties = {
  background: '#1e293b',
  color: '#f8fafc',
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontSize: '0.85rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderBottom: '1px solid #e2e8f0',
  fontSize: '0.9rem',
};

export default function OrdersPage() {
  const { data, isLoading, isError } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: ordersApi.list,
  });

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
        📋 Orders
      </h1>
      {isLoading && <p>Loading orders…</p>}
      {isError && <p style={{ color: '#ef4444' }}>Failed to load orders.</p>}
      {data && (
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Description', 'Customer', 'Status', 'Due Date', 'Price', 'Created'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8' }}>
                  No orders yet.
                </td>
              </tr>
            )}
            {data.map((o) => (
              <tr key={o.id}>
                <td style={tdStyle}>{o.description}</td>
                <td style={tdStyle}>{o.customer?.name ?? o.customerId}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      background: STATUS_COLORS[o.status],
                      color: '#fff',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {o.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  {o.dueDate ? new Date(o.dueDate).toLocaleDateString() : '—'}
                </td>
                <td style={tdStyle}>{o.price != null ? `$${o.price.toFixed(2)}` : '—'}</td>
                <td style={tdStyle}>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
