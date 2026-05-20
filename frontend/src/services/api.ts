import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// JWT interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Types ────────────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  description: string;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  dueDate?: string;
  price?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  customer?: { id: string; name: string };
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  costPerUnit?: number;
  supplier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  scheduledAt: string;
  duration?: number;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  purpose: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  customer?: { id: string; name: string };
}

export interface Invoice {
  id: string;
  customerId: string;
  orderId?: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
  amount: number;
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  customer?: { id: string; name: string };
  order?: { id: string; description: string };
}

// ── API functions ─────────────────────────────────────────────────────────────

export const customersApi = {
  list: () => apiClient.get<Customer[]>('/customers').then((r) => r.data),
  get: (id: string) => apiClient.get<Customer>(`/customers/${id}`).then((r) => r.data),
  create: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Customer>('/customers', data).then((r) => r.data),
  update: (id: string, data: Partial<Customer>) =>
    apiClient.put<Customer>(`/customers/${id}`, data).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/customers/${id}`),
};

export const ordersApi = {
  list: () => apiClient.get<Order[]>('/orders').then((r) => r.data),
  get: (id: string) => apiClient.get<Order>(`/orders/${id}`).then((r) => r.data),
  create: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'customer'>) =>
    apiClient.post<Order>('/orders', data).then((r) => r.data),
  update: (id: string, data: Partial<Order>) =>
    apiClient.put<Order>(`/orders/${id}`, data).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/orders/${id}`),
};

export const inventoryApi = {
  list: () => apiClient.get<InventoryItem[]>('/inventory').then((r) => r.data),
  get: (id: string) => apiClient.get<InventoryItem>(`/inventory/${id}`).then((r) => r.data),
  create: (data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<InventoryItem>('/inventory', data).then((r) => r.data),
  update: (id: string, data: Partial<InventoryItem>) =>
    apiClient.put<InventoryItem>(`/inventory/${id}`, data).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/inventory/${id}`),
};

export const appointmentsApi = {
  list: () => apiClient.get<Appointment[]>('/appointments').then((r) => r.data),
  get: (id: string) => apiClient.get<Appointment>(`/appointments/${id}`).then((r) => r.data),
  create: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'customer'>) =>
    apiClient.post<Appointment>('/appointments', data).then((r) => r.data),
  update: (id: string, data: Partial<Appointment>) =>
    apiClient.put<Appointment>(`/appointments/${id}`, data).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/appointments/${id}`),
};

export const invoicesApi = {
  list: () => apiClient.get<Invoice[]>('/invoices').then((r) => r.data),
  get: (id: string) => apiClient.get<Invoice>(`/invoices/${id}`).then((r) => r.data),
  create: (data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'customer' | 'order'>) =>
    apiClient.post<Invoice>('/invoices', data).then((r) => r.data),
  update: (id: string, data: Partial<Invoice>) =>
    apiClient.put<Invoice>(`/invoices/${id}`, data).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/invoices/${id}`),
};
