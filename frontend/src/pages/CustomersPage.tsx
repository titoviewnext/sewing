import { useQuery } from '@tanstack/react-query';
import { customersApi, Customer } from '../services/api';

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

export default function CustomersPage() {
  const { data, isLoading, isError } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: customersApi.list,
  });

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
        👤 Customers
      </h1>
      {isLoading && <p>Loading customers…</p>}
      {isError && <p style={{ color: '#ef4444' }}>Failed to load customers.</p>}
      {data && (
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Name', 'Email', 'Phone', 'Address', 'Created'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8' }}>
                  No customers yet.
                </td>
              </tr>
            )}
            {data.map((c) => (
              <tr key={c.id}>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.email ?? '—'}</td>
                <td style={tdStyle}>{c.phone ?? '—'}</td>
                <td style={tdStyle}>{c.address ?? '—'}</td>
                <td style={tdStyle}>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
