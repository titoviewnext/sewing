import { useQuery } from '@tanstack/react-query';
import { inventoryApi, InventoryItem } from '../services/api';

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

export default function InventoryPage() {
  const { data, isLoading, isError } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: inventoryApi.list,
  });

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>
        🧵 Inventory
      </h1>
      {isLoading && <p>Loading inventory…</p>}
      {isError && <p style={{ color: '#ef4444' }}>Failed to load inventory.</p>}
      {data && (
        <table style={tableStyle}>
          <thead>
            <tr>
              {['Name', 'Category', 'Quantity', 'Unit', 'Cost/Unit', 'Supplier', 'Updated'].map(
                (h) => (
                  <th key={h} style={thStyle}>{h}</th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8' }}>
                  No inventory items yet.
                </td>
              </tr>
            )}
            {data.map((item) => (
              <tr key={item.id}>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.category}</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{item.quantity}</td>
                <td style={tdStyle}>{item.unit}</td>
                <td style={tdStyle}>
                  {item.costPerUnit != null ? `$${item.costPerUnit.toFixed(2)}` : '—'}
                </td>
                <td style={tdStyle}>{item.supplier ?? '—'}</td>
                <td style={tdStyle}>{new Date(item.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
