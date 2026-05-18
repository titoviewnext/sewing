import { useQuery } from '@tanstack/react-query';
import { appointmentsApi, Appointment } from '../services/api';

const STATUS_COLORS: Record<Appointment['status'], string> = {
  SCHEDULED: '#3b82f6',
  CONFIRMED: '#8b5cf6',
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

export default function AppointmentsPage() {
  const { data, isLoading, isError } = useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: appointmentsApi.list,
  });

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
        📅 Appointments
      </h1>
      {isLoading && <p>Loading appointments…</p>}
      {isError && <p style={{ color: '#ef4444' }}>Failed to load appointments.</p>}
      {data && (
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Purpose', 'Customer', 'Scheduled At', 'Duration', 'Status', 'Notes'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8' }}>
                  No appointments yet.
                </td>
              </tr>
            )}
            {data.map((a) => (
              <tr key={a.id}>
                <td style={tdStyle}>{a.purpose}</td>
                <td style={tdStyle}>{a.customer?.name ?? a.customerId}</td>
                <td style={tdStyle}>{new Date(a.scheduledAt).toLocaleString()}</td>
                <td style={tdStyle}>{a.duration != null ? `${a.duration} min` : '—'}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      background: STATUS_COLORS[a.status],
                      color: '#fff',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {a.status}
                  </span>
                </td>
                <td style={tdStyle}>{a.notes ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
