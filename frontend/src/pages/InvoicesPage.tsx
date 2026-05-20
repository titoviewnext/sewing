import { useQuery } from '@tanstack/react-query';
import { invoicesApi, Invoice } from '../services/api';

const STATUS_COLORS: Record<Invoice['status'], string> = {
  DRAFT: '#6b7280',
  SENT: '#3b82f6',
  PAID: '#10b981',
  OVERDUE: '#ef4444',
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

export default function InvoicesPage() {
  const { data, isLoading, isError } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: invoicesApi.list,
  });

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
        🧾 Invoices
      </h1>
      {isLoading && <p>Loading invoices…</p>}
      {isError && <p style={{ color: '#ef4444' }}>Failed to load invoices.</p>}
      {data && (
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Customer', 'Order', 'Amount', 'Status', 'Due Date', 'Created'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8' }}>
                  No invoices yet.
                </td>
              </tr>
            )}
            {data.map((inv) => (
              <tr key={inv.id}>
                <td style={tdStyle}>{inv.customer?.name ?? inv.customerId}</td>
                <td style={tdStyle}>{inv.order?.description ?? '—'}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>${inv.amount.toFixed(2)}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      background: STATUS_COLORS[inv.status],
                      color: '#fff',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {inv.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : '—'}
                </td>
                <td style={tdStyle}>{new Date(inv.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
